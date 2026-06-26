/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// هيكل تحميل لبطاقات الإحصائيات (Card Skeletons)
export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-2.5 flex-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-16"></div>
        <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-36"></div>
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0"></div>
    </div>
  );
};

// هيكل تحميل الجداول (Table Row Skeletons)
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
      <div className="flex gap-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md flex-1"></div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4 items-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md flex-1"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md flex-1"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md flex-1 w-2/3"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// هيكل تحميل للرسوم البيانية (Chart Skeletons)
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-72 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-44"></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
      </div>
      <div className="flex-1 flex items-end justify-between gap-4 h-40">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t" style={{ height: `${20 + i * 13}%` }}></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-8"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
