"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteChapter, deleteLesson } from "@/actions/admin";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

export function DeleteLessonButton({
  lessonId,
  lessonTitle,
  courseId,
}: {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    confirmToast({
      title: "تأكيد حذف الحصة",
      message: `هل أنت متأكد من حذف الحصة "${lessonTitle}" نهائياً من المنهج؟`,
      confirmText: "نعم، احذف الحصة",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteLesson(lessonId, courseId);
          if (res.success) {
            toast.success("تم حذف الحصة بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ أثناء حذف الحصة");
          }
        });
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="حذف هذه الحصة"
      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  );
}

export function DeleteChapterButton({
  chapterId,
  chapterTitle,
  courseId,
}: {
  chapterId: string;
  chapterTitle: string;
  courseId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    confirmToast({
      title: "تأكيد حذف الفصل بالكامل",
      message: `هل أنت متأكد من حذف فصل "${chapterTitle}" وجميع الحصص والمرفقات التابعة له نهائياً؟`,
      confirmText: "نعم، احذف الفصل",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteChapter(chapterId, courseId);
          if (res.success) {
            toast.success("تم حذف الفصل وحصصه بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ أثناء حذف الفصل");
          }
        });
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="حذف هذا الفصل بالكامل"
      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin text-rose-400" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
