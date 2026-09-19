'use client';

import React from 'react';
import { Task } from '@/types/todo';
import { TaskCard } from './TaskCard';
import { Flame, ShieldAlert, Zap, Coffee } from 'lucide-react';

interface TaskMatrixProps {
  tasks: Task[];
}

export const TaskMatrix: React.FC<TaskMatrixProps> = ({ tasks }) => {
  const activeTasks = tasks.filter((t) => !t.completed);

  const quadrants = [
    {
      id: 'q1',
      title: 'Do First (Urgent & Important)',
      subtitle: 'Critical deadlines & crises',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      tasks: activeTasks.filter((t) => t.priority === 'urgent'),
      bg: 'border-rose-500/30 bg-rose-500/5',
      badgeColor: 'bg-rose-500/20 text-rose-300',
    },
    {
      id: 'q2',
      title: 'Schedule (Important, Not Urgent)',
      subtitle: 'Long term goals & development',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      tasks: activeTasks.filter((t) => t.priority === 'high'),
      bg: 'border-amber-500/30 bg-amber-500/5',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'q3',
      title: 'Delegate / Quick (Urgent, Less Critical)',
      subtitle: 'Meetings & minor tasks',
      icon: <ShieldAlert className="w-4 h-4 text-blue-400" />,
      tasks: activeTasks.filter((t) => t.priority === 'medium'),
      bg: 'border-blue-500/30 bg-blue-500/5',
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      id: 'q4',
      title: 'Don\'t Stress / Low Priority',
      subtitle: 'Nice to have ideas & backlogs',
      icon: <Coffee className="w-4 h-4 text-emerald-400" />,
      tasks: activeTasks.filter((t) => t.priority === 'low'),
      bg: 'border-emerald-500/30 bg-emerald-500/5',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
      {quadrants.map((quad) => (
        <div
          key={quad.id}
          className={`flex flex-col rounded-2xl border ${quad.bg} backdrop-blur-xl p-4 min-h-[360px] shadow-glass-sm`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                {quad.icon}
                <h3 className="text-sm font-semibold text-slate-100">{quad.title}</h3>
                <span className={`px-2 py-0.2 rounded-full text-xs font-semibold ${quad.badgeColor}`}>
                  {quad.tasks.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{quad.subtitle}</p>
            </div>
          </div>

          {/* Quadrant Tasks */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
            {quad.tasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6 text-slate-500 text-xs border border-dashed border-white/5 rounded-xl">
                No tasks in this quadrant
              </div>
            ) : (
              quad.tasks.map((task, idx) => <TaskCard key={task.id} task={task} index={idx} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
