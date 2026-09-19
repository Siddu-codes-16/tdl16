'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  GripVertical,
  AlertCircle,
  Hash,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task } from '@/types/todo';
import { ThreeDCard, ThreeDElement } from '@/components/ui/ThreeDCard';
import { sound } from '@/lib/sound';
import { formatDate, isOverdue } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  tiltEnabled?: boolean;
  tiltSensitivity?: number;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  tiltEnabled = true,
  tiltSensitivity = 0.6,
  isDragging = false,
}: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.completed);

  const priorityConfig = {
    urgent: {
      border: 'rgba(239, 68, 68, 0.4)',
      bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-500',
    },
    high: {
      border: 'rgba(245, 158, 11, 0.4)',
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-500',
    },
    medium: {
      border: 'rgba(99, 102, 241, 0.4)',
      bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      dot: 'bg-indigo-500',
    },
    low: {
      border: 'rgba(148, 163, 184, 0.3)',
      bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      dot: 'bg-slate-500',
    },
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      sound.playComplete();
      // Confetti burst from click location
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x, y },
        colors: ['#6366f1', '#a855f7', '#10b981', '#06b6d4'],
      });
    } else {
      sound.playClick();
    }
    onToggleComplete(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playDelete();
    onDelete(task);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    onEdit(task);
  };

  return (
    <ThreeDCard
      enabled={tiltEnabled && !isDragging}
      tiltSensitivity={tiltSensitivity}
      borderGlowColor={priorityConfig[task.priority]?.border || 'rgba(99, 102, 241, 0.3)'}
      className={`group border transition-all duration-300 ${
        task.completed
          ? 'bg-slate-900/40 border-white/5 opacity-65'
          : overdue
          ? 'bg-slate-900/80 border-rose-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
          : 'bg-slate-900/75 border-white/10 hover:border-white/20 shadow-xl'
      } backdrop-blur-xl p-4 md:p-5`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox */}
        <ThreeDElement depth={25} className="mt-0.5 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
            className={`relative w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border ${
              task.completed
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800/80 border-slate-600 hover:border-indigo-400 hover:bg-slate-700/80'
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.div>
            )}
          </button>
        </ThreeDElement>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <ThreeDElement depth={15}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Category Pill */}
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {task.category}
              </span>

              {/* Priority Pill */}
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 capitalize ${
                  priorityConfig[task.priority].bg
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot}`}
                />
                {task.priority}
              </span>

              {/* Overdue Alert */}
              {overdue && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className={`text-sm md:text-base font-semibold leading-snug transition-all ${
                task.completed
                  ? 'text-slate-400 line-through'
                  : 'text-white group-hover:text-indigo-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-xs md:text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </ThreeDElement>

          {/* Meta Information & Badges (Tags, Due Date, Duration) */}
          <ThreeDElement depth={30} className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
            {task.dueDate && (
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  overdue
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
                {task.dueTime && (
                  <>
                    <span className="text-slate-500">·</span>
                    <Clock className="w-3 h-3" />
                    <span>{task.dueTime}</span>
                  </>
                )}
              </div>
            )}

            {task.estimatedMinutes && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/80">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{task.estimatedMinutes}m</span>
              </div>
            )}

            {task.tags &&
              task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] bg-slate-800/50 text-slate-400 border border-white/5"
                >
                  <Hash className="w-2.5 h-2.5 text-indigo-400" />
                  {tag}
                </span>
              ))}
          </ThreeDElement>
        </div>

        {/* Action Buttons */}
        <ThreeDElement depth={35} className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleEdit}
            title="Edit task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title="Delete task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </ThreeDElement>
      </div>
    </ThreeDCard>
  );
}
