"use client";

import { useState, useTransition } from "react";
import { Microscope, Plus, Trash2, ExternalLink, Loader2, Award, Calendar } from "lucide-react";
import { createResearchPaper, deleteResearchPaper } from "@/actions/research";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

export default function ResearchPapersClient({ initialPapers }: { initialPapers: any[] }) {
  const [papers, setPapers] = useState(initialPapers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createResearchPaper(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("تمت إضافة البحث العلمي بنجاح!");
        setShowAddModal(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, titleAr: string) => {
    confirmToast({
      title: "تأكيد حذف البحث العلمي",
      message: `هل أنت متأكد من رغبتك في حذف بحث "${titleAr}" نهائياً من الموقع؟`,
      confirmText: "نعم، احذف البحث",
      cancelText: "إلغاء",
      onConfirm: async () => {
        const res = await deleteResearchPaper(id);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("تم حذف البحث العلمي بنجاح!");
          setPapers(papers.filter((p) => p.id !== id));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-400">
          إجمالي الأبحاث الموثقة: <span className="text-white font-mono">{papers.length}</span>
        </span>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-theme-primary px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة بحث علمي جديد</span>
        </button>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-[var(--theme-primary)]/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {paper.year}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {paper.category}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {paper.doi && (
                    <a
                      href={paper.doi}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5"
                      title="فتح رابط DOI"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(paper.id, paper.titleAr)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="حذف هذا البحث"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-black text-white group-hover:text-[var(--theme-badge-text)] transition-colors mb-1 leading-snug">
                {paper.titleAr}
              </h3>

              <p className="text-xs text-slate-400 font-serif italic line-clamp-2 mb-3">
                "{paper.title}"
              </p>

              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mb-3">
                <Award className="w-3.5 h-3.5 shrink-0 text-[var(--theme-primary)]" />
                <span className="truncate">{paper.journal}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {paper.abstractAr}
              </p>
            </div>

            <div className="border-t border-white/5 pt-3 text-[11px] text-slate-500 truncate">
              {paper.authors}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Microscope className="w-5 h-5 text-[var(--theme-primary)]" />
                <span>إضافة بحث علمي جديد</span>
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
                <label className="block text-xs font-bold text-slate-400 mb-1.5">عنوان البحث بالعربية</label>
                <input
                  type="text"
                  name="titleAr"
                  required
                  placeholder="مثال: الشفاء الذاتي للخرسانة بالبكتيريا وتعزيز قوتها الميكانيكية"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">عنوان البحث الأصلي بالإنجليزية</label>
                <input
                  type="text"
                  name="title"
                  required
                  dir="ltr"
                  placeholder="e.g. Bacterial self-healing and mechanical strength enhancement in concrete"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">المجلة الدولية الناشرة</label>
                  <input
                    type="text"
                    name="journal"
                    required
                    placeholder="مثال: Innovative Infrastructure Solutions (Springer)"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">سنة النشر</label>
                  <input
                    type="number"
                    name="year"
                    defaultValue={2025}
                    required
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">التصنيف البحثي</label>
                  <select
                    name="category"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  >
                    <option value="concrete">بكتيريا الشفاء الذاتي والخرسانة</option>
                    <option value="marine">ميكروبيولوجيا البحر الأحمر</option>
                    <option value="probiotics">البروبيوتيك وحمض اللاكتيك</option>
                    <option value="biodegradation">معالجة التلوث الحيوي</option>
                    <option value="general">ميكروبيولوجي عام وتطبيقي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">رابط الـ DOI (اختياري)</label>
                  <input
                    type="url"
                    name="doi"
                    dir="ltr"
                    placeholder="https://doi.org/10.1007/..."
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">أسماء الباحثين المشاركين</label>
                <input
                  type="text"
                  name="authors"
                  placeholder="مثال: Sameh Yehia, Arafa M. A. Ibrahim, Salha G. Desouky"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">الملخص والأثر العلمي بالعربية</label>
                <textarea
                  name="abstractAr"
                  required
                  rows={3}
                  placeholder="وصف مختصر للنتائج والتطبيقات الحيوية للبحث..."
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
                  <span>حفظ ونشر البحث</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
