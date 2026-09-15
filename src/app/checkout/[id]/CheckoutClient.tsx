"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, CheckCircle2, Copy, Check, Clock, AlertCircle, Smartphone, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { submitEnrollmentRequest } from "@/actions/enrollments";
import toast from "react-hot-toast";

interface CheckoutClientProps {
  courseId: string;
  price: number;
  currencyCode?: string;
  existingStatus?: string | null;
  existingPhone?: string | null;
  existingReceipt?: string | null;
}

export default function CheckoutClient({
  courseId,
  price,
  currencyCode = "EGP",
  existingStatus,
  existingPhone,
  existingReceipt,
}: CheckoutClientProps) {
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
      let uploadedReceiptUrl = receiptPreview || "";

      // 1. Upload receipt if new file selected
      if (receiptFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", receiptFile);

        const uploadRes = await fetch("/api/upload-receipt", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.error || "فشل رفع صورة الإيصال");
        }
        uploadedReceiptUrl = uploadJson.url;
      }

      // 2. Submit Enrollment via Server Action
      const res = await submitEnrollmentRequest({
        courseId,
        pricePaid: price,
        paymentMethod,
        senderPhone: senderPhone.trim(),
        transactionRef: transactionRef.trim(),
        receiptUrl: uploadedReceiptUrl,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      toast.success("تم إرسال طلب الاشتراك بنجاح!");
      router.push(`/checkout/success?courseId=${courseId}&enrollmentId=${res.enrollmentId}`);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إرسال الطلب");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Existing Pending Banner */}
      {existingStatus === "PENDING" && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1 text-xs">
            <strong className="text-amber-300 font-bold text-sm block">طلبك السابق قيد المراجعة والتدقيق ⏳</strong>
            <p className="text-slate-300 leading-relaxed">
              لقد قمت بإرسال إيصال الدفع مسبقاً، وإدارة المنصة تقوم حالياً بمطابقة العملية وتفعيل الكورس في حسابك. يمكنك تعديل الإيصال أو إعادة إرساله أدناه إذا لزم الأمر.
            </p>
          </div>
        </div>
      )}

      {/* Payment Instructions Card */}
      {price > 0 && (
        <div className="bg-[#050B14]/80 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>خطوة 1: اختر وسيلة التحويل وحوّل المبلغ ({price} {currencyCode})</span>
            </h3>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("VODAFONE_CASH")}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                paymentMethod === "VODAFONE_CASH"
                  ? "border-[var(--theme-primary)] bg-[var(--theme-badge-bg)] text-white shadow-lg"
                  : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">فودافون كاش ومحافظ</span>
                {paymentMethod === "VODAFONE_CASH" && <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)]" />}
              </div>
              <span className="text-[11px] text-slate-400">أي محفظة إلكترونية مصرية</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("INSTAPAY")}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                paymentMethod === "INSTAPAY"
                  ? "border-[var(--theme-primary)] bg-[var(--theme-badge-bg)] text-white shadow-lg"
                  : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">انستاباي (InstaPay)</span>
                {paymentMethod === "INSTAPAY" && <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)]" />}
              </div>
              <span className="text-[11px] text-slate-400">تحويل لحظي مباشر</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("BANK_TRANSFER")}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                paymentMethod === "BANK_TRANSFER"
                  ? "border-[var(--theme-primary)] bg-[var(--theme-badge-bg)] text-white shadow-lg"
                  : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">تحويل بنكي</span>
                {paymentMethod === "BANK_TRANSFER" && <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)]" />}
              </div>
              <span className="text-[11px] text-slate-400">حساب بنك مصر / الأهلي</span>
            </button>
          </div>

          {/* Details Box based on method */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
            {paymentMethod === "VODAFONE_CASH" && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">رقم محفظة فودافون كاش المعتمدة:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("01011358667", "رقم فودافون كاش")}
                    className="text-xs text-[var(--theme-primary)] hover:underline flex items-center gap-1 font-bold"
                  >
                    {copiedText === "رقم فودافون كاش" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "رقم فودافون كاش" ? "تم النسخ" : "نسخ الرقم"}</span>
                  </button>
                </div>
                <div className="mt-1 text-lg font-mono font-black text-white tracking-widest" dir="ltr">
                  01011358667
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  * حوّل مبلغ ({price} {currencyCode}) على هذا الرقم من أي محفظة، وخذ لقطة شاشة (Screenshot) لرسالة التأكيد.
                </p>
              </div>
            )}

            {paymentMethod === "INSTAPAY" && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">معرف / رقم هاتف انستاباي InstaPay:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("01011358667", "حساب انستاباي")}
                    className="text-xs text-[var(--theme-primary)] hover:underline flex items-center gap-1 font-bold"
                  >
                    {copiedText === "حساب انستاباي" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "حساب انستاباي" ? "تم النسخ" : "نسخ الحساب"}</span>
                  </button>
                </div>
                <div className="mt-1 text-lg font-mono font-black text-white tracking-widest" dir="ltr">
                  01011358667
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  * افتح تطبيق انستاباي، اختر إرسال نقود، وأدخل الرقم، ثم احفظ صورة إيصال التحويل الناجح.
                </p>
              </div>
            )}

            {paymentMethod === "BANK_TRANSFER" && (
              <div>
                <span className="text-xs text-slate-400">التحويل البنكي المباشر:</span>
                <div className="mt-1 text-sm font-bold text-white">
                  بنك مصر — فرع جامعة السويس
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono text-slate-300">IBAN: EG450002000100000001011358667</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("EG450002000100000001011358667", "رقم الآيبان")}
                    className="text-xs text-[var(--theme-primary)] hover:underline flex items-center gap-1 font-bold"
                  >
                    {copiedText === "رقم الآيبان" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "رقم الآيبان" ? "تم النسخ" : "نسخ الآيبان"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#050B14]/80 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-white font-bold text-sm">
              <span>خطوة 2: أدخل بيانات التحويل وأرفق صورة الإيصال</span>
            </h3>
          </div>

          <div className="space-y-4">
            {/* Sender Phone */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                رقم المحفظة / الهاتف الذي قمت بالتحويل منه *
              </label>
              <input
                type="tel"
                required={price > 0}
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="مثال: 010xxxxxxxx أو 011xxxxxxxx"
                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)] font-mono transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Transaction Ref */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                الرقم المرجعي أو كود العملية (اختياري)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="مثال: Ref # 4829104"
                className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--theme-primary)] font-mono transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Receipt Upload & Preview */}
            {price > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  صورة إيصال التحويل (Screenshot) *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />

                {!receiptPreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-white/15 hover:border-[var(--theme-primary)] bg-black/20 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[var(--theme-badge-bg)] text-slate-400 group-hover:text-[var(--theme-primary)] flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200 block">
                        اضغط لرفع صورة إيصال التحويل
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        صورة شاشة من تطبيق المحفظة أو رسالة الـ SMS (PNG, JPG)
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/40 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={receiptPreview}
                          alt="معاينة إيصال الدفع"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم إرفاق صورة الإيصال</span>
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
                          {receiptFile ? receiptFile.name : "إيصال مسجل مسبقاً"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveReceipt}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="حذف الصورة واختيار صورة أخرى"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-theme-primary w-full py-4 rounded-2xl font-black text-white text-base shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري إرسال إيصال الدفع وتأكيد الطلب...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{price === 0 ? "تأكيد الاشتراك المجاني" : "إرسال إيصال الدفع وتأكيد طلب الاشتراك"}</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500">
          * يتم إرسال الإيصال مباشرة لإدارة منصة أوركا ليرن، وتقوم الدكتورة بمراجعته وتفعيل الكورس خلال وقت قصير.
        </p>
      </form>

    </div>
  );
}

