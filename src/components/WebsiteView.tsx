/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Menu, X, ArrowLeft, ArrowRight, Sparkles, Trophy, Calendar, ShieldCheck, Star, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Coach, SubscriptionType } from '../types';

// Import our modular, premium, luxury sub-sections
import { HeroSection } from './website/HeroSection';
import { AboutSection } from './website/AboutSection';
import { ProgramsSection } from './website/ProgramsSection';
import { WhyUsSection } from './website/WhyUsSection';
import { CoachesSection } from './website/CoachesSection';
import { PricingSection } from './website/PricingSection';
import { BookingSection } from './website/BookingSection';
import { EventsAndNewsSection } from './website/EventsAndNewsSection';
import { TestimonialsSection } from './website/TestimonialsSection';
import { FAQSection } from './website/FAQSection';
import { FooterSection } from './website/FooterSection';

interface WebsiteViewProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
  coachesList: Coach[];
  subscriptionTypesList: SubscriptionType[];
  onNavigateToPortal: () => void;
  onNavigateToAdmin: () => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  onAddToast,
  playersList,
  setPlayersList,
  coachesList,
  subscriptionTypesList,
  onNavigateToPortal,
  onNavigateToAdmin
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (id: string) => {
    setMobileMenuOpen(false);
    setActiveLink(id);
    const targetId = id === 'playgrounds' ? 'booking-widget-section' : id;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#140708] text-slate-100 min-h-screen selection:bg-[#B76E79] selection:text-slate-950 overflow-x-hidden text-right font-sans bg-noise">
      
      {/* Ambient background blur elements for the whole page */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#5A0B17]/10 rounded-full blur-[200px] pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-[#B76E79]/5 rounded-full blur-[250px] pointer-events-none z-0" />

      {/* ================= STICKY HEADER WITH LUXURY GLASSMORPHISM ================= */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-[#140708]/90 backdrop-blur-3xl border-b border-[#B76E79]/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] py-4' 
          : 'bg-[#140708]/40 backdrop-blur-md border-b border-white/5 py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo & Identifier - Enlarge and Use Real Premium Logo Image */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleSmoothScroll('home')}>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B76E79] shadow-[0_8px_30px_rgba(90,11,23,0.4)] transition-transform duration-500 group-hover:scale-105">
              <img 
                src="https://i.ibb.co/2YPYCr3m/image.jpg" 
                alt="Elashwal Academy Logo" 
                className="w-full h-full object-cover scale-110" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide text-white flex items-center gap-2 font-sans">
                أكاديمية الأشوال الرياضية
                <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#B76E79] to-[#9E5D68] text-white font-black text-[9px] uppercase tracking-widest shadow-lg">ELITE</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase font-mono">ELASHWAL ACADEMY</span>
            </div>
          </div>

          {/* Luxury Navigation Links (Desktop) - Enhanced with active state & underline */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/[0.02] p-2 border border-white/5 rounded-full backdrop-blur-md shadow-2xl">
            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'about', label: 'عن الأكاديمية' },
              { id: 'sports', label: 'البرامج الرياضية' },
              { id: 'why-us', label: 'الهوية والتأثير' },
              { id: 'coaches', label: 'مدربو النخبة' },
              { id: 'pricing', label: 'العضويات' },
              { id: 'playgrounds', label: 'حجز الملاعب' },
              { id: 'faq', label: 'الاستفسارات' },
            ].map(link => {
              const isActive = activeLink === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleSmoothScroll(link.id)}
                  className={`relative px-4.5 py-2.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'text-[#B76E79] bg-[#5A0B17]/25 border border-[#B76E79]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                      : 'text-slate-300 hover:text-[#B76E79] hover:bg-[#5A0B17]/10'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activeUnderline" 
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B76E79]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Links & Profile Icon Only (No ERP/Admin visible on general, No normal portal button) */}
          <div className="hidden sm:flex items-center gap-3.5">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3A040D] to-[#5A0B17] border border-[#B76E79]/40 hover:border-[#B76E79] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(90,11,23,0.3)] cursor-pointer"
                aria-label="حسابي"
              >
                <User className="w-5 h-5 text-[#B76E79]" strokeWidth={1.5} />
              </button>

              {/* Modern Dropdown menu with premium look */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute left-0 top-full mt-3 w-56 bg-[#140708]/95 backdrop-blur-2xl border border-[#B76E79]/25 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 text-right space-y-1"
                  >
                    {isLoggedIn ? (
                      <>
                        <div className="px-3.5 py-2.5 border-b border-[#B76E79]/15 mb-1.5 text-right">
                          <p className="text-xs font-black text-white">مرحباً بك، ولي الأمر</p>
                          <p className="text-[10px] text-slate-400 font-semibold">khaledsallleeem@gmail.com</p>
                        </div>
                        {[
                          { label: 'حسابي', action: () => { setProfileDropdownOpen(false); onNavigateToPortal(); } },
                          { label: 'الاشتراكات', action: () => { setProfileDropdownOpen(false); onNavigateToPortal(); } },
                          { label: 'الحجوزات', action: () => { setProfileDropdownOpen(false); onNavigateToPortal(); } },
                          { label: 'الإشعارات', action: () => { setProfileDropdownOpen(false); onNavigateToPortal(); } },
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={item.action}
                            className="w-full text-right px-3.5 py-2 hover:bg-[#5A0B17]/20 rounded-xl text-xs font-black text-slate-200 hover:text-[#B76E79] block transition-all"
                          >
                            {item.label}
                          </button>
                        ))}
                        <div className="border-t border-[#B76E79]/15 my-1.5"></div>
                        <button
                          onClick={() => { setIsLoggedIn(false); setProfileDropdownOpen(false); onAddToast('تم تسجيل الخروج وتأمين الحساب', 'info'); }}
                          className="w-full text-right px-3.5 py-2 hover:bg-rose-950/20 rounded-xl text-xs font-black text-rose-400 block transition-all"
                        >
                          تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3.5 py-2.5 border-b border-white/5 mb-1 text-right">
                          <p className="text-[10px] text-[#B76E79] font-black uppercase tracking-wider">بوابة الأعضاء واللاعبين</p>
                        </div>
                        <button
                          onClick={() => { setIsLoggedIn(true); setProfileDropdownOpen(false); onNavigateToPortal(); onAddToast('تم الدخول لبوابة أولياء الأمور واللاعبين', 'success'); }}
                          className="w-full text-right px-3.5 py-2.5 hover:bg-[#5A0B17]/20 rounded-xl text-xs font-black text-slate-200 hover:text-[#B76E79] block transition-all"
                        >
                          تسجيل الدخول
                        </button>
                        <button
                          onClick={() => { setProfileDropdownOpen(false); onNavigateToPortal(); onAddToast('جاري توجيهك لاستمارة التسجيل المباشرة', 'info'); }}
                          className="w-full text-right px-3.5 py-2.5 hover:bg-[#5A0B17]/20 rounded-xl text-xs font-black text-slate-200 hover:text-[#B76E79] block transition-all"
                        >
                          إنشاء حساب
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-200 cursor-pointer border border-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* Mobile Menu Sidebar / Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#140708]/98 backdrop-blur-2xl flex flex-col justify-center items-center p-8 space-y-8 text-right"
          >
            <div className="w-full max-w-xs space-y-4 flex flex-col">
              {[
                { id: 'home', label: 'الرئيسية' },
                { id: 'about', label: 'عن الأكاديمية' },
                { id: 'sports', label: 'البرامج الرياضية' },
                { id: 'why-us', label: 'الهوية والتأثير' },
                { id: 'coaches', label: 'مدربو النخبة' },
                { id: 'pricing', label: 'العضويات' },
                { id: 'playgrounds', label: 'حجز الملاعب' },
                { id: 'faq', label: 'الاستفسارات الشائعة' },
              ].map((link, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.id}
                  onClick={() => handleSmoothScroll(link.id)}
                  className="w-full py-4 px-6 rounded-2xl text-sm font-black text-slate-200 hover:text-[#D4AF37] hover:bg-[#5A0B17]/20 transition-all border border-white/5 flex justify-between items-center"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="w-full max-w-xs space-y-3.5 pt-6 border-t border-white/5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToPortal();
                }}
                className="w-full py-4 bg-[#5A0B17]/20 hover:bg-[#5A0B17]/40 border border-[#D4AF37]/30 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                بوابة ولي الأمر (Portal)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToAdmin();
                }}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                لوحة الإدارة الفنية (ERP)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. HERO SECTION WITH CINEMATIC ARTWORK ================= */}
      <HeroSection
        onAddToast={onAddToast}
        playersList={playersList}
        setPlayersList={setPlayersList}
        onNavigateToPortal={onNavigateToPortal}
        onNavigateToAdmin={onNavigateToAdmin}
      />

      {/* ================= 2. ABOUT & OUR VISION SECTION ================= */}
      <AboutSection />

      {/* ================= 3. SPORTS PROGRAMS SECTION ================= */}
      <ProgramsSection />

      {/* ================= 4. WHY CHOOSE US (BENTO GRID STYLE) ================= */}
      <WhyUsSection />

      {/* ================= 5. PROFESSIONAL COACHES SECTION ================= */}
      <CoachesSection coachesList={coachesList} />

      {/* ================= 6. SUBSCRIPTION PRICING PLANS SECTION ================= */}
      <PricingSection subscriptionTypesList={subscriptionTypesList} onAddToast={onAddToast} />

      {/* ================= 7. INTERACTIVE PLAYGROUND BOOKING ENGINE ================= */}
      <BookingSection onAddToast={onAddToast} />

      {/* ================= 8. LATEST EVENTS & CHAMPIONSHIPS SECTION ================= */}
      <EventsAndNewsSection />

      {/* ================= 9. PREMIUM TESTIMONIALS CAROUSEL ================= */}
      <TestimonialsSection />

      {/* ================= 10. FAQS SECTION ================= */}
      <FAQSection />

      {/* ================= 11. LUXURY MASSIVE CTA BEFORE FOOTER ================= */}
      <section className="relative py-28 bg-[#140708] text-center border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,11,23,0.35)_0%,transparent_70%)] pointer-events-none"></div>
        
        {/* Abstract light rays / smoke texture simulation using gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-transparent via-[#5A0B17]/10 to-transparent blur-[120px] pointer-events-none transform -rotate-12"></div>
        
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 space-y-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5A0B17]/30 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-black tracking-widest uppercase mb-2 animate-pulse">
            <Trophy className="w-3.5 h-3.5" />
            انضم لصفوة الرياضيين بالمملكة
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
            هل أنت جاهز لتصنع بطلاً <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-white via-[#D4AF37] to-amber-200">
              يقهر التحديات؟
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-semibold">
            المقاعد محدودة لضمان أقصى درجات التركيز والرعاية الرياضية الفردية. حان وقت الالتحاق بركب النجوم والاشتراك الفوري.
          </p>

          <div className="flex flex-wrap justify-center gap-5 pt-6">
            <button
              onClick={() => handleSmoothScroll('home')}
              className="px-10 py-5 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA7C11] text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.4)] cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              حجز تجربة مجانية للبطل الآن
            </button>
            <button
              onClick={() => handleSmoothScroll('pricing')}
              className="px-10 py-5 bg-[#5A0B17]/20 hover:bg-[#5A0B17]/40 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white font-black rounded-2xl text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              استعراض باقات العضوية والاشتراكات
            </button>
          </div>

        </div>
      </section>

      {/* ================= 12. LUXURY FOOTER & MAP SECTION ================= */}
      <FooterSection onAddToast={onAddToast} />

    </div>
  );
};
