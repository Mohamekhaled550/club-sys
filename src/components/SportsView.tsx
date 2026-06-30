/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Award, Trophy, Plus, Trash2, Edit, X, Search, Download, 
  Dumbbell, Flame, Save, Users, Calendar
} from 'lucide-react';
import { handleExportData } from '../data';

interface SportItem {
  id: string;
  name: string;
  category: string; // جماعية / فردية / دفاع عن النفس
  coachesCount: number;
  playersCount: number;
  monthlyFee: number;
  status: 'نشط' | 'موقف';
  color: string;
}

interface SportsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const SportsView: React.FC<SportsViewProps> = ({ onAddToast }) => {
  const [sportsList, setSportsList] = useState<SportItem[]>([
    { id: 'رياضة-1', name: 'كرة القدم للبراعم', category: 'جماعية', coachesCount: 8, playersCount: 120, monthlyFee: 450, status: 'نشط', color: 'from-emerald-500 to-teal-600' },
    { id: 'رياضة-2', name: 'كرة السلة للبراعم والمحترفين', category: 'جماعية', coachesCount: 4, playersCount: 55, monthlyFee: 400, status: 'نشط', color: 'from-orange-500 to-amber-600' },
    { id: 'رياضة-3', name: 'السباحة الكلاسيكية وتطوير المهارات', category: 'فردية', coachesCount: 6, playersCount: 90, monthlyFee: 500, status: 'نشط', color: 'from-blue-500 to-indigo-600' },
    { id: 'رياضة-4', name: 'الكاراتيه والدفاع عن النفس (كوجو)', category: 'دفاع عن النفس', coachesCount: 3, playersCount: 40, monthlyFee: 350, status: 'نشط', color: 'from-rose-500 to-red-600' },
    { id: 'رياضة-5', name: 'التنس الأرضي الفاخر (سنجل)', category: 'فردية', coachesCount: 2, playersCount: 20, monthlyFee: 600, status: 'موقف', color: 'from-lime-500 to-green-600' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportItem | null>(null);
  const [sportForm, setSportForm] = useState<Partial<SportItem>>({
    name: '',
    category: 'جماعية',
    coachesCount: 1,
    playersCount: 0,
    monthlyFee: 350,
    status: 'نشط'
  });

  const filteredSports = useMemo(() => {
    return sportsList.filter(s => {
      return s.name.includes(searchTerm) || s.category.includes(searchTerm);
    });
  }, [sportsList, searchTerm]);

  const handleOpenAddModal = () => {
    setSelectedSport(null);
    setSportForm({
      name: '',
      category: 'جماعية',
      coachesCount: 1,
      playersCount: 0,
      monthlyFee: 350,
      status: 'نشط'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (sport: SportItem) => {
    setSelectedSport(sport);
    setSportForm(sport);
    setIsAddModalOpen(true);
  };

  const handleSaveSport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sportForm.name) {
      onAddToast('يرجى تحديد اسم البرنامج الرياضي!', 'error');
      return;
    }

    if (selectedSport) {
      setSportsList(prev => prev.map(s => s.id === selectedSport.id ? { ...s, ...sportForm } as SportItem : s));
      onAddToast('تم تحديث البرنامج الرياضي بنجاح!', 'success');
    } else {
      const colors = [
        'from-purple-500 to-indigo-600',
        'from-pink-500 to-rose-600',
        'from-cyan-500 to-blue-600',
        'from-teal-500 to-emerald-600'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const added: SportItem = {
        id: `رياضة-${sportsList.length + 1}`,
        name: sportForm.name,
        category: sportForm.category || 'جماعية',
        coachesCount: Number(sportForm.coachesCount) || 1,
        playersCount: 0,
        monthlyFee: Number(sportForm.monthlyFee) || 350,
        status: sportForm.status || 'نشط',
        color: randomColor
      };
      setSportsList(prev => [...prev, added]);
      onAddToast('تم إدراج الرياضة الجديدة بنجاح!', 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteSport = (id: string) => {
    if (confirm('هل ترغب في تعطيل أو إزالة هذه الرياضة؟ سيؤثر هذا على إمكانية تسجيل اللاعبين الجدد.')) {
      setSportsList(prev => prev.filter(s => s.id !== id));
      onAddToast('تم إزالة الرياضة المحددة بنجاح.', 'info');
    }
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20">
        <div className="space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">النظام الرياضي والبرامج</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#E5D4C0]" />
            إدارة الألعاب والرياضات (Sports Management)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            تعريف الرياضات المعتمدة، الرسوم الشهرية للاشتراك الأساسي، وإعداد المدربين المرتبطين بكل تخصص.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          إضافة رياضة جديدة
        </button>
      </div>

      {/* Controls */}
      <div className="bg-[#1C080B]/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="البحث عن رياضة..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-950/40 border border-white/10 text-xs text-white rounded-xl focus:border-[#B76E79] outline-none"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
        </div>

        <button
          onClick={() => handleExportData(sportsList, 'الرياضات-المعتمدة')}
          className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
        >
          تصدير Excel
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredSports.map(sport => (
          <div key={sport.id} className="bg-[#1C080B]/30 backdrop-blur-md border border-white/5 hover:border-[#B76E79]/20 rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-1">
            {/* Visual Color Bar Accent */}
            <div className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${sport.color}`} />

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">{sport.id}</span>
                <h3 className="text-md font-black text-white">{sport.name}</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[9px] mt-1 font-semibold">
                  تصنيف: {sport.category}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                sport.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/25'
              }`}>
                {sport.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-white/5 text-center text-xs font-bold my-4">
              <div className="bg-white/[0.01] p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> الكادر التدريبي
                </span>
                <span className="text-white font-mono text-sm block mt-1">{sport.coachesCount} مدربين</span>
              </div>
              <div className="bg-white/[0.01] p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#B76E79]" /> اللاعبين المسجلين
                </span>
                <span className="text-white font-mono text-sm block mt-1">{sport.playersCount} أبطال</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 text-xs font-bold">
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block">رسوم الاشتراك</span>
                <span className="text-[#E5D4C0] font-mono font-black text-sm">{sport.monthlyFee} ر.س / شهرياً</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(sport)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSport(sport.id)}
                  className="p-2 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 rounded-lg border border-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C080B] border border-[#B76E79]/30 rounded-3xl p-6 max-w-md w-full text-right space-y-6 animate-fade-in relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 left-5 p-1 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white">{selectedSport ? 'تعديل البرنامج الرياضي' : 'إضافة رياضة جديدة'}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">يرجى تسجيل كافة البيانات الفنية المطلوبة:</p>
            </div>

            <form onSubmit={handleSaveSport} className="space-y-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-slate-300">اسم الرياضة / البرنامج *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كرة القدم للبراعم أ"
                  value={sportForm.name}
                  onChange={e => setSportForm({ ...sportForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300">التصنيف الفني</label>
                  <select
                    value={sportForm.category}
                    onChange={e => setSportForm({ ...sportForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                  >
                    <option value="جماعية">جماعية</option>
                    <option value="فردية">فردية</option>
                    <option value="دفاع عن النفس">دفاع عن النفس</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300">الرسوم الشهرية (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={sportForm.monthlyFee}
                    onChange={e => setSportForm({ ...sportForm, monthlyFee: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300">عدد المدربين المعينين</label>
                  <input
                    type="number"
                    min="1"
                    value={sportForm.coachesCount}
                    onChange={e => setSportForm({ ...sportForm, coachesCount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none text-left"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300">الحالة العامة</label>
                  <select
                    value={sportForm.status}
                    onChange={e => setSportForm({ ...sportForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                  >
                    <option value="نشط">نشط</option>
                    <option value="موقف">موقف</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                حفظ تفاصيل الرياضة
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
