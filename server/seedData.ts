import { hashPassword } from './crypto.js';
import type { UserWithCredentials } from '../src/types/index.js';

export const DEMO_PASSWORD = 'Demo123!';

export interface DemoUserDefinition {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  specialization: string;
  skills: string[];
}

export const SUPPLIED_TEN_ACCOUNTS: DemoUserDefinition[] = [
  {
    id: 'ADMIN',
    name: 'Admin',
    email: 'admin@novaworks.example',
    role: 'ADMIN',
    specialization: 'Administrator',
    skills: ['Company overview', 'transcript creation'],
  },
  {
    id: 'PM01',
    name: 'Ayesha Khan',
    email: 'ayesha@novaworks.example',
    role: 'MANAGER',
    specialization: 'Manager / Web PM',
    skills: ['Web projects', 'client coordination'],
  },
  {
    id: 'PM02',
    name: 'Bilal Ahmed',
    email: 'bilal@novaworks.example',
    role: 'MANAGER',
    specialization: 'Manager / Mobile PM',
    skills: ['Mobile projects', 'delivery planning'],
  },
  {
    id: 'PM03',
    name: 'Hina Malik',
    email: 'hina@novaworks.example',
    role: 'MANAGER',
    specialization: 'Manager / AI PM',
    skills: ['AI projects', 'requirement review'],
  },
  {
    id: 'DEV01',
    name: 'Ali Raza',
    email: 'ali@novaworks.example',
    role: 'AGENT',
    specialization: 'Agent / Full-Stack',
    skills: ['React', 'frontend integration'],
  },
  {
    id: 'DEV02',
    name: 'Hamza Shah',
    email: 'hamza@novaworks.example',
    role: 'AGENT',
    specialization: 'Agent / Full-Stack',
    skills: ['Node.js', 'databases', 'APIs'],
  },
  {
    id: 'DEV03',
    name: 'Sara Noor',
    email: 'sara@novaworks.example',
    role: 'AGENT',
    specialization: 'Agent / App Developer',
    skills: ['Flutter', 'mobile UI'],
  },
  {
    id: 'DEV04',
    name: 'Usman Tariq',
    email: 'usman@novaworks.example',
    role: 'AGENT',
    specialization: 'Agent / App Developer',
    skills: ['Flutter', 'integration', 'testing'],
  },
  {
    id: 'DEV05',
    name: 'Zain Abbas',
    email: 'zain@novaworks.example',
    role: 'AGENT',
    specialization: 'Agent / AI Developer',
    skills: ['LLMs', 'extraction', 'prompts'],
  },
  {
    id: 'DEV06',
    name: 'Maryam Asif',
    email: 'maryam@novaworks.example',
    role: 'AGENT',
    specialization: 'Agent / AI Developer',
    skills: ['Retrieval', 'document processing'],
  },
];

export function getInitialDemoUsers(): UserWithCredentials[] {
  return SUPPLIED_TEN_ACCOUNTS.map((acc) => {
    const { salt, hash } = hashPassword(DEMO_PASSWORD);
    return {
      ...acc,
      passwordSalt: salt,
      passwordHash: hash,
    };
  });
}
