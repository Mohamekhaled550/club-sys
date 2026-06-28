import React, { useState } from 'react';
import { Play, Calendar, ChevronLeft, ArrowRight, Video, X, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EventsAndNewsSection: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const newsItems = [
    {
      title: 'ورشة عمل تطوير مهارات القيادة والذكاء الميداني',
      date: '٢٧ يونيو ٢٠٢٦',
      tag: 'ورشة عمل نخبوية',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop',
      desc: 'تدريبات فكرية وتكتيكية لزيادة سرعة استجابة اللاعب واتخاذ القرارات تحت الضغط.'
    },
    {
      title: 'إطلاق برنامج إعداد المحترفين للموسم الكروي الجديد',
      date: '٢٠ يونيو ٢٠٢٦',
      tag: 'برنامج حاسم',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop',
      desc: 'بإشراف طاقم أوروبي، ينطلق برنامج مكثف لرفع قدرات التحمل وصقل التكنيك العام.'
    },
    {
      title: 'فريق الأشوال تحت ١٤ سنة يتوج بطلاً لدوري المنطقة',
      date: '١٠ يونيو ٢٠٢٦',
      tag: 'تتويج رسمي ذهبي',
      image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&auto=format&fit=crop',
      desc: 'في ليلة تكتيكية تاريخية، حقق الأبطال اللقب بجدارة وسجل نظيف من الأهداف.'
    }
  ];

  return (
    <section id="events" className="relative py-32 bg-[#140708] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Decorative Glow elements */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#5A0B17]/15 rounded-full blur-[130px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 space-y-20">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block animate-pulse">
            الملتقيات والبطولات الرسمية للأشوال
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            أصداء الإنجازات والبطولات
          </h2>
          <p className="text-sm text-slate-400 font-semibold max-w-xl mx-auto">
            مواكبة مستمرة لأهم الفعاليات الفنية وتغطيات شاملة للحصص والمباريات الودية لكتيبة فرسان المستقبل.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Video Showcase Card (col-span-5) */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="lg:col-span-5 rounded-[28px] overflow-hidden relative border border-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group min-h-[400px] flex flex-col justify-end p-8 sm:p-10"
          >
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop"
              alt="Elite Players Video"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-50"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10 pointer-events-none"></div>
            
            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={() => setIsVideoOpen(true)}
                className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:bg-[#5A0B17] hover:border-[#D4AF37] shadow-2xl cursor-pointer"
                aria-label="تشغيل البث التدريبي"
              >
                <Play className="w-7 h-7 fill-white ml-1.5 flip-horizontal text-white" />
              </button>
            </div>

            {/* Video title overlay */}
            <div className="relative z-20 text-right space-y-2">
              <span className="bg-[#D4AF37] text-slate-950 text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block border border-[#D4AF37]/45 shadow-lg">
                البث الوثائقي الفاخر
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white">تغطية سينمائية لتدريبات النخبة المبردة بالرياض</h4>
            </div>
          </motion.div>

          {/* RIGHT: 3 News Cards row (col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {newsItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white/[0.02] border border-white/5 rounded-[28px] overflow-hidden shadow-2xl group hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col justify-between"
              >
                
                {/* News Image Header */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Date Badge over image */}
                  <div className="absolute top-4 right-4 bg-[#5A0B17] border border-[#D4AF37]/30 text-white text-[9px] font-black px-3 py-1 rounded-lg">
                    {item.date}
                  </div>
                </div>

                {/* News Copy */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase block">{item.tag}</span>
                    <h4 className="text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors leading-relaxed">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed line-clamp-3">{item.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <button
                      onClick={() => alert(`سيتم توجيهك قريباً لقراءة الخبر الحصري كاملاً بمدونة الأكاديمية.`)}
                      className="text-[#D4AF37] hover:text-white text-[10px] font-black flex items-center gap-1.5 hover:underline cursor-pointer"
                    >
                      تفاصيل التغطية
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* Modern custom modal video player (No cheap alert) */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 border border-[#D4AF37]/45 w-full max-w-3xl rounded-[32px] overflow-hidden relative shadow-2xl shadow-black p-1"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 left-4 z-30 p-2 bg-black/60 hover:bg-black/90 rounded-full text-slate-400 hover:text-white cursor-pointer border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-video w-full bg-black relative">
                {/* Embedded beautiful placeholder or Unsplash image styled like a video running */}
                <img
                  src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop"
                  alt="Live Streaming Pitch"
                  className="w-full h-full object-cover opacity-70"
                />
                
                {/* Visual video timeline overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6 text-right space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">بث حي تدريبات الأكاديمية</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">الكابتن أحمد الفالح يقود حصة الإحماء التكتيكي (تحت ١٥ سنة)</h3>
                  
                  {/* Fake controls */}
                  <div className="flex items-center gap-4 text-xs pt-1">
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-[#D4AF37]" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">03:45 / 12:00</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
