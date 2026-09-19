import { Category, Task } from '@/types/todo';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#6366f1', iconName: 'Briefcase' },
  { id: 'personal', name: 'Personal', color: '#ec4899', iconName: 'User' },
  { id: 'dev', name: 'Dev', color: '#06b6d4', iconName: 'Code' },
  { id: 'design', name: 'Design', color: '#a855f7', iconName: 'Palette' },
  { id: 'health', name: 'Health', color: '#10b981', iconName: 'Activity' },
  { id: 'study', name: 'Study', color: '#f59e0b', iconName: 'BookOpen' },
];

const getFutureDate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'seed-1',
    title: 'Deploy Next.js 3D To-Do App to Vercel',
    description: 'Configure custom domain, environment variables and verify performance score',
    dueDate: getFutureDate(0),
    dueTime: '18:00',
    priority: 'urgent',
    category: 'Dev',
    tags: ['nextjs', 'vercel', 'deploy'],
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    order: 0,
    estimatedMinutes: 30,
  },
  {
    id: 'seed-2',
    title: 'Design interactive 3D perspective cards in Tailwind',
    description: 'Use Framer Motion spring physics with dynamic mouse sheen highlights',
    dueDate: getFutureDate(1),
    dueTime: '15:30',
    priority: 'high',
    category: 'Design',
    tags: ['ui', '3d', 'framer-motion'],
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    order: 1,
    estimatedMinutes: 60,
  },
  {
    id: 'seed-3',
    title: 'Sprint Planning & Architecture Sync',
    description: 'Review product backlog, estimate tickets, and align on upcoming milestone',
    dueDate: getFutureDate(2),
    dueTime: '10:00',
    priority: 'medium',
    category: 'Work',
    tags: ['team', 'planning'],
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    order: 2,
    estimatedMinutes: 45,
  },
  {
    id: 'seed-4',
    title: 'High-intensity interval workout & mobility',
    description: '30 min kettlebell flow + stretching session',
    dueDate: getFutureDate(0),
    dueTime: '07:30',
    priority: 'low',
    category: 'Health',
    tags: ['fitness', 'workout'],
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    order: 3,
    estimatedMinutes: 40,
  },
  {
    id: 'seed-5',
    title: 'Read System Design & Distributed Systems chapter',
    description: 'Focus on event-driven streaming and consensus algorithms',
    dueDate: getFutureDate(4),
    dueTime: '21:00',
    priority: 'medium',
    category: 'Study',
    tags: ['reading', 'learning'],
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    order: 4,
    estimatedMinutes: 50,
  },
];
