/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Package, Tags, Truck, Plus, Search, Filter, AlertTriangle, 
  QrCode, Barcode, Printer, Download, Edit, Trash2, CheckCircle2, 
  ArrowLeftRight, ClipboardList, X, Eye, FileText, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';

interface WarehouseItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  minQuantity: number;
  location: string;
  price: number;
  lastUpdated: string;
}

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  status: 'نشط' | 'موقف';
}

interface TransactionRecord {
  id: string;
  itemName: string;
  type: 'صرف' | 'إدخال' | 'مرتجع' | 'تحويل';
  quantity: number;
  date: string;
  recipient: string;
  notes: string;
}

interface InventoryViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onAddToast }) => {
  // 1. البيانات الوهمية المترابطة والغنية (Mock Data)
  const [items, setItems] = useState<WarehouseItem[]>([
    { id: '1', name: 'كرة قدم نايكي قياس 5', sku: 'FB-NIKE-P5-001', category: 'كرات الرياضة', supplier: 'العالمية للرياضة', quantity: 45, minQuantity: 15, location: 'الرف أ-4', price: 180, lastUpdated: '2026-06-20' },
    { id: '2', name: 'كرة سلة سبالدينج جلدي', sku: 'BB-SPAL-GL-002', category: 'كرات الرياضة', supplier: 'مؤسسة أبطال الغد', quantity: 8, minQuantity: 10, location: 'الرف أ-6', price: 250, lastUpdated: '2026-06-21' },
    { id: '3', name: 'مخروط تدريب بلاستيكي 20سم', sku: 'CN-PLAS-20-003', category: 'أدوات تدريب', supplier: 'شركة الرياضة العربية', quantity: 120, minQuantity: 50, location: 'الرف ب-1', price: 12, lastUpdated: '2026-06-18' },
    { id: '4', name: 'حزام كاراتيه أسود قطني', sku: 'KB-COT-BK-004', category: 'ألبسة كاراتيه', supplier: 'مؤسسة أبطال الغد', quantity: 30, minQuantity: 10, location: 'الخزانة ج-3', price: 75, lastUpdated: '2026-06-25' },
    { id: '5', name: 'شبكة مرمى كرة قدم مزدوجة', sku: 'NT-GOAL-FB-005', category: 'تجهيزات ملاعب', supplier: 'العالمية للرياضة', quantity: 4, minQuantity: 6, location: 'مستودع الملاعب', price: 420, lastUpdated: '2026-06-15' },
    { id: '6', name: 'صافرة حكم فوكس 40 معدنية', sku: 'WH-FOX-MET-006', category: 'إكسسوارات', supplier: 'شركة الرياضة العربية', quantity: 25, minQuantity: 8, location: 'الدرج د-2', price: 45, lastUpdated: '2026-06-22' },
    { id: '7', name: 'سترة تدريب ملونة (أصفر)', sku: 'VT-TRA-YL-007', category: 'ألبسة وأحذية', supplier: 'شركة الرياضة العربية', quantity: 15, minQuantity: 40, location: 'الرف ب-5', price: 22, lastUpdated: '2026-06-24' },
    { id: '8', name: 'مضرب تنس طاولة الفراشة', sku: 'PT-BAT-BT-008', category: 'مضارب وتنس', supplier: 'العالمية للرياضة', quantity: 18, minQuantity: 10, location: 'الرف ج-1', price: 110, lastUpdated: '2026-06-19' },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S1', name: 'العالمية للرياضة', contactName: 'م. أحمد الشمراني', phone: '0501234567', email: 'shammari@worldsport.com', address: 'الرياض - الملز', category: 'تجهيزات ثقيلة وكرات', status: 'نشط' },
    { id: 'S2', name: 'شركة الرياضة العربية', contactName: 'أ. خالد التويجري', phone: '0559876543', email: 'khaled@arabiansports.com', address: 'جدة - شارع التحلية', category: 'أدوات وإكسسوارات تدريب', status: 'نشط' },
    { id: 'S3', name: 'مؤسسة أبطال الغد', contactName: 'أ. سامر المصري', phone: '0562211443', email: 'samer@heroes-of-tomorrow.com', address: 'الدمام - العزيزية', category: 'ألبسة رياضية ومعدات حماية', status: 'نشط' },
  ]);

  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    { id: 'TX-101', itemName: 'كرة سلة سبالدينج جلدي', type: 'صرف', quantity: 5, date: '2026-06-24', recipient: 'الكابتن محمد علي', notes: 'لتدريب فئة الشباب كرة سلة' },
    { id: 'TX-102', itemName: 'كرة قدم نايكي قياس 5', type: 'إدخل', quantity: 20, date: '2026-06-23', recipient: 'مستودع الأكاديمية الرئيسي', notes: 'شحنة توريد من العالمية للرياضة' },
    { id: 'TX-103', itemName: 'سترة تدريب ملونة (أصفر)', type: 'مرتجع', quantity: 10, date: '2026-06-25', recipient: 'الكابتن طارق السعيد', notes: 'إرجاع ستائر زائدة عن تمرين اليوم' },
  ]);

  const [categories] = useState<string[]>([
    'الكل', 'كرات الرياضة', 'أدوات تدريب', 'ألبسة كاراتيه', 'تجهيزات ملاعب', 'ألبسة وأحذية', 'مضارب وتنس', 'إكسسوارات'
  ]);

  // 2. الحالات والتنقل الداخلي
  const [activeTab, setActiveTab] = useState<'items' | 'suppliers' | 'transactions' | 'audit'>('items');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [loading, setLoading] = useState(false);

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 200);
  };

  // حالات Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<WarehouseItem | null>(null);
  
  // حالات عمليات الصرف والتحويل
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [opType, setOpType] = useState<'صرف' | 'مرتجع' | 'تحويل' | 'جرد'>('صرف');
  const [selectedItemForOp, setSelectedItemForOp] = useState<WarehouseItem | null>(null);
  const [opQty, setOpQty] = useState<number>(1);
  const [opRecipient, setOpRecipient] = useState('');
  const [opNotes, setOpNotes] = useState('');

  // نموذج إضافة/تعديل صنف
  const [itemForm, setItemForm] = useState({
    name: '',
    sku: '',
    category: 'كرات الرياضة',
    supplier: 'العالمية للرياضة',
    quantity: 10,
    minQuantity: 5,
    location: 'الرف أ-1',
    price: 100,
  });

  // نموذج المورد
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    category: 'أدوات وإكسسوارات تدريب',
    status: 'نشط' as 'نشط' | 'موقف'
  });

  // نموذج الباركود للطباعة والعرض
  const [activeBarcodeItem, setActiveBarcodeItem] = useState<WarehouseItem | null>(null);

  // حساب الإحصائيات السريعة للمخازن
  const stats = useMemo(() => {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const alertCount = items.filter(item => item.quantity <= item.minQuantity).length;
    return { totalQty, totalValue, alertCount };
  }, [items]);

  // فرز وتصفية الأصناف
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [items, search, selectedCategory]);

  const handleOpenItemModal = (item: WarehouseItem | null) => {
    if (item) {
      setCurrentItem(item);
      setItemForm({
        name: item.name,
        sku: item.sku,
        category: item.category,
        supplier: item.supplier,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
        location: item.location,
        price: item.price,
      });
    } else {
      setCurrentItem(null);
      setItemForm({
        name: '',
        sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        category: 'كرات الرياضة',
        supplier: 'العالمية للرياضة',
        quantity: 10,
        minQuantity: 5,
        location: 'الرف أ-1',
        price: 100,
      });
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim()) {
      onAddToast('يرجى إدخال اسم الصنف', 'error');
      return;
    }

    if (currentItem) {
      // تعديل صنف موجود
      setItems(prev => prev.map(item => item.id === currentItem.id ? { 
        ...item, 
        name: itemForm.name,
        sku: itemForm.sku,
        category: itemForm.category,
        supplier: itemForm.supplier,
        quantity: Number(itemForm.quantity),
        minQuantity: Number(itemForm.minQuantity),
        location: itemForm.location,
        price: Number(itemForm.price),
        lastUpdated: new Date().toISOString().split('T')[0]
      } : item));
      onAddToast(`تم تحديث الصنف ${itemForm.name} بنجاح!`, 'success');
    } else {
      // إضافة صنف جديد
      const newItem: WarehouseItem = {
        id: String(items.length + 1),
        name: itemForm.name,
        sku: itemForm.sku,
        category: itemForm.category,
        supplier: itemForm.supplier,
        quantity: Number(itemForm.quantity),
        minQuantity: Number(itemForm.minQuantity),
        location: itemForm.location,
        price: Number(itemForm.price),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [newItem, ...prev]);
      onAddToast(`تمت إضافة الصنف ${itemForm.name} الجديد بنجاح إلى المستودع!`, 'success');
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الصنف "${name}" من المستودع نهائياً؟`)) {
      setItems(prev => prev.filter(item => item.id !== id));
      onAddToast(`تم حذف الصنف "${name}" بنجاح.`, 'info');
    }
  };

  // فتح عمليات الصرف/المرتجع/التحويل
  const handleOpenOpModal = (item: WarehouseItem, type: 'صرف' | 'مرتجع' | 'تحويل' | 'جرد') => {
    setSelectedItemForOp(item);
    setOpType(type);
    setOpQty(1);
    setOpRecipient(type === 'صرف' ? 'الكابتن ' : 'أكاديمية MK الرئيسي');
    setOpNotes('');
    setIsOpModalOpen(true);
  };

  const handleExecuteOp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForOp) return;

    const qty = Number(opQty);
    if (qty <= 0) {
      onAddToast('يرجى تحديد كمية صحيحة أكبر من صفر', 'error');
      return;
    }

    if (opType === 'صرف' && selectedItemForOp.quantity < qty) {
      onAddToast(`لا تتوفر كمية كافية في المخزن! المتاح حالياً هو ${selectedItemForOp.quantity} فقط.`, 'error');
      return;
    }

    // تعديل كمية المخزون
    setItems(prev => prev.map(item => {
      if (item.id === selectedItemForOp.id) {
        let newQty = item.quantity;
        if (opType === 'صرف') newQty -= qty;
        else if (opType === 'مرتجع') newQty += qty;
        else if (opType === 'جرد') newQty = qty; // في حال الجرد، يتم ضبط الكمية الحالية لتساوي ما تم جرده
        return { ...item, quantity: newQty, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));

    // إضافة معاملة في الأرشيف
    const newTx: TransactionRecord = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      itemName: selectedItemForOp.name,
      type: opType,
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      recipient: opRecipient || 'أرشيف المخزن',
      notes: opNotes || `عملية ${opType} من إدارة المستودعات واللوجستيات`
    };

    setTransactions(prev => [newTx, ...prev]);
    onAddToast(`تم تنفيذ عملية ${opType} بنجاح وتسجيل المعاملة!`, 'success');
    setIsOpModalOpen(false);
  };

  // معالجة الموردين
  const handleOpenSupplierModal = (sup: Supplier | null) => {
    if (sup) {
      setCurrentSupplier(sup);
      setSupplierForm({
        name: sup.name,
        contactName: sup.contactName,
        phone: sup.phone,
        email: sup.email,
        address: sup.address,
        category: sup.category,
        status: sup.status
      });
    } else {
      setCurrentSupplier(null);
      setSupplierForm({
        name: '',
        contactName: '',
        phone: '',
        email: '',
        address: '',
        category: 'أدوات وإكسسوارات تدريب',
        status: 'نشط'
      });
    }
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) {
      onAddToast('يرجى إدخال اسم المورد', 'error');
      return;
    }

    if (currentSupplier) {
      setSuppliers(prev => prev.map(s => s.id === currentSupplier.id ? { ...s, ...supplierForm } : s));
      onAddToast(`تم تحديث بيانات المورد ${supplierForm.name} بنجاح!`, 'success');
    } else {
      const newSup: Supplier = {
        id: `S${suppliers.length + 1}`,
        ...supplierForm
      };
      setSuppliers(prev => [...prev, newSup]);
      onAddToast(`تمت إضافة المورد الجديد ${supplierForm.name} بنجاح!`, 'success');
    }
    setIsSupplierModalOpen(false);
  };

  // طباعة وتصدير
  const handlePrintBarcode = (item: WarehouseItem) => {
    setActiveBarcodeItem(item);
  };

  const exportInventory = () => {
    const headers = 'معرف الصنف,اسم الصنف,الباركود SKU,الفئة,المورد,الكمية المتوفرة,الحد الأدنى,الموقع,سعر التوريد,آخر تحديث\n';
    const rows = items.map(i => `${i.id},${i.name},${i.sku},${i.category},${i.supplier},${i.quantity},${i.minQuantity},${i.location},${i.price},${i.lastUpdated}`).join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `جرد_مخازن_الأكاديمية_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onAddToast('تم تصدير تقرير جرد المستودع كملف Excel/CSV بنجاح!', 'success');
  };

  const handlePrintInventoryList = () => {
    window.print();
    onAddToast('تم إرسال قائمة الجرد والمخازن إلى الطابعة بنجاح!', 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }} id="inventory-view">
      
      {/* 1. الترويسة العلوية والمؤشرات الإحصائية المترابطة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            إدارة المخازن والمستودع الرياضي المركزي
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            متابعة الأصناف والمعدات الرياضية بالأكاديمية، وعمليات الصرف العهدة، والموردين وحالات الجرد اللوجستي.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleOpenItemModal(null)}
            className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            صنف جديد
          </button>
          <button
            onClick={() => handleOpenSupplierModal(null)}
            className="flex items-center gap-1 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-sky-600/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            إضافة مورد
          </button>
          <button
            onClick={exportInventory}
            className="flex items-center gap-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black transition-all"
          >
            <Download className="w-4 h-4" />
            تصدير الجرد
          </button>
        </div>
      </div>

      {/* المؤشرات التفاعلية المباشرة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">إجمالي قطع المستلزمات المخزنة</span>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{stats.totalQty} قطعة</h4>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">القيمة المالية الكلية للمخزون</span>
            <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{stats.totalValue.toLocaleString()} ر.س</h4>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
            <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl flex items-center justify-between shadow-sm transition-all ${
          stats.alertCount > 0 ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/10' : 'border-slate-100 dark:border-slate-800/80'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">أصناف شارفت على النفاد (تنبيه)</span>
            <h4 className={`text-xl font-extrabold font-mono mt-1 ${stats.alertCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>{stats.alertCount} صنف حرج</h4>
          </div>
          <div className={`p-2.5 rounded-xl ${stats.alertCount > 0 ? 'bg-amber-100/60 dark:bg-amber-950/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <AlertTriangle className={`w-6 h-6 ${stats.alertCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
        </div>
      </div>

      {/* تنبيه ذكي للأصناف الحرجة */}
      {stats.alertCount > 0 && (
        <div className="flex items-center gap-3 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold text-amber-800 dark:text-amber-400 block">تنبيه مستويات الكميات الحرجة بنظام المستودع!</span>
            <span className="text-amber-700 dark:text-amber-500 font-medium text-[10px]">شارفت بعض مستويات الأجهزة والأدوات كـ (كرة سلة جلدي) على النفاد، يرجى تقديم أمر توريد للمورد المعتمد فوراً لتلافي توقف الأنشطة.</span>
          </div>
        </div>
      )}

      {/* 2. تبويبات التنقل السريع */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => { triggerLoading(); setActiveTab('items'); }}
          className={`px-4 py-3 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'items' 
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          الأصناف والمنتجات ({items.length})
        </button>

        <button
          onClick={() => { triggerLoading(); setActiveTab('suppliers'); }}
          className={`px-4 py-3 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'suppliers' 
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          الموردين المعتمدين ({suppliers.length})
        </button>

        <button
          onClick={() => { triggerLoading(); setActiveTab('transactions'); }}
          className={`px-4 py-3 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'transactions' 
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          حركات الصرف والمرتجع ({transactions.length})
        </button>

        <button
          onClick={() => { triggerLoading(); setActiveTab('audit'); }}
          className={`px-4 py-3 text-xs font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'audit' 
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          جلسات جرد ومطابقة المخزون
        </button>
      </div>

      {/* 3. عرض المجموعات والجداول حسب التبويب النشط */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* شريط البحث والفلترة للأصناف */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الصنف، الباركود SKU، أو المورد..."
                className="w-full pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500">تصفية:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* جدول الأصناف الرئيسي */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3.5">الرمز SKU</th>
                    <th className="p-3.5">اسم الصنف الرياضي</th>
                    <th className="p-3.5">الفئة</th>
                    <th className="p-3.5">الكمية المتاحة</th>
                    <th className="p-3.5">الموقع بالمخزن</th>
                    <th className="p-3.5">سعر التكلفة</th>
                    <th className="p-3.5">آخر تحديث للكميات</th>
                    <th className="p-3.5 text-center">أدوات ذكية (Barcode/QR)</th>
                    <th className="p-3.5 text-center">الإجراءات والعمليات اللوجستية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.map((item) => {
                    const isLow = item.quantity <= item.minQuantity;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all font-bold text-slate-600 dark:text-slate-300">
                        <td className="p-3.5 font-mono text-[10px] text-indigo-500">{item.sku}</td>
                        <td className="p-3.5">
                          <span className="text-slate-800 dark:text-slate-100 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">المورد: {item.supplier}</span>
                        </td>
                        <td className="p-3.5 text-slate-500 dark:text-slate-400">{item.category}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                              isLow ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                            }`}>
                              {item.quantity} قطعة
                            </span>
                            {isLow && <span className="text-[10px] text-amber-500 font-extrabold">ناقص</span>}
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-500 dark:text-slate-400">{item.location}</td>
                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-mono">{item.price} ر.س</td>
                        <td className="p-3.5 text-slate-400 font-mono font-medium">{item.lastUpdated}</td>
                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handlePrintBarcode(item)}
                              title="توليد وعرض الباركود والـ QR"
                              className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-2">
                            {/* أزرار العمليات السريعة (صرف، مرتجع، جرد) */}
                            <button
                              onClick={() => handleOpenOpModal(item, 'صرف')}
                              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white dark:hover:text-slate-900 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                            >
                              صرف عهدة
                            </button>
                            <button
                              onClick={() => handleOpenOpModal(item, 'مرتجع')}
                              className="px-2 py-1 bg-teal-500/10 hover:bg-teal-500 text-teal-600 hover:text-white dark:hover:text-slate-900 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                            >
                              مرتجع
                            </button>
                            <button
                              onClick={() => handleOpenOpModal(item, 'جرد')}
                              className="px-2 py-1 bg-sky-500/10 hover:bg-sky-500 text-sky-600 hover:text-white dark:hover:text-slate-900 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                            >
                              ضبط الكمية
                            </button>
                            <span className="w-[1px] h-4 bg-slate-100 dark:bg-slate-800 mx-1"></span>
                            <button
                              onClick={() => handleOpenItemModal(item)}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center p-8 text-slate-400 font-bold">
                        لا يوجد أي صنف مخزني يطابق معايير البحث والفلترة الحالية.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3.5">اسم جهة التوريد / الشركة</th>
                    <th className="p-3.5">الشخص المسؤول</th>
                    <th className="p-3.5">الهاتف</th>
                    <th className="p-3.5">البريد الإلكتروني</th>
                    <th className="p-3.5">العنوان الجغرافي</th>
                    <th className="p-3.5">الفئة الموردة</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5 text-center">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  {suppliers.map(sup => (
                    <tr key={sup.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-3.5 text-slate-800 dark:text-slate-100">{sup.name}</td>
                      <td className="p-3.5">{sup.contactName}</td>
                      <td className="p-3.5 font-mono">{sup.phone}</td>
                      <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{sup.email}</td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{sup.address}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px]">
                          {sup.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          sup.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sup.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenSupplierModal(sup)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="p-3.5">رقم المعاملة</th>
                    <th className="p-3.5">اسم الصنف الرياضي</th>
                    <th className="p-3.5">نوع المعاملة</th>
                    <th className="p-3.5">الكمية</th>
                    <th className="p-3.5">تاريخ الحركة</th>
                    <th className="p-3.5">المستلم / الجهة المعنية</th>
                    <th className="p-3.5">ملاحظات المستودعات والتعليق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                      <td className="p-3.5 font-mono text-[10px] text-slate-400">{tx.id}</td>
                      <td className="p-3.5 text-slate-800 dark:text-slate-100">{tx.itemName}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          tx.type === 'صرف' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                          tx.type === 'إدخال' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                          tx.type === 'مرتجع' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' :
                          'bg-sky-100 text-sky-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-200">{tx.quantity} قطعة</td>
                      <td className="p-3.5 font-mono font-medium text-slate-400">{tx.date}</td>
                      <td className="p-3.5 text-indigo-600 dark:text-indigo-400">{tx.recipient}</td>
                      <td className="p-3.5 text-slate-400 font-normal text-[11px]">{tx.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">جلسة جرد ومطابقة المخزون الفعلي (Reconciliation)</h3>
              <p className="text-[10px] text-slate-400">تتيح لك هذه الواجهة مطابقة الكميات الحقيقية بالرف الرياضي وتعديلها بنظام الـ ERP فورياً.</p>
            </div>
            <button
              onClick={() => onAddToast('تم فتح جلسة الجرد الشاملة لجميع كرات اللعب والأجهزة اللوجستية بنجاح!', 'info')}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all"
            >
              بدء جرد سريع
            </button>
          </div>

          <div className="space-y-3.5">
            {items.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-mono text-[9px] text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">{item.sku}</span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">الكمية المسجلة بالنظام حالياً: <strong className="text-indigo-600 font-mono">{item.quantity} قطع</strong></p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400">الكمية الفعلية بالرف:</span>
                  <input
                    type="number"
                    defaultValue={item.quantity}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (val !== item.quantity && val >= 0) {
                        handleOpenOpModal(item, 'جرد');
                      }
                    }}
                    className="w-20 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs font-black"
                  />
                  <button 
                    onClick={() => handleOpenOpModal(item, 'جرد')}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    اعتماد الجرد الفعلي
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* حوار الباركود والـ QR (Barcode & QR Print Dialog) */}
      {/* ==================================================== */}
      {activeBarcodeItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setActiveBarcodeItem(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4 pt-2">
              <span className="inline-block p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-full">
                <QrCode className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{activeBarcodeItem.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">رمز الصنف: {activeBarcodeItem.sku}</p>
              </div>

              {/* تصميم الباركود الوهمي الاحترافي */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-[2px] items-stretch h-12 bg-white dark:bg-slate-100 px-4 py-2 rounded">
                    {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 3].map((w, idx) => (
                      <span key={idx} className="bg-slate-900" style={{ width: `${w}px` }}></span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 font-bold">{activeBarcodeItem.sku}</span>
                  <span className="text-[8px] text-indigo-500 font-black">رمز باركود ERP المعتمد</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    {/* تمثيل رمز QR احترافي */}
                    <div className="grid grid-cols-4 gap-1 w-20 h-20 bg-white">
                      {[
                        [1,1,0,1], [1,0,1,1], [0,1,1,1], [1,1,1,0],
                        [1,0,1,0], [0,1,0,1], [1,1,0,1], [1,0,0,1]
                      ].flat().map((bit, idx) => (
                        <div key={idx} className={`rounded-xs ${bit ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[8px] text-emerald-500 font-black">رمز الاستجابة السريعة (QR Quick Check-In)</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => {
                    window.print();
                    onAddToast('تم إرسال بطاقة الباركود والـ QR الرياضي إلى طابعة الملصقات بنجاح!', 'success');
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  طباعة الملصق
                </button>
                <button
                  onClick={() => {
                    onAddToast('تم نسخ رمز SKU بنجاح إلى الحافظة لربطه بجهاز القارئ اللاسلكي.', 'success');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  نسخ الرمز
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* حوار إضافة / تعديل صنف مخزني (Add/Edit Item Modal) */}
      {/* ==================================================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsItemModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-500" />
              {currentItem ? 'تعديل الصنف الرياضي الحالي' : 'إضافة صنف رياضي جديد للمستودع'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">اسم الصنف الرياضي *</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="مثال: كرة قدم نايكي قياس 5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">الرمز الفريد SKU *</label>
                  <input
                    type="text"
                    value={itemForm.sku}
                    onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">فئة المنتجات *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    {categories.filter(c => c !== 'الكل').map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">الكمية المتاحة حالياً *</label>
                  <input
                    type="number"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">الحد الأدنى للتنبيه *</label>
                  <input
                    type="number"
                    value={itemForm.minQuantity}
                    onChange={(e) => setItemForm({ ...itemForm, minQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">موقع التخزين بالرف *</label>
                  <input
                    type="text"
                    value={itemForm.location}
                    onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="مثال: الرف أ-3"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">سعر التكلفة للوحدة (ر.س) *</label>
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                    min="0"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">المورد المعتمد *</label>
                  <select
                    value={itemForm.supplier}
                    onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    {suppliers.map((s, i) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  {currentItem ? 'حفظ التعديلات' : 'إضافة الصنف'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
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
      {/* حوار إجراء عملية صرف / مرتجع / جرد صنف (Op Modal) */}
      {/* ==================================================== */}
      {isOpModalOpen && selectedItemForOp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsOpModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <ArrowLeftRight className="w-5 h-5 text-amber-500" />
              إجراء عملية {opType} مخزني
            </h3>
            <p className="text-[10px] text-indigo-500 font-extrabold mb-4">{selectedItemForOp.name} (المتاح: {selectedItemForOp.quantity} قطعة)</p>

            <form onSubmit={handleExecuteOp} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-500 mb-1">الكمية المعنية *</label>
                <input
                  type="number"
                  value={opQty}
                  onChange={(e) => setOpQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                  min="1"
                  required
                />
              </div>

              {opType !== 'جرد' && (
                <div>
                  <label className="block text-slate-500 mb-1">المستلم / الكابتن / الجهة المستهدفة *</label>
                  <input
                    type="text"
                    value={opRecipient}
                    onChange={(e) => setOpRecipient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="مثال: الكابتن محمد الشريف"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-500 mb-1">ملاحظات العملية وتبرير الحركة *</label>
                <textarea
                  value={opNotes}
                  onChange={(e) => setOpNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                  placeholder="مثال: لتدريبات الأسبوع الأول في كرة القدم المفتوحة للأشبال."
                  required
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                >
                  تأكيد العملية
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpModalOpen(false)}
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
      {/* حوار إضافة / تعديل المورد (Add/Edit Supplier Modal) */}
      {/* ==================================================== */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsSupplierModalOpen(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-500" />
              {currentSupplier ? 'تعديل بيانات المورد المعتمد' : 'تسجيل جهة توريد رياضية جديدة'}
            </h3>

            <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs font-bold">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 mb-1">اسم الشركة / المورد الرئيسي *</label>
                  <input
                    type="text"
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="مثال: شركة تجهيزات الملاعب الدولية"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">مسؤول التواصل *</label>
                    <input
                      type="text"
                      value={supplierForm.contactName}
                      onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                      placeholder="أ. محمد الشمري"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">رقم الجوال *</label>
                    <input
                      type="text"
                      value={supplierForm.phone}
                      onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                      placeholder="05xxxxxxx"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      value={supplierForm.email}
                      onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold font-mono"
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">نوع توريد المنتجات *</label>
                    <input
                      type="text"
                      value={supplierForm.category}
                      onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                      placeholder="مثال: أدوات كاراتيه وتايكوندو"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">العنوان والمقر الرئيسي *</label>
                  <input
                    type="text"
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                    placeholder="مثال: الرياض - طريق الملك فهد"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">حالة التوريد الحالية *</label>
                  <select
                    value={supplierForm.status}
                    onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value as 'نشط' | 'موقف' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="نشط">نشط (معتمد تداول أوامر شراء مالية)</option>
                    <option value="موقف">موقف (مؤقتاً)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  {currentSupplier ? 'حفظ البيانات' : 'تسجيل المورد'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
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
