/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, QrCode, Calendar, CheckSquare, Clock, Heart, DollarSign, Bell, User, 
  MessageSquare, Upload, RefreshCw, Download, Edit, Save, Plus, ArrowUpRight, 
  ChevronLeft, Sparkles, Smile, Landmark, Dumbbell, ShieldCheck, Phone, Users
} from 'lucide-react';
import { Player } from '../types';

interface ParentDashboardProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playerList: Player[]; // All players in the system so we can select the parent's children
  onLogout: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ 
  onAddToast, playerList, onLogout 
}) => {
  // Define parent's kids (We map first 2 players as children of the parent)
  const myChildren = playerList.slice(0, 2);
  const [selectedChild, setSelectedChild] = useState<Player>(myChildren[0] || playerList[0]);
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'membership' | 'subscription' | 'schedule' | 'performance' | 'payments' | 'notifications' | 'support'>('home');
  
  // Modals
  const [showQrModal, setShowQrModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [renewPlan, setRenewPlan] = useState('باقة-1');

  // Support/Chat
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'system', text: 'مرحباً بك يا ولي الأمر المحترم. يمكنك ترك رسالة لمدرب طفلك هنا وسيجيبك فوراً.', time: '10:00 ص' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { sender: 'user', text: chatInput, time: 'الآن' }]);
    const query = chatInput;
    setChatInput('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        sender: 'system',
        text: `تلقيت استفسارك المكتوب بخصوص البطل ${selectedChild.name}. تم إرسال الملاحظة لكابتن أحمد الشمراني وسنتواصل معك قريباً جداً.`,
        time: 'الآن'
      }]);
    }, 1200);
  };

  const handleChildChange = (child: Player) => {
    setSelectedChild(child);
    onAddToast(`تم الانتقال لمتابعة بيانات البطل: ${child.name}`, 'info');
  };

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptUploaded) {
      onAddToast('يرجى إرفاق إيصال التحويل البنكي للتجديد!', 'error');
      return;
    }
    onAddToast(`تم رفع طلب تجديد الباقة للبطل ${selectedChild.name} للمراجعة!`, 'success');
    setShowRenewModal(false);
    setReceiptUploaded(false);
  };

  return (
    <div className="space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Children Selector Banner */}
      <div className="bg-[#1C080B]/60 backdrop-blur-md border border-[#B76E79]/20 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">بوابة أولياء الأمور (Parent Portal)</span>
          <h2 className="text-md font-black text-white flex items-center gap-1.5 mt-1">
            <Users className="w-5 h-5 text-[#E5D4C0]" />
            أبنائي المسجلين بالأكاديمية:
          </h2>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {myChildren.map(child => (
            <button
              key={child.id}
              onClick={() => handleChildChange(child)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedChild.id === child.id
                  ? 'bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/40 text-white shadow-lg'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className={`w-5 h-5 rounded-full ${child.avatarColor} text-white flex items-center justify-center text-[10px] font-bold`}>
                {child.name.charAt(0)}
              </div>
              {child.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Child Mini Profile & Links Sidebar */}
        <div className="lg:w-80 flex flex-col gap-5 shrink-0">
          
          <div className="bg-[#1C080B]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#B76E79] shadow-md">
              <div className={`w-full h-full ${selectedChild.avatarColor} text-white flex items-center justify-center font-black text-2xl`}>
                {selectedChild.name.charAt(0)}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-white">{selectedChild.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{selectedChild.sport} | {selectedChild.level}</p>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-slate-400 text-right font-semibold">
              <div className="flex justify-between">
                <span>تاريخ الاشتراك:</span>
                <span className="text-white font-mono">{selectedChild.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span>المدرب المسؤول:</span>
                <span className="text-[#E5D4C0]">كابتن أحمد الشمراني</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                كود الـ QR
              </button>
              <button
                onClick={() => setShowRenewModal(true)}
                className="flex-1 py-2 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/20 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                تجديد باقة
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-[#1C080B]/30 backdrop-blur-md border border-white/5 rounded-3xl p-3 space-y-1 text-xs">
            {[
              { id: 'home', label: 'لوحة المتابعة', icon: Award },
              { id: 'attendance', label: 'سجل حضور البطل', icon: CheckSquare },
              { id: 'membership', label: 'بطاقة العضوية للأبناء', icon: QrCode },
              { id: 'subscription', label: 'تفاصيل باقة الاشتراك', icon: RefreshCw },
              { id: 'schedule', label: 'جدول التدريبات والملاعب', icon: Calendar },
              { id: 'performance', label: 'تقييم الأداء الفني والبدني', icon: Sparkles },
              { id: 'payments', label: 'الفواتير والمدفوعات', icon: DollarSign },
              { id: 'notifications', label: 'تنبيهات الإدارة وأولياء الأمور', icon: Bell },
              { id: 'support', label: 'محادثة وتواصل مع المدرب', icon: MessageSquare },
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

        {/* Content Panel Area */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: HOME OVERVIEW */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Parent Welcome Banner */}
              <div className="bg-gradient-to-l from-slate-900 via-[#5A0B17]/25 to-slate-900 border border-[#B76E79]/20 p-6 rounded-3xl text-right space-y-1">
                <span className="text-[#B76E79] text-xs font-black block">بوابة المتابعة الشاملة لولي الأمر</span>
                <h2 className="text-lg font-black text-white">البطل {selectedChild.name} يتقدم في مسيرته الرياضية!</h2>
                <p className="text-slate-300 text-xs font-medium leading-relaxed max-w-xl">
                  تتيح لك بوابة أولياء الأمور مراقبة الحضور والانصراف، والاطلاع على التوجيهات الفنية لمدربي البراعم والتقارير الشهرية فور صدورها.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-bold">حالة الباقة</span>
                  <span className="text-emerald-400 font-bold block mt-1">نشطة ومفعلة</span>
                </div>
                <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-bold">الحصص المتبقية</span>
                  <span className="text-[#E5D4C0] font-mono text-lg font-black block mt-1">٨ حصص</span>
                </div>
                <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-bold">نسبة المواظبة</span>
                  <span className="text-emerald-400 font-mono text-lg font-black block mt-1">٩٤٪</span>
                </div>
                <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-bold">الحصص المنجزة</span>
                  <span className="text-white font-mono text-lg font-black block mt-1">١٦ حصة</span>
                </div>
              </div>

              {/* Coach note */}
              <div className="bg-[#1C080B]/30 border border-[#B76E79]/25 rounded-3xl p-6 space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-1">
                  <Smile className="w-4.5 h-4.5 text-[#E5D4C0]" /> توجيهات وملاحظات مدرب الفئة الفنية لولي الأمر
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  "البطل يقدم أداء تصاعدياً ممتازاً، تم تحسين اللياقة البدنية وتوجيه اللاعب للتمارين الفردية لتقوية التمرير الطويل."
                </p>
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold border-t border-white/5 pt-2">
                  <span>كابتن أحمد الشمراني</span>
                  <span>تحديث: منذ يومين</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">كشف الحضور والغياب المفصل للبطل</h3>
              
              <div className="space-y-2.5">
                {[
                  { date: '٢٠٢٦/٠٦/٢٨', status: 'حاضر', remark: 'أداء بدني عالي وممتاز بالتقسيمة' },
                  { date: '٢٠٢٦/٠٦/٢٦', status: 'حاضر', remark: 'مواظبة ممتازة وتفاعل رائع' },
                  { date: '٢٠٢٦/٠٦/٢٤', status: 'غائب', remark: 'غياب بعذر معتمد من ولي الأمر' }
                ].map((rec, idx) => (
                  <div key={idx} className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-bold block">{rec.remark}</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">{rec.date}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                      rec.status === 'حاضر' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/25'
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
              <h3 className="text-xs font-black text-white text-right pb-3 border-b border-white/5">بطاقة العضوية والرمز السريع للبطل</h3>

              <div className="max-w-sm mx-auto relative rounded-2xl bg-gradient-to-br from-[#1C080B] via-[#5A0B17] to-slate-950 p-6 border border-[#B76E79]/30 text-right space-y-4 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-7 bg-gradient-to-br from-amber-400 to-amber-200 rounded-md opacity-70" />
                  <span className="text-[10px] text-white font-black tracking-widest font-serif">AL ASHWAL</span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-[#B76E79]/25 flex items-center justify-center text-white text-2xl font-black">
                    {selectedChild.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white leading-tight">{selectedChild.name}</h4>
                    <p className="text-[10px] text-[#E5D4C0] font-bold mt-1">برنامج: {selectedChild.sport}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">المستوى: {selectedChild.level}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl max-w-[120px] mx-auto flex flex-col items-center">
                  <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-[9px] text-center p-2 leading-tight">
                    {selectedChild.id}
                    <br />
                    APPROVED_RFID
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold border-t border-white/5 pt-3">
                  <span>RFID ACCREDITED</span>
                  <span className="text-emerald-400 font-black">نشط</span>
                </div>
              </div>

              <button
                onClick={() => onAddToast('تم تحميل الكارنيه بهيئة PDF عالية الجودة للطباعة والتسليم.', 'success')}
                className="px-5 py-2.5 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/30 text-white font-black rounded-xl text-xs flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#E5D4C0]" />
                تحميل الكارنيه للطباعة
              </button>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right space-y-5">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تفاصيل الاشتراك المالي والرسوم للبطل</h3>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <div>
                    <span className="text-slate-500 block">الباقة الحالية:</span>
                    <span className="text-white text-sm block mt-1">الباقة الذهبية للبراعم ٣ شهور</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-[9px] font-black">مفعل</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold border-t border-white/5 pt-3.5 text-slate-400">
                  <div>
                    <span>عدد الحصص الكلي:</span>
                    <span className="text-white block mt-0.5">٢٤ حصة</span>
                  </div>
                  <div>
                    <span>عدد الحصص المتبقية:</span>
                    <span className="text-[#E5D4C0] font-mono text-sm block mt-0.5">٨ حصص</span>
                  </div>
                  <div>
                    <span>تاريخ الانتهاء:</span>
                    <span className="text-white font-mono block mt-0.5">٢٠٢٦-٠٧-٢٩</span>
                  </div>
                  <div>
                    <span>تكلفة التجديد:</span>
                    <span className="text-white font-mono block mt-0.5">1350 ر.س</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right space-y-4">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">جدول تمارين وملاعب البطل</h3>

              <div className="space-y-3">
                {[
                  { day: 'الإثنين', time: '05:00 م - 06:30 م', location: 'الملعب الخماسي أ', topic: 'المهارات اللياقية والتحكم الفردي' },
                  { day: 'الأربعاء', time: '05:00 م - 06:30 م', location: 'الملعب الخماسي أ', topic: 'التكتيك الجماعي وصناعة الهجمات' }
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-black text-white">{s.topic}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{s.day} | {s.location}</p>
                    </div>
                    <span className="font-mono text-[#E5D4C0] font-black">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right space-y-5">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">التقييمات الفنية ومخططات تقدم البطل</h3>

              <div className="space-y-4">
                {[
                  { name: 'التحكم بالكرة والمراوغة', score: 85, color: 'bg-[#B76E79]' },
                  { name: 'التسديد والدقة', score: 75, color: 'bg-indigo-500' },
                  { name: 'التعاون والتمرير الجماعي', score: 80, color: 'bg-[#E5D4C0]' },
                  { name: 'اللياقة البدنية والتحمل', score: 90, color: 'bg-emerald-500' },
                  { name: 'الانضباط والروح الرياضية', score: 95, color: 'bg-amber-500' }
                ].map((sk, i) => (
                  <div key={i} className="space-y-1.5 text-xs font-bold">
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
          )}

          {/* TAB 7: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right space-y-4">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">سجل السندات والمدفوعات لولي الأمر</h3>

              <div className="space-y-3">
                {[
                  { id: 'FT-1029', desc: 'تجديد الاشتراك لثلاثة أشهر', amount: 1350, date: '٢٠٢٦-٠٦-٠١', status: 'مكتمل' }
                ].map((inv, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-black block">{inv.desc}</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">رقم السند: {inv.id} | {inv.date}</span>
                    </div>
                    <div className="text-left space-y-1 font-bold">
                      <span className="text-[#E5D4C0] font-mono block">{inv.amount} ر.س</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-400">مكتمل</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right space-y-4">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تنبيهات الإدارة وأولياء الأمور</h3>

              <div className="space-y-3.5">
                {[
                  { title: 'إعلان: تعديل طفيف لجدول السبت', body: 'نود إحاطتكم بتأجيل حصة السبت القادم بمقدار نصف ساعة لجميع فئات البراعم الرياضية لتبدأ في تمام الساعة ١٠:٣٠ صباحاً.', date: 'اليوم - 11:00 ص' }
                ].map((n, idx) => (
                  <div key={idx} className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl text-xs">
                    <h4 className="font-black text-white">{n.title}</h4>
                    <p className="text-slate-400 mt-1 font-semibold leading-relaxed">{n.body}</p>
                    <span className="text-[9px] text-slate-500 font-mono mt-2 block">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SUPPORT / CHAT */}
          {activeTab === 'support' && (
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-5 flex flex-col h-[460px]">
              <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تواصل ومحادثة فنية مع كابتن البطل</h3>

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
                  placeholder="اكتب رسالتك لمدرب البطل هنا..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl cursor-pointer"
                >
                  إرسال
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* QR Child Modal */}
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
              <h3 className="text-sm font-black text-white">رمز الـ QR الخاص بالبطل</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">امسح الكود لتسجيل حضور البطل اليومي فورياً:</p>
            </div>

            <div className="bg-white p-4 rounded-2xl max-w-[150px] mx-auto shadow-inner flex flex-col items-center">
              <div className="w-28 h-28 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-[9px] text-center p-2 leading-tight">
                {selectedChild.id}
                <br />
                ATTENDANCE_OK
              </div>
              <span className="text-[9px] text-slate-500 font-black font-mono mt-2">{selectedChild.id}</span>
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
              <h3 className="text-sm font-black text-white">تجديد باقة الاشتراك للبطل</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">اختر الباقة الرياضية المناسبة وارفق صورة الحوالة البنكية:</p>
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
                    onChange={e => { if (e.target.files && e.target.files[0]) { setReceiptUploaded(true); onAddToast('تم رفع صورة إيصال التحويل البنكي!', 'success'); } }}
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
                className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl cursor-pointer animate-pulse"
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
