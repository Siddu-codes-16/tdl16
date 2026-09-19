'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, AlertCircle, Hash, Plus, ArrowRight, CornerDownLeft } from 'lucide-react';
import { parseNaturalLanguage } from '@/lib/nlpParser';
import { Priority, Task } from '@/types/todo';
import { sound } from '@/lib/sound';
import { formatDate } from '@/lib/utils';

interface SmartTaskInputProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  categories: string[];
}

export function SmartTaskInput({ onAddTask, categories }: SmartTaskInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    return parseNaturalLanguage(input);
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !parsed) return;

    sound.playAdd();

    onAddTask({
      title: parsed.title,
      dueDate: parsed.dueDate || null,
      dueTime: parsed.dueTime || null,
      priority: (parsed.priority || 'medium') as Priority,
      category: parsed.category || (categories[0] || 'Work'),
      tags: parsed.tags,
      completed: false,
      estimatedMinutes: parsed.estimatedMinutes || null,
    });

    setInput('');
  };

  const priorityColors = {
    urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };

  const quickPrompts = [
    'Deploy portfolio tomorrow at 5pm urgent #dev',
    'Team retrospective on Friday 3pm #work',
    'Morning run today 7am ~30m #health low priority',
  ];

  return (
    <div className="w-full relative z-20">
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
          isFocused
            ? 'bg-slate-900/90 border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.25)]'
            : 'bg-slate-900/60 border-white/10 hover:border-white/20 shadow-lg'
        }`}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder='Type a task... e.g. "Review design tomorrow at 4pm urgent #ui @work"'
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm md:text-base outline-none font-medium"
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-2.5 rounded-xl font-medium text-xs md:text-sm flex items-center gap-1.5 transition-all ${
                input.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-100'
                  : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed scale-95'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Live Natural Language Preview Badges */}
        <AnimatePresence>
          {parsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3 pt-1 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs"
            >
              <span className="text-slate-400 font-medium flex items-center gap-1">
                Detected:
              </span>

              {parsed.dueDate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  <Calendar className="w-3 h-3" />
                  {formatDate(parsed.dueDate)}
                </span>
              )}

              {parsed.dueTime && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Clock className="w-3 h-3" />
                  {parsed.dueTime}
                </span>
              )}

              {parsed.priority && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border capitalize font-semibold ${
                    priorityColors[parsed.priority]
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {parsed.priority}
                </span>
              )}

              {parsed.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  @{parsed.category}
                </span>
              )}

              {parsed.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                >
                  <Hash className="w-2.5 h-2.5 text-indigo-400" />
                  {tag}
                </span>
              ))}

              {parsed.estimatedMinutes && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  ~{parsed.estimatedMinutes}m
                </span>
              )}

              <span className="ml-auto text-[11px] text-slate-500 flex items-center gap-1">
                Press <CornerDownLeft className="w-3 h-3 inline" /> Enter
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Quick Prompts helper when input is empty */}
      {!input && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1">
          <span className="text-[11px] text-slate-500">Try typing:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInput(prompt);
                sound.playClick();
              }}
              className="text-[11px] text-slate-400 hover:text-indigo-300 bg-slate-800/40 hover:bg-slate-800/80 px-2 py-0.5 rounded-md border border-white/5 transition-colors"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
