"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteDepartment } from "@/app/admin/departments/actions";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

interface DeleteDepartmentButtonProps {
  departmentId: string;
  departmentName: string;
}

export default function DeleteDepartmentButton({ departmentId, departmentName }: DeleteDepartmentButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    confirmToast({
      title: "تأكيد حذف القسم",
      message: `هل أنت متأكد من حذف قسم "${departmentName}"؟`,
      confirmText: "نعم، احذف القسم",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteDepartment(departmentId);
          if (res.success) {
            toast.success(res.message || "تم حذف القسم بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ أثناء حذف القسم");
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
      aria-label={`حذف قسم ${departmentName}`}
      title="حذف القسم"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin text-rose-400" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
