/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, QrCode, Calendar, CheckSquare, Clock, Heart, DollarSign, Bell, User, 
  MessageSquare, Upload, RefreshCw, Download, Edit, Save, Plus, ArrowUpRight, 
  ChevronLeft, Sparkles, Smile, Landmark, Dumbbell, ShieldCheck, Phone, CheckCircle2,
  X, Briefcase, FileText
} from 'lucide-react';
import { Employee } from '../types';

interface EmployeeDashboardProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  employee: Employee;
  onLogout: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ 
  onAddToast, employee, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'tasks' | 'leave' | 'profile'>('home');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('---');
  const [checkOutTime, setCheckOutTime] = useState('---');

  const [tasks, setTasks] = useState([
    { id: 'مهمة-1', title: 'تسجيل ومطابقة حضور فئة براعم أ', status: 'مكتملة' },
    { id: 'مهمة-2', title: 'تدقيق ومراجعة طلبات التجديد المعلقة ماليّاً', status: 'قيد التنفيذ' },
    { id: 'مهمة-3', title: 'إرسال جدول الملاعب المحدث عبر الواتساب', status: 'قيد الانتظار' }
  ]);

  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDuration, setLeaveDuration] = useState('1');

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    const nowStr = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(nowStr);
    onAddToast(`تم إثبات الحضور وبصمة الدخول اليومي بنجاح في ${nowStr}!`, 'success');
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    const nowStr = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setCheckOutTime(nowStr);
    onAddToast(`تم إثبات الانصراف والخروج بنجاح في ${nowStr}!`, 'info');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'مكتملة' ? 'قيد التنفيذ' : 'مكتملة' } : t));
    onAddToast('تم تحديث حالة المهمة بنجاح!', 'success');
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    onAddToast('تم رفع طلب الإجازة للمدير التنفيذي والموارد البشرية للإجراء!', 'success');
    setLeaveReason('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Employee Sidebar */}
      <div className="lg:w-80 flex flex-col gap-5 shrink-0">
        
        <div className="bg-[#1C080B]/60 backdrop-blur-md border border-[#B76E79]/20 rounded-3xl p-6 text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#B76E79] shadow-md">
            <div className="w-full h-full bg-[#5A0B17] text-[#E5D4C0] flex items-center justify-center font-black text-2xl">
              {employee.name.charAt(0)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-white">{employee.name}</h3>
            <span className="text-[10px] text-[#B76E79] font-black uppercase bg-[#5A0B17]/20 px-3 py-1 rounded-full mt-1.5 inline-block border border-[#B76E79]/20">
              {employee.role}
            </span>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 text-xs text-slate-400 text-right font-semibold">
            <div className="flex justify-between">
              <span>تاريخ الانضمام:</span>
              <span className="text-white font-mono">{employee.joinDate}</span>
            </div>
            <div className="flex justify-between">
              <span>حالة البصمة اليومية:</span>
              <span className={isCheckedIn ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isCheckedIn ? 'مسجل دخول' : 'مسجل خروج'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
              >
                إثبات حضور (Check-in)
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
              >
                إثبات انصراف (Check-out)
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#1C080B]/30 backdrop-blur-md border border-white/5 rounded-3xl p-3 space-y-1 text-xs">
          {[
            { id: 'home', label: 'لوحة التحكم والمؤشرات', icon: Briefcase },
            { id: 'attendance', label: 'سجل الحضور والغياب', icon: Clock },
            { id: 'tasks', label: 'المهام والتكليفات اليومية', icon: CheckSquare },
            { id: 'leave', label: 'تقديم طلب إجازة', icon: FileText },
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

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Header banner */}
            <div className="bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 border border-[#B76E79]/20 p-6 rounded-3xl text-right">
              <span className="text-[#B76E79] text-xs font-black block">بوابة الإدارة الإدارية للموظف</span>
              <h2 className="text-lg font-black text-white">طاب يومك أ. {employee.name}</h2>
              <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-xl mt-1">
                تابع مهام عملك اليومي بالأكاديمية بكل كفاءة وسرعة، وثبت بصمة الحضور والانصراف الرقمية للفرع.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-bold">
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">ساعات العمل المعتمدة</span>
                <span className="text-white text-lg font-mono block mt-1">١٦٠ ساعة</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">المهام المنجزة اليوم</span>
                <span className="text-emerald-400 font-mono text-lg block mt-1">١ / ٣ مهام</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">التأخير (الشهر الجاري)</span>
                <span className="text-white font-mono text-lg block mt-1">٠ دقيقة</span>
              </div>
              <div className="bg-[#1C080B]/20 border border-white/5 p-4 rounded-2xl">
                <span className="text-slate-500 block">الراتب الأساسي</span>
                <span className="text-[#E5D4C0] font-mono text-lg block mt-1">{employee.salary.toLocaleString()} ر.س</span>
              </div>
            </div>

            {/* Today's Tasks overview */}
            <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white">المهام والتكليفات المطلوبة اليوم</h3>
                <button onClick={() => setActiveTab('tasks')} className="text-[10px] text-[#B76E79] font-black hover:underline">عرض كل المهام</button>
              </div>

              <div className="space-y-2.5">
                {tasks.map(t => (
                  <div key={t.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center text-xs font-bold">
                    <span className="text-white">{t.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      t.status === 'مكتملة' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ATTENDANCE LOG */}
        {activeTab === 'attendance' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right text-xs space-y-4">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">سجل البصمة اليومية الرقمية</h3>

            <div className="space-y-3 font-semibold">
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between">
                <span>وقت تسجيل حضور اليوم (Check-in):</span>
                <span className="font-mono text-emerald-400 font-bold">{checkInTime}</span>
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between">
                <span>وقت تسجيل انصراف اليوم (Check-out):</span>
                <span className="font-mono text-rose-400 font-bold">{checkOutTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MY TASKS */}
        {activeTab === 'tasks' && (
          <div className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right text-xs space-y-4 font-bold">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">قائمة مهام الإداري</h3>

            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-white block">{t.title}</span>
                    <span className="text-[10px] text-slate-500 block mt-1">{t.id}</span>
                  </div>

                  <button
                    onClick={() => handleToggleTask(t.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition-all cursor-pointer ${
                      t.status === 'مكتملة'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.status === 'مكتملة' ? 'مكتملة ✓' : 'تحديد كمكتملة'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEAVE REQUEST */}
        {activeTab === 'leave' && (
          <form onSubmit={handleLeaveSubmit} className="bg-[#1C080B]/20 border border-white/5 rounded-3xl p-6 text-right text-xs font-bold space-y-4">
            <h3 className="text-xs font-black text-white pb-3 border-b border-white/5">تقديم طلب إجازة رسمية</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">عدد أيام الإجازة المطلوبة *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={leaveDuration}
                  onChange={e => setLeaveDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none text-left"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">تاريخ بدء الإجازة *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white outline-none text-left font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">سبب وتفاصيل طلب الإجازة *</label>
              <textarea
                rows={3}
                required
                value={leaveReason}
                onChange={e => setLeaveReason(e.target.value)}
                placeholder="اكتب الأسباب والظروف الداعية للإجازة..."
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none font-medium leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl cursor-pointer"
            >
              تقديم طلب الإجازة
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
