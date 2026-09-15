"use client";

import { useState, useTransition } from "react";
import { School, Plus, Trash2, Loader2, BookOpen, Globe } from "lucide-react";
import { createSecondaryGrade, deleteSecondaryGrade } from "@/actions/secondary";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

export default function SecondaryGradesClient({ initialGrades }: { initialGrades: any[] }) {
  const [grades, setGrades] = useState(initialGrades);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createSecondaryGrade(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("تمت إضافة الصف الدراسي بنجاح!");
        setShowAddModal(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    confirmToast({
      title: "تأكيد حذف الصف الدراسي",
      message: `هل أنت متأكد من رغبتك في حذف "${name}"؟ قد يؤثر ذلك على الكورسات المرتبطة به.`,
      confirmText: "نعم، احذف",
      cancelText: "إلغاء",
      onConfirm: async () => {
        const res = await deleteSecondaryGrade(id);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("تم حذف الصف بنجاح!");
          setGrades(grades.filter((g) => g.id !== id));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-400">
          إجمالي الصفوف المسجلة: <span className="text-white font-mono">{grades.length}</span>
        </span>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-theme-primary px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة صف / منهج جديد</span>
        </button>
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-[var(--theme-primary)]/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <Globe className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                  <span>{grade.countryCode === "EGY" ? "مصر" : grade.countryCode === "KSA" ? "السعودية" : grade.countryCode}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(grade.id, grade.name)}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="حذف هذا الصف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-black text-white group-hover:text-[var(--theme-badge-text)] transition-colors mb-2">
                {grade.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {grade.description || "لا يوجد وصف محدد لهذا المنهج."}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                <span>{grade._count?.courses || 0} كورس مرتبط</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {grade.slug}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <School className="w-5 h-5 text-[var(--theme-primary)]" />
                <span>إضافة صف دراسي / منهج ثانوي</span>
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
                <label className="block text-xs font-bold text-slate-400 mb-1.5">اسم الصف الدراسي / المنهج</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="مثال: الصف الثالث الثانوي (علمي علوم)"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">الدولة والمنهج الوزاري</label>
                <select
                  name="countryCode"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)]"
                >
                  <option value="EGY">جمهورية مصر العربية (الثانوية العامة والأزهرية)</option>
                  <option value="KSA">المملكة العربية السعودية (نظام المسارات والتحصيلي)</option>
                  <option value="UAE">دولة الإمارات العربية المتحدة</option>
                  <option value="KWT">دولة الكويت</option>
                  <option value="INT">مدارس اللغات والدولية (IGCSE / SAT Biology)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">وصف ومحتوى المنهج</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="أبواب المنهج، الفصول المقررة، أو التركيز التخصصي..."
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
                  <span>حفظ وإضافة الصف</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
