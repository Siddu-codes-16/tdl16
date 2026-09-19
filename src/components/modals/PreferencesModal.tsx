'use client';

import React, { useRef } from 'react';
import { useTodo } from '@/context/TodoContext';
import { X, Volume2, Sparkles, Sliders, RefreshCw, Download, Upload, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';

export const PreferencesModal: React.FC = () => {
  const {
    isPrefsModalOpen,
    setIsPrefsModalOpen,
    preferences,
    updatePreferences,
    resetToSeedData,
    exportData,
    importData,
  } = useTodo();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isPrefsModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsPrefsModalOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 dark:bg-slate-950/95 p-6 shadow-glass-lg backdrop-blur-2xl text-slate-100 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold">Preferences & Display</h2>
            </div>
            <button
              onClick={() => setIsPrefsModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4 text-xs">
            {/* 3D Effects Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">3D Floating Card Tilt</span>
                <span className="text-slate-400 text-[11px]">Interactive spatial perspective on cards</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.enable3DEffects}
                onChange={(e) => updatePreferences({ enable3DEffects: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Particle Canvas Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">Ambient Particle Glow</span>
                <span className="text-slate-400 text-[11px]">Subtle floating 3D dust particles</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.particlesEnabled}
                onChange={(e) => updatePreferences({ particlesEnabled: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Sound FX Toggle & Test */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">Audio Sound Effects</span>
                <span className="text-slate-400 text-[11px]">Web Audio synthesized haptic chimes</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sound.playComplete()}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-[10px] text-slate-300"
                >
                  Test chime
                </button>
                <input
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Tilt Sensitivity Slider */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Tilt Sensitivity</span>
                <span className="text-indigo-400 font-mono font-bold">
                  {Math.round(preferences.tiltSensitivity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={preferences.tiltSensitivity}
                onChange={(e) => updatePreferences({ tiltSensitivity: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Backup & Reset Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Data Management
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={exportData}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Import JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all tasks to initial demo seed tasks?')) {
                    resetToSeedData();
                  }
                }}
                className="flex items-center justify-center gap-1.5 w-full mt-1 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Seed Tasks
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
