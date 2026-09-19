'use client';

import React, { useState, useMemo } from 'react';
import { useTodo } from '@/context/TodoContext';
import { parseNaturalLanguage } from '@/lib/nlpParser';
import { Sparkles, ArrowRight, Calendar, Clock, Tag, Flame, Plus, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SmartTaskInput: React.FC = () => {
  const { addTask } = useTodo();
  const [inputVal, setInputVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Live NLP preview
  const parsed = useMemo(() => {
    if (!inputVal.trim()) return null;
    return parseNaturalLanguage(inputVal);
  }, [inputVal]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const result = parseNaturalLanguage(inputVal);
    addTask({
      title: result.title,
      dueDate: result.dueDate || null,
      dueTime: result.dueTime || null,
      priority: result.priority || 'medium',
      category: result.category || 'Work',
      tags: result.tags,
      estimatedMinutes: result.estimatedMinutes || null,
    });

    setInputVal('');
  };

  const samplePrompts = [
    'Deploy release on Friday 5pm urgent #dev',
    'Review design mockups tomorrow 2pm ~45m #design',
    'Prepare weekly sprint goals Monday #work high priority',
    'Gym leg session today 6pm #health',
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto my-6">
      {/* 3D Glass Glow Background */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

      <div className="relative rounded-2xl border border-white/15 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-2xl p-3 sm:p-4 shadow-glass-md transition-all">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder='Try "Finish landing page tomorrow at 5pm urgent #dev @Work"'
              className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm sm:text-base outline-none font-medium"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
            >
              <span>Add Task</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live NLP Extraction Smart Pills */}
          <AnimatePresence>
            {parsed && (parsed.dueDate || parsed.dueTime || parsed.priority || (parsed.tags && parsed.tags.length > 0) || parsed.category || parsed.estimatedMinutes) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs"
              >
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Auto Detected:
                </span>

                {parsed.dueDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-medium">
                    <Calendar className="w-3 h-3" /> {parsed.dueDate}
                  </span>
                )}

                {parsed.dueTime && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 font-medium">
                    <Clock className="w-3 h-3" /> {parsed.dueTime}
                  </span>
                )}

                {parsed.priority && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-medium border ${
                    parsed.priority === 'urgent'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/20'
                      : parsed.priority === 'high'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
                  }`}>
                    <Flame className="w-3 h-3" /> {parsed.priority} priority
                  </span>
                )}

                {parsed.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/20 font-medium">
                    <Layers className="w-3 h-3" /> @{parsed.category}
                  </span>
                )}

                {parsed.estimatedMinutes && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/20 font-medium">
                    <Clock className="w-3 h-3" /> ~{parsed.estimatedMinutes}m
                  </span>
                )}

                {parsed.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 font-medium text-[11px]"
                  >
                    <Tag className="w-2.5 h-2.5" /> #{tag}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt Suggestions on Focus or Empty */}
          {isFocused && !inputVal && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5"
            >
              <span className="text-[11px] text-slate-500">Quick ideas:</span>
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputVal(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors border border-white/5"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};
