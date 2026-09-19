'use client';

import React from 'react';
import { Task } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import { TaskCard } from './TaskCard';
import { CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  const { openNewTaskModal, moveTaskToStatus } = useTodo();

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <ListTodo className="w-4 h-4 text-indigo-400" />,
      tasks: tasks.filter((t) => !t.completed && t.priority !== 'urgent'),
      accent: 'border-indigo-500/20 bg-indigo-500/5',
      completedVal: false,
    },
    {
      id: 'urgent',
      title: 'High / Urgent Focus',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      tasks: tasks.filter((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high')),
      accent: 'border-amber-500/20 bg-amber-500/5',
      completedVal: false,
    },
    {
      id: 'done',
      title: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      tasks: tasks.filter((t) => t.completed),
      accent: 'border-emerald-500/20 bg-emerald-500/5',
      completedVal: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      {columns.map((col) => (
        <div
          key={col.id}
          className={`flex flex-col rounded-2xl border ${col.accent} backdrop-blur-xl p-4 min-h-[500px] shadow-glass-sm`}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              {col.icon}
              <h3 className="text-sm font-semibold text-slate-100">{col.title}</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
                {col.tasks.length}
              </span>
            </div>

            {col.id !== 'done' && (
              <button
                onClick={() => openNewTaskModal({ priority: col.id === 'urgent' ? 'urgent' : 'medium' })}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Add task to column"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cards List in Column */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {col.tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-xl text-slate-500">
                <p className="text-xs">No tasks in this lane</p>
              </div>
            ) : (
              col.tasks.map((task, idx) => (
                <TaskCard key={task.id} task={task} index={idx} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
