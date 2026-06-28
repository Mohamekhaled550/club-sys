import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: "ما هي الأعمار المقبولة للتسجيل في أكاديمية الأشوال الرياضية؟",
      a: "نحن نرحب بالبراعم واللاعبين الواعدين من سن ٥ سنوات وحتى ٢٢ سنة، حيث يتم تقسيم المجموعات الرياضية بشكل علمي دقيق حسب الفئة العمرية والمستوى الفني والبدني الحالي لضمان الاستفادة الكاملة."
    },
    {
      q: "هل توفر الأكاديمية وسائل مواصلات آمنة لنقل اللاعبين؟",
      a: "نعم، توفر الأكاديمية باقات اشتراك نقل شاملة وآمنة عبر أسطول من الحافلات الفاخرة والمكيفة والمجهزة بالكامل، تحت إشراف مشرفين رياضيين لضمان سلامة الأبطال من وإلى منازلهم."
    },
    {
      q: "هل يمكن حجز الملاعب بشكل فردي للأصدقاء والعائلات؟",
      a: "بكل تأكيد، نوفر نظام حجز مستقل متطور للملاعب الرياضية (ملاعب كرة القدم الخماسية والسباعية، وملاعب التنس والسباحة) بالساعة بأسعار تنافسية ممتازة وخيارات دفع مرنة عبر موقعنا الإلكتروني."
    },
    {
      q: "كيف تتابع الإدارة والمدربون تطور اللاعب مع ولي الأمر؟",
      a: "نوفر لجميع أولياء الأمور واللاعبين بوابة رقمية متكاملة (Client Portal) مخصصة لمطالعة نسب الحضور، والتقييمات الفنية الأسبوعية للممدربين، ومستويات اللياقة البدنية والوزن، وجداول الحصص مباشرة وبشكل حي."
    },
    {
      q: "هل يمنح اللاعب شهادات معتمدة دولياً ومحلياً عند اجتياز الدورات؟",
      a: "نعم، يحصل اللاعب عند اجتياز الاختبارات الفنية الدورية المقررة على شهادات معتمدة رسمياً من الاتحادات الرياضية السعودية والآسيوية والدولية (خاصة في رياضات الدفاع عن النفس كالكاراتيه، وبطولات السباحة المختلفة)."
    }
  ];

  const filteredFaqs = faqs.filter(f => f.q.includes(searchQuery) || f.a.includes(searchQuery));

  return (
    <section id="faq" className="relative py-32 bg-[#140708] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Decorative Blur Spotlight */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#5A0B17]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase block animate-pulse">
            الاستفسارات الشائعة | الدعم والإرشاد الشامل
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            الأسئلة الشائعة للأشوال
          </h2>
          <p className="text-sm text-slate-400 font-semibold">
            اطلع على الإجابات الوافية لأكثر الأسئرة تكراراً لتوفير وقتك وجهدك، أو تواصل مباشرة مع فريق خدمة العملاء الفوري عبر واتساب.
          </p>
        </div>

        {/* Search Input for FAQs */}
        <div className="mb-10 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="ابحث هنا عن سؤالك الرياضي..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs text-white text-right focus:border-[#D4AF37] outline-none transition-all placeholder:text-slate-500 font-semibold"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/45 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl"
                >
                  
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 text-xs sm:text-sm font-black text-white hover:text-[#D4AF37] transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 text-right font-sans">
                      <HelpCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-white/5 bg-white/[0.01]' : 'max-h-0'
                    }`}
                  >
                    <p className="p-5 sm:p-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                      {faq.a}
                    </p>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-slate-400">
              لا توجد أسئلة تطابق بحثك المكتوب. جرب البحث بكلمة أخرى مثل (بوابة، حجز، ملاعب).
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
