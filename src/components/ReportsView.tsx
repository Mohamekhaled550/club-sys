/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, PieChart, Activity, DollarSign, Calendar, ShieldAlert,
  Download, Printer, Search, Filter, Info, FileText, ArrowUpRight, ArrowDownRight,
  UserCheck, TrendingUp, HelpCircle, GraduationCap, HardHat, Warehouse, 
  ChevronRight, Sparkles, RefreshCw
} from 'lucide-react';

interface ReportType {
  id: string;
  name: string;
  category: 'sports' | 'finance' | 'hr' | 'operations';
  description: string;
}

export const ReportsView: React.FC = () => {
  // 1. تعريف التقارير العشرة المطلوبة بالكامل
  const reportsList: ReportType[] = [
    { id: 'rep-players', name: 'تقرير تفصيلي للاعبين وتوزيع المستويات', category: 'sports', description: 'يحلل توزيع اللاعبين المشتركين حسب الرياضة، الفئة العمرية، والمستوى الفني الحالي.' },
    { id: 'rep-subscriptions', name: 'تقرير الاشتراكات والعوائد الدورية', category: 'finance', description: 'إحصاءات شاملة عن باقات الاشتراكات الفعالة، والاشتراكات المكتملة والمجددة حديثاً.' },
    { id: 'rep-coaches', name: 'تقرير أداء وتقييم المدربين الكباتن', category: 'hr', description: 'متابعة تقييمات اللاعبين للمدربين، عدد الساعات التدريبية، والالتزام بالجدول.' },
    { id: 'rep-employees', name: 'مسيرات الرواتب والمستحقات والجزاءات للموظفين', category: 'hr', description: 'كشف مالي تفصيلي برواتب الموظفين الأساسية، السلف المصروفة، والجزاءات المستقطعة.' },
    { id: 'rep-attendance', name: 'تقرير الحضور والغياب الأسبوعي العام', category: 'sports', description: 'تتبع نسب الحضور والالتزام لكل من اللاعبين والموظفين والمدربين مقارنة بالخطة.' },
    { id: 'rep-inventory', name: 'حالة جرد المخازن وعهود الأجهزة الرياضية', category: 'operations', description: 'تقرير جرد الأصناف، كميات الحدود الحرجة، وتفاصيل الأصول المسندة كعهدة للمدربين.' },
    { id: 'rep-revenues', name: 'مصادر الإيرادات والتوريدات النقدية للبلدية', category: 'finance', description: 'تفصيل الإيرادات المحصلة من الاشتراكات، إيجار الملاعب، والمبيعات الترفيهية.' },
    { id: 'rep-expenses', name: 'تقرير المصروفات والمدفوعات التشغيلية', category: 'finance', description: 'تحليل تكاليف الصيانة، المشتريات، الفواتير العامة، ورواتب الكادر التدريبي.' },
    { id: 'rep-profits', name: 'الموازنة العامة والأرباح التشغيلية (نت الربح)', category: 'finance', description: 'مقارنة مالية عليا بين الإيرادات الإجمالية والمصروفات لاستنتاج العائد الصافي.' },
    { id: 'rep-rentals', name: 'تقرير إشغال الملاعب وإيجارات المرفقات والصلات', category: 'operations', description: 'إحصاءات حجز الملاعب العشبية والقاعة المغلقة، الساعات النشطة، والعملاء المترددين.' },
  ];

  // 2. الحالات الداخلية والفرز
  const [selectedReportId, setSelectedReportId] = useState('rep-players');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'الكل' | 'sports' | 'finance' | 'hr' | 'operations'>('الكل');

  // البيانات الوهمية المتكاملة والمترابطة لكل تقرير لتمكين عمليات البحث والتصفية والتصدير
  const reportData = useMemo(() => {
    return {
      // أ) تقرير اللاعبين
      players: [
        { name: 'يوسف العتيبي', sport: 'كرة قدم', level: 'متقدم', coach: 'الكابتن طارق السعيد', joinDate: '2026-01-10', active: 'نشط' },
        { name: 'عبدالله القحطاني', sport: 'تنس أرضي', level: 'مبتدئ', coach: 'الكابتن أحمد ممدوح', joinDate: '2026-03-15', active: 'نشط' },
        { name: 'فهد المطيري', sport: 'سباحة', level: 'متوسط', coach: 'الكابتن ياسر القحطاني', joinDate: '2026-02-20', active: 'نشط' },
        { name: 'سلطان الدوسري', sport: 'كرة سلة', level: 'متقدم', coach: 'الكابتن عادل الدوسري', joinDate: '2026-05-01', active: 'نشط' },
        { name: 'سلمان العتيبي', sport: 'كاراتيه', level: 'متوسط', coach: 'الكابتن يوسف المعيوف', joinDate: '2026-04-12', active: 'نشط' },
      ],
      // ب) تقرير الاشتراكات
      subscriptions: [
        { type: 'الباقة الذهبية (كرة قدم)', price: 500, count: 120, total: 60000, duration: '3 أشهر' },
        { type: 'الباقة الفضية (تنس أرضي)', price: 350, count: 85, total: 29750, duration: 'شهري' },
        { type: 'باقة النخبة (كاراتيه ودفاع)', price: 600, count: 64, total: 38400, duration: '3 أشهر' },
        { type: 'باقة اللياقة والسباحة الفاخرة', price: 400, count: 98, total: 39200, duration: 'شهري' },
      ],
      // ج) تقرير المدربين
      coaches: [
        { name: 'الكابتن طارق السعيد', sport: 'كرة قدم', rate: 4.8, hours: 96, salary: 7500 },
        { name: 'الكابتن أحمد ممدوح', sport: 'تنس أرضي', rate: 4.9, hours: 80, salary: 6800 },
        { name: 'الكابتن عادل الدوسري', sport: 'كرة سلة', rate: 4.5, hours: 75, salary: 6200 },
        { name: 'الكابتن ياسر القحطاني', sport: 'لياقة وسباحة', rate: 4.7, hours: 110, salary: 8000 },
        { name: 'الكابتن يوسف المعيوف', sport: 'كاراتيه', rate: 4.6, hours: 64, salary: 5900 },
      ],
      // د) تقرير الموظفين
      employees: [
        { name: 'م. خالد السليم', role: 'مدير النظام التنفيذي', salary: 12000, loans: 1500, deduction: 0, net: 10500 },
        { name: 'أ. سارة الماجد', role: 'مسؤولة العلاقات والاستقبال', salary: 4500, loans: 0, deduction: 150, net: 4350 },
        { name: 'أ. فهد الشمري', role: 'مسؤول العمليات والمشتريات', salary: 5500, loans: 400, deduction: 0, net: 5100 },
        { name: 'أ. رانية الفيصل', role: 'محاسبة الأكاديمية المالية', salary: 6500, loans: 0, deduction: 0, net: 6500 },
      ],
      // هـ) تقرير الحضور والالتزام
      attendance: [
        { group: 'أشبال كرة القدم - أ', totalCount: 22, presentRate: '94%', absentCount: 1, date: '2026-06-25' },
        { group: 'مبتدئين التنس الأرضي', totalCount: 15, presentRate: '88%', absentCount: 2, date: '2026-06-25' },
        { group: 'متقدمين الكاراتيه وسلسلة القتال', totalCount: 18, presentRate: '96%', absentCount: 0, date: '2026-06-26' },
        { group: 'منتخب السلة للشباب', totalCount: 20, presentRate: '91%', absentCount: 2, date: '2026-06-26' },
      ],
      // و) تقرير المخزن والعهود
      inventory: [
        { item: 'ساعة ذكية Garmin قياس اللياقة', category: 'الأجهزة الإلكترونية', stock: 12, minStock: 5, status: 'ممتاز', assignedCoach: 'الكابتن أحمد ممدوح' },
        { item: 'كرة قدم أديداس كأس العالم الأصلية', category: 'الأدوات الرياضية', stock: 45, minStock: 15, status: 'جيد', assignedCoach: 'الكابتن طارق السعيد' },
        { item: 'بدلات سباق سباحة مقاومة للماء', category: 'الملابس والزي', stock: 30, minStock: 10, status: 'ممتاز', assignedCoach: 'الكابتن ياسر القحطاني' },
        { item: 'مضارب تنس احترافية ولسون', category: 'أدوات الملاعب', stock: 18, minStock: 6, status: 'ممتاز', assignedCoach: 'الكابتن أحمد ممدوح' },
      ],
      // ز) تقرير الإيرادات
      revenues: [
        { source: 'اشتراكات اللاعبين المباشرة', category: 'الاشتراكات المعتمدة', amount: 167350, date: '2026-06-26' },
        { source: 'عقود إيجار الملاعب والقاعة للشركات', category: 'إيجارات المرافق', amount: 48900, date: '2026-06-26' },
        { source: 'مبيعات الكافيتريا والمتجر الرياضي الخاص', category: 'مبيعات ترفيهية والمقصف', amount: 21450, date: '2026-06-25' },
        { source: 'رسوم المعسكرات والبطولات الصيفية مضاف', category: 'مهرجانات وفعاليات', amount: 35000, date: '2026-06-24' },
      ],
      // ح) تقرير المصروفات
      expenses: [
        { target: 'مسيرات رواتب المدربين والموظفين الفنية', category: 'بند الأجور والرواتب', amount: 56900, date: '2026-06-26' },
        { target: 'فواتير المياه والكهرباء والإنترنت للمنشأة', category: 'بند الخدمات العامة', amount: 8400, date: '2026-06-25' },
        { target: 'أقساط صيانة الفلترة للمسبح والملاعب', category: 'بند صيانة المنشآت', amount: 12500, date: '2026-06-22' },
        { target: 'شراء كرات ومستلزمات تدريبية متفرقة', category: 'بند مشتريات المستودعات', amount: 6800, date: '2026-06-20' },
      ],
      // ط) تقرير الأرباح والموازنة التشغيلية
      profits: [
        { month: 'يناير 2026', totalRevenues: 198000, totalExpenses: 78000, netProfit: 120000, profitMargin: '60.6%' },
        { month: 'فبراير 2026', totalRevenues: 210000, totalExpenses: 82000, netProfit: 128000, profitMargin: '60.9%' },
        { month: 'مارس 2026', totalRevenues: 235000, totalExpenses: 89000, netProfit: 146000, profitMargin: '62.1%' },
        { month: 'أبريل 2026', totalRevenues: 242000, totalExpenses: 91000, netProfit: 151000, profitMargin: '62.3%' },
        { month: 'مايو 2026', totalRevenues: 258000, totalExpenses: 94000, netProfit: 164000, profitMargin: '63.5%' },
        { month: 'يونيو 2026 (حتى اليوم)', totalRevenues: 272700, totalExpenses: 84600, netProfit: 188100, profitMargin: '68.9%' },
      ],
      // ي) تقرير إيجارات الملاعب
      rentals: [
        { court: 'الملعب العشبي أ (كرة قدم)', bookingsCount: 48, totalHours: 96, generatedRevenue: 14400 },
        { court: 'الملعب العشبي ب (كرة قدم سداسي)', bookingsCount: 32, totalHours: 64, generatedRevenue: 8320 },
        { court: 'القاعة المغلقة ب (كرة السلة)', bookingsCount: 41, totalHours: 82, generatedRevenue: 16400 },
        { court: 'ملعب التنس الترابي أ', bookingsCount: 26, totalHours: 39, generatedRevenue: 4680 },
        { court: 'صالة ألعاب القتال والدفاع عن النفس', bookingsCount: 15, totalHours: 45, generatedRevenue: 4500 },
      ]
    };
  }, []);

  // تصفية قائمة التقارير حسب الفئة النشطة والبحث بالاسم
  const filteredReportsList = useMemo(() => {
    return reportsList.filter(rep => {
      const matchCategory = activeCategory === 'الكل' || rep.category === activeCategory;
      const matchSearch = rep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rep.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [reportsList, searchQuery, activeCategory]);

  // إيجاد التقرير المحدد حالياً لعرض بياناته والرسوم البيانية المخصصة له
  const currentReportObj = useMemo(() => {
    return reportsList.find(r => r.id === selectedReportId) || reportsList[0];
  }, [reportsList, selectedReportId]);

  // تصدير التقرير الفعال لملف Excel/CSV
  const handleExportSelectedReport = () => {
    let headers = '';
    let rows = '';

    if (selectedReportId === 'rep-players') {
      headers = 'الاسم,الرياضة,المستوى,المدرب,تاريخ الالتحاق,الحالة\n';
      rows = reportData.players.map(p => `${p.name},${p.sport},${p.level},${p.coach},${p.joinDate},${p.active}`).join('\n');
    } else if (selectedReportId === 'rep-subscriptions') {
      headers = 'الباقة الرياضية,سعر الاشتراك,عدد المشتركين,المبيعات الإجمالية,المدة\n';
      rows = reportData.subscriptions.map(s => `${s.type},${s.price},${s.count},${s.total},${s.duration}`).join('\n');
    } else if (selectedReportId === 'rep-coaches') {
      headers = 'اسم الكابتن,الرياضة,تقييم المدرب,الساعات التدريبية,الراتب الأساسي\n';
      rows = reportData.coaches.map(c => `${c.name},${c.sport},${c.rate},${c.hours},${c.salary}`).join('\n');
    } else if (selectedReportId === 'rep-employees') {
      headers = 'اسم الموظف,الوظيفة والمسمى,الراتب,السلف المخصومة,الجزاءات,الراتب الصافي\n';
      rows = reportData.employees.map(e => `${e.name},${e.role},${e.salary},${e.loans},${e.deduction},${e.net}`).join('\n');
    } else if (selectedReportId === 'rep-attendance') {
      headers = 'المجموعة التدريبية,العدد الكلي,نسبة الحضور,الغيابات,التاريخ\n';
      rows = reportData.attendance.map(a => `${a.group},${a.totalCount},${a.presentRate},${a.absentCount},${a.date}`).join('\n');
    } else if (selectedReportId === 'rep-inventory') {
      headers = 'الصنف الرياضي,الفئة والمجموعة,الرصيد الحالي,حد الطلب الحرج,الوضعية الفنية,توقيع المستلم\n';
      rows = reportData.inventory.map(i => `${i.item},${i.category},${i.stock},${i.minStock},${i.status},${i.assignedCoach}`).join('\n');
    } else if (selectedReportId === 'rep-revenues') {
      headers = 'مصدر الإيراد,المجموعة الفرعية,المبلغ المحصل,تاريخ التوريد\n';
      rows = reportData.revenues.map(r => `${r.source},${r.category},${r.amount},${r.date}`).join('\n');
    } else if (selectedReportId === 'rep-expenses') {
      headers = 'بند الصرف المستهدف,التصنيف,المبلغ المصروف,تاريخ السداد المالي\n';
      rows = reportData.expenses.map(ex => `${ex.target},${ex.category},${ex.amount},${ex.date}`).join('\n');
    } else if (selectedReportId === 'rep-profits') {
      headers = 'الشهر المالي,إجمالي الإيرادات,إجمالي المصروفات,العائد والربح الصافي,هامش الربح التشغيلي\n';
      rows = reportData.profits.map(p => `${p.month},${p.totalRevenues},${p.totalExpenses},${p.netProfit},${p.profitMargin}`).join('\n');
    } else if (selectedReportId === 'rep-rentals') {
      headers = 'الملعب/القاعة,عدد مرات الحجز,إجمالي الساعات,إيراد الإيجار الإجمالي\n';
      rows = reportData.rentals.map(rn => `${rn.court},${rn.bookingsCount},${rn.totalHours},${rn.generatedRevenue}`).join('\n');
    }

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_${currentReportObj.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSelectedReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* الترويسة المتميزة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            مركز التقارير الذكية ولوحات الـ BI المتقدمة
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            مستندات كشوفات وتحليلات بيانية شاملة تغطي الأكاديمية بالكامل، جاهزة للطباعة والتصدير والربط التقني اللاحق.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportSelectedReport}
            className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            تصدير التقرير الفعال (Excel)
          </button>
          <button
            onClick={handlePrintSelectedReport}
            className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all"
          >
            <Printer className="w-4 h-4" />
            طباعة كشف A4
          </button>
        </div>
      </div>

      {/* لوحة التقسيم الجانبي لجميع التقارير الـ 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* العمود الجانبي: اختيار نوع التقرير من القائمة */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-400">قائمة المستندات والتقارير المتاحة</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالتقارير..."
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold"
            />
          </div>

          <div className="flex flex-wrap gap-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            {[
              { id: 'الكل', name: 'الكل' },
              { id: 'sports', name: 'الرياضية' },
              { id: 'finance', name: 'المالية' },
              { id: 'hr', name: 'الموارد البشري' },
              { id: 'operations', name: 'العمليات' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-2 py-1.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredReportsList.map((rep) => {
              const isSelected = rep.id === selectedReportId;
              return (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`w-full text-right p-3 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-r-4 border-indigo-600 text-indigo-700 dark:text-indigo-400 font-extrabold' 
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div className="text-xs leading-normal">
                    <span className="block font-black">{rep.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{rep.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* العمود الأساسي: عرض تقرير الـ BI مع رسومات بيانية تفاعلية SVG */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-black">
                  تقرير {currentReportObj.category === 'sports' ? 'إدارة الأنشطة والتدريب' : currentReportObj.category === 'finance' ? 'الإدارة المالية والموازنة' : currentReportObj.category === 'hr' ? 'شؤون الموظفين والمدربين' : 'مخازن وعقود تشغيلية'}
                </span>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1">{currentReportObj.name}</h3>
              </div>
              <p className="text-[10px] text-slate-400 max-w-xs text-left">مستند إلكتروني رسمي ومؤتمت تم توليده في {new Date().toLocaleDateString()}</p>
            </div>

            {/* ========================================== */}
            {/* أ) شاشات الرسوم البيانية الخمسة (5 Beautiful SVG Charts based on state) */}
            {/* ========================================== */}
            
            {/* 1. مخطط الكعكة الدائرية المغلقة (Pie Chart) - تقرير اللاعبين وتوزيع مستوياتهم */}
            {selectedReportId === 'rep-players' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl">
                <div className="md:col-span-4 flex justify-center relative">
                  <svg width="120" height="120" viewBox="0 0 42 42" className="transform -rotate-90">
                    {/* مستوى مبتدئ (35%) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="6" strokeDasharray="35 65" strokeDashoffset="100" />
                    {/* مستوى متوسط (40%) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="65" />
                    {/* مستوى متقدم (25%) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="25" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-black text-slate-700 dark:text-slate-300">
                    <span>100%</span>
                  </div>
                </div>
                <div className="md:col-span-8 text-xs font-bold space-y-2 text-slate-600 dark:text-slate-400">
                  <h4 className="font-extrabold text-slate-800 dark:text-white">توزيع اللاعبين حسب المستويات الفنية:</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <span className="block text-purple-600">مبتدئ (35%)</span>
                      <strong className="block mt-1 font-mono">112 لاعب</strong>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <span className="block text-blue-600">متوسط (40%)</span>
                      <strong className="block mt-1 font-mono">128 لاعب</strong>
                    </div>
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                      <span className="block text-emerald-600">متقدم (25%)</span>
                      <strong className="block mt-1 font-mono">80 لاعب</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. مخطط الأعمدة الرأسية المتجاورة (Bar Chart) - إحصاءات الاشتراكات والدخل الكلي للباقات */}
            {selectedReportId === 'rep-subscriptions' && (
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">الدخل التراكمي حسب نوع الباقات الرياضية (ر.س)</h4>
                <div className="flex items-end justify-between h-36 px-4">
                  {[
                    { name: 'كرة قدم', total: 60000, color: 'bg-indigo-500' },
                    { name: 'تنس أرضي', total: 29750, color: 'bg-sky-500' },
                    { name: 'كاراتيه', total: 38400, color: 'bg-purple-500' },
                    { name: 'سباحة', total: 39200, color: 'bg-emerald-500' },
                  ].map((s, idx) => {
                    const height = (s.total / 60000) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group">
                        <span className="text-[9px] font-mono font-bold text-slate-500 group-hover:text-indigo-600">{s.total.toLocaleString()}</span>
                        <div style={{ height: `${height * 0.8}px` }} className={`w-8 rounded-t-lg transition-all ${s.color} group-hover:opacity-80`} />
                        <span className="text-[10px] text-slate-400 font-bold mt-1">{s.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. مخطط خطي مموج (Line Chart) - حضور اللاعبين ومعدلات الالتزام التدريبي الأسبوعية */}
            {selectedReportId === 'rep-attendance' && (
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">الالتزام ونسبة الحضور اليومية لمجموعات الأكاديمية</h4>
                <div className="flex items-center justify-center p-2">
                  <svg viewBox="0 0 300 80" className="w-full h-24 overflow-visible">
                    <line x1="0" y1="40" x2="300" y2="40" stroke="#cbd5e1" strokeDasharray="3 3" className="dark:stroke-slate-700" />
                    {/* مسار الحضور */}
                    <polyline fill="none" stroke="#6366f1" strokeWidth="2.5" points="10,60 70,25 130,45 190,15 250,55" strokeLinecap="round" />
                    <circle cx="10" cy="60" r="3" fill="#6366f1" />
                    <circle cx="70" cy="25" r="3" fill="#6366f1" />
                    <circle cx="130" cy="45" r="3" fill="#6366f1" />
                    <circle cx="190" cy="15" r="3" fill="#6366f1" />
                    <circle cx="250" cy="55" r="3" fill="#6366f1" />
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 px-2 font-bold">
                  <span>السبت (85%)</span>
                  <span>الأحد (94%)</span>
                  <span>الإثنين (89%)</span>
                  <span>الثلاثاء (96%)</span>
                  <span>الأربعاء (87%)</span>
                </div>
              </div>
            )}

            {/* 4. مخطط الكعكة الدائرية المفرغة (Donut Chart) - توزيع عقود الملاعب والصالات المحجوزة */}
            {selectedReportId === 'rep-rentals' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl">
                <div className="md:col-span-4 flex justify-center relative">
                  <svg width="110" height="110" viewBox="0 0 42 42" className="transform -rotate-90">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="5" className="dark:stroke-slate-800" />
                    {/* إشغال كرة قدم (45%) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="5" strokeDasharray="45 55" strokeDashoffset="100" />
                    {/* إشغال كرة سلة (35%) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="5" strokeDasharray="35 65" strokeDashoffset="55" />
                    {/* إشغال تنس وملاكمة (20%) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="20" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] text-slate-400">
                    <span>مجموع الإيراد</span>
                    <strong className="text-slate-800 dark:text-white text-[11px] font-black">48K ر.س</strong>
                  </div>
                </div>
                <div className="md:col-span-8 text-xs font-bold space-y-1.5 text-slate-600 dark:text-slate-400">
                  <h4 className="font-extrabold text-slate-800 dark:text-white">إشغال الإيجارات حسب نوع المرفق الرياضي:</h4>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> الملعب العشبي أ وب</span>
                      <span className="font-mono text-slate-900 dark:text-white">22,720 ر.س (45%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> القاعة المغلقة ب (سلة)</span>
                      <span className="font-mono text-slate-900 dark:text-white">16,400 ر.س (35%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ملاعب التنس وصالات الدفاع</span>
                      <span className="font-mono text-slate-900 dark:text-white">9,180 ر.س (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. مخطط مساحي ممتد (Area Chart) - تطور صافي الأرباح والإيرادات والمصروفات التراكمية */}
            {(selectedReportId === 'rep-revenues' || selectedReportId === 'rep-expenses' || selectedReportId === 'rep-profits') && (
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">تطور صافي الأرباح التشغيلية والتوريدات (Area Index)</h4>
                  <div className="flex gap-2 text-[9px] font-bold">
                    <span className="text-indigo-600 font-extrabold">● الإيرادات</span>
                    <span className="text-rose-500 font-extrabold">● المصروفات</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 px-4 relative">
                  {[
                    { month: 'يناير', rev: 198, exp: 78 },
                    { month: 'فبراير', rev: 210, exp: 82 },
                    { month: 'مارس', rev: 235, exp: 89 },
                    { month: 'أبريل', rev: 242, exp: 91 },
                    { month: 'مايو', rev: 258, exp: 94 },
                    { month: 'يونيو', rev: 272, exp: 84 },
                  ].map((p, idx) => {
                    const revHeight = (p.rev / 280) * 100;
                    const expHeight = (p.exp / 280) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 relative group">
                        <div className="w-full flex justify-center items-end gap-1 h-20">
                          {/* عمود الإيرادات المساحي */}
                          <div style={{ height: `${revHeight}%` }} className="w-3 bg-indigo-600/30 group-hover:bg-indigo-600 rounded-t" />
                          {/* عمود المصروفات */}
                          <div style={{ height: `${expHeight}%` }} className="w-3 bg-rose-500/30 group-hover:bg-rose-500 rounded-t" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-500">{p.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* ب) جداول البيانات التفصيلية للتقارير الـ 10 */}
            {/* ========================================== */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Info className="w-4 h-4 text-indigo-500" />
                  قائمة البيانات والمستندات المصدرية المعتمدة للتقرير:
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400">تحديث تلقائي متاح</span>
              </div>

              <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                  
                  {/* جدول تقرير اللاعبين */}
                  {selectedReportId === 'rep-players' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">اسم اللاعب</th>
                          <th className="p-3">الرياضة</th>
                          <th className="p-3">المستوى</th>
                          <th className="p-3">المدرب</th>
                          <th className="p-3">تاريخ الالتحاق</th>
                          <th className="p-3">الوضعية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.players.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{p.name}</td>
                            <td className="p-3">{p.sport}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px]">{p.level}</span></td>
                            <td className="p-3 font-semibold text-slate-500">{p.coach}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-400">{p.joinDate}</td>
                            <td className="p-3"><span className="text-emerald-500">● {p.active}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير الاشتراكات */}
                  {selectedReportId === 'rep-subscriptions' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">الباقة الرياضية</th>
                          <th className="p-3">مدة الباقة</th>
                          <th className="p-3 text-center">عدد المشتركين</th>
                          <th className="p-3 text-center">سعر الباقة</th>
                          <th className="p-3 text-left">المبيعات الإجمالية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.subscriptions.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{s.type}</td>
                            <td className="p-3 text-slate-400">{s.duration}</td>
                            <td className="p-3 text-center font-mono text-indigo-600">{s.count} باقة</td>
                            <td className="p-3 text-center font-mono">{s.price} ر.س</td>
                            <td className="p-3 text-left font-mono text-emerald-600">{s.total.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير المدربين */}
                  {selectedReportId === 'rep-coaches' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">اسم الكابتن</th>
                          <th className="p-3">الرياضة المسؤولة</th>
                          <th className="p-3 text-center">تقييم الأداء</th>
                          <th className="p-3 text-center">ساعات التمرين</th>
                          <th className="p-3 text-left">الراتب الأساسي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.coaches.map((c, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{c.name}</td>
                            <td className="p-3 text-slate-500">{c.sport}</td>
                            <td className="p-3 text-center font-mono text-amber-500">★ {c.rate} / 5</td>
                            <td className="p-3 text-center font-mono text-indigo-600">{c.hours} ساعة</td>
                            <td className="p-3 text-left font-mono">{c.salary.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير الموظفين والرواتب */}
                  {selectedReportId === 'rep-employees' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">اسم الموظف</th>
                          <th className="p-3">الوظيفة والمسمى</th>
                          <th className="p-3 text-center">الراتب الأساسي</th>
                          <th className="p-3 text-center">سلف مخصومة</th>
                          <th className="p-3 text-center">جزاءات</th>
                          <th className="p-3 text-left">الراتب الصافي المصروف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.employees.map((e, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{e.name}</td>
                            <td className="p-3 text-slate-400">{e.role}</td>
                            <td className="p-3 text-center font-mono">{e.salary.toLocaleString()} ر.س</td>
                            <td className="p-3 text-center font-mono text-rose-500">-{e.loans} ر.س</td>
                            <td className="p-3 text-center font-mono text-rose-500">-{e.deduction} ر.س</td>
                            <td className="p-3 text-left font-mono text-emerald-600">{e.net.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير الحضور */}
                  {selectedReportId === 'rep-attendance' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">المجموعة التدريبية</th>
                          <th className="p-3 text-center">العدد الكلي</th>
                          <th className="p-3 text-center">نسبة الحضور الفعالة</th>
                          <th className="p-3 text-center">الغيابات والاعتذارات</th>
                          <th className="p-3 text-left">تاريخ التدريب</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.attendance.map((a, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{a.group}</td>
                            <td className="p-3 text-center font-mono">{a.totalCount} مشترك</td>
                            <td className="p-3 text-center font-mono text-emerald-600">{a.presentRate}</td>
                            <td className="p-3 text-center font-mono text-rose-500">{a.absentCount} غياب</td>
                            <td className="p-3 text-left font-mono text-slate-400">{a.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير المخزن */}
                  {selectedReportId === 'rep-inventory' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">الصنف والمعدة الرياضية</th>
                          <th className="p-3">فئة المخزون</th>
                          <th className="p-3 text-center">الرصيد المتاح</th>
                          <th className="p-3 text-center">حد الطلب الحرج</th>
                          <th className="p-3 text-center">الحالة الفنية</th>
                          <th className="p-3 text-left">عهدة الكابتن</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.inventory.map((i, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{i.item}</td>
                            <td className="p-3 text-slate-400">{i.category}</td>
                            <td className="p-3 text-center font-mono text-indigo-600">{i.stock} قطعة</td>
                            <td className="p-3 text-center font-mono text-rose-500">{i.minStock} قطع</td>
                            <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px]">{i.status}</span></td>
                            <td className="p-3 text-left text-slate-500">{i.assignedCoach}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير الإيرادات */}
                  {selectedReportId === 'rep-revenues' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">مصدر وتوريد الدخل</th>
                          <th className="p-3">التصنيف المحاسبي</th>
                          <th className="p-3 text-center">تاريخ القيد المالي</th>
                          <th className="p-3 text-left">المبلغ المحصل</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.revenues.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{r.source}</td>
                            <td className="p-3 text-slate-400">{r.category}</td>
                            <td className="p-3 text-center font-mono text-slate-400">{r.date}</td>
                            <td className="p-3 text-left font-mono text-emerald-600">{r.amount.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير المصروفات */}
                  {selectedReportId === 'rep-expenses' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">بند وبوابة الصرف المعنية</th>
                          <th className="p-3">البوابة الفرعية</th>
                          <th className="p-3 text-center">تاريخ السداد المالي</th>
                          <th className="p-3 text-left">المبلغ المصروف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.expenses.map((ex, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{ex.target}</td>
                            <td className="p-3 text-slate-400">{ex.category}</td>
                            <td className="p-3 text-center font-mono text-slate-400">{ex.date}</td>
                            <td className="p-3 text-left font-mono text-rose-500">-{ex.amount.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير الأرباح والموازنة العامة */}
                  {selectedReportId === 'rep-profits' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">الشهر المالي والقيد</th>
                          <th className="p-3 text-center">إجمالي الإيرادات المقبوضة</th>
                          <th className="p-3 text-center">إجمالي المصروفات</th>
                          <th className="p-3 text-center">هامش الربح</th>
                          <th className="p-3 text-left">العائد والربح الصافي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.profits.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{p.month}</td>
                            <td className="p-3 text-center font-mono text-emerald-600">{p.totalRevenues.toLocaleString()} ر.س</td>
                            <td className="p-3 text-center font-mono text-rose-500">-{p.totalExpenses.toLocaleString()} ر.س</td>
                            <td className="p-3 text-center font-mono text-indigo-600">{p.profitMargin}</td>
                            <td className="p-3 text-left font-mono font-black text-slate-800 dark:text-white">{p.netProfit.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* جدول تقرير إيجارات الملاعب */}
                  {selectedReportId === 'rep-rentals' && (
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                          <th className="p-3">الملعب أو المرفق الرياضي</th>
                          <th className="p-3 text-center">عدد مرات الحجز الإجمالية</th>
                          <th className="p-3 text-center">مجموع الساعات الفعالة</th>
                          <th className="p-3 text-left">إجمالي عوائد الإيجار</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {reportData.rentals.map((rn, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3 text-slate-800 dark:text-slate-100">{rn.court}</td>
                            <td className="p-3 text-center font-mono text-indigo-600">{rn.bookingsCount} حجز رسمي</td>
                            <td className="p-3 text-center font-mono">{rn.totalHours} ساعة لعب</td>
                            <td className="p-3 text-left font-mono text-emerald-600">{rn.generatedRevenue.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
