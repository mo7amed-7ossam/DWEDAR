import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, ShieldCheck, HeartPulse } from 'lucide-react';

export default function BrushTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number>(120);
  const [isActive, setIsActive] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            clearInterval(timerRef.current);
            // Play success bell chime
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
              gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 1);
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(120);
  };

  const totalDuration = 120;
  const progressPct = ((totalDuration - secondsLeft) / totalDuration) * 100;

  // Determine active oral quadrant
  const getQuadrantDetails = () => {
    if (secondsLeft <= 0) {
      return {
        title: 'تمت عملية تنظيف الأسنان بنجاح! 🦷✨',
        instruct: 'رائع جداً! تمضمض الآن بالماء واستخدم غسول الفم والفلورايد المطهر لمعادلة الترسبات البكتيرية.',
        fact: 'تنظيف الأسنان مرتين يومياً بمعدل دقيقتين يحمي طبقات السن ويخفض مخاطر التسوّس بنسبة ٤٠٪.'
      };
    }
    if (secondsLeft > 90) {
      return {
        title: 'الربع الأول: الربع العلوي الأيسر',
        instruct: 'ضع شعيرات الفرشاة بزاوية ٤٥ درجة نحو خط اللثة. قم بتمشيط الأسطح الخارجية بحركات دائرية خفيفة لمنع تراكم البلاك.',
        fact: 'التنظيف بقوة مفرطة أو ضغط زائد يتلف المينا الحيوية ويسبب حساسية مزمنة للأسنان وتراجع اللثة.'
      };
    }
    if (secondsLeft > 60) {
      return {
        title: 'الربع الثاني: الربع العلوي الأيمن',
        instruct: 'امسح بلطف الأسطح الطاحنة والمناطق الداخلية الصعبة للأضراس الخلفية العميقة.',
        fact: 'تطبيق الحشوات السدادة للأطفال (Sealants) يعمل كدرع واقٍ متكامل لمنع تسوس أضراسهم الفتية.'
      };
    }
    if (secondsLeft > 30) {
      return {
        title: 'الربع الثالث: الربع السفلي الأيسر',
        instruct: 'حافظ على تمشيط ناعم خفيف. لا تنسَ تنظيف سطح اللسان بلطف لإزالة الخلايا البكتيرية وتنعيم النَفَس.',
        fact: 'اللعاب هو سائل وقائي حيوي يحمل الكالسيوم والفوسفات لدعم إعادة بناء وتمعدن مينا السن الطبيعية.'
      };
    }
    return {
      title: 'الربع الرابع: الربع السفلي الأيمن',
      instruct: 'المرحلة الأخيرة! ركز بعناية على الأسطح الخارجية والداخلية للقوس السفلي الأيمن لإتمام الدورة.',
      fact: 'استخدام خيط الأسنان الطبي يومياً يطهر ٣٥٪ من أسطح السن الجانبية التي تعجز فرشاة الأسنان العادية عن بلوغها.'
    };
  };

  const q = getQuadrantDetails();

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#122430]/90 to-clinic-dark p-6 shadow-xl relative overflow-hidden text-center" id="toothbrush_timer_block" dir="rtl">
      {/* Background radial accent */}
      <div className="mesh-glow bg-clinic-accent/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36" />

      <div className="flex justify-center items-center gap-2 mb-4">
        <HeartPulse className="h-4 w-4 text-clinic-accent animate-pulse" />
        <h4 className="font-display text-xs font-bold text-white uppercase">مرشد حماية الأسنان الوقائي (دقيقتان)</h4>
      </div>

      <div className="relative mx-auto h-32 w-32 flex items-center justify-center">
        {/* Progress SVG */}
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="6"
          />
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="transparent"
            stroke="url(#timerGrad)"
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={2 * Math.PI * 54 * (1 - progressPct / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0d8299" />
            </linearGradient>
          </defs>
        </svg>

        {/* Counter digits */}
        <div className="z-10 text-center font-mono">
          <span className="text-3xl font-extrabold text-white">
            {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] text-gray-400 block mt-0.5 uppercase font-sans">
            {isActive ? 'فرشاة نشطة 🦷' : 'موقت جاهز'}
          </span>
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={toggleTimer}
          className={`flex h-8 w-28 items-center justify-center gap-1 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer font-sans ${isActive ? 'bg-amber-500 text-white shadow-amber-500/10' : 'bg-clinic-accent text-clinic-dark shadow-clinic-accent/10 hover:bg-cyan-400'}`}
          id="play_brush_timer_btn"
        >
          {isActive ? (
            <>
              <Pause className="h-3.5 w-3.5" /> إيقاف مؤقت
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" /> بدء الموقت
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          id="reset_brush_timer_btn"
          aria-label="إعادة تعيين الموقت"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quadrant info blocks */}
      <div className="mt-5 rounded-xl bg-white/5 border border-white/5 p-3.5 space-y-1 text-right min-h-[95px] flex flex-col justify-center">
        <div className="flex items-center gap-1.5 font-display text-xs font-bold text-clinic-accent">
          <Clock className="h-3.5 w-3.5 text-clinic-accent" />
          <span>{q.title}</span>
        </div>
        <p className="text-[11px] text-gray-200 leading-normal font-sans text-right">{q.instruct}</p>
        <span className="text-[10px] text-gray-500 italic block pt-1.5 border-t border-white/5 font-sans text-right">
          هل تعلم؟ {q.fact}
        </span>
      </div>
    </div>
  );
}
