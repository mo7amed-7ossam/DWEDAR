import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Plus, Check, Filter } from 'lucide-react';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('الكل');
  
  // New review form states
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newText, setNewText] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('راحة');
  const [errors, setErrors] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Load reviews from localStorage on initiation
  useEffect(() => {
    const local = localStorage.getItem('clinic_reviews');
    if (local) {
      setReviews(JSON.parse(local));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('clinic_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) {
      setErrors('الرجاء إدخال اسمك الكريم ومراجعتك السريرية كاملة.');
      return;
    }

    setErrors('');

    const avatarPool = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'
    ];
    const randomAvatar = avatarPool[Math.floor(Math.random() * avatarPool.length)];

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      author: newAuthor,
      avatarUrl: randomAvatar,
      rating: newRating,
      text: newText,
      date: 'اليوم',
      tag: newTag
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('clinic_reviews', JSON.stringify(updatedReviews));

    // Reset Form Input
    setNewAuthor('');
    setNewText('');
    setNewRating(5);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  const filteredReviews = selectedFilter === 'الكل'
    ? reviews
    : reviews.filter(r => r.tag === selectedFilter);

  // Statistics
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const filterTags = ['الكل', 'راحة', 'جودة', 'الخدمة', 'قيمة'];

  return (
    <div className="font-sans space-y-6 text-right" id="reviews_system_block" dir="rtl">
      {/* Top metrics bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Rating summary */}
        <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-center items-center text-center">
          <span className=" text-4xl font-extrabold text-[#0f1c24] font-display">{avgRating}</span>
          <div className="flex items-center gap-0.5 mt-1.5 text-yellow-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-4 w-4 fill-current ${star <= Math.round(parseFloat(avgRating)) ? 'text-yellow-400' : 'text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 mt-1 font-sans">{totalCount} تقييم مريض سابِق</span>
        </div>

        {/* Breakdown bar chart */}
        <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between col-span-2">
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((starLevel) => {
              const count = reviews.filter(r => r.rating === starLevel).length;
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={starLevel} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="w-12 font-sans text-right">{starLevel} نجوم</span>
                  <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden relative">
                    <div className="h-full bg-clinic-accent absolute right-0" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-left font-mono text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and adding button */}
      <div className="hidden flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
        <div className="flex flex-wrap gap-1.5 items-center">
          <Filter className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${selectedFilter === tag ? 'bg-clinic-teal text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg bg-clinic-accent hover:bg-cyan-400 text-clinic-dark text-xs font-bold py-1.5 px-3 transition-colors cursor-pointer font-sans"
          id="reveal_review_form_btn"
        >
          <Plus className="h-4 w-4" /> شارك تجربتك الطبية
        </button>
      </div>

      {/* Adding Review Form Drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-white/10 rounded-xl bg-[#122430]/60 p-5 space-y-4">
              <h4 className="font-display font-bold text-sm text-cyan-400 text-right">أضف تقييمك وتجربتك السريرية</h4>
              {errors && <p className="text-red-400 text-xs font-mono text-right">{errors}</p>}
              
              {submitted ? (
                <div className="text-center py-4 space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-5 w-5 stroke-[3]" />
                  </div>
                  <p className="text-xs text-emerald-300 font-semibold font-sans">تم إرسال تقييمك الطبي ببالغ الشكر والامتنان!</p>
                </div>
              ) : (
                <form onSubmit={handlePostReview} className="space-y-3 text-right animate-pulse-once">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-400">الاسم الكامل</label>
                      <input
                        type="text"
                        placeholder="مثال: سارة محمد"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-clinic-accent focus:outline-none text-right font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400">التصنيف الأساسي للجلسة</label>
                      <select
                        value={newTag}
                        onChange={(e: any) => setNewTag(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-white/10 bg-clinic-dark px-3 py-2 text-xs text-white focus:border-clinic-accent focus:outline-none text-right font-sans"
                      >
                        <option value="راحة">🌲 تجربة مريحة (خالية تماماً من الألم)</option>
                        <option value="جودة">✨ معيار الجودة (خامات متميزة)</option>
                        <option value="الخدمة">🤝 طاقم ودود (معاملة راقية)</option>
                        <option value="وقاية">💎 بروتوكول الوقاية والصحة (متابعة مستمرة)</option>
                      </select>
                    </div>
                  </div>

                  {/* Stars input */}
                  <div>
                    <span className="block text-xs font-medium text-gray-400 mb-1">تقييم عيادتنا بالنجوم</span>
                    <div className="flex gap-1.5 flex-row-reverse justify-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Star className={`h-5 w-5 ${star <= newRating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400">تفاصيل التجربة والمعالجة الحاصل عليها</label>
                    <textarea
                      rows={2.5}
                      placeholder="مثال: تنظيف وتلميع أسنان ممتاز للغاية، دون أي وجع، موسيقى ناعمة ومحفزة في الخلفية..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-clinic-accent focus:outline-none resize-none text-right font-sans"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="rounded-lg bg-clinic-teal hover:bg-clinic-teal/90 text-white text-xs font-bold py-2 px-4 transition-colors cursor-pointer font-sans"
                      id="submit_new_review_btn"
                    >
                      نشر شهادة المريض
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews feed grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-right hidden">
        <AnimatePresence initial={false}>
          {filteredReviews.length === 0 ? (
            <p className="text-gray-500 text-xs italic py-4 col-span-2 text-center font-sans">لا توجد مراجعات تحت هذا التصنيف بعد.</p>
          ) : (
            filteredReviews.slice(0, 4).map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatarUrl}
                        alt={rev.author}
                        className="h-8 w-8 rounded-full object-cover border border-clinic-accent/20"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-white text-right font-sans">{rev.author}</h5>
                        <p className="text-[10px] text-gray-400 font-mono text-right">{rev.date}</p>
                      </div>
                    </div>
                    <span className="rounded bg-clinic-accent/10 px-1.5 py-0.5 text-[9px] font-sans font-bold text-clinic-accent border border-clinic-accent/15">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="mt-3 flex gap-0.5 flex-row-reverse justify-end">
                  {[1, 2, 3, 4, 5].map(starIndex => (
                    <Star
                      key={starIndex}
                      className={`h-3 w-3 ${starIndex <= rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
