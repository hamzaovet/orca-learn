import toast from "react-hot-toast";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmToastOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
}

export function confirmToast({
  title = "تأكيد الحذف",
  message,
  confirmText = "نعم، حذف",
  cancelText = "إلغاء",
  onConfirm,
}: ConfirmToastOptions) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-in fade-in zoom-in-95 duration-200" : "animate-out fade-out zoom-out-95 duration-150"
        } pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-rose-500/30 bg-[#0B0F19] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(244,63,94,0.15)] backdrop-blur-2xl`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-slate-100">{title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={async () => {
              toast.dismiss(t.id);
              await onConfirm();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all hover:from-rose-500 hover:to-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    ),
    {
      duration: 8000,
      position: "top-center",
    }
  );
}
