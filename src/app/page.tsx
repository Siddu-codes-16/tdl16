'use client';

import React, { useMemo } from 'react';
import { TodoProvider, useTodo } from '@/context/TodoContext';
import { Navbar } from '@/components/Navbar';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { DashboardStats } from '@/components/DashboardStats';
import { SmartTaskInput } from '@/components/SmartTaskInput';
import { TaskFilterBar } from '@/components/TaskFilterBar';
import { TaskCard } from '@/components/TaskCard';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskMatrix } from '@/components/TaskMatrix';
import { TaskModal } from '@/components/modals/TaskModal';
import { PreferencesModal } from '@/components/modals/PreferencesModal';
import { isOverdue } from '@/lib/utils';
import { Sparkles, CheckCircle2, ListPlus, Inbox } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function TodoAppContent() {
  const { tasks, filter, activeView, preferences, openNewTaskModal } = useTodo();

  // Filter and Sort Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchTag = task.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        // Category filter
        if (filter.category !== 'all' && task.category.toLowerCase() !== filter.category.toLowerCase()) {
          return false;
        }

        // Priority filter
        if (filter.priority !== 'all' && task.priority !== filter.priority) {
          return false;
        }

        // Active View filter
        const todayStr = new Date().toISOString().split('T')[0];
        if (activeView === 'today') {
          return !task.completed && task.dueDate === todayStr;
        }
        if (activeView === 'upcoming') {
          return !task.completed && task.dueDate && task.dueDate > todayStr;
        }
        if (activeView === 'completed') {
          return task.completed;
        }

        return true;
      })
      .sort((a, b) => {
        const factor = filter.sortDirection === 'asc' ? 1 : -1;
        if (filter.sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate) * factor;
        }
        if (filter.sortBy === 'priority') {
          const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
          return ((priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0)) * factor;
        }
        if (filter.sortBy === 'title') {
          return a.title.localeCompare(b.title) * factor;
        }
        if (filter.sortBy === 'createdAt') {
          return a.createdAt.localeCompare(b.createdAt) * factor;
        }
        return (a.order - b.order) * factor;
      });
  }, [tasks, filter, activeView]);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden">
      <ParticleBackground enabled={preferences.particlesEnabled} />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Statistics Widget */}
        <DashboardStats />

        {/* Natural Language Task Input */}
        <SmartTaskInput />

        {/* Filter, Search & View Bar */}
        <TaskFilterBar />

        {/* Main Content Area */}
        <div className="mt-6">
          {activeView === 'board' ? (
            <TaskBoard tasks={filteredTasks} />
          ) : activeView === 'matrix' ? (
            <TaskMatrix tasks={filteredTasks} />
          ) : (
            <>
              {filteredTasks.length === 0 ? (
                /* Polished Empty State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl my-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-3d-glow">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No tasks found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
                    {filter.search
                      ? `No matching tasks for "${filter.search}". Try clearing your filters.`
                      : activeView === 'completed'
                      ? 'No tasks marked completed yet. Keep pushing!'
                      : 'All caught up! Add a new task above using natural language or the button below.'}
                  </p>
                  <button
                    onClick={() => openNewTaskModal()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    <ListPlus className="w-4 h-4" />
                    <span>Create a Task</span>
                  </button>
                </motion.div>
              ) : (
                /* 3D Floating Task Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task, idx) => (
                      <TaskCard key={task.id} task={task} index={idx} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 py-6 text-center text-xs text-slate-500 backdrop-blur-md">
        <p className="flex items-center justify-center gap-1.5">
          <span>OMNI 3D Task Orchestrator</span>
          <span>•</span>
          <span>Deployable to Vercel</span>
        </p>
      </footer>

      {/* Modals & Providers */}
      <TaskModal />
      <PreferencesModal />
      <ToastProvider />
    </div>
  );
}

export default function HomePage() {
  return (
    <TodoProvider>
      <TodoAppContent />
    </TodoProvider>
  );
}
