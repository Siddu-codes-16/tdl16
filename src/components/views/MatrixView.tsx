'use client';

import React from 'react';
import { Task } from '@/types/todo';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Flame, Star, ShieldAlert, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

interface MatrixViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  tiltEnabled?: boolean;
}

export function MatrixView({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  tiltEnabled,
}: MatrixViewProps) {
  const activeTasks = tasks.filter((t) => !t.completed);

  const quadrants = [
    {
      id: 'q1',
      title: 'Do First (Urgent & Important)',
      subtitle: 'Critical deadlines & immediate crises',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/5',
      tasks: activeTasks.filter((t) => t.priority === 'urgent'),
    },
    {
      id: 'q2',
      title: 'Schedule (Important, Not Urgent)',
      subtitle: 'Long-term planning & high impact',
      icon: <Star className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5',
      tasks: activeTasks.filter((t) => t.priority === 'high'),
    },
    {
      id: 'q3',
      title: 'Delegate (Urgent, Less Important)',
      subtitle: 'Meetings, requests, routine items',
      icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-500/5',
      tasks: activeTasks.filter((t) => t.priority === 'medium'),
    },
    {
      id: 'q4',
      title: 'Eliminate / Backlog',
      subtitle: 'Low priority, casual ideas',
      icon: <Coffee className="w-4 h-4 text-slate-400" />,
      color: 'border-slate-500/30 bg-slate-500/5',
      tasks: activeTasks.filter((t) => t.priority === 'low'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((quad) => (
        <div
          key={quad.id}
          className={`flex flex-col rounded-2xl border ${quad.color} backdrop-blur-xl p-4 min-h-[340px]`}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
                {quad.icon}
                {quad.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{quad.subtitle}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {quad.tasks.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
            {quad.tasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs py-8 border border-dashed border-white/5 rounded-xl">
                <span>No tasks in this quadrant</span>
              </div>
            ) : (
              quad.tasks.map((task) => (
                <motion.div key={task.id} layout>
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
