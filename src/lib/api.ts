import type {
  User,
  ProjectWithDetails,
  TaskWithAssignee,
  TranscriptCreationResult,
} from '../types/index.js';

const TOKEN_KEY = 'novaworks_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include', // send cookie
  });

  const data = await response.json().catch(() => ({ error: 'Invalid response from server' }));

  if (!response.ok) {
    const errorMsg = data?.error || (data?.validationErrors ? data.validationErrors.join('; ') : 'Request failed');
    const err = new Error(errorMsg);
    (err as any).status = response.status;
    (err as any).data = data;
    throw err;
  }

  return data as T;
}

export const api = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await apiFetch<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      authStorage.setToken(res.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      authStorage.clearToken();
    }
  },

  async getMe(): Promise<{ user: User }> {
    return apiFetch<{ user: User }>('/api/auth/me');
  },

  async getTeam(): Promise<{ team: User[] }> {
    return apiFetch<{ team: User[] }>('/api/users/team');
  },

  async getProjects(): Promise<{ projects: ProjectWithDetails[] }> {
    return apiFetch<{ projects: ProjectWithDetails[] }>('/api/projects');
  },

  async getProjectById(id: string): Promise<{ project: ProjectWithDetails }> {
    return apiFetch<{ project: ProjectWithDetails }>(`/api/projects/${id}`);
  },

  async getTasksForProject(id: string): Promise<{ tasks: TaskWithAssignee[] }> {
    return apiFetch<{ tasks: TaskWithAssignee[] }>(`/api/projects/${id}/tasks`);
  },

  async getMyTasks(): Promise<{ tasks: TaskWithAssignee[] }> {
    return apiFetch<{ tasks: TaskWithAssignee[] }>('/api/tasks/my');
  },

  async createFromTranscript(transcript: string): Promise<TranscriptCreationResult> {
    return apiFetch<TranscriptCreationResult>('/api/transcript/create', {
      method: 'POST',
      body: JSON.stringify({ transcript }),
    });
  },

  async seedDemo(): Promise<{ message: string; inserted: number; updated: number; total: number }> {
    return apiFetch('/api/seed', { method: 'POST' });
  },

  async resetData(clearProjectsOnly: boolean = false): Promise<{ message: string }> {
    return apiFetch('/api/db/reset', {
      method: 'POST',
      body: JSON.stringify({ clearProjectsOnly }),
    });
  },
};
