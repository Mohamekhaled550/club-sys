/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Plus, Trash2, Edit, Eye, Phone, Mail, 
  Briefcase, Heart, X, Download, Printer, ArrowUpDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Parent, Player } from '../types';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';
import { handleExportData, handlePrintData } from '../data';

interface ParentsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  parentsList: Parent[];
  setParentsList: React.Dispatch<React.SetStateAction<Parent[]>>;
  playersList: Player[];
}

export const ParentsView: React.FC<ParentsViewProps> = ({ 
  onAddToast, parentsList, setParentsList, playersList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelation, setSelectedRelation] = useState('الكل');
  const [sortBy, setSortBy] = useState<'name' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [viewParent, setViewParent] = useState<Parent | null>(null);

  // Form State
  const [parentForm, setParentForm] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    profession: '',
    relation: 'أب',
    notes: '',
  });

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 350);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleSort = (field: 'name' | 'id') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    triggerLoading();
  };

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...parentsList];

    if (searchTerm.trim() !== '') {
      result = result.filter(p => 
        p.name.includes(searchTerm) || 
        p.phone.includes(searchTerm) || 
        p.email.includes(searchTerm)
      );
    }

    if (selectedRelation !== 'الكل') {
      result = result.filter(p => p.relation === selectedRelation);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'ar');
      } else {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [parentsList, searchTerm, selectedRelation, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedParents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentForm.name.trim() || !parentForm.phone.trim() || !parentForm.email.trim()) {
      onAddToast('يرجى تعبئة الحقول الأساسية المطلوبة!', 'error');
      return;
    }

    if (isEditMode) {
      setParentsList(prev => prev.map(p => p.id === parentForm.id ? { ...p, ...parentForm } : p));
      onAddToast(`تم تحديث بيانات ولي الأمر: ${parentForm.name}`, 'success');
    } else {
      const newId = `ولي أمر-${parentsList.length + 1}`;
      const randomColor = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-teal-500"][Math.floor(Math.random() * 5)];
      const added: Parent = {
        ...parentForm,
        id: newId,
        avatarColor: randomColor,
        kidsIds: [],
      };
      setParentsList(prev => [added, ...prev]);
      onAddToast(`تمت إضافة ولي الأمر الجديد بنجاح: ${parentForm.name}`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleEditClick = (parent: Parent) => {
    setParentForm({
      id: parent.id,
      name: parent.name,
      phone: parent.phone,
      email: parent.email,
      profession: parent.profession,
      relation: parent.relation,
      notes: parent.notes,
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف ولي الأمر: ${name}؟ سيتم فك ارتباط الأبناء به.`)) {
      setParentsList(prev => prev.filter(p => p.id !== id));
      onAddToast(`تم حذف سجل ولي الأمر "${name}" بنجاح.`, 'success');
    }
  };

  const handleExport = () => {
    const success = handleExportData(parentsList, 'parents_list');
    if (success) onAddToast('تم تصدير ملف أولياء الأمور بنجاح!', 'success');
  };

  const handlePrint = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>الرقم التعريفى</th>
            <th>الاسم الكامل</th>
            <th>رقم الهاتف</th>
            <th>البريد الإلكتروني</th>
            <th>المهنة</th>
            <th>الصلة</th>
          </tr>
        </thead>
        <tbody>
    `;
    filteredAndSorted.forEach(p => {
      html += `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.phone}</td>
          <td>${p.email}</td>
          <td>${p.profession}</td>
          <td>${p.relation}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData('تقرير أولياء الأمور - أكاديمية MK الرياضية', html);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            إدارة أولياء الأمور والاتصال
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تتبع بيانات أولياء الأمور، ربط الأبناء المسجلين، الاشتراكات والمدفوعات، وسجل الأنشطة.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-4 h-4" />
            تصدير JSON
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Printer className="w-4 h-4" />
            طباعة
          </button>
          <button
            onClick={() => {
              setParentForm({ id: '', name: '', phone: '', email: '', profession: '', relation: 'أب', notes: '' });
              setIsEditMode(false);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            إضافة ولي أمر جديد
          </button>
        </div>
      </div>

      {/* Filters Search & Relation Selector */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث عن ولي أمر بالاسم، الهاتف، أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0">صلة القرابة:</span>
          <select
            value={selectedRelation}
            onChange={(e) => { setSelectedRelation(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">الكل (أب / أم)</option>
            <option value="أب">أب</option>
            <option value="أم">أم</option>
          </select>
        </div>
      </div>

      {/* Grid/Table List of Parents */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : paginatedParents.length === 0 ? (
        <EmptyState title="لا يوجد نتائج تطابق بحثك" description="يرجى كتابة الاسم بشكل صحيح أو استخدام تصفية صلة القرابة." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => toggleSort('id')}>
                    الرقم التعريفي <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => toggleSort('name')}>
                    الاسم الكامل <ArrowUpDown className="w-3.5 h-3.5 inline" />
                  </th>
                  <th className="p-4">صلة القرابة</th>
                  <th className="p-4">المهنة</th>
                  <th className="p-4">رقم الجوال</th>
                  <th className="p-4">عدد الأبناء في الأكاديمية</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {paginatedParents.map((parent) => {
                  const kidsCount = playersList.filter(p => p.parentId === parent.id).length;
                  return (
                    <tr key={parent.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-400">{parent.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${parent.avatarColor}`}>
                            {parent.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{parent.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          parent.relation === 'أب' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20' : 'bg-pink-50 text-pink-700 dark:bg-pink-900/20'
                        }`}>
                          {parent.relation}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{parent.profession}</td>
                      <td className="p-4 font-mono text-slate-500">{parent.phone}</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold">
                          {kidsCount} أبناء
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setViewParent(parent)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-lg transition-colors cursor-pointer"
                            title="الملف الكامل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(parent)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-amber-500 rounded-lg transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(parent.id, parent.name)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
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

          {/* Pagination bar */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-bold">
              عرض {paginatedParents.length} من أصل {filteredAndSorted.length} ولي أمر
            </span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 border border-slate-100 dark:border-slate-800 rounded-xl font-bold dark:bg-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => prev + 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Parent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Users className="w-5 h-5 text-indigo-500" />
              {isEditMode ? 'تعديل بيانات ولي الأمر' : 'إضافة ولي أمر جديد'}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الاسم الكامل لولي الأمر *</label>
                <input
                  type="text"
                  required
                  value={parentForm.name}
                  onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                  placeholder="مثال: خالد عبد الرحمن الشريف"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">رقم هاتف التواصل *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={parentForm.phone}
                    onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-left font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={parentForm.email}
                    onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-left font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">المهنة / الوظيفة</label>
                  <input
                    type="text"
                    placeholder="مثال: مهندس، معلم"
                    value={parentForm.profession}
                    onChange={(e) => setParentForm({ ...parentForm, profession: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">صلة القرابة</label>
                  <select
                    value={parentForm.relation}
                    onChange={(e) => setParentForm({ ...parentForm, relation: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="أب">أب</option>
                    <option value="أم">أم</option>
                    <option value="عم">عم</option>
                    <option value="خال">خال</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  value={parentForm.notes}
                  onChange={(e) => setParentForm({ ...parentForm, notes: e.target.value })}
                  placeholder="ملاحظات الطوارئ أو طريقة الاتصال المفضلة..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                  {isEditMode ? 'حفظ التعديلات' : 'تسجيل ولي الأمر'}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Parent Details (Kid relations, history, payments) */}
      {viewParent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in text-xs max-h-[85vh] overflow-y-auto">
            <button onClick={() => setViewParent(null)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black ${viewParent.avatarColor}`}>
                {viewParent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{viewParent.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{viewParent.id} • صلة القرابة: {viewParent.relation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-1.5">
                <p className="text-slate-400 font-bold">رقم الهاتف:</p>
                <p className="font-mono text-slate-800 dark:text-slate-200 font-bold">{viewParent.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-1.5">
                <p className="text-slate-400 font-bold">البريد الإلكتروني:</p>
                <p className="font-mono text-slate-800 dark:text-slate-200 font-bold">{viewParent.email}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-1.5">
                <p className="text-slate-400 font-bold">المهنة الحالية:</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold">{viewParent.profession}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl space-y-1.5">
                <p className="text-slate-400 font-bold">ملاحظات الطوارئ:</p>
                <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{viewParent.notes}</p>
              </div>
            </div>

            {/* الأبناء المسجلون */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 border-r-4 border-indigo-500 pr-2">الأبناء المسجلون في الأكاديمية</h4>
              {playersList.filter(p => p.parentId === viewParent.id).length === 0 ? (
                <p className="text-slate-400 font-bold text-center py-4">لم يتم تسجيل أي أبناء لولي الأمر هذا بعد.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {playersList.filter(p => p.parentId === viewParent.id).map(kid => (
                    <div key={kid.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${kid.avatarColor}`}>
                          {kid.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{kid.name}</p>
                          <p className="text-[10px] text-slate-400">{kid.sport} • {kid.level}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        kid.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {kid.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button onClick={() => setViewParent(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
