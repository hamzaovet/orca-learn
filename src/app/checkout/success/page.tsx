import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock, FileText, Calendar, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ courseId?: string, enrollmentId?: string }> }) {
  const { courseId, enrollmentId } = await searchParams;

  if (!courseId || !enrollmentId) {
    notFound();
  }

  // Fetch the course and enrollment to display real details
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true }
  });

  if (!enrollment) {
    notFound();
  }

  const isPending = enrollment.status === "PENDING";

  const date = new Date(enrollment.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-25"
        style={{ background: isPending ? "rgba(245, 158, 11, 0.4)" : "var(--theme-glow)" }}
      />

      <div className="w-full max-w-lg bg-[#0B1221]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 border ${
            isPending 
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.3)]" 
              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          }`}>
            {isPending ? (
              <Clock className="w-10 h-10 animate-pulse" />
            ) : (
              <CheckCircle className="w-10 h-10" />
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
            {isPending ? "تم استلام إيصال التحويل بنجاح!" : "تم تفعيل اشتراكك بنجاح!"}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
            {isPending 
              ? "تم إرسال إيصال الدفع لإدارة المنصة، ويقوم فريق الدكتورة صالحة حالياً بمراجعته ومطابقة التحويل لتفعيل الكورس فوراً."
              : "تهانينا! أصبح الكورس متاحاً لك بالكامل، يمكنك الآن مشاهدة جميع المحاضرات وتحميل المذكرات."}
          </p>
        </div>

        {/* Invoice Box */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-5 mb-8 space-y-3.5">
          <h3 className="text-white font-bold text-sm mb-3 border-b border-white/5 pb-3 flex items-center justify-between">
            <span>ملخص تفاصيل الطلب</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              isPending 
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30" 
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            }`}>
              {isPending ? "قيد التدقيق ⏳" : "مفعل ونشط ✓"}
            </span>
          </h3>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> رقم الطلب</span>
            <span className="text-slate-200 font-mono text-[11px] truncate max-w-[150px]">{enrollment.id}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> التاريخ والوقت</span>
            <span className="text-slate-200">{date}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> الكورس</span>
            <span className="text-slate-200 font-bold truncate max-w-[170px]" title={enrollment.course.title}>{enrollment.course.title}</span>
          </div>

          {enrollment.senderPhone && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">رقم المحول منه</span>
              <span className="text-slate-200 font-mono" dir="ltr">{enrollment.senderPhone}</span>
            </div>
          )}

          <div className="pt-3 mt-2 border-t border-white/5 flex justify-between items-center">
            <span className="text-slate-300 font-bold text-xs">المبلغ</span>
            <span className="text-xl font-black text-[var(--theme-primary)] font-mono">
              {enrollment.pricePaid > 0 ? `${enrollment.pricePaid} ج.م` : 'مجاناً'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {isPending ? (
            <Link 
              href="/dashboard" 
              className="btn-theme-primary w-full py-3.5 rounded-xl font-black text-sm flex justify-center items-center gap-2 shadow-lg"
            >
              <span>الذهاب إلى بوابة الطالب (Dashboard)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              href={`/dashboard/courses/${courseId}`} 
              className="btn-theme-primary w-full py-3.5 rounded-xl font-black text-sm flex justify-center items-center gap-2 shadow-lg"
            >
              <span>الذهاب إلى قاعة المحاضرات</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link 
            href="/" 
            className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-xs font-bold flex justify-center items-center"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}
