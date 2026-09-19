'use client';

import React from 'react';
import { Task } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import { ThreeDCard } from '@/components/ui/ThreeDCard';
import { formatDate, isOverdue } from '@/lib/utils';
import { Check, Calendar, Clock, AlertCircle, Edit3, Trash2, GripVertical, Flame, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const { toggleComplete, deleteTask, openEditTaskModal, preferences, categories } = useTodo();

  const overdue = isOverdue(task.dueDate, task.completed);
  const categoryInfo = categories.find((c) => c.name.toLowerCase() === task.category.toLowerCase());

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Flame className="w-3 h-3 fill-rose-400 text-rose-400" /> Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Flame className="w-3 h-3 text-amber-400" /> High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
            Low
          </span>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
      className="group"
    >
      <ThreeDCard
        sensitivity={preferences.tiltSensitivity}
        enable3D={preferences.enable3DEffects}
        className={`border transition-all duration-300 ${
          task.completed
            ? 'bg-slate-900/40 dark:bg-slate-950/40 border-white/5 opacity-60'
            : overdue
            ? 'bg-gradient-to-br from-rose-950/30 via-slate-900/80 to-slate-900/90 border-rose-500/30 shadow-lg shadow-rose-950/20'
            : 'bg-slate-900/70 dark:bg-slate-950/70 border-white/10 hover:border-indigo-500/40 shadow-glass-sm hover:shadow-glass-md'
        } backdrop-blur-xl`}
      >
        <div className="p-4 sm:p-5 flex flex-col justify-between h-full gap-3 relative">
          {/* Top Row: Checkbox, Title, and Actions */}
          <div className="flex items-start gap-3">
            {/* 3D Checkbox */}
            <button
              onClick={() => toggleComplete(task.id)}
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
              className={`relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                task.completed
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'border-white/20 bg-white/5 hover:border-indigo-400 hover:bg-indigo-500/10'
              }`}
              style={{ transform: 'translateZ(20px)' }}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            {/* Title & Description with Depth layer */}
            <div className="flex-1 min-w-0" style={{ transform: 'translateZ(15px)' }}>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-sm sm:text-base font-semibold leading-snug break-words transition-all ${
                    task.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-100'
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {task.description && (
                <p
                  className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                    task.completed ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>

            {/* Hover Action Buttons */}
            <div
              className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              style={{ transform: 'translateZ(25px)' }}
            >
              <button
                onClick={() => openEditTaskModal(task)}
                aria-label="Edit task"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Meta Badges (Category, Tags, Due Date, Priority) */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Category Pill */}
              <span
                className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border flex items-center gap-1.5"
                style={{
                  backgroundColor: `${categoryInfo?.color || '#6366f1'}15`,
                  borderColor: `${categoryInfo?.color || '#6366f1'}35`,
                  color: categoryInfo?.color || '#a5b4fc',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: categoryInfo?.color || '#6366f1' }}
                />
                {task.category}
              </span>

              {/* Priority Badge */}
              {getPriorityBadge()}

              {/* Tags */}
              {task.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-slate-400 border border-white/5"
                >
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>

            {/* Due Date & Time */}
            <div className="flex items-center gap-2 text-slate-400">
              {task.estimatedMinutes && (
                <span className="text-[11px] text-slate-400">
                  ~{task.estimatedMinutes}m
                </span>
              )}

              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                    overdue
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  {overdue ? (
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                  ) : (
                    <Calendar className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{formatDate(task.dueDate)}</span>
                  {task.dueTime && (
                    <span className="flex items-center gap-0.5 ml-1 text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      {task.dueTime}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ThreeDCard>
    </motion.div>
  );
};
