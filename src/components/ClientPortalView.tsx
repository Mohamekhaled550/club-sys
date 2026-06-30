/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { Player, Parent, Coach, Transaction, Employee } from '../types';
import { PlayerDashboard } from './PlayerDashboard';
import { ParentDashboard } from './ParentDashboard';
import { CoachDashboard } from './CoachDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

interface ClientPortalViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  parentsList: Parent[];
  coachesList: Coach[];
  employeesList: Employee[];
  transactionsList: Transaction[];
  onNavigateToWebsite: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  onAddToast,
  playersList,
  parentsList,
  coachesList,
  employeesList,
  transactionsList,
  onNavigateToWebsite
}) => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'player' | 'parent' | 'coach' | 'employee'>('player');
  const [phoneNumber, setPhoneNumber] = useState('0551234567');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Kids/Profiles state
  const [selectedKidId, setSelectedKidId] = useState<string>(playersList[0]?.id || 'P1');

  // App Theme presets
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [showNotifications, setShowNotifications] = useState(false);

  // Send Mock OTP code
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      onAddToast('يرجى كتابة رقم جوال صالح.', 'error');
      return;
    }
    setShowOtpInput(true);
    onAddToast('تم إرسال كود التحقق السريع المكون من 4 أرقام لهاتفك الجوال!', 'success');
  };

  // Verify Mock OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === '1234' || otpCode === '123456' || !otpCode) {
      setIsLoggedIn(true);
      onAddToast('تم التحقق بنجاح! مرحباً بك في لوحة تحكم الأكاديمية.', 'success');
    } else {
      onAddToast('رمز التحقق الذي أدخلته غير صحيح. يرجى تجربة الرمز الافتراضي (1234)', 'error');
    }
  };

  // Active kid record
  const activeKidRecord = playersList.find(p => p.id === selectedKidId) || playersList[0] || {
    id: 'P1',
    name: 'يوسف عبد العزيز السالم',
    sport: 'كرة القدم',
    level: 'محترف (A+)',
    groupName: 'براعم النخبة أ',
    avatarColor: 'bg-[#5A0B17]'
  };

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
      <header className="sticky top-0 z-40 bg-[#140708]/85 backdrop-blur-3xl border-b border-[#B76E79]/15 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-4 px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand visual with Real Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={onNavigateToWebsite}>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B76E79] shadow-xl">
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
        <div className="flex items-center gap-3">
          
          {/* Quick Action Language Switcher */}
          <button 
            onClick={() => { setLang(prev => prev === 'ar' ? 'en' : 'ar'); onAddToast('تم تبديل واجهة العميل للغة المختارة', 'info'); }}
            className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#B76E79] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
            title="تبديل اللغة"
          >
            <Languages className="w-4.5 h-4.5" />
          </button>

          {/* Theme Preset Toggler */}
          <button 
            onClick={() => { setIsDarkMode(!isDarkMode); onAddToast(isDarkMode ? 'تم التبديل للوضع الصباحي الفاخر' : 'تم التبديل للوضع الليلي المريح للعين', 'info'); }}
            className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#B76E79] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
            title="وضع الإضاءة"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Premium Interactive Notification Center */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#B76E79] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 relative cursor-pointer"
              aria-label="الإشعارات"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#B76E79] rounded-full animate-pulse" />
            </button>

            {/* Notifications Dropdown Grid */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute left-0 top-full mt-3 w-80 bg-[#1A090B] border border-[#B76E79]/25 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 text-right space-y-3"
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

          {/* Return to public website */}
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
                onAddToast('تم تسجيل الخروج بنجاح.', 'info');
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
        <main className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
          
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

            <div className="text-center space-y-2 mb-6">
              <span className="text-[10px] text-[#B76E79] font-black tracking-widest uppercase block animate-pulse">
                بوابة النخبة والبراعم الواعدين
              </span>
              <h2 className="text-2xl font-serif font-black text-white">تسجيل الدخول الآمن</h2>
              <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto">
                يرجى تحديد دورك، وإدخال رقم جوالك المعتمد لتلقي رمز التحقق السريع (OTP).
              </p>
            </div>

            {/* Premium Role switcher tabs - 2x2 grid */}
            <div className="grid grid-cols-2 gap-2 bg-white/[0.01] p-1.5 border border-white/5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setSelectedRole('player'); onAddToast('تم تفعيل واجهة اللاعب الفنية', 'info'); }}
                className={`py-3 rounded-xl text-[11px] font-black transition-all duration-300 cursor-pointer ${
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
                className={`py-3 rounded-xl text-[11px] font-black transition-all duration-300 cursor-pointer ${
                  selectedRole === 'parent' 
                    ? 'bg-gradient-to-r from-[#5A0B17] to-[#440810] border border-[#B76E79]/30 text-white shadow-2xl' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                بوابة ولي الأمر
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('coach'); onAddToast('تم تفعيل بوابة الكابتن والمدرب الرياضي', 'info'); }}
                className={`py-3 rounded-xl text-[11px] font-black transition-all duration-300 cursor-pointer ${
                  selectedRole === 'coach' 
                    ? 'bg-gradient-to-r from-[#5A0B17] to-[#440810] border border-[#B76E79]/30 text-white shadow-2xl' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                بوابة المدرب
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('employee'); onAddToast('تم تفعيل بوابة الموظف الإداري', 'info'); }}
                className={`py-3 rounded-xl text-[11px] font-black transition-all duration-300 cursor-pointer ${
                  selectedRole === 'employee' 
                    ? 'bg-gradient-to-r from-[#5A0B17] to-[#440810] border border-[#B76E79]/30 text-white shadow-2xl' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                بوابة الموظف
              </button>
            </div>

            {!showOtpInput ? (
              /* Phone Input Stage */
              <form onSubmit={handleSendOtp} className="space-y-5 text-xs font-bold text-right">
                
                <div className="space-y-2">
                  <label className="block text-slate-300 mr-1.5 font-bold">رقم الجوال المسجل *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="0551234567"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full pl-5 pr-12 py-3.5 bg-white/[0.02] border border-white/10 focus:border-[#B76E79] rounded-2xl text-white font-mono text-left text-sm outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    />
                    <Phone className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" />
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
                  className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] via-[#440810] to-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-2xl text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer hover:shadow-[#5A0B17]/20"
                >
                  إرسال كود التحقق OTP
                </button>

              </form>
            ) : (
              /* OTP verification Stage */
              <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs font-bold text-right">
                
                <div className="space-y-2">
                  <label className="block text-slate-300 mr-1.5 font-bold">رمز التحقق المكون من 4 أرقام *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="أدخل 1234 للتجربة السريعة"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      className="w-full pl-5 pr-12 py-3.5 bg-white/[0.02] border border-white/10 focus:border-[#B76E79] rounded-2xl text-white font-mono text-center text-sm outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    />
                    <Shield className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" />
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
                  className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] via-[#4A0D15] to-[#5A0B17] border border-[#B76E79]/45 text-white font-black rounded-2xl text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer hover:shadow-[#5A0B17]/20"
                >
                  تأكيد التحقق والدخول
                </button>

              </form>
            )}

            <div className="pt-4 mt-6 border-t border-white/5 text-center text-[10px] text-slate-500 font-bold space-y-1">
              <span>جميع الحقوق محفوظة لأكاديمية الأشوال الرياضية © 2026</span>
              <span className="block text-[#B76E79]">نظام حماية البيانات المشفرة والامتثال الرياضي</span>
            </div>

          </motion.div>

        </main>

      ) : (

        /* 2. MAIN CORE MODULAR ROLES-BASED PORTALS DISPATCHER */
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-in">
          {selectedRole === 'player' && (
            <PlayerDashboard 
              onAddToast={onAddToast}
              player={activeKidRecord}
              onLogout={() => {
                setIsLoggedIn(false);
                onAddToast('تم تسجيل الخروج وتأمين الحساب.', 'info');
              }}
            />
          )}
          {selectedRole === 'parent' && (
            <ParentDashboard 
              onAddToast={onAddToast}
              playerList={playersList}
              onLogout={() => {
                setIsLoggedIn(false);
                onAddToast('تم تسجيل الخروج وتأمين الحساب.', 'info');
              }}
            />
          )}
          {selectedRole === 'coach' && (
            <CoachDashboard 
              onAddToast={onAddToast}
              coach={coachesList[0] || coachesList[0]}
              playersList={playersList}
              onLogout={() => {
                setIsLoggedIn(false);
                onAddToast('تم تسجيل الخروج وتأمين الحساب.', 'info');
              }}
            />
          )}
          {selectedRole === 'employee' && (
            <EmployeeDashboard 
              onAddToast={onAddToast}
              employee={employeesList[0] || employeesList[0]}
              onLogout={() => {
                setIsLoggedIn(false);
                onAddToast('تم تسجيل الخروج وتأمين الحساب.', 'info');
              }}
            />
          )}
        </div>

      )}

      {/* ================= PORTAL FOOTER ================= */}
      <footer className="bg-[#090102] border-t border-[#B76E79]/10 text-slate-500 py-6 text-center text-[10px] font-bold mt-auto">
        <span>بوابة العميل واللاعب الراقية لأكاديمية الأشوال الرياضية © ٢٠٢٦</span>
        <span className="text-slate-600 block mt-1">تطوير وهندسة برمجية متطابقة مع معايير Apple Human Interface & Nike Core</span>
      </footer>

    </div>
  );
};
