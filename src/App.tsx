import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Shield,
  Phone,
  Mail,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Award,
  BookOpen,
  ArrowUpRight,
  Heart
} from 'lucide-react';

import { Doctor, Service, Booking } from './types';
import { DOCTORS, SERVICES } from './data';
import BookingModal from './components/BookingModal';
import SymptomChecker from './components/SymptomChecker';
import PriceEstimator from './components/PriceEstimator';
import ReviewSection from './components/ReviewSection';
import BrushTimer from './components/BrushTimer';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  
  // Custom doctor bio modal
  const [activeBioDoctor, setActiveBioDoctor] = useState<Doctor | null>(null);

  // App active slider control
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);

  // Active user bookings summary
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Privacy Policy modal control
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Load existing bookings on startup
  useEffect(() => {
    const local = localStorage.getItem('dental_bookings');
    if (local) {
      setMyBookings(JSON.parse(local));
    }
  }, [isBookingOpen]);

  // Handle live clinic status indicator (8:00 AM - 6:00 PM)
  const getClinicStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 8 && hours < 18) {
      return { open: true, text: '• مفتوح الآن (حتى ٦:٠٠ مساءً)' };
    }
    return { open: false, text: '• مغلق الآن (يفتح في ٨:٠٠ صباح الغد)' };
  };
  const status = getClinicStatus();

  // Highlighted Hero Background Photos
  const heroBackgrounds = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1500', // Dental lighting operation
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1500', // Diagnostic model
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1500'  // Polishing dental cleaning
  ];

  // Helper selectors
  const handleOpenBooking = (serviceId?: string, doctorId?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  const deleteBooking = (eventId: string) => {
    const filtered = myBookings.filter(b => b.id !== eventId);
    setMyBookings(filtered);
    localStorage.setItem('dental_bookings', JSON.stringify(filtered));
  };

  return (
    <div className="min-h-screen bg-clinic-dark text-[#f3f4f6] font-sans overflow-x-hidden" dir="rtl">
      
      {/* ───────────────── GLASS NAVIGATION BAR ───────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-clinic-dark/45 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Modern custom logo */}
            <a href="#" className="flex items-center gap-2 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-clinic-teal to-cyan-400 text-white shadow-lg shadow-clinic-teal/20">
                <Sparkles className="h-5 w-5 fill-white/10" />
              </span>
              <div className="font-display">
                <span className="font-extrabold text-lg text-white">دويدار</span>
                <span className="font-normal text-xs text-gray-400 block -mt-1 leading-none">لطب الأسنان</span>
              </div>
            </a>

            {/* Middle: Desktop NavLinks */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
              <a href="#" className="hover:text-clinic-accent transition-colors font-sans">الرئيسية</a>
              <a href="#services" className="hover:text-clinic-accent transition-colors font-sans">خدماتنا</a>
              <a href="#calculator" className="hover:text-clinic-accent transition-colors font-sans">حساب التكلفة</a>
              <a href="#about" className="hover:text-clinic-accent transition-colors font-sans">من نحن</a>
              <a href="#reviews" className="hover:text-clinic-accent transition-colors font-sans">آراء المرضى</a>
              <a href="#contact" className="hover:text-clinic-accent transition-colors font-sans">اتصل بنا</a>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <span className={`text-[10px] ${status.open ? 'text-emerald-400' : 'text-amber-500'} font-sans`}>
                {status.text}
              </span>
              <button
                onClick={() => handleOpenBooking()}
                className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-clinic-dark hover:bg-clinic-accent hover:text-clinic-dark transition-all duration-300 shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                id="navbar_book_call_btn"
              >
                احجز موعداً
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>

            {/* Mobile Hamburger toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                id="toggle_mobile_menu_btn"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-b border-white/5 bg-clinic-dark/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 text-sm font-semibold text-gray-300"
            >
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white transition-colors">الرئيسية</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white transition-colors">خدماتنا</a>
              <a href="#calculator" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white transition-colors">حساب التكلفة</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white transition-colors">من نحن</a>
              <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white transition-colors">آراء المرضى</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white transition-colors">اتصل بنا</a>
              
              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <span className={`text-[10px] items-center font-mono ${status.open ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {status.text}
                </span>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleOpenBooking(); }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-full bg-clinic-accent px-5 py-3 text-xs font-bold text-clinic-dark hover:bg-white transition-all cursor-pointer"
                  id="mobile_book_call_btn"
                >
                  احجز موعداً
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ───────────────── HERO COVER SECTION ───────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
        {/* Dynamic Background Image Layers with gentle crossfades */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackgrounds[heroSlideIndex % heroBackgrounds.length]}
            alt="Pristine Dental Care Background"
            className="w-full h-full object-cover opacity-35 filter brightness-[0.7] transition-all duration-1000 scale-105"
          />
          {/* Subtle glowing mesh highlights over patients */}
          <div className="absolute inset-0 bg-gradient-to-t from-clinic-dark via-clinic-dark/80 to-transparent z-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-clinic-dark via-transparent to-clinic-dark/50 z-1" />
          <div className="mesh-glow bg-clinic-teal top-1/4 left-1/4 h-[400px] w-[400px]" />
          <div className="mesh-glow bg-cyan-400 bottom-1/4 right-10 h-[300px] w-[300px]" />
        </div>

        {/* Hero container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Big Headline */}
            <div className="lg:col-span-8 space-y-8 text-right">
              
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-clinic-accent/10 px-3.5 py-1 text-xs font-medium text-clinic-accent border border-clinic-accent/20 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400/10" />
                  <span>عهد جديد من الراحة الخالية من الألم</span>
                </div>
                
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.4rem] xl:text-[2.85rem] font-bold text-white leading-snug sm:leading-normal lg:leading-[1.35] select-none">
                  طب أسنان حديث برعاية متكاملة <br className="hidden sm:inline" />
                  وعناية <span className="text-transparent bg-clip-text bg-gradient-to-l from-clinic-accent to-cyan-300">لطيفة وخالية تماماً من الألم.</span>
                </h1>
              </motion.div>

              {/* Slider Pill Toggles at bottom left with active state highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                <button
                  onClick={() => { setHeroSlideIndex(0); handleOpenBooking('dental_checkups'); }}
                  className={`rounded-full border font-display text-xs px-5 py-2.5 transition-all cursor-pointer ${
                    heroSlideIndex === 0 
                      ? 'bg-clinic-accent text-clinic-dark border-clinic-accent/30 font-bold shadow-lg shadow-clinic-accent/15' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                  id="choice_pills_checkups"
                >
                  فحص الأسنان
                </button>
                <button
                  onClick={() => { setHeroSlideIndex(1); handleOpenBooking('teeth_cleaning'); }}
                  className={`rounded-full border font-display text-xs px-5 py-2.5 transition-all cursor-pointer ${
                    heroSlideIndex === 1 
                      ? 'bg-clinic-accent text-clinic-dark border-clinic-accent/30 font-bold shadow-lg shadow-clinic-accent/15' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                  id="choice_pills_cleaning"
                >
                  تنظيف الأسنان
                </button>
                <button
                  onClick={() => { setHeroSlideIndex(2); handleOpenBooking('tooth_filling'); }}
                  className={`rounded-full border font-display text-xs px-5 py-2.5 transition-all cursor-pointer ${
                    heroSlideIndex === 2 
                      ? 'bg-clinic-accent text-clinic-dark border-clinic-accent/30 font-bold shadow-lg shadow-clinic-accent/15' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                  id="choice_pills_filling"
                >
                  حشوات تجميلية
                </button>
                <button
                  onClick={() => { setHeroSlideIndex(0); handleOpenBooking('gum_treatment'); }}
                  className="rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-display text-xs px-5 py-2.5 cursor-pointer hover:border-white/20 transition-all font-bold text-clinic-accent"
                  id="choice_pills_gum"
                >
                  زراعة الأسنان الفورية
                </button>
                <button
                  onClick={() => { setHeroSlideIndex(1); handleOpenBooking('retainers'); }}
                  className="rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-display text-xs px-5 py-2.5 cursor-pointer hover:border-white/20 transition-all"
                  id="choice_pills_retainers"
                >
                  تركيبات وتيجان الزيركونيا
                </button>
              </motion.div>
            </div>

            {/* Right Column: Descriptions & Slide controls */}
            <div className="lg:col-span-4 space-y-6 text-right flex flex-col justify-end">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <p className="text-xs sm:text-sm text-slate-300/90 font-sans leading-relaxed text-right">
                  رعاية أسنان متميزة لابتسامة صحية وواثقة في كل الأعمار — تُقدم بكامل معايير الراحة والدقة والأمان. وعيادتنا مجهزة بالكامل للتخلص من قلق زيارة طبيب الأسنان نهائياً.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── SIGNATURE DENTAL SERVICES SECTION (Prisite Light Theme) ───────────────── */}
      <section id="services" className="bg-light-cream text-clinic-dark py-24 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-clinic-dark/10 pb-10">
            <div className="md:col-span-8 text-right">
              <span className="text-xs uppercase text-clinic-teal font-extrabold block mb-1 font-sans">ميزاتنا / اكتشف باقاتنا الفاخرة</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold">خدمات وعلاجات الأسنان</h2>
            </div>
            <div className="md:col-span-4 text-right">
              <p className="text-xs text-slate-500 leading-relaxed">
                جرب رعاية الأسنان الحديثة المقدمة بكل راحة ودقة واهتمام بالتفاصيل. توفر عيادتنا بيئة هادئة ومرحبة مصممة لجعل كل زيارة خالية تماماً من التوتر والقلق.
              </p>
            </div>
          </div>

          {/* Grid list / Service cards with links to scheduler */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Reviews badge floating (Matches bottom-left block of mockup layout) */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-clinic-teal/[0.04] border border-clinic-teal/10 text-right">
              <div className="space-y-4">
                <div className="flex -space-x-3 overflow-hidden">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" alt="Sarah J" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Marcus V" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" alt="Linda Z" />
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-clinic-teal text-white ring-2 ring-white text-[10px] font-bold">+5</div>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-xl text-clinic-dark">+٥٠ تقييم حقيقي</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">اكتشف مراجعات مرضانا السعداء وخبرتهم اللطيفة والمريحة تحت رعايتنا الطبية المتكاملة.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-clinic-dark/5 text-right">
                <p className="text-xs italic text-slate-500 leading-relaxed font-sans font-medium">
                  &ldquo;تجربة راقية مريحة؛ أسنان نظيفة وابتسامة مبهجة لجميع أفراد عائلتي! ممتنين للغاية لفريق عيادة الدكتور حازم دويدار.&rdquo;
                </p>
              </div>
            </div>

            {/* Service card 1: Teeth Cleaning */}
            <div
              onClick={() => handleOpenBooking('teeth_cleaning')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-clinic-teal shadow-sm hover:shadow-lg transition-all duration-300"
              id="signature_service_card_cleaning"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={SERVICES[0].imageUrl}
                  alt={SERVICES[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-[10px] uppercase font-bold text-clinic-teal shadow-md font-sans">
                  ★ الأكثر طلباً
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-semibold">
                  انقر للحجز السريع والمباشر الآن
                </div>
              </div>
              <div className="p-5 text-right">
                <h3 className="font-display text-lg font-bold group-hover:text-clinic-teal transition-colors">تنظيف وتلميع الأسنان</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  إزالة متقدمة بالترددات فوق الصوتية للبلاك والترسبات الجيرية العميقة المتراكمة وتلميع المينا بلمسة ناعمة لإشراق رائع وصحي للأسنان.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-clinic-teal pt-3 border-t border-slate-100">
                  <span>استكشف تفاصيل الباقة</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                </div>
              </div>
            </div>

            {/* Service card 2: Dental Checkups */}
            <div
              onClick={() => handleOpenBooking('dental_checkups')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-clinic-teal shadow-sm hover:shadow-lg transition-all duration-300"
              id="signature_service_card_checkup"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={SERVICES[1].imageUrl}
                  alt={SERVICES[1].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-semibold">
                  انقر للحجز السريع والمباشر الآن
                </div>
              </div>
              <div className="p-5 text-right">
                <h3 className="font-display text-lg font-bold group-hover:text-clinic-teal transition-colors">الفحص والتشخيص الشامل</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  تشخيص دقيق ما قبل العلاج ومسح رقمي آمن تماماً وثلاثي الأبعاد للتحقق من سلامة اللثة والأسنان والكشف المبكر جداً عن أي مشاكلات.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-clinic-teal pt-3 border-t border-slate-100">
                  <span>استكشف تفاصيل الباقة</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Services line including Dental Veneers */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
            
            {/* Service card 3: Dental Veneers */}
            <div
              onClick={() => handleOpenBooking('dental_veneers')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-clinic-teal p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition-all duration-300 text-right"
              id="signature_service_card_veneers"
            >
              <img
                src={SERVICES[2].imageUrl}
                alt={SERVICES[2].name}
                className="h-32 sm:h-auto sm:w-44 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between text-right">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-clinic-teal block mb-1 font-sans">تحفة تجميلية راقية</span>
                    <h3 className="font-display text-lg font-bold group-hover:text-clinic-teal transition-colors">عدسات الفينير التجميلية</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-normal">
                    حوّل تماماً شكل وأبعاد ولون أسنانك مع قشور البورسلين النقية المصممة بدقة متناهية لتحقيق تماثل رائع ومستدام لمظهر وجهك.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-clinic-teal">
                  <span>احجز موعد استشارة الفينير لتصميم الابتسامة الآن</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Quick interactive shortcut block for symptoms check */}
            <div className="rounded-2xl bg-gradient-to-tr from-[#1e3a4e] to-[#043440] p-6 text-white text-right flex flex-col justify-between border border-white/5 relative overflow-hidden">
              <div className="mesh-glow bg-clinic-teal -top-16 -right-16 h-32 w-32" />
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-clinic-accent font-bold font-sans">المحرك الرقمي للتشخيص</span>
                <h3 className="font-display text-xl font-extrabold text-white">هل تعاني من حساسية أو ألم مفاجئ في الأسنان؟</h3>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm">استخدم أداة فحص الأعراض الرقمية الفورية بالأسفل لتحليل مؤشرات الألم والحصول على توصية طبية فورية سريعة قبل المغادرة.</p>
              </div>
              <a href="#calculator" className="inline-flex items-center gap-1.5 text-xs font-bold text-clinic-accent hover:text-white transition-colors mt-6">
                ابدأ التشخيص الطبي التفاعلي للسن
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────── EXCELLENCE & DYNAMIC STATS SECTION ───────────────── */}
      <section id="about" className="py-24 relative overflow-hidden bg-clinic-dark text-white text-right">
        <div className="absolute inset-0 z-0">
          <div className="mesh-glow bg-clinic-teal bottom-10 left-10 h-[300px] w-[300px] opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Premium dentistry operation portrait */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-clinic-teal to-cyan-400 opacity-20 blur-lg" />
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                alt="Excellent Care Operations Clinic"
                className="relative rounded-2xl w-full h-[400px] object-cover border border-white/10"
              />
              
              {/* Floating diagnostic badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-clinic-dark p-4 flex items-center gap-3.5 shadow-xl max-w-xs">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-xs">تعقيم وأمان عيادي مطلق</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">أدوات حديثة معقمة بالكامل ١٠٠٪ مع تنقية ونقاء مستمر للهواء.</p>
                </div>
              </div>
            </div>

            {/* Right side: Information headings and interactive counter specs */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase text-clinic-accent font-bold font-sans">عن العيادة / التميز في الرعاية</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  طب أسنان احترافي <br />برعاية حانية فائقة
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed font-sans max-w-lg">
                  يجمع الدكتور حازم دويدار بين الفحص الرقمي وحسابات التكلفة وخطط العلاج المخصصة بشكل متقن. وتلتزم العيادة بتقديم الرعاية بكامل الودية وبطريقة مريحة للغاية لتبقى ابتسامتكم دافئة دائماً.
                </p>
              </div>

              {/* Stats metric bar (Matches mockup beautifully) */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-white/15 py-8 text-center font-sans">
                <div className="space-y-1">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#22d3ee] block">٩٨٪</span>
                  <span className="text-[10px] uppercase text-gray-400 font-bold leading-snug">معدل رضا وسعادة المرضى</span>
                </div>
                <div className="space-y-1">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#22d3ee] block">+٢٠٠</span>
                  <span className="text-[10px] uppercase text-gray-400 font-bold leading-snug">ابتسامة تم تجميلها وصقلها</span>
                </div>
                <div className="space-y-1">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#22d3ee] block">٤.٩ / ٥</span>
                  <span className="text-[10px] uppercase text-gray-400 font-bold leading-snug">التقييم العام للدكتور حازم</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── DYNAMIC APPOINTMENTS RECEPTION DESK ───────────────── */}
      {myBookings.length > 0 && (
        <section className="bg-clinic-teal/20 border-t border-b border-clinic-teal/30 py-8 relative z-10 text-right">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-clinic-accent text-clinic-dark">
                <Calendar className="h-4 w-4 stroke-[2.5]" />
              </span>
              <div>
                <h3 className="font-display font-bold text-sm text-white">مكتب الاستقبال المباشر للحجوزات</h3>
                <p className="text-[10px] text-gray-400 font-sans">مواعيدك الطبية المحجوزة والنشطة في هذه الجلسة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBookings.map((b) => {
                const s = SERVICES.find(srv => srv.id === b.serviceId) || SERVICES[0];
                const d = DOCTORS.find(doc => doc.id === b.doctorId) || DOCTORS[0];
                return (
                  <div key={b.id} className="rounded-xl bg-[#122430]/90 border border-white/10 p-4 relative overflow-hidden flex flex-col justify-between text-right">
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="absolute top-3 left-3 text-gray-500 hover:text-red-400 transition-colors"
                      aria-label="Cancel appointment"
                      id={`delete_booking_btn_${b.id}`}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <img src={d.image} alt={d.name} className="h-8 w-8 rounded-full object-cover border border-clinic-accent/35" />
                        <div>
                          <h4 className="font-bold text-xs text-white">{s.name}</h4>
                          <span className="text-[10px] text-clinic-accent block font-sans">{d.name}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-gray-300 font-sans">
                        <p>🗓️ التاريخ: {b.date}</p>
                        <p>⏰ وقت الجلسة: {b.timeSlot}</p>
                        <p>👤 اسم المريض: {b.patientName}</p>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold text-emerald-400">
                      <span>✓ تم تأكيد الحجز وتسجيله</span>
                      <span className="font-mono text-gray-500">المدة: {s.durationMinutes} دقيقة</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── INTERACTIVE CLINICAL CARE TOOLS ───────────────── */}
      <section id="calculator" className="py-20 bg-clinic-dark relative z-10 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase text-clinic-accent font-bold font-sans">المركز الطبي التفاعلي الذكي</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">الأدوات العلاجية التفاعلية</h2>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              جرب موقت تفريش الأسنان التفاعلي، واشرح أعراض شعور ألم سنّك، أو خطط الجلسات لخطتك العلاجية المخصصة قبل مباشرة الحجز.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Symptom diagnostic checker */}
            <div className="lg:col-span-8 space-y-8">
              <SymptomChecker onSelectServiceToBook={(srvId) => handleOpenBooking(srvId)} />
              <PriceEstimator onBookServicePackage={(srvId) => handleOpenBooking(srvId)} />
            </div>

            {/* Right: Helper Brushing Timer + Fun educational badge */}
            <div className="lg:col-span-4 space-y-8">
              <BrushTimer />

              <div className="rounded-2xl border border-white/5 bg-[#122430]/70 p-5 space-y-3 text-right">
                <h4 className="font-display font-bold text-sm text-white">هل تعاني من حالة أسنان طارئة؟</h4>
                <p className="text-[11px] text-gray-300 leading-normal font-sans">
                  إذا كنت تعاني من كسر حاد في الطواحن، انتفاخ في اللثة، أو آلام متواصلة في جذر السن، تخطّ القياسات والتقديرات الطبية واحجز جلسة إسعافية عاجلة فوراً.
                </p>
                <button
                  onClick={() => handleOpenBooking('tooth_filling')}
                  className="w-full rounded-xl bg-red-500/20 hover:bg-red-500 text-red-100 hover:text-white border border-red-500/30 font-display font-medium text-xs py-2.5 transition-all text-center cursor-pointer"
                  id="emergency_direct_booking_btn"
                >
                  حجز موعد طوارئ فوري مباشر
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────── PATIENT TESTIMONIALS SECTION ───────────────── */}
      <section id="reviews" className="bg-light-cream text-clinic-dark py-24 relative z-10 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-b border-clinic-dark/10 pb-8">
            <div className="text-right">
              <span className="text-xs uppercase text-clinic-teal font-extrabold block mb-1 font-sans">آراء مرضانا السعداء / سجل التقييم المباشر</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold">تجارب وآراء المرضى</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                اقرأ التقييمات الحية المنشورة بواسطة مرضى حقيقيين تحت رعايتنا الطبية المتكاملة. نرحب بكتابتك وتقييمك لعيادتنا في أي وقت ومشاركتنا رأيك.
              </p>
            </div>
          </div>

          <ReviewSection />
        </div>
      </section>

      {/* ───────────────── CLINICAL CONTACT & LIVE MAP PLACEHOLDER SECTION ───────────────── */}
      <section id="contact" className="py-20 bg-clinic-dark text-white text-right relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: WhatsApp and Calling Quick Action Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase text-[#22d3ee] font-bold font-sans">بوابة التواصل المباشر السريعة والمعتمدة</span>
                <h2 className="font-display text-2xl font-extrabold text-white">تواصل مع العيادة</h2>
                <p className="text-xs text-gray-300 leading-relaxed max-w-md font-sans">تواصل مباشرة مع إدارة العيادة أو طاقمنا الطبي وطرح كافة استشاراتك وأسئلتك بأمان تام.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 space-y-6 text-right">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold text-clinic-accent">تجاوب فوري بدون بريد إلكتروني وبدون باك اند</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    لضمان أقصى درجات حماية خصوصيتكم ولتجنب تأخير الرسائل عبر الخوادم، تم إلغاء المراسلات الورقية والاستمارات الإلكترونية. يمكنكم الآن من خلال كبسة زر واحدة فتح محادثة فورية معنا عبر واتساب لمعرفة التفاصيل أو الحصول على استشارة فورية، أو التحدث إلينا عبر الهاتف.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://wa.me/201018784470?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D9%88%D8%B1%D8%AD%D9%85%D8%A9%20%D8%A7%D9%84%D9%84%D9%87%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%B9%D9%8A%D8%A7%D8%AF%D8%A7%D8%AA%20%D8%AF%D9%88%D9%8A%D9%84%D8%A7%D8%B1%20%D9%84%D8%B7%D8%A8%20%D8%A7%D9%84%D8%A3%D8%B3%D9%86%D8%A7%D9%86%D9%91."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-medium text-xs py-3.5 px-6 transition-all hover:shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    راسلنا واتساب الآن واستفسر
                  </a>

                  <a
                    href="tel:+201018784470"
                    className="flex items-center justify-center gap-2.5 rounded-xl bg-clinic-accent hover:bg-cyan-400 text-clinic-dark font-display font-medium text-xs py-3.5 px-6 transition-all hover:shadow-lg shadow-clinic-accent/10 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    اتصال هاتفي مباشر بالرعاية
                  </a>
                </div>

                <div className="pt-4 border-t border-white/5 text-center text-xs text-gray-400 font-sans">
                  متاحون لتلقي المكالمات والرسائل من <span className="text-white font-bold">السبت إلى الخميس</span> • من <span className="text-white font-bold">٠٨:٠٠ صباحًا</span> وحتى <span className="text-white font-bold">٠٦:٠٠ مساءً</span>
                </div>
              </div>
            </div>

            {/* Right: General coordinates and Mock Map */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-clinic-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-white">عنوان العيادة الرئيسي</h4>
                    <p className="text-xs text-gray-400 mt-1 font-sans">محافظة الدقهلية، مركز أجا، قرية صهرجت الصغرى، بجوار استوديو الأهرام</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="h-5 w-5 text-clinic-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-white">التواصل المباشر والفيسبوك</h4>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61578614963460" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-white transition-colors block mt-1 font-sans underline"
                    >
                      صفحتنا الرسمية على فيسبوك: دويدار لطب الأسنان (اضغط هنا)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <svg className="h-3 w-3 fill-emerald-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-white">رقم المحادثة والاتصال الهاتفي الموحد</h4>
                    <p className="text-xs text-gray-400 mt-1 font-sans font-semibold text-clinic-accent">+20 10 18784470</p>
                  </div>
                </div>
              </div>

              {/* Simulated Map visual placeholder */}
              <div className="rounded-2xl border border-white/10 overflow-hidden relative h-48 bg-slate-800">
                {/* Visual texture representing streets and location */}
                <div className="absolute inset-0 bg-[#0d161d] opacity-90 p-4 font-mono text-[9px] text-[#22d3ee]/60 select-none overflow-hidden space-y-1 text-right" dir="ltr">
                  <div>┌─── DWEDAR DENTAL - AGHA DAKAHLIA ──────────┐</div>
                  <div>│  [ El-Ahram Studio Street ]                  │</div>
                  <div>│   ===========  ■ Dwedar Dental Clinic       │</div>
                  <div>│                ★ Suite 1, Medical Complex   │</div>
                  <div>│  [ Soharagt El Soghra road ]                │</div>
                  <div>│   ===========                               │</div>
                  <div>└────────────────────────────────────────────┘</div>
                  <div className="absolute bottom-4 right-4 rounded bg-clinic-dark border border-white/10 px-2 py-1 text-white flex items-center gap-1">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-sans">عيادة دويدار - صهرجت الصغرى</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────── COMPREHENSIVE COMPLIANCE FOOTER ───────────────── */}
      <footer className="bg-clinic-dark border-t border-white/5 py-12 text-center text-xs text-gray-500 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="font-display text-sm font-semibold text-white text-center">عيادة الدكتور حازم دويدار لطب الأسنان الحديث</p>
          <div className="flex justify-center flex-wrap gap-6 text-gray-400 text-xs">
            <a href="https://www.facebook.com/profile.php?id=61578614963460" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">تابعنا على فيسبوك</a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsPrivacyOpen(true);
              }}
              className="hover:text-white transition-colors"
            >
              سياسة الخصوصية للمريض
            </a>
            <a href="#" className="hover:text-white transition-colors">سجل جمعية أطباء الأسنان الرسمية المعتمد</a>
          </div>
          <p className="text-[10px] text-gray-600 leading-normal text-center font-sans">
            &copy; {new Date().getFullYear()} عيادة الدكتور حازم دويدار لطب الأسنان - صهرجت الصغرى. جميع الحقوق محفوظة ومحمية تلقائياً. صُممت ضمن أطر الراحة والتحفيز لتقديم باقة فائقة الجودة.
          </p>
        </div>
      </footer>

      {/* ───────────────── DOCTOR BIO MODAL DRAWER ───────────────── */}
      <AnimatePresence>
        {activeBioDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBioDoctor(null)}
              className="fixed inset-0 bg-clinic-dark/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#122430] to-clinic-dark text-white shadow-2xl flex flex-col max-h-[90vh] text-right"
              dir="rtl"
            >
              {/* Sticky Header with Doctor Photo, Title, and Specialty */}
              <div className="p-5 pb-3 border-b border-white/5 relative shrink-0">
                <button
                  onClick={() => setActiveBioDoctor(null)}
                  className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  id="close_bio_modal_btn"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex gap-4 items-center">
                  <img
                    src={activeBioDoctor.image}
                    alt={activeBioDoctor.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border-2 border-clinic-accent/30 shrink-0 select-none"
                  />
                  <div className="text-right">
                    <span className="text-[9px] sm:text-[10px] uppercase bg-clinic-accent/15 px-2 py-0.5 rounded text-clinic-accent border border-clinic-accent/10 font-sans inline-block">طبيب ممارس معتمد</span>
                    <h3 className="font-display text-lg sm:text-xl font-bold mt-1 leading-tight">{activeBioDoctor.name}</h3>
                    <p className="text-xs text-gray-300 font-semibold mt-0.5">{activeBioDoctor.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Body with narrative, specs, and timing cards */}
              <div className="p-5 py-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-white/15 text-xs text-gray-300">
                <p className="font-sans leading-relaxed text-gray-200">{activeBioDoctor.bio}</p>
                
                <div className="border-t border-white/10 pt-3.5 grid grid-cols-2 gap-3 text-[11px] text-gray-400 font-sans">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                    <div className="text-gray-500 text-[10px] mb-0.5">الخبرة الطبية:</div>
                    <span className="text-white font-bold">{activeBioDoctor.experience} سنوات من العطاء</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                    <div className="text-gray-500 text-[10px] mb-0.5">تقييم المرضى:</div>
                    <span className="text-white font-bold">★ {activeBioDoctor.rating} / 5.0</span>
                  </div>
                  <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                    <div className="text-gray-500 text-[10px] mb-0.5">ساعات العمل الرسمية بالعيادة:</div>
                    <span className="text-cyan-300 font-sans font-bold">08:00 صباحًا - 06:00 مساءً (يوميًا عدا الجمعة)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-[10px] sm:text-[11px] text-gray-400 uppercase mb-2 font-sans font-bold">الفترات المتاحة للحجز الهاتفي والسريري:</span>
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {activeBioDoctor.availableHours.map((hr) => (
                      <span key={hr} className="rounded-lg bg-white/5 border border-white/5 py-1 px-2.5 text-[10px] text-gray-300 font-mono hover:bg-clinic-accent/10 hover:text-white transition-all">
                        {hr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="p-5 pt-3 border-t border-white/5 bg-clinic-dark/40 backdrop-blur-sm shrink-0 flex gap-3">
                <button
                  onClick={() => {
                    const docId = activeBioDoctor.id;
                    const primaryServiceDef = docId === 'dr_jonas' ? 'teeth_cleaning' : 'dental_checkups';
                    setActiveBioDoctor(null);
                    handleOpenBooking(primaryServiceDef, docId);
                  }}
                  className="flex-1 rounded-xl bg-clinic-accent hover:bg-cyan-400 text-clinic-dark font-display font-bold text-xs py-2.5 sm:py-3 text-center transition-colors cursor-pointer"
                  id="bio_book_btn"
                >
                  احجز موعداً مع {activeBioDoctor.name.split(' ').slice(1).join(' ')}
                </button>
                <button
                  onClick={() => setActiveBioDoctor(null)}
                  className="rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-2.5 sm:py-3 text-xs font-semibold text-gray-300 transition-colors cursor-pointer"
                >
                  إغلاق السيرة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────── SCHEDULER BOOKING MODAL DIALOG ───────────────── */}
      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            initialServiceId={selectedServiceId}
            initialDoctorId={selectedDoctorId}
            onBookingSuccess={(b) => {
              // Automatically pull bookings data again
              const refreshed = JSON.parse(localStorage.getItem('dental_bookings') || '[]');
              setMyBookings(refreshed);
            }}
          />
        )}
      </AnimatePresence>

      {/* ───────────────── PRIVACY POLICY MODAL DIALOG ───────────────── */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Dimmed glass overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="fixed inset-0 bg-clinic-dark/85 backdrop-blur-md"
            />

            {/* Main dialog frame with fixed flex column and max height */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#122430] to-clinic-dark text-white shadow-2xl flex flex-col max-h-[90vh] text-right"
              dir="rtl"
            >
              {/* Sticky Header */}
              <div className="p-5 pb-3 border-b border-white/5 relative shrink-0">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close dialog"
                  id="close_privacy_modal_btn"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 text-right">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clinic-accent/15 text-clinic-accent border border-clinic-accent/20 shrink-0">
                    <Shield className="h-4.5 w-4.5 animate-pulse" />
                  </span>
                  <div className="text-right">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white">سياسة الأمان والخصوصية السريرية</h3>
                    <p className="text-[11px] text-gray-400 font-sans">معايير حماية سرية بيانات ومعالجات مرضى عيادتنا</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 py-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-white/15 text-xs text-gray-300">
                
                {/* Intro section */}
                <div className="rounded-xl bg-cyan-950/20 border border-clinic-teal/20 p-3.5 space-y-1.5 text-right text-xs">
                  <p className="font-semibold text-clinic-accent flex items-center gap-1 flex-row-reverse">
                    <Sparkles className="h-3.5 w-3.5 text-clinic-accent" />
                    عهد أمان أطباء الأسنان:
                  </p>
                  <p className="text-gray-300 leading-relaxed font-sans text-[11px]">
                    خصوصية ملفك الصحي وعلاجك هي ركيزة شرفنا المهني الطبي. نلتزم باستخدام أعلى التقنيات والتنظيمات السريرية الآمنة لضمان بقاء خطط معالجتك وبياناتك في أمان تام ومغلقة بالكامل.
                  </p>
                </div>

                {/* Policy Clauses */}
                <div className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-clinic-accent inline-block" />
                      ١. السرية السريرية المطلقة وميثاق الشرف
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed font-sans pr-3 font-normal">
                      جميع السجلات الصحية وأشعة الأسنان البانورامية والصور السريرية التي يقوم الدكتور حازم دويدار بتوثيقها هي سر طبي مهني مطلق ولا يتم الإفصاح عنه أو مشاركته مع أي جهة خارجية أو أفراد عدا الطاقم العلاجي المباشر لحالتك.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-clinic-accent inline-block" />
                      ٢. معالجة وتخزين البيانات الرقمية والسلوكية
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed font-sans pr-3 font-normal">
                      في هذه المنصة الرقمية، نقوم بالحفظ والتخزين الفوري محلياً على جهازك من خلال متصفح الويب (منعاً لأي هجمات اختراق برمجية خارجية). ولا يتم تداول ملفاتك أو تاريخ تصفحك عبر خوادم إعلانية أو توشيحها لخدمات ترويجية إطلاقاً.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-clinic-accent inline-block" />
                      ٣. أمان قنوات الاتصال والتنسيق المباشر
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed font-sans pr-3 font-normal">
                      لقد ألغينا نماذج وبوابات التسجيل المعقدة لتخفيف مخاطر تسريب كلمات المرور والبيانات. حجزك واستشارتك يتمان عبر توجيه مباشر ومُشفر بالكامل عبر تطبيق واتساب لضمان الخصوصية والاتصال الهاتفي الفردي بالعيادة.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-clinic-accent inline-block" />
                      ٤. حقوق المريض في تحديث ومسح السجلات
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed font-sans pr-3 font-normal">
                      للمريض كامل الحق القانوني والأخلاقي في مراجعة ملف استشارته أو طلب مسح التاريخ الطبي والأدوات التفاعلية المسترشدة. يمكنك تقديم طلب مباشر لمكتب الاستقبال داخل العيادة بمقرنا في صهرجت الصغرى للتصفية الفورية.
                    </p>
                  </div>
                </div>

                {/* Additional assurance message */}
                <div className="text-[10px] text-gray-500 leading-normal font-sans pt-1">
                  * تم إعداد وضبط نظام السياسة وفق أحدث أدوات التوجيه لجمهورية مصر العربية وجمعية أطباء الأسنان للحفاظ على حقوق وصحة وسلامة المواطنين كاملة.
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="p-5 pt-3 border-t border-white/5 bg-clinic-dark/40 backdrop-blur-sm shrink-0 space-y-3">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="w-full rounded-xl bg-clinic-accent hover:bg-cyan-400 text-clinic-dark font-display font-bold text-xs py-2.5 sm:py-3 text-center transition-all hover:shadow-lg shadow-clinic-accent/10 cursor-pointer flex items-center justify-center gap-1.5"
                  id="agree_privacy_btn"
                >
                  <Check className="h-4 w-4 shrink-0" />
                  أفهم وأوافق على سياسة الخصوصية للمريض
                </button>

                <div className="text-center text-[10px] text-gray-500 font-sans tracking-wide">
                  عيادة الدكتور حازم دويدار - ثقة طبية متكاملة ورعاية ترسم الابتسامة
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
