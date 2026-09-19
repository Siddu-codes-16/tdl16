'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { isOverdue } from '@/lib/utils';
import { CheckCircle2, Flame, ListTodo, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardStats: React.FC = () => {
  const { tasks } = useTodo();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Weekly productivity days breakdown (Simulated 7 days active track)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      sub: `${pending} active remaining`,
      icon: <ListTodo className="w-4 h-4 text-indigo-400" />,
      color: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
    },
    {
      title: 'Completion Rate',
      value: `${completionPercentage}%`,
      sub: `${completed} tasks completed`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    },
    {
      title: 'Overdue Attention',
      value: overdueCount,
      sub: overdueCount === 0 ? 'All caught up!' : 'Needs immediate action',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      color: overdueCount > 0 ? 'from-rose-500/15 to-rose-500/5 border-rose-500/30' : 'from-slate-500/10 to-slate-500/5 border-white/10',
    },
    {
      title: 'Focus Velocity',
      value: '94 XP',
      sub: 'Top 5% Productivity',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      color: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${stat.color} backdrop-blur-xl p-4 shadow-glass-sm`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">{stat.icon}</div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">{stat.value}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{stat.sub}</p>

          {/* Progress bar under completion */}
          {stat.title === 'Completion Rate' && (
            <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
