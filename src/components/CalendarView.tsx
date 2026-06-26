/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, Award, Plus, X, 
  ChevronRight, ChevronLeft, Download, Printer, Filter
} from 'lucide-react';
import { Coach, Player } from '../types';
import { handlePrintData } from '../data';

interface CalendarViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  coachesList: Coach[];
  playersList: Player[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  onAddToast, coachesList, playersList 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'training' | 'coaches' | 'fields'>('training');
  const [selectedSportFilter, setSelectedSportFilter] = useState('الكل');

  // Interactive scheduler items
  const [scheduleEvents, setScheduleEvents] = useState([
    { id: '1', title: 'تدريب فريق البراعم القدم أ', sport: 'كرة القدم', day: 'السبت', time: '04:00 م - 06:00 م', coach: 'الكابتن أحمد الفالح', location: 'الملعب الرئيسي الخارجي' },
    { id: '2', title: 'حصة السباحة الذهبية للمحترفين', sport: 'السباحة', day: 'الإثنين', time: '06:00 م - 08:00 م', coach: 'الكابتن يوسف الغامدي', location: 'المسبح الدافئ' },
    { id: '3', title: 'اختبار الحزام الأصفر الكاراتيه', sport: 'الكاراتيه', day: 'الأربعاء', time: '04:00 م - 06:00 م', coach: 'الكابتن خالد الحربي', location: 'الصالة المغلقة ب' },
    { id: '4', title: 'تدريب مهارات التنس الفردي', sport: 'التنس', day: 'الخميس', time: '05:00 م - 07:00 م', coach: 'الكابتن عمر الشمري', location: 'ملعب التنس المطور' },
    { id: '5', title: 'لياقة وتخسيس وزن الصباحي', sport: 'اللياقة البدنية', day: 'الأحد', time: '09:00 ص - 11:00 ص', coach: 'الكابتن فهد العتيبي', location: 'صالة الحديد الرئيسية' },
  ]);

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    sport: 'كرة القدم',
    day: 'السبت',
    time: '04:00 م - 06:00 م',
    coach: 'الكابتن أحمد الفالح',
    location: 'الملعب الرئيسي الخارجي',
  });

  const daysOfWeek = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const sports = ["كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];

  const filteredEvents = useMemo(() => {
    if (selectedSportFilter === 'الكل') return scheduleEvents;
    return scheduleEvents.filter(ev => ev.sport === selectedSportFilter);
  }, [scheduleEvents, selectedSportFilter]);

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      onAddToast('يرجى كتابة عنوان التحدي أو التدريب!', 'error');
      return;
    }

    const newEvent = {
      id: `تدريب-${Date.now()}`,
      ...eventForm
    };

    setScheduleEvents(prev => [...prev, newEvent]);
    onAddToast(`تم بنجاح حجز وإدراج حصة تدريبية: ${eventForm.title}`, 'success');
    setIsAddEventOpen(false);
  };

  const handlePrint = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>اليوم</th>
            <th>الوقت والتوقيت</th>
            <th>الحصة التدريبية</th>
            <th>اللعبة الرياضية</th>
            <th>المدرب الفنى المسؤول</th>
            <th>الموقع داخل الأكاديمية</th>
          </tr>
        </thead>
        <tbody>
    `;
    filteredEvents.forEach(ev => {
      html += `
        <tr>
          <td>${ev.day}</td>
          <td>${ev.time}</td>
          <td>${ev.title}</td>
          <td>${ev.sport}</td>
          <td>${ev.coach}</td>
          <td>${ev.location}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData('الجدول الأسبوعي العام للتدريبات والملاعب - أكاديمية MK الرياضية', html);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-500" />
            جدول وتوزيع الحصص والتدريبات والملاعب
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تخطيط شامل ذكي يضمن عدم تداخل الملاعب والتدريبات للمشتركين والمدربين على مدار ساعات العمل اليومية.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Printer className="w-4 h-4" />
            طباعة جدول الحصص
          </button>
          <button
            onClick={() => {
              setEventForm({ title: '', sport: 'كرة القدم', day: 'السبت', time: '04:00 م - 06:00 م', coach: coachesList[0]?.name || 'الكابتن أحمد الفالح', location: 'الملعب الرئيسي الخارجي' });
              setIsAddEventOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            حجز حصة أو تدريب جديد
          </button>
        </div>
      </div>

      {/* Sub tabs for calendar types */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-lg w-full">
        <button
          onClick={() => setActiveSubTab('training')}
          className={`flex-1 py-3 text-xs font-black rounded-xl cursor-pointer transition-all text-center ${
            activeSubTab === 'training' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          الجدول الأسبوعي العام
        </button>
        <button
          onClick={() => setActiveSubTab('coaches')}
          className={`flex-1 py-3 text-xs font-black rounded-xl cursor-pointer transition-all text-center ${
            activeSubTab === 'coaches' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          إشغال المدربين
        </button>
        <button
          onClick={() => setActiveSubTab('fields')}
          className={`flex-1 py-3 text-xs font-black rounded-xl cursor-pointer transition-all text-center ${
            activeSubTab === 'fields' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          أشغال صالات وملاعب الأكاديمية
        </button>
      </div>

      {/* Sport filter */}
      <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="text-xs font-bold text-slate-400">تصفية حسب الرياضة:</span>
        <div className="flex flex-wrap gap-1.5">
          {["الكل", ...sports].map((sp, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSportFilter(sp)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                selectedSportFilter === sp 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {activeSubTab === 'training' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {daysOfWeek.map((day, dIdx) => {
            const dayEvents = filteredEvents.filter(ev => ev.day === day);
            return (
              <div key={dIdx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{day}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold rounded-full">
                      {dayEvents.length} حصص
                    </span>
                  </div>

                  {dayEvents.length === 0 ? (
                    <p className="text-[10px] text-slate-300 text-center py-6 font-bold">لا يوجد حصص تدريبية</p>
                  ) : (
                    <div className="space-y-2.5">
                      {dayEvents.map(ev => (
                        <div key={ev.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1 border-r-4 border-indigo-500 hover:shadow-sm transition-all text-[11px]">
                          <p className="font-extrabold text-slate-950 dark:text-slate-50 line-clamp-2 leading-snug">{ev.title}</p>
                          <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ev.time}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            {ev.coach}
                          </p>
                          <p className="text-[9px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {ev.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick mini button inside day */}
                <button
                  onClick={() => {
                    setEventForm({ title: '', sport: 'كرة القدم', day, time: '04:00 م - 06:00 م', coach: coachesList[0]?.name || 'الكابتن أحمد الفالح', location: 'الملعب الرئيسي الخارجي' });
                    setIsAddEventOpen(true);
                  }}
                  className="w-full py-1 text-[10px] bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 font-bold rounded-lg transition-all text-center mt-2"
                >
                  + حجز سريع
                </button>
              </div>
            );
          })}
        </div>
      ) : activeSubTab === 'coaches' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-4">جدول الحصص والتواجد الأسبوعي للمدربين</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coachesList.slice(0, 10).map((coach, cIdx) => (
              <div key={cIdx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${coach.avatarColor}`}>
                    {coach.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{coach.name}</p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">مدرب رياضة: {coach.sport}</p>
                  </div>
                </div>
                {/* Schedules */}
                <div className="space-y-2">
                  {coach.schedules?.map((sch, sIdx) => (
                    <div key={sIdx} className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl flex items-center justify-between text-[11px]">
                      <span className="font-black text-indigo-600">{sch.day}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{sch.time}</span>
                      <span className="text-[10px] text-slate-400">{sch.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-4">جدول إشغال الصالات والملاعب بالأكاديمية الرياضية</h4>
          <div className="space-y-4">
            {["الملعب الرئيسي الخارجي", "المسبح الدافئ", "الصالة المغلقة أ", "الصالة المغلقة ب", "ملعب التنس المطور"].map((loc, idx) => {
              const locEvents = filteredEvents.filter(ev => ev.location === loc);
              return (
                <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-black text-xs text-slate-900 dark:text-slate-100">{loc}</span>
                    <span className="text-[10px] font-bold text-slate-400">{locEvents.length} تدريبات مخصصة هذا الأسبوع</span>
                  </div>
                  {locEvents.length === 0 ? (
                    <p className="text-[10px] text-slate-300">الملعب شاغر بالكامل ومتاح لحجوزات الأفراد أو فترات الصيانة.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {locEvents.map(ev => (
                        <div key={ev.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-1 text-[11px]">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{ev.title}</p>
                          <p className="text-[10px] font-black text-indigo-600 font-mono">{ev.day} • {ev.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add scheduler event modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs font-bold animate-fade-in">
            <button onClick={() => setIsAddEventOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              حجز وإدراج حصة تدريبية جديدة
            </h3>

            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">عنوان التدريب / الحصة *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="مثال: تدريب مهارات السباحة الحرة للناشئين"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">الرياضة</label>
                  <select
                    value={eventForm.sport}
                    onChange={(e) => setEventForm({ ...eventForm, sport: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {sports.map((sp, idx) => (
                      <option key={idx} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">يوم الحصة</label>
                  <select
                    value={eventForm.day}
                    onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {daysOfWeek.map((day, idx) => (
                      <option key={idx} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">المدرب الفني المسؤول</label>
                  <select
                    value={eventForm.coach}
                    onChange={(e) => setEventForm({ ...eventForm, coach: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {coachesList.map((coach, idx) => (
                      <option key={idx} value={coach.name}>{coach.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">موقع وملعب التدريب</label>
                  <select
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="الملعب الرئيسي الخارجي">الملعب الرئيسي الخارجي</option>
                    <option value="المسبح الدافئ">المسبح الدافئ</option>
                    <option value="الصالة المغلقة أ">الصالة المغلقة أ</option>
                    <option value="الصالة المغلقة ب">الصالة المغلقة ب</option>
                    <option value="ملعب التنس المطور">ملعب التنس المطور</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">التوقيت والوقت</label>
                <input
                  type="text"
                  required
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  placeholder="04:00 م - 06:00 م"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all active:scale-95">
                  حجز التدريب وتأكيده
                </button>
                <button type="button" onClick={() => setIsAddEventOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
