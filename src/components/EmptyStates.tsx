/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, AlertTriangle, CloudOff, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  type?: 'search' | 'warning' | 'offline' | 'success';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  type = 'search',
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-16 h-16 text-amber-500 animate-bounce" />;
      case 'offline':
        return <CloudOff className="w-16 h-16 text-rose-500 animate-pulse" />;
      case 'success':
        return <CheckCircle2 className="w-16 h-16 text-indigo-500 animate-bounce" />;
      case 'search':
      default:
        return <Search className="w-16 h-16 text-slate-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all shadow-sm">
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-full inline-flex">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
