'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Sparkles, Moon, Sun, Settings, Plus, Layers, Calendar, CheckSquare, BarChart3, LayoutGrid } from 'lucide-react';
import { ViewMode } from '@/types/todo';

export const Navbar: React.FC = () => {
  const { preferences, updatePreferences, activeView, setActiveView, openNewTaskModal, setIsPrefsModalOpen, tasks } = useTodo();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'all', label: 'All Tasks', icon: <Layers className="w-4 h-4" />, count: tasks.length },
    { id: 'today', label: 'Today', icon: <Calendar className="w-4 h-4" />, count: tasks.filter(t => !t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length },
    { id: 'upcoming', label: 'Upcoming', icon: <Sparkles className="w-4 h-4" />, count: tasks.filter(t => !t.completed && t.dueDate && t.dueDate > new Date().toISOString().split('T')[0]).length },
    { id: 'completed', label: 'Done', icon: <CheckSquare className="w-4 h-4" />, count: tasks.filter(t => t.completed).length },
    { id: 'board', label: '3D Board', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'matrix', label: 'Matrix', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/70 dark:bg-slate-950/70 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-3d-glow">
              <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  OMNI 3D
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  Smart AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Spatial Smart Task Orchestrator</p>
            </div>
          </div>

          {/* Nav Views (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-white/10 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* New Task Button */}
            <button
              onClick={() => openNewTaskModal()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {preferences.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Preferences Modal Toggle */}
            <button
              onClick={() => setIsPrefsModalOpen(true)}
              aria-label="Settings"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Selector Bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 no-scrollbar border-t border-white/5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] opacity-75">({item.count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
