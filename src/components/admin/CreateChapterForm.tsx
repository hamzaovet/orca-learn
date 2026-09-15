"use client";

import { useState, useTransition } from "react";
import { createChapter } from "@/actions/admin";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export function CreateChapterForm({ courseId }: { courseId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createChapter(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("تم إضافة الفصل بنجاح!");
        setIsEditing(false);
      }
    });
  }

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 py-2 rounded-xl"
      >
        <PlusCircle className="h-4 w-4" />
        إضافة فصل جديد +
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 w-full max-w-xl ml-auto">
      <input 
        type="text" 
        name="title" 
        placeholder="اسم الفصل (مثال: الفصل الأول: مقدمة)" 
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-colors" 
        autoComplete="off" 
        required 
        disabled={isPending}
      />
      <input type="hidden" name="courseId" value={courseId} />
      
      <button 
        type="button" 
        onClick={() => setIsEditing(false)}
        disabled={isPending}
        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        إلغاء
      </button>
      
      <button 
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-sm font-bold bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
      >
        {isPending ? "جاري الحفظ..." : "حفظ"}
      </button>
    </form>
  );
}
