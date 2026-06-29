import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Shield, Sparkles, MapPin, CheckSquare, Compass, Check, ArrowRight, User, Phone, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingSectionProps {
  onAddToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ onAddToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    playground: 'الملعب الرئيسي الخماسي (العشبي)',
    date: '2026-06-28',
    timeSlot: '04:00 م - 05:00 م',
    hours: 1,
    name: '',
    phone: '',
    payment: 'نقدي بالفرع'
  });

  const playgroundsList = [
    { 
      name: 'الملعب الرئيسي الخماسي (العشبي)', 
      pricePerHour: 150, 
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop', 
      location: 'المقر الرئيسي - شمال الرياض' 
    },
    { 
      name: 'الملعب السباعي المغطى ببلالين تبريد', 
      pricePerHour: 220, 
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop', 
      location: 'مجمع الأشوال الرياضي - فرع الياسمين' 
    },
    { 
      name: 'صالة كرة السلة والتنس الأولمبية المغلقة', 
      pricePerHour: 180, 
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop', 
      location: 'فرع المغرزات والمجمع التدريبي' 
    }
  ];

  const timeSlots = [
    '04:00 م - 05:00 م',
    '05:00 م - 06:00 م',
    '06:00 م - 07:00 م',
    '07:00 م - 08:00 م',
    '08:00 م - 09:00 م',
    '09:00 م - 10:00 م'
  ];

  const selectedPlaygroundData = playgroundsList.find(p => p.name === bookingData.playground) || playgroundsList[0];
  const totalPrice = selectedPlaygroundData.pricePerHour * bookingData.hours;

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!bookingData.name || !bookingData.phone) {
        onAddToast('يرجى كتابة الاسم ورقم الهاتف بالكامل للمتابعة!', 'error');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    onAddToast(`تم تسجيل طلب حجز [ ${bookingData.playground} ] بتاريخ [ ${bookingData.date} ] بنجاح! سيتم إرسال رابط تأكيد سداد العربون عبر واتساب.`, 'success');
    setCurrentStep(1);
    setBookingData({
      playground: 'الملعب الرئيسي الخماسي (العشبي)',
      date: '2026-06-28',
      timeSlot: '04:00 م - 05:00 م',
      hours: 1,
      name: '',
      phone: '',
      payment: 'نقدي بالفرع'
    });
  };

  return (
    <section id="booking-widget-section" className="relative py-32 bg-[#140708] text-right border-t border-white/5 bg-noise overflow-hidden">
      
      {/* Decorative Blur Spotlight */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#5A0B17]/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-[160px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Title Block */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <span className="text-[#E5D4C0] text-xs font-black tracking-widest uppercase block animate-pulse">
            حجز الملاعب الفخمة | محرك حجز فوري
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-black text-white leading-tight">
            نظام حجز الملاعب الذكي
          </h2>
          <p className="text-sm text-slate-400 font-semibold">
            تصفح وحجز الملاعب المتاحة، صالات التنس الفخمة، والملاعب المغطاة والمكيفة بالكامل بالساعة بأسلوب سهل وشفاف يضاهي أرقى الخدمات العالمية.
          </p>
        </div>

        {/* Master Glass Widget layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Booking Steps Widget (Col-span 7) */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A0B17]/10 rounded-bl-full pointer-events-none" />

            <div className="space-y-8 relative z-10">
              
              {/* Steps Progress Indicator (Booking.com style) */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                {[
                  { step: 1, label: 'الملعب' },
                  { step: 2, label: 'الوقت' },
                  { step: 3, label: 'البيانات' },
                  { step: 4, label: 'الملخص' }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= s.step 
                        ? 'bg-[#E5D4C0] text-slate-950 shadow-lg shadow-[#E5D4C0]/20' 
                        : 'bg-white/5 text-slate-400 border border-white/5'
                    }`}>
                      {currentStep > s.step ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : s.step}
                    </div>
                    <span className={`text-[11px] font-black tracking-wider hidden sm:inline ${
                      currentStep >= s.step ? 'text-white' : 'text-slate-500'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step Contents */}
              <div className="min-h-[280px]">
                
                {/* Step 1: Select Playground */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#E5D4C0]" />
                      اختر الملعب أو الصالة المطلوبة
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">اضغط لتحديد المرفق الفاخر للعب والمباريات الودية:</p>

                    <div className="space-y-4">
                      {playgroundsList.map((p, idx) => {
                        const isSelected = bookingData.playground === p.name;
                        return (
                          <div
                            key={idx}
                            onClick={() => setBookingData({ ...bookingData, playground: p.name })}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                              isSelected 
                                ? 'bg-[#5A0B17]/20 border-[#B76E79]/50 shadow-xl' 
                                : 'bg-slate-950/40 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/5"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-right flex-1">
                              <h4 className="text-sm font-black text-white">{p.name}</h4>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
                                <MapPin className="w-3.5 h-3.5 text-[#E5D4C0]" />
                                {p.location}
                              </p>
                            </div>
                            <div className="text-left">
                              <span className="text-sm font-black text-[#E5D4C0] block">{p.pricePerHour} ر.س</span>
                              <span className="text-[9px] text-slate-400 block font-bold">للساعة الواحدة</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Date & Time Select */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-[#E5D4C0]" />
                      حدد موعد وساعات اللعب
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">اختر تاريخ المباراة وساعات اللعب والتوقيت المناسب:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      
                      {/* Interactive date selector */}
                      <div className="space-y-2">
                        <label className="block text-slate-300 pr-1 font-bold">تاريخ المباراة *</label>
                        <input
                          type="date"
                          required
                          value={bookingData.date}
                          onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                          className="w-full px-4 py-4 bg-slate-950/60 border border-white/10 rounded-xl focus:border-[#B76E79]/55 text-white outline-none font-semibold text-right"
                        />
                      </div>

                      {/* Hours count input */}
                      <div className="space-y-2">
                        <label className="block text-slate-300 pr-1 font-bold">عدد ساعات اللعب المطلوبة *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="6"
                          value={bookingData.hours}
                          onChange={e => setBookingData({ ...bookingData, hours: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-4 bg-slate-950/60 border border-white/10 rounded-xl focus:border-[#B76E79]/55 text-white outline-none font-semibold text-right"
                        />
                      </div>

                    </div>

                    {/* Time slots represented as cards */}
                    <div className="space-y-2.5">
                      <label className="block text-slate-300 text-xs pr-1 font-bold">الفترات الزمنية المتاحة للتأكيد الفوري:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timeSlots.map((slot, idx) => {
                          const isSelected = bookingData.timeSlot === slot;
                          return (
                            <button
                              key={idx}
                              onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                              className={`py-3.5 px-4 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-[#5A0B17] to-[#6E1120] text-white border-[#B76E79]/30 shadow-lg' 
                                  : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/15'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* Step 3: Contact details & payment */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in text-xs font-semibold">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-[#E5D4C0]" />
                      بيانات المسؤول وطريقة الدفع
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">يرجى تسجيل الاسم بالكامل لتثبيت حجزك الرياضي فورا:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-slate-300 pr-1 font-bold">الاسم بالكامل للمسؤول *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: تركي بن خالد الأشول"
                          value={bookingData.name}
                          onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
                          className="w-full px-4 py-4 bg-slate-950/60 border border-white/10 rounded-xl focus:border-[#B76E79]/55 text-white outline-none font-semibold text-right text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-300 pr-1 font-bold">رقم جوال للتواصل الفوري *</label>
                        <input
                          type="tel"
                          required
                          placeholder="05xxxxxxxx"
                          value={bookingData.phone}
                          onChange={e => setBookingData({ ...bookingData, phone: e.target.value })}
                          className="w-full px-4 py-4 bg-slate-950/60 border border-white/10 rounded-xl focus:border-[#B76E79]/55 text-white outline-none font-semibold text-right text-xs"
                        />
                      </div>
                    </div>

                    {/* Booking payment selection */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-slate-300 pr-1 font-bold">طريقة الدفع والتسوية المفضلة:</label>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <label className="p-4 bg-slate-950/60 border border-white/5 hover:border-[#B76E79]/30 rounded-xl flex items-center justify-between cursor-pointer transition-all">
                          <span>نقدي عند الحضور</span>
                          <input
                            type="radio"
                            name="payment"
                            checked={bookingData.payment === 'نقدي بالفرع'}
                            onChange={() => setBookingData({ ...bookingData, payment: 'نقدي بالفرع' })}
                            className="accent-[#B76E79]"
                          />
                        </label>
                        <label className="p-4 bg-slate-950/60 border border-white/5 hover:border-[#B76E79]/30 rounded-xl flex items-center justify-between cursor-pointer transition-all">
                          <span>سداد أونلاين (عربون مدى)</span>
                          <input
                            type="radio"
                            name="payment"
                            checked={bookingData.payment === 'سداد أونلاين'}
                            onChange={() => setBookingData({ ...bookingData, payment: 'سداد أونلاين' })}
                            className="accent-[#B76E79]"
                          />
                        </label>
                      </div>
                    </div>

                  </div>
                )}

                {/* Step 4: Summary & Finish */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-[#E5D4C0]" />
                      مراجعة وتأكيد الحجز النهائي
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">يرجى التأكد من تفاصيل طلب الحجز قبل النقر على زر التأكيد الفوري:</p>

                    <div className="p-6 bg-slate-950/80 border border-white/5 rounded-2xl space-y-4 text-xs font-semibold leading-relaxed">
                      
                      <div className="flex justify-between items-center text-slate-300">
                        <span>المرفق المطلوب:</span>
                        <span className="font-bold text-white">{bookingData.playground}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-slate-300">
                        <span>تاريخ وتوقيت الحجز:</span>
                        <span className="font-bold text-white">{bookingData.date} | {bookingData.timeSlot}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span>المدة المقررة:</span>
                        <span className="font-bold text-white">{bookingData.hours} ساعة</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span>المسؤول والتواصل:</span>
                        <span className="font-bold text-white">{bookingData.name} ({bookingData.phone})</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300 border-t border-white/5 pt-3">
                        <span>طريقة الدفع:</span>
                        <span className="font-bold text-[#E5D4C0]">{bookingData.payment}</span>
                      </div>

                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Step Navigation Controls (Buttons) */}
            <div className="flex items-center gap-4 pt-8 border-t border-white/5 relative z-10">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  السابق
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#5A0B17] to-[#6E1120] border border-[#B76E79]/20 hover:border-[#B76E79]/50 text-white font-black rounded-xl text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg"
                >
                  الخطوة التالية المتابعة
                  <ArrowRight className="w-4 h-4 text-[#E5D4C0]" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 py-4 bg-gradient-to-r from-[#5A0B17] via-[#6E1120] to-[#801426] text-white font-black rounded-xl text-xs sm:text-sm border border-[#B76E79]/30 hover:border-[#B76E79]/50 transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.01]"
                >
                  تأكيد وإرسال طلب الحجز الآن
                  <Sparkles className="w-4 h-4 text-[#E5D4C0] animate-pulse" />
                </button>
              )}
            </div>

          </div>

          {/* Live Cost Preview Card (Right Col-Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-gradient-to-b from-[#1C0407] to-slate-950 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-24 h-24 bg-[#5A0B17]/10 rounded-br-full blur-2xl pointer-events-none" />

              <div className="h-56 overflow-hidden relative">
                <img
                  src={selectedPlaygroundData.image}
                  alt={selectedPlaygroundData.name}
                  className="w-full h-full object-cover brightness-75 contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140708] via-transparent to-transparent"></div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-gradient-to-r from-[#5A0B17] via-[#6E1120] to-[#801426] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-lg border border-[#B76E79]/30 uppercase tracking-widest">
                    المرفق الرياضي المحدد
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6 text-right">
                
                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-black text-white">{selectedPlaygroundData.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-end font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#E5D4C0]" />
                    {selectedPlaygroundData.location}
                  </p>
                </div>

                <div className="border-t border-b border-white/5 py-4 space-y-3 text-xs font-semibold">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>قيمة حجز الساعة:</span>
                    <span className="font-bold text-white">{selectedPlaygroundData.pricePerHour} ر.س / ساعة</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>عدد الساعات المختارة:</span>
                    <span className="font-bold text-white">{bookingData.hours} ساعات</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>توقيت اللعب:</span>
                    <span className="font-bold text-white">{bookingData.timeSlot}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 block font-black">إجمالي قيمة الاستئجار</span>
                    <span className="text-[9px] text-slate-500 block font-semibold">شامل القيمة المضافة بالكامل</span>
                  </div>
                  <div className="text-3xl font-black text-[#E5D4C0] flex items-baseline gap-1">
                    {totalPrice}
                    <span className="text-xs text-slate-300 font-bold">ر.س</span>
                  </div>
                </div>

                <div className="p-4 bg-[#5A0B17]/20 border border-[#B76E79]/20 rounded-2xl flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#E5D4C0] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                    سياسة الإلغاء المرنة: يمكنك طلب تعديل موعد الاستئجار مجاناً قبل ٢٤ ساعة من موعد الحجز الفعلي عبر التواصل مع الإدارة الفنية.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
