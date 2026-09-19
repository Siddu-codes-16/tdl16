'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppPreferences, Category, FilterState, Priority, Task, ToastMessage, ViewMode } from '@/types/todo';
import { INITIAL_CATEGORIES, INITIAL_TASKS } from '@/lib/seedData';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface TodoContextType {
  tasks: Task[];
  categories: Category[];
  preferences: AppPreferences;
  filter: FilterState;
  activeView: ViewMode;
  toasts: ToastMessage[];
  searchQuery: string;
  isTaskModalOpen: boolean;
  isPrefsModalOpen: boolean;
  editingTask: Task | null;

  // Actions
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  moveTaskToStatus: (id: string, completed: boolean) => void;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  setActiveView: (view: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  updatePreferences: (updates: Partial<AppPreferences>) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  openNewTaskModal: (prefill?: Partial<Task>) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  setIsPrefsModalOpen: (open: boolean) => void;
  resetToSeedData: () => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY_TASKS = 'smart_3d_todos_tasks';
const STORAGE_KEY_CATEGORIES = 'smart_3d_todos_categories';
const STORAGE_KEY_PREFS = 'smart_3d_todos_preferences';

const DEFAULT_PREFS: AppPreferences = {
  theme: 'dark',
  soundEnabled: true,
  particlesEnabled: true,
  tiltSensitivity: 0.7,
  glassBlur: 'high',
  compactView: false,
  defaultPriority: 'medium',
  enable3DEffects: true,
};

const DEFAULT_FILTER: FilterState = {
  search: '',
  category: 'all',
  priority: 'all',
  status: 'all',
  tag: 'all',
  sortBy: 'order',
  sortDirection: 'asc',
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFS);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [activeView, setActiveView] = useState<ViewMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPrefsModalOpen, setIsPrefsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<{ task: Task; index: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      const savedCats = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      const savedPrefs = localStorage.getItem(STORAGE_KEY_PREFS);

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(INITIAL_TASKS);
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
      }

      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setPreferences({ ...DEFAULT_PREFS, ...parsed });
      }
    } catch {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
      sound.enabled = preferences.soundEnabled;
    } catch {
      // ignore
    }
  }, [preferences, isMounted]);

  // Handle HTML theme class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (preferences.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [preferences.theme]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id, duration: toast.duration || 4000 };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: taskData.title?.trim() || 'Untitled Task',
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      dueTime: taskData.dueTime || null,
      priority: taskData.priority || preferences.defaultPriority,
      category: taskData.category || 'Work',
      tags: taskData.tags || [],
      completed: false,
      createdAt: new Date().toISOString(),
      order: 0,
      estimatedMinutes: taskData.estimatedMinutes || null,
    };

    setTasks((prev) => [newTask, ...prev.map((t) => ({ ...t, order: t.order + 1 }))]);
    sound.playAdd();
    addToast({
      type: 'success',
      title: 'Task created',
      description: `"${newTask.title}" added to your 3D board`,
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return { ...task, ...updates };
        }
        return task;
      })
    );
    sound.playClick();
    addToast({
      type: 'info',
      title: 'Task updated',
      description: 'Changes saved successfully',
    });
  };

  const deleteTask = (id: string) => {
    const taskIndex = tasks.findIndex((t) => t.id === id);
    const taskToDelete = tasks[taskIndex];
    if (!taskToDelete) return;

    setLastDeletedTask({ task: taskToDelete, index: taskIndex });
    setTasks((prev) => prev.filter((t) => t.id !== id));
    sound.playDelete();

    addToast({
      type: 'warning',
      title: 'Task deleted',
      description: `"${taskToDelete.title}" removed`,
      duration: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks((prev) => {
            const restored = [...prev];
            restored.splice(taskIndex, 0, taskToDelete);
            return restored;
          });
          sound.playAdd();
          addToast({
            type: 'success',
            title: 'Task restored',
            description: `"${taskToDelete.title}" put back`,
          });
        },
      },
    });
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            sound.playComplete();
            if (typeof window !== 'undefined') {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981'],
              });
            }
          } else {
            sound.playClick();
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        }
        return task;
      })
    );
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  const moveTaskToStatus = (id: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed,
              completedAt: completed ? new Date().toISOString() : null,
            }
          : t
      )
    );
    if (completed) {
      sound.playComplete();
    } else {
      sound.playClick();
    }
  };

  const updatePreferences = (updates: Partial<AppPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const openNewTaskModal = (prefill?: Partial<Task>) => {
    setEditingTask(prefill ? ({ ...prefill } as Task) : null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const resetToSeedData = () => {
    setTasks(INITIAL_TASKS);
    setCategories(INITIAL_CATEGORIES);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    sound.playAdd();
    addToast({
      type: 'info',
      title: 'Board Reset',
      description: 'Demo seed tasks reloaded successfully',
    });
  };

  const exportData = () => {
    const data = JSON.stringify({ tasks, categories, preferences }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-3d-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Export Complete',
      description: 'Your tasks were saved as JSON',
    });
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.preferences) setPreferences(parsed.preferences);
        addToast({
          type: 'success',
          title: 'Import Successful',
          description: `Imported ${parsed.tasks.length} tasks`,
        });
        return true;
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Import Failed',
        description: 'Invalid JSON backup format',
      });
    }
    return false;
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        categories,
        preferences,
        filter,
        activeView,
        toasts,
        searchQuery,
        isTaskModalOpen,
        isPrefsModalOpen,
        editingTask,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        reorderTasks,
        moveTaskToStatus,
        setFilter,
        setActiveView,
        setSearchQuery,
        updatePreferences,
        addToast,
        removeToast,
        openNewTaskModal,
        openEditTaskModal,
        closeTaskModal,
        setIsPrefsModalOpen,
        resetToSeedData,
        exportData,
        importData,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
