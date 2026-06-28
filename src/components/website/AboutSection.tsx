import React from 'react';
import { Target, Eye, CheckCircle2, ShieldCheck, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-32 bg-[#19090B] text-right overflow-hidden border-t border-white/5 bg-noise">
      
      {/* Visual luxury accent glows */}
      <div className="absolute top-[20%] left-[-15%] w-[500px] h-[500px] bg-[#5A0B17]/25 rounded-full blur-[140px] pointer-events-none z-0 transform-gpu" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none z-0 transform-gpu" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Heading Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-24">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block animate-pulse">
              عن الصرح الرياضي | الهوية والريادة
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-[1.15]">
              نصنع التاريخ الرياضي <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-300 to-white">
                بأيادي براعمنا الواعدة
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="text-sm text-slate-400 font-semibold leading-relaxed">
              تأسست أكاديمية الأشوال الرياضية لتكون الصرح الرياضي الأرقى والوجهة الأولى للتميز الرياضي السلوكي، بهدف غرس الروح الرياضية وصقل المهارات البدنية وفق أعلى المعايير القياسية العالمية.
            </p>
          </div>
        </div>

        {/* Editorial Split Layout for About & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Right column: Editorial Cards (col-span-6) */}
          <div className="lg:col-span-6 space-y-10">
            
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 sm:p-10 glass-card luxury-border rounded-[28px] relative overflow-hidden group transition-all duration-500"
            >
              {/* Decorative wine shape inside */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#5A0B17]/15 rounded-bl-[40px] group-hover:bg-[#5A0B17]/25 transition-all duration-500" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="p-4 bg-[#5A0B17]/30 rounded-2xl border border-[#D4AF37]/25 text-[#D4AF37]">
                  <Target className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans">رؤيتنا الإستراتيجية</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                    نطمح لتوسيع مدارك المهارة الرياضية لنجوم المستقبل وتدريبهم تكتيكياً برعاية فنية متفردة تحاكي منهجيات الأندية الأوروبية الكبرى، لتأهيلهم للمنافسة على منصات التتويج المحلية والإقليمية.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 sm:p-10 glass-card luxury-border rounded-[28px] relative overflow-hidden group transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#5A0B17]/15 rounded-bl-[40px] group-hover:bg-[#5A0B17]/25 transition-all duration-500" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="p-4 bg-[#5A0B17]/30 rounded-2xl border border-[#D4AF37]/25 text-[#D4AF37]">
                  <Eye className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-sans">رسالتنا الفنية والتربوية</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                    تقديم برامج تدريبية وتأهيلية فريدة تدمج بين التنمية الذهنية والمهارة البدنية مع المتابعة السلوكية والتربوية الحثيثة، لإعداد بطل واثق يتحلى بالروح القيادية والمسؤولية الأخلاقية العالية.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Left Column: List of Elite pillars & ISO certificates (col-span-6) */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="relative p-10 bg-gradient-to-b from-[#24090E] to-[#120204] rounded-[28px] border border-white/5 space-y-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              
              {/* Soft glow in behind list */}
              <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

              <h4 className="text-xl font-black text-white border-b border-white/5 pb-4 font-serif">
                ركائز التميز في أكاديمية الأشوال
              </h4>
              
              <ul className="space-y-6">
                {[
                  { title: 'المنهجية الفنية الشاملة', desc: 'خطط تدريبية مخصصة وعلمية تناسب كل فئة عمرية بمعدل تطور تدريجي.' },
                  { title: 'المتابعة الرقمية الذكية', desc: 'تقييم رقمي دوري متاح لولي الأمر عبر بوابة مخصصة لقياس معدلات نموه.' },
                  { title: 'تكامل اللياقة والتغذية', desc: 'استشارات تخطيط غذائي بإشراف أخصائيين لتنمية اللياقة والنمو العضلي.' },
                  { title: 'معسكرات الاحتكاك الدولية', desc: 'رحلات تدريبية ومباريات ودية مع كبريات الأكاديميات الكروية بالشرق الأوسط.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5.5 h-5.5 text-[#D4AF37] shrink-0 mt-0.5 stroke-[1.5]" />
                    <div>
                      <h5 className="text-sm sm:text-base font-black text-white">{item.title}</h5>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ISO Ribbon Accent */}
              <div className="p-5 bg-gradient-to-r from-[#5A0B17]/40 via-[#2B0B12]/80 to-[#140708] border border-[#D4AF37]/30 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#D4AF37] font-black tracking-widest block uppercase">الاعتمادات والجودة</span>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    معتمدة ومصنفة من وزارة الرياضة السعودية والاتحادات الرسمية للألعاب الرياضية الفردية والجماعية.
                  </p>
                </div>
                <div className="text-2xl font-serif font-black text-[#D4AF37] bg-slate-950/55 px-4 py-2.5 rounded-xl border border-white/5 shadow-2xl">
                  ISO
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
