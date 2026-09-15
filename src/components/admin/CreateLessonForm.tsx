"use client";

import { useState, useTransition } from "react";
import { createLesson } from "@/actions/admin";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateLessonForm({ chapterId, courseId }: { chapterId: string; courseId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLesson(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("تم إضافة الدرس بنجاح!");
        setIsEditing(false);
      }
    });
  }

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1 mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-fit"
      >
        <Plus className="h-4 w-4" />
        إضافة درس +
      </button>
    );
  }

  return (
    <div className="bg-black/30 p-4 rounded-xl mt-3 border border-white/10">
      <form action={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1 block">عنوان الحصة / الدرس *</label>
          <input 
            type="text" 
            name="title" 
            placeholder="مثال: الحصة الأولى: الانقسام الميوزي وتضاعف الـ DNA" 
            className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder-white/30" 
            autoComplete="off"
            required 
            disabled={isPending}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 mb-1 block">رابط الفيديو (YouTube / Vimeo / Drive)</label>
          <input 
            type="url" 
            name="videoUrl" 
            placeholder="مثال: https://www.youtube.com/watch?v=XXXXX" 
            className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder-white/30 font-mono text-xs" 
            autoComplete="off"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 mb-1 block">رابط المذكرة أو الملف المرفق (PDF / Drive) - اختياري</label>
          <input 
            type="url" 
            name="attachmentUrl" 
            placeholder="مثال: https://drive.google.com/... أو رابط مباشر لملف PDF" 
            className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)] transition-colors placeholder-white/30 font-mono text-xs" 
            autoComplete="off"
            disabled={isPending}
          />
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
            <input 
              type="checkbox" 
              name="isFree" 
              className="w-4 h-4 rounded bg-white/5 border-white/20 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)] cursor-pointer" 
              disabled={isPending}
            /> 
            <span className="font-bold text-emerald-400">متاح مجاناً للمعاينة</span>
            <span className="text-slate-400 text-[11px]">(يستطيع أي طالب مشاهدة هذا الدرس قبل الاشتراك والدفع)</span>
          </label>
        </div>
        
        <input type="hidden" name="chapterId" value={chapterId} />
        <input type="hidden" name="courseId" value={courseId} />
        
        <div className="flex flex-row gap-2 mt-1">
          <button 
            type="submit"
            disabled={isPending}
            className="btn-theme-primary px-5 py-2 text-xs font-black rounded-lg transition-all disabled:opacity-50"
          >
            {isPending ? "جاري الحفظ..." : "حفظ الحصة"}
          </button>
          <button 
            type="button" 
            onClick={() => setIsEditing(false)}
            disabled={isPending}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
