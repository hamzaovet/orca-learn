"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCountry } from "@/actions/admin";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

interface DeleteCountryButtonProps {
  countryId: string;
  countryName: string;
}

export default function DeleteCountryButton({ countryId, countryName }: DeleteCountryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    confirmToast({
      title: "تأكيد حذف الدولة",
      message: `هل أنت متأكد من حذف دولة "${countryName}" وجميع الجامعات والأقسام التابعة لها؟`,
      confirmText: "نعم، احذف الدولة",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteCountry(countryId);
          if (res.success) {
            toast.success(res.message || "تم حذف الدولة بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ أثناء حذف الدولة");
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
      aria-label={`حذف ${countryName}`}
      title="حذف الدولة"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin text-rose-400" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
