"use client";

import { useState, useTransition } from "react";
import { MessageSquare, Plus, Trash2, CheckCircle2, XCircle, Star, Loader2, School, GraduationCap } from "lucide-react";
import { createStudentReview, toggleReviewApproval, deleteStudentReview } from "@/actions/reviews";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

export default function StudentReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createStudentReview(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("تمت إضافة تقييم الطالب بنجاح!");
        setShowAddModal(false);
        window.location.reload();
      }
    });
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleReviewApproval(id, !currentStatus);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(!currentStatus ? "تم اعتماد ونشر التقييم!" : "تم إلغاء اعتماد التقييم");
        setReviews(reviews.map((r) => (r.id === id ? { ...r, isApproved: !currentStatus } : r)));
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    confirmToast({
      title: "تأكيد حذف تقييم الطالب",
      message: `هل أنت متأكد من رغبتك في حذف رأي الطالب "${name}" نهائياً؟`,
      confirmText: "نعم، احذف التقييم",
      cancelText: "إلغاء",
      onConfirm: async () => {
        const res = await deleteStudentReview(id);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("تم حذف التقييم بنجاح!");
          setReviews(reviews.filter((r) => r.id !== id));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-400">
          إجمالي الشهادات المسجلة: <span className="text-white font-mono">{reviews.length}</span>
        </span>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-theme-primary px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شهادة / رأي جديد</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`glass-panel rounded-3xl p-6 border transition-all flex flex-col justify-between group shadow-xl ${
              rev.isApproved ? "border-white/10 hover:border-[var(--theme-primary)]/40" : "border-red-500/30 opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggle(rev.id, rev.isApproved)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                      rev.isApproved
                        ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                    }`}
                    title={rev.isApproved ? "معتمد (انقر للتعطيل)" : "معطل (انقر للاعتماد)"}
                  >
                    {rev.isApproved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(rev.id, rev.name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="حذف هذا التقييم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stage Badge & Subject */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)]">
                  {rev.stageLabel}
                </span>
                <span className="text-[11px] text-slate-400 truncate">{rev.subject}</span>
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-300 leading-relaxed italic mb-4 line-clamp-3">
                "{rev.review}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="border-t border-white/5 pt-3 mt-auto flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">{rev.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{rev.affiliation}</p>
              </div>
              <span className="text-[10px] text-slate-500">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[var(--theme-primary)]" />
                <span>إضافة رأي طالب / قصة نجاح</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">اسم الطالب أو الباحث</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="مثال: أحمد حسام الشربيني"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">المرحلة التعليمية</label>
                  <select
                    name="stage"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  >
                    <option value="secondary">المرحلة الثانوية (علمي علوم)</option>
                    <option value="university">المرحلة الجامعية (علوم / طب / صيدلة)</option>
                    <option value="postgrad">دراسات عليا وبحث علمي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">التقييم (النجوم)</label>
                  <select
                    name="rating"
                    defaultValue="5"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 نجوم - ممتاز)</option>
                    <option value="4">⭐⭐⭐⭐ (4 نجوم - جيد جداً)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">وصف المرحلة / الصف</label>
                  <input
                    type="text"
                    name="stageLabel"
                    placeholder="مثال: ثانوية عامة (علمي علوم)"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">الانتماء / النتيجة</label>
                  <input
                    type="text"
                    name="affiliation"
                    placeholder="مثال: المركز الرابع على المحافظة أو كلية الطب"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">المادة أو المقرر موضوع التقييم</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="مثال: مادة الأحياء (DNA والمناعة والتكاثر)"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">نص تجربة ورأي الطالب</label>
                <textarea
                  name="review"
                  required
                  rows={3}
                  placeholder="تجربة الطالب، كيفية استفادته من الشرح وأثره على درجاته وتفوقه..."
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-theme-primary px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>حفظ ونشر التقييم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
