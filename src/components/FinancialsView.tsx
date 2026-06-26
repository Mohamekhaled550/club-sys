/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BadgeDollarSign, ArrowUpLeft, ArrowDownRight, Search, Filter, 
  Plus, Calendar, ArrowUpDown, ChevronRight, ChevronLeft,
  Coins, Wallet, Receipt, X
} from 'lucide-react';
import { Transaction } from '../types';
import { transactions } from '../data';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';
import { FinancialsChart, SubscriptionsChart } from './CustomCharts';

interface FinancialsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  transactionsList: Transaction[];
  setTransactionsList: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({ 
  onAddToast, transactionsList, setTransactionsList 
}) => {
  // حالات البحث والفلترة والتحميل
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('الكل');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState(false);

  // حالات الصفحة الحالية والترقيم (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // حالة حوار الإضافة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // نموذج المعاملة الجديدة
  const [newTx, setNewTx] = useState({
    type: 'إيراد' as 'إيراد' | 'مصروف',
    category: 'رسوم اشتراك شهري',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    user: 'عمر الرويلي (محاسب)',
  });

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  };

  const categories = useMemo(() => {
    return selectedType === 'إيراد' 
      ? ["رسوم اشتراك شهري", "رعاية تجارية", "مبيعات متجر الأكاديمية", "إيجار ملاعب", "رسوم اختبارات أحزمة"]
      : ["رواتب مدربين", "رواتب موظفين", "مستلزمات رياضية", "صيانة ملاعب", "فواتير ماء وكهرباء", "إيجار مقر", "دعاية وإعلان"];
  }, [selectedType]);

  const allCategories = [
    "رسوم اشتراك شهري", "رعاية تجارية", "مبيعات متجر الأكاديمية", "إيجار ملاعب", "رسوم اختبارات أحزمة",
    "رواتب مدربين", "رواتب موظفين", "مستلزمات رياضية", "صيانة ملاعب", "فواتير ماء وكهرباء", "إيجار مقر", "دعاية وإعلان"
  ];

  // تصفية وفرز المعاملات
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactionsList];

    if (searchTerm.trim() !== '') {
      result = result.filter(tx => 
        tx.notes.includes(searchTerm) || 
        tx.id.includes(searchTerm) || 
        tx.category.includes(searchTerm)
      );
    }

    if (selectedType !== 'الكل') {
      result = result.filter(tx => tx.type === selectedType);
    }

    if (selectedCategory !== 'الكل') {
      result = result.filter(tx => tx.category === selectedCategory);
    }

    // فرز العمليات
    result.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'date') {
        comp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comp = a.amount - b.amount;
      }
      return sortOrder === 'desc' ? -comp : comp;
    });

    return result;
  }, [transactionsList, searchTerm, selectedType, selectedCategory, sortBy, sortOrder]);

  // تقسيم الصفحات لـ 500 عملية مالية
  const totalItems = filteredAndSortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = useMemo(() => {
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTransactions, startIndex]);

  const totals = useMemo(() => {
    const revenues = filteredAndSortedTransactions.filter(t => t.type === 'إيراد').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredAndSortedTransactions.filter(t => t.type === 'مصروف').reduce((sum, t) => sum + t.amount, 0);
    return { revenues, expenses, profit: revenues - expenses };
  }, [filteredAndSortedTransactions]);

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newTx.amount);
    if (!amountVal || amountVal <= 0) {
      onAddToast('يرجى تحديد مبلغ العملية المالي بشكل صحيح!', 'error');
      return;
    }

    const createdTx: Transaction = {
      id: `عملية-${transactionsList.length + 1}`,
      type: newTx.type,
      category: newTx.category,
      amount: amountVal,
      date: newTx.date,
      notes: newTx.notes.trim() || `تقييد معاملة ${newTx.category}`,
      user: newTx.user,
      status: 'مكتمل'
    };

    setTransactionsList(prev => [createdTx, ...prev]);
    setIsAddModalOpen(false);
    onAddToast(`تم بنجاح تقييد ${newTx.type} بقيمة ${amountVal.toLocaleString()} ر.س!`, 'success');

    setNewTx({
      type: 'إيراد',
      category: 'رسوم اشتراك شهري',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      user: 'عمر الرويلي (محاسب)',
    });
    setCurrentPage(1);
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    triggerLoading();
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. ترويسة الصفحة والتحكم العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-indigo-500" />
            الحركات الخزينة والدفاتر المالية
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            سجل مالي متكامل لتقييد الإيرادات والاشتراكات والمصروفات والرواتب، متوافق مع التدقيق المالي.
          </p>
        </div>

        <button
          onClick={() => {
            setNewTx({
              type: 'إيراد',
              category: 'رسوم اشتراك شهري',
              amount: '',
              date: new Date().toISOString().split('T')[0],
              notes: '',
              user: 'عمر الرويلي (محاسب)',
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          تقييد سند مالي جديد
        </button>
      </div>

      {/* 2. بطاقات الخزينة السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 block">إجمالي المقبوضات (إيرادات)</span>
            <span className="text-lg font-black text-indigo-800 dark:text-indigo-300 font-mono">
              {totals.revenues.toLocaleString()} ر.س
            </span>
          </div>
          <Coins className="w-8 h-8 text-indigo-500 opacity-60" />
        </div>

        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block">إجمالي المدفوعات (مصروفات)</span>
            <span className="text-lg font-black text-rose-800 dark:text-rose-300 font-mono">
              {totals.expenses.toLocaleString()} ر.س
            </span>
          </div>
          <Wallet className="w-8 h-8 text-rose-500 opacity-60" />
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 block">صافي السيولة النقدية الخزينة</span>
            <span className={`text-lg font-black font-mono ${totals.profit >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'}`}>
              {totals.profit.toLocaleString()} ر.س
            </span>
          </div>
          <Receipt className="w-8 h-8 text-blue-500 opacity-60" />
        </div>
      </div>

      {/* 3. الرسوم البيانية للتحليل المالي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FinancialsChart />
        <SubscriptionsChart />
      </div>

      {/* 4. فلاتر التصفية والفرز والبحث */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* حقل البحث */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث برقم السند، البيان، أو تفاصيل الملاحظات..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* نوع السند */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0">النوع:</span>
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setSelectedCategory('الكل'); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل المعاملات</option>
            <option value="إيراد">إيرادات ومقبوضات</option>
            <option value="مصروف">مصروفات ومدفوعات</option>
          </select>
        </div>

        {/* فئة التبويب */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0">الباب:</span>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل الأبواب</option>
            {allCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* 5. عرض قائمة السندات والعمليات المالي */}
      {loading ? (
        <TableSkeleton rows={15} />
      ) : filteredAndSortedTransactions.length === 0 ? (
        <EmptyState 
          title="لم يتم العثور على أي سندات مالية تطابق فلترتك" 
          description="يرجى كتابة الكلمات الدلالية المناسبة أو إلغاء تطبيق الفلاتر الخزينة." 
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4">رقم السند</th>
                  <th className="p-4">نوع العملية</th>
                  <th className="p-4">باب التقييد المالي</th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('amount')}>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200">
                      المبلغ المالي
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer" onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200">
                      تاريخ السند
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">البيان والتوضيح</th>
                  <th className="p-4">المستلم/المنشئ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {paginatedTransactions.map((tx) => {
                  const isRev = tx.type === 'إيراد';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-4 font-mono font-bold text-slate-400">{tx.id}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isRev 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          {isRev ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100">{tx.category}</td>
                      <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                        <span className={isRev ? 'text-indigo-600' : 'text-rose-600'}>
                          {isRev ? '+' : '-'}{tx.amount.toLocaleString()} ر.س
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{tx.date}</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{tx.notes}</td>
                      <td className="p-4 text-slate-400 font-bold">{tx.user}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ترقيم الصفحات النشط */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">
              عرض <strong className="text-slate-700 dark:text-slate-200">{startIndex + 1}</strong> إلى{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </strong>{' '}
              من أصل <strong className="text-slate-700 dark:text-slate-200">{totalItems}</strong> سند مقيد
            </span>

            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); triggerLoading(); }}
                className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl disabled:opacity-40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* ترقيم ذكي */}
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(pageNum); triggerLoading(); }}
                    className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${
                      currentPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

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

      {/* 6. حوار تقييد سند مالي */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right animate-fade-in">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Plus className="w-5 h-5 text-indigo-500" />
              تقييد معاملة وسند مالي بالدفاتر
            </h3>

            <form onSubmit={handleAddTxSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">نوع السند</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => {
                      const type = e.target.value as 'إيراد' | 'مصروف';
                      const defaultCategory = type === 'إيراد' ? 'رسوم اشتراك شهري' : 'رواتب مدربين';
                      setNewTx({ ...newTx, type, category: defaultCategory });
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold text-slate-800 dark:text-white"
                  >
                    <option value="إيراد">إيراد ومقبوضات (+)</option>
                    <option value="مصروف">مصروف ومدفوعات (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">باب التبويب الخزينة</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">المبلغ المالي (ريال سعودي) *</label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 350"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-slate-800 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">تاريخ التقييد المالي</label>
                  <input
                    type="date"
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">البيان و تفاصيل الملاحظات</label>
                <textarea
                  placeholder="اكتب بياناً تفصيلياً كسبب السند وتفاصيل الدفعة..."
                  rows={3}
                  value={newTx.notes}
                  onChange={(e) => setNewTx({ ...newTx, notes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">المحاسب المسؤول المدقق</label>
                <input
                  type="text"
                  disabled
                  value={newTx.user}
                  className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500"
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  تقييد وحفظ المعاملة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-all"
                >
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
