/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, MapPin, Phone, Mail, Landmark, Sparkles, Save, ShieldCheck, 
  Clock, FileText, Award, CheckCircle 
} from 'lucide-react';

interface AcademyViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ onAddToast }) => {
  const [academyData, setAcademyData] = useState({
    name: 'أكاديمية الأشوال الرياضية للنخبة',
    englishName: 'Al Ashwal Sports Elite Academy',
    crNumber: '1010887654',
    vatNumber: '310287654300003',
    foundedDate: '2022-09-01',
    address: 'الرياض، حي الياسمين، طريق الملك عبد العزيز',
    phone: '920012345',
    email: 'info@alashwal.sa',
    website: 'www.alashwal.sa',
    managerName: 'تركي بن رائد الأشول',
    status: 'مرخصة ونشطة',
    licenseNumber: 'وزارة الرياضة - رقم ٢٢٤/أ'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onAddToast('تم حفظ بيانات الأكاديمية بنجاح!', 'success');
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-slate-900 via-[#5A0B17]/20 to-slate-900 p-6 rounded-3xl text-white border border-[#B76E79]/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#5A0B17]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-1">
          <span className="text-[#B76E79] text-xs font-black tracking-widest block">النظام العام وتأسيس الأكاديمية</span>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <Building className="w-6 h-6 text-[#E5D4C0]" />
            الملف التعريفي للأكاديمية (Academy Profile)
          </h2>
          <p className="text-slate-300 text-xs font-medium">
            عرض وتحديث البيانات الأساسية والتراخيص الرسمية لأكاديمية الأشوال لدى الهيئات الحكومية والوزارية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-[#1C080B]/60 backdrop-blur-md border border-[#B76E79]/20 rounded-3xl p-6 text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#B76E79] shadow-2xl">
            <img 
              src="https://i.ibb.co/2YPYCr3m/image.jpg" 
              alt="Academy Logo" 
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{academyData.name}</h3>
            <span className="text-xs text-slate-400 font-semibold">{academyData.englishName}</span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3.5 text-right text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">حالة الاعتماد:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <ShieldCheck className="w-3.5 h-3.5" /> {academyData.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">رقم الترخيص:</span>
              <span className="text-white font-bold">{academyData.licenseNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">تاريخ التأسيس:</span>
              <span className="text-white font-mono">{academyData.foundedDate}</span>
            </div>
          </div>

          <div className="p-4 bg-[#5A0B17]/20 border border-[#B76E79]/20 rounded-2xl flex items-start gap-3 text-right">
            <Sparkles className="w-5 h-5 text-[#E5D4C0] shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
              يتم مزامنة هذه البيانات الأساسية بشكل دوري مع بوابات وزارة الرياضة، وتستخدم في ترويسات الفواتير وعقود أولياء الأمور وبطاقات العضوية بشكل رسمي.
            </p>
          </div>
        </div>

        {/* Detailed Data Form */}
        <div className="lg:col-span-2 bg-[#1C080B]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-md font-extrabold text-white">البيانات الرسمية وتفاصيل السجل</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right text-xs font-bold">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-slate-300">اسم الأكاديمية بالعربية</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={academyData.name}
                  onChange={e => setAcademyData({ ...academyData, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60"
                />
              </div>

              {/* English Name */}
              <div className="space-y-2">
                <label className="text-slate-300">اسم الأكاديمية بالإنجليزية</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={academyData.englishName}
                  onChange={e => setAcademyData({ ...academyData, englishName: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60 text-left"
                />
              </div>

              {/* CR Number */}
              <div className="space-y-2">
                <label className="text-slate-300">رقم السجل التجاري (C.R.)</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={academyData.crNumber}
                  onChange={e => setAcademyData({ ...academyData, crNumber: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60 font-mono"
                />
              </div>

              {/* VAT */}
              <div className="space-y-2">
                <label className="text-slate-300">الرقم الضريبي الموحد (VAT)</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={academyData.vatNumber}
                  onChange={e => setAcademyData({ ...academyData, vatNumber: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60 font-mono"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-300">عنوان المقر الرئيسي</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={academyData.address}
                    onChange={e => setAcademyData({ ...academyData, address: e.target.value })}
                    className="w-full pr-10 pl-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60"
                  />
                  <MapPin className="absolute right-3.5 top-4 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-slate-300">هاتف التواصل</label>
                <div className="relative">
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={academyData.phone}
                    onChange={e => setAcademyData({ ...academyData, phone: e.target.value })}
                    className="w-full pr-10 pl-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60 text-left font-mono"
                  />
                  <Phone className="absolute right-3.5 top-4 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-slate-300">البريد الإلكتروني الرسمي</label>
                <div className="relative">
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={academyData.email}
                    onChange={e => setAcademyData({ ...academyData, email: e.target.value })}
                    className="w-full pr-10 pl-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60 text-left font-mono"
                  />
                  <Mail className="absolute right-3.5 top-4 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Manager */}
              <div className="space-y-2">
                <label className="text-slate-300">المدير الرياضي المسؤول</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={academyData.managerName}
                  onChange={e => setAcademyData({ ...academyData, managerName: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60"
                />
              </div>

              {/* Web URL */}
              <div className="space-y-2">
                <label className="text-slate-300">الموقع الإلكتروني</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={academyData.website}
                  onChange={e => setAcademyData({ ...academyData, website: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-[#B76E79] rounded-xl text-white outline-none transition-all disabled:opacity-60 text-left font-mono"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#5A0B17] to-[#801426] text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  حفظ التعديلات والبيانات
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
