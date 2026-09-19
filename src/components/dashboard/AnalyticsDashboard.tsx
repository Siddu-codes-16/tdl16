'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Task } from '@/types/todo';
import { isOverdue } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Compute 7-day activity mock / real data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = [45, 65, 80, 50, 95, 70, completionRate];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Total Tasks */}
      <ThreeDCard tiltSensitivity={0.4} className="bg-slate-900/70 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Total Tasks</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-2xl font-black text-white">{total}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-indigo-400 font-medium">{active} active</span> remaining
        </div>
      </ThreeDCard>

      {/* 2. Completion Rate */}
      <ThreeDCard tiltSensitivity={0.4} className="bg-slate-900/70 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Completion</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-2xl font-black text-emerald-400">{completionRate}%</div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </ThreeDCard>

      {/* 3. Overdue Alert */}
      <ThreeDCard tiltSensitivity={0.4} className="bg-slate-900/70 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Overdue</span>
          <div
            className={`p-2 rounded-xl ${
              overdueCount > 0
                ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`mt-2 text-2xl font-black ${
            overdueCount > 0 ? 'text-rose-400' : 'text-slate-300'
          }`}
        >
          {overdueCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          {overdueCount > 0 ? 'Requires attention' : 'All on track! 🎉'}
        </div>
      </ThreeDCard>

      {/* 4. Productivity Velocity / Streak */}
      <ThreeDCard tiltSensitivity={0.4} className="bg-slate-900/70 border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Streak / Velocity</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 text-2xl font-black text-amber-400 flex items-center gap-1">
          4 <span className="text-xs font-normal text-slate-400">days streak</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-slate-800 rounded-sm overflow-hidden"
                style={{ height: 16 }}
              >
                <div
                  className="bg-indigo-500 rounded-sm w-full"
                  style={{ height: `${activityData[idx]}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-500">{day[0]}</span>
            </div>
          ))}
        </div>
      </ThreeDCard>
    </div>
  );
}
