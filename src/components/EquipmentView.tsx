/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, ShieldAlert, Wrench, RefreshCw, Plus, Search, 
  Filter, Download, Printer, Edit, Trash2, X, Check, ArrowRightLeft,
  Calendar, UserCheck, Shield, Clipboard, AlertCircle
} from 'lucide-react';

interface EquipmentCustody {
  id: string;
  name: string;
  serialNo: string;
  coachName: string;
  assignedDate: string;
  returnDate?: string;
  physicalCondition: 'ممتازة' | 'جيدة' | 'تحتاج صيانة' | 'تالفة';
  status: 'قيد الاستخدام' | 'تم إرجاعها' | 'في الصيانة';
  notes: string;
}

interface EquipmentViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({ onAddToast }) => {
  // 1. قاعدة البيانات الوهمية المتكاملة للعهود الرياضية
  const [custodies, setCustodies] = useState<EquipmentCustody[]>([
    { id: 'EQ-101', name: 'جهاز قياس نبضات القلب والجهد Garmin', serialNo: 'SN-GARMIN-7890-X', coachName: 'الكابتن أحمد ممدوح', assignedDate: '2026-06-01', physicalCondition: 'ممتازة', status: 'قيد الاستخدام', notes: 'عهد لتقييم الأداء البدني لفئة المتقدمين تينس.' },
    { id: 'EQ-102', name: 'حقيبة إسعافات أولية متكاملة ميديكال', serialNo: 'SN-FIRSTAID-002', coachName: 'الكابتن طارق السعيد', assignedDate: '2026-06-10', physicalCondition: 'جيدة', status: 'قيد الاستخدام', notes: 'عهدة طبية ملازمة لتمارين كرة القدم بالملعب الخارجي.' },
    { id: 'EQ-103', name: 'جهاز ليزر تخطيط وتحديد مسافات الجري', serialNo: 'SN-LASER-DIST-33', coachName: 'الكابتن عادل الدوسري', assignedDate: '2026-05-15', physicalCondition: 'تحتاج صيانة', status: 'في الصيانة', notes: 'فقدان دقة الاستشعار، تم توجيهها للورشة الهندسية.' },
    { id: 'EQ-104', name: 'كاميرا جوبرو 12 لتصوير وتحليل الحركات', serialNo: 'SN-GOPRO-HE12', coachName: 'الكابتن يوسف المعيوف', assignedDate: '2026-06-18', physicalCondition: 'ممتازة', status: 'قيد الاستخدام', notes: 'لتحليل تكنيك ركلات لاعبي الكاراتيه والحركات القتالية.' },
    { id: 'EQ-105', name: 'بوابة توقيت سباقات إلكترونية متكاملة', serialNo: 'SN-TIMER-GATE-99', coachName: 'الكابتن أحمد ممدوح', assignedDate: '2026-04-20', returnDate: '2026-06-25', physicalCondition: 'جيدة', status: 'تم إرجاعها', notes: 'تم إرجاعها وتسليمها للمخزن المركزي بعد انتهاء دورة ألعاب القوى.' },
    { id: 'EQ-106', name: 'طقم أقماع فسفورية ذكية مع حوامل معدنية', serialNo: 'SN-SMART-CONE-12', coachName: 'الكابتن ياسر القحطاني', assignedDate: '2026-06-22', physicalCondition: 'جيدة', status: 'قيد الاستخدام', notes: 'أقماع بنظام إضاءة تدريب مهارات سرعة البديهة والرشاقة.' },
  ]);

  // 2. حالات البحث والفرز والفلترة
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'الكل' | 'قيد الاستخدام' | 'تم إرجاعها' | 'في الصيانة'>('الكل');
  const [loading, setLoading] = useState(false);

  // حالات النوافذ الحوارية Modals
  const [isCustodyModalOpen, setIsCustodyModalOpen] = useState(false);
  const [currentCustody, setCurrentCustody] = useState<EquipmentCustody | null>(null);

  // نموذج عهدة جديدة
  const [form, setForm] = useState({
    name: '',
    serialNo: '',
    coachName: 'الكابتن أحمد ممدوح',
    assignedDate: new Date().toISOString().split('T')[0],
    physicalCondition: 'ممتازة' as 'ممتازة' | 'جيدة' | 'تحتاج صيانة' | 'تالفة',
    status: 'قيد الاستخدام' as 'قيد الاستخدام' | 'تم إرجاعها' | 'في الصيانة',
    notes: '',
  });

  // حالات نافذة تسليم وإرجاع العهدة
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedCustodyForReturn, setSelectedCustodyForReturn] = useState<EquipmentCustody | null>(null);
  const [returnCondition, setReturnCondition] = useState<'ممتازة' | 'جيدة' | 'تحتاج صيانة' | 'تالفة'>('جيدة');
  const [returnNotes, setReturnNotes] = useState('');

  // حالات نافذة الطباعة والسندات الرسمية للعهد
  const [printTarget, setPrintTarget] = useState<EquipmentCustody | null>(null);

  // تصفية العهود
  const filteredCustodies = useMemo(() => {
    return custodies.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.serialNo.toLowerCase().includes(search.toLowerCase()) || 
                          item.coachName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = selectedStatus === 'الكل' || item.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [custodies, search, selectedStatus]);

  // إحصائيات سريعة للعهد والعهود النشطة
  const stats = useMemo(() => {
    const total = custodies.length;
    const inUse = custodies.filter(c => c.status === 'قيد الاستخدام').length;
    const maintenance = custodies.filter(c => c.status === 'في الصيانة').length;
    return { total, inUse, maintenance };
  }, [custodies]);

  // حفظ العهدة
  const handleSaveCustody = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.serialNo.trim()) {
      onAddToast('يرجى ملء جميع الحقول المطلوبة لربط العهدة بنجاح.', 'error');
      return;
    }

    if (currentCustody) {
      // تعديل عهدة موجودة
      setCustodies(prev => prev.map(c => c.id === currentCustody.id ? {
        ...c,
        name: form.name,
        serialNo: form.serialNo,
        coachName: form.coachName,
        assignedDate: form.assignedDate,
        physicalCondition: form.physicalCondition,
        status: form.status,
        notes: form.notes
      } : c));
      onAddToast(`تمت تعديل بيانات العهدة للعهد الرياضي ${form.name} بنجاح!`, 'success');
    } else {
      // تسجيل عهدة جديدة مسندة
      const newCustody: EquipmentCustody = {
        id: `EQ-${Math.floor(100 + Math.random() * 900)}`,
        name: form.name,
        serialNo: form.serialNo,
        coachName: form.coachName,
        assignedDate: form.assignedDate,
        physicalCondition: form.physicalCondition,
        status: 'قيد الاستخدام',
        notes: form.notes
      };
      setCustodies(prev => [newCustody, ...prev]);
      onAddToast(`تم بنجاح تسجيل العهدة باسم "${form.name}" وإسنادها للكابتن ${form.coachName}!`, 'success');
    }
    setIsCustodyModalOpen(false);
  };

  // فتح نافذة إرجاع/تسليم العهدة
  const handleOpenReturnModal = (custody: EquipmentCustody) => {
    setSelectedCustodyForReturn(custody);
    setReturnCondition(custody.physicalCondition);
    setReturnNotes('');
    setIsReturnModalOpen(true);
  };

  // تأكيد إرجاع العهدة للمخزن
  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustodyForReturn) return;

    setCustodies(prev => prev.map(c => c.id === selectedCustodyForReturn.id ? {
      ...c,
      status: 'تم إرجاعها',
      physicalCondition: returnCondition,
      returnDate: new Date().toISOString().split('T')[0],
      notes: `${c.notes} | تم الإرجاع بحالة (${returnCondition}): ${returnNotes}`
    } : c));

    onAddToast(`تم إرجاع العهدة "${selectedCustodyForReturn.name}" للمستودع وإخلاء طرف الكابتن!`, 'success');
    setIsReturnModalOpen(false);
  };

  // إرسال العهدة إلى الصيانة
  const handleSendToMaintenance = (custody: EquipmentCustody) => {
    if (window.confirm(`هل أنت متأكد من تحويل العهدة "${custody.name}" إلى وضع الصيانة الفنية والورش؟`)) {
      setCustodies(prev => prev.map(c => c.id === custody.id ? {
        ...c,
        status: 'في الصيانة',
        physicalCondition: 'تحتاج صيانة',
        notes: `${c.notes} | تم الإرسال للصيانة في ${new Date().toISOString().split('T')[0]}`
      } : c));
      onAddToast(`تم تحويل عهدة الجهاز لمركز الصيانة الفنية بالأكاديمية.`, 'info');
    }
  };

  const handleOpenAddModal = () => {
    setCurrentCustody(null);
    setForm({
      name: '',
      serialNo: `SN-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      coachName: 'الكابتن أحمد ممدوح',
      assignedDate: new Date().toISOString().split('T')[0],
      physicalCondition: 'ممتازة',
      status: 'قيد الاستخدام',
      notes: '',
    });
    setIsCustodyModalOpen(true);
  };

  const handleOpenEditModal = (c: EquipmentCustody) => {
    setCurrentCustody(c);
    setForm({
      name: c.name,
      serialNo: c.serialNo,
      coachName: c.coachName,
      assignedDate: c.assignedDate,
      physicalCondition: c.physicalCondition,
      status: c.status,
      notes: c.notes,
    });
    setIsCustodyModalOpen(true);
  };

  const handlePrintCustodySanded = (custody: EquipmentCustody) => {
    setPrintTarget(custody);
  };

  const exportCustodyList = () => {
    const headers = 'رقم العهدة,اسم المعدة,رقم التسلسل SN,الكابتن المسؤول,تاريخ الاستلام,تاريخ الإرجاع,الحالة الفيزيائية,حالة العهدة\n';
    const rows = custodies.map(c => `${c.id},${c.name},${c.serialNo},${c.coachName},${c.assignedDate},${c.returnDate || 'لا يوجد'},${c.physicalCondition},${c.status}`).join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_العهود_والأجهزة_المسندة_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onAddToast('تم تصدير ملف إحصائيات عهد المدربين بنجاح!', 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة والتحكم بالعهد */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            منظومة عهد ومعدات الكادر التدريبي
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            متابعة استلام وتسليم الأجهزة والمعدات الرياضية الفاخرة الموزعة كعهود مؤقتة أو دائمة تحت مسؤولية المدربين.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            تسجيل وإسناد عهدة
          </button>
          <button
            onClick={exportCustodyList}
            className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all"
          >
            <Download className="w-4 h-4" />
            تصدير تقرير العهد
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات الفعالة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">إجمالي الأصول الرياضية المسندة</span>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{stats.total} عهدة مسجلة</h4>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">العهود النشطة حالياً (تحت الاستخدام)</span>
            <h4 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">{stats.inUse} عهد نشطة</h4>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
            <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">أجهزة ومعدات مرسلة للصيانة</span>
            <h4 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1">{stats.maintenance} في الصيانة</h4>
          </div>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
            <Wrench className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      </div>

      {/* شريط أدوات الفلترة والبحث */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم العهدة، المدرب، أو الرقم التسلسلي SN..."
            className="w-full pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400">حالة العهدة:</span>
          {['الكل', 'قيد الاستخدام', 'تم إرجاعها', 'في الصيانة'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                selectedStatus === st 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* جدول العهود الرياضية الرئيسي */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                <th className="p-3.5">الرمز التعريفي</th>
                <th className="p-3.5">اسم العهدة الرياضية</th>
                <th className="p-3.5">الكابتن المسؤول</th>
                <th className="p-3.5">تاريخ الاستلام</th>
                <th className="p-3.5">تاريخ الإرجاع</th>
                <th className="p-3.5">الحالة المادية للجهاز</th>
                <th className="p-3.5">الوضعية الحالية</th>
                <th className="p-3.5 text-center">إجراءات ذكية وسندات تسليم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
              {filteredCustodies.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                  <td className="p-3.5 font-mono text-[10px] text-slate-400">{item.id}</td>
                  <td className="p-3.5">
                    <span className="text-slate-800 dark:text-slate-100 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block">SN: {item.serialNo}</span>
                  </td>
                  <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-extrabold">{item.coachName}</td>
                  <td className="p-3.5 font-mono text-slate-400">{item.assignedDate}</td>
                  <td className="p-3.5 font-mono text-slate-400">{item.returnDate || '---'}</td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black ${
                      item.physicalCondition === 'ممتازة' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                      item.physicalCondition === 'جيدة' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' :
                      item.physicalCondition === 'تحتاج صيانة' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}>
                      {item.physicalCondition}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                      item.status === 'قيد الاستخدام' ? 'bg-amber-500/10 text-amber-600' :
                      item.status === 'تم إرجاعها' ? 'bg-emerald-500/10 text-emerald-600' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-2">
                      {item.status === 'قيد الاستخدام' && (
                        <>
                          <button
                            onClick={() => handleOpenReturnModal(item)}
                            className="px-2 py-1 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:hover:text-slate-900 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                          >
                            تسليم (إرجاع)
                          </button>
                          <button
                            onClick={() => handleSendToMaintenance(item)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="إرسال للصيانة"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handlePrintCustodySanded(item)}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="طباعة سند تسليم العهدة"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <span className="w-[1px] h-4 bg-slate-100 dark:bg-slate-800 mx-0.5"></span>

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustodies.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-slate-400 font-bold">
                    لا يوجد أي عهد مسجلة تطابق التصفية الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================== */}
      {/* حوار طباعة سند استلام عهدة (Custody Sanded Official Print) */}
      {/* ==================================================== */}
      {printTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setPrintTarget(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="custody-receipt-print" className="p-4 border border-slate-200 rounded-xl space-y-6">
              {/* ترويسة الأكاديمية */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-sm font-black text-slate-800 dark:text-white">أكاديمية MK للتطوير والتدريب الرياضي</h1>
                  <p className="text-[9px] text-slate-400">إدارة المستودعات واللوجستيات والمشتريات</p>
                  <p className="text-[9px] text-slate-400">الرقم الموحد: 920012345</p>
                </div>
                <div className="text-left">
                  <h2 className="text-xs font-extrabold text-indigo-600">سند تسليم وإثبات عهدة رسمية</h2>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">سند رقم: {printTarget.id}</p>
                  <p className="text-[9px] text-slate-400 font-mono">تاريخ التحرير: {printTarget.assignedDate}</p>
                </div>
              </div>

              {/* تفاصيل العهدة والمدرب */}
              <div className="space-y-3.5 text-xs">
                <p className="leading-relaxed">
                  يقر مستلم السند أدناه المدرب الفاضل <strong className="text-indigo-600">{printTarget.coachName}</strong> بأنه قد استلم وتحت مسؤوليته الشخصية المعدات الرياضية المدرجة تفاصيلها أدناه بحالة فيزيائية <span className="underline font-bold text-slate-800 dark:text-slate-200">({printTarget.physicalCondition})</span> على أن يلتزم بإعادتها فور طلب الإدارة وبنفس الحالة التي استلمها بها.
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 font-bold text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">اسم الأداة / العهدة:</span>
                    <span className="text-slate-800 dark:text-slate-200">{printTarget.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">الرقم التسلسلي للجهاز SN:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono">{printTarget.serialNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">حالة التسليم:</span>
                    <span className="text-slate-800 dark:text-slate-200">ممتازة ونظيفة جاهزة للتمرين</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">حالة العهدة الحالية بالنظام:</span>
                    <span className="text-amber-600">{printTarget.status}</span>
                  </div>
                </div>

                {printTarget.notes && (
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">ملاحظات تسليم العهدة:</span>
                    <p className="text-[10px] text-slate-500 italic mt-0.5">{printTarget.notes}</p>
                  </div>
                )}
              </div>

              {/* التواقيع الرسمية */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-center text-[10px] font-bold">
                <div className="space-y-12">
                  <span>توقيع الكابتن المستلم للعهدة</span>
                  <div className="h-[1px] bg-slate-300 w-2/3 mx-auto"></div>
                </div>
                <div className="space-y-12">
                  <span>توقيع مسؤول المستودعات واللوجستيات</span>
                  <div className="h-[1px] bg-slate-300 w-2/3 mx-auto"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => {
                  window.print();
                  onAddToast('تم إرسال سند عهدة الكابتن إلى طابعة الإيصالات بنجاح!', 'success');
                }}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                تأكيد وطباعة السند
              </button>
              <button
                onClick={() => setPrintTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* حوار تسجيل عهدة جديدة (Add/Edit Custody Modal) */}
      {/* ==================================================== */}
      {isCustodyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsCustodyModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-indigo-500" />
              {currentCustody ? 'تعديل بيانات العهدة الرياضية' : 'إسناد عهدة جديدة لكابتن تدريبي'}
            </h3>

            <form onSubmit={handleSaveCustody} className="space-y-4 text-xs font-bold">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">اسم العهدة / المعدة الرياضية *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="مثال: ساعة غارمين فنيكس 7 الذكية"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">الرقم التسلسلي SN *</label>
                    <input
                      type="text"
                      value={form.serialNo}
                      onChange={(e) => setForm({ ...form, serialNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">الكابتن المستلم *</label>
                    <select
                      value={form.coachName}
                      onChange={(e) => setForm({ ...form, coachName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="الكابتن أحمد ممدوح">الكابتن أحمد ممدوح (سباحة)</option>
                      <option value="الكابتن طارق السعيد">الكابتن طارق السعيد (كرة قدم)</option>
                      <option value="الكابتن عادل الدوسري">الكابتن عادل الدوسري (سلة)</option>
                      <option value="الكابتن يوسف المعيوف">الكابتن يوسف المعيوف (كاراتيه)</option>
                      <option value="الكابتن ياسر القحطاني">الكابتن ياسر القحطاني (لياقة بدنية)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">تاريخ إسناد العهدة *</label>
                    <input
                      type="date"
                      value={form.assignedDate}
                      onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">حالة المعدة عند التسليم *</label>
                    <select
                      value={form.physicalCondition}
                      onChange={(e) => setForm({ ...form, physicalCondition: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="ممتازة">ممتازة (مغلفة وجديدة)</option>
                      <option value="جيدة">جيدة (مستعملة بحالة ممتازة)</option>
                      <option value="تحتاج صيانة">تحتاج صيانة (أعطال طفيفة)</option>
                      <option value="تالفة">تالفة (تحتاج استبدال)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">ملاحظات وتفاصيل إضافية للعهدة *</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="اكتب أي ملاحظات أو مواصفات للجهاز الرياضي هنا..."
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  {currentCustody ? 'حفظ التعديلات' : 'تأكيد وإسناد العهدة'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustodyModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* حوار إخلاء طرف واستلام العهدة (Return/Handover Custody Modal) */}
      {/* ==================================================== */}
      {isReturnModalOpen && selectedCustodyForReturn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsReturnModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <ClipboardCheck className="w-5 h-5 text-emerald-500" />
              إخلاء طرف وإرجاع العهدة
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mb-4">
              تأكيد استلام عهدة الجهاز الرياضي: <strong className="text-indigo-600 font-bold block mt-1">{selectedCustodyForReturn.name}</strong>
            </p>

            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-500 mb-1">الحالة المادية للعهد عند الاستلام الفعلي *</label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                >
                  <option value="ممتازة">ممتازة (مغلفة أو نظيفة جداً)</option>
                  <option value="جيدة">جيدة (صالحة للتداول)</option>
                  <option value="تحتاج صيانة">تحتاج صيانة (توجد أعطال ميكانيكية أو تقنية)</option>
                  <option value="تالفة">تالفة (تحتاج إلى إسقاط مالي وتوريد بديل)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">ملاحظات وتقرير فحص العهدة الارتجاعي *</label>
                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  placeholder="مثال: تم إرجاعها سليمة وبها بعض الخدوش الخارجية الطفيفة."
                  required
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-600/10 active:scale-95"
                >
                  تأكيد الاستلام وإخلاء طرف المدرب
                </button>
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
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
