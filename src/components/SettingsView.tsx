/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, Save, ShieldCheck, HelpCircle, Package, AlertTriangle, 
  ArrowRightLeft, Sliders, Bell, Globe, Plus, ToggleLeft
} from 'lucide-react';
import { warehouseItems, WarehouseItem } from '../data';

interface SettingsViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onAddToast }) => {
  const [items, setItems] = useState<WarehouseItem[]>(warehouseItems);
  
  // خيارات النظام ومفاتيحه التفاعلية
  const [config, setConfig] = useState({
    academyName: "أكاديمية MK للتطوير الرياضي",
    autoSms: true,
    autoRenew: false,
    darkDefault: false,
    faceAuthSim: true,
    maintenanceMode: false,
  });

  const handleToggle = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    onAddToast('تم تعديل خيار التهيئة مؤقتاً. اضغط حفظ للاعتماد.', 'info');
  };

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToast('تم بنجاح حفظ وتطبيق جميع إعدادات تهيئة الأكاديمية بنجاح!', 'success');
  };

  const handleUpdateItemQty = (id: string, newQty: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const required = item.requiredQuantity;
        let status: 'حرج' | 'ناقص' | 'مكتمل' = 'مكتمل';
        if (newQty <= required * 0.25) {
          status = 'حرج';
        } else if (newQty < required) {
          status = 'ناقص';
        }
        return { ...item, currentQuantity: newQty, status };
      }
      return item;
    }));
    onAddToast('تم تعديل مستويات كمية المستودع.', 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة والتحكم */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-500" />
          إعدادات تهيئة النظام والمستودع الرياضي
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          التحكم الكامل بخيارات التشغيل التلقائي للأكاديمية وتعديل كميات المستلزمات الرياضية في مخازن الأكاديمية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأول والثاني: إعدادات تهيئة الأكاديمية */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800 mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              خيارات التفعيل والتشغيل التلقائي
            </h3>

            <form onSubmit={handleSaveConfigs} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">الاسم الرسمي للأكاديمية بالترويسة *</label>
                <input
                  type="text"
                  value={config.academyName}
                  onChange={(e) => setConfig({ ...config, academyName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-3.5 pt-2">
                
                {/* مفتاح 1: الإشعارات التلقائية SMS */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">الإرسال التلقائي لرسائل SMS لأولياء الأمور</h4>
                    <p className="text-[10px] text-slate-400">إرسال رسائل غياب وتسجيل فوري وتنبيه لولي الأمر تلقائياً.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggle('autoSms')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      config.autoSms ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {config.autoSms ? 'مفعل' : 'معطل'}
                  </button>
                </div>

                {/* مفتاح 2: التجديد التلقائي للاشتراكات */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">التجديد التلقائي للعقود عند الانتهاء</h4>
                    <p className="text-[10px] text-slate-400">تحويل حالة الاشتراك إلى تمديد مؤقت عند انتهاء صلاحية الباقة.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggle('autoRenew')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      config.autoRenew ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {config.autoRenew ? 'مفعل' : 'معطل'}
                  </button>
                </div>

                {/* مفتاح 3: وضع الصيانة */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">إلزام الأمان ومحاكاة بصمة الوجه بالبوابات</h4>
                    <p className="text-[10px] text-slate-400">تفعيل خوارزمية التعرف على ملامح الوجه للتحقق من الحضور الذاتي بالصالة.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggle('faceAuthSim')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      config.faceAuthSim ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {config.faceAuthSim ? 'مفعل' : 'معطل'}
                  </button>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  حفظ وتطبيق التغييرات
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* العمود الثالث: إدارة أدوات المستودع الناقصة (Warehouse Item Levels) */}
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                مستودع الأدوات والنواقص الرياضية
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {items.map((item) => {
                  const isCritical = item.status === 'حرج';
                  return (
                    <div 
                      key={item.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100/50 dark:border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                          <span className="text-[9px] text-slate-400 font-bold">{item.category}</span>
                        </div>
                        
                        <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black ${
                          item.status === 'حرج' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                          item.status === 'ناقص' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                          'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        }`}>
                          {item.status === 'حرج' ? 'حرج جداً' : item.status === 'ناقص' ? 'مستوى منخفض' : 'متوفر'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] text-slate-400 font-bold">
                          المتوفر: <strong className="text-slate-700 dark:text-slate-200 font-mono">{item.currentQuantity}</strong> / {item.requiredQuantity}
                        </span>
                        
                        {/* أزرار زيادة ونقصان سريعة للكميات */}
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleUpdateItemQty(item.id, Math.max(0, item.currentQuantity - 1))}
                            className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateItemQty(item.id, item.currentQuantity + 1)}
                            className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> يتم موازنة النواقص بطلبات التوريد تلقائياً.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
