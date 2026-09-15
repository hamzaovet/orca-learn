"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCourse } from "@/actions/admin";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

interface DeleteCourseButtonProps {
  courseId: string;
  courseTitle: string;
}

export default function DeleteCourseButton({ courseId, courseTitle }: DeleteCourseButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    confirmToast({
      title: "تأكيد حذف الكورس",
      message: `هل أنت متأكد من حذف كورس "${courseTitle}" وجميع فصوله ودروسه نهائياً؟`,
      confirmText: "نعم، احذف الكورس",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteCourse(courseId);
          if (res.success) {
            toast.success(res.message || "تم حذف الكورس بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ أثناء حذف الكورس");
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
      aria-label={`حذف ${courseTitle}`}
      title="حذف الكورس"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin text-rose-400" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
