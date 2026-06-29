import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, Award, Flame, Shield, Sparkles, Trophy, Users, Star } from 'lucide-react';

interface ProgramCard {
  title: string;
  desc: string;
  detail: string;
  icon: React.ReactNode;
  imgUrl: string;
}

export const ProgramsSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const programs: ProgramCard[] = [
    {
      title: 'مدرسة كرة القدم الفاخرة',
      desc: 'من البراعم والتأسيس حتى الاحتراف التكتيكي الكامل.',
      detail: 'ملاعب معتمدة، منهجيات تدريبية حديثة، ومباريات دورية لقياس التطور الحركي والذهني للبطل.',
      icon: <Trophy className="w-6 h-6 stroke-[1.5]" />,
      imgUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop'
    },
    {
      title: 'مسبح النخبة الأولمبي المغلق',
      desc: 'تعليم السباحة ومسافات الطويلة بمواصفات سلامة فائقة.',
      detail: 'تدريب احترافي، فلاتر مياه ذكية ومراقبة مستمرة بدرجة حرارة ملائمة ومثالية للأطفال.',
      icon: <Sparkles className="w-6 h-6 stroke-[1.5]" />,
      imgUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'صالة كرة السلة والتنس الذهبية',
      desc: 'صقل مهارات رمي السلات وتوجيه مضارب التنس بمرونة.',
      detail: 'مستشارين معتمدين للياقة والتحمل وتدريب السرعة البدنية العالية للاعبين المتميزين.',
      icon: <Activity className="w-6 h-6 stroke-[1.5]" />,
      imgUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop'
    },
    {
      title: 'كاراتيه وفنون الدفاع عن النفس',
      desc: 'بناء الشخصية القتالية الملتزمة وغرس التوجيه السلوكي.',
      detail: 'تدرج بالأحزمة المعتمدة بإشراف حكام دوليين وخبراء كاراتيه معتمدين دولياً.',
      icon: <Award className="w-6 h-6 stroke-[1.5]" />,
      imgUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const handlePrev = () => {
    setStartIndex(prev => (prev === 0 ? programs.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="sports" className="relative py-32 bg-[#140708] text-right overflow-hidden bg-noise border-t border-white/5">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-[30%] left-[25%] w-96 h-96 bg-[#5A0B17]/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#B76E79]/5 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[#E5D4C0] text-xs font-black tracking-widest uppercase block animate-pulse">
              برامج الأبطال الرياضية الفاخرة
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
              أكاديميات تخصصية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5D4C0] to-white">
                بقيادة نخبة المدربين
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3 lg:pb-3">
            <button
              onClick={handlePrev}
              className="p-4 bg-white/[0.03] hover:bg-[#5A0B17]/40 border border-white/10 hover:border-[#B76E79]/50 rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-4 bg-white/[0.03] hover:bg-[#5A0B17]/40 border border-white/10 hover:border-[#B76E79]/50 rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Editorial Cards (Magazine Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Selected Card Feature Preview (Col-span 7) */}
          <div className="lg:col-span-7 rounded-[28px] overflow-hidden border border-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative min-h-[450px] flex flex-col justify-end p-8 sm:p-12 group">
            
            <img
              src={programs[startIndex].imgUrl}
              alt={programs[startIndex].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-50 contrast-115"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark glass tint and vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140708] via-[#140708]/40 to-transparent z-10 pointer-events-none" />

            <div className="relative z-20 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-[#B76E79]/30 flex items-center justify-center text-[#E5D4C0] shadow-xl">
                {programs[startIndex].icon}
              </div>

              <div className="space-y-3">
                <span className="text-[#E5D4C0] text-[10px] font-black tracking-widest uppercase block animate-pulse">
                  البرنامج الفاخر الأكثر طلباً
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight">
                  {programs[startIndex].title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 font-semibold leading-relaxed max-w-xl">
                  {programs[startIndex].detail}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    const element = document.getElementById('pricing');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4.5 bg-[#5A0B17]/40 hover:bg-[#5A0B17]/80 border border-[#B76E79]/35 hover:border-[#B76E79]/60 text-white font-black rounded-xl text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-md shadow-xl flex items-center gap-2"
                >
                  حجز مقعد واستعراض باقات الاشتراك
                </button>
              </div>
            </div>

          </div>

          {/* List of other secondary programs with elegant design (Col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            {programs.map((prog, idx) => {
              const isSelected = startIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setStartIndex(idx)}
                  className={`p-6 sm:p-8 rounded-[28px] border cursor-pointer transition-all duration-500 flex items-center gap-6 relative overflow-hidden ${
                    isSelected 
                      ? 'bg-gradient-to-br from-[#1E090B] to-[#5A0B17]/40 border-[#B76E79]/50 shadow-2xl' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
                    isSelected 
                      ? 'bg-[#5A0B17] text-white border-[#B76E79]/30' 
                      : 'bg-white/5 text-slate-300 border-white/5'
                  }`}>
                    {prog.icon}
                  </div>
                  
                  <div className="space-y-1 text-right flex-1">
                    <h4 className="text-base sm:text-lg font-black text-white">{prog.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold">{prog.desc}</p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 left-4">
                      <Star className="w-4 h-4 text-[#E5D4C0] fill-[#E5D4C0]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
};
