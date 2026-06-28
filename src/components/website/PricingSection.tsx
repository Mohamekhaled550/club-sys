import React, { useState } from 'react';
import { Check, Star, Trophy, Sparkles, HelpCircle, Shield, ArrowRight, X, Calendar, Clock, MapPin, ShieldCheck, Award } from 'lucide-react';
import { SubscriptionType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface PricingSectionProps {
  subscriptionTypesList: SubscriptionType[];
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ subscriptionTypesList, onAddToast }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');

  const handleSubscribeClick = (planName: string) => {
    if (!checkoutName || !checkoutPhone) {
      onAddToast('يرجى كتابة الاسم بالكامل ورقم الهاتف لمتابعة الاشتراك!', 'error');
      return;
    }
    onAddToast(`شكراً لاهتمامك بالاشتراك في [ ${planName} ]! تم إرسال طلبك وسيتواصل معك منسق الاشتراكات لتأكيد التفعيل فورا.`, 'success');
    setSelectedPlan(null);
    setCheckoutName('');
    setCheckoutPhone('');
  };

  const plans = [
    {
      name: 'العضوية الذهبية الفاخرة',
      price: '800',
      period: 'شهرياً',
      badge: 'الفئة القياسية الرائعة',
      tagline: 'للبراعم الواعدة الشغوفة ببناء وتأسيس المهارة الرياضية الشاملة.',
      bullets: [
        '٣ حصص أسبوعية تخصصية',
        'تقييم فني ورقمي شهري شامل',
        'دخول ملاعب وفروع الأكاديمية',
        'تقارير أداء ومتابعة عبر البوابة',
        'رعاية صحية وتأمينية أساسية'
      ],
      isPopular: false,
      color: 'border-white/5',
      glow: 'shadow-[0_15px_30px_rgba(0,0,0,0.5)]'
    },
    {
      name: 'عضوية النخبة الإستراتيجية',
      price: '1400',
      period: 'شهرياً',
      badge: 'موصى بها من الإدارة',
      tagline: 'للاعبين الطامحين باحتلال الصدارة وتكثيف ساعات الاحتكاك الفني والبدني.',
      bullets: [
        '٥ حصص أسبوعية تخصصية مكثفة',
        'متابعة أسبوعية دقيقة وتقييم دوري',
        'برامج تغذية صحية وتنمية عضلية',
        'حصص تدريب إضافية لتطوير السرعة',
        'أولوية للمشاركة بالبطولات الودية',
        'أطقم رياضية فاخرة ومخصصة للبطل'
      ],
      isPopular: true,
      color: 'border-[#D4AF37]/45',
      glow: 'shadow-[0_20px_50px_rgba(90,11,23,0.4)] ring-1 ring-[#D4AF37]/25'
    },
    {
      name: 'عضوية الـ VIP البلاتينية',
      price: '2400',
      period: 'شهرياً',
      badge: 'الامتياز والتدريب الفردي',
      tagline: 'تجربة حصرية فائقة تجمع بين الكوتشينغ الشخصي والمتابعة الصحية على مدار الساعة.',
      bullets: [
        'حصص وجلسات تدريبية غير محدودة',
        'مدرب شخصي مخصص لكل لاعب',
        'خطط تغذية ووجبات بالتعاون مع خبراء',
        'معسكرات إعداد وتحسين أداء خاص',
        'تأهيل نفسي ومتابعة سلوكية مستمرة',
        'دعوات حصرية لرحلات الاحتكاك الأوروبية'
      ],
      isPopular: false,
      color: 'border-white/5',
      glow: 'shadow-[0_15px_30px_rgba(0,0,0,0.5)]'
    }
  ];

  const comparisonFeatures = [
    { name: 'عدد الحصص الأسبوعية', basic: '٣ حصص', elite: '٥ حصص', vip: 'مفتوح (غير محدود)' },
    { name: 'متابعة وتقارير الأداء', basic: 'شهرياً', elite: 'أسبوعياً', vip: 'فوري وحي' },
    { name: 'مدرب تخصصي خاص وبناء تكتيكي', basic: '❌ لا يشمل', elite: '❌ لا يشمل', vip: '✅ كوتش شخصي مخصص' },
    { name: 'برامج التخطيط الغذائي والوزن', basic: '❌ لا يشمل', elite: '✅ خطط أساسية', vip: '✅ بروتوكول تغذية كامل' },
    { name: 'المشاركة بالمعسكرات الخارجية', basic: '❌ لا يشمل', elite: '✅ خصم خاص', vip: '✅ دخول مجاني بالكامل' },
    { name: 'أطقم وحقائب رياضية فاخرة مخصصة', basic: '❌ طقم قياسي', elite: '✅ طقم فاخر مخصص', vip: '✅ إصدارات بلاتينية كاملة' },
  ];

  return (
    <section id="pricing" className="relative py-32 bg-[#19090B] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_50%_30%,rgba(90,11,23,0.35)_0%,transparent_60%)] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header copy */}
        <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
          <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block animate-pulse">
            باقات العضوية والاشتراكات الفاخرة
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            باقات العضوية والاستثمار الرياضي
          </h2>
          <p className="text-sm text-slate-400 font-semibold max-w-xl mx-auto">
            اختر المستوى الذي يتلاءم مع أهداف وطموح بطلك الرياضي والبدني، وانضم لعائلة الأشوال الرياضية المتميزة.
          </p>
        </div>

        {/* 3 luxurious packages row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-24">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-[32px] p-8.5 sm:p-10 relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-2.5 bg-[#120204]/90 border ${plan.color} ${plan.glow}`}
            >
              
              {/* Premium Top Badge/Ribbon */}
              <div className="absolute -top-3.5 right-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#5A0B17] border border-[#D4AF37]/45 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest shadow-xl">
                <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                {plan.badge}
              </div>

              <div className="space-y-6">
                
                <div className="pb-5 border-b border-white/5">
                  <h4 className="text-xl sm:text-2xl font-black text-white font-serif">{plan.name}</h4>
                  <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">{plan.tagline}</p>
                </div>

                {/* Pricing layout */}
                <div className="py-2">
                  <span className="text-sm text-slate-500 block font-bold">قيمة العضوية والاستثمار</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <h3 className="text-5xl font-black text-[#D4AF37] font-sans leading-none">{plan.price}</h3>
                    <span className="text-sm text-slate-300 font-black">ر.س / {plan.period}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 font-semibold">شامل القيمة المضافة لجميع الحصص</span>
                </div>

                {/* Features Bullets with luxury checkmark */}
                <ul className="space-y-4 text-xs text-slate-200 font-semibold pr-1">
                  {plan.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="flex items-start gap-3 justify-end text-right">
                      <span>{bullet}</span>
                      <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 stroke-[1.5]" />
                    </li>
                  ))}
                </ul>

              </div>

              <div className="pt-8">
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full py-4.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA7C11] text-slate-950 shadow-[0_15px_30px_rgba(212,175,55,0.2)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
                  }`}
                >
                  طلب الانضمام وتثبيت المقعد
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* COMPARISON TABLE: User requested: Comparison */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#5A0B17]/10 rounded-br-full blur-2xl pointer-events-none" />
          
          <h3 className="text-xl sm:text-2xl font-black text-white mb-8 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#D4AF37]" />
            جدول مقارنة الامتيازات والمنافع الكاملة
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-right text-slate-300 font-semibold min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white font-black text-xs sm:text-sm">
                  <th className="pb-4 pr-2">ميزات العضويات</th>
                  <th className="pb-4 text-slate-400">العضوية الذهبية</th>
                  <th className="pb-4 text-[#D4AF37]">عضوية النخبة</th>
                  <th className="pb-4 text-white">الـ VIP البلاتينية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonFeatures.map((f, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pr-2 font-black text-white">{f.name}</td>
                    <td className="py-4 text-slate-300">{f.basic}</td>
                    <td className="py-4 text-[#D4AF37] font-bold">{f.elite}</td>
                    <td className="py-4 text-white font-black">{f.vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Checkout and Subscription Submission Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-b from-[#1C080B] to-[#120204] border border-[#D4AF37]/40 rounded-[32px] p-8 w-full max-w-md shadow-2xl text-right relative bg-noise overflow-hidden"
            >
              {/* Decorative inner blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A0B17]/20 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block mb-1">طلب انضمام رياضي فاخر</span>
                  <h3 className="text-2xl font-black text-white font-serif">العضوية: {selectedPlan}</h3>
                  <p className="text-xs text-slate-400 mt-1">سيتم تفعيل بوابة ولي الأمر ورقم التسجيل فور اعتماد الطلب من الإدارة.</p>
                </div>

                <div className="space-y-5 text-xs font-bold">
                  <div className="space-y-2">
                    <label className="block text-slate-300 pr-1 text-[11px]">اسم البطل المشترك بالكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: تركي بن رائد الأشول"
                      value={checkoutName}
                      onChange={e => setCheckoutName(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-white outline-none transition-all focus:bg-slate-950"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-slate-300 pr-1 text-[11px]">رقم جوال ولي الأمر للمتابعة والاعتماد *</label>
                    <input
                      type="tel"
                      required
                      placeholder="05xxxxxxxx"
                      value={checkoutPhone}
                      onChange={e => setCheckoutPhone(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-white outline-none transition-all focus:bg-slate-950"
                    />
                  </div>

                  <div className="p-4 bg-[#5A0B17]/30 border border-[#D4AF37]/30 rounded-2xl flex items-start gap-2.5">
                    <Shield className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                      عقود عضوية الأشوال معتمدة، وتمنح ولي الأمر واللاعب وصولاً غير محدود لجميع فروعنا بمجرد السداد وإصدار بطاقة النخبة الذكية.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSubscribeClick(selectedPlan)}
                    className="w-full py-4.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA7C11] text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    إرسال طلب العضوية وتأكيد المقعد
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
