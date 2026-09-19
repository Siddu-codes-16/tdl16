'use client';

import React from 'react';
import { Task } from '@/types/todo';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Sparkles, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

interface BoardViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  tiltEnabled?: boolean;
}

export function BoardView({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  tiltEnabled,
}: BoardViewProps) {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <ListTodo className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-500/5',
      tasks: tasks.filter((t) => !t.completed && t.priority !== 'urgent'),
    },
    {
      id: 'urgent',
      title: 'High Priority & Urgent',
      icon: <Clock className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/5',
      tasks: tasks.filter((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high')),
    },
    {
      id: 'done',
      title: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5',
      tasks: tasks.filter((t) => t.completed),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => (
        <div
          key={col.id}
          className={`flex flex-col rounded-2xl border ${col.color} backdrop-blur-xl p-4 min-h-[480px]`}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
              {col.icon}
              {col.title}
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {col.tasks.length}
            </span>
          </div>

          {/* Column Tasks */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
            {col.tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-10 border border-dashed border-white/5 rounded-xl">
                <span>No tasks here</span>
              </div>
            ) : (
              col.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <TaskCard
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    tiltEnabled={tiltEnabled}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
