/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  History, Search, Filter, ChevronRight, ChevronLeft, 
  Trash2, Database, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { ActivityLog } from '../types';
import { activityLogs } from '../data';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface LogsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  logsList: ActivityLog[];
  setLogsList: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
}

export const LogsView: React.FC<LogsViewProps> = ({ 
  onAddToast, logsList, setLogsList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('الكل');
  const [loading, setLoading] = useState(false);
  
  // ترقيم الصفحات
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  // فلاتر البحث والفلترة للملاحظات
  const filteredLogs = useMemo(() => {
    let result = [...logsList];

    if (searchTerm.trim() !== '') {
      result = result.filter(log => 
        log.action.includes(searchTerm) || 
        log.user.includes(searchTerm) || 
        log.details.includes(searchTerm)
      );
    }

    if (selectedType !== 'الكل') {
      result = result.filter(log => log.type === selectedType);
    }

    return result;
  }, [logsList, searchTerm, selectedType]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, startIndex]);

  // مسح السجل كاملاً
  const handleClearLogs = () => {
    if (confirm('تنبيه أمني: هل أنت متأكد من رغبتك في تصفير وأرشفة سجل العمليات بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setLogsList([]);
      onAddToast('تم تصفير وأرشفة سجل العمليات والأنشطة الإدارية بنجاح.', 'success');
      setCurrentPage(1);
    }
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة وأزرار التحكم */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" />
            سجل العمليات والأنشطة الإدارية
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            مراقبة وتتبع العمليات التي يقوم بها المشرفون والموظفون والمدربون فلياً داخل النظام لضمان النزاهة والأمان المالي.
          </p>
        </div>

        <button
          onClick={handleClearLogs}
          disabled={logsList.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          تصفير وأرشفة السجل
        </button>
      </div>

      {/* 2. شريط البحث والتصفية */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* حقل البحث */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث بالعملية، المسؤول، أو تفاصيل الإجراء..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* نوع العملية */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0">نوع الإجراء:</span>
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل العمليات</option>
            <option value="إضافة">إضافات جديدة (+)</option>
            <option value="تعديل">تعديلات وتصحيح</option>
            <option value="حذف">عمليات شطب وحذف (-)</option>
            <option value="تسجيل">تسجيل حضور وغياب</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

      </div>

      {/* 3. عرض قائمة السجلات */}
      {loading ? (
        <TableSkeleton rows={12} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState 
          title="سجل الأنشطة فارغ حالياً" 
          description="لا تتوفر أي حركات مسجلة تطابق محددات البحث الحالية، أو أن الأرشيف تم تفريغه." 
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4">رقم الحركة</th>
                  <th className="p-4">نوع الإجراء</th>
                  <th className="p-4">الإجراء والعملية</th>
                  <th className="p-4">توضيح العملية التفصيلي</th>
                  <th className="p-4">الموظف المسؤول</th>
                  <th className="p-4">الوقت والتاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {paginatedLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-mono text-slate-400">{log.id}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          log.type === 'إضافة' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' :
                          log.type === 'تعديل' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                          log.type === 'حذف' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                          log.type === 'تسجيل' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900 dark:text-slate-100">{log.action}</td>
                      <td className="p-4 text-slate-500 max-w-sm truncate">{log.details}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-extrabold">{log.user}</td>
                      <td className="p-4 font-mono text-slate-400">{log.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ترقيم سجلات العمليات */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">
              عرض <strong className="text-slate-700 dark:text-slate-200">{startIndex + 1}</strong> إلى{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </strong>{' '}
              من أصل <strong className="text-slate-700 dark:text-slate-200">{totalItems}</strong> نشاط مرصود
            </span>

            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* ترقيم ذكي */}
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(pageNum); triggerLoading(); }}
                    className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${
                      currentPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
