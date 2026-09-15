"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUniversity } from "@/actions/admin";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

interface DeleteUniversityButtonProps {
  universityId: string;
  universityName: string;
}

export default function DeleteUniversityButton({ universityId, universityName }: DeleteUniversityButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    confirmToast({
      title: "تأكيد حذف الجامعة",
      message: `هل أنت متأكد من حذف جامعة "${universityName}" وجميع الأقسام التابعة لها؟`,
      confirmText: "نعم، احذف الجامعة",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteUniversity(universityId);
          if (res.success) {
            toast.success(res.message || "تم حذف الجامعة بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ أثناء حذف الجامعة");
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
      aria-label={`حذف ${universityName}`}
      title="حذف الجامعة"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin text-rose-400" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
