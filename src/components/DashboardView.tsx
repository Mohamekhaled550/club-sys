/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, UserCheck, ShieldAlert, BadgeDollarSign, 
  TrendingUp, TrendingDown, ClipboardCheck, AlertTriangle,
  ArrowUpLeft, ArrowDownRight, Clock, CalendarDays
} from 'lucide-react';
import { 
  getSystemStats, transactions, todayAttendance, activityLogs, players 
} from '../data';
import { 
  FinancialsChart, SubscriptionsChart, AttendanceLineChart, 
  CoachesPerformanceChart, BestPlayersChart 
} from './CustomCharts';

interface DashboardViewProps {
  onNavigate: (page: string) => void;
  openAddPlayer: () => void;
  openAddTransaction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate, openAddPlayer, openAddTransaction 
}) => {
  const stats = getSystemStats();

  // جلب آخر المعاملات المالية (5 معاملات)
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // جلب آخر تسجيل حضور اليوم (5 سجلات)
  const recentAttendance = todayAttendance
    .filter(a => a.status === 'حاضر')
    .slice(0, 5);

  // جلب آخر تسجيل أنشطة (5 أنشطة)
  const recentLogs = activityLogs.slice(0, 5);

  // جلب آخر اللاعبين المضافين (5 لاعبين)
  const recentPlayers = players.slice(0, 5);

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة العلوية الترحيبية */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        {/* خلفية جمالية خفيفة */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-10 bottom-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <span className="text-indigo-400 text-xs font-black tracking-widest block">لوحة تحكم الأكاديمية</span>
          <h2 className="text-xl md:text-2xl font-black">أهلاً بك مجدداً في لوحة إدارة MK Technology</h2>
          <p className="text-slate-300 text-xs font-medium max-w-xl">
            نظام الإدارة الرياضية الموحد للأكاديمية. تابع إحصائيات اللاعبين والاشتراكات والمدفوعات اليومية والمخزون في مكان واحد.
          </p>
        </div>

        <div className="flex gap-2.5 relative z-10 w-full md:w-auto">
          <button 
            onClick={openAddPlayer}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 text-white"
          >
            <Users className="w-4 h-4" />
            إضافة لاعب
          </button>
          <button 
            onClick={openAddTransaction}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 text-white"
          >
            <BadgeDollarSign className="w-4 h-4" />
            تقييد عملية مالية
          </button>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات (11 بطاقة مطلوبة) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* اللاعبين */}
        <div 
          onClick={() => onNavigate('players')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">إجمالي اللاعبين</span>
            <span className="text-xl font-black text-slate-800 dark:text-white font-mono">{stats.playersCount}</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">100% مسجلين</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* الموظفين */}
        <div 
          onClick={() => onNavigate('staff')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">عدد الموظفين</span>
            <span className="text-xl font-black text-slate-800 dark:text-white font-mono">{stats.employeesCount}</span>
            <span className="text-[10px] text-slate-400 font-bold">إداري وفني وسكرتارية</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* المدربين */}
        <div 
          onClick={() => onNavigate('staff')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">عدد المدربين</span>
            <span className="text-xl font-black text-slate-800 dark:text-white font-mono">{stats.coachesCount}</span>
            <span className="text-[10px] text-amber-500 font-bold">كادر فني معتمد</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* الاشتراكات النشطة */}
        <div 
          onClick={() => onNavigate('players')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">الاشتراكات النشطة</span>
            <span className="text-xl font-black text-slate-800 dark:text-white font-mono">{stats.activeSubs}</span>
            <span className="text-[10px] text-indigo-500 font-bold">لاعبون منتظمون</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* الاشتراكات المنتهية */}
        <div 
          onClick={() => onNavigate('players')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">الاشتراكات المنتهية</span>
            <span className="text-xl font-black text-rose-500 font-mono">{stats.expiredSubs}</span>
            <span className="text-[10px] text-rose-400 font-bold">يتطلب تواصل فوري</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* الإيرادات */}
        <div 
          onClick={() => onNavigate('financials')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">إجمالي الإيرادات</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {stats.revenues.toLocaleString()} ر.س
            </span>
            <span className="text-[10px] text-slate-400 font-bold">الاشتراكات والمبيعات</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* المصروفات */}
        <div 
          onClick={() => onNavigate('financials')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">إجمالي المصروفات</span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">
              {stats.expenses.toLocaleString()} ر.س
            </span>
            <span className="text-[10px] text-slate-400 font-bold">الرواتب والمستلزمات</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* الأرباح */}
        <div 
          onClick={() => onNavigate('financials')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">صافي الأرباح</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              {stats.profits.toLocaleString()} ر.س
            </span>
            <span className="text-[10px] text-blue-500 font-bold">صافي الفائدة الفعلي</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* الحضور اليوم */}
        <div 
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">حضور اليوم</span>
            <span className="text-xl font-black text-indigo-600 font-mono">{stats.todayAttendanceCount}</span>
            <span className="text-[10px] text-indigo-500 font-bold">لاعب ومدرب وكادر</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

        {/* الغياب اليوم */}
        <div 
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">غياب اليوم</span>
            <span className="text-xl font-black text-rose-500 font-mono">{stats.todayAbsenceCount}</span>
            <span className="text-[10px] text-rose-400 font-bold">مسجلين غياب رسمي</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* أدوات المخزن الناقصة */}
        <div 
          onClick={() => onNavigate('settings')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block">الأدوات الناقصة</span>
            <span className="text-xl font-black text-amber-500 font-mono">{stats.lowStockItemsCount} items</span>
            <span className="text-[10px] text-amber-500 font-bold">تنبيه حرج بالمستودع</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. الرسوم البيانية (5 رسوم بيانية تفاعلية وموزعة بدقة) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* رسم بياني 1: الإيرادات والمصروفات */}
        <div className="lg:col-span-2">
          <FinancialsChart />
        </div>
        
        {/* رسم بياني 2: توزيع باقات الاشتراك */}
        <div>
          <SubscriptionsChart />
        </div>

        {/* رسم بياني 3: خط حضور اللاعبين والموظفين */}
        <div>
          <AttendanceLineChart />
        </div>

        {/* رسم بياني 4: تقييمات الكادر الفني والمدربين */}
        <div>
          <CoachesPerformanceChart />
        </div>

        {/* رسم بياني 5: اللاعبين الأكثر تفوقاً */}
        <div>
          <BestPlayersChart />
        </div>

      </div>

      {/* 4. جداول ومعاملات سريعة تحت لوحة التحكم */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* آخر المدفوعات والعمليات المالية */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <BadgeDollarSign className="w-5 h-5 text-indigo-500" />
              آخر المدفوعات والعمليات المقيدة
            </h3>
            <button 
              onClick={() => onNavigate('financials')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentTransactions.map((tx) => {
              const isRevenue = tx.type === 'إيراد';
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isRevenue ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50'
                    }`}>
                      {isRevenue ? <ArrowUpLeft className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{tx.category}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{tx.user}</p>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <span className={`text-xs font-mono font-black ${isRevenue ? 'text-indigo-600' : 'text-rose-600'}`}>
                      {isRevenue ? '+' : '-'}{tx.amount.toLocaleString()} ر.س
                    </span>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{tx.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* آخر تسجيلات الحضور الفوري والعمليات */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <ClipboardCheck className="w-5 h-5 text-blue-500" />
              آخر تسجيلات حضور اليوم في الصالة
            </h3>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> متاح فوري
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {recentAttendance.map((att, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200`}>
                    {att.personName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{att.personName}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                      att.role === 'لاعب' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      att.role === 'مدرب' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {att.role}
                    </span>
                  </div>
                </div>
                
                <div className="text-left space-y-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> حاضر
                  </span>
                  <p className="text-[9px] text-slate-400 font-mono text-left block">في {att.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
