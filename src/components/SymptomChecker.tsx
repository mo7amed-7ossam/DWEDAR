import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldAlert, Sparkles, AlertTriangle, ArrowRight, RotateCcw, Stethoscope } from 'lucide-react';
import { SERVICES } from '../data';

interface SymptomCheckerProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export default function SymptomChecker({ onSelectServiceToBook }: SymptomCheckerProps) {
  const [step, setStep] = useState<number>(1);
  const [symptom, setSymptom] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [painLevel, setPainLevel] = useState<number>(5);

  const resetChecker = () => {
    setStep(1);
    setSymptom('');
    setDuration('');
    setPainLevel(5);
  };

  // Diagnostic algorithm based on selections
  const computeResult = () => {
    let title = 'جلسة فحص طبي عامة وصحة الفم';
    let severity: 'low' | 'medium' | 'high' = 'low';
    let recommendation = 'بناءً على اختيارك، يُنصح بإجراء فحص تشخيصي دوري لتقييم حالة اللثة وفحص التسوس المبكر لضمان سلامتك.';
    let suggestedServiceId = 'dental_checkups';

    if (symptom === 'ache') {
      if (painLevel > 7 || duration === 'week') {
        title = 'فحص ترميمي عاجل وعلاج عصب';
        severity = 'high';
        recommendation = 'الألم الحاد المستمر لفترة طويلة يشير إلى التهاب محتمل في عصب السن الداخلي. نوصي بحجز موعد ترميم عاجل لحماية جذور السن وصحته.';
        suggestedServiceId = 'tooth_filling';
      } else {
        title = 'خطة ترميم وإصلاح التسوس';
        severity = 'medium';
        recommendation = 'الشعور بالألم أثناء العض أو الوجع الموضعي يشير لتكون تسوس. يُنصح بعمل حشوة تجميلية متطورة لاستعادة سلامة السن بالكامل.';
        suggestedServiceId = 'tooth_filling';
      }
    } else if (symptom === 'sensitivity') {
      title = 'تنظيف عميق للمينا والوقاية من الحساسية';
      severity = 'low';
      recommendation = 'الحساسية للمشروبات الساخنة والباردة غالباً ما تنتج عن انكشاف عاج الأسنان أو تراكم البلاك المجهري. ننصح بجلسة تنظيف عميق لإزالة الرواسب السطحية.';
      suggestedServiceId = 'teeth_cleaning';
    } else if (symptom === 'gums') {
      if (duration === 'week' || painLevel > 5) {
        title = 'علاج وتطهير اللثة العميقة الدقيق';
        severity = 'medium';
        recommendation = 'انتفاخ ونزيف اللثة يشير إلى التهاب نشط وعميق بالأنسجة المحيطة. ننصح للغاية بجلسة علاج وتطهير اللثة العميقة دقة وموثوقية.';
        suggestedServiceId = 'gum_treatment';
      } else {
        title = 'تنظيف وقائي عميق لالتهابات اللثة';
        severity = 'low';
        recommendation = 'تورم اللثة الخفيف يمكن علاجه والوقاية منه تماماً مع التنظيف الطبي المتخصص. ننصح بجدولة جلسة إزالة الجير وتلميع الأسنان فوراً.';
        suggestedServiceId = 'teeth_cleaning';
      }
    } else if (symptom === 'alignment') {
      title = 'تقييم وتنسيق تقويم ومثبتات الأسنان';
      severity = 'low';
      recommendation = 'بالنسبة للفراغات، الازدحام، أو استفسارات حركة الأسنان، نوصي بحجز جلسة قياس وتصميم مثبتات الأسنان الوقائية.';
      suggestedServiceId = 'retainers';
    } else if (symptom === 'aesthetic') {
      title = 'تقييم وتصميم الابتسامة التجميلية';
      severity = 'low';
      recommendation = 'لعلاج التصبغات العميقة، الفراغات، أو كسور الأسنان الطفيفة، توفر عدسات الفينير الخزفية التجميلية الحل الأمثل لابتسامة طبيعية متوهجة.';
      suggestedServiceId = 'dental_veneers';
    }

    const matchedService = SERVICES.find(s => s.id === suggestedServiceId) || SERVICES[0];

    return { title, severity, recommendation, suggestedServiceId, matchedService };
  };

  const result = computeResult();

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#122430]/90 to-clinic-dark p-6 shadow-xl relative overflow-hidden" id="symptom_checker_container" dir="rtl">
      {/* Absolute background accent ring */}
      <div className="mesh-glow bg-clinic-teal -top-12 -right-12 h-36 w-36" />

      <div className="flex items-center gap-2 mb-4 text-right">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-clinic-accent/10 text-clinic-accent border border-clinic-accent/20">
          <Stethoscope className="h-4 w-4" />
        </span>
        <div className="text-right">
          <h4 className="font-display text-sm sm:text-base font-bold text-white">مُشخّص الأعراض الذكي لصحة الفم</h4>
          <p className="text-xs text-gray-400 font-sans">مساعد تقييم ذاتي ذكي وسري بجودة عالية</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-right"
          >
            <p className="text-sm text-gray-300">ما هي المشكلة الطبية أو العَرَض الأساسي الذي تشعر به اليوم في أسنانك؟</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => { setSymptom('sensitivity'); setStep(2); }}
                className="flex items-center justify-between text-right rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all font-sans cursor-pointer"
              >
                <span>❄️ حساسية للحرارة / البرودة</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => { setSymptom('ache'); setStep(2); }}
                className="flex items-center justify-between text-right rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all font-sans cursor-pointer"
              >
                <span>⚡ ألم عصب شديد أو وجع مستمر</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => { setSymptom('gums'); setStep(2); }}
                className="flex items-center justify-between text-right rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all font-sans cursor-pointer"
              >
                <span>🩸 نزيف باللثة أو تورم واحمرار</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => { setSymptom('alignment'); setStep(2); }}
                className="flex items-center justify-between text-right rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all font-sans cursor-pointer"
              >
                <span>🦷 مشكلات تراص الأسنان والتقويم</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => { setSymptom('aesthetic'); setStep(2); }}
                className="flex items-center justify-between text-right rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all font-sans cursor-pointer"
              >
                <span>✨ تصبغات شديدة أو فراغات ترغب بإخفائها</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => { setSymptom('checkup'); setStep(2); }}
                className="flex items-center justify-between text-right rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all font-sans cursor-pointer"
              >
                <span>🔍 فحص تشخيصي سنوي دوري عام</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-500 rotate-180" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-right"
          >
            <p className="text-sm text-gray-300">منذ متى بدأت هذه المشكلة أو طبيعة هذا الانزعاج بالظهور والاستمرار؟</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setDuration('today'); setStep(3); }}
                className="block text-right rounded-xl border border-white/5 bg-white/5 p-3 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all cursor-pointer font-sans"
              >
                🌅 بدأت اليوم فقط (أقل من ٢٤ ساعة)
              </button>
              <button
                type="button"
                onClick={() => { setDuration('days'); setStep(3); }}
                className="block text-right rounded-xl border border-white/5 bg-white/5 p-3 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all cursor-pointer font-sans"
              >
                📅 بدأت منذ بضعة أيام إلى أسبوع تقريباً
              </button>
              <button
                type="button"
                onClick={() => { setDuration('week'); setStep(3); }}
                className="block text-right rounded-xl border border-white/5 bg-white/5 p-3 text-xs hover:border-clinic-accent hover:bg-clinic-teal/10 transition-all cursor-pointer font-sans"
              >
                ⚠️ مستمرة بانتظام منذ أكثر من أسبوع كامل
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-sans"
              >
                <RotateCcw className="h-3 w-3" /> رجوع للخلف
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-right"
          >
            <div className="flex justify-between items-center flex-row-reverse">
              <p className="text-sm text-gray-300">حدد مستوى الألم والوجع الفعلي حالياً:</p>
              <span className="font-mono text-sm px-2 py-0.5 rounded bg-clinic-teal/30 text-clinic-accent font-bold">{painLevel}/10</span>
            </div>

            {/* Pain indicator slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-gray-800 accent-clinic-accent appearance-none cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-sans flex-row-reverse">
                <span>١ (معدوم أو خفيف جداً)</span>
                <span>٥ (وجع معتدل ومحتمل)</span>
                <span>١٠ (ألم حاد ونبض لا يطاق)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 flex-row-reverse">
              <button
                onClick={() => setStep(4)}
                className="rounded-lg bg-clinic-accent hover:bg-cyan-400 text-clinic-dark text-xs font-bold px-4 py-2 flex items-center gap-1 transition-colors cursor-pointer font-sans"
                type="button"
                id="analyse_symptoms_btn"
              >
                توليد التشخيص الطبي الفوري <Activity className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setStep(2)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-sans"
                type="button"
              >
                <RotateCcw className="h-3 w-3" /> رجوع للوراء
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="result"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4 font-sans text-right"
          >
            <div className={`p-4 rounded-xl border flex gap-3 flex-row-reverse ${
              result.severity === 'high' ? 'bg-red-950/20 border-red-500/20 text-red-100' :
              result.severity === 'medium' ? 'bg-amber-950/20 border-amber-500/20 text-yellow-100' :
              'bg-emerald-950/20 border-emerald-500/20 text-emerald-100'
            }`}>
              {result.severity === 'high' ? (
                <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              ) : result.severity === 'medium' ? (
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="text-right flex-1">
                <h5 className="font-bold text-sm">{result.title}</h5>
                <span className="font-sans text-[10px] uppercase font-bold text-gray-400 block mt-1">
                  مستوى الأولوية والخطورة: {result.severity === 'high' ? 'عاجلة وحادة ⚠️' : result.severity === 'medium' ? 'متوسطة الأثر 🔔' : 'مستقرة ووقائية ✅'}
                </span>
                <p className="mt-1.5 text-xs text-gray-300 leading-relaxed font-sans">{result.recommendation}</p>
              </div>
            </div>

            {/* Service card recommendation shortcut */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 flex-row-reverse">
              <img
                src={result.matchedService.imageUrl}
                alt={result.matchedService.name}
                className="h-12 w-12 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1 text-right">
                <span className="text-[10px] uppercase font-sans text-clinic-accent font-semibold block">المعاجة الطبية الموصى بها</span>
                <h6 className="font-semibold text-xs text-white truncate">{result.matchedService.name}</h6>
                <p className="text-[10px] text-gray-400 font-sans">{result.matchedService.durationMinutes} دقيقة علاجية</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 flex-row-reverse">
              <button
                onClick={() => onSelectServiceToBook(result.suggestedServiceId)}
                className="rounded-lg bg-clinic-teal hover:bg-clinic-teal/90 text-white text-xs font-bold px-4.5 py-2 hover:shadow-lg transition-all cursor-pointer font-sans"
                type="button"
                id="book_diagnosed_service_btn"
              >
                احجز هذه الجلسة الموصى بها الآن
              </button>

              <button
                onClick={resetChecker}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-sans"
                type="button"
                id="reset_symptom_checker_btn"
              >
                <RotateCcw className="h-3 w-3" /> تشخيص عَرَض آخر
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
