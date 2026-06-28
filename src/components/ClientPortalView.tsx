/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, Award, Calendar as CalendarIcon, CheckSquare, Clock, Heart, 
  HelpCircle, MessageSquare, Plus, Search, Star, Trophy, Users, 
  ArrowRight, Shield, Flame, Globe, Mail, Phone, MapPin, 
  CheckCircle, PlusCircle, LayoutGrid, DollarSign, FileText, 
  X, RefreshCw, Send, Sparkles, LogOut, Check, UserCheck,
  Bell, ChevronLeft, ChevronRight, User, Compass, Dumbbell,
  Wallet, CreditCard, MessageCircle, BarChart3, ChevronDown,
  Filter, QrCode, Sliders, Play, Info, MoreHorizontal, Moon,
  Sun, Languages, Eye, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Parent, Coach, Transaction, AttendanceRecord } from '../types';

interface ClientPortalViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  parentsList: Parent[];
  coachesList: Coach[];
  transactionsList: Transaction[];
  onNavigateToWebsite: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  onAddToast,
  playersList,
  parentsList,
  coachesList,
  transactionsList,
  onNavigateToWebsite
}) => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'player' | 'parent'>('player');
  const [phoneNumber, setPhoneNumber] = useState('0551234567');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Active portal states - Nike/Strava inspired navigation tabs
  const [portalTab, setPortalTab] = useState<'home' | 'schedule' | 'attendance' | 'subscription' | 'payments' | 'booking' | 'achievements' | 'coaches' | 'chat'>('home');
  
  // Collapse sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // App Theme/Setting presets (mock but functional visual reactions)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [showNotifications, setShowNotifications] = useState(false);

  // Skeleton loading simulation when tabs switch
  const [tabLoading, setTabLoading] = useState(false);

  // Active kid ID for parents
  const [selectedKidId, setSelectedKidId] = useState<string>('');

  // Forms states
  const [freezeDays, setFreezeDays] = useState(15);
  const [freezeReason, setFreezeReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('2026-06-29');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');

  // Playground booking states
  const [bookingPitch, setBookingPitch] = useState('الملعب الخماسي المغطى');
  const [bookingDate, setBookingDate] = useState('2026-06-28');
  const [bookingTime, setBookingTime] = useState('08:00 مساءً');
  const [bookingDuration, setBookingDuration] = useState(2);
  const [activeQrTicket, setActiveQrTicket] = useState<any>(null);

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'system', text: string, time: string, isAudio?: boolean }>>([
    { sender: 'system', text: 'مرحباً بك في مستشار الأشوال الذكي. نحن هنا لمرافقتك وبطلك نحو القمة الرياضية.', time: '10:15 ص' }
  ]);

  // Selected coach detail state
  const [selectedCoachId, setSelectedCoachId] = useState<string>('مدرب-1');

  // Trigger skeleton loading animation
  const handleTabChange = (tab: typeof portalTab) => {
    setTabLoading(true);
    setPortalTab(tab);
    const timer = setTimeout(() => setTabLoading(false), 550);
    return () => clearTimeout(timer);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.startsWith('05') || phoneNumber.length < 10) {
      onAddToast('يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05!', 'error');
      return;
    }
    setShowOtpInput(true);
    onAddToast('تم إرسال رمز التحقق OTP (1234) المكون من 4 أرقام لهاتفك بنجاح.', 'success');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode !== '123456') {
      onAddToast('كود التحقق غير صحيح! استخدم الرمز الافتراضي 1234 للتجربة السريعة.', 'error');
      return;
    }

    setIsLoggedIn(true);
    // Determine default selected kid
    if (selectedRole === 'parent') {
      const parent = parentsList[0] || { kidsIds: [] };
      if (parent.kidsIds && parent.kidsIds.length > 0) {
        setSelectedKidId(parent.kidsIds[0]);
      } else if (playersList.length > 0) {
        setSelectedKidId(playersList[0].id);
      }
    } else {
      setSelectedKidId(playersList[0]?.id || 'لاعب-1');
    }
    onAddToast(`تم الدخول بنجاح لمنصة ${selectedRole === 'player' ? 'اللاعب الذكية' : 'ولي الأمر الراقية'}.`, 'success');
  };

  // Switch kid active profile
  const handleKidSwitch = (kidId: string) => {
    setSelectedKidId(kidId);
    setTabLoading(true);
    setTimeout(() => setTabLoading(false), 400);
    onAddToast(`تم تبديل الملف النشط للاعب: ${playersList.find(p => p.id === kidId)?.name || 'البطل'}`, 'info');
  };

  // Submit freeze
  const handleFreezeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freezeReason.trim()) {
      onAddToast('يرجى تدوين سبب تجميد العضوية ليتم رفعه للمدير الرياضي!', 'error');
      return;
    }
    onAddToast(`تم إرسال طلب تجميد العضوية لمدة ${freezeDays} يوماً بنجاح للإشراف.`, 'success');
    setFreezeReason('');
  };

  // Submit vacation leave
  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      onAddToast('يرجى تدوين عذر الغياب لتأكيده وتجنب احتسابه غائباً!', 'error');
      return;
    }
    onAddToast('تم تسجيل عذر الغياب بنجاح وإبلاغ مدرب الفئة لتعديل الحصص.', 'success');
    setLeaveReason('');
  };

  // Send direct message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { sender: 'user' as const, text: chatMessage, time: 'الآن' };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        sender: 'system',
        text: `شكراً لتواصلك. رسالتك بخصوص "${userMsg.text}" تمت إحالتها فوراً للمدرب المسؤول والكادر الفني في صالة العناية بالعملاء وسيتم الرد عليك فوراً.`,
        time: 'الآن'
      }]);
    }, 1200);
  };

  // Confirm booking playground
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const mockTicket = {
      id: `QR-${Math.floor(100000 + Math.random() * 900000)}`,
      pitch: bookingPitch,
      date: bookingDate,
      time: bookingTime,
      duration: bookingDuration,
      status: 'مؤكد ومعتمد'
    };
    setActiveQrTicket(mockTicket);
    onAddToast('تم حجز الملعب وتوليد تذكرة الدخول الرقمية QR المعتمدة!', 'success');
  };

  // Active player record
  const activeKidRecord = playersList.find(p => p.id === selectedKidId) || playersList[0] || {
    name: 'يوسف عبد العزيز السالم',
    sport: 'كرة القدم',
    level: 'محترف (A+)',
    groupName: 'براعم النخبة أ',
    avatarColor: 'bg-[#5A0B17]'
  };

  // Next session mock data
  const nextSessionInfo = {
    sport: activeKidRecord.sport || 'كرة القدم',
    coachName: coachesList[0]?.name || 'الكابتن أحمد الفالح',
    time: 'اليوم، 05:00 مساءً',
    duration: '90 دقيقة',
    location: 'الصالة المغلقة أ - مبردة ومجهزة',
    exercises: ['الإحماء البدني', 'تكتيك الاستحواذ والانتشار الحركي', 'مباراة تطبيقية خماسية', 'تقييم اللياقة المتكاملة']
  };

  // Notification Mock
  const notificationsMock = [
    { id: '1', title: 'تم تفعيل التقييم الفني الأسبوعي', content: 'أضاف الكابتن تقييم اللياقة البدنية والسرعة الجديد لملفك الشخصي.', date: 'منذ ساعتين' },
    { id: '2', title: 'طلب الإجازة معتمد', content: 'تمت الموافقة على طلب إجازتك الرياضية ليوم الأحد الماضي مع الحفاظ على الأيام.', date: 'منذ يوم' },
    { id: '3', title: 'إيصال دفع إلكتروني', content: 'تم سداد الرسوم الشهرية بنجاح وتأمين عضوية الفئة.', date: 'منذ ٣ أيام' }
  ];

  return (
    <div className="bg-[#140708] text-slate-100 min-h-screen selection:bg-[#B76E79] selection:text-slate-950 overflow-x-hidden text-right font-sans bg-noise flex flex-col justify-between">
      
      {/* Background spotlights & geometric luxury mesh */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-[#5A0B17]/20 via-transparent to-transparent pointer-events-none z-0" />
      <div className="fixed -top-40 left-10 w-96 h-96 bg-[#B76E79]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 right-10 w-96 h-96 bg-[#5A0B17]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ================= STICKY GLASSMORPHIC PORTAL HEADER ================= */}
      <header className="sticky top-0 z-40 bg-[#140708]/85 backdrop-blur-3xl border-b border-[#B76E79]/15 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-4.5 px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand visual with Real Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={onNavigateToWebsite}>
          <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#B76E79] shadow-xl">
            <img 
              src="https://i.ibb.co/2YPYCr3m/image.jpg" 
              alt="Elashwal Logo" 
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
              بوابة الأشوال الرياضية
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#B76E79] to-[#9E5D68] text-white font-black text-[9px] uppercase">PORTAL</span>
            </h1>
            <span className="text-[10px] text-[#B76E79] font-black block tracking-widest uppercase font-mono">ELASHWAL ACADEMY</span>
          </div>
        </div>

        {/* Global Controls & Avatar Area */}
        <div className="flex items-center gap-3.5">
          
          {/* Quick Action Language Switcher */}
          <button 
            onClick={() => { setLang(prev => prev === 'ar' ? 'en' : 'ar'); onAddToast('تم تبديل واجهة العميل للغة المختارة', 'info'); }}
            className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#B76E79] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300"
            title="تبديل اللغة"
          >
            <Languages className="w-4.5 h-4.5" />
          </button>

          {/* Theme Preset Toggler */}
          <button 
            onClick={() => { setIsDarkMode(!isDarkMode); onAddToast(isDarkMode ? 'تم التبديل للوضع الصباحي الفاخر' : 'تم التبديل للوضع الليلي المريح للعين', 'info'); }}
            className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#B76E79] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300"
            title="وضع الإضاءة"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Premium Interactive Notification Center */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#B76E79] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 relative"
              aria-label="الإشعارات"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#B76E79] rounded-full animate-pulse" />
            </button>

            {/* Notifications Dropdown Grid */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute left-0 top-full mt-3 w-80 bg-[#1A090B] border border-[#B76E79]/25 rounded-2xl p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 text-right space-y-3"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] text-[#B76E79] font-black uppercase tracking-wider">الإشعارات والتنبيهات</span>
                    <button 
                      onClick={() => { setShowNotifications(false); onAddToast('تم تحديد جميع التنبيهات كمقروءة', 'success'); }}
                      className="text-[9px] text-slate-400 hover:text-[#B76E79] font-semibold"
                    >
                      تحديد كالمقروء
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {notificationsMock.map(notif => (
                      <div key={notif.id} className="p-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl transition-all">
                        <h4 className="text-xs font-black text-white">{notif.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">{notif.content}</p>
                        <span className="text-[8px] text-[#B76E79] font-black block mt-1.5">{notif.date}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick exit and direct return to public presentation website */}
          <button
            onClick={onNavigateToWebsite}
            className="hidden sm:inline-flex px-5 py-2.5 bg-white/[0.02] hover:bg-[#5A0B17]/20 border border-[#B76E79]/30 hover:border-[#B76E79] rounded-xl text-xs font-black text-slate-200 hover:text-[#B76E79] transition-all duration-300 shadow-md cursor-pointer"
          >
            العودة للموقع التعريفي
          </button>

          {isLoggedIn && (
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setShowOtpInput(false);
                setOtpCode('');
                onAddToast('تم تسجيل الخروج وتأمين حساب اللاعب.', 'info');
              }}
              className="px-4 py-2.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          )}

        </div>

      </header>

      {/* ================= MAIN PORTAL INTERFACES ================= */}
      {!isLoggedIn ? (
        
        /* 1. LOGIN SCREEN WITH LUXURIOUS GLOWING CARD */
        <main className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5A0B17]/10 rounded-full blur-[150px] pointer-events-none z-0" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full bg-[#1C090C]/60 backdrop-blur-2xl border border-[#B76E79]/25 rounded-[32px] p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden text-right"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A0B17]/15 rounded-bl-full pointer-events-none" />
            
            {/* Logo in Login */}
            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-[#B76E79] shadow-2xl mb-6">
              <img 
                src="https://i.ibb.co/2YPYCr3m/image.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center space-y-3 mb-8">
              <span className="text-[10px] text-[#B76E79] font-black tracking-widest uppercase block animate-pulse">
                بوابة النخبة والبراعم الواعدين
              </span>
              <h2 className="text-3xl font-serif font-black text-white">تسجيل الدخول الآمن</h2>
              <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto">
                يرجى تحديد دورك، وإدخال رقم جوال ولي الأمر المعتمد لتلقي رمز التحقق السريع (OTP).
              </p>
            </div>

            {/* Premium Role switcher tabs */}
            <div className="grid grid-cols-2 gap-2 bg-white/[0.01] p-1.5 border border-white/5 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => { setSelectedRole('player'); onAddToast('تم تفعيل واجهة اللاعب التدريبية', 'info'); }}
                className={`py-3.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                  selectedRole === 'player' 
                    ? 'bg-gradient-to-r from-[#5A0B17] to-[#440810] border border-[#B76E79]/30 text-white shadow-2xl' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                بوابة اللاعب الفنية
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('parent'); onAddToast('تم تفعيل واجهة ولي الأمر الموحدة', 'info'); }}
                className={`py-3.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                  selectedRole === 'parent' 
                    ? 'bg-gradient-to-r from-[#5A0B17] to-[#440810] border border-[#B76E79]/30 text-white shadow-2xl' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                بوابة ولي الأمر
              </button>
            </div>

            {!showOtpInput ? (
              /* Phone Input Stage */
              <form onSubmit={handleSendOtp} className="space-y-6 text-xs font-bold text-right">
                
                <div className="space-y-2">
                  <label className="block text-slate-300 mr-1.5 font-bold">رقم الجوال المسجل بالأكاديمية *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="0551234567"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full pl-5 pr-12 py-4 bg-white/[0.02] border border-white/10 focus:border-[#B76E79] rounded-2xl text-white font-mono text-left text-sm outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    />
                    <Phone className="absolute right-4 top-4 w-5 h-5 text-slate-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-white/10 text-[#B76E79] accent-[#B76E79]"
                    />
                    حفظ الجلسة وتذكرني
                  </label>
                  <span className="text-[10px] text-[#B76E79] font-black">حماية SSL مشفرة</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#5A0B17] via-[#440810] to-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-2xl text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer hover:shadow-[#5A0B17]/20"
                >
                  إرسال كود التحقق OTP
                </button>

              </form>
            ) : (
              /* OTP verification Stage */
              <form onSubmit={handleVerifyOtp} className="space-y-6 text-xs font-bold text-right">
                
                <div className="space-y-2">
                  <label className="block text-slate-300 mr-1.5 font-bold">رمز التحقق المكون من 4 أرقام *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="أدخل رمز المحاكاة 1234 للتجربة"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      className="w-full pl-5 pr-12 py-4 bg-white/[0.02] border border-white/10 focus:border-[#B76E79] rounded-2xl text-white font-mono text-center text-lg tracking-[0.5em] outline-none transition-all placeholder:text-slate-600 placeholder:tracking-normal"
                    />
                    <Shield className="absolute right-4 top-4.5 w-5 h-5 text-slate-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <button
                    type="button"
                    onClick={() => onAddToast('تمت إعادة إرسال كود التحقق لرسائلك.', 'info')}
                    className="text-[#B76E79] font-black hover:underline cursor-pointer"
                  >
                    إعادة إرسال الرمز (OTP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="text-slate-400 font-bold hover:underline cursor-pointer"
                  >
                    تعديل رقم الجوال
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#5A0B17] via-[#4A0D15] to-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-2xl text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer hover:shadow-[#5A0B17]/20 animate-bounce"
                >
                  تأكيد التحقق والدخول
                </button>

              </form>
            )}

            <div className="pt-6 mt-8 border-t border-white/5 text-center text-[10px] text-slate-500 font-bold space-y-1">
              <span>جميع الحقوق محفوظة لأكاديمية الأشوال الرياضية © 2026</span>
              <span className="block text-[#B76E79]">نظام حماية البيانات المشفرة والامتثال الرياضي</span>
            </div>

          </motion.div>

        </main>

      ) : (

        /* 2. MAIN CORE PREMIUM FITNESS APPLICATION PORTAL */
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* ================= COLUMN LEFT: FLUID SLIM FLOATING SIDEBAR ================= */}
          <aside className={`transition-all duration-500 shrink-0 ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'
          } w-full space-y-6 lg:sticky lg:top-28 self-start`}>
            
            {/* Active Athlete Quick Profile card (Strava / Nike Look) */}
            <div className="bg-[#1C090C]/50 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-[#5A0B17]/10 rounded-full blur-xl pointer-events-none" />
              
              {/* Kid switcher shown inside parent portal context in a highly streamlined format */}
              {selectedRole === 'parent' && (
                <div className="mb-4 pb-4 border-b border-white/5 text-right space-y-2">
                  <div className="flex items-center gap-1.5 justify-end text-[10px] text-[#B76E79] font-black uppercase">
                    <Users className="w-3.5 h-3.5" />
                    <span>بطاقتك العائلية - اختر الابن:</span>
                  </div>
                  
                  {/* Grid of Mini Rounded Avatars representing kids */}
                  <div className="flex gap-2.5 justify-end pt-1">
                    {playersList.slice(0, 3).map(kid => {
                      const isSelected = kid.id === selectedKidId;
                      return (
                        <button
                          key={kid.id}
                          onClick={() => handleKidSwitch(kid.id)}
                          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black transition-all ${
                            isSelected 
                              ? 'bg-gradient-to-r from-[#5A0B17] to-[#400710] border border-[#B76E79] text-white shadow-lg scale-105' 
                              : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                          }`}
                          title={kid.name}
                        >
                          {kid.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Core active profile info */}
              <div className="flex items-center gap-4 text-right justify-end sm:justify-start">
                <div className="text-right order-2 sm:order-1 flex-1">
                  <h3 className="text-sm font-black text-white tracking-wide">{activeKidRecord.name}</h3>
                  <span className="text-[11px] text-[#B76E79] font-black block mt-0.5">
                    {activeKidRecord.sport || 'كرة القدم'} | {activeKidRecord.groupName || 'فئة البراعم'}
                  </span>
                </div>
                
                {/* Large Photo Profile Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5A0B17] to-[#B76E79] p-0.5 shadow-xl order-1 sm:order-2 shrink-0">
                  <div className="w-full h-full bg-[#1C090C] rounded-2xl overflow-hidden flex items-center justify-center font-serif text-lg text-white font-black">
                    {activeKidRecord.name?.charAt(0) || 'أ'}
                  </div>
                </div>
              </div>

              {/* Mini Status Grid */}
              <div className="grid grid-cols-2 gap-3.5 mt-5 pt-4 border-t border-white/5 text-right text-[10px] font-bold text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider">مستوى الكفاءة:</span>
                  <span className="text-white mt-1 block font-black">{activeKidRecord.level || 'محترف A+'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider">الانتساب المالي:</span>
                  <span className="text-green-400 font-black mt-1 block">نشط ومسدد</span>
                </div>
              </div>

            </div>

            {/* Collapsible Sidebar Navigation List */}
            <div className="bg-[#1C090C]/50 backdrop-blur-md border border-[#B76E79]/15 p-2 rounded-[28px] shadow-2xl space-y-1">
              
              <div className="hidden lg:flex justify-end p-2 border-b border-white/5 mb-1.5">
                <button 
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 text-slate-500 hover:text-white transition-all text-[10px] font-black"
                >
                  {sidebarCollapsed ? '» فتح القائمة' : '« تصغير القائمة'}
                </button>
              </div>

              {[
                { id: 'home', label: 'لوحة الأداء والمتابعة', icon: Activity },
                { id: 'schedule', label: 'الجدول التدريبي اليومي', icon: Dumbbell },
                { id: 'attendance', label: 'سجل الحضور والغياب', icon: CheckSquare },
                { id: 'subscription', label: 'إدارة العضوية والاشتراك', icon: Compass },
                { id: 'payments', label: 'المحفظة والفواتير', icon: Wallet },
                { id: 'booking', label: 'حجز الملاعب الذكية', icon: QrCode },
                { id: 'achievements', label: 'أوسمة وإنجازات اللاعب', icon: Trophy },
                { id: 'coaches', label: 'الملف التعريفي للمدرب', icon: User },
                { id: 'chat', label: 'غرفة شات المستشار الرياضي', icon: MessageSquare },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = portalTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer text-xs font-black relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-l from-[#5A0B17] to-[#400710] text-white border border-[#B76E79]/35 shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#B76E79]' : 'text-slate-400'}`} strokeWidth={1.5} />
                      {!sidebarCollapsed && <span className="font-sans text-right">{tab.label}</span>}
                    </div>

                    {/* Active State glow bar */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeBar" 
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#B76E79] rounded-l" 
                      />
                    )}
                  </button>
                );
              })}

            </div>

          </aside>

          {/* ================= COLUMN RIGHT: IMMERSIVE APP DISPLAY AREA ================= */}
          <main className="flex-1 space-y-8 relative">
            
            {/* Immersive Skeleton Screen for high performance feeling during Tab Transition */}
            <AnimatePresence mode="wait">
              {tabLoading ? (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-right"
                >
                  <div className="h-44 w-full bg-[#1C090C]/40 border border-[#B76E79]/10 rounded-[32px] animate-pulse p-8 flex flex-col justify-end space-y-3">
                    <div className="h-6 w-1/3 bg-white/10 rounded-md" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-md" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-28 bg-[#1C090C]/40 border border-[#B76E79]/10 rounded-2xl animate-pulse" />
                    <div className="h-28 bg-[#1C090C]/40 border border-[#B76E79]/10 rounded-2xl animate-pulse" />
                    <div className="h-28 bg-[#1C090C]/40 border border-[#B76E79]/10 rounded-2xl animate-pulse" />
                  </div>
                  <div className="h-64 bg-[#1C090C]/40 border border-[#B76E79]/10 rounded-[32px] animate-pulse" />
                </motion.div>
              ) : (
                
                <motion.div
                  key={portalTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-8 text-right"
                >
                  
                  {/* ======================================================== */}
                  {/* TAB A: HOME SCREEN / PLAYER HOMEPAGE                     */}
                  {/* ======================================================== */}
                  {portalTab === 'home' && (
                    <div className="space-y-8">
                      
                      {/* Ultra HD Welcome banner with genuine action photo */}
                      <div className="relative rounded-[32px] overflow-hidden border border-[#B76E79]/25 shadow-2xl h-64 sm:h-72 bg-[#1C090C] group">
                        <img 
                          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop" 
                          alt="Athlete training" 
                          className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[#140708] via-[#140708]/60 to-transparent" />
                        
                        <div className="absolute inset-y-0 right-0 p-8 sm:p-12 flex flex-col justify-center space-y-3 max-w-xl">
                          <span className="text-[10px] text-[#B76E79] font-black tracking-widest uppercase block">
                            قاطرة الإنجاز والتميز المستمر
                          </span>
                          <h2 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight">
                            مرحباً بك يا بطل الأشوال
                          </h2>
                          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                            تتبع الأرقام والتدريبات وسجلات الحضور بشكل حي ومباشر. نجاحك اليومي هو خطوتك الأساسية نحو النجومية الإقليمية.
                          </p>
                          <div className="pt-2">
                            <button 
                              onClick={() => handleTabChange('schedule')}
                              className="px-6 py-3 bg-[#5A0B17] hover:bg-[#B76E79] border border-[#B76E79]/50 text-white rounded-full text-xs font-black transition-all shadow-lg hover:scale-105"
                            >
                              عرض جدول اليوم الفني
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Training score & Fitness Ring counters (Strava Look) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        
                        {/* Attendance Score Ring */}
                        <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">نسبة الالتزام بالشهر:</span>
                            <h4 className="text-2xl font-serif font-black text-white">٩٢٪</h4>
                            <span className="text-[9px] text-green-400 font-black block">ممتاز (فئة النخبة)</span>
                          </div>
                          
                          {/* Animated circular rings for fitness feeling */}
                          <div className="relative w-16 h-16 shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className="text-[#B76E79]" strokeDasharray="92, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#B76E79]">92%</span>
                          </div>
                        </div>

                        {/* Stamina & Fitness Score Ring */}
                        <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">نقاط كفاءة التحمل البدني:</span>
                            <h4 className="text-2xl font-serif font-black text-white">٨٨ / ١٠٠</h4>
                            <span className="text-[9px] text-[#B76E79] font-black block">تطور بـ ٨٪ منذ الفحص الأخير</span>
                          </div>
                          
                          <div className="relative w-16 h-16 shrink-0">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className="text-white" strokeDasharray="88, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">88</span>
                          </div>
                        </div>

                        {/* Gamification Level Reward progress */}
                        <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">مستوى نقاط الخبرة XP:</span>
                            <h4 className="text-2xl font-serif font-black text-white">المستوى ٦</h4>
                            <span className="text-[9px] text-[#B76E79] font-black block">متبقي 250 XP للمستوى التالي</span>
                          </div>
                          <Trophy className="w-11 h-11 text-[#B76E79] animate-bounce shrink-0" strokeWidth={1.2} />
                        </div>

                      </div>

                      {/* Coach Direct Feedback Box */}
                      <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-8 rounded-[32px] shadow-2xl space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/5 justify-end sm:justify-start">
                          <h4 className="text-xs font-black text-white flex items-center gap-2">
                            <UserCheck className="w-4.5 h-4.5 text-[#B76E79]" />
                            التوجيه الفني والتقييم الحصري من الكابتن العام
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-bold bg-[#140708]/50 p-5 rounded-2xl border border-white/5 text-right italic font-serif">
                          " اللاعب {activeKidRecord.name} يظهر حضوراً ومستوى مميزاً في التدريبات والتحركات التكتيكية الأخيرة. نركز في المرات القادمة على دقة الضربات الرأسية وبناء التحمل العضلي. "
                        </p>
                      </div>

                      {/* Latest Activities, Badges & Mini Calendar Schedule */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Interactive Mini Calendar agenda */}
                        <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[32px] shadow-2xl space-y-4">
                          <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">أبرز الأحداث الرياضية القادمة</h3>
                          
                          <div className="space-y-3 text-right">
                            {[
                              { title: 'اختبار تقييم اللياقة العام', date: '٢٨ يونيو - ٠٤:٠٠ م', desc: 'صالة التقنيات الحركية مع د. يوسف', badge: 'فحص فني' },
                              { title: 'مباراة الديربي الودية لفئة ب', date: '٣٠ يونيو - ٠٦:٣٠ م', desc: 'الملعب العشبي الخارجي الرئيسي', badge: 'مباراة' },
                              { title: 'تحديث القياسات الجسدية والوزن', date: '٠٢ يوليو - ٠٥:٠0 م', desc: 'صالة العيادة الطبية بالأكاديمية', badge: 'طبي' }
                            ].map((evt, idx) => (
                              <div key={idx} className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#B76E79]/30 rounded-2xl transition-all flex items-center justify-between gap-4">
                                <span className="px-2 py-1 bg-[#5A0B17]/40 text-[#B76E79] border border-[#B76E79]/20 text-[8px] font-black rounded-lg">
                                  {evt.badge}
                                </span>
                                <div className="text-right">
                                  <h4 className="text-xs font-black text-white">{evt.title}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{evt.date} • {evt.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Achievements Box */}
                        <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[32px] shadow-2xl space-y-4">
                          <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">الميداليات الرقمية المفتوحة</h3>
                          
                          <div className="grid grid-cols-3 gap-3 text-center">
                            {[
                              { label: 'الالتزام الكامل', desc: 'حضور ١٠ حصص متتالية', icon: '🔥' },
                              { label: 'الضربة القاضية', desc: 'مستوى تسديد قوي', icon: '⚡' },
                              { label: 'اللعب النظيف', desc: 'انضباط سلوكي تام', icon: '🛡️' }
                            ].map((badge, idx) => (
                              <div key={idx} className="p-3 bg-[#140708]/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-2">
                                <span className="text-2xl">{badge.icon}</span>
                                <h4 className="text-[10px] font-black text-white">{badge.label}</h4>
                                <p className="text-[8px] text-slate-500 font-bold leading-tight">{badge.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB B: DAILY TRAINING SCHEDULE                           */}
                  {/* ======================================================== */}
                  {portalTab === 'schedule' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">الجدول التدريبي اليومي</h3>
                        <p className="text-xs text-slate-400 mt-1">تفاصيل الحصة النشطة والتجهيزات والمقاييس المطلوبة من المدرب المشرف.</p>
                      </div>

                      {/* Training detailed card */}
                      <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 rounded-[32px] overflow-hidden shadow-2xl">
                        
                        <div className="relative h-48 bg-[#1C090C]">
                          <img 
                            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop" 
                            alt="Training exercises" 
                            className="absolute inset-0 w-full h-full object-cover opacity-25"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#140708] to-transparent" />
                          <div className="absolute bottom-5 right-6 text-right">
                            <span className="px-2.5 py-1 bg-[#5A0B17] border border-[#B76E79]/35 text-white text-[9px] font-black rounded-lg">الحصة الحالية</span>
                            <h3 className="text-xl font-black text-white mt-2">{nextSessionInfo.sport} - التكتيك الرياضي المتقدم</h3>
                          </div>
                        </div>

                        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-right">
                          
                          <div className="md:col-span-8 space-y-5">
                            <h4 className="text-xs font-black text-white border-r-2 border-[#B76E79] pr-2.5">المقرر الحركي والبدني المقترح لحصة اليوم:</h4>
                            
                            <div className="space-y-2">
                              {nextSessionInfo.exercises.map((ex, idx) => (
                                <div key={idx} className="flex items-center gap-3 justify-end bg-white/[0.01] border border-white/5 p-3 rounded-xl hover:border-[#B76E79]/25 transition-all">
                                  <span className="text-xs text-slate-200 font-bold">{ex}</span>
                                  <span className="w-5 h-5 rounded-full bg-[#5A0B17]/40 text-[#B76E79] border border-[#B76E79]/25 text-[10px] font-black flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 flex justify-end">
                              <button 
                                onClick={() => onAddToast('تم تفعيل عداد الجري وتتبع اللياقة بالخلفية لمزامنتها مع أخصائي الأكاديمية.', 'success')}
                                className="px-8 py-3.5 bg-[#5A0B17] hover:bg-[#B76E79] border border-[#B76E79]/50 text-white font-black rounded-full text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>ابدأ التدريب الذاتي الآن للتسجيل (Start Workout)</span>
                              </button>
                            </div>
                          </div>

                          {/* Coach & Location info box */}
                          <div className="md:col-span-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                            <div className="space-y-1 text-right">
                              <span className="text-[9px] text-slate-500 font-black block uppercase">المدرب المشرف:</span>
                              <h4 className="text-xs font-black text-white">{nextSessionInfo.coachName}</h4>
                              <p className="text-[10px] text-[#B76E79] font-black">مدرب فئة النخبة المعتمد</p>
                            </div>
                            <hr className="border-white/5" />
                            <div className="space-y-1.5 text-right text-[10px] text-slate-300 font-semibold">
                              <p>🕒 الزمن: {nextSessionInfo.time}</p>
                              <p>⌛ المدة المعتمدة: {nextSessionInfo.duration}</p>
                              <p>📍 الموقع: {nextSessionInfo.location}</p>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB C: DETAILED ATTENDANCE CALENDAR                      */}
                  {/* ======================================================== */}
                  {portalTab === 'attendance' && (
                    <div className="space-y-6">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-white/5">
                        <div className="text-right">
                          <h3 className="text-xl font-serif font-black text-white">سجل حضور وغياب اللاعب</h3>
                          <p className="text-xs text-slate-400 mt-1">تتبع نسبة الانضباط والمواظبة في الحصص لشهري يونيو ويوليو ٢٠٢٦.</p>
                        </div>
                        <div className="px-4 py-2 bg-[#5A0B17]/40 border border-[#B76E79]/35 text-white font-black text-xs rounded-xl">
                          حضور منتظم: ٩٢٪
                        </div>
                      </div>

                      {/* Calendar Agenda Matrix (Apple Calendar Style) */}
                      <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 sm:p-8 rounded-[32px] shadow-2xl space-y-6">
                        
                        <div className="flex justify-between items-center text-xs font-black text-white">
                          <button className="p-2 hover:text-[#B76E79] transition-all">« الشهر السابق</button>
                          <span className="font-serif">يونيو ٢٠٢٦</span>
                          <button className="p-2 hover:text-[#B76E79] transition-all">الشهر التالي »</button>
                        </div>

                        <div className="grid grid-cols-7 gap-3 text-center text-[11px] font-black text-slate-400">
                          {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
                            <div key={day} className="py-2 bg-white/[0.01] rounded-xl border border-white/5 text-slate-500 font-sans">{day}</div>
                          ))}
                          
                          {Array.from({ length: 30 }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const isTraining = dayNum % 2 === 0;
                            const status = isTraining ? (dayNum % 10 === 0 ? 'غائب' : 'حاضر') : 'لا حصة';

                            return (
                              <div
                                key={idx}
                                className={`p-3 rounded-2xl h-18 flex flex-col justify-between items-center border transition-all ${
                                  status === 'حاضر'
                                    ? 'bg-green-950/20 border-green-800/40 text-green-400 font-black shadow-inner shadow-green-950/20'
                                    : status === 'غائب'
                                      ? 'bg-rose-950/30 border-rose-900/45 text-rose-400 font-black animate-pulse'
                                      : 'bg-white/[0.01] border-white/5 text-slate-600'
                                }`}
                              >
                                <span className="text-xs font-black">{dayNum}</span>
                                <span className="text-[8px] uppercase tracking-wide">{status}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legends color code */}
                        <div className="flex flex-wrap justify-center gap-6 items-center pt-6 border-t border-white/5 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> حضور معتمد (١٨ حصة)</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> غياب بدون عذر (٢ حصة)</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block"></span> خارج أوقات التمارين</span>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB D: SUBSCRIPTION & MEMBERSHIPS                        */}
                  {/* ======================================================== */}
                  {portalTab === 'subscription' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">إدارة عضويات واشتراكات الأكاديمية</h3>
                        <p className="text-xs text-slate-400 mt-1">تجديد الخطط، تجميد الحصص موقتاً، أو مطالعة المزايا والامتيازات الحصرية.</p>
                      </div>

                      {/* Active subscription details Card */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        
                        {/* Plan Specs details */}
                        <div className="md:col-span-7 bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 sm:p-8 rounded-[32px] shadow-2xl space-y-6">
                          <div>
                            <span className="px-2.5 py-1 bg-[#5A0B17]/40 border border-[#B76E79]/35 text-[#B76E79] text-[9px] font-black rounded-lg">العضوية الحالية</span>
                            <h3 className="text-xl font-black text-white mt-2.5">باقة النخبة الثلاثية المتميزة</h3>
                            <p className="text-xs text-slate-400 mt-1">تاريخ البدء: ٠١ يونيو ٢٠٢٦ | تاريخ انتهاء التجديد: ٠١ يوليو ٢٠٢٦</p>
                          </div>

                          <hr className="border-white/5" />

                          <div className="space-y-3.5 text-right text-xs">
                            <h4 className="font-black text-white">المميزات وبنود العضوية والاشتراك:</h4>
                            {[
                              'عدد ٣ حصص تدريبية أسبوعية بالملعب المغطى والمكلف.',
                              'تأمين زي الأكاديمية الرسمي الفاخر مجاناً.',
                              'إشراف صحي كامل ومتابعة القياسات البدنية أسبوعياً.',
                              'دخول بوابات الدعم وواتساب السكرتارية الفني على مدار الساعة.'
                            ].map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2 justify-end text-slate-300 font-bold">
                                <span>{feat}</span>
                                <Check className="w-4 h-4 text-[#B76E79]" />
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => {
                                onAddToast('تم تمديد الاشتراك بالنجاح، جاري إحالتك لصفحة السداد الآمن.', 'success');
                                handleTabChange('payments');
                              }}
                              className="flex-1 py-4.5 bg-gradient-to-r from-[#5A0B17] via-[#440810] to-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-2xl text-xs shadow-xl hover:scale-[1.02] transition-all cursor-pointer text-center"
                            >
                              تجديد الاشتراك الفوري والترقية
                            </button>
                          </div>
                        </div>

                        {/* Freeze & Vacation Submitting form panel */}
                        <div className="md:col-span-5 space-y-6">
                          
                          {/* Freeze Panel */}
                          <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl space-y-4">
                            <div>
                              <h4 className="text-xs font-black text-white">طلب تجميد مؤقت للعضوية</h4>
                              <p className="text-[10px] text-slate-400 mt-1">تجميد أيامك التدريبية في حال المرض أو السفر لضمان عدم ضياع الحصص.</p>
                            </div>

                            <form onSubmit={handleFreezeSubmit} className="space-y-4 text-xs font-bold text-right">
                              <div className="space-y-1.5">
                                <label className="text-slate-400 block">مدة التجميد المطلوبة *</label>
                                <select 
                                  value={freezeDays}
                                  onChange={e => setFreezeDays(parseInt(e.target.value) || 15)}
                                  className="w-full px-4 py-3 bg-[#140708]/60 border border-white/5 rounded-xl text-white text-right cursor-pointer outline-none focus:border-[#B76E79]"
                                >
                                  <option value={15}>١٥ يوماً (أسبوعان)</option>
                                  <option value={30}>٣٠ يوماً (شهر كامل)</option>
                                  <option value={45}>٤٥ يوماً (الحد الأقصى)</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-slate-400 block">سبب طلب التجميد المعتمد *</label>
                                <textarea
                                  required
                                  placeholder="الرجاء كتابة سبب التجميد لتأكيد الموافقة..."
                                  value={freezeReason}
                                  onChange={e => setFreezeReason(e.target.value)}
                                  rows={2}
                                  className="w-full px-4 py-3 bg-[#140708]/60 border border-white/5 rounded-xl text-white text-right outline-none focus:border-[#B76E79] resize-none"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-3 bg-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-xl text-xs cursor-pointer hover:bg-[#B76E79] transition-all"
                              >
                                تقديم طلب التجميد
                              </button>
                            </form>
                          </div>

                          {/* Vacation & Absence warning */}
                          <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl space-y-4">
                            <div>
                              <h4 className="text-xs font-black text-white">إبلاغ مسبق بعذر غياب</h4>
                              <p className="text-[10px] text-slate-400 mt-1">تنبيه الكابتن لعدم احتسابه غياباً غير مبرر ببطاقة أداء اللاعب.</p>
                            </div>

                            <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs font-bold text-right">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <label className="text-slate-400 block">تاريخ الغياب *</label>
                                  <input 
                                    type="date"
                                    required
                                    value={leaveDate}
                                    onChange={e => setLeaveDate(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-[#140708]/60 border border-white/5 rounded-xl text-white outline-none focus:border-[#B76E79]"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-slate-400 block">الحصص / الأيام *</label>
                                  <input 
                                    type="number"
                                    required
                                    min={1}
                                    max={5}
                                    value={leaveDays}
                                    onChange={e => setLeaveDays(parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2.5 bg-[#140708]/60 border border-white/5 rounded-xl text-white outline-none focus:border-[#B76E79] text-center"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-slate-400 block">سبب عذر الغياب *</label>
                                <textarea
                                  required
                                  placeholder="ظروف عائلية، وعكة صحية طارئة..."
                                  value={leaveReason}
                                  onChange={e => setLeaveReason(e.target.value)}
                                  rows={2}
                                  className="w-full px-4 py-3 bg-[#140708]/60 border border-white/5 rounded-xl text-white text-right outline-none focus:border-[#B76E79] resize-none"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-3 bg-white/[0.02] border border-white/10 text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-white/[0.05] transition-all"
                              >
                                إرسال إشعار الغياب للمدرب
                              </button>
                            </form>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB E: WALLET & ONLINE PAYMENTS                          */}
                  {/* ======================================================== */}
                  {portalTab === 'payments' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">المحفظة والفواتير وسندات القبض</h3>
                        <p className="text-xs text-slate-400 mt-1">مطالعة تاريخ العمليات وسداد الاشتراكات عبر نظام المدفوعات المعتمد المشفر.</p>
                      </div>

                      {/* Wallet Balance widget layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[28px] shadow-2xl">
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] block font-black uppercase">الرصيد المشحون المتوفر:</span>
                          <span className="text-2xl font-serif font-black text-white block mt-1">٠ ر.س</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] block font-black uppercase">الالتزامات المطلوبة للسداد:</span>
                          <span className="text-2xl font-serif font-black text-[#B76E79] block mt-1">٠ ر.س</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] block font-black uppercase">تاريخ السند القادم التلقائي:</span>
                          <span className="text-2xl font-serif font-black text-white block mt-1">٠١ يوليو ٢٠٢٦</span>
                        </div>
                      </div>

                      {/* Invoices List with modern layout (no dry administrative tables) */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-300">سندات الفواتير المدفوعة مسبقاً:</h4>
                        
                        {[
                          { id: 'سند-لاعب-١-١', type: 'رسوم الاشتراك - يونيو ٢٠٢٦', amount: 350, date: '٢٠٢٦/٠٦/٠١' },
                          { id: 'سند-لاعب-١-٢', type: 'رسوم الاشتراك - مايو ٢٠٢٦', amount: 350, date: '٢٠٢٦/٠٥/٠١' },
                          { id: 'سند-لاعب-١-٣', type: 'زي الأكاديمية والمعدات الرياضية المعقمة', amount: 150, date: '٢٠٢٦/٠٤/١٥' }
                        ].map((inv, idx) => (
                          <div key={idx} className="bg-[#1C090C]/40 border border-white/5 hover:border-[#B76E79]/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300">
                            
                            <div className="text-right flex-1">
                              <h4 className="text-sm font-black text-white">{inv.type}</h4>
                              <p className="text-[10px] text-slate-500 mt-1">معرف المعاملة: {inv.id} • تاريخ السداد: {inv.date}</p>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-sm font-serif font-black text-white">{inv.amount} ريال سعودي</span>
                              <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black rounded-lg">مكتمل ومدفوع</span>
                              
                              <button
                                onClick={() => onAddToast(`جاري تصدير سند الدفع رقم ${inv.id} كملف PDF معتمد.`, 'success')}
                                className="px-4 py-2 bg-[#5A0B17]/20 hover:bg-[#5A0B17]/40 border border-[#B76E79]/25 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer"
                              >
                                تحميل الإيصال (PDF)
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB F: PLAYGROUND BOOKING EXPERIENCE                     */}
                  {/* ======================================================== */}
                  {portalTab === 'booking' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">حجز الملاعب الرياضية والصالات</h3>
                        <p className="text-xs text-slate-400 mt-1">اختر ملعبك المفضل، حدد التوقيت المناسب، واستلم تذكرة الحجز برمز الاستجابة QR المعتمدة بوابات النادي.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        
                        {/* Booking form */}
                        <div className="md:col-span-7 bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 sm:p-8 rounded-[32px] shadow-2xl space-y-6">
                          
                          <form onSubmit={handleConfirmBooking} className="space-y-5 text-xs font-bold text-right">
                            
                            <div className="space-y-1.5">
                              <label className="text-slate-300 block">الملعب أو الصالة المطلوبة *</label>
                              <select
                                value={bookingPitch}
                                onChange={e => setBookingPitch(e.target.value)}
                                className="w-full px-4 py-3 bg-[#140708]/60 border border-white/5 rounded-xl text-white text-right cursor-pointer outline-none focus:border-[#B76E79]"
                              >
                                <option value="الملعب الخماسي المغطى">الملعب الخماسي المغطى والمكيف</option>
                                <option value="ملعب العشب الصناعي السباعي">ملعب العشب الصناعي السباعي الخارجي</option>
                                <option value="المسبح الأولمبي المغطى">المسبح الأولمبي المغطى والمراقب</option>
                                <option value="صالة الدفاع عن النفس">صالة الدفاع عن النفس والكاراتيه</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-slate-300 block">تاريخ الحجز *</label>
                                <input 
                                  type="date"
                                  required
                                  value={bookingDate}
                                  onChange={e => setBookingDate(e.target.value)}
                                  className="w-full px-3 py-2.5 bg-[#140708]/60 border border-white/5 rounded-xl text-white outline-none focus:border-[#B76E79]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-slate-300 block">التوقيت المفضل *</label>
                                <select
                                  value={bookingTime}
                                  onChange={e => setBookingTime(e.target.value)}
                                  className="w-full px-3 py-2.5 bg-[#140708]/60 border border-white/5 rounded-xl text-white text-right outline-none focus:border-[#B76E79] cursor-pointer"
                                >
                                  <option value="04:00 مساءً">٠٤:٠٠ م</option>
                                  <option value="06:00 مساءً">٠٦:٠٠ م</option>
                                  <option value="08:00 مساءً">٠٨:٠٠ م</option>
                                  <option value="10:00 مساءً">١٠:٠٠ م</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-slate-300 block">المدة المطلوبة لحجز الملعب *</label>
                              <select
                                value={bookingDuration}
                                onChange={e => setBookingDuration(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-3 bg-[#140708]/60 border border-white/5 rounded-xl text-white text-right outline-none focus:border-[#B76E79] cursor-pointer"
                              >
                                <option value={1}>ساعة واحدة (أساسي)</option>
                                <option value={2}>ساعتان (مستحسن للألعاب الجماعية)</option>
                                <option value={3}>ثلاث ساعات (الحد الأقصى للتأجير الفردي)</option>
                              </select>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-4 bg-gradient-to-r from-[#5A0B17] via-[#400710] to-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-2xl text-xs cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all"
                            >
                              تأكيد الحجز وتوليد تذكرة QR
                            </button>

                          </form>

                        </div>

                        {/* QR Ticket Output View */}
                        <div className="md:col-span-5">
                          {activeQrTicket ? (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-gradient-to-b from-[#1C090C] to-[#2D0B12] border-2 border-dashed border-[#B76E79]/40 p-6 rounded-[32px] text-center space-y-5 shadow-2xl relative"
                            >
                              <span className="px-2 py-0.5 bg-green-500/15 border border-green-500/20 text-green-400 text-[8px] font-black rounded-full uppercase tracking-widest inline-block mb-1">
                                {activeQrTicket.status}
                              </span>
                              
                              <h3 className="text-sm font-black text-white">{activeQrTicket.pitch}</h3>
                              <p className="text-[10px] text-slate-300 font-bold">تاريخ الحجز: {activeQrTicket.date} • الوقت: {activeQrTicket.time}</p>
                              
                              {/* QR Code illustration with Outline CSS */}
                              <div className="mx-auto w-36 h-36 bg-white p-3 rounded-2xl border border-[#B76E79]/30 flex items-center justify-center shadow-lg">
                                <div className="w-full h-full border-4 border-slate-950 flex flex-wrap items-center justify-center p-1 relative">
                                  {/* Dummy QR pixels pattern using small box divisions */}
                                  <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-90">
                                    {[...Array(16)].map((_, i) => (
                                      <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-slate-950' : 'bg-transparent'}`} />
                                    ))}
                                  </div>
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded border text-[9px] font-bold text-slate-950">
                                    {activeQrTicket.id}
                                  </div>
                                </div>
                              </div>

                              <div className="text-[9px] text-slate-400 font-bold leading-relaxed pt-2 border-t border-white/5 space-y-1">
                                <p>يرجى إبراز هذا الرمز عند البوابة الرياضية لتسجيل دخول الملعب.</p>
                                <p className="text-[#B76E79]">حجزك معقم وخاضع لمعايير سلامة الأشوال الدولية.</p>
                              </div>

                            </motion.div>
                          ) : (
                            <div className="bg-[#1C090C]/20 border border-white/5 p-8 rounded-[32px] text-center space-y-3 text-slate-500">
                              <QrCode className="w-12 h-12 text-[#B76E79]/35 mx-auto stroke-[1.2]" />
                              <h4 className="text-xs font-black text-slate-300">بانتظار تأكيد الحجز</h4>
                              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                                قم بتعبئة بيانات الملعب والتاريخ المطلوب في اليسار وسنقوم بتوليد بطاقة وتذكرة دخول QR مشفرة لك فوراً.
                              </p>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB G: GAMIFICATION & ATHLETE ACHIEVEMENTS              */}
                  {/* ======================================================== */}
                  {portalTab === 'achievements' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">منصة الجوائز وأوسمة فخر الأشوال</h3>
                        <p className="text-xs text-slate-400 mt-1">تتبع رحلتك الحركية والبدنية السلوكية، واكسب الأوسمة ونقاط الخبرة XP مع كل حصة تلتزم بها.</p>
                      </div>

                      {/* Medal Grid showcasing Gamification */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                          { label: 'سيد الحضور', desc: 'حضور ٢٠ حصة دون غياب واحد', xp: '+٢٠٠ XP', unlocked: true, icon: '🏆' },
                          { label: 'التسديدة الذهبية', desc: 'تقييم دقة يتخطى ٩٠٪ بالمباراة', xp: '+١٥٠ XP', unlocked: true, icon: '⚽' },
                          { label: 'مستوى النخبة', desc: 'تجاوز اختبار التحمل الكلي', xp: '+٣٠٠ XP', unlocked: true, icon: '✨' },
                          { label: 'سفير الروح الرياضية', desc: 'توصية انضباط من الكادر الإداري', xp: '+١٠٠ XP', unlocked: false, icon: '🛡️' },
                          { label: 'صخرة الدفاع', desc: 'قطع الكرات والتدخل الناجح', xp: '+٢٥٠ XP', unlocked: false, icon: '⛰️' },
                          { label: 'بطل السرعة الخارق', desc: 'قطع ٦٠م في زمن قياسي فئة ب', xp: '+١٨٠ XP', unlocked: false, icon: '⚡' }
                        ].map((ach, idx) => (
                          <div 
                            key={idx} 
                            className={`p-6 rounded-[28px] border text-center relative overflow-hidden transition-all duration-300 ${
                              ach.unlocked 
                                ? 'bg-[#1C090C]/40 border-[#B76E79]/20 hover:border-[#B76E79]/50 shadow-xl shadow-[#5A0B17]/5' 
                                : 'bg-[#140708]/20 border-white/5 opacity-50'
                            }`}
                          >
                            <span className="text-4xl block mb-3.5">{ach.icon}</span>
                            <h4 className="text-sm font-black text-white">{ach.label}</h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-xs mx-auto leading-relaxed">{ach.desc}</p>
                            
                            <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] font-black">
                              <span className="text-[#B76E79]">{ach.xp}</span>
                              <span className={ach.unlocked ? 'text-green-400' : 'text-slate-500'}>
                                {ach.unlocked ? '● تم إحرازها' : '○ مقفلة حالياً'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB H: COACH PROFILE                                     */}
                  {/* ======================================================== */}
                  {portalTab === 'coaches' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">المدرب الفني والأخصائي المسؤول</h3>
                        <p className="text-xs text-slate-400 mt-1">تعرف على مدرب فئة ابنك ومؤهلاته الدولية المعتمدة من الاتحادات الرياضية.</p>
                      </div>

                      {/* Coach Detailed CV Profile */}
                      <div className="bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 rounded-[32px] overflow-hidden shadow-2xl">
                        
                        <div className="relative h-60 bg-[#1C090C]">
                          <img 
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop" 
                            alt="Coach on training pitch" 
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#140708] to-transparent" />
                          <div className="absolute bottom-6 right-8 text-right flex items-center gap-5">
                            
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B76E79] shadow-xl">
                              <img 
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" 
                                alt="Coach Avatar" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div className="text-right">
                              <span className="px-2 py-0.5 bg-[#5A0B17] border border-[#B76E79]/35 text-white text-[9px] font-black rounded-lg">المدرب الرئيسي</span>
                              <h3 className="text-xl font-black text-white mt-1.5">{coachesList[0]?.name || 'الكابتن أحمد الفالح'}</h3>
                              <p className="text-xs text-slate-300 font-semibold mt-0.5">{coachesList[0]?.sport || 'كرة القدم والسباحة الدولية'}</p>
                            </div>

                          </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-6 text-right">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300 font-semibold leading-relaxed">
                            <div className="space-y-2">
                              <h4 className="font-black text-white text-sm">الشهادات والاعتمادات الدولية:</h4>
                              <p>• رخصة التدريب الرياضية فئة (A) من الاتحاد الآسيوي والسعودي لكرة القدم.</p>
                              <p>• ماجستير في التربية البدنية والبناء الحركي والصحي للبراعم الصغار.</p>
                              <p>• شهادة معتمدة في قياس الكفاءة وتطوير السرعة الحركية من معهد لايبزيغ بألمانيا.</p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-black text-white text-sm">الخبرات العملية السابقة:</h4>
                              <p>• مدرب فئات سنية سابق بنادي الشباب السعودي لمدة ٤ سنوات متتالية.</p>
                              <p>• مخطط أحمال بدنية بالعديد من الأكاديميات الرياضية المرموقة بالرياض.</p>
                              <p>• المشرف الرياضي الحالي على بوابة النخبة وبناء الأداء المستدام للأشوال.</p>
                            </div>
                          </div>

                          <hr className="border-white/5" />

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleTabChange('chat')}
                              className="px-8 py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#400710] border border-[#B76E79]/45 text-white font-black rounded-full text-xs shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4 text-[#B76E79]" />
                              <span>تواصل مع المدرب عبر المستشار الذكي</span>
                            </button>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* TAB I: INTERACTIVE LIVE CHAT ROOM                        */}
                  {/* ======================================================== */}
                  {portalTab === 'chat' && (
                    <div className="space-y-6">
                      
                      <div className="pb-3 border-b border-white/5">
                        <h3 className="text-xl font-serif font-black text-white">غرفة المحادثة والشات التفاعلي</h3>
                        <p className="text-xs text-slate-400 mt-1">تواصل مباشرة ومجاناً مع الكادر التدريبي والسكرتارية لتعديل الاشتراكات والبرامج.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right items-start">
                        
                        {/* Messenger UI interface */}
                        <div className="lg:col-span-8 bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 rounded-[32px] p-6 flex flex-col justify-between h-[500px] shadow-2xl relative">
                          
                          <div className="pb-3.5 border-b border-white/5 mb-4 flex justify-between items-center">
                            <div className="text-right">
                              <h4 className="text-xs font-black text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse block"></span>
                                المستشار والمساعد الفني الذكي
                              </h4>
                              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">جاهزون للإجابة الفورية وتأمين طلبات أولياء الأمور واللاعبين</span>
                            </div>
                            <Sparkles className="w-4.5 h-4.5 text-[#B76E79]" />
                          </div>

                          {/* Message Bubbles list stream */}
                          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 text-xs">
                            {chatHistory.map((chat, idx) => (
                              <div 
                                key={idx}
                                className={`p-4 max-w-[80%] rounded-[20px] leading-relaxed shadow-lg ${
                                  chat.sender === 'user'
                                    ? 'bg-[#5A0B17] text-white mr-auto rounded-tl-none text-left'
                                    : 'bg-[#140708]/60 text-slate-200 ml-auto rounded-tr-none text-right border border-white/5'
                                }`}
                              >
                                <p className="font-bold">{chat.text}</p>
                                <span className="text-[8px] text-slate-500 block mt-1.5">{chat.time}</span>
                              </div>
                            ))}
                          </div>

                          {/* Input text and send action button */}
                          <form onSubmit={handleSendMessage} className="relative">
                            <input 
                              type="text"
                              placeholder="اكتب رسالتك الرياضية أو استفسارك هنا..."
                              value={chatMessage}
                              onChange={e => setChatMessage(e.target.value)}
                              className="w-full pr-5 pl-14 py-4 bg-[#140708]/60 border border-white/10 rounded-2xl text-xs text-white outline-none focus:border-[#B76E79] transition-all placeholder:text-slate-500"
                            />
                            <button
                              type="submit"
                              className="absolute left-2 top-2 p-2 bg-[#5A0B17] hover:bg-[#B76E79] text-white rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center shadow-lg"
                              title="إرسال"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>

                        </div>

                        {/* Interactive contact helper details */}
                        <div className="lg:col-span-4 bg-[#1C090C]/40 backdrop-blur-md border border-[#B76E79]/15 p-6 rounded-[32px] shadow-2xl space-y-4">
                          <div>
                            <h4 className="text-xs font-black text-white">معلومات الدعم الهاتفي المباشر</h4>
                            <p className="text-[10px] text-slate-400 mt-1">تواصل هاتفياً مباشرة مع سكرتارية فروع الرياض في حال الحالات الطارئة.</p>
                          </div>
                          
                          <div className="space-y-2.5 text-xs text-slate-300 font-semibold">
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-right">
                              <p className="text-[10px] text-slate-500 font-bold">رقم الإدارة الموحد:</p>
                              <a href="tel:+966500000000" className="text-white hover:text-[#B76E79] transition-colors font-mono tracking-wider font-bold block mt-0.5">+٩٦٦ ٥٠ ٠٠٠ ٠٠٠٠</a>
                            </div>
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-right">
                              <p className="text-[10px] text-slate-500 font-bold">البريد الفني المعتمد:</p>
                              <a href="mailto:support@elashwal.com" className="text-white hover:text-[#B76E79] transition-colors font-mono block mt-0.5">support@elashwal.com</a>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </main>

        </div>

      )}

      {/* ================= NATIVE-FEELING MOBILE BOTTOM NAVIGATION BAR ================= */}
      {isLoggedIn && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#140708]/95 backdrop-blur-3xl border-t border-[#B76E79]/15 py-3 px-6 flex justify-around items-center text-[10px] font-black text-slate-400 shadow-[0_-10px_35px_rgba(0,0,0,0.85)]">
          {[
            { id: 'home', label: 'الأداء', icon: Activity },
            { id: 'schedule', label: 'الجدول', icon: Dumbbell },
            { id: 'attendance', label: 'الحضور', icon: CheckSquare },
            { id: 'booking', label: 'الملعب', icon: QrCode },
            { id: 'chat', label: 'محادثة', icon: MessageSquare }
          ].map(btn => {
            const Icon = btn.icon;
            const isSelected = portalTab === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => handleTabChange(btn.id as any)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  isSelected ? 'text-[#B76E79] scale-105' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================= PORTAL FOOTER ================= */}
      <footer className="bg-[#090102] border-t border-[#B76E79]/10 text-slate-500 py-6 text-center text-[10px] font-bold mt-auto pb-16 lg:pb-6">
        <span>بوابة العميل واللاعب الراقية لأكاديمية الأشوال الرياضية © ٢٠٢٦</span>
        <span className="text-slate-600 block mt-1">تطوير وهندسة برمجية متطابقة مع معايير Apple Human Interface & Nike Core</span>
      </footer>

    </div>
  );
};
