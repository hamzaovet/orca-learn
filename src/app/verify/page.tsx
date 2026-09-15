import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, Search, ShieldCheck, Award, GraduationCap, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; code?: string }>;
}) {
  const { token, code } = await searchParams;

  // Mode 1: Certificate Verification by Code
  if (code) {
    const certCode = code.trim().toUpperCase();
    const cert = await prisma.certificate.findUnique({
      where: { certificateCode: certCode },
      include: {
        user: { select: { id: true, name: true } },
        course: { select: { id: true, title: true } },
      },
    });

    const isRevoked = cert?.isRevoked;
    const isValid = !!cert && !isRevoked;

    const issueDateFormatted = cert
      ? new Date(cert.issueDate).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14] p-4 md:p-8 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-xl w-full bg-[#0D1525] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 space-y-6">
          {isValid ? (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>شهادة معتمدة وموثقة رسمياً ✓</span>
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  صحة بيانات الشهادة مؤكدة
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  الكود المعتمد: {cert.certificateCode}
                </p>
              </div>

              {/* Certificate Details Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-right text-xs space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-slate-400">اسم الطالب:</span>
                  <span className="font-bold text-white text-sm">{cert.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-slate-400">المقرر الدراسي:</span>
                  <span className="font-bold text-cyan-300">{cert.courseTitle}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-slate-400">التقدير العام:</span>
                  <span className="font-bold text-emerald-400">{cert.grade}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-slate-400">تاريخ الاعتماد:</span>
                  <span className="font-mono text-slate-200">{issueDateFormatted}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">المشرف الأكاديمي:</span>
                  <span className="font-bold text-amber-300">أ.د. صالحة جابر الدسوقي</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={`/dashboard/certificates/${cert.certificateCode}`}
                  className="btn-theme-primary w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                >
                  <Award className="w-4 h-4" />
                  <span>عرض وطباعة الشهادة ↗</span>
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)] mx-auto">
                <XCircle className="w-10 h-10" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white">الشهادة غير صالحة</h1>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {isRevoked
                    ? "تم سحب أو إلغاء هذه الشهادة من قبل الإدارة الأكاديمية."
                    : "لم يتم العثور على أي شهادة مسجلة بهذا الكود في قاعدة بيانات أوركا ليرن."}
                </p>
              </div>

              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3.5 rounded-xl text-xs transition-all"
              >
                <span>البحث عن كود آخر</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mode 2: Email Verification Token
  if (token) {
    let status = "success";
    let message = "تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول لمنصة أوركا ليرن.";

    const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });
    if (!verificationToken) {
      status = "error";
      message = "هذا الرابط غير صالح أو تم استخدامه بالفعل.";
    } else if (new Date() > verificationToken.expires) {
      status = "error";
      message = "رابط التفعيل منتهي الصلاحية. برجاء التسجيل مرة أخرى.";
    } else {
      await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });
      await prisma.verificationToken.delete({ where: { token } });
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14] p-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-[#111827]/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          {status === "success" ? (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle className="w-12 h-12" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-500/20 text-rose-400 mb-6 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
              <XCircle className="w-12 h-12" />
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-white mb-4">
            {status === "success" ? "تم التفعيل بنجاح!" : "فشل التفعيل"}
          </h1>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">{message}</p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            الذهاب لتسجيل الدخول <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Mode 3: General Verification Portal Search Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14] p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0D1525] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 space-y-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">بوابة التحقق من الشهادات</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            أدخل كود الشهادة المعتمد للتأكد من صحتها والتحقق من اعتمادات الأستاذة الدكتورة صالحة جابر ومنصة Orca Learn.
          </p>
        </div>

        <form action="/verify" method="GET" className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              كود الشهادة الرسمي (Certificate Code)
            </label>
            <input
              type="text"
              name="code"
              required
              placeholder="مثال: ORCA-2026-B84F"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono text-center uppercase tracking-widest"
            />
          </div>

          <button
            type="submit"
            className="btn-theme-primary w-full py-3.5 rounded-xl font-black text-xs transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>فحص وتوثيق الشهادة الآن ↗</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
