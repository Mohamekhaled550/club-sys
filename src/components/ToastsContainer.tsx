/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastsContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastsContainer: React.FC<ToastsContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl border animate-fade-in transition-all duration-300 transform translate-y-0 ${
              isSuccess 
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-900/40' 
                : isError 
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-100 dark:border-rose-900/40' 
                : 'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-100 dark:border-blue-900/40'
            }`}
            style={{ direction: 'rtl' }}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />}
              <span className="text-xs font-bold leading-relaxed">{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
