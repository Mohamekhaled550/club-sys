import React, { useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'الأستاذ عبد العزيز السالم',
      role: 'ولي أمر اللاعب يوسف السالم',
      comment: 'أكاديمية الأشوال تفوقت بمراحل على جميع الصالات والمنصات الرياضية التي تعاملنا معها سابقاً. تنظيم إداري وبوابة إلكترونية فائقة تتيح لولي الأمر متابعة مستويات الكفاءة البدنية والحضور بكل سلاسة، ناهيك عن جودة ومؤهلات الطاقم التدريبي الدولي.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop'
    },
    {
      name: 'المهندس رائد الأشول',
      role: 'ولي أمر اللاعبين خالد وفيصل الأشول',
      comment: 'أكثر ما لفت نظري هو النهج التربوي والتحفيز السلوكي للأكاديمية قبل البناء الحركي. التدريبات هنا في ملاعب معقمة ومبردة بالكامل، والسباحة تدار بمعايير سلامة احترافية تمنح ولي الأمر شعوراً بالراحة المطلقة طيلة الحصة.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop'
    },
    {
      name: 'الأستاذة مها القحطاني',
      role: 'والدة البطلة سارة القحطاني',
      comment: 'ابنتي تشارك في حصص كرة السلة والدفاع عن النفس، والنتائج رائعة من حيث بناء الثقة والتركيز الذهني وقدرات رد الفعل السريع في زمن وجيز. الطاقم نسائي محترف ومؤهل على أعلى المستويات الفنية المرموقة بالمملكة.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop'
    }
  ];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[activeIndex];

  return (
    <section id="testimonials" className="relative py-32 bg-[#19090B] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5A0B17]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
          <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block animate-pulse">
            شركاء الإنجاز والمسيرة الرياضية المستدامة
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            أصوات الفخر والامتنان
          </h2>
          <p className="text-sm text-slate-400 font-semibold max-w-xl mx-auto">
            تجارب واقعية يرويها أولياء الأمور عن أثر الأكاديمية التدريبي والتربوي والسلوكي على شخصية ومهارة أبطالنا الصغار.
          </p>
        </div>

        {/* Carousel UI Container */}
        <div className="max-w-4xl mx-auto relative">
          
          <div className="bg-white/[0.02] border border-white/5 rounded-[28px] p-8 sm:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A0B17]/10 rounded-bl-full pointer-events-none" />

            {/* Quote Icon overlay */}
            <Quote className="absolute top-10 left-10 w-16 h-16 text-[#D4AF37]/10 flip-horizontal stroke-[1.2]" />

            <div className="space-y-8 relative z-10">
              
              {/* Rating stars */}
              <div className="flex items-center gap-1.5 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                ))}
                <span className="text-xs text-[#D4AF37] font-black mr-2.5">عضوية معتمدة وتقييم ممتاز ٥/٥</span>
              </div>

              {/* Comment text */}
              <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-bold text-right italic font-serif">
                " {current.comment} "
              </p>

              {/* Author Row */}
              <div className="flex items-center gap-5 border-t border-white/5 pt-8 justify-end">
                <div className="text-right">
                  <h4 className="text-base sm:text-lg font-black text-white">{current.name}</h4>
                  <span className="text-xs text-[#D4AF37] font-black block mt-1">{current.role}</span>
                </div>
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center md:justify-between items-center mt-8 md:absolute md:top-1/2 md:-translate-y-1/2 md:inset-x-[-70px] gap-4 z-20">
            <button
              onClick={handlePrev}
              className="p-4 bg-white/[0.03] border border-white/5 hover:border-[#D4AF37] hover:bg-[#5A0B17]/35 rounded-full text-white transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="p-4 bg-white/[0.03] border border-white/5 hover:border-[#D4AF37] hover:bg-[#5A0B17]/35 rounded-full text-white transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? 'bg-[#D4AF37] w-8' : 'bg-white/10 hover:bg-white/20'
                }`}
                aria-label={`تخطي للشهادة ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};
