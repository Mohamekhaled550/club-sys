import React, { useState } from 'react';
import { Sparkles, X, ChevronLeft, Award, Trophy, Users, Shield, ArrowLeft, Star, StarOff, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../../types';

interface HeroSectionProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
  onNavigateToPortal: () => void;
  onNavigateToAdmin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAddToast,
  playersList,
  setPlayersList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trialForm, setTrialForm] = useState({ name: '', phone: '', age: '', sport: 'كرة القدم' });

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialForm.name || !trialForm.phone || !trialForm.age) {
      onAddToast('يرجى ملء جميع الحقول المطلوبة لتسجيل التجربة المجانية!', 'error');
      return;
    }

    const newId = `لاعب-ويب-${playersList.length + 1}`;
    const newPlayer: Player = {
      id: newId,
      name: trialForm.name,
      sport: trialForm.sport,
      age: parseInt(trialForm.age) || 12,
      level: 'مبتدئ',
      status: 'موقف',
      phone: trialForm.phone,
      joinDate: new Date().toISOString().split('T')[0],
      avatarColor: 'bg-[#5A0B17]',
      parentId: 'ولي أمر-ويب',
      coachId: 'مدرب-1',
      groupName: 'فئة التجربة المجانية',
      notes: [`طلب تجربة مجانية من الهيرو`],
      files: [],
      injuries: [],
      attendance: [],
      payments: [],
      timeline: [{ title: 'طلب تجربة مجانية من الموقع', date: new Date().toISOString().split('T')[0], description: 'تم إرسال الطلب عبر الموقع الإلكتروني بنجاح وهو قيد معالجة الإدارة.', type: 'تسجيل' }]
    };

    setPlayersList(prev => [newPlayer, ...prev]);
    onAddToast('تهانينا! تم إرسال طلب تجربة مجانية بنجاح وجاري تحويله للوحة الإدارة.', 'success');
    setTrialForm({ name: '', phone: '', age: '', sport: 'كرة القدم' });
    setIsModalOpen(false);
  };

  const handleSmoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-[100vh] pt-32 pb-20 flex flex-col justify-center bg-gradient-to-b from-[#140708] via-[#1C080B] to-[#120204] overflow-hidden text-right bg-noise">
      
      {/* ================= CINEMATIC STADIUM BACKDROP & LIGHT BEAMS ================= */}
      {/* Radial glow representing the stadium floodlights */}
      <div className="absolute top-[-10%] left-[30%] w-[800px] h-[500px] bg-gradient-to-b from-[#D4AF37]/15 via-[#5A0B17]/10 to-transparent rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#5A0B17]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      {/* Diagonal Light Beams (Stadium Atmosphere) */}
      <div className="absolute inset-0 opacity-25 pointer-events-none z-0 mix-blend-screen overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[35%] h-[150%] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent transform rotate-[35deg] blur-[80px]"></div>
        <div className="absolute top-[-10%] right-[15%] w-[25%] h-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-[25deg] blur-[100px]"></div>
      </div>

      {/* Subtle Dust / Grass Particle Simulation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0 mix-blend-color-dodge">
        <div className="absolute top-[40%] left-[10%] w-2 h-2 bg-[#D4AF37] rounded-full filter blur-[1px] animate-pulse"></div>
        <div className="absolute top-[60%] right-[20%] w-3 h-3 bg-white rounded-full filter blur-[2px] animate-ping duration-3000"></div>
        <div className="absolute top-[30%] right-[40%] w-1.5 h-1.5 bg-[#D4AF37] rounded-full filter blur-[0.5px]"></div>
        <div className="absolute top-[75%] left-[35%] w-2 h-2 bg-white rounded-full filter blur-[1.5px] animate-bounce"></div>
      </div>

      {/* Main Grid: Split Cinematic Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* RIGHT COLUMN: Huge Title Block & Typography (col-span-6) */}
        <div className="lg:col-span-6 space-y-8 order-2 lg:order-1 pt-6 lg:pt-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#D4AF37] text-xs font-black tracking-widest uppercase shadow-2xl">
              <Zap className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              أكاديمية النخبة الرياضية الأولى بالمملكة
            </div>
            
            <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-serif font-black text-white leading-[1.05] tracking-tight">
              نبني الأبطال <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-white via-slate-200 to-[#D4AF37]">
                للمنصات العالمية
              </span>
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-semibold"
          >
            بيئة تدريبية فاخرة تُحاكي الأكاديميات الأوروبية. نجمع بين العلم، الاحترافية، والتوجيه السلوكي لصناعة جيل رياضي متميز فكراً وبدناً.
          </motion.p>

          {/* Luxury Buttons: Glass with anim borders */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-5 pt-3"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-9 py-5 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA7C11] text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_20px_45px_rgba(212,175,55,0.4)] cursor-pointer flex items-center gap-2.5"
            >
              احجز تجربة مجانية للبطل
              <Sparkles className="w-4 h-4 text-slate-950" />
            </button>
            
            <button
              onClick={() => handleSmoothScroll('sports')}
              className="px-9 py-5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-white text-white font-black rounded-2xl text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              استكشف برامجنا الفاخرة
            </button>
          </motion.div>

          {/* Floating Achievements/Stats Ribbon inside the col */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 grid grid-cols-3 gap-6 border-t border-white/5"
          >
            {[
              { value: '+١٠ سنوات', label: 'الخبرة المعتمدة' },
              { value: '٥ فروع', label: 'بأرقى أحياء الرياض' },
              { value: '+٢٥٠٠ لاعب', label: 'وثقوا بمسيرتنا' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-lg sm:text-xl font-black text-white font-sans">{stat.value}</h4>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* LEFT COLUMN: Cinematic Player Artwork with Floating Objects (col-span-6) */}
        <div className="lg:col-span-6 relative flex items-center justify-center order-1 lg:order-2 h-[450px] sm:h-[600px] w-full">
          
          {/* Animated Halo/Aura background */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] rounded-full border border-[#D4AF37]/20 border-dashed pointer-events-none z-0"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[400px] h-[400px] sm:w-[540px] sm:h-[540px] rounded-full border border-white/5 pointer-events-none z-0"
          />

          {/* Cinematic Main Player Photo - cut out looking left towards content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: -1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative w-[85%] h-[90%] z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#140708] via-transparent to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#140708] to-transparent z-20 pointer-events-none hidden lg:block" />
            
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop"
              alt="Elite Football Player Action"
              className="w-full h-full object-cover rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.9)] transform -scale-x-100 opacity-90 border border-white/10 mix-blend-lighten select-none"
              referrerPolicy="no-referrer"
            />

            {/* Glowing lens flares & ambient overlay on image */}
            <div className="absolute top-[15%] left-[20%] w-24 h-24 bg-[#D4AF37]/30 rounded-full blur-3xl pointer-events-none mix-blend-color-dodge z-30"></div>
          </motion.div>

          {/* Floating Luxury Badges/Awards (Awwwards Style) */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[10%] right-[5%] z-20 glass-card luxury-border p-4 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5A0B17]/40 flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37]">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-bold block">مخرجات فنية</span>
              <p className="text-[11px] text-white font-black">أكاديمية معتمدة ISO</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[15%] left-[2%] z-20 glass-card luxury-border p-4 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-950/85 flex items-center justify-center border border-white/10 text-white">
              <Users className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-bold block">الكفاءة المهنية</span>
              <p className="text-[11px] text-white font-black">طواقم تدريب أوروبية</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[50%] right-[-5%] z-20 bg-gradient-to-tr from-[#1E090B] to-[#5A0B17] border border-[#D4AF37]/45 p-4.5 rounded-[22px] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(90,11,23,0.5)] pointer-events-none text-center min-w-[100px]"
          >
            <span className="text-xl font-black font-mono text-[#D4AF37]">٥/٥</span>
            <span className="text-[8px] text-slate-300 font-black tracking-widest uppercase">تقييم أولياء الأمور</span>
          </motion.div>

        </div>

      </div>

      {/* ================= FREE TRIAL REGISTRATION DIALOG MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-b from-[#1C080B] to-[#120204] border border-[#D4AF37]/40 rounded-[32px] p-8 w-full max-w-lg shadow-[0_30px_80px_rgba(0,0,0,0.9)] relative text-right bg-noise overflow-hidden"
            >
              {/* Abs decorative glow inside modal */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A0B17]/20 rounded-full blur-2xl pointer-events-none" />
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[#D4AF37] text-xs font-black tracking-widest block mb-1">انضم لكتيبة النخبة</span>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2 justify-end font-serif">
                    طلب حصة تقييمية مجانية
                    <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">دع الخبراء يقيّمون المهارة الحركية والرياضية لطفلك فورا</p>
                </div>

                <form onSubmit={handleTrialSubmit} className="space-y-5 text-xs font-bold">
                  <div className="space-y-2">
                    <label className="block text-slate-300 pr-1 text-[11px]">اسم اللاعب بالكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: فيصل بن أحمد الأشول"
                      value={trialForm.name}
                      onChange={e => setTrialForm({ ...trialForm, name: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-white text-xs text-right outline-none transition-all placeholder:text-slate-600 focus:bg-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-slate-300 pr-1 text-[11px]">عمر البطل (سنوات) *</label>
                      <input
                        type="number"
                        required
                        min="4"
                        max="25"
                        placeholder="١٢ سنة"
                        value={trialForm.age}
                        onChange={e => setTrialForm({ ...trialForm, age: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-white text-xs text-right outline-none transition-all placeholder:text-slate-600 focus:bg-slate-950"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-slate-300 pr-1 text-[11px]">رقم هاتف ولي الأمر *</label>
                      <input
                        type="tel"
                        required
                        placeholder="05xxxxxxxx"
                        value={trialForm.phone}
                        onChange={e => setTrialForm({ ...trialForm, phone: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-white text-xs text-right outline-none transition-all placeholder:text-slate-600 focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 pr-1 text-[11px]">البرنامج الرياضي المفضل *</label>
                    <select
                      value={trialForm.sport}
                      onChange={e => setTrialForm({ ...trialForm, sport: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-white text-xs text-right outline-none cursor-pointer transition-all focus:bg-slate-950"
                    >
                      <option value="كرة القدم">مدرسة كرة القدم الفاخرة</option>
                      <option value="كرة السلة">أكاديمية كرة السلة الذهبية</option>
                      <option value="السباحة">مسبح النخبة الأولمبي المغلق</option>
                      <option value="الكاراتيه">الكاراتيه وفنون الدفاع السلوكية</option>
                    </select>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-4.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA7C11] text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xl hover:shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                    >
                      أرسل طلب الانضمام المجاني للبطل
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
