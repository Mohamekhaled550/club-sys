import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, ChevronUp, Send, ShieldCheck, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterSectionProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onAddToast }) => {
  const [email, setEmail] = useState('');

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onAddToast('تم تسجيل بريدك الإلكتروني في النشرة الإخبارية للأشوال بنجاح! ستصلك كشوفات الحصص والبطولات الفاخرة أولاً بأول.', 'success');
    setEmail('');
  };

  return (
    <footer className="relative bg-[#090102] text-right text-slate-300 border-t border-[#D4AF37]/45 pt-28 pb-12 bg-noise overflow-hidden">
      
      {/* Absolute Typographic Watermark (Massive display logo as background element) */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] text-center z-0 w-full whitespace-nowrap">
        <span className="text-[14vw] font-black font-serif tracking-tighter text-white uppercase block">
          ELASHWAL
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 space-y-16">
        
        {/* Top Section: Newsletter Widget & Direct CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-white/5 pb-16">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase block animate-pulse">
              كن جزءاً من مسيرة التميز | النشرة النخبوية
            </span>
            <h3 className="text-3xl font-serif font-black text-white leading-tight">
              اشترك في النشرة البريدية للأشوال
            </h3>
            <p className="text-sm text-slate-400 font-semibold leading-relaxed">
              احصل على جداول تصنيفات الفئات السنية، أخبار المعسكرات الرياضية الخارجية، وعروض الحجز المبكر للملاعب فور إصدارها.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="email"
                required
                placeholder="بريدك الإلكتروني الفاخر"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-5 py-4.5 bg-slate-950/90 border border-white/10 focus:border-[#D4AF37] rounded-2xl text-white text-xs font-semibold outline-none text-right transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA7C11] text-slate-950 font-black rounded-2xl text-xs sm:text-sm hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <span>اشترك الآن</span>
                <Send className="w-4 h-4 text-slate-950 flip-horizontal" />
              </button>
            </form>
          </div>

        </div>

        {/* Middle Footer Grid: Links, Branches list, Contact & Google Maps visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand block (col-span-3) */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-center justify-end gap-3.5">
              <div className="text-right">
                <h2 className="text-lg font-black text-white font-serif">الأشوال أكاديمي</h2>
                <span className="text-[9px] text-[#D4AF37] font-black tracking-widest block uppercase">ELASHWAL ACADEMY</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white to-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37] shadow-xl">
                <span className="font-mono text-sm text-slate-950 font-black">EA</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              تأسست أكاديمية الأشوال لتقديم معايير تدريبية احترافية تحت رعاية طاقم وطني وأجنبي معتمد، لتنشئة جيل يتمتع بلياقة ممتازة وثقة فائقة بالذات.
            </p>

            <div className="flex items-center gap-2.5 justify-end pt-2">
              {[
                { icon: <Instagram className="w-4 h-4 stroke-[1.5]" />, link: 'https://instagram.com/elashwal' },
                { icon: <Twitter className="w-4 h-4 stroke-[1.5]" />, link: 'https://twitter.com/elashwal' },
                { icon: <Youtube className="w-4 h-4 stroke-[1.5]" />, link: 'https://youtube.com/elashwal' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37] text-slate-400 hover:text-[#D4AF37] flex items-center justify-center transition-all duration-300 hover:scale-105"
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-2) */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-sm font-black text-white border-r-2 border-[#D4AF37] pr-2 font-serif">التنقل السريع</h4>
            <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
              {['الرئيسية', 'عن الأكاديمية', 'البرامج الرياضية', 'مدربونا النخبة', 'الاشتراكات والباقات'].map((link, idx) => (
                <li key={idx}>
                  <a href={`#${['home', 'about', 'sports', 'coaches', 'pricing'][idx]}`} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 justify-end group">
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Branches locations (col-span-3) */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-sm font-black text-white border-r-2 border-[#D4AF37] pr-2 font-serif">فروعنا بالرياض</h4>
            <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
              <li className="flex items-start gap-2.5 justify-end text-right">
                <div>
                  <span className="text-white block font-black text-[11px]">الفرع الرئيسي - الملقا</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">تقاطع طريق الملك سلمان مع أنس بن مالك</span>
                </div>
                <MapPin className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              </li>
              <li className="flex items-start gap-2.5 justify-end text-right">
                <div>
                  <span className="text-white block font-black text-[11px]">فرع الياسمين والربيع</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">مجمع صالات الأشوال - حي الياسمين</span>
                </div>
                <MapPin className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              </li>
              <li className="flex items-start gap-2.5 justify-end text-right">
                <div>
                  <span className="text-white block font-black text-[11px]">فرع المغرزات والمجمع التدريبي</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">مجمع الأنشطة الفنية والألعاب الجماعية</span>
                </div>
                <MapPin className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
              </li>
            </ul>
          </div>

          {/* Column 4: Google Map representation (col-span-4) */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-sm font-black text-white border-r-2 border-[#D4AF37] pr-2 font-serif">موقع الأكاديمية الجغرافي</h4>
            
            <div className="rounded-2xl overflow-hidden border border-white/10 h-44 relative group">
              {/* Luxury Styled Map representation with real dynamic visual overlay */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115854.10302728952!2d46.54143419726563!3d24.84871920000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee3165da4a65b%3A0x6734c56be6db1df5!2z2KfZhNix2YrYp9i2!5e0!3m2!1sar!2ssa!4v1719544000000!5m2!1sar!2ssa" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="خريطة فرع الملقا الرئيسي"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center pointer-events-none">
                <span className="px-2.5 py-1 rounded bg-[#5A0B17]/90 text-white text-[9px] font-black border border-[#D4AF37]/35 shadow-lg">
                  المقر الرئيسي بالملقا
                </span>
                <span className="text-[9px] text-[#D4AF37] font-black flex items-center gap-0.5">
                  توجيهات خرائط Google
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end text-xs font-semibold">
              <a href="tel:+966500000000" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <span>+٩٦٦ ٥٠ ٠٠٠ ٠٠٠٠</span>
                <Phone className="w-4 h-4 text-[#D4AF37]" />
              </a>
              <a href="mailto:info@elashwal.com" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <span>info@elashwal.com</span>
                <Mail className="w-4 h-4 text-[#D4AF37]" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar: Copright info & Scroll to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-bold gap-6">
          <p className="order-2 sm:order-1 text-center sm:text-right">
            جميع الحقوق محفوظة للأشوال أكاديمي © ٢٠٢٦. تم التصميم والتنفيذ بمعايير رياضية أوروبية فاخرة.
          </p>

          <button
            onClick={handleScrollTop}
            className="order-1 sm:order-2 p-4 bg-white/[0.02] border border-white/5 hover:border-[#D4AF37] hover:bg-[#5A0B17]/40 text-white rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl flex items-center justify-center"
            aria-label="العودة لأعلى الصفحة"
          >
            <ChevronUp className="w-4.5 h-4.5 text-white" />
          </button>
        </div>

      </div>

    </footer>
  );
};
