/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, QrCode, Calendar, CheckSquare, Clock, Heart, DollarSign, Bell, User, 
  MessageSquare, Upload, RefreshCw, Download, Edit, Save, Plus, ArrowUpRight, 
  ChevronLeft, Sparkles, Smile, Landmark, Dumbbell, ShieldCheck, Phone
} from 'lucide-react';
import { Player, Transaction } from '../types';

interface PlayerDashboardProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  player: Player;
  onLogout: () => void;
}

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ 
  onAddToast, player, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'membership' | 'subscription' | 'schedule' | 'performance' | 'payments' | 'notifications' | 'profile' | 'support'>('home');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: player.name,
    phone: player.phone,
    guardianName: 'عبد العزيز السالم',
    guardianPhone: '0551234567',
    medicalNotes: 'لا توجد إصابات حالية، جاهز بدنياً وفنياً بنسبة ١٠٠٪.',
    emergencyContact: '0559876543'
  });

  // Renewal form state
  const [renewPlan, setRenewPlan] = useState('باقة-1');
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  // Chat/Support Simulation state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'system', text: 'مرحباً بك في خدمة دعم كابتن الأكاديمية. كيف يمكننا مساعدتك اليوم يا بطل؟', time: '10:00 ص' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { sender: 'user', text: chatInput, time: 'الآن' }]);
    const userQuery = chatInput;
    setChatInput('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        sender: 'system',
        text: `شكراً لاستفسارك يا بطل! تم رفع استفسارك المكتوب بخصوص "${userQuery}" لمدربك المسؤول كابتن أحمد الشمراني وسيتواصل معك فوراً.`,
        time: 'الآن'
      }]);
    }, 1200);
  };

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
      setReceiptUploaded(true);
      onAddToast('تم رفع صورة إيصال الدفع البنكي بنجاح للاعتماد من المحاسبة!', 'success');
    }
  };

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptUploaded) {
      onAddToast('الرجاء إرفاق صورة إيصال الدفع البنكي لتأكيد التجديد!', 'error');
      return;
    }
    onAddToast('تم رفع طلب تجديد الاشتراك بنجاح للإشراف المالي!', 'success');
    setShowRenewModal(false);
    setReceiptUploaded(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast('تم تعديل وحفظ بيانات الملف الشخصي بنجاح!', 'success');
    setShowEditProfileModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Player Sidebar Profile & Quick Actions & Nav Links */}
      <div className="lg:w-80 flex flex-col gap-5 shrink-0">
        
        {/* Main Mini Profile Card */}
        <div className="bg-[#1C080B]/60 backdrop-blur-md border border-[#B76E79]/20 rounded-3xl p-6 text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#B76E79] shadow-2xl">
            <div className={`w-full h-full ${player.avatarColor} text-white flex items-center justify-center font-black text-3xl`}>
              {player.name.charAt(0)}
            </div>
          </div>

          <div>
            <h3 className="text-md font-black text-white">{player.name}</h3>
            <span className="text-[10px] text-[#B76E79] font-black tracking-wider uppercase bg-[#5A0B17]/20 px-3 py-1 rounded-full mt-1.5 inline-block border border-[#B76E79]/20">
              {player.id}
            </span>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2.5 text-xs text-slate-400 text-right font-semibold">
            <div className="flex justify-between">
              <span>اللعبة والبرنامج:</span>
              <span className="text-white font-bold">{player.sport}</span>
            </div>
            <div className="flex justify-between">
              <span>المدرب الفني:</span>
              <span className="text-[#E5D4C0] font-bold">كابتن أحمد الشمراني</span>
            </div>
            <div className="flex justify-between">
              <span>الفرع النشط:</span>
              <span className="text-white">فرع شمال الرياض</span>
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              عرض الـ QR
            </button>
            <button
              onClick={() => setShowRenewModal(true)}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              طلب تجديد
            </button>
          </div>
        </div>

        {/* Tab Links */}
        <div className="bg-[#1C080B]/30 backdrop-blur-md border border-white/5 rounded-3xl p-3 space-y-1 text-xs">
          {[
            { id: 'home', label: 'لوحة التحكم', icon: Award },
            { id: 'attendance', label: 'سجل الحضور والغياب', icon: CheckSquare },
            { id: 'membership', label: 'بطاقة العضوية', icon: QrCode },
            { id: 'subscription', label: 'تفاصيل باقة الاشتراك', icon: RefreshCw },
            { id: 'schedule', label: 'جدول التدريبات', icon: Calendar },
            { id: 'performance', label: 'تقييم الأداء الفني', icon: Sparkles },
            { id: 'payments', label: 'الفواتير والمدفوعات', icon: DollarSign },
            { id: 'notifications', label: 'مركز التنبيهات', icon: Bell },
            { id: 'profile', label: 'الملف الشخصي والوثائق', icon: User },
            { id: 'support', label: 'استفسارات ودعم الكابتن', icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-right cursor-pointer ${
                  isTabActive
                    ? 'bg-[#5A0B17]/25 text-white border border-[#B76E79]/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.01]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? 'text-[#E5D4C0]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Dashboard Panel Screen Content */}
      <div className="flex-1 min-w-0">
        
        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Quick Hero Header card */}
            <div className="bg-gradient-to-l from-[#1C080B] via-[#5A0B17]/20 to-slate-900 border border-[#B76E79]/20 p-6 rounded-3xl text-right space-y-1 relative overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 w-44 h-44 bg-[#5A0B17]/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-[#B76E79] text-xs font-black tracking-widest block animate-pulse">مرحباً يا بطل الأكاديمية الواعد</span>
              <h2 className="text-xl md:text-2xl font-serif font-black text-white">استعد للتحدي القادم نحو الاحترافية الكاملة!</h2>
              <p className="text-slate-300 text-xs font-medium max-w-xl">
                هنا تجد إحصائياتك الفنية والبدنية، ومستويات حضورك وتوجيهات مدربك الفنية والبدنية لمساعدتك على التقدم.
              </p>
            </div>

            {/* Core Stats Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold block">الاشتراك الحالي</span>
                <span className="text-white font-bold block mt-1">باقة النخبة المتميزة</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold block">الحصص المتبقية</span>
                <span className="text-[#E5D4C0] font-mono text-lg font-black block mt-1">٨ حصص</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold block">نسبة الحضور</span>
                <span className="text-emerald-400 font-mono text-lg font-black block mt-1">٩٤٪</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold block">التأخر أو الغياب</span>
                <span className="text-rose-400 font-mono text-lg font-black block mt-1">١ تأخر</span>
              </div>
            </div>

            {/* Coach latest note card */}
            <div className="bg-[#1C080B]/30 border border-[#B76E79]/20 rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-white/5 pb-3">
                <Smile className="w-4.5 h-4.5 text-[#E5D4C0]" /> أحدث توجيهات وملاحظات مدرب الفئة
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                "{profileForm.medicalNotes}"
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold pt-2">
                <span>كابتن أحمد الشمراني</span>
                <span>تحديث: منذ يومين</span>
              </div>
            </div>

            {/* Upcoming schedule summary */}
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-white">جدول تدريب الحصص القادمة</h4>
                <button onClick={() => setActiveTab('schedule')} className="text-[10px] text-[#B76E79] font-black hover:underline">عرض الجدول الكامل</button>
              </div>

              <div className="space-y-2.5">
                {[
                  { day: 'الإثنين', time: '05:00 م - 06:30 م', location: 'الملعب الخماسي أ', topic: 'تكتيك وتدريب لياقي مكثف' },
                  { day: 'الأربعاء', time: '05:00 م - 06:30 م', location: 'الملعب الخماسي أ', topic: 'تقسيم فني ومباريات ودية' }
                ].map((s, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-bold block">{s.topic}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{s.day} | {s.location}</span>
                    </div>
                    <span className="font-mono text-slate-400 font-semibold">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-5 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">سجل الحضور والغياب والمواظبة اليومي</h3>
            
            <div className="grid grid-cols-2 gap-4 text-center font-bold text-xs">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="text-emerald-400 block">مرات الحضور الفعلي</span>
                <span className="text-white text-lg font-mono block mt-1">١٦ حصة</span>
              </div>
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <span className="text-rose-400 block">مرات الغياب أو الاعتذار</span>
                <span className="text-white text-lg font-mono block mt-1">١ حصة</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { date: '٢٠٢٦/٠٦/٢٨', time: '05:02 م', status: 'حاضر', remark: 'انضباط كامل ومشاركة ممتازة' },
                { date: '٢٠٢٦/٠٦/٢٦', time: '05:05 م', status: 'متأخر', remark: 'تأخر ٥ دقائق بعذر رسمي' },
                { date: '٢٠٢٦/٠٦/٢٤', time: '---', status: 'غائب', remark: 'غياب بعذر مرضي معتمد' },
              ].map((rec, i) => (
                <div key={i} className="p-3.5 bg-[#1C080B]/40 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-white font-bold block">{rec.remark}</span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{rec.date} | في {rec.time}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                    rec.status === 'حاضر' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                    rec.status === 'غائب' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                  }`}>
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEMBERSHIP */}
        {activeTab === 'membership' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-center space-y-6">
            <h3 className="text-xs font-black text-white text-right pb-3 border-b border-white/5">كارنيه العضوية والتحقق الرقمي NFC</h3>
            
            {/* Holographic ID card */}
            <div className="max-w-sm mx-auto relative rounded-2xl bg-gradient-to-br from-[#1C080B] via-[#5A0B17] to-slate-950 p-6 border border-[#B76E79]/30 text-right space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="w-10 h-7 bg-gradient-to-br from-amber-400 to-amber-200 rounded-md opacity-70" />
                <span className="text-[10px] text-white font-black tracking-widest font-serif">AL ASHWAL</span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 border border-[#B76E79]/25 flex items-center justify-center text-white text-2xl font-black">
                  {player.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">{player.name}</h4>
                  <p className="text-[10px] text-[#E5D4C0] font-bold mt-1">برنامج: {player.sport}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">المستوى: {player.level}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl max-w-[120px] mx-auto flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-[9px] text-center p-2 leading-tight">
                  {player.id}
                  <br />
                  SECURE_RFID
                </div>
              </div>

              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold border-t border-white/5 pt-3">
                <span>NFC CARD PRO</span>
                <span className="text-[#E5D4C0]">حالة العضوية: نشط</span>
              </div>
            </div>

            <button
              onClick={() => onAddToast('تم تنزيل الكارنيه الرقمي لمركز محفظة الجوال Apple/Google Wallet.', 'success')}
              className="px-6 py-3 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/30 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 text-[#E5D4C0]" />
              تحميل الكارنيه للمحفظة الرقمية
            </button>
          </div>
        )}

        {/* TAB 4: SUBSCRIPTION */}
        {activeTab === 'subscription' && (
          <div className="space-y-6 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">باقة الاشتراك المالي والتمارين</h3>

            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 block">الباقة النشطة</span>
                  <h4 className="text-sm font-black text-white mt-0.5">باقة النخبة الرياضية للبراعم</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  نشطة ومؤكدة
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold py-3 border-y border-white/5">
                <div>
                  <span className="text-slate-500 block">الحصص المسجلة:</span>
                  <span className="text-white block mt-0.5">٢٤ حصة فنية</span>
                </div>
                <div>
                  <span className="text-slate-500 block">الحصص المستخدمة:</span>
                  <span className="text-white block mt-0.5">١٦ حصة</span>
                </div>
                <div>
                  <span className="text-slate-500 block">الحصص المتبقية:</span>
                  <span className="text-[#E5D4C0] font-mono text-sm block mt-0.5">٨ حصص</span>
                </div>
                <div>
                  <span className="text-slate-500 block">تاريخ الانتهاء:</span>
                  <span className="text-white font-mono block mt-0.5">٢٠٢٦-٠٧-٢٩</span>
                </div>
              </div>

              <button
                onClick={() => setShowRenewModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white rounded-xl text-xs font-black hover:scale-[1.02] transition-all cursor-pointer"
              >
                طلب تجديد الباقة أو الترقية
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 space-y-5">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">جدول التدريبات والملاعب المعتمد</h3>

            <div className="space-y-3">
              {[
                { day: 'الإثنين', time: '05:00 م - 06:30 م', coach: 'كابتن أحمد الشمراني', location: 'الملعب الخماسي أ', topic: 'المهارات اللياقية والتحكم الفردي' },
                { day: 'الأربعاء', time: '05:00 م - 06:30 م', coach: 'كابتن أحمد الشمراني', location: 'الملعب الخماسي أ', topic: 'التكتيك الجماعي وصناعة الهجمات' },
                { day: 'السبت', time: '10:00 ص - 11:30 ص', coach: 'كابتن فيصل الحربي', location: 'الملعب الأولمبي ب', topic: 'تقسيمة عامة ومباراة تنافسية' },
              ].map((s, idx) => (
                <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-right flex flex-col sm:flex-row gap-3 justify-between sm:items-center text-xs">
                  <div>
                    <h4 className="font-black text-white">{s.topic}</h4>
                    <p className="text-[10px] text-[#B76E79] font-bold mt-1">المدرب: {s.coach} | {s.location}</p>
                    <span className="inline-block px-2 py-0.5 bg-white/5 text-slate-400 rounded text-[9px] font-bold mt-1.5">{s.day}</span>
                  </div>
                  <span className="font-mono text-[#E5D4C0] font-black text-sm">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="space-y-6 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">المخطط البياني والتقييمات الفنية الدورية</h3>

            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-300 block">نتائج ومؤشرات مهارات البطل (100):</span>
              
              <div className="space-y-3.5 text-xs font-bold">
                {[
                  { name: 'التحكم بالكرة والمراوغة', score: 85, color: 'bg-[#B76E79]' },
                  { name: 'التسديد والدقة', score: 75, color: 'bg-indigo-500' },
                  { name: 'التعاون والتمرير الجماعي', score: 80, color: 'bg-[#E5D4C0]' },
                  { name: 'اللياقة البدنية والتحمل', score: 90, color: 'bg-emerald-500' },
                  { name: 'الانضباط والروح الرياضية', score: 95, color: 'bg-amber-500' }
                ].map((sk, i) => (
                  <div key={i} className="space-y-1.5 text-right">
                    <div className="flex justify-between text-slate-400">
                      <span>{sk.name}</span>
                      <span className="text-white font-mono">{sk.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden">
                      <div className={`h-full ${sk.color}`} style={{ width: `${sk.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-5 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">سجل السندات والفواتير والمدفوعات</h3>

            <div className="space-y-3">
              {[
                { id: 'FT-1029', desc: 'تجديد باقة النخبة ٣ شهور', amount: 1350, status: 'مكتمل', date: '٢٠٢٦-٠٦-٠١' },
                { id: 'FT-0982', desc: 'شراء ملابس الأكاديمية الرسمية والشنطة', amount: 350, status: 'مكتمل', date: '٢٠٢٦-٠٤-١٥' }
              ].map((inv, idx) => (
                <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-white font-black block">{inv.desc}</span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">سند رقم: {inv.id} | {inv.date}</span>
                  </div>
                  <div className="text-left space-y-1">
                    <span className="text-[#E5D4C0] font-mono font-black block">{inv.amount} ر.س</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/15 text-emerald-400">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">مركز التنبيهات وإشعارات الإدارة</h3>

            <div className="space-y-3">
              {[
                { title: 'موعد الحصة الودية القادمة', body: 'تقرر إقامة مباراة ترفيهية تنافسية لجميع البراعم يوم السبت القادم بمقر فرع شمال الرياض الياسمين.', date: 'اليوم - 10:30 ص' },
                { title: 'اعتماد تجديد باقتك بنجاح', body: 'تم التأكيد واعتماد تجديد العضوية لمدة ٣ شهور إضافية بنجاح من المحاسبة.', date: 'أمس - 04:00 م' }
              ].map((notif, idx) => (
                <div key={idx} className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl text-right text-xs">
                  <h4 className="font-black text-white">{notif.title}</h4>
                  <p className="text-slate-400 mt-1 font-semibold leading-relaxed">{notif.body}</p>
                  <span className="text-[9px] text-slate-500 font-bold mt-1.5 block">{notif.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 text-xs font-bold text-right">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تفاصيل الملف الشخصي والمعلومات الطبية</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">الاسم الثلاثي للاعب *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">هاتف اللاعب (إن وجد)</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none text-left font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">اسم ولي الأمر والقرابة *</label>
                <input
                  type="text"
                  required
                  value={profileForm.guardianName}
                  onChange={e => setProfileForm({ ...profileForm, guardianName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">جوال التواصل لولي الأمر *</label>
                <input
                  type="tel"
                  required
                  value={profileForm.guardianPhone}
                  onChange={e => setProfileForm({ ...profileForm, guardianPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none text-left font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white rounded-xl text-xs font-black hover:scale-105 transition-all cursor-pointer"
            >
              حفظ التعديلات
            </button>
          </form>
        )}

        {/* TAB 10: SUPPORT */}
        {activeTab === 'support' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-5 flex flex-col h-[480px]">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">استفسارات وتواصل فني مع المدرب</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3.5 py-4 px-1">
              {chatHistory.map((chat, idx) => {
                const isSystem = chat.sender === 'system';
                return (
                  <div key={idx} className={`flex ${isSystem ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 max-w-xs rounded-2xl text-xs ${
                      isSystem 
                        ? 'bg-white/5 text-slate-200 rounded-tr-none' 
                        : 'bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white rounded-tl-none'
                    }`}>
                      <p className="font-semibold leading-relaxed">{chat.text}</p>
                      <span className="text-[8px] text-slate-500 font-bold mt-1 block font-mono text-left">{chat.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="اكتب استفسارك الفني للمدرب هنا..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl"
              >
                إرسال
              </button>
            </form>
          </div>
        )}

      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1C080B] border border-[#B76E79]/30 rounded-3xl p-6 max-w-xs w-full text-center space-y-6 animate-fade-in relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-5 left-5 p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-black text-white">رمز التحقق السريع QR</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">امسح الكود لتسجيل الحضور اليومي الفوري في الصالة:</p>
            </div>

            <div className="bg-white p-4 rounded-2xl max-w-[150px] mx-auto shadow-inner flex flex-col items-center">
              <div className="w-28 h-28 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-[9px] text-center p-2 leading-tight">
                {player.id}
                <br />
                ATTENDANCE_OK
              </div>
              <span className="text-[9px] text-slate-500 font-black font-mono mt-2">{player.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1C080B] border border-[#B76E79]/30 rounded-3xl p-6 max-w-md w-full text-right space-y-5 animate-fade-in relative text-xs">
            <button
              onClick={() => setShowRenewModal(false)}
              className="absolute top-5 left-5 p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-black text-white">تقديم طلب تجديد الاشتراك والباقة</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">اختر الباقة الرياضية المفضلة وارفع إيصال الدفع البنكي:</p>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4 font-bold">
              <div className="space-y-1.5">
                <label className="text-slate-300">اختر البرنامج والباقة التدريبية *</label>
                <select
                  value={renewPlan}
                  onChange={e => setRenewPlan(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none"
                >
                  <option value="باقة-1">باقة النخبة للبراعم (٣ شهور) - 1350 ر.س</option>
                  <option value="باقة-2">الباقة الفضية الفردية (شهر) - 450 ر.س</option>
                  <option value="باقة-3">باقة المحترفين المتكاملة (سنة) - 4800 ر.س</option>
                </select>
              </div>

              {/* Upload payment receipt */}
              <div className="space-y-2">
                <label className="text-slate-300 block">إرفاق إيصال التحويل البنكي (مطلوب) *</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center bg-slate-950/30 hover:border-[#B76E79] transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadReceipt}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-400 block font-semibold">
                    {receiptUploaded ? 'تم إرفاق الملف بنجاح!' : 'اضغط لرفع صورة إيصال الدفع البنكي'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl"
              >
                تأكيد وإرسال طلب التجديد
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
