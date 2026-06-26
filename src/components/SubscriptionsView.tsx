/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Search, Plus, Trash2, Edit, RefreshCw, Snowflake, Ban, 
  RotateCcw, Check, X, Download, Printer, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { SubscriptionType, Player } from '../types';
import { subscriptionTypes, handleExportData, handlePrintData } from '../data';
import { EmptyState } from './EmptyStates';
import { TableSkeleton } from './Skeletons';

interface SubscriptionsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
  subscriptionTypesList: SubscriptionType[];
  setSubscriptionTypesList: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ 
  onAddToast, playersList, setPlayersList, subscriptionTypesList, setSubscriptionTypesList 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);

  // Package Crud Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [packageForm, setPackageForm] = useState({
    id: '',
    name: '',
    durationMonths: 1,
    price: 350,
    sport: 'كرة القدم',
    features: [] as string[],
  });

  // Action Simulation Modal (Renew, Freeze, Stop, Refund)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'renew' | 'freeze' | 'stop' | 'refund'>('renew');
  const [actionPlayerId, setActionPlayerId] = useState('');
  const [actionDuration, setActionDuration] = useState('1'); // for renew or freeze months

  const sportsList = ["الكل", "كرة القدم", "كرة السلة", "السباحة", "الكاراتيه", "التنس", "كرة الطائرة", "الجودو", "اللياقة البدنية"];

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const filteredPackages = useMemo(() => {
    let result = [...subscriptionTypesList];

    if (searchTerm.trim() !== '') {
      result = result.filter(pkg => 
        pkg.name.includes(searchTerm) || 
        pkg.sport.includes(searchTerm)
      );
    }

    if (selectedSport !== 'الكل') {
      result = result.filter(pkg => pkg.sport === selectedSport);
    }

    return result;
  }, [subscriptionTypesList, searchTerm, selectedSport]);

  const handleSubmitPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name.trim()) {
      onAddToast('يرجى تحديد اسم باقة الاشتراك!', 'error');
      return;
    }

    if (isEditMode) {
      setSubscriptionTypesList(prev => prev.map(pkg => pkg.id === packageForm.id ? { ...pkg, ...packageForm } : pkg));
      onAddToast(`تم تحديث باقة الاشتراك: ${packageForm.name}`, 'success');
    } else {
      const newId = `باقة-${subscriptionTypesList.length + 1}`;
      const added: SubscriptionType = {
        ...packageForm,
        id: newId,
        features: packageForm.features.length > 0 ? packageForm.features : ["3 حصص أسبوعياً", "متابعة وتقييم فني"]
      };
      setSubscriptionTypesList(prev => [...prev, added]);
      onAddToast(`تمت إضافة باقة الاشتراك الجديدة: ${packageForm.name}`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleEditPackage = (pkg: SubscriptionType) => {
    setPackageForm({
      id: pkg.id,
      name: pkg.name,
      durationMonths: pkg.durationMonths,
      price: pkg.price,
      sport: pkg.sport,
      features: pkg.features,
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDeletePackage = (id: string, name: string) => {
    if (confirm(`هل ترغب في شطب باقة الاشتراك "${name}"؟`)) {
      setSubscriptionTypesList(prev => prev.filter(pkg => pkg.id !== id));
      onAddToast(`تم حذف باقة "${name}" بنجاح.`, 'success');
    }
  };

  // Perform Actions: Renew, Freeze, Stop, Refund
  const handlePerformSubscriptionAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionPlayerId.trim()) {
      onAddToast('يرجى اختيار اللاعب المستهدف لتنفيذ العملية!', 'error');
      return;
    }

    const player = playersList.find(p => p.id === actionPlayerId);
    if (!player) {
      onAddToast('اللاعب غير موجود في السجلات!', 'error');
      return;
    }

    if (actionType === 'renew') {
      // Renew: update status to active and update joinDate
      setPlayersList(prev => prev.map(p => p.id === actionPlayerId ? { ...p, status: 'نشط', joinDate: new Date().toISOString().split('T')[0] } : p));
      onAddToast(`تم تجديد الاشتراك للاعب: ${player.name} بنجاح!`, 'success');
    } else if (actionType === 'freeze') {
      // Freeze: update status to موقف
      setPlayersList(prev => prev.map(p => p.id === actionPlayerId ? { ...p, status: 'موقف' } : p));
      onAddToast(`تم تجميد اشتراك اللاعب: ${player.name} لمدة ${actionDuration} شهر!`, 'info');
    } else if (actionType === 'stop') {
      // Stop: update status to منتهي
      setPlayersList(prev => prev.map(p => p.id === actionPlayerId ? { ...p, status: 'منتهي' } : p));
      onAddToast(`تم إيقاف وإلغاء اشتراك اللاعب: ${player.name} فورياً.`, 'error');
    } else if (actionType === 'refund') {
      // Refund: update status to منتهي
      setPlayersList(prev => prev.map(p => p.id === actionPlayerId ? { ...p, status: 'منتهي' } : p));
      onAddToast(`تم إرجاع واسترجاع رسوم الاشتراك للاعب: ${player.name} بالكامل.`, 'success');
    }

    setIsActionModalOpen(false);
  };

  const handleExport = () => {
    const success = handleExportData(subscriptionTypesList, 'subscription_packages');
    if (success) onAddToast('تم تصدير الباقات بنجاح!', 'success');
  };

  const handlePrint = () => {
    let html = `
      <table>
        <thead>
          <tr>
            <th>كود الباقة</th>
            <th>اسم باقة الاشتراك</th>
            <th>المدة بالشهور</th>
            <th>السعر الرسمى</th>
            <th>الرياضة المخصصة</th>
          </tr>
        </thead>
        <tbody>
    `;
    subscriptionTypesList.forEach(pkg => {
      html += `
        <tr>
          <td>${pkg.id}</td>
          <td>${pkg.name}</td>
          <td>${pkg.durationMonths} شهر</td>
          <td>${pkg.price.toLocaleString()} ر.س</td>
          <td>${pkg.sport}</td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    handlePrintData('تقرير باقات وباقات اشتراك الأكاديمية - MK Sports Academy', html);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-500" />
            إعدادات باقات وعمليات الاشتراكات
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            تخصيص الباقات والأسعار (شهري، ربع سنوي، سنوي) وإجراء عمليات التجديد والتجميد والإنهاء واسترجاع الرسوم.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Printer className="w-4 h-4" />
            طباعة
          </button>
          <button
            onClick={() => {
              setPackageForm({ id: '', name: '', durationMonths: 1, price: 350, sport: 'كرة القدم', features: [] });
              setIsEditMode(false);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" />
            إنشاء باقة جديدة
          </button>
        </div>
      </div>

      {/* Quick Action Simulator Panels */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-3.5">العمليات السريعة للاشتراكات:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => { setActionType('renew'); setIsActionModalOpen(true); }}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs hover:shadow transition-all cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin-slow" />
            تجديد اشتراك لاعب
          </button>
          <button
            onClick={() => { setActionType('freeze'); setIsActionModalOpen(true); }}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs hover:shadow transition-all cursor-pointer"
          >
            <Snowflake className="w-5 h-5 text-blue-500" />
            تجميد اشتراك مؤقت
          </button>
          <button
            onClick={() => { setActionType('stop'); setIsActionModalOpen(true); }}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs hover:shadow transition-all cursor-pointer"
          >
            <Ban className="w-5 h-5 text-rose-500" />
            إيقاف وإنهاء فوري
          </button>
          <button
            onClick={() => { setActionType('refund'); setIsActionModalOpen(true); }}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs hover:shadow transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-emerald-500" />
            استرجاع و Refund مالى
          </button>
        </div>
      </div>

      {/* Package Configurations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPackages.map(pkg => {
          const activePlayersCount = playersList.filter(p => p.sport === pkg.sport && p.status === 'نشط').length;
          return (
            <div key={pkg.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded text-[9px] font-black">
                    باقة {pkg.sport}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{pkg.id}</span>
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{pkg.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{pkg.price.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">ريال سعودي / {pkg.durationMonths} شهور</span>
                </div>
                {/* Features */}
                <ul className="text-[10px] text-slate-500 space-y-1.5 pt-2">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 text-[10px]">
                <span className="text-slate-400 font-bold">{activePlayersCount} لاعب نشط حالياً</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:text-amber-500 rounded text-slate-400 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:text-rose-500 rounded text-slate-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Package Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs font-bold animate-fade-in">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {isEditMode ? 'تحديث إعدادات الباقة المالية' : 'إنشاء باقة اشتراك جديدة'}
            </h3>

            <form onSubmit={handleSubmitPackage} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">اسم باقة الاشتراك *</label>
                <input
                  type="text"
                  required
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  placeholder="مثال: اشتراك شهرين مميز"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">المدة بالشهور</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={packageForm.durationMonths}
                    onChange={(e) => setPackageForm({ ...packageForm, durationMonths: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">السعر بالريال السعودي *</label>
                  <input
                    type="number"
                    required
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">الرياضة واللعبة المستهدفة</label>
                <select
                  value={packageForm.sport}
                  onChange={(e) => setPackageForm({ ...packageForm, sport: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                >
                  {sportsList.slice(1).map((sport, idx) => (
                    <option key={idx} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all active:scale-95">
                  حفظ الباقة
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Quick Operation Modal */}
      {isActionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative text-right text-xs font-bold animate-fade-in">
            <button onClick={() => setIsActionModalOpen(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {actionType === 'renew' ? 'تجديد اشتراك لاعب' : actionType === 'freeze' ? 'تجميد اشتراك لاعب مؤقتاً' : actionType === 'stop' ? 'إلغاء وإيقاف اشتراك' : 'طلب استرداد مالي لمشترك'}
            </h3>

            <form onSubmit={handlePerformSubscriptionAction} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1.5">اختر اللاعب المستهدف *</label>
                <select
                  required
                  value={actionPlayerId}
                  onChange={(e) => setActionPlayerId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-right font-bold"
                >
                  <option value="">-- اختر لاعب من الأكاديمية --</option>
                  {playersList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sport} • {p.status})</option>
                  ))}
                </select>
              </div>

              {actionType === 'freeze' && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1.5">مدة التجميد المطلوبة (بالشهور)</label>
                  <select
                    value={actionDuration}
                    onChange={(e) => setActionDuration(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-right font-bold"
                  >
                    <option value="1">شهر واحد</option>
                    <option value="2">شهرين</option>
                    <option value="3">ثلاثة شهور</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow cursor-pointer">
                  تأكيد العملية
                </button>
                <button type="button" onClick={() => setIsActionModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200">
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
