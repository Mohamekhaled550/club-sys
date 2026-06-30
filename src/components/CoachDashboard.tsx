/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, Calendar, CheckSquare, Clock, Heart, DollarSign, Bell, User, 
  MessageSquare, Upload, RefreshCw, Download, Edit, Save, Plus, ArrowUpRight, 
  ChevronLeft, Sparkles, Smile, Landmark, Dumbbell, ShieldCheck, Phone, Users,
  Trophy, BookOpen, Send
} from 'lucide-react';
import { Coach, Player } from '../types';

interface CoachDashboardProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  coach: Coach;
  playersList: Player[];
  onLogout: () => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ 
  onAddToast, coach, playersList, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'performance' | 'report' | 'messages'>('home');
  
  // Simulated sessions
  const [sessions, setSessions] = useState([
    { id: 'حصة-1', field: 'الملعب الخماسي أ', time: '05:00 م - 06:30 م', group: 'براعم النخبة (أ)', playersCount: 15, sport: coach.sport, status: 'نشطة حالياً' },
    { id: 'حصة-2', field: 'الملعب الخماسي أ', time: '07:00 م - 08:30 م', group: 'براعم النخبة (ب)', playersCount: 12, sport: coach.sport, status: 'قادمة' }
  ]);

  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'حاضر' | 'غائب' | 'متأخر'>>({
    'لاعب-1': 'حاضر',
    'لاعب-2': 'حاضر'
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(playersList[0] || null);
  const [skills, setSkills] = useState({ dribbling: 85, shooting: 78, passing: 80, stamina: 90 });
  const [reportText, setReportText] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messageLog, setMessageLog] = useState([
    { sender: 'coach', text: 'السلام عليكم يا أولياء أمور فئة البراعم أ. أذكركم بموعد التدريب اليوم في الساعة الخامسة عصراً.', time: '09:00 ص' }
  ]);

  const handleSaveAttendance = () => {
    onAddToast('تم تسجيل الحضور اليومي للمجموعة بنجاح ومزامنته مع النظام العام!', 'success');
  };

  const handleSaveSkills = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast(`تم رصد تقييم البطل ${selectedPlayer?.name} بنجاح وإرسال إشعار فوري لولي أمره!`, 'success');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    onAddToast('تم رفع تقرير الحصة التدريبية الفني للإدارة والمدير الرياضي!', 'success');
    setReportText('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessageLog(prev => [...prev, { sender: 'coach', text: messageInput, time: 'الآن' }]);
    setMessageInput('');
    onAddToast('تم بث الرسالة الجماعية لجميع أولياء أمور الفئة المحددة!', 'success');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Coach Sidebar */}
      <div className="lg:w-80 flex flex-col gap-5 shrink-0">
        
        <div className="bg-[#1C080B]/60 backdrop-blur-md border border-[#B76E79]/20 rounded-3xl p-6 text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#B76E79] shadow-md">
            <div className="w-full h-full bg-[#5A0B17] text-[#E5D4C0] flex items-center justify-center font-black text-2xl">
              {coach.name.charAt(0)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-white">{coach.name}</h3>
            <span className="text-[10px] text-[#B76E79] font-black uppercase bg-[#5A0B17]/20 px-3 py-1 rounded-full mt-1.5 inline-block border border-[#B76E79]/20">
              مدرب فئة النخبة
            </span>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-slate-400 text-right font-semibold">
            <div className="flex justify-between">
              <span>التخصص الرياضي:</span>
              <span className="text-white font-bold">{coach.sport}</span>
            </div>
            <div className="flex justify-between">
              <span>مرات حضور الملاعب:</span>
              <span className="text-[#E5D4C0] font-mono">١٠٠٪</span>
            </div>
          </div>
        </div>

        {/* Tab Links */}
        <div className="bg-[#1C080B]/30 backdrop-blur-md border border-white/5 rounded-3xl p-3 space-y-1 text-xs">
          {[
            { id: 'home', label: 'الرئيسية وجدول الحصص', icon: Calendar },
            { id: 'attendance', label: 'تسجيل كشف الحضور', icon: CheckSquare },
            { id: 'performance', label: 'تقييم مهارات الأبطال', icon: Sparkles },
            { id: 'report', label: 'تقديم تقرير الحصة', icon: BookOpen },
            { id: 'messages', label: 'مراسلة أولياء الأمور', icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-right cursor-pointer ${
                  isTabActive
                    ? 'bg-[#5A0B17]/25 text-white border border-[#B76E79]/30'
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

      {/* Main Panel */}
      <div className="flex-1 min-w-0">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Banner */}
            <div className="bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 border border-[#B76E79]/20 p-6 rounded-3xl text-right">
              <span className="text-[#B76E79] text-xs font-black block">بوابة الإدارة الفنية للمدرب</span>
              <h2 className="text-lg font-black text-white">أهلاً بك كابتن {coach.name}</h2>
              <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-xl mt-1">
                تتيح لك البوابة تسجيل الحضور اليومي للمجموعات، وتقييم أداء وقدرات اللاعبين بشكل دوري، وتقديم تقارير التدريب مباشرة للإدارة.
              </p>
            </div>

            {/* Coach Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-bold">
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">المجموعات النشطة</span>
                <span className="text-white text-lg font-mono block mt-1">٣ مجموعات</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">اللاعبين تحت إشرافك</span>
                <span className="text-[#E5D4C0] font-mono text-lg block mt-1">٤٥ بطل</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">الحصص المنجزة</span>
                <span className="text-white font-mono text-lg block mt-1">٧٨ حصة</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">تقييم الكفاءة</span>
                <span className="text-emerald-400 font-mono text-lg block mt-1">A+</span>
              </div>
            </div>

            {/* Today's training schedule */}
            <div className="space-y-4 bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-black text-white">جدول تدريب الحصص اليومية</h3>
              
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-black text-white">{s.group}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{s.field} | {s.sport}</p>
                    </div>

                    <div className="text-left font-bold space-y-1">
                      <span className="text-[#E5D4C0] font-mono block">{s.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        s.status === 'نشطة حالياً' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 space-y-5 text-right text-xs">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">رصد كشف حضور البراعم اليومي</h3>

            <div className="space-y-3">
              {playersList.slice(0, 4).map(p => (
                <div key={p.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center font-bold">
                  <div>
                    <span className="text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{p.id} | مستوى: {p.level}</span>
                  </div>

                  <div className="flex gap-1 bg-slate-950/40 p-1 border border-white/5 rounded-lg text-[10px]">
                    {(['حاضر', 'غائب', 'متأخر'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setAttendanceSheet(prev => ({ ...prev, [p.id]: status }))}
                        className={`px-3 py-1.5 rounded-md font-black transition-all cursor-pointer ${
                          attendanceSheet[p.id] === status
                            ? status === 'حاضر' ? 'bg-emerald-500/20 text-emerald-400' :
                              status === 'غائب' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-amber-500/20 text-amber-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                onClick={handleSaveAttendance}
                className="px-6 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl"
              >
                تأكيد وحفظ كشف الحضور
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 space-y-5 text-right text-xs">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تقييم ورصد المهارات الفنية للبراعم</h3>

            <div className="flex gap-3">
              <select
                value={selectedPlayer?.id || ''}
                onChange={e => setSelectedPlayer(playersList.find(p => p.id === e.target.value) || null)}
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none font-bold"
              >
                {playersList.map(p => <option key={p.id} value={p.id} className="bg-slate-950">{p.name}</option>)}
              </select>
            </div>

            {selectedPlayer && (
              <form onSubmit={handleSaveSkills} className="space-y-5 font-bold pt-3 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">التحكم والمراوغة (Dribbling):</span>
                      <span className="text-[#E5D4C0]">{skills.dribbling}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.dribbling}
                      onChange={e => setSkills({ ...skills, dribbling: Number(e.target.value) })}
                      className="w-full accent-[#B76E79]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">التسديد والدقة (Shooting):</span>
                      <span className="text-[#E5D4C0]">{skills.shooting}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.shooting}
                      onChange={e => setSkills({ ...skills, shooting: Number(e.target.value) })}
                      className="w-full accent-[#B76E79]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">التمرير والتعاون الجماعي (Passing):</span>
                      <span className="text-[#E5D4C0]">{skills.passing}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.passing}
                      onChange={e => setSkills({ ...skills, passing: Number(e.target.value) })}
                      className="w-full accent-[#B76E79]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">اللياقة البدنية (Stamina):</span>
                      <span className="text-[#E5D4C0]">{skills.stamina}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skills.stamina}
                      onChange={e => setSkills({ ...skills, stamina: Number(e.target.value) })}
                      className="w-full accent-[#B76E79]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/20 text-white rounded-xl cursor-pointer"
                >
                  حفظ التقييم وإرسال إشعار
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: REPORT */}
        {activeTab === 'report' && (
          <form onSubmit={handleSubmitReport} className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 space-y-4 text-right text-xs font-bold">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تقديم تقرير فني شامل عن الحصة اليومية</h3>

            <div className="space-y-1.5">
              <label className="text-slate-400">اختر المجموعة التدريبية *</label>
              <select className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none">
                <option value="1">براعم النخبة (أ)</option>
                <option value="2">براعم النخبة (ب)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">ملخص التمارين الفنية والأهداف المحققة اليوم *</label>
              <textarea
                rows={4}
                required
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="اكتب تفاصيل التمارين الفنية التكتيكية والتحمل اليوم..."
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/60 border border-[#B76E79]/20 text-white rounded-xl cursor-pointer"
            >
              تقديم التقرير الفني
            </button>
          </form>
        )}

        {/* TAB 5: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-5 flex flex-col h-[460px] text-xs">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">بث تنبيهات جماعية لأولياء الأمور</h3>

            <div className="flex-1 overflow-y-auto space-y-3.5 py-4 px-1">
              {messageLog.map((chat, idx) => {
                const isCoach = chat.sender === 'coach';
                return (
                  <div key={idx} className={`flex ${isCoach ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 max-w-xs rounded-2xl ${
                      isCoach 
                        ? 'bg-[#5A0B17]/40 text-white rounded-tr-none border border-[#B76E79]/25' 
                        : 'bg-white/5 text-slate-200 rounded-tl-none'
                    }`}>
                      <p className="font-semibold leading-relaxed">{chat.text}</p>
                      <span className="text-[8px] text-slate-500 font-bold mt-1 block font-mono text-left">{chat.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="اكتب التنبيه الجماعي لأولياء الأمور هنا..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none font-bold"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl cursor-pointer"
              >
                بث التنبيه
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
