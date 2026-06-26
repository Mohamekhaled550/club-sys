/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, BadgeDollarSign, History, Bell, 
  Settings, HelpCircle, User, LogOut, Sun, Moon, Laptop,
  Menu, X, Search, Globe, ChevronLeft, ArrowRight, Activity,
  Lock, Mail, Landmark, Sparkles, MessageSquare, Plus, Smartphone, Check, Clock,
  Heart, Calendar, CheckSquare, Award, Warehouse, ClipboardCheck, Building, BarChart3
} from 'lucide-react';

// استيراد البيانات والمكونات الفرعية الموديلية
import { 
  players, employees, coaches, transactions, notifications, activityLogs,
  parents, subscriptionTypes, attendanceRecords
} from './data';
import { 
  Player, Employee, Coach, Transaction, SystemNotification, ActivityLog,
  Parent, SubscriptionType, AttendanceRecord
} from './types';
import { DashboardView } from './components/DashboardView';
import { PlayersView } from './components/PlayersView';
import { ParentsView } from './components/ParentsView';
import { StaffView } from './components/StaffView';
import { AttendanceView } from './components/AttendanceView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { PaymentsView } from './components/PaymentsView';
import { CalendarView } from './components/CalendarView';
import { FinancialsView } from './components/FinancialsView';
import { LogsView } from './components/LogsView';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { AboutView } from './components/AboutView';
import { ProfileView } from './components/ProfileView';
import { InventoryView } from './components/InventoryView';
import { EquipmentView } from './components/EquipmentView';
import { RentalsView } from './components/RentalsView';
import { ReportsView } from './components/ReportsView';
import { ToastsContainer, ToastMessage } from './components/ToastsContainer';

export default function App() {
  // 1. حالات الصفحات والتنقل والمنصة
  const [currentPage, setCurrentPage] = useState<string>('splash');
  const [currentPlatform, setCurrentPlatform] = useState<'web' | 'mobile'>('web');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  // 2. حالات قواعد البيانات (اللاعبون، الموظفون، المدربون، العمليات، الإشعارات، السجلات)
  const [playersList, setPlayersList] = useState<Player[]>(players);
  const [parentsList, setParentsList] = useState<Parent[]>(parents);
  const [employeesList, setEmployeesList] = useState<Employee[]>(employees);
  const [coachesList, setCoachesList] = useState<Coach[]>(coaches);
  const [subscriptionTypesList, setSubscriptionTypesList] = useState<SubscriptionType[]>(subscriptionTypes);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(attendanceRecords);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>(transactions);
  const [notificationsList, setNotificationsList] = useState<SystemNotification[]>(notifications);
  const [logsList, setLogsList] = useState<ActivityLog[]>(activityLogs);

  // 3. حالة التنبيهات المنبثقة (Toasts)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 4. حالات تسجيل الدخول واستعادة المرور
  const [emailInput, setEmailInput] = useState('khaledsallleeem@gmail.com');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  
  // حالات تفصيلية للبحث العالمي ومربعات الحوار المخصصة من الـ FAB
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // محاكي حالة تحميل سريعة
  const [isLoadingState, setIsLoadingState] = useState(false);

  // تفعيل وإلغاء الوضع الليلي
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // دالة لتوليد وعرض رسالة منبثقة (Toast Notification)
  const addToast = (text: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // إزالة تلقائية بعد 4 ثوانٍ
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // معالجة تسجيل الدخول الفوري
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      addToast('يرجى كتابة البريد الإلكتروني وكلمة المرور للدخول!', 'error');
      return;
    }
    
    setIsLoadingState(true);
    addToast('جاري التحقق من أوراق الاعتماد الحماية...', 'info');
    
    setTimeout(() => {
      setIsLoadingState(false);
      setCurrentPage('dashboard');
      addToast('تم تسجيل الدخول بنجاح! مرحباً بك في لوحة تحكم MK Technology.', 'success');
      
      // تسجيل نشاط جديد في السجل
      const logId = `نشاط-${logsList.length + 1}`;
      const newLog: ActivityLog = {
        id: logId,
        user: "م. خالد سليم",
        action: "تسجيل دخول للنظام",
        date: "2026-06-26 11:30:00",
        details: "تم بنجاح تسجيل الدخول للوحة الإشراف من خلال واجهة الويب.",
        type: "أخرى"
      };
      setLogsList(prev => [newLog, ...prev]);
    }, 800);
  };

  // معالجة استعادة كلمة المرور
  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      addToast('يرجى تدوين بريدك الإلكتروني أولاً!', 'error');
      return;
    }
    
    addToast('جاري إرسال رابط استرجاع الأمان لبريدك...', 'info');
    setTimeout(() => {
      addToast(`تم إرسال تعليمات إعادة التشفير بنجاح للبريد الإلكتروني: ${recoveryEmail}`, 'success');
      setCurrentPage('login');
    }, 900);
  };

  // تسجيل الخروج
  const handleLogout = () => {
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج وإقفال الجلسة الحالية؟')) {
      setCurrentPage('login');
      addToast('تم إغلاق الجلسة وتأمين الخروج بنجاح.', 'info');
    }
  };

  // تبديل وتغيير المنصة مع توست توضيحي
  const handlePlatformSwitch = (platform: 'web' | 'mobile') => {
    setCurrentPlatform(platform);
    addToast(`تم التبديل بنجاح لـ ${platform === 'web' ? 'منصة الويب المتكاملة' : 'محاكي تطبيق الجوال الذكي'}!`, 'success');
  };

  // البحث العالمي الذكي وتوجيه الصفحة
  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearchTerm.trim()) return;
    
    addToast(`جاري البحث الفوري عن: "${globalSearchTerm}" عبر كافة الجداول واللاعبين...`, 'info');
    
    // توجيه تلقائي لصفحة اللاعبين وتعيين البحث هناك
    setCurrentPage('players');
    setGlobalSearchTerm('');
  };

  // حوارات سريعة من الـ FAB أو الترويسة
  const [quickAddPlayerOpen, setQuickAddPlayerOpen] = useState(false);
  const [quickAddTxOpen, setQuickAddTxOpen] = useState(false);

  // رصد عدد الإشعارات غير المقروءة
  const unreadNotificationsCount = notificationsList.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen font-sans antialiased text-slate-800 dark:text-slate-200 transition-colors duration-200 ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* سلة الإشعارات المنبثقة العامة */}
      <ToastsContainer toasts={toasts} removeToast={removeToast} />

      {/* ========================================================= */}
      {/* 1. شاشة البداية والتحميل (SPLASH SCREEN) */}
      {/* ========================================================= */}
      {currentPage === 'splash' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white px-4 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_100%)]"></div>
          
          <div className="space-y-6 max-w-md relative z-10">
            {/* أيقونة الشعار الرياضي المتحرك */}
            <div className="mx-auto w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-2 shadow-2xl animate-bounce">
              <div className="w-full h-full rounded-xl bg-indigo-600 flex items-center justify-center font-black text-4xl text-white">
                MK
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-indigo-400 text-xs font-black tracking-widest block uppercase">إصدار الأمان العالي 2026</span>
              <h1 className="text-2xl md:text-3xl font-black">نظام إدارة الأكاديمية الرياضية الموحد</h1>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                الحل التقني المتكامل لإدارة شؤون اللاعبين، المدربين، عقود الاشتراكات، الحركات المالية، ومستودعات الأكاديمية.
              </p>
            </div>

            {/* شريط التحميل الأنيق */}
            <div className="w-56 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-1/2 rounded-full animate-shimmer absolute"></div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={() => {
                  setCurrentPage('login');
                  addToast('مرحباً بك في بوابة الأمان لتسجيل الدخول.', 'info');
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                الدخول للنظام
              </button>
              
              <p className="text-[10px] text-slate-500 font-bold">
                تطوير وهندسة رقمية متميزة بواسطة MK Technology © 2026
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. شاشة تسجيل الدخول (LOGIN SCREEN) */}
      {/* ========================================================= */}
      {currentPage === 'login' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900 px-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/80"></div>
          
          <div className="bg-white dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-100 dark:border-slate-900 p-8 max-w-md w-full text-right space-y-6 shadow-2xl relative z-10 transition-all">
            
            <div className="space-y-1.5 text-center">
              <span className="text-[10px] font-black text-indigo-500 tracking-wider uppercase">بوابة الأمان الموحدة</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">تسجيل الدخول للنظام الرياضي</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                يرجى إدخال البريد الإلكتروني وكلمة المرور المعتمدين من الإدارة للوصول للوحة التحكم.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1.5">البريد الإلكتروني المعتمد *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="khaledsallleeem@gmail.com"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left text-slate-800 dark:text-white"
                  />
                  <Mail className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">كلمة المرور المشفرة *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage('forget_password');
                      addToast('تم فتح صفحة استعادة الأمان.', 'info');
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline font-bold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="******"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-left text-slate-800 dark:text-white"
                  />
                  <Lock className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoadingState}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoadingState ? 'جاري التحقق...' : 'تسجيل دخول آمن'}
                </button>
              </div>

            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-900 text-center space-y-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block leading-normal">
                برمجيات وإدارة تكنولوجية مؤمنة 100%
              </span>
              <span className="text-[10px] text-indigo-500 font-extrabold block">
                مطور بواسطة MK Technology
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. شاشة استعادة كلمة المرور (FORGET PASSWORD) */}
      {/* ========================================================= */}
      {currentPage === 'forget_password' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900 px-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/80"></div>
          
          <div className="bg-white dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-100 dark:border-slate-900 p-8 max-w-md w-full text-right space-y-6 shadow-2xl relative z-10 transition-all animate-fade-in">
            
            <div className="space-y-1.5 text-center">
              <span className="text-[10px] font-black text-amber-500 tracking-wider uppercase">استعادة الصلاحيات</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">نسيت كلمة المرور؟</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                أدخل بريدك الإلكتروني الإداري وسيقوم خادم الحماية بإرسال رمز إعادة تعيين التشفير فوراً.
              </p>
            </div>

            <form onSubmit={handleRecovery} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1.5">البريد الإلكتروني المسجل *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="khaledsallleeem@gmail.com"
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left text-slate-800 dark:text-white"
                  />
                  <Mail className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center"
                >
                  إرسال تعليمات الاستعادة
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-all text-center"
                >
                  رجوع
                </button>
              </div>

            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-900 text-center">
              <span className="text-[10px] text-slate-400 font-semibold block leading-normal">
                في حال استمرار التعذر، يرجى التواصل مع فريق الدعم الفني لشركة MK Technology.
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. لوحة الإدارة المتكاملة (PLATFORM CONTROLLER - WEB VS MOBILE APP) */}
      {/* ========================================================= */}
      {currentPage !== 'splash' && currentPage !== 'login' && currentPage !== 'forget_password' && (
        <div className="flex flex-col min-h-screen">
          
          {/* شريط تبديل العرض العلوي والتحكم العام بالنظام (MASTER VIEW CONTROLLER BAR) */}
          <div className="bg-slate-900 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 relative z-30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-1 shadow-lg">
                <div className="w-full h-full bg-indigo-500 rounded-lg flex items-center justify-center font-black text-[11px] text-white">
                  MK
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-xs font-black">نظام إدارة أكاديمية MK الرياضية</h1>
                <span className="text-[9px] text-slate-400 font-semibold block">مطور بتقنية React 19 + Capacitor</span>
              </div>
            </div>

            {/* مفاتيح التبديل بين واجهة الويب الكاملة وتطبيق الجوال الذكي (Two separate designs!) */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => handlePlatformSwitch('web')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                  currentPlatform === 'web' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4" />
                لوحة الويب الكاملة (Web View)
              </button>
              
              <button
                onClick={() => handlePlatformSwitch('mobile')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                  currentPlatform === 'mobile' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                تطبيق الجوال الذكي (Mobile Simulator)
              </button>
            </div>

            {/* مفتاح الوضع الليلي والنهاري وطلب تسجيل الخروج */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </div>
          </div>

          {/* ==================================================== */}
          {/* أ. عرض واجهة الويب الكاملة (WEB LAYOUT DESIGN) */}
          {/* ==================================================== */}
          {currentPlatform === 'web' ? (
            <div className="flex-1 flex relative">
              
              {/* القائمة الجانبية الاحترافية (RTL SIDEBAR) */}
              <aside className={`bg-[#1a237e] dark:bg-[#0b0e37] border-l border-indigo-900/30 transition-all duration-300 flex flex-col z-20 text-white ${
                sidebarOpen ? 'w-64' : 'w-0 overflow-hidden sm:w-20'
              }`}>
                {/* روابط التنقل الرئيسية */}
                <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
                  
                  {[
                    { id: 'dashboard', label: 'لوحة التحكم', icon: Activity },
                    { id: 'players', label: 'إدارة اللاعبين', icon: Users },
                    { id: 'parents', label: 'أولياء الأمور', icon: Heart },
                    { id: 'staff', label: 'الكادر والمدربين', icon: UserCheck },
                    { id: 'attendance', label: 'الحضور والانصراف', icon: CheckSquare },
                    { id: 'subscriptions', label: 'باقات الاشتراكات', icon: Award },
                    { id: 'payments', label: 'الحسابات والمدفوعات', icon: BadgeDollarSign },
                    { id: 'calendar', label: 'الحصص والملاعب', icon: Calendar },
                    { id: 'inventory', label: 'المخازن والموردين', icon: Warehouse },
                    { id: 'equipment', label: 'عهد ومعدات المدربين', icon: ClipboardCheck },
                    { id: 'rentals', label: 'إيجارات الملاعب', icon: Building },
                    { id: 'reports', label: 'التقارير الذكية BI', icon: BarChart3 },
                    { id: 'logs', label: 'سجل العمليات', icon: History },
                    { id: 'notifications', label: 'مركز التنبيهات', icon: Bell, badge: unreadNotificationsCount },
                    { id: 'profile', label: 'الملف الشخصي', icon: User },
                    { id: 'settings', label: 'إعدادات النظام', icon: Settings },
                    { id: 'about', label: 'عن المنظومة', icon: HelpCircle },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentPage(item.id);
                          if (window.innerWidth < 640) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition-all duration-200 group cursor-pointer ${
                          isActive 
                            ? 'bg-white/10 text-white border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                            : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} />
                          {sidebarOpen && <span>{item.label}</span>}
                        </div>
                        {item.badge && item.badge > 0 && sidebarOpen && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono ${isActive ? 'bg-white text-[#1a237e]' : 'bg-rose-500 text-white'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}

                </div>

                {/* كرت المطور السفلي */}
                {sidebarOpen && (
                  <div className="p-4 border-t border-indigo-900/40 text-center space-y-1">
                    <span className="text-[10px] text-indigo-300 font-bold block">مطور ومرخص بالكامل لـ</span>
                    <span className="text-[11px] text-white font-black block">أكاديمية MK الرياضية</span>
                    <span className="text-[9px] text-orange-400 font-extrabold block">MK Technology © 2026</span>
                  </div>
                )}
              </aside>

              {/* منطقة المحتوى والترويسة الرئيسية للويب */}
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* الترويسة الرئيسية للويب (WEB HEADER) */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                    >
                      <Menu className="w-4 h-4" />
                    </button>

                    {/* محرك البحث العالمي */}
                    <form onSubmit={handleGlobalSearchSubmit} className="hidden md:flex items-center relative w-72">
                      <input
                        type="text"
                        placeholder="بحث عالمي فوري في النظام..."
                        value={globalSearchTerm}
                        onChange={(e) => setGlobalSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-100 dark:border-slate-800 rounded-xl"
                      />
                      <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                    </form>
                  </div>

                  <div className="flex items-center gap-4">
                    
                    {/* أيقونة الإشعارات السريعة كقائمة منسدلة */}
                    <div className="relative">
                      <button
                        onClick={() => { setShowNotificationsDropdown(!showNotificationsDropdown); setShowProfileDropdown(false); }}
                        className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl relative cursor-pointer"
                      >
                        <Bell className="w-4.5 h-4.5" />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                      </button>

                      {showNotificationsDropdown && (
                        <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-30 text-right space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
                            <span className="text-xs font-black text-slate-800 dark:text-white">مركز التنبيهات الفوري</span>
                            <button 
                              onClick={() => { setCurrentPage('notifications'); setShowNotificationsDropdown(false); }}
                              className="text-[10px] text-indigo-600 font-bold hover:underline"
                            >
                              عرض الكل
                            </button>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {notificationsList.slice(0, 4).map((notif) => (
                              <div key={notif.id} className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg text-[11px] leading-relaxed">
                                <p className="font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] truncate">{notif.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* الملف الشخصي للمستخدم والمنسدلة السريعة */}
                    <div className="relative">
                      <div 
                        onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotificationsDropdown(false); }}
                        className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                          خ
                        </div>
                        <div className="hidden sm:block text-right">
                          <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-none">م. خالد سليم</h4>
                          <span className="text-[9px] text-slate-400 font-bold">المدير العام</span>
                        </div>
                      </div>

                      {showProfileDropdown && (
                        <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-2.5 shadow-xl z-30 text-right space-y-1">
                          <button
                            onClick={() => { setCurrentPage('profile'); setShowProfileDropdown(false); }}
                            className="w-full text-right px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 block"
                          >
                            الملف الشخصي
                          </button>
                          <button
                            onClick={() => { setCurrentPage('settings'); setShowProfileDropdown(false); }}
                            className="w-full text-right px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 block"
                          >
                            إعدادات الأكاديمية
                          </button>
                          <button
                            onClick={() => { setCurrentPage('about'); setShowProfileDropdown(false); }}
                            className="w-full text-right px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 block"
                          >
                            حول النظام
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-right px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-xs font-bold text-rose-500 block"
                          >
                            تسجيل الخروج
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </header>

                {/* منطقة العمليات والمحتوى للويب (WEB CONTENT CONTAINER) */}
                <main className="flex-1 overflow-y-auto p-6 relative">
                  
                  {currentPage === 'dashboard' && (
                    <DashboardView 
                      onNavigate={setCurrentPage} 
                      openAddPlayer={() => setQuickAddPlayerOpen(true)}
                      openAddTransaction={() => setQuickAddTxOpen(true)}
                    />
                  )}
                  {currentPage === 'players' && (
                    <PlayersView 
                      onAddToast={addToast} 
                      playersList={playersList} 
                      setPlayersList={setPlayersList} 
                    />
                  )}
                  {currentPage === 'parents' && (
                    <ParentsView 
                      onAddToast={addToast} 
                      parentsList={parentsList} 
                      setParentsList={setParentsList} 
                      playersList={playersList} 
                    />
                  )}
                  {currentPage === 'staff' && (
                    <StaffView 
                      onAddToast={addToast} 
                      employeesList={employeesList} 
                      setEmployeesList={setEmployeesList} 
                      coachesList={coachesList} 
                      setCoachesList={setCoachesList} 
                    />
                  )}
                  {currentPage === 'attendance' && (
                    <AttendanceView 
                      onAddToast={addToast} 
                      attendanceList={attendanceList} 
                      setAttendanceList={setAttendanceList} 
                      playersList={playersList} 
                      employeesList={employeesList} 
                      coachesList={coachesList} 
                    />
                  )}
                  {currentPage === 'subscriptions' && (
                    <SubscriptionsView 
                      onAddToast={addToast} 
                      playersList={playersList} 
                      setPlayersList={setPlayersList} 
                      subscriptionTypesList={subscriptionTypesList} 
                      setSubscriptionTypesList={setSubscriptionTypesList} 
                    />
                  )}
                  {currentPage === 'payments' && (
                    <PaymentsView 
                      onAddToast={addToast} 
                      transactionsList={transactionsList} 
                      setTransactionsList={setTransactionsList} 
                      playersList={playersList} 
                    />
                  )}
                  {currentPage === 'calendar' && (
                    <CalendarView 
                      onAddToast={addToast} 
                      coachesList={coachesList} 
                      playersList={playersList} 
                    />
                  )}
                  {currentPage === 'financials' && (
                    <FinancialsView 
                      onAddToast={addToast} 
                      transactionsList={transactionsList} 
                      setTransactionsList={setTransactionsList} 
                    />
                  )}
                  {currentPage === 'logs' && (
                    <LogsView 
                      onAddToast={addToast} 
                      logsList={logsList} 
                      setLogsList={setLogsList} 
                    />
                  )}
                  {currentPage === 'inventory' && (
                    <InventoryView 
                      onAddToast={addToast} 
                    />
                  )}
                  {currentPage === 'equipment' && (
                    <EquipmentView 
                      onAddToast={addToast} 
                    />
                  )}
                  {currentPage === 'rentals' && (
                    <RentalsView 
                      onAddToast={addToast} 
                    />
                  )}
                  {currentPage === 'reports' && (
                    <ReportsView />
                  )}
                  {currentPage === 'notifications' && (
                    <NotificationsView 
                      onAddToast={addToast} 
                      notificationsList={notificationsList} 
                      setNotificationsList={setNotificationsList} 
                    />
                  )}
                  {currentPage === 'profile' && (
                    <ProfileView onAddToast={addToast} />
                  )}
                  {currentPage === 'settings' && (
                    <SettingsView onAddToast={addToast} />
                  )}
                  {currentPage === 'about' && (
                    <AboutView />
                  )}

                </main>

              </div>

            </div>
          ) : (
            // ====================================================
            // ب. عرض تطبيق الجوال الذكي (MOBILE APP SIMULATOR DESIGN)
            // ====================================================
            <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto relative">
              
              {/* محاكي إطار هاتف ذكي فاخر جداً */}
              <div className="w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[50px] p-3.5 border-4 border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
                
                {/* النوتش العلوي للهاتف (Dynamic Island / Notch) */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-slate-800 mr-20"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900/60"></span>
                </div>

                {/* شاشة الهاتف الداخلية */}
                <div className={`flex-1 rounded-[38px] overflow-hidden flex flex-col relative ${
                  darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
                }`}>
                  
                  {/* شريط معلومات الهاتف العلوي (Carrier/Time/Battery) */}
                  <div className="bg-slate-900 text-slate-300 text-[10px] font-bold px-6 pt-3.5 pb-2 flex justify-between items-center z-30 font-mono">
                    <span className="font-sans">MK Mobile</span>
                    <span>11:30 م</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>78%</span>
                    </div>
                  </div>

                  {/* ترويسة تطبيق الجوال (MOBILE APP HEADER) */}
                  <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-xs text-white">
                        MK
                      </div>
                      <span className="text-[11px] font-black">أكاديمية MK</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => setCurrentPage('notifications')}
                        className="p-1.5 bg-slate-800 rounded-lg text-slate-300 relative"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        )}
                      </button>
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-1.5 bg-slate-800 rounded-lg text-slate-300"
                      >
                        {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* منطقة المحتوى الداخلي لتطبيق الجوال (متحركة ومتوافقة مع اللمس) */}
                  <div className="flex-1 overflow-y-auto p-3.5 pb-20 relative">
                    
                    {currentPage === 'dashboard' && (
                      <DashboardView 
                        onNavigate={setCurrentPage} 
                        openAddPlayer={() => setQuickAddPlayerOpen(true)}
                        openAddTransaction={() => setQuickAddTxOpen(true)}
                      />
                    )}
                    {currentPage === 'players' && (
                      <PlayersView 
                        onAddToast={addToast} 
                        playersList={playersList} 
                        setPlayersList={setPlayersList} 
                      />
                    )}
                    {currentPage === 'parents' && (
                      <ParentsView 
                        onAddToast={addToast} 
                        parentsList={parentsList} 
                        setParentsList={setParentsList} 
                        playersList={playersList} 
                      />
                    )}
                    {currentPage === 'staff' && (
                      <StaffView 
                        onAddToast={addToast} 
                        employeesList={employeesList} 
                        setEmployeesList={setEmployeesList} 
                        coachesList={coachesList} 
                        setCoachesList={setCoachesList} 
                      />
                    )}
                    {currentPage === 'attendance' && (
                      <AttendanceView 
                        onAddToast={addToast} 
                        attendanceList={attendanceList} 
                        setAttendanceList={setAttendanceList} 
                        playersList={playersList} 
                        employeesList={employeesList} 
                        coachesList={coachesList} 
                      />
                    )}
                    {currentPage === 'subscriptions' && (
                      <SubscriptionsView 
                        onAddToast={addToast} 
                        playersList={playersList} 
                        setPlayersList={setPlayersList} 
                        subscriptionTypesList={subscriptionTypesList} 
                        setSubscriptionTypesList={setSubscriptionTypesList} 
                      />
                    )}
                    {currentPage === 'payments' && (
                      <PaymentsView 
                        onAddToast={addToast} 
                        transactionsList={transactionsList} 
                        setTransactionsList={setTransactionsList} 
                        playersList={playersList} 
                      />
                    )}
                    {currentPage === 'calendar' && (
                      <CalendarView 
                        onAddToast={addToast} 
                        coachesList={coachesList} 
                        playersList={playersList} 
                      />
                    )}
                    {currentPage === 'financials' && (
                      <FinancialsView 
                        onAddToast={addToast} 
                        transactionsList={transactionsList} 
                        setTransactionsList={setTransactionsList} 
                      />
                    )}
                    {currentPage === 'logs' && (
                      <LogsView 
                        onAddToast={addToast} 
                        logsList={logsList} 
                        setLogsList={setLogsList} 
                      />
                    )}
                    {currentPage === 'notifications' && (
                      <NotificationsView 
                        onAddToast={addToast} 
                        notificationsList={notificationsList} 
                        setNotificationsList={setNotificationsList} 
                      />
                    )}
                    {currentPage === 'profile' && (
                      <ProfileView onAddToast={addToast} />
                    )}
                    {currentPage === 'settings' && (
                      <SettingsView onAddToast={addToast} />
                    )}
                    {currentPage === 'about' && (
                      <AboutView />
                    )}

                  </div>

                  {/* شريط الإجراءات السريعة (Quick Actions Modal / Sheet) */}
                  {showQuickActions && (
                    <div className="absolute inset-x-0 bottom-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-t-3xl p-4 shadow-2xl z-40 text-right animate-fade-in space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-xs font-black text-slate-800 dark:text-white">إجراءات سريعة فورية</span>
                        <button 
                          onClick={() => setShowQuickActions(false)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => { setQuickAddPlayerOpen(true); setShowQuickActions(false); }}
                          className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-bold flex flex-col items-center gap-1.5"
                        >
                          <Users className="w-5 h-5 text-blue-500" />
                          تسجيل لاعب
                        </button>
                        <button
                          onClick={() => { setQuickAddTxOpen(true); setShowQuickActions(false); }}
                          className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-bold flex flex-col items-center gap-1.5"
                        >
                          <BadgeDollarSign className="w-5 h-5 text-indigo-500" />
                          تقييد مالي
                        </button>
                        <button
                          onClick={() => { setCurrentPage('logs'); setShowQuickActions(false); }}
                          className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-bold flex flex-col items-center gap-1.5"
                        >
                          <History className="w-5 h-5 text-purple-500" />
                          سجل الأنشطة
                        </button>
                        <button
                          onClick={() => { setDarkMode(!darkMode); setShowQuickActions(false); }}
                          className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-bold flex flex-col items-center gap-1.5"
                        >
                          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                          مفتاح المظهر
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Navigation للموبايل (MOBILE BOTTOM NAVIGATION) */}
                  <nav className="absolute inset-x-0 bottom-0 bg-slate-900 text-slate-400 border-t border-slate-800 h-16 flex items-center justify-around px-2 z-30">
                    
                    <button
                      onClick={() => { setCurrentPage('dashboard'); setShowQuickActions(false); }}
                      className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                        currentPage === 'dashboard' ? 'text-indigo-400' : 'hover:text-white'
                      }`}
                    >
                      <Activity className="w-4.5 h-4.5" />
                      الرئيسية
                    </button>

                    <button
                      onClick={() => { setCurrentPage('players'); setShowQuickActions(false); }}
                      className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                        currentPage === 'players' ? 'text-indigo-400' : 'hover:text-white'
                      }`}
                    >
                      <Users className="w-4.5 h-4.5" />
                      اللاعبين
                    </button>

                    {/* زر الـ FAB المركزي للإجراءات السريعة */}
                    <div className="relative -top-3">
                      <button
                        onClick={() => setShowQuickActions(!showQuickActions)}
                        className="w-11 h-11 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center transition-transform active:scale-95 cursor-pointer hover:rotate-45"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>

                    <button
                      onClick={() => { setCurrentPage('financials'); setShowQuickActions(false); }}
                      className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                        currentPage === 'financials' ? 'text-indigo-400' : 'hover:text-white'
                      }`}
                    >
                      <BadgeDollarSign className="w-4.5 h-4.5" />
                      المالية
                    </button>

                    <button
                      onClick={() => { setCurrentPage('settings'); setShowQuickActions(false); }}
                      className={`flex flex-col items-center gap-1 text-[9px] font-bold ${
                        currentPage === 'settings' ? 'text-indigo-400' : 'hover:text-white'
                      }`}
                    >
                      <Settings className="w-4.5 h-4.5" />
                      الإعدادات
                    </button>

                  </nav>

                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* 5. نماذج حوارات سريعة من الـ FAB أو Dashboard */}
      {/* ========================================================= */}
      {quickAddPlayerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in text-xs font-semibold">
            <button
              onClick={() => setQuickAddPlayerOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Users className="w-5 h-5 text-indigo-500" />
              سند تسجيل لاعب جديد (إجراء سريع)
            </h3>
            <PlayersView 
              onAddToast={addToast} 
              playersList={playersList} 
              setPlayersList={setPlayersList} 
            />
            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setQuickAddPlayerOpen(false)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {quickAddTxOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in text-xs font-semibold">
            <button
              onClick={() => setQuickAddTxOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BadgeDollarSign className="w-5 h-5 text-indigo-500" />
              تقييد معاملة مالية فوري (إجراء سريع)
            </h3>
            <FinancialsView 
              onAddToast={addToast} 
              transactionsList={transactionsList} 
              setTransactionsList={setTransactionsList} 
            />
            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => setQuickAddTxOpen(false)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
