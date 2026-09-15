"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, 
  Upload, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  Smartphone, 
  ArrowLeft, 
  Image as ImageIcon, 
  X,
  Radio,
  Calendar,
  ShieldCheck,
  Video
} from "lucide-react";
import { submitLiveTicketRequest } from "@/actions/live-sessions";
import { toast } from "sonner";

interface CheckoutLiveClientProps {
  sessionId: string;
  sessionTitle: string;
  scheduledAtFormatted: string;
  duration: number;
  price: number;
  existingStatus?: string | null;
  existingPhone?: string | null;
  existingReceipt?: string | null;
}

export default function CheckoutLiveClient({
  sessionId,
  sessionTitle,
  scheduledAtFormatted,
  duration,
  price,
  existingStatus,
  existingPhone,
  existingReceipt,
}: CheckoutLiveClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentMethod, setPaymentMethod] = useState<"VODAFONE_CASH" | "INSTAPAY" | "BANK_TRANSFER">("VODAFONE_CASH");
  const [senderPhone, setSenderPhone] = useState(existingPhone || "");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(existingReceipt || null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`تم نسخ ${label}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Image Selection Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة صالح (JPG أو PNG)");
        return;
      }
      setReceiptFile(file);
      const previewUrl = URL.createObjectURL(file);
      setReceiptPreview(previewUrl);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (price > 0 && !receiptFile && !receiptPreview) {
      toast.error("يرجى إرفاق صورة إيصال التحويل (سكرين شوت)");
      return;
    }

    if (price > 0 && !senderPhone.trim()) {
      toast.error("يرجى إدخال رقم المحفظة أو الحساب المحوّل منه");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedReceiptUrl = receiptPreview;

      // Upload receipt file if a new one was selected
      if (receiptFile) {
        const formData = new FormData();
        formData.append("file", receiptFile);

        const uploadRes = await fetch("/api/upload-receipt", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "فشل رفع صورة الإيصال");
        }

        const uploadData = await uploadRes.json();
        uploadedReceiptUrl = uploadData.url;
      }

      const res = await submitLiveTicketRequest({
        sessionId,
        pricePaid: price,
        paymentMethod,
        senderPhone: senderPhone.trim() || undefined,
        transactionRef: transactionRef.trim() || undefined,
        receiptUrl: uploadedReceiptUrl || undefined,
      });

      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard/live");
      } else {
        toast.error(res.error || "حدث خطأ أثناء حجز التذكرة");
      }
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Existing Status Banner */}
      {existingStatus === "PENDING" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 flex items-start gap-4 animate-in fade-in">
          <Clock className="w-8 h-8 text-amber-400 shrink-0 mt-1 animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-amber-300">
              طلب تذكرة الحضور قيد المراجعة حالياً ⏳
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              لقد قمت بإرسال إيصال الدفع مسبقاً وتجري مراجعته من قبل إدارة المنصة. ستصلك رسالة فور تفعيل التذكرة وستتمكن من دخول القاعة الافتراضية مباشرة. يمكنك إعادة إرسال بيانات محدثة إن أردت.
            </p>
          </div>
        </div>
      )}

      {/* Payment Instruction Tabs */}
      {price > 0 && (
        <div className="bg-[#0D1525] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-white">طريقة تحويل قيمة التذكرة</h2>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "VODAFONE_CASH", label: "فودافون كاش", icon: "📱", badge: "محفظة هاتف" },
              { id: "INSTAPAY", label: "انستاباي (InstaPay)", icon: "⚡", badge: "تحويل فوري" },
              { id: "BANK_TRANSFER", label: "تحويل بنكي", icon: "🏦", badge: "حساب بنكي" },
            ].map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  paymentMethod === method.id
                    ? "bg-cyan-500/15 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {method.badge}
                  </span>
                </div>
                <span className="text-sm font-black mt-3">{method.label}</span>
              </button>
            ))}
          </div>

          {/* Detailed Instructions per Method */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4 text-xs text-slate-300">
            {paymentMethod === "VODAFONE_CASH" && (
              <div className="space-y-3">
                <p className="font-bold text-white">
                  يرجى تحويل مبلغ <span className="text-cyan-400 font-mono text-sm">{price} ج.م</span> إلى رقم محفظة فودافون كاش الرسمية:
                </p>
                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-3">
                  <span className="font-mono text-base font-black text-cyan-300 tracking-wider">
                    01011358667
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("01011358667", "رقم فودافون كاش")}
                    className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedText === "رقم فودافون كاش" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ الرقم</span>
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">
                  💡 بعد إتمام التحويل، خذ لقطة شاشة (Screenshot) لرسالة التأكيد وارفقها بالأسفل.
                </p>
              </div>
            )}

            {paymentMethod === "INSTAPAY" && (
              <div className="space-y-3">
                <p className="font-bold text-white">
                  يرجى تحويل مبلغ <span className="text-cyan-400 font-mono text-sm">{price} ج.م</span> عبر تطبيق انستاباي (InstaPay) إلى:
                </p>
                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">رقم الهاتف المرتبط بحساب انستاباي:</span>
                    <span className="font-mono text-base font-black text-cyan-300 tracking-wider">
                      01011358667
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("01011358667", "رقم انستاباي")}
                    className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedText === "رقم انستاباي" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ الرقم</span>
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">
                  💡 التفعيل عبر انستاباي سريع للغاية فور مطابقة الإيصال.
                </p>
              </div>
            )}

            {paymentMethod === "BANK_TRANSFER" && (
              <div className="space-y-3">
                <p className="font-bold text-white">
                  يرجى تحويل مبلغ <span className="text-cyan-400 font-mono text-sm">{price} ج.م</span> للحساب البنكي المعتمد:
                </p>
                <div className="space-y-2 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">البنك:</span>
                    <span className="text-white font-bold">البنك الأهلي المصري (NBE)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">رقم الحساب:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-300 font-bold">1011358667001</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("1011358667001", "رقم الحساب")}
                        className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation & Upload Form */}
      <form onSubmit={handleSubmit} className="bg-[#0D1525] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <Upload className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-black text-white">بيانات إثبات السداد وتأكيد التذكرة</h2>
        </div>

        {price > 0 && (
          <div className="space-y-4">
            {/* Sender Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رقم الهاتف / المحفظة التي تم التحويل منها *
              </label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                required
                placeholder="مثال: 010xxxxxxxx"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Transaction Ref */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الرقم المرجعي أو كود العملية (اختياري)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="الرقم المرجعي من تطبيق انستاباي أو رسالة فودافون كاش"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                صورة إيصال التحويل (لقطة شاشة أو إشعار البنك) *
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {receiptPreview ? (
                <div className="relative rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={receiptPreview}
                      alt="معاينة الإيصال"
                      className="w-16 h-16 object-cover rounded-xl border border-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">تم إرفاق صورة الإيصال بنجاح ✓</p>
                      <p className="text-[10px] text-slate-400">انقر على زر الحذف لتغيير الصورة</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-colors text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/5 hover:bg-white/10 group"
                >
                  <ImageIcon className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 mx-auto mb-3 transition-colors" />
                  <p className="text-xs font-bold text-slate-200 mb-1">
                    انقر هنا لرفع لقطة شاشة الإيصال
                  </p>
                  <p className="text-[10px] text-slate-400">
                    يدعم ملفات JPG و PNG حتى حجم 5 ميجابايت
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Free Session Notice */}
        {price === 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-emerald-300">هذه الحصة مجانية بالكامل لجميع الطلاب!</p>
              <p className="text-slate-300 mt-0.5">
                لا يتطلب منك أي دفع، فقط اضغط على تأكيد التسجيل لحجز مقعدك فوراً.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/dashboard/live"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>إلغاء والعودة لجدول الحصص</span>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-theme-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إرسال الطلب والإيصال...</span>
              </>
            ) : price === 0 ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>تأكيد تسجيل الحضور المجاني ✓</span>
              </>
            ) : (
              <>
                <Radio className="w-5 h-5" />
                <span>إرسال إيصال السداد وحجز التذكرة ↗</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
