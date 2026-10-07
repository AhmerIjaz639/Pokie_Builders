import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getInitialDemoUsers, SUPPLIED_TEN_ACCOUNTS, DEMO_PASSWORD } from './seedData.js';
import { hashPassword } from './crypto.js';
import type { User, UserWithCredentials, Project, Task, ProjectWithDetails, TaskWithAssignee } from '../src/types/index.js';

interface DatabaseSchema {
  users: UserWithCredentials[];
  projects: Project[];
  tasks: Task[];
  sessions: Record<string, { userId: string; createdAt: number }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'novaworks.json');

class Database {
  private data: DatabaseSchema = {
    users: [],
    projects: [],
    tasks: [],
    sessions: {},
  };
  private isLoaded = false;

  constructor() {
    this.ensureLoaded();
  }

  private ensureLoaded() {
    if (this.isLoaded) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        // Initialize with default demo users
        this.data = {
          users: getInitialDemoUsers(),
          projects: [],
          tasks: [],
          sessions: {},
        };
        this.persist();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error loading database file:', err);
      // Fallback
      this.data = {
        users: getInitialDemoUsers(),
        projects: [],
        tasks: [],
        sessions: {},
      };
      this.persist();
      this.isLoaded = true;
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database to file:', err);
    }
  }

  public seedDemoUsers(): { inserted: number; updated: number; total: number } {
    this.ensureLoaded();
    let inserted = 0;
    let updated = 0;

    for (const def of SUPPLIED_TEN_ACCOUNTS) {
      const existingIdx = this.data.users.findIndex((u) => u.email.toLowerCase() === def.email.toLowerCase());
      if (existingIdx === -1) {
        const { salt, hash } = hashPassword(DEMO_PASSWORD);
        this.data.users.push({
          ...def,
          passwordSalt: salt,
          passwordHash: hash,
        });
        inserted++;
      } else {
        // Update profile while preserving or updating id and role
        this.data.users[existingIdx].name = def.name;
        this.data.users[existingIdx].role = def.role;
        this.data.users[existingIdx].specialization = def.specialization;
        this.data.users[existingIdx].skills = def.skills;
        updated++;
      }
    }

    this.persist();
    return { inserted, updated, total: this.data.users.length };
  }

  public resetDatabase(clearProjectsAndTasksOnly: boolean = false): void {
    this.ensureLoaded();
    if (clearProjectsAndTasksOnly) {
      this.data.projects = [];
      this.data.tasks = [];
    } else {
      this.data.projects = [];
      this.data.tasks = [];
      this.data.sessions = {};
      this.data.users = getInitialDemoUsers();
    }
    this.persist();
  }

  // --- Auth & Sessions ---
  public findUserByEmail(email: string): UserWithCredentials | undefined {
    this.ensureLoaded();
    return this.data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserById(id: string): UserWithCredentials | undefined {
    this.ensureLoaded();
    return this.data.users.find((u) => u.id === id);
  }

  public sanitizeUser(user: UserWithCredentials): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, passwordSalt, ...safeUser } = user;
    return safeUser;
  }

  public getTeamDirectory(): User[] {
    this.ensureLoaded();
    return this.data.users.map((u) => this.sanitizeUser(u));
  }

  public createSession(userId: string): string {
    this.ensureLoaded();
    const token = crypto.randomBytes(32).toString('hex');
    this.data.sessions[token] = {
      userId,
      createdAt: Date.now(),
    };
    this.persist();
    return token;
  }

  public getSessionUser(token: string): User | null {
    this.ensureLoaded();
    if (!token) return null;
    const session = this.data.sessions[token];
    if (!session) return null;
    const user = this.findUserById(session.userId);
    if (!user) return null;
    return this.sanitizeUser(user);
  }

  public removeSession(token: string): void {
    this.ensureLoaded();
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.persist();
    }
  }

  // --- Access Control for Projects ---
  public getProjectsForUser(user: User): ProjectWithDetails[] {
    this.ensureLoaded();
    let allowedProjects: Project[] = [];

    if (user.role === 'ADMIN') {
      allowedProjects = [...this.data.projects];
    } else if (user.role === 'MANAGER') {
      allowedProjects = this.data.projects.filter((p) => p.managerId === user.id);
    } else if (user.role === 'AGENT') {
      // Distinct projects containing tasks assigned to currentUser.id
      const userTaskProjectIds = new Set(
        this.data.tasks.filter((t) => t.assigneeId === user.id).map((t) => t.projectId)
      );
      allowedProjects = this.data.projects.filter((p) => userTaskProjectIds.has(p.id));
    }

    return allowedProjects.map((p) => this.enrichProject(p, user));
  }

  public getProjectByIdForUser(user: User, projectId: string): ProjectWithDetails | null {
    this.ensureLoaded();
    const project = this.data.projects.find((p) => p.id === projectId);
    if (!project) return null;

    // Check permission
    if (user.role === 'ADMIN') {
      return this.enrichProject(project, user);
    }

    if (user.role === 'MANAGER') {
      if (project.managerId === user.id) {
        return this.enrichProject(project, user);
      }
      return null; // Forbidden / Not found in allowed
    }

    if (user.role === 'AGENT') {
      const hasTaskInProject = this.data.tasks.some(
        (t) => t.projectId === projectId && t.assigneeId === user.id
      );
      if (hasTaskInProject) {
        return this.enrichProject(project, user);
      }
      return null; // Forbidden
    }

    return null;
  }

  // --- Access Control for Tasks ---
  public getTasksForProject(user: User, projectId: string): TaskWithAssignee[] | null {
    this.ensureLoaded();
    const project = this.data.projects.find((p) => p.id === projectId);
    if (!project) return null;

    if (user.role === 'ADMIN') {
      return this.data.tasks
        .filter((t) => t.projectId === projectId)
        .map((t) => this.enrichTask(t, project));
    }

    if (user.role === 'MANAGER') {
      if (project.managerId === user.id) {
        return this.data.tasks
          .filter((t) => t.projectId === projectId)
          .map((t) => this.enrichTask(t, project));
      }
      return null; // Not allowed
    }

    if (user.role === 'AGENT') {
      return this.data.tasks
        .filter((t) => t.projectId === projectId && t.assigneeId === user.id)
        .map((t) => this.enrichTask(t, project));
    }

    return null;
  }

  public getMyTasks(user: User): TaskWithAssignee[] {
    this.ensureLoaded();
    const tasks = this.data.tasks.filter((t) => t.assigneeId === user.id);
    return tasks.map((t) => {
      const project = this.data.projects.find((p) => p.id === t.projectId);
      return this.enrichTask(t, project);
    });
  }

  // --- Atomic Transcript Save Transaction ---
  public saveProjectsAndTasksTransaction(
    newProjects: Project[],
    newTasks: Task[]
  ): { projects: Project[]; tasks: Task[] } {
    this.ensureLoaded();

    // Create shallow backup in case of error
    const prevProjects = [...this.data.projects];
    const prevTasks = [...this.data.tasks];

    try {
      // Validate all projects and tasks before saving
      for (const p of newProjects) {
        if (!p.id || !p.name || !p.clientName || !p.managerId || !p.deadline) {
          throw new Error(`Invalid project structure: ${JSON.stringify(p)}`);
        }
        const manager = this.findUserById(p.managerId);
        if (!manager || manager.role !== 'MANAGER') {
          throw new Error(`Project "${p.name}" manager "${p.managerId}" is not a valid MANAGER`);
        }
      }

      for (const t of newTasks) {
        if (!t.id || !t.projectId || !t.title || !t.assigneeId || !t.deadline) {
          throw new Error(`Invalid task structure: ${JSON.stringify(t)}`);
        }
        if (typeof t.estimatedHours !== 'number' || t.estimatedHours <= 0) {
          throw new Error(`Task "${t.title}" must have estimatedHours > 0`);
        }
        const parentProj = newProjects.find((p) => p.id === t.projectId) || this.data.projects.find((p) => p.id === t.projectId);
        if (!parentProj) {
          throw new Error(`Task "${t.title}" references non-existent project "${t.projectId}"`);
        }
        const assignee = this.findUserById(t.assigneeId);
        if (!assignee || assignee.role !== 'AGENT') {
          throw new Error(`Task "${t.title}" assignee "${t.assigneeId}" is not a valid AGENT`);
        }
        if (t.deadline > parentProj.deadline) {
          throw new Error(`Task deadline ${t.deadline} cannot be after project deadline ${parentProj.deadline}`);
        }
      }

      // Append
      this.data.projects.push(...newProjects);
      this.data.tasks.push(...newTasks);
      this.persist();

      return { projects: newProjects, tasks: newTasks };
    } catch (err) {
      // Rollback
      this.data.projects = prevProjects;
      this.data.tasks = prevTasks;
      throw err;
    }
  }

  // --- Helpers ---
  private enrichProject(project: Project, currentUser: User): ProjectWithDetails {
    const managerRaw = this.findUserById(project.managerId);
    const manager = managerRaw ? this.sanitizeUser(managerRaw) : undefined;

    // Filter tasks based on user role
    let tasks: TaskWithAssignee[] = [];
    if (currentUser.role === 'ADMIN') {
      tasks = this.data.tasks
        .filter((t) => t.projectId === project.id)
        .map((t) => this.enrichTask(t, project));
    } else if (currentUser.role === 'MANAGER') {
      if (project.managerId === currentUser.id) {
        tasks = this.data.tasks
          .filter((t) => t.projectId === project.id)
          .map((t) => this.enrichTask(t, project));
      }
    } else if (currentUser.role === 'AGENT') {
      tasks = this.data.tasks
        .filter((t) => t.projectId === project.id && t.assigneeId === currentUser.id)
        .map((t) => this.enrichTask(t, project));
    }

    const allProjectTasks = this.data.tasks.filter((t) => t.projectId === project.id);
    const totalHours = allProjectTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

    return {
      ...project,
      manager,
      tasks,
      taskCount: allProjectTasks.length,
      totalHours,
    };
  }

  private enrichTask(task: Task, project?: Project): TaskWithAssignee {
    const assigneeRaw = this.findUserById(task.assigneeId);
    const assignee = assigneeRaw ? this.sanitizeUser(assigneeRaw) : undefined;
    const managerRaw = project ? this.findUserById(project.managerId) : undefined;

    return {
      ...task,
      assignee,
      projectName: project?.name,
      clientName: project?.clientName,
      managerName: managerRaw?.name,
    };
  }
}

export const db = new Database();
