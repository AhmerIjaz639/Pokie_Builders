export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT';

export interface User {
  id: string; // e.g. "ADMIN", "PM01", "DEV01"
  name: string;
  email: string;
  role: UserRole;
  specialization: string;
  skills: string[];
}

export interface UserWithCredentials extends User {
  passwordHash: string;
  passwordSalt: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  managerId: string;
  deadline: string; // YYYY-MM-DD
  createdAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  deadline: string; // YYYY-MM-DD
  estimatedHours: number;
  createdAt?: string;
}

export interface ProjectWithDetails extends Project {
  manager?: User;
  tasks?: TaskWithAssignee[];
  taskCount?: number;
  totalHours?: number;
}

export interface TaskWithAssignee extends Task {
  assignee?: User;
  projectName?: string;
  clientName?: string;
  managerName?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  createdAt: number;
}

export interface AIProjectInput {
  name: string;
  clientName: string;
  description: string;
  managerId: string;
  deadline: string;
  tasks: Array<{
    title: string;
    description: string;
    assigneeId: string;
    deadline: string;
    estimatedHours: number;
  }>;
}

export interface TranscriptCreationResult {
  success: boolean;
  message: string;
  projectsCount: number;
  tasksCount: number;
  projects: Project[];
  tasks: Task[];
  validationErrors?: string[];
}
