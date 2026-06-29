import React, { useState } from 'react';
import { Award, ShieldCheck, Star, Trophy, Users, Mail, Phone, ChevronLeft, Sparkles, X } from 'lucide-react';
import { Coach } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CoachesSectionProps {
  coachesList: Coach[];
}

export const CoachesSection: React.FC<CoachesSectionProps> = ({ coachesList }) => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  // Extra details to display for coaches
  const coachPortfolios: Record<string, { bio: string; badges: string[]; rating: number; experienceYears: number; img: string }> = {
    'الكابتن أحمد الفالح': {
      bio: 'أخصائي تدريب وتنمية مهارات الشباب، حاصل على رخصة التدريب الآسيوية الفئة A، أشرف سابقاً على أكاديمية ناشئي نادي الشباب والاتفاق.',
      badges: ['الرخصة الآسيوية A', 'أفضل مدرب شباب ٢٠٢٤', 'خبير التخطيط التكتيكي'],
      rating: 5,
      experienceYears: 14,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
    },
    'الكابتن يوسف الغامدي': {
      bio: 'سباح أولمبي سابق، شارك في بطولات العالم ومسابقات الخليج، معتمد دولياً لتدريب سباحة المسافات الطويلة والإنقاذ المائي.',
      badges: ['شهادة الاتحاد الدولي FINA', 'بطل الخليج السابق', 'مدرب إنقاذ دولي معتمد'],
      rating: 5,
      experienceYears: 12,
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'
    },
    'الكابتن فهد العتيبي': {
      bio: 'مدرب كرة سلة مخضرم، حاصل على رخصة الإتحاد السعودي والآسيوي، قاد عدة فرق جامعية لمنصات التتويج بفضل مهارات التوجيه الذهني والبدني المتميزة.',
      badges: ['رخصة الإتحاد السعودي', 'أفضل موجه فني ٢٠٢٥', 'أخصائي تنمية المهارات البدنية'],
      rating: 4.9,
      experienceYears: 11,
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop'
    },
    'الكابتن خالد الحربي': {
      bio: 'حاصل على الحزام الأسود الدولي دان ٥، بطل المملكة لعدة سنوات متتالية في الكاراتيه، أشرف على تخريج أكثر من ١٢٠ لاعباً حازوا على الأحزمة السوداء.',
      badges: ['حزام أسود دان ٥ معتمد', 'حكم دولي للكاراتيه', 'مدرب اللياقة القتالية'],
      rating: 5,
      experienceYears: 16,
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'
    }
  };

  return (
    <section id="coaches" className="relative py-32 bg-[#19090B] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Decorative Blur and Spotlights */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#5A0B17]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Title */}
        <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
          <span className="text-[#E5D4C0] text-xs font-black tracking-widest uppercase block animate-pulse">
            صناع الأبطال | المدربون النخبة
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            طواقم تدريبية بمستويات عالمية
          </h2>
          <p className="text-sm text-slate-400 font-semibold max-w-xl mx-auto">
            تضم أكاديمية الأشوال نخبة من المعلمين والمدربين الرياضيين الحاصلين على رخص تدريب دولية وسجلات حافلة بصناعة نجوم الرياضة بالمملكة.
          </p>
        </div>

        {/* Coaches Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coachesList.map((coach, idx) => {
            const portfolio = coachPortfolios[coach.name] || {
              bio: 'مدرب معتمد ذو خبرة رياضية عالية لتوجيه الأبطال الواعدين وتحفيزهم.',
              badges: ['مدرب معتمد', 'شهادة فنية معتمدة'],
              rating: 5,
              experienceYears: 10,
              img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'
            };

            return (
              <div
                key={coach.id}
                onClick={() => setSelectedCoach(coach)}
                className="bg-white/[0.02] border border-white/5 hover:border-[#B76E79]/50 rounded-[28px] p-6.5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] cursor-pointer"
              >
                {/* Glowing light on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#5A0B17]/20 rounded-full blur-2xl group-hover:bg-[#5A0B17]/30 transition-all duration-500" />

                <div className="space-y-5 relative z-10">
                  
                  {/* Coach Header: Editorial photo instead of initials */}
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg border border-white/5">
                    <img
                      src={portfolio.img}
                      alt={coach.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center">
                      <div className="px-2.5 py-1 rounded bg-[#5A0B17]/90 text-white text-[9px] font-black border border-[#B76E79]/30">
                        {coach.specialty}
                      </div>
                      <div className="px-2.5 py-1 rounded bg-slate-950/80 text-[#E5D4C0] text-[9px] font-black border border-[#B76E79]/20 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#E5D4C0]" />
                        {portfolio.rating}
                      </div>
                    </div>
                  </div>

                  {/* Specialty Game Badge */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white group-hover:text-[#E5D4C0] transition-colors">{coach.name}</h3>
                    <p className="text-xs text-slate-400 font-bold tracking-wider">{coach.specialty} | خبرة {portfolio.experienceYears} سنة</p>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-semibold">
                    {portfolio.bio}
                  </p>

                  {/* Action link */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-black">طاقم تدريب النخبة</span>
                    <span className="text-[11px] text-[#E5D4C0] font-black flex items-center gap-1 group-hover:underline">
                      الملف الشخصي
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Coach Details Modal Popup with Elegant styling */}
        <AnimatePresence>
          {selectedCoach && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#120204]/95 border border-[#B76E79]/40 w-full max-w-lg rounded-[32px] p-8 relative shadow-2xl shadow-black bg-noise"
              >
                
                <button
                  onClick={() => setSelectedCoach(null)}
                  className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-6 text-right">
                  
                  {/* Profile header */}
                  <div className="flex items-center gap-5 border-b border-white/5 pb-5">
                    <img
                      src={(coachPortfolios[selectedCoach.name] || { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' }).img}
                      alt={selectedCoach.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#B76E79]/60"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div>
                      <span className="text-[#E5D4C0] text-[10px] font-black tracking-widest uppercase block animate-pulse">المدرب النخبة معتمد</span>
                      <h3 className="text-xl font-black text-white">{selectedCoach.name}</h3>
                      <p className="text-xs text-slate-400 font-semibold">{selectedCoach.specialty}</p>
                    </div>
                  </div>

                  {/* Bio text */}
                  <div className="space-y-2">
                    <h4 className="text-xs text-slate-400 font-black">السيرة الذاتية الفنية</h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                      {(coachPortfolios[selectedCoach.name] || { bio: 'مدرب ذو كفاءة فنية عالية وصاحب خبرة معتمدة.' }).bio}
                    </p>
                  </div>

                  {/* Coach Badges */}
                  <div className="space-y-2">
                    <h4 className="text-xs text-slate-400 font-black">الشهادات والاعتمادات والجوائز</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(coachPortfolios[selectedCoach.name] || { badges: ['شهادة فنية معتمدة'] }).badges.map((badge, bidx) => (
                        <span key={bidx} className="px-3 py-1.5 rounded-lg bg-[#5A0B17]/40 border border-[#B76E79]/35 text-[#E5D4C0] text-xs font-black">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats Section with gold bars */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/60 border border-white/5 rounded-2xl p-5">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">سنوات الخبرة</span>
                      <span className="text-sm sm:text-base font-black text-white">
                        {(coachPortfolios[selectedCoach.name] || { experienceYears: 10 }).experienceYears} سنة تدريب
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">التقييم الفني المعتمد</span>
                      <span className="text-sm sm:text-base font-black text-[#E5D4C0] flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 fill-[#E5D4C0] text-[#E5D4C0]" />
                        {(coachPortfolios[selectedCoach.name] || { rating: 5 }).rating} / ٥
                      </span>
                    </div>
                  </div>

                  {/* Contact options */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={() => {
                        window.open('https://wa.me/966500000000', '_blank');
                        setSelectedCoach(null);
                      }}
                      className="flex-1 py-4 bg-gradient-to-r from-[#5A0B17] via-[#6E1120] to-[#801426] text-white border border-[#B76E79]/30 hover:from-[#6E1120] hover:to-[#961e31] hover:border-[#B76E79]/50 font-black rounded-xl text-xs sm:text-sm hover:scale-[1.02] transition-transform cursor-pointer shadow-lg"
                    >
                      طلب موعد استشارة وتحديد مستوى
                    </button>
                    <button
                      onClick={() => setSelectedCoach(null)}
                      className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </section>
  );
};
