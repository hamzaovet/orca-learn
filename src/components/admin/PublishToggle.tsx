"use client";

import { useTransition } from "react";
import { toggleCoursePublish } from "@/actions/admin";
import { toast } from "sonner";

export function PublishToggle({ courseId, isPublished }: { courseId: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const res = await toggleCoursePublish(courseId, isPublished);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.newStatus ? "تم النشر بنجاح!" : "تم الإلغاء كمسودة!");
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
        isPublished 
          ? "bg-slate-700 text-slate-300 hover:bg-slate-600" 
          : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
      }`}
    >
      {isPending ? "جاري التحديث..." : isPublished ? "إلغاء النشر" : "نشر الكورس"}
    </button>
  );
}
