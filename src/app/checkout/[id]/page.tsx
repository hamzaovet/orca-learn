import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: { university: { include: { country: true } } }
  });

  if (!course) {
    notFound();
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: (session.user as any).id,
        courseId: id,
      }
    }
  });

  // Only redirect if active
  if (existingEnrollment && existingEnrollment.status === "ACTIVE") {
    redirect(`/dashboard/courses/${id}`);
  }

  const currencyCode = course.university?.country?.currencyCode || 'EGP';
  const isFree = course.priceLocal === 0;

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 py-16 px-4 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div 
        className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ background: "var(--theme-glow)" }}
      />
      <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href={`/courses/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--theme-primary)] mb-8 transition-colors text-sm font-medium">
          <ArrowRight className="w-4 h-4"/> العودة لتفاصيل الكورس
        </Link>
        
        <div className="bg-[#0B1221]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--theme-gradient)]" />
          
          <div className="mb-8">
            <span className="text-xs font-bold text-[var(--theme-primary)] uppercase tracking-wider block mb-1">
              بوابة الدفع والاشتراك
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white">إتمام الاشتراك في الكورس</h1>
          </div>
          
          {/* Course Summary Box */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-slate-400 text-xs mb-1">المقرر المطلوب:</p>
              <h2 className="text-lg font-bold text-white">{course.title}</h2>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-slate-400 text-xs mb-1">المبلغ المطلوب:</p>
              <div className="text-2xl font-black text-[var(--theme-primary)] font-mono">
                {isFree ? 'مجاناً' : `${course.priceLocal} ${currencyCode}`}
              </div>
            </div>
          </div>

          <CheckoutClient 
            courseId={id} 
            price={course.priceLocal} 
            currencyCode={currencyCode}
            existingStatus={existingEnrollment?.status || null}
            existingPhone={existingEnrollment?.senderPhone || null}
            existingReceipt={existingEnrollment?.receiptUrl || null}
          />
        </div>
      </div>
    </div>
  );
}
