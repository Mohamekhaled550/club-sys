/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Building, MapPin, Phone, Users, Plus, Trash2, Edit, Eye, X, 
  Search, Download, Printer, ArrowUpDown, ChevronLeft, ChevronRight, Save
} from 'lucide-react';
import { handleExportData } from '../data';

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  courtsCount: number;
  playersCount: number;
  coachesCount: number;
  phone: string;
  status: 'نشط' | 'تحت الصيانة' | 'مغلق مؤقتاً';
}

interface BranchesViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const BranchesView: React.FC<BranchesViewProps> = ({ onAddToast }) => {
  const [branches, setBranches] = useState<Branch[]>([
    { id: 'فرع-1', name: 'فرع شمال الرياض - الياسمين', location: 'حي الياسمين، الرياض', manager: 'عبد العزيز السالم', courtsCount: 4, playersCount: 180, coachesCount: 12, phone: '055112233', status: 'نشط' },
    { id: 'فرع-2', name: 'فرع شرق الرياض - الروابي', location: 'حي الروابي، الرياض', manager: 'فيصل الحربي', courtsCount: 3, playersCount: 120, coachesCount: 8, phone: '055223344', status: 'نشط' },
    { id: 'فرع-3', name: 'فرع جدة كورنيش النخبة', location: 'طريق الكورنيش، جدة', manager: 'ممدوح عسيري', courtsCount: 5, playersCount: 210, coachesCount: 15, phone: '055334455', status: 'نشط' },
    { id: 'فرع-4', name: 'فرع دمام شاطئ الغروب', location: 'طريق الشاطئ، الدمام', manager: 'خالد الزهراني', courtsCount: 2, playersCount: 65, coachesCount: 5, phone: '055445566', status: 'تحت الصيانة' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchForm, setBranchForm] = useState<Partial<Branch>>({
    name: '',
    location: '',
    manager: '',
    courtsCount: 2,
    playersCount: 0,
    coachesCount: 0,
    phone: '',
    status: 'نشط'
  });

  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchSearch = b.name.includes(searchTerm) || b.location.includes(searchTerm) || b.manager.includes(searchTerm);
      const matchStatus = selectedStatus === 'الكل' || b.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [branches, searchTerm, selectedStatus]);

  const handleOpenAddModal = () => {
    setSelectedBranch(null);
    setBranchForm({
      name: '',
      location: '',
      manager: '',
      courtsCount: 2,
      playersCount: 0,
      coachesCount: 0,
      phone: '',
      status: 'نشط'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchForm(branch);
    setIsAddModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.location || !branchForm.manager) {
      onAddToast('يرجى ملء جميع البيانات الإلزامية!', 'error');
      return;
    }

    if (selectedBranch) {
      // Edit
      setBranches(prev => prev.map(b => b.id === selectedBranch.id ? { ...b, ...branchForm } as Branch : b));
      onAddToast('تم تحديث بيانات الفرع بنجاح!', 'success');
    } else {
      // Add
      const newBranch: Branch = {
        id: `فرع-${branches.length + 1}`,
        name: branchForm.name,
        location: branchForm.location,
        manager: branchForm.manager,
        courtsCount: Number(branchForm.courtsCount) || 2,
        playersCount: 0,
        coachesCount: 0,
        phone: branchForm.phone || '',
        status: branchForm.status || 'نشط'
      };
      setBranches(prev => [...prev, newBranch]);
      onAddToast('تمت إضافة الفرع الجديد للأكاديمية!', 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteBranch = (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الفرع من قاعدة البيانات؟')) {
      setBranches(prev => prev.filter(b => b.id !== id));
      onAddToast('تم إزالة الفرع المحدد بنجاح.', 'info');
    }
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20">
        <div className="space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">النظام العام وفروع الأكاديمية</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <Building className="w-6 h-6 text-[#E5D4C0]" />
            إدارة فروع الأكاديمية والمقرات (Academy Branches)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            تأسيس فروع صالات الألعاب والملاعب ومراكز التدريب، وتكليف المشرفين والمدراء المعتمدين لكل فرع.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] border border-[#B76E79]/30 text-white rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          تأسيس فرع جديد
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-[#1C080B]/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="البحث عن فرع..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-950/40 border border-white/10 text-xs text-white rounded-xl focus:border-[#B76E79] outline-none transition-all"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-950/40 border border-white/10 text-xs text-slate-300 rounded-xl outline-none focus:border-[#B76E79]"
          >
            <option value="الكل" className="bg-slate-950 text-white">كل الحالات</option>
            <option value="نشط" className="bg-slate-950 text-white">نشط</option>
            <option value="تحت الصيانة" className="bg-slate-950 text-white">تحت الصيانة</option>
            <option value="مغلق مؤقتاً" className="bg-slate-950 text-white">مغلق مؤقتاً</option>
          </select>

          <button
            onClick={() => handleExportData(branches, 'fروع-الأكاديمية')}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            تصدير Excel
          </button>
        </div>
      </div>

      {/* Branches List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBranches.map(branch => (
          <div key={branch.id} className="bg-[#1C080B]/30 backdrop-blur-md border border-white/5 hover:border-[#B76E79]/20 rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">{branch.id}</span>
                <h3 className="text-md font-black text-white">{branch.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#B76E79]" /> {branch.location}
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                branch.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                branch.status === 'تحت الصيانة' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/25'
              }`}>
                {branch.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/5 text-center text-xs font-bold my-4">
              <div>
                <span className="text-[10px] text-slate-500 block">المشرف المسؤول</span>
                <span className="text-white block mt-1">{branch.manager}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">الملاعب/الصالات</span>
                <span className="text-[#E5D4C0] font-mono text-sm block mt-1">{branch.courtsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">اللاعبين المسجلين</span>
                <span className="text-indigo-400 font-mono text-sm block mt-1">{branch.playersCount}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-400 font-mono">{branch.phone}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(branch)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all cursor-pointer border border-white/5"
                  title="تعديل الفرع"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="p-2 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 rounded-lg transition-all cursor-pointer border border-rose-950/40"
                  title="حذف الفرع"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
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
              <h3 className="text-lg font-black text-white">{selectedBranch ? 'تعديل بيانات الفرع' : 'تأسيس فرع جديد'}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">يرجى تسجيل كافة البيانات الإدارية المطلوبة:</p>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4 text-xs font-bold">
              <div className="space-y-1.5">
                <label className="text-slate-300">اسم الفرع الفاخر *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرع الرياض الياسمين"
                  value={branchForm.name}
                  onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">موقع الفرع بالتفصيل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حي الياسمين، الرياض"
                  value={branchForm.location}
                  onChange={e => setBranchForm({ ...branchForm, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300">المدير المشرف *</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم المدير"
                    value={branchForm.manager}
                    onChange={e => setBranchForm({ ...branchForm, manager: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300">عدد الملاعب والصالات</label>
                  <input
                    type="number"
                    min="1"
                    value={branchForm.courtsCount}
                    onChange={e => setBranchForm({ ...branchForm, courtsCount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300">هاتف الفرع التواصل</label>
                  <input
                    type="tel"
                    placeholder="05xxxxxx"
                    value={branchForm.phone}
                    onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none text-left"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300">الحالة التشغيلية</label>
                  <select
                    value={branchForm.status}
                    onChange={e => setBranchForm({ ...branchForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none"
                  >
                    <option value="نشط">نشط</option>
                    <option value="تحت الصيانة">تحت الصيانة</option>
                    <option value="مغلق مؤقتاً">مغلق مؤقتاً</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                حفظ بيانات الفرع
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
