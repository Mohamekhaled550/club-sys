import React from 'react';
import { ShieldCheck, Award, BookOpen, Clock, Activity, Users, Shield, Trophy, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" className="relative py-32 bg-[#24090E] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Dynamic blurred shape overlays simulating high-end smoke & Vignette */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#5A0B17]/25 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Heading */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block animate-pulse">
            الهوية والتأثير الرياضي المستدام
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            لماذا يختار أصحاب الطموح <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">الأشوال أكاديمي؟</span>
          </h2>
          <p className="text-sm text-slate-400 font-semibold max-w-2xl mx-auto leading-relaxed">
            نحن لا نقدم مجرد برامج لياقة اعتيادية؛ بل نؤسس لمسيرة حياة رياضية متكاملة تمنح البطل ثقة مطلقة وتصقل شخصيته السلوكية والبدنية.
          </p>
        </div>

        {/* Bento Grid Layout (Mix of visual photography and high-end glass cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Large Bento Image Card with overlay text (Col-span 7) */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="md:col-span-7 rounded-[28px] overflow-hidden relative min-h-[400px] border border-white/10 group transition-all duration-500 shadow-2xl shadow-black/80"
          >
            <img
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop"
              alt="بيئة رياضية نخبوية"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 contrast-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140708] via-[#140708]/30 to-transparent z-10" />
            
            <div className="absolute bottom-10 right-10 left-10 z-20 space-y-3">
              <span className="px-3.5 py-1.5 rounded-full bg-[#5A0B17]/90 border border-[#D4AF37]/45 text-[#D4AF37] text-[10px] font-black tracking-widest uppercase inline-block">
                مرافق ومواصفات أوروبية
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-sans leading-tight">
                ملاعب وصالات ألعاب متكاملة ومكيفة بالكامل
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-lg">
                نهيئ لأبطالنا بيئة رياضية معقمة، مكيفة، وآمنة تضمن تجربة تمرين فخمة تليق بطموحهم الرياضي.
              </p>
            </div>
          </motion.div>

          {/* Card 2: High Contrast Golden/Burgundy Glass Card (Col-span 5) */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="md:col-span-5 rounded-[28px] p-8 sm:p-10 glass-card luxury-border flex flex-col justify-between border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A0B17]/10 rounded-bl-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#5A0B17]/40 flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37]">
                <Award className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-white">الاعتمادات والتكريمات</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                  تحمل الأكاديمية تصنيفات واعتمادات رسمية رائدة ومشاركات في محافل محلية منحتنا ثقة كبريات الهيئات الرياضية والمدربين المعتمدين دولياً.
                </p>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap gap-2.5">
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 text-[10px] font-black">رخصة الاتحاد الآسيوي</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 text-[10px] font-black">وزارة الرياضة السعودية</span>
            </div>
          </motion.div>

          {/* Card 3: Performance & Health (Col-span 5) */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="md:col-span-5 rounded-[28px] p-8 sm:p-10 glass-card luxury-border flex flex-col justify-between border border-white/5 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 text-white">
                <Activity className="w-7 h-7 text-[#D4AF37] stroke-[1.5]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-white">المتابعة البدنية المتقدمة</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                  بوابة تقنية حديثة لرصد نسب الحضور، مستويات الكفاءة البدنية، والوزن بالتعاون مع أخصائيين لتنمية البناء البدني والصحي للاعبين.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <p className="text-[11px] text-[#D4AF37] font-black tracking-widest uppercase flex items-center gap-1">
                تحديثات أسبوعية لولي الأمر عبر البوابة الفورية
              </p>
            </div>
          </motion.div>

          {/* Card 4: Editorial Image Card (Col-span 7) */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="md:col-span-7 rounded-[28px] overflow-hidden relative min-h-[400px] border border-white/10 group transition-all duration-500 shadow-2xl shadow-black/80"
          >
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop"
              alt="مدربو النخبة"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 contrast-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140708] via-[#140708]/30 to-transparent z-10" />
            
            <div className="absolute bottom-10 right-10 left-10 z-20 space-y-3">
              <span className="px-3.5 py-1.5 rounded-full bg-[#5A0B17]/90 border border-[#D4AF37]/45 text-[#D4AF37] text-[10px] font-black tracking-widest uppercase inline-block">
                طاقم تدريبي مخضرم
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-sans leading-tight">
                مدربو النخبة برخص تدريب آسيوية وأوروبية A
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-lg">
                يقود الأبطال طواقم تدريب احترافية بمستويات رفيعة تركز على البناء المهاراتي الفردي والتأسيس السلوكي المتميز.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Achievements Strip below inside customized dark box */}
        <div className="mt-20 bg-gradient-to-r from-[#1E090B] via-[#24090E] to-[#120204] border border-white/5 rounded-[28px] p-8 sm:p-10 shadow-2xl flex flex-wrap items-center justify-around gap-8 text-center relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />

          {[
            { val: '+٥,٠٠٠', label: 'ساعة تدريب محترفة', icon: <Clock className="w-5.5 h-5.5 text-[#D4AF37] stroke-[1.5]" /> },
            { val: '+١٠ سنوات', label: 'مسيرة وعطاء رياضي', icon: <Award className="w-5.5 h-5.5 text-[#D4AF37] stroke-[1.5]" /> },
            { val: '٥ فروع', label: 'بأرقى وأفخم مناطق الرياض', icon: <Shield className="w-5.5 h-5.5 text-[#D4AF37] stroke-[1.5]" /> },
            { val: '+١٢٠ بطولة', label: 'محلية وإقليمية مكللة بذهب', icon: <Trophy className="w-5.5 h-5.5 text-[#D4AF37] stroke-[1.5]" /> },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 min-w-[140px] relative z-10">
              <div className="w-12 h-12 rounded-full bg-slate-950/70 flex items-center justify-center border border-white/5 shadow-xl">
                {item.icon}
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white font-sans mt-2">{item.val}</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold">{item.label}</p>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
