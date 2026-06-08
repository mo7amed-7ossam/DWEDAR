import { Doctor, Service, Review } from './types';

export const DOCTORS: Doctor[] = [
  {
    id: 'dr_hazem',
    name: 'د. حازم دويدار',
    specialty: 'أخصائي زراعة وتجميل الأسنان وحشوات الجذور',
    experience: 15,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    bio: 'أخصائي زراعة وتجميل الأسنان وحشوات الجذور. أحد أبرز خبراء زراعة الأسنان الفورية وتصميم الابتسامة الرقمية (هوليوود سمايل). يمتلك خبرة تزيد عن 15 عاماً في إعادة تأهيل الفكين والترميمات السريرية المعقدة بأحدث الأنظمة الخالية من الألم.',
    availableHours: ['09:00 ص', '10:30 ص', '12:00 م', '01:30 م', '03:00 م', '04:30 م', '06:00 م']
  }
];

export const SERVICES: Service[] = [
  {
    id: 'teeth_cleaning',
    name: 'جلسة تنظيف الأسنان وإزالة الجير',
    description: 'تنظيف وتقشير عميق بالموجات فوق الصوتية المتقدمة لإزالة طبقات التكلسات والجير من اللثة والأسنان، تليها جلسة تلميع المينا بلمسة ناعمة لإعادة الرونق ومقاومة البكتيريا والروائح الكريهة.',
    category: 'تنظيف ووقاية',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    basePrice: 50,
    durationMinutes: 40
  },
  {
    id: 'dental_checkups',
    name: 'الفحص الرقمي والاستشارة الشاملة',
    description: 'مسح فموي دقيق بالأشعة والمستشعرات الطبية المتقدمة لتحديد المشاكل غير المرئية وتخطيط العلاج الدقيق. يشمل كشف التسوس الكامن، قياس صحة اللثة، ووضع خطة وقاية مخصصة.',
    category: 'تشخيص وفحص',
    imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600',
    basePrice: 30,
    durationMinutes: 20
  },
  {
    id: 'dental_veneers',
    name: 'عدسات الفينير وتصميم مظهر الابتسامة',
    description: 'قشور بورسلين رقيقة وفائقة المتانة مصممة بمساعدة الحاسوب لتغطية العيوب وتنسيق الأبعاد والشفافية البصرية لأسنانك تماماً، لمنحك مظهر ابتسامة ناصعاً وطبيعياً يعزز حضورك.',
    category: 'تجميل الأسنان',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13df793f1f?auto=format&fit=crop&q=80&w=600',
    basePrice: 600,
    durationMinutes: 90
  },
  {
    id: 'tooth_filling',
    name: 'حشوات الأسنان التجميلية المتطورة',
    description: 'ترميم وعلاج تسوس الأسنان باستخدام الليد الراتنجي والكومبوزيت القوي المتجانس مع لون السن الطبيعي لإغلاق الفراغات وحماية العصب، مع استعادة قوة السن في المضغ من الجلسة الأولى.',
    category: 'علاج تحفظي',
    imageUrl: 'https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=600',
    basePrice: 70,
    durationMinutes: 30
  },
  {
    id: 'gum_treatment',
    name: 'زراعة الأسنان الفورية والحديثة',
    description: 'تعويض الأسنان المفقودة بجذور تيتانيوم حيوية مغطاة بتطبيقات التركيبات الرقمية في زمن قياسي. تقنية متكاملة تمنحك استعادة وظيفية وجمالية كاملة للمضغ والشكل بلا تراجع أو ألم عات.',
    category: 'زراعة الأسنان',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    basePrice: 400,
    durationMinutes: 60
  },
  {
    id: 'retainers',
    name: 'تركيبات وتيجان الزيركونيا المتنوعة',
    description: 'تصميم وصناعة التيجان والجسور الثابتة لحماية الأسنان الضعيفة أو المتهالكة بمواد فائقة القوة ومقاومة الكسر مثل الزيركونيا والبورسلين المعدني بتنسيق وتطابق متناهي الصغر والروعة.',
    category: 'تركيبات الأسنان',
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
    basePrice: 200,
    durationMinutes: 45
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    author: 'أحمد الصاوي',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    text: 'عملت زراعة فورية لسنّين مفقودين مع الدكتور حازم دويدار والنتيجة فاقت توقعاتي بكثير! الإجراء تم بسرعة متناهية وبدون أي ألم يذكر طوال فترة الالتئام. عيادة محببة وفرق تعقيم مدهش.',
    date: '٥ يونيو ٢٠٢٦',
    tag: 'زراعة فورية'
  },
  {
    id: 'rev_2',
    author: 'ميادة عبد العزيز',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    text: 'قمت بتركيب تيجان الزيركونيا مع الدكتور حازم دويدار وتنسيق عدسات الفينير الأمامية. الابتسامة الآن غاية في الجمال والتماثل الطبيعي، والدكتور حازم في منتهى الذوق والأمانة العلمية والدقة الشديدة.',
    date: '٢٨ مايو ٢٠٢٦',
    tag: 'تركيبات وتجميل'
  },
  {
    id: 'rev_3',
    author: 'محمود جاد الله',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    text: 'الزيارات الدورية لأبنائي عند الدكتور حازم دويدار هادئة وخفيفة للغاية ومريحة للأطفال. الدكتور حازم يتميز بذكاء كبير وألفة في تشتيت انتباه الأطفال لتخطي الرهبة والاطمئنان الدائم على نمو أسنانهم.',
    date: '١٩ مايو ٢٠٢٦',
    tag: 'أطفال وتقويم'
  },
  {
    id: 'rev_4',
    author: 'روان محمود',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    rating: 5,
    text: 'تجربة تنظيف الجير ممتازة وسريعة، الأجهزة غاية في النظافة وفريق الاستقبال محترف جداً والالتزام بالوقت دقيق جداً. أنصح بالعيادة لكل من يبحث عن راحة متكاملة بالدقهلية.',
    date: '٢ مايو ٢٠٢٦',
    tag: 'تنظيف ووقاية'
  }
];
