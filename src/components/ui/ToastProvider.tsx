'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useTodo();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-white/15 dark:border-white/10 bg-slate-900/90 dark:bg-slate-950/90 p-4 shadow-glass-md backdrop-blur-xl text-white"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(toast.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{toast.description}</p>
                )}
              </div>

              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors border border-indigo-500/30 shrink-0"
                >
                  {toast.action.label}
                </button>
              )}

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
