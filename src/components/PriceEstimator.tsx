import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  CheckSquare, 
  Square, 
  Info, 
  Clock, 
  Smile, 
  Heart 
} from 'lucide-react';
import { SERVICES } from '../data';

interface PriceEstimatorProps {
  onBookServicePackage: (primaryServiceId: string) => void;
}

export default function PriceEstimator({ onBookServicePackage }: PriceEstimatorProps) {
  // Initialize with dental checkups selected by default
  const [selectedIds, setSelectedIds] = useState<string[]>(['dental_checkups']);
  // This represents pain sensitivity/anxiety level, making the slider 100% meaningful
  const [painAnxietyLevel, setPainAnxietyLevel] = useState<number>(50);

  const toggleService = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(item => item !== id) : prev) // At least one service remains selected
        : [...prev, id]
    );
  };

  // Calculations based on actual SERVICES array
  const selectedServices = SERVICES.filter(s => selectedIds.includes(s.id));
  const estimatedDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  
  // Dynamic number of sessions recommended
  const recommendedVisits = estimatedDuration > 60 ? 2 : 1;

  // Retrieve primary service for the booking trigger
  const primaryServiceId = selectedIds[0] || 'dental_checkups';

  // Dynamic comfort protocols based on patient-input fear/pain level
  const getComfortProtocol = (level: number) => {
    if (level < 45) {
      return {
        title: "بروتوكول الراحة الأساسي",
        description: "رش ليدوكائين مخدر موضعي لطيف للغاية + تبريد هوائي مستمر للثة.",
        badge: "لطيف ومريح"
      };
    } else if (level < 75) {
      return {
        title: "بروتوكول العناية بالوقاية من الألم",
        description: "جل تخدير موضعي بنكهات محببة (بدون وخز إبرة) + وتوزيع ضغط الهواء الدقيق لراحة قصوى.",
        badge: "حماية متقدمة من الألم"
      };
    } else {
      return {
        title: "بروتوكول الدكتور حازم الخاص بالقلق الشديد",
        description: "تخدير مزدوج رقمي فائق الدقة (بدون ألم نهائياً) + موسيقى هادئة مريحة للأعصاب + إيقاع بطيء مخصص للتخلص من فوبيا الأسنان.",
        badge: "خالٍ من الألم والتوتر تماماً"
      };
    }
  };

  const protocol = getComfortProtocol(painAnxietyLevel);

  return (
    <div 
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#122430]/95 to-clinic-dark p-6 sm:p-8 shadow-2xl relative overflow-hidden text-right" 
      id="price_estimator_container" 
      dir="rtl"
    >
      {/* Background glowing decorations */}
      <div className="absolute -bottom-16 -left-16 h-36 w-36 bg-clinic-accent/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-16 -right-16 h-36 w-36 bg-clinic-teal/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with explanatory description */}
      <div className="flex items-start gap-3 mb-6 pb-6 border-b border-white/5 flex-row-reverse">
        <div className="text-right flex-1">
          <h4 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-2 justify-start flex-row">
            <Calculator className="h-5 w-5 text-clinic-accent shrink-0" />
            مخطط وجدولة الجلسات العلاجية المخصصة
          </h4>
          <p className="text-xs text-gray-300 mt-1 font-sans leading-relaxed">
            قم ببناء خطة زيارتك بنفسك! اختر الخدمات الطبية التي ترغب بها وتعرّف على تفاصيل الجلسات ومدة العلاج بالإضافة لبروتوكول إزالة الألم المخصص لك.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step 1: Select Treatments (Right side in RTL) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[11px] font-sans text-clinic-accent font-bold bg-clinic-accent/10 px-2.5 py-0.5 rounded-full">الخطوة الأولى</span>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">١. اختر الخدمات الطبية المطلوبة:</h5>
          </div>

          <div className="space-y-2.5 pr-1">
            {SERVICES.map(service => {
              const isChecked = selectedIds.includes(service.id);
              return (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-clinic-accent/10 border-clinic-accent/70 shadow-md shadow-clinic-accent/5' 
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckSquare className="h-5 w-5 text-clinic-accent shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-500 shrink-0" />
                    )}
                    <div className="text-right">
                      <h6 className="font-display text-xs sm:text-sm font-bold text-white leading-normal">
                        {service.name}
                      </h6>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-sans">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px] text-gray-300">
                          {service.category}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3 text-gray-500" />
                          {service.durationMinutes} دقيقة
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Custom Parameters & Calculations (Left side in RTL) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[11px] font-sans text-clinic-teal font-bold bg-clinic-teal/20 px-2.5 py-0.5 rounded-full">الخطوة الثانية</span>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">٢. بروتوكول الراحة والتحضير:</h5>
            </div>

            {/* Pain / Dental Fear Level Input */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 flex items-center gap-1 font-semibold">
                  <Smile className="h-4 w-4 text-clinic-accent" />
                  مستوى خوفك أو قلقك من الألم وعلاج الأسنان:
                </span>
                <span className="font-mono font-bold text-clinic-accent text-sm bg-clinic-accent/10 px-2 py-0.5 rounded">
                  {painAnxietyLevel}%
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={painAnxietyLevel}
                onChange={(e) => setPainAnxietyLevel(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-gray-800 accent-clinic-accent appearance-none cursor-ew-resize mt-1.5"
              />

              <div className="flex justify-between text-[9px] text-gray-500 font-sans">
                <span>١٠٪ (طبيعي)</span>
                <span>٥٠٪ (متوسط)</span>
                <span>١٠٠٪ (قلق شديد وخوف)</span>
              </div>

              {/* Instant updates explaining what the slider actually does! */}
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-sans">البروتوكول السريري الموصى به:</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-clinic-accent/20 text-clinic-accent">
                    {protocol.badge}
                  </span>
                </div>
                <h6 className="text-[11px] font-bold text-white flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-clinic-accent inline-block" />
                  {protocol.title}
                </h6>
                <p className="text-[10px] text-gray-300 leading-relaxed font-sans">
                  {protocol.description}
                </p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="rounded-xl bg-clinic-accent/5 border border-clinic-accent/10 p-4 space-y-3 font-sans">
              <div className="text-[11px] font-bold text-gray-300 border-b border-white/5 pb-1.5">ملخص خطة العلاج المخصصة</div>
              
              <div className="flex justify-between text-xs text-gray-300">
                <span>الخدمات العلاجية المحددة:</span>
                <span className="font-bold text-white">{selectedServices.length} إجراءات</span>
              </div>

              <div className="flex justify-between text-xs text-gray-300">
                <span>الوقت التقريبي المقدر للعلاج:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-clinic-accent" />
                  {estimatedDuration} دقيقة
                </span>
              </div>

              <div className="flex justify-between text-xs text-gray-300">
                <span>توزيع الجلسات المقترح:</span>
                <span className="font-bold text-emerald-400">
                  {recommendedVisits === 1 ? 'زيارة واحدة متكاملة وهادئة' : 'على زيارتين لراحة كاملة ومنع التعب'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-950/20 border border-clinic-teal/10 text-gray-300 text-right">
              <Info className="h-4 w-4 text-clinic-accent shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-sans text-gray-400">
                * ملاحظة هامة: هذه التقديرات والبروتوكولات استرشادية للتنظيم المبدئي لمواعيدك وزياراتك، ويقوم الدكتور حازم دويدار بفحص الحالة وتوثيق خطة العمل النهائية وتفاصيلها المخصصة داخل العيادة.
              </p>
            </div>

            <button
              onClick={() => onBookServicePackage(primaryServiceId)}
              className="w-full rounded-xl bg-clinic-accent hover:bg-cyan-400 text-clinic-dark font-display font-medium text-xs py-3 text-center transition-all hover:shadow-lg hover:shadow-clinic-accent/20 cursor-pointer flex items-center justify-center gap-2"
              id="book_calculated_package_btn"
            >
              <Heart className="h-4 w-4 fill-current shrink-0" />
              احجز موعد استشارة لتطبيق خطة العلاج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
