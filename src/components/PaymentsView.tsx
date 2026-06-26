/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BadgeDollarSign, Search, Plus, Trash2, Edit, Printer, ArrowUpDown, 
  ChevronLeft, ChevronRight, X, Download, TrendingUp, TrendingDown, RefreshCw 
} from 'lucide-react';
import { Transaction, Player } from '../types';
import { handleExportData, handlePrintData } from '../data';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface PaymentsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  transactionsList: Transaction[];
  setTransactionsList: React.Dispatch<React.SetStateAction<Transaction[]>>;
  playersList: Player[];
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ 
  onAddToast, transactionsList, setTransactionsList, playersList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);

  // Modal forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Transaction form State
  const [txForm, setTxForm] = useState({
    id: '',
    type: 'إيراد' as 'إيراد' | 'مصروف',
    category: 'اشتراك لاعب شهري',
    amount: 350,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    user: 'محاسب مالية',
    status: 'مكتمل' as 'مكتمل' | 'مسترجع' | 'قيد الانتظار',
  });

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const filteredTransactions = useMemo(() => {
    let result = [...transactionsList];

    if (searchTerm.trim() !== '') {
      result = result.filter(t => 
        t.category.includes(searchTerm) || 
        t.notes.includes(searchTerm) || 
        t.id.includes(searchTerm) || 
        t.user.includes(searchTerm)
      );
    }

    if (selectedType !== 'الكل') {
      result = result.filter(t => t.type === selectedType);
    }

    if (selectedStatus !== 'الكل') {
      result = result.filter(t => t.status === selectedStatus);
    }

    // Sort by Date (newest first)
    result.sort((a, b) => b.date.localeCompare(a.date));

    return result;
  }, [transactionsList, searchTerm, selectedType, selectedStatus]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.category.trim() || !txForm.amount) {
      onAddToast('يرجى تعبئة الفئة والمبلغ المالي للعملية!', 'error');
      return;
    }

    const newId = `سند-${transactionsList.length + 1}`;
    const added: Transaction = {
      ...txForm,
      id: newId,
    };

    setTransactionsList(prev => [added, ...prev]);
    onAddToast(`تم بنجاح قيد سند المالي الجديد: ${txForm.category} بمبلغ ${txForm.amount} ر.س!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleRefundTransaction = (id: string) => {
    if (confirm('هل ترغب في وضع حالة هذا السند كـ "مسترجع" وإعادة الأموال؟')) {
      setTransactionsList(prev => prev.map(t => t.id === id ? { ...t, status: 'مسترجع' } : t));
      onAddToast('تم تعديل السند المالي كـ "مسترجع" بنجاح.', 'success');
    }
  };

  const handlePrintReceiptVoucher = (tx: Transaction) => {
    let playerDetails = '';
    if (tx.playerId) {
      const p = playersList.find(x => x.id === tx.playerId);
      if (p) playerDetails = `<p>اسم المشترك: <b>${p.name}</b> (${p.id})</p>`;
    }

    const html = `
      <div style="border: 4px double #1a237e; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; line-height: 1.8; direction: rtl; font-family: 'Segoe UI', Arial;">
        <div style="text-align: center; border-bottom: 2px solid #1a237e; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1a237e;">أكاديمية MK الرياضية للتكنولوجيا والألعاب</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #555;">سند مالي رسمي رقم: <b>${tx.id}</b></p>
        </div>
        <div style="font-size: 14px; color: #333;">
          <p>تاريخ السند: <b>${tx.date}</b></p>
          <p>نوع السند: <b style="color: ${tx.type === 'إيراد' ? 'green' : 'red'}; font-size: 15px;">${tx.type === 'إيراد' ? 'قبض وإيراد مالي' : 'صرف ومصروف مالي'}</b></p>
          <p>التصنيف المالي: <b>${tx.category}</b></p>
          ${playerDetails}
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; font-size: 16px; margin: 20px 0; border-right: 5px solid #1a237e;">
            المبلغ المستلم / المدفوع: <b style="font-size: 18px; color: #1a237e;">${tx.amount.toLocaleString()} ريال سعودي</b>
          </div>
          <p>تفاصيل إضافية: <i>${tx.notes || 'لا يوجد ملاحظات إضافية مضافة'}</i></p>
          <p>اسم المحاسب المسؤول: <b>${tx.user}</b></p>
          <p>حالة السند: <b style="color: ${tx.status === 'مكتمل' ? 'green' : tx.status === 'قيد الانتظار' ? 'orange' : 'red'}">${tx.status}</b></p>
        </div>
        <div style="margin-top: 40px; display: flex; justify-content: space-between; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 12px; color: #777;">
          <div>ختم الحسابات بالأكاديمية</div>
          <div>توقيع مستلم السند</div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html dir="rtl"><head><title>سند مالي ${tx.id}</title></head><body style="padding: 20px;">${html}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExport = () => {
    const success = handleExportData(transactionsList, 'financial_transactions');
    if (success) onAddToast('تم تصدير الدفاتر المالية بنجاح!', 'success');
  };

  const handlePrintAll = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>كود السند</th>
            <th>النوع</th>
            <th>الفئة والتصنيف</th>
            <th>المبلغ</th>
            <th>التاريخ</th>
            <th>المسؤول</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
    `;
    filteredTransactions.slice(0, 100).forEach(t => {
      html += `
        <tr>
          <td>${t.id}</td>
          <td>${t.type}</td>
          <td>${t.category}</td>
          <td>${t.amount.toLocaleString()} ر.س</td>
          <td>${t.date}</td>
          <td>${t.user}</td>
          <td>${t.status}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData('سجل المعاملات المالية والدفاتر - أكاديمية MK الرياضية', html);
  };

  // Financial statistics
  const revenues = useMemo(() => transactionsList.filter(t => t.type === 'إيراد' && t.status === 'مكتمل').reduce((sum, t) => sum + t.amount, 0), [transactionsList]);
  const expenses = useMemo(() => transactionsList.filter(t => t.type === 'مصروف' && t.status === 'مكتمل').reduce((sum, t) => sum + t.amount, 0), [transactionsList]);
  const profits = revenues - expenses;

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-indigo-500" />
            إدارة المدفوعات والمعاملات المالية
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تتبع سندات القبض والدفع، مديونيات اللاعبين، رواتب الكادر والمدربين، طباعة إيصالات دفع إلكترونية معتمدة.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button onClick={handlePrintAll} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Printer className="w-4 h-4" />
            طباعة الدفاتر
          </button>
          <button
            onClick={() => {
              setTxForm({ id: '', type: 'إيراد', category: 'اشتراك لاعب شهري', amount: 350, date: new Date().toISOString().split('T')[0], notes: '', user: 'محاسب مالية', status: 'مكتمل' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            قيد سند مالي جديد
          </button>
        </div>
      </div>

      {/* Financial stats board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold">إجمالي المقبوضات (الإيرادات)</p>
            <h3 className="text-lg font-black text-emerald-600">{revenues.toLocaleString()} ر.س</h3>
          </div>
          <TrendingUp className="w-10 h-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl" />
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold">إجمالي المدفوعات (المصروفات)</p>
            <h3 className="text-lg font-black text-rose-600">{expenses.toLocaleString()} ر.س</h3>
          </div>
          <TrendingDown className="w-10 h-10 text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-xl" />
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold">صافي رصيد الأكاديمية</p>
            <h3 className="text-lg font-black text-indigo-600">{profits.toLocaleString()} ر.س</h3>
          </div>
          <BadgeDollarSign className="w-10 h-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-xl" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="ابحث بالبند المالي، رقم السند، التفاصيل، المحاسب المسؤول..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-xl"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل السندات</option>
            <option value="إيراد">قبض وإيرادات</option>
            <option value="مصروف">صرف ومصروفات</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); triggerLoading(); }}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            <option value="الكل">كل الحالات</option>
            <option value="مكتمل">مكتمل</option>
            <option value="قيد الانتظار">قيد الانتظار</option>
            <option value="مسترجع">مسترجع</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <TableSkeleton rows={10} />
      ) : paginatedTransactions.length === 0 ? (
        <EmptyState title="لا توجد أي معاملات مالية تطابق بحثك" description="يرجى مراجعة فلاتر البحث والتبويب أو قيد سند قبض/صرف جديد." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold">
                  <th className="p-4">كود السند</th>
                  <th className="p-4">تاريخ السند</th>
                  <th className="p-4">البند والتصنيف المالي</th>
                  <th className="p-4">النوع</th>
                  <th className="p-4">المبلغ المالي</th>
                  <th className="p-4">المحاسب المسؤول</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الإجراءات والطباعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all">
                    <td className="p-4 font-mono font-bold text-slate-400">{tx.id}</td>
                    <td className="p-4 font-mono text-slate-500">{tx.date}</td>
                    <td className="p-4">
                      <p className="font-extrabold text-slate-900 dark:text-slate-100">{tx.category}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{tx.notes || 'قبض رسوم اشتراك الأكاديمية'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${
                        tx.type === 'إيراد' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-indigo-600 dark:text-indigo-400 text-xs">
                      {tx.type === 'إيراد' ? '+' : '-'}{tx.amount.toLocaleString()} ر.س
                    </td>
                    <td className="p-4 text-slate-500">{tx.user}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'مكتمل' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' 
                          : tx.status === 'قيد الانتظار'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handlePrintReceiptVoucher(tx)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-lg cursor-pointer"
                          title="طباعة إيصال مالي رسمي"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {tx.status === 'مكتمل' && (
                          <button
                            onClick={() => handleRefundTransaction(tx.id)}
                            className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg cursor-pointer"
                            title="طلب Refund واسترجاع"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-bold">
              عرض {paginatedTransactions.length} من أصل {filteredTransactions.length} معامَلة مالية بالدفاتر
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

      {/* Add income / expense modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs font-bold animate-fade-in">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              تسجيل وقيد حركة سند مالي بالدفاتر
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">نوع المعاملة</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value as any, category: e.target.value === 'إيراد' ? 'اشتراك لاعب شهري' : 'رواتب المدربين' })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="إيراد">قبض وإيراد</option>
                    <option value="مصروف">صرف ومصروف</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">المبلغ المالي (ريال) *</label>
                  <input
                    type="number"
                    required
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">تصنيف وبند المعاملة</label>
                {txForm.type === 'إيراد' ? (
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="اشتراك لاعب شهري">رسوم اشتراك لاعب شهري</option>
                    <option value="مبيعات متجر الأكاديمية">مبيعات متجر الأكاديمية</option>
                    <option value="إيجار ملاعب وصالات">إيجار ملاعب وصالات</option>
                    <option value="رعاة رسميين ودعم تكنولوجي">رعاة رسميين ودعم تكنولوجي</option>
                  </select>
                ) : (
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="رواتب المدربين">رواتب المدربين الفنية</option>
                    <option value="رواتب موظفين وإداريين">رواتب موظفين وإداريين</option>
                    <option value="مستلزمات وأجهزة رياضية">شراء مستلزمات وأجهزة رياضية</option>
                    <option value="فواتير المقر والصيانة العامة">فواتير المقر والصيانة العامة</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">تاريخ الحركة المالية</label>
                <input
                  type="date"
                  value={txForm.date}
                  onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">تفاصيل السند والبيان</label>
                <textarea
                  rows={2}
                  value={txForm.notes}
                  onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                  placeholder="اكتب تفاصيل إضافية مبررة للحركة المالية..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all active:scale-95">
                  قيد المعاملة وحفظ
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
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
