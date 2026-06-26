/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, AlertTriangle, BadgeDollarSign, 
  Plus, Search, Filter, Download, Printer, Edit, Trash2, X, ClipboardList,
  Building, LayoutGrid, HeartHandshake, DollarSign, ArrowUpRight, Percent
} from 'lucide-react';

interface RentalBooking {
  id: string;
  courtName: string; // اسم الملعب أو القاعة
  renterName: string; // المستأجر
  renterPhone: string;
  date: string;
  timeSlot: string; // الوقت (مثال: 05:00 م - 07:00 م)
  ratePerHour: number;
  totalHours: number;
  totalAmount: number;
  paymentStatus: 'مدفوع' | 'قيد الانتظار' | 'ملغي';
  invoiceGenerated: boolean;
}

interface RentalsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const RentalsView: React.FC<RentalsViewProps> = ({ onAddToast }) => {
  // 1. قاعدة بيانات الحجوزات وإيجارات الملاعب الوهمية والمنسقة
  const [bookings, setBookings] = useState<RentalBooking[]>([
    { id: 'BK-2026-001', courtName: 'الملعب العشبي أ (كرة قدم)', renterName: 'أ. مساعد الحربي', renterPhone: '0543210987', date: '2026-06-26', timeSlot: '04:00 م - 06:00 م', ratePerHour: 150, totalHours: 2, totalAmount: 300, paymentStatus: 'مدفوع', invoiceGenerated: true },
    { id: 'BK-2026-002', courtName: 'القاعة المغلقة ب (كرة السلة)', renterName: 'الكابتن عبد الرحمن فهد', renterPhone: '0501122334', date: '2026-06-26', timeSlot: '06:00 م - 08:00 م', ratePerHour: 200, totalHours: 2, totalAmount: 400, paymentStatus: 'قيد الانتظار', invoiceGenerated: false },
    { id: 'BK-2026-003', courtName: 'ملعب التنس الترابي أ', renterName: 'د. طلال السديري', renterPhone: '0555667788', date: '2026-06-27', timeSlot: '08:00 م - 09:30 م', ratePerHour: 120, totalHours: 1.5, totalAmount: 180, paymentStatus: 'مدفوع', invoiceGenerated: true },
    { id: 'BK-2026-004', courtName: 'صالة ألعاب القتال والدفاع عن النفس', renterName: 'نادي النمر الرياضي', renterPhone: '0569988776', date: '2026-06-28', timeSlot: '05:00 م - 08:00 م', ratePerHour: 100, totalHours: 3, totalAmount: 300, paymentStatus: 'مدفوع', invoiceGenerated: true },
    { id: 'BK-2026-005', courtName: 'الملعب العشبي ب (كرة قدم سداسي)', renterName: 'أ. فيصل المطيري', renterPhone: '0533445566', date: '2026-06-29', timeSlot: '09:00 م - 11:00 م', ratePerHour: 130, totalHours: 2, totalAmount: 260, paymentStatus: 'قيد الانتظار', invoiceGenerated: false },
  ]);

  const [courts] = useState<string[]>([
    'الملعب العشبي أ (كرة قدم)', 
    'الملعب العشبي ب (كرة قدم سداسي)', 
    'القاعة المغلقة ب (كرة السلة)', 
    'ملعب التنس الترابي أ', 
    'صالة ألعاب القتال والدفاع عن النفس'
  ]);

  // 2. الحالات الداخلية والتبويبات والبحث
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'invoices'>('bookings');
  const [search, setSearch] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('الكل');
  const [loading, setLoading] = useState(false);

  // حالات النوافذ الحوارية
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<RentalBooking | null>(null);

  // نموذج الحجز الجديد
  const [form, setForm] = useState({
    courtName: 'الملعب العشبي أ (كرة قدم)',
    renterName: '',
    renterPhone: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '04:00 م - 06:00 م',
    ratePerHour: 150,
    totalHours: 2,
    paymentStatus: 'مدفوع' as 'مدفوع' | 'قيد الانتظار' | 'ملغي'
  });

  // نموذج الفاتورة التفصيلية للطباعة
  const [invoiceTarget, setInvoiceTarget] = useState<RentalBooking | null>(null);

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 250);
  };

  // تصفية الحجوزات
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = b.renterName.toLowerCase().includes(search.toLowerCase()) || 
                          b.renterPhone.includes(search) || 
                          b.id.toLowerCase().includes(search.toLowerCase());
      const matchCourt = selectedCourt === 'الكل' || b.courtName === selectedCourt;
      return matchSearch && matchCourt;
    });
  }, [bookings, search, selectedCourt]);

  // إحصائيات سريعة ومباشرة
  const stats = useMemo(() => {
    const totalCount = bookings.filter(b => b.paymentStatus !== 'ملغي').length;
    const totalRevenue = bookings.filter(b => b.paymentStatus === 'مدفوع').reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingAmount = bookings.filter(b => b.paymentStatus === 'قيد الانتظار').reduce((sum, b) => sum + b.totalAmount, 0);
    return { totalCount, totalRevenue, pendingAmount };
  }, [bookings]);

  // حفظ الحجز
  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.renterName.trim() || !form.renterPhone.trim()) {
      onAddToast('يرجى إدخال اسم العميل المستأجر ورقم هاتفه للتثبيت.', 'error');
      return;
    }

    const calcTotal = Number(form.ratePerHour) * Number(form.totalHours);

    if (currentBooking) {
      // تعديل حجز
      setBookings(prev => prev.map(b => b.id === currentBooking.id ? {
        ...b,
        courtName: form.courtName,
        renterName: form.renterName,
        renterPhone: form.renterPhone,
        date: form.date,
        timeSlot: form.timeSlot,
        ratePerHour: Number(form.ratePerHour),
        totalHours: Number(form.totalHours),
        totalAmount: calcTotal,
        paymentStatus: form.paymentStatus
      } : b));
      onAddToast(`تم تعديل بيانات حجز ${form.renterName} بنجاح!`, 'success');
    } else {
      // حجز جديد
      const newBooking: RentalBooking = {
        id: `BK-2026-${Math.floor(100 + Math.random() * 900)}`,
        courtName: form.courtName,
        renterName: form.renterName,
        renterPhone: form.renterPhone,
        date: form.date,
        timeSlot: form.timeSlot,
        ratePerHour: Number(form.ratePerHour),
        totalHours: Number(form.totalHours),
        totalAmount: calcTotal,
        paymentStatus: form.paymentStatus,
        invoiceGenerated: true
      };
      setBookings(prev => [newBooking, ...prev]);
      onAddToast(`تم بنجاح حجز ملعب/صالة باسم "${form.renterName}" وجدولة الحصة!`, 'success');
    }
    setIsBookingModalOpen(false);
  };

  const handleDeleteBooking = (id: string, renter: string) => {
    if (window.confirm(`هل أنت متأكد من إلغاء وحذف حجز العميل "${renter}" نهائياً من النظام؟`)) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: 'ملغي' } : b));
      onAddToast(`تم إلغاء حجز العميل "${renter}" بنجاح.`, 'info');
    }
  };

  const handleOpenAddModal = () => {
    setCurrentBooking(null);
    setForm({
      courtName: 'الملعب العشبي أ (كرة قدم)',
      renterName: '',
      renterPhone: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '04:00 م - 06:00 م',
      ratePerHour: 150,
      totalHours: 2,
      paymentStatus: 'مدفوع'
    });
    setIsBookingModalOpen(true);
  };

  const handleOpenEditModal = (b: RentalBooking) => {
    setCurrentBooking(b);
    setForm({
      courtName: b.courtName,
      renterName: b.renterName,
      renterPhone: b.renterPhone,
      date: b.date,
      timeSlot: b.timeSlot,
      ratePerHour: b.ratePerHour,
      totalHours: b.totalHours,
      paymentStatus: b.paymentStatus
    });
    setIsBookingModalOpen(true);
  };

  const exportBookingsList = () => {
    const headers = 'رقم الحجز,الملعب/القاعة,اسم المستأجر,الهاتف,التاريخ,التوقيت,سعر الساعة,الساعات,المبلغ الإجمالي,حالة الدفع\n';
    const rows = bookings.map(b => `${b.id},${b.courtName},${b.renterName},${b.renterPhone},${b.date},${b.timeSlot},${b.ratePerHour},${b.totalHours},${b.totalAmount},${b.paymentStatus}`).join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_حجوزات_وإيجارات_الملاعب_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onAddToast('تم تصدير ملف حجوزات الملاعب لبرنامج Excel بنجاح!', 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة وأزرار التحكم */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Building className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            إدارة إيجارات وحجوزات الملاعب والقاعات
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            تنظيم حجوزات صالات التدريب والملاعب العشبية بالأكاديمية للجهات الخارجية والمجموعات الخاصة مع إصدار الفواتير الفورية.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            حجز ملعب جديد
          </button>
          <button
            onClick={exportBookingsList}
            className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all"
          >
            <Download className="w-4 h-4" />
            تصدير الحجوزات
          </button>
        </div>
      </div>

      {/* بطاقات المؤشرات المالية الفعالة لإيجار الملاعب */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">إجمالي الحصص المحجوزة المعتمدة</span>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{stats.totalCount} حجز مجدول</h4>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">العوائد المالية المكتملة المقبوضة</span>
            <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{stats.totalRevenue.toLocaleString()} ر.س</h4>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">مبالغ حجوزات معلقة (في الانتظار)</span>
            <h4 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">{stats.pendingAmount.toLocaleString()} ر.س</h4>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
            <BadgeDollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* تبويبات التنقل */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => { triggerLoading(); setActiveTab('bookings'); }}
          className={`px-4 py-3 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'bookings' 
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          قائمة الحجوزات النشطة
        </button>

        <button
          onClick={() => { triggerLoading(); setActiveTab('calendar'); }}
          className={`px-4 py-3 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'calendar' 
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          مخطط الجدول والتقويم الأسبوعي للملاعب
        </button>
      </div>

      {/* 2. تبويب الحجوزات */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم العميل أو رقم هاتفه..."
                className="w-full pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500">تصفية حسب الملعب:</span>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                <option value="الكل">الكل</option>
                {courts.map((court, i) => (
                  <option key={i} value={court}>{court}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3.5">معرف الحجز</th>
                    <th className="p-3.5">الملعب / الصالة</th>
                    <th className="p-3.5">العميل المستأجر</th>
                    <th className="p-3.5">تاريخ الحجز واليوم</th>
                    <th className="p-3.5">الفترة الزمنية</th>
                    <th className="p-3.5">المبلغ الكلي</th>
                    <th className="p-3.5">حالة السداد</th>
                    <th className="p-3.5 text-center">الفواتير والإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  {filteredBookings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-3.5 font-mono text-[10px] text-slate-400">{item.id}</td>
                      <td className="p-3.5 text-slate-800 dark:text-slate-100">{item.courtName}</td>
                      <td className="p-3.5">
                        <span className="block text-slate-700 dark:text-slate-200">{item.renterName}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium block">{item.renterPhone}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{item.date}</td>
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">{item.timeSlot}</td>
                      <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">{item.totalAmount} ر.س</td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black ${
                          item.paymentStatus === 'مدفوع' ? 'bg-emerald-50 text-emerald-600' :
                          item.paymentStatus === 'قيد الانتظار' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setInvoiceTarget(item)}
                            className="flex items-center gap-0.5 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            فاتورة
                          </button>
                          <span className="w-[1px] h-4 bg-slate-100 dark:bg-slate-800"></span>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(item.id, item.renterName)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-slate-400 font-bold">
                        لا يوجد أي حجز ملاعب مسجل حالياً يطابق التصفية.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. تبويب تقويم الملاعب والجدول الأسبوعي المباشر */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">مخطط الحجوزات الزمني الأسبوعي للملاعب (Live Time Grid)</h3>
            <p className="text-[10px] text-slate-400">متابعة دقيقة لنسب إشغال صالات التدريب ومواعيد اللعب لضمان تلافي التعارض أو الازدحام.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 font-bold text-xs">
            {courts.map((courtName, idx) => {
              const courtBookings = bookings.filter(b => b.courtName === courtName && b.paymentStatus !== 'ملغي');
              return (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-indigo-600 dark:text-indigo-400 text-[11px] font-black leading-snug">{courtName}</h4>
                    <span className="text-[9px] text-slate-400 block font-normal">عدد حجوزات الملعب: {courtBookings.length} حجز</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-1">
                    {courtBookings.map((b, i) => (
                      <div key={i} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] space-y-1">
                        <div className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                          <span>{b.renterName}</span>
                          <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 rounded font-black">{b.totalAmount} ر.س</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <span>{b.timeSlot}</span>
                        </div>
                        <div className="text-[8px] text-indigo-400 font-mono">{b.date}</div>
                      </div>
                    ))}
                    {courtBookings.length === 0 && (
                      <div className="h-full flex items-center justify-center p-6 text-center text-slate-300 dark:text-slate-600 italic text-[10px]">
                        الملعب متاح بالكامل (شاغر)
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setForm(prev => ({ ...prev, courtName }));
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[9px] font-black transition-all cursor-pointer mt-2"
                  >
                    حجز سريع للملعب
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* حوار طباعة فاتورة الإيجار للعميل (Rental Invoice Print) */}
      {/* ==================================================== */}
      {invoiceTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setInvoiceTarget(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="invoice-print-area" className="p-4 border border-slate-200 rounded-xl space-y-6">
              {/* الترويسة الموحدة للاستخدام التجاري والـ ERP */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-xs font-black text-slate-800 dark:text-white">أكاديمية MK للتطوير والتدريب الرياضي</h1>
                  <p className="text-[8px] text-slate-400">العنوان: الرياض - حي المروج - الملاعب المركزية</p>
                  <p className="text-[8px] text-slate-400">الرقم الضريبي الموحد: 310293848300003</p>
                </div>
                <div className="text-left">
                  <h2 className="text-xs font-black text-emerald-600">فاتورة ضريبية مبسطة (إيجارات)</h2>
                  <p className="text-[8px] text-slate-400 font-mono">رقم الفاتورة: INV-{invoiceTarget.id}</p>
                  <p className="text-[8px] text-slate-400 font-mono">تاريخ الإصدار: {invoiceTarget.date}</p>
                </div>
              </div>

              {/* بيانات المستأجر */}
              <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-[8px] text-slate-400 block">العميل المستأجر / المستلم:</span>
                  <span className="text-slate-900 dark:text-slate-100 text-xs">{invoiceTarget.renterName}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block">جوال العميل:</span>
                  <span className="font-mono">{invoiceTarget.renterPhone}</span>
                </div>
              </div>

              {/* بنود الفاتورة والأسعار بالتفصيل والـ VAT */}
              <table className="w-full text-right text-[10px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <th className="p-2">البند / المرفق الرياضي</th>
                    <th className="p-2 text-center">المدة بالساعات</th>
                    <th className="p-2 text-center">سعر الساعة</th>
                    <th className="p-2 text-left">المبلغ الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-2">{invoiceTarget.courtName} - مواعيد الحصص المجدولة بالتنسيق المسبق</td>
                    <td className="p-2 text-center font-mono">{invoiceTarget.totalHours} ساعة</td>
                    <td className="p-2 text-center font-mono">{invoiceTarget.ratePerHour} ر.س</td>
                    <td className="p-2 text-left font-mono">{(invoiceTarget.ratePerHour * invoiceTarget.totalHours).toFixed(2)} ر.س</td>
                  </tr>
                </tbody>
              </table>

              {/* ملخص المبالغ والضريبة */}
              <div className="pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-600 dark:text-slate-300 space-y-1.5 w-1/2 mr-auto text-left">
                <div className="flex justify-between">
                  <span>المبلغ الخاضع للضريبة:</span>
                  <span className="font-mono">{(invoiceTarget.totalAmount * 0.85).toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span className="font-mono">{(invoiceTarget.totalAmount * 0.15).toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-xs text-slate-800 dark:text-slate-100 border-t border-slate-100 pt-1.5 font-black">
                  <span>المجموع النهائي الشامل للضريبة:</span>
                  <span className="font-mono">{invoiceTarget.totalAmount.toFixed(2)} ر.س</span>
                </div>
              </div>

              {/* رمز QR الضريبية الفاتورة والختم */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-[9px] text-slate-400">
                  * تعتبر هذه الفاتورة سند قبض رسمي بالمبلغ الموضح في حال كانت حالة السداد (مدفوع).
                </div>
                {/* تمثيل رمز الـ QR والباركود الفاتورة */}
                <div className="p-1 bg-white rounded border border-slate-200">
                  <div className="grid grid-cols-4 gap-[2px] w-12 h-12 bg-white">
                    {[
                      [1,0,1,1], [1,1,0,1], [0,1,1,1], [1,1,0,0]
                    ].flat().map((b, i) => (
                      <div key={i} className={`rounded-xs ${b ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => {
                  window.print();
                  onAddToast(`تم إرسال فاتورة العميل ${invoiceTarget.renterName} لآلة الفواتير الحرارية بنجاح!`, 'success');
                }}
                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                طباعة الفاتورة الفورية
              </button>
              <button
                onClick={() => setInvoiceTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* حوار إضافة / تعديل حجز (Add/Edit Booking Modal) */}
      {/* ==================================================== */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-indigo-500" />
              {currentBooking ? 'تعديل بيانات حجز الملعب' : 'حجز ملعب/صالة تدريبية للعملاء'}
            </h3>

            <form onSubmit={handleSaveBooking} className="space-y-4 text-xs font-bold">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 mb-1">اسم الملعب أو القاعة المستهدفة *</label>
                  <select
                    value={form.courtName}
                    onChange={(e) => setForm({ ...form, courtName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    {courts.map((court, i) => (
                      <option key={i} value={court}>{court}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">اسم العميل المستأجر *</label>
                    <input
                      type="text"
                      value={form.renterName}
                      onChange={(e) => setForm({ ...form, renterName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                      placeholder="مثال: أ. مساعد الحربي"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">رقم جوال العميل *</label>
                    <input
                      type="text"
                      value={form.renterPhone}
                      onChange={(e) => setForm({ ...form, renterPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono font-bold"
                      placeholder="05xxxxxxxx"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">تاريخ الحجز المبرم *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">فترة الحجز بالساعات اليومية *</label>
                    <select
                      value={form.timeSlot}
                      onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                    >
                      <option value="04:00 م - 06:00 م">04:00 م - 06:00 م</option>
                      <option value="06:00 م - 08:00 م">06:00 م - 08:00 م</option>
                      <option value="08:00 م - 10:00 م">08:00 م - 10:00 م</option>
                      <option value="05:00 م - 08:00 م">05:00 م - 08:00 م</option>
                      <option value="09:00 م - 11:00 م">09:00 م - 11:00 م</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">سعر إيجار الساعة الملعب (ر.س) *</label>
                    <input
                      type="number"
                      value={form.ratePerHour}
                      onChange={(e) => setForm({ ...form, ratePerHour: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono font-bold"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">إجمالي الساعات المحجوزة *</label>
                    <input
                      type="number"
                      value={form.totalHours}
                      onChange={(e) => setForm({ ...form, totalHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-mono font-bold"
                      min="1"
                      step="0.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">حالة دفع وحساب الحجز *</label>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="مدفوع">مدفوع (نقداً بالصندوق أو تحويل بنكي فوري)</option>
                    <option value="قيد الانتظار">قيد الانتظار (دفع عند الحضور والمطابقة)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  {currentBooking ? 'حفظ التعديلات' : 'تأكيد وحجز الملعب'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
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
