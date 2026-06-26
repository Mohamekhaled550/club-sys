/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, CheckCircle2, Shield, Heart, Cpu, FileText, Globe, Smartphone, Mail } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* 1. الترويسة والترحيب */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          حول المنصة والنظام الرياضي الموحد
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          تفاصيل الترخيص الفني والإصدار السنوي وهيكل التطوير التقني لنظام الأكاديمية الرياضية.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-8 relative overflow-hidden">
        
        {/* تصميم فني خلفي خفيف */}
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* القسم الأول: شعار وهوية المطور (MK Technology) */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pb-6 border-b border-slate-100 dark:border-slate-800 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/20 flex-shrink-0 animate-pulse">
            MK
          </div>
          
          <div className="space-y-2 text-center md:text-right">
            <span className="text-indigo-500 text-[10px] font-black tracking-widest block">الشركة المطورة للمنظومة</span>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">MK Technology للحلول الرياضية الرقمية</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              تأسست شركة MK Technology بهدف ريادة الابتكار التقني وتقديم حلول الويب وتطبيقات الجوال الذكية عالية الأداء للأكاديميات والصالات الرياضية المتقدمة في الوطن العربي.
            </p>
          </div>
        </div>

        {/* القسم الثاني: تفاصيل الإصدار والتكنولوجيا */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">بيئة التطوير والتشغيل</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              تم بناء الواجهات الرقمية بالاعتماد على أحدث حزم التقنيات العالمية: 
              <span className="block font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">React 19 + TypeScript + TailwindCSS + Capacitor + Laravel 12 API Engine</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">أمن السجلات والدفاتر المالية</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              جميع العمليات الحسابية وتجديد عقود اللاعبين مؤمنة بالكامل من خلال طبقة تدقيق ومطابقة للدفاتر المالية، مع تسجيل فوري للأنشطة الإدارية.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">الإصدار والترخيص الرقمي</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              النظام مرخص لـ (أكاديمية MK للتطوير الرياضي) بموجب اتفاقية الاستخدام الدائم للمؤسسات.
              <span className="block font-mono text-[10px] text-slate-400 font-bold mt-1">النسخة رقم: 12.0.2 (إصدار صيف 2026)</span>
            </p>
          </div>

        </div>

        {/* القسم الثالث: المزايا التشغيلية */}
        <div className="space-y-3 relative z-10 text-xs">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">المزايا التشغيلية القياسية للمنصة:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">دعم كامل لعرض الويب المتجاوب واللوحات الذكية والأجهزة اللوحية.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">تطبيق جوال تفاعلي مدمج يحاكي بيئة تشغيل Capacitor المباشرة.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">رسوم بيانية تفاعلية SVG عالية الدقة لتحليل الحضور والإيرادات والمصروفات والأرباح.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">أدوات تحكم ذكية لتعديل ومتابعة مستويات مخزون المستلزمات الرياضية بالأكاديمية.</span>
            </div>
          </div>
        </div>

        {/* القسم الرابع: قنوات التواصل والروابط */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> صنع بكل فخر وتطوير هندسي دقيق بواسطة MK Technology
          </span>
          
          <div className="flex gap-4">
            <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors">
              <Globe className="w-4 h-4" /> الموقع الرسمي
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors">
              <Mail className="w-4 h-4" /> الدعم الفني
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
