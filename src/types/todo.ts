export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null; // ISO string or YYYY-MM-DD
  dueTime?: string | null; // HH:mm
  priority: Priority;
  category: string;
  tags: string[];
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  order: number;
  color?: string;
  estimatedMinutes?: number | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  iconName: string;
}

export type ViewMode = 'all' | 'today' | 'upcoming' | 'completed' | 'board' | 'matrix';

export type SortField = 'order' | 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  category: string;
  priority: string;
  status: 'all' | 'active' | 'completed' | 'overdue';
  tag: string;
  sortBy: SortField;
  sortDirection: SortDirection;
}

export interface AppPreferences {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  particlesEnabled: boolean;
  tiltSensitivity: number; // 0 to 1
  glassBlur: 'low' | 'medium' | 'high';
  compactView: boolean;
  defaultPriority: Priority;
  enable3DEffects: boolean;
}

export interface SmartParseResult {
  title: string;
  description?: string;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: Priority;
  category?: string;
  tags: string[];
  estimatedMinutes?: number | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
