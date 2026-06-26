/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Plus, Trash2, Edit, Eye, Phone, Award, Star, BookOpen,
  Calendar, CheckCircle, X, Download, Printer, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Coach, Player } from '../types';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';
import { handleExportData, handlePrintData } from '../data';

interface CoachesViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  coachesList: Coach[];
  setCoachesList: React.Dispatch<React.SetStateAction<Coach[]>>;
  playersList: Player[];
}

export const CoachesView: React.FC<CoachesViewProps> = ({ 
  onAddToast, coachesList, setCoachesList, playersList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('الكل');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'salary'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewCoach, setViewCoach] = useState<Coach | null>(null);

  // Form State
  const [coachForm, setCoachForm] = useState({
    id: '',
    name: '',
    sport: 'كرة القدم',
    salary: 6000,
    phone: '',
    status: 'نشط' as 'نشط' | 'إجازة',
    rating: 5,
    teams: [] as string[],
  });

  const coachSports = ["الكل", "كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const toggleSort = (field: 'name' | 'rating' | 'salary') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    triggerLoading();
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...coachesList];

    if (searchTerm.trim() !== '') {
      result = result.filter(c => 
        c.name.includes(searchTerm) || 
        c.phone.includes(searchTerm) || 
        c.sport.includes(searchTerm)
      );
    }

    if (selectedSport !== 'الكل') {
      result = result.filter(c => c.sport === selectedSport);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'ar');
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else {
        comparison = a.salary - b.salary;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [coachesList, searchTerm, selectedSport, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedCoaches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachForm.name.trim() || !coachForm.phone.trim()) {
      onAddToast('يرجى تعبئة الحقول الأساسية المطلوبة لمدرب الأكاديمية!', 'error');
      return;
    }

    if (isEditMode) {
      setCoachesList(prev => prev.map(c => c.id === coachForm.id ? { ...c, ...coachForm } : c));
      onAddToast(`تم تعديل بيانات المدرب: ${coachForm.name}`, 'success');
    } else {
      const newId = `مدرب-${coachesList.length + 1}`;
      const randomColor = ["bg-emerald-500", "bg-indigo-500", "bg-blue-500", "bg-purple-500", "bg-red-500"][Math.floor(Math.random() * 5)];
      const added: Coach = {
        ...coachForm,
        id: newId,
        avatarColor: randomColor,
        playersIds: [],
        schedules: [
          { day: 'السبت', time: '04:00 م - 06:00 م', location: 'الملعب الرئيسي' },
          { day: 'الإثنين', time: '06:00 م - 08:00 م', location: 'الصالة المغلقة' }
        ],
        salariesPaid: [],
      };
      setCoachesList(prev => [added, ...prev]);
      onAddToast(`تمت إضافة المدرب وتكليفه بنجاح: ${coachForm.name}`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleEditClick = (coach: Coach) => {
    setCoachForm({
      id: coach.id,
      name: coach.name,
      sport: coach.sport,
      salary: coach.salary,
      phone: coach.phone,
      status: coach.status,
      rating: coach.rating,
      teams: coach.teams || [],
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف سجل المدرب: ${name}؟ سيتم فك ارتباط الأبناء والفرق عنه.`)) {
      setCoachesList(prev => prev.filter(c => c.id !== id));
      onAddToast(`تم حذف سجل المدرب "${name}" بنجاح.`, 'success');
    }
  };

  const handleExport = () => {
    const success = handleExportData(coachesList, 'coaches_list');
    if (success) onAddToast('تم تصدير ملف الكادر الفني بنجاح!', 'success');
  };

  const handlePrint = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>الرقم التعريفى</th>
            <th>اسم الكابتن</th>
            <th>التخصص الفنى</th>
            <th>الراتب الأساسى</th>
            <th>التقييم الفنى</th>
            <th>الهاتف</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
    `;
    filteredAndSorted.forEach(c => {
      html += `
        <tr>
          <td>${c.id}</td>
          <td>${c.name}</td>
          <td>${c.sport}</td>
          <td>${c.salary.toLocaleString()} ر.س</td>
          <td>${c.rating} / 5</td>
          <td>${c.phone}</td>
          <td>${c.status}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData('تقرير الكادر التدريبي الفني - MK Sports Academy', html);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-500" />
            إدارة الكادر الفني والمدربين
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تتبع التخصصات الرياضية، تقييم المدربين السنوي، إدارة الجداول والحصص الأسبوعية للاعبين والفرق.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Printer className="w-4 h-4" />
            طباعة
          </button>
          <button
            onClick={() => {
              setCoachForm({ id: '', name: '', sport: 'كرة القدم', salary: 6000, phone: '', status: 'نشط', rating: 5, teams: [] });
              setIsEditMode(false);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            إضافة مدرب جديد
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث عن كابتن بالاسم، اللعبة المخصصة، أو الجوال..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>
        <div>
          <select
            value={selectedSport}
            onChange={(e) => { setSelectedSport(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            {coachSports.map((sport, idx) => (
              <option key={idx} value={sport}>{sport === 'الكل' ? 'كل التخصصات الفنية' : sport}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : paginatedCoaches.length === 0 ? (
        <EmptyState title="لا يوجد مدربين يطابقون تصفيتك الحالية" description="يرجى مراجعة كلمات البحث أو تصفية الرياضة أو تعيين تخصص جديد." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 font-bold" onClick={() => toggleSort('name')}>
                    اسم الكابتن <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4">اللعبة والتخصص</th>
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 font-bold" onClick={() => toggleSort('rating')}>
                    التقييم الفني <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 font-bold" onClick={() => toggleSort('salary')}>
                    الراتب الشهري <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4">الهاتف</th>
                  <th className="p-4">عدد اللاعبين لديه</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {paginatedCoaches.map((coach) => {
                  const assignedKids = playersList.filter(p => p.coachId === coach.id).length;
                  return (
                    <tr key={coach.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${coach.avatarColor}`}>
                            {coach.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-slate-100">{coach.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{coach.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-black">
                          {coach.sport}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{coach.rating} / 5</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-black text-indigo-600 dark:text-indigo-400">
                        {coach.salary.toLocaleString()} ر.س
                      </td>
                      <td className="p-4 font-mono text-slate-500">{coach.phone}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold">
                          {assignedKids} لاعبين
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setViewCoach(coach)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-lg cursor-pointer"
                            title="التفاصيل والحصص والرواتب"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(coach)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-amber-500 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coach.id, coach.name)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-bold">
              عرض {paginatedCoaches.length} من أصل {filteredAndSorted.length} مدرباً
            </span>
            <div className="flex gap-1">
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }} className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 border border-slate-100 dark:border-slate-800 rounded-xl font-bold dark:bg-slate-800">{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); triggerLoading(); }} className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs font-bold animate-fade-in">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Plus className="w-5 h-5 text-indigo-500" />
              {isEditMode ? 'تحديث ملف كابتن' : 'تعيين كابتن وتخصيص لعبة جديدة'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">اسم الكابتن بالكامل *</label>
                <input
                  type="text"
                  required
                  value={coachForm.name}
                  onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                  placeholder="مثال: الكابتن فهد بن تركي العتيبي"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">التخصص واللعبة</label>
                  <select
                    value={coachForm.sport}
                    onChange={(e) => setCoachForm({ ...coachForm, sport: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {coachSports.slice(1).map((sport, idx) => (
                      <option key={idx} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">الراتب الشهري المقترح</label>
                  <input
                    type="number"
                    required
                    value={coachForm.salary}
                    onChange={(e) => setCoachForm({ ...coachForm, salary: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">رقم جوال الاتصال *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={coachForm.phone}
                    onChange={(e) => setCoachForm({ ...coachForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-left"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">الحالة التدريبية</label>
                  <select
                    value={coachForm.status}
                    onChange={(e) => setCoachForm({ ...coachForm, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="نشط">نشط</option>
                    <option value="إجازة">إجازة</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                  {isEditMode ? 'حفظ التغييرات' : 'تثبيت وتعيين'}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Coach */}
      {viewCoach && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs max-h-[85vh] overflow-y-auto">
            <button onClick={() => setViewCoach(null)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black ${viewCoach.avatarColor}`}>
                {viewCoach.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{viewCoach.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{viewCoach.id} • تخصص رياضة: {viewCoach.sport} • هاتف: {viewCoach.phone}</p>
              </div>
            </div>

            {/* الجداول الأسبوعية */}
            <div className="space-y-4 mb-6">
              <h4 className="font-black text-slate-800 dark:text-slate-200 border-r-4 border-indigo-500 pr-2">جدول الحصص والتدريبات الأسبوعية</h4>
              {!viewCoach.schedules || viewCoach.schedules.length === 0 ? (
                <p className="text-slate-400 font-bold text-center py-2 bg-slate-50 rounded-xl">لا يوجد حصص مخصصة في جدول المدرب حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {viewCoach.schedules.map((sch, index) => (
                    <div key={index} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                      <p className="font-extrabold text-indigo-600 dark:text-indigo-400">{sch.day}</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{sch.time}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{sch.location}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* الأبناء المسجلون معه */}
            <div className="space-y-3 mb-6">
              <h4 className="font-black text-slate-800 dark:text-slate-200 border-r-4 border-emerald-500 pr-2">اللاعبين المسجلين تحت إشرافه الفني</h4>
              {playersList.filter(p => p.coachId === viewCoach.id).length === 0 ? (
                <p className="text-slate-400 font-bold text-center py-2">لم يربط أي لاعبين بملف الكابتن التدريبي بعد.</p>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/40">
                  {playersList.filter(p => p.coachId === viewCoach.id).map(kid => (
                    <div key={kid.id} className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] ${kid.avatarColor}`}>
                          {kid.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{kid.name} ({kid.level})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{kid.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* الرواتب المالية المنصرفة للكابتن */}
            <div className="space-y-3">
              <h4 className="font-black text-slate-800 dark:text-slate-200 border-r-4 border-purple-500 pr-2">سجل الرواتب والتحويلات البنكية المستلمة</h4>
              {!viewCoach.salariesPaid || viewCoach.salariesPaid.length === 0 ? (
                <p className="text-slate-400 font-bold text-center py-2 bg-slate-50 rounded-xl">لم تقيد دفعات رواتب لهذا المدرب بعد.</p>
              ) : (
                <div className="space-y-2">
                  {viewCoach.salariesPaid.map((sal, idx) => (
                    <div key={idx} className="p-2.5 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between bg-purple-50/10">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">راتب شهر: {sal.month}</p>
                        <p className="text-[10px] text-slate-400 font-mono">تاريخ الصرف: {sal.date}</p>
                      </div>
                      <span className="font-mono font-black text-purple-600 dark:text-purple-400">{sal.amount.toLocaleString()} ر.س</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button onClick={() => setViewCoach(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
