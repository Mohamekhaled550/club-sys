/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Bell, BellOff, Search, Trash2, Eye, EyeOff, CheckSquare, 
  ChevronRight, ChevronLeft, AlertTriangle, BadgeDollarSign, UserCheck, RefreshCw, X
} from 'lucide-react';
import { SystemNotification } from '../types';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface NotificationsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  notificationsList: SystemNotification[];
  setNotificationsList: React.Dispatch<React.SetStateAction<SystemNotification[]>>;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ 
  onAddToast, notificationsList, setNotificationsList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState('الكل');
  const [loading, setLoading] = useState(false);
  
  // ترقيم الصفحات
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  const notificationTypes = ["الكل", "تنبيه", "اشتراك", "دفع", "حضور", "تحديث"];

  // تصفية الإشعارات
  const filteredNotifications = useMemo(() => {
    let result = [...notificationsList];

    // 1. البحث
    if (searchTerm.trim() !== '') {
      result = result.filter(notif => 
        notif.title.includes(searchTerm) || 
        notif.content.includes(searchTerm)
      );
    }

    // 2. فلترة مقروء/غير مقروء
    if (statusTab === 'unread') {
      result = result.filter(notif => !notif.read);
    } else if (statusTab === 'read') {
      result = result.filter(notif => notif.read);
    }

    // 3. فلترة النوع
    if (typeFilter !== 'الكل') {
      result = result.filter(notif => notif.type === typeFilter);
    }

    return result;
  }, [notificationsList, searchTerm, statusTab, typeFilter]);

  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifs = useMemo(() => {
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, startIndex]);

  // تعليم الكل كمقروء
  const handleMarkAllRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    onAddToast('تم تعيين جميع الإشعارات المتاحة كمقروءة.', 'success');
  };

  // تفريغ الإشعارات
  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف وإزالة كافة الإشعارات والرسائل التنبيهية؟')) {
      setNotificationsList([]);
      onAddToast('تم حذف وإخلاء مركز التنبيهات بالكامل.', 'success');
      setCurrentPage(1);
    }
  };

  // تبديل حالة قراءة إشعار فردي
  const toggleReadStatus = (id: string, currentStatus: boolean) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: !currentStatus } : n));
    onAddToast(`تم تعيين التنبيه كـ ${!currentStatus ? 'مقروء' : 'غير مقروء'}.`, 'info');
  };

  // حذف إشعار فردي
  const handleDeleteNotif = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
    onAddToast('تم حذف التنبيه من السجلات الإشرافية.', 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة والتحكم الإجمالي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            مركز التنبيهات والإشعارات الفورية
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            متابعة إشعارات تجديد الباقات، العمليات الحسابية، وحركات الحضور والغياب المسجلة بالنظام.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleMarkAllRead}
            disabled={notificationsList.filter(n => !n.read).length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all disabled:opacity-40"
          >
            <CheckSquare className="w-4 h-4" />
            قراءة الكل
          </button>
          
          <button
            onClick={handleClearAll}
            disabled={notificationsList.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 transition-all disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            حذف الكل
          </button>
        </div>
      </div>

      {/* 2. تصفية مقروء/غير مقروء وفلاتر البحث */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* تبويبات الحالة */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs w-full">
          <button
            onClick={() => { setStatusTab('all'); setCurrentPage(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              statusTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'text-slate-500'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => { setStatusTab('unread'); setCurrentPage(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              statusTab === 'unread' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'text-slate-500'
            }`}
          >
            غير المقروءة ({notificationsList.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => { setStatusTab('read'); setCurrentPage(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              statusTab === 'read' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow' : 'text-slate-500'
            }`}
          >
            المقروءة
          </button>
        </div>

        {/* فئة التنبيه وحقل البحث */}
        <div className="flex-1 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث بمحتوى أو عنوان التنبيه..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pr-10 pl-4 py-2 bg-white dark:bg-slate-900 text-xs border border-slate-100 dark:border-slate-800 rounded-xl"
            />
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-bold flex-shrink-0">فلترة النوع:</span>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); triggerLoading(); }}
              className="px-3 py-2 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
            >
              {notificationTypes.map((t, idx) => (
                <option key={idx} value={t}>{t === 'الكل' ? 'كل الأنواع' : t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. قائمة التنبيهات المفلترة */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 rounded-2xl h-36"></div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState 
          title="مركز الإشعارات فارغ تماماً" 
          description="لا تتوفر أي إشعارات أو رسائل غير مقروءة تطابق معايير الفلترة الحالية." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedNotifs.map((notif) => {
            const isUnread = !notif.read;
            return (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnread 
                    ? 'bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-100/60 dark:border-indigo-900/20 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/60'
                }`}
              >
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black ${
                      notif.type === 'تنبيه' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                      notif.type === 'دفع' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                      notif.type === 'حضور' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      notif.type === 'اشتراك' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {notif.type}
                    </span>
                    
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    )}
                  </div>

                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{notif.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {notif.content}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/40 pt-3 mt-4">
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{notif.date}</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleReadStatus(notif.id, notif.read)}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 rounded-lg transition-colors cursor-pointer"
                      title={isUnread ? "تعليم كمقروء" : "تعليم كغير مقروء"}
                    >
                      {isUnread ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteNotif(notif.id)}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="حذف التنبيه"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. ترقيم الصفحات النشط */}
      {filteredNotifications.length > itemsPerPage && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">
            عرض <strong className="text-slate-700 dark:text-slate-200">{startIndex + 1}</strong> إلى{' '}
            <strong className="text-slate-700 dark:text-slate-200">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </strong>{' '}
            من أصل <strong className="text-slate-700 dark:text-slate-200">{totalItems}</strong> تنبيه
          </span>

          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }}
              className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
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
              onClick={() => { setCurrentPage(prev => prev + 1); triggerLoading(); }}
              className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
