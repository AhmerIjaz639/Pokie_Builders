import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { verifyPassword } from './server/crypto.js';
import { processTranscriptWithAI } from './server/ai.js';
import type { User } from './src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Auth helper middleware to identify user from session
function getAuthenticatedUser(req: Request): User | null {
  const tokenFromCookie = req.cookies?.['novaworks_session'];
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) return null;
  return db.getSessionUser(token);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  if (user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Unauthorized access. Only administrators can perform this action.',
    });
  }
  (req as any).user = user;
  next();
}

// ----------------- AUTH ENDPOINTS -----------------

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = db.createSession(user.id);
  const safeUser = db.sanitizeUser(user);

  res.cookie('novaworks_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    message: 'Login successful',
    user: safeUser,
    token,
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.cookies?.['novaworks_session'] || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    db.removeSession(token);
  }
  res.clearCookie('novaworks_session');
  return res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user });
});

// ----------------- USERS & DIRECTORY -----------------

// GET /api/users/team (read-only team directory)
app.get('/api/users/team', (_req: Request, res: Response) => {
  const team = db.getTeamDirectory();
  return res.json({ team });
});

// ----------------- PROJECTS -----------------

// GET /api/projects (role-filtered projects)
app.get('/api/projects', requireAuth, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const projects = db.getProjectsForUser(user);
  return res.json({ projects });
});

// GET /api/projects/:id (role-checked project detail)
app.get('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const projectId = req.params.id;

  const project = db.getProjectByIdForUser(user, projectId);
  if (!project) {
    return res.status(403).json({
      error: 'Access denied: You do not have permission to view this project or it does not exist.',
    });
  }

  return res.json({ project });
});

// GET /api/projects/:id/tasks (role-checked tasks in a project)
app.get('/api/projects/:id/tasks', requireAuth, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const projectId = req.params.id;

  const tasks = db.getTasksForProject(user, projectId);
  if (tasks === null) {
    return res.status(403).json({
      error: 'Access denied: You do not have permission to view tasks for this project.',
    });
  }

  return res.json({ tasks });
});

// ----------------- TASKS -----------------

// GET /api/tasks/my (tasks assigned to current user)
app.get('/api/tasks/my', requireAuth, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const tasks = db.getMyTasks(user);
  return res.json({ tasks });
});

// ----------------- TRANSCRIPT AI (ADMIN ONLY) -----------------

// POST /api/transcript/create
app.post('/api/transcript/create', requireAdmin, async (req: Request, res: Response) => {
  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Empty transcript. Please provide a meeting transcript to process.',
    });
  }

  try {
    const teamDirectory = db.getTeamDirectory();
    const result = await processTranscriptWithAI(transcript, teamDirectory);

    if (!result.valid || result.errors.length > 0) {
      return res.status(422).json({
        success: false,
        error: 'Transcript validation failed.',
        validationErrors: result.errors,
      });
    }

    // Atomic transaction save (All-or-nothing save FR-010)
    const saved = db.saveProjectsAndTasksTransaction(result.projects, result.tasks);

    return res.status(201).json({
      success: true,
      message: `Successfully created ${saved.projects.length} projects and ${saved.tasks.length} tasks from transcript.`,
      projectsCount: saved.projects.length,
      tasksCount: saved.tasks.length,
      projects: saved.projects,
      tasks: saved.tasks,
    });
  } catch (err: unknown) {
    console.error('Error during transcript processing:', err);
    const msg = err instanceof Error ? err.message : 'Unknown server error';
    return res.status(500).json({
      success: false,
      error: `Failed to process transcript: ${msg}`,
    });
  }
});

// ----------------- SEED & DATABASE MANAGEMENT -----------------

// POST /api/seed
app.post('/api/seed', (_req: Request, res: Response) => {
  const result = db.seedDemoUsers();
  return res.json({
    message: 'Seeder executed successfully. Demo accounts are ready.',
    ...result,
  });
});

// POST /api/db/reset
app.post('/api/db/reset', requireAuth, (req: Request, res: Response) => {
  const user: User = (req as any).user;
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can reset project data.' });
  }
  const { clearProjectsOnly } = req.body;
  db.resetDatabase(Boolean(clearProjectsOnly));
  return res.json({
    message: clearProjectsOnly
      ? 'Projects and tasks cleared. Demo accounts preserved.'
      : 'Database reset to initial demo state.',
  });
});

// ----------------- VITE & STATIC HANDLING -----------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NovaWorks CRM server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
