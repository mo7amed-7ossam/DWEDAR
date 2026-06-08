import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Phone, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { Doctor, Service } from '../types';
import { DOCTORS, SERVICES } from '../data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialDoctorId?: string;
  onBookingSuccess?: (booking: any) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialServiceId,
  initialDoctorId
}: BookingModalProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || SERVICES[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || DOCTORS[0].id);

  // Set default configurations on open/changes
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
    if (initialDoctorId) setSelectedDoctorId(initialDoctorId);
  }, [initialServiceId, initialDoctorId, isOpen]);

  if (!isOpen) return null;

  const currentDoctor = DOCTORS.find(d => d.id === selectedDoctorId) || DOCTORS[0];
  const currentService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  const phoneNumber = '+201018784470';
  const cleanPhoneForWa = '201018784470';

  // Compose the dynamic WhatsApp message pre-fill
  const getWhatsAppMessage = () => {
    const text = `السلام عليكم ورحمة الله، أود حجز موعد استشارة وتنسيق جلسة علاجية في عيادة الدكتور حازم دويدار لطب الأسنان.
- المعالجة المطلوبة: ${currentService.name}
- الطبيب المعالج: ${currentDoctor.name}`;
    return encodeURIComponent(text);
  };

  const whatsAppLink = `https://wa.me/${cleanPhoneForWa}?text=${getWhatsAppMessage()}`;
  const phoneCallLink = `tel:${phoneNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Dimmed glass overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-clinic-dark/85 backdrop-blur-md"
      />

      {/* Main dialog frame with fixed flex column and max height */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#122430] to-clinic-dark text-white shadow-2xl flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Sticky Header */}
        <div className="p-5 pb-3 border-b border-white/5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
            id="close_booking_modal_btn"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 text-right">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clinic-accent/15 text-clinic-accent border border-clinic-accent/20 shrink-0">
              <Calendar className="h-4.5 w-4.5 animate-pulse" />
            </span>
            <div className="text-right">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">تنسيق موعدك السريع</h3>
              <p className="text-[11px] text-gray-400 font-sans">تواصل مباشر عبر الجوال للتنسيق الفوري دون انتظار</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 py-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-white/15">
          {/* Informative Header Explaining the direct flow */}
          <div className="rounded-xl bg-cyan-950/20 border border-clinic-teal/20 p-3.5 space-y-1.5 text-right text-xs">
            <p className="font-semibold text-clinic-accent flex items-center gap-1 flex-row-reverse">
              <Sparkles className="h-3.5 w-3.5 text-clinic-accent" />
              تنسيق فوري سريع وآمن:
            </p>
            <p className="text-gray-300 leading-relaxed font-sans text-[11px]">
              لضمان أفضل خدمة ورعاية فورية خالية من التعقيدات، قمنا بإلغاء التسجيل الرقمي السحابي والبريد الإلكتروني. يمكنك اختيار طبيبك والمعالجة المطلوبة بالأسفل والضغط مباشرة على تواصل واتساب أو اتصال هاتفي للتنسيق معنا في ثوان معدودة.
            </p>
          </div>

          {/* Dropdowns for prefil */}
          <div className="space-y-3.5 text-right">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">الخدمة / المعالجة المرجوة:</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white focus:border-clinic-accent focus:outline-none cursor-pointer font-sans"
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id} className="bg-clinic-dark text-white text-xs">{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 font-sans">الطبيب المعالج:</label>
              <div className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white font-sans flex items-center justify-between">
                <span>{currentDoctor.name}</span>
                <span className="text-[10px] text-clinic-accent">{currentDoctor.specialty}</span>
              </div>
            </div>
          </div>

          {/* Chat bubble representation of the generated text */}
          <div className="space-y-2 text-right">
            <span className="block text-[10px] uppercase text-gray-400 font-sans">معاينة نص الرسالة التلقائية لواتساب:</span>
            <div className="rounded-xl border border-white/15 bg-white/[0.02] p-3 text-right text-xs text-cyan-100/95 space-y-1.5 relative font-sans leading-relaxed">
              <div className="absolute top-2 left-2 flex h-4 w-4 items-center justify-center rounded-full bg-clinic-accent/15 text-clinic-accent border border-clinic-accent/10">
                <span className="text-[9px] font-bold">i</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-[11px]">
                السلام عليكم ورحمة الله، أود حجز موعد استشارة وتنسيق جلسة علاجية في عيادة الدكتور حازم دويدار لطب الأسنان.<br />
                • المعالجة المطلوبة: <span className="text-white font-bold">{currentService.name}</span><br />
                • الطبيب المعالج: <span className="text-white font-bold">{currentDoctor.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-5 pt-3 border-t border-white/5 bg-clinic-dark/40 backdrop-blur-sm shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs py-2.5 sm:py-3 text-center transition-all hover:shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              حجز سريع عبر واتساب
            </a>

            <a
              href={phoneCallLink}
              className="flex items-center justify-center gap-2 rounded-xl bg-clinic-accent hover:bg-cyan-400 text-clinic-dark font-display font-bold text-xs py-2.5 sm:py-3 text-center transition-all hover:shadow-lg shadow-clinic-accent/10 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              اتصال هاتفي مباشر
            </a>
          </div>

          <div className="text-center text-[10px] text-gray-500 font-sans tracking-wide">
            رقم هاتف عيادة الدكتور حازم دويدار الرسمي الموحد: <span className="text-gray-400 font-semibold">{phoneNumber}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
