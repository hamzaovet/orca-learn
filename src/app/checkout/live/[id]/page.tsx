import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { 
  Radio, 
  Calendar, 
  Clock, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from "lucide-react";
import CheckoutLiveClient from "./CheckoutLiveClient";

interface CheckoutLivePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function CheckoutLivePage({ params }: CheckoutLivePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/checkout/live/${id}`);
  }

  const userId = (session.user as any).id;

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: {
      course: {
        select: { id: true, title: true },
      },
      tickets: {
        where: { userId },
      },
    },
  });

  if (!liveSession) {
    notFound();
  }

  // Check if student has active course enrollment
  let isCourseEnrolled = false;
  if (liveSession.courseId && liveSession.isFreeForCourseEnrolled) {
    const courseEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: liveSession.courseId,
        },
      },
    });
    if (courseEnrollment && courseEnrollment.status === "ACTIVE") {
      isCourseEnrolled = true;
    }
  }

  const existingTicket = liveSession.tickets[0];

  // If already active, go directly to live room!
  if (existingTicket && existingTicket.status === "ACTIVE") {
    redirect(`/live/${id}`);
  }
  if (isCourseEnrolled) {
    redirect(`/live/${id}`);
  }

  const scheduledDate = new Date(liveSession.scheduledAt);
  const scheduledAtFormatted = scheduledDate.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 py-24 px-4 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/dashboard/live" className="hover:text-cyan-400 transition-colors">
            الحصص المباشرة
          </Link>
          <span>/</span>
          <span className="text-white font-bold truncate">حجز تذكرة: {liveSession.title}</span>
        </div>

        {/* Top Overview Card */}
        <div className="bg-gradient-to-br from-[#0D1525] to-[#121E36] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-black">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>تذكرة حضور فصل افتراضي مباشر</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-snug">
              {liveSession.title}
            </h1>

            {liveSession.course && (
              <p className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>تابعة لمقرر: {liveSession.course.title}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{scheduledAtFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>المدة: {liveSession.duration} دقيقة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>المحاضرة: د. صالحة جابر الدسوقي</span>
              </div>
            </div>
          </div>

          {/* Ticket Price Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center shrink-0 w-full md:w-auto">
            <span className="text-xs text-slate-400 block mb-1">قيمة التذكرة</span>
            {liveSession.price > 0 ? (
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-blue-400">
                {liveSession.price} <span className="text-sm font-sans text-slate-400">ج.م</span>
              </div>
            ) : (
              <div className="text-2xl font-black text-emerald-400">مجانية بالكامل</div>
            )}
            <span className="text-[10px] text-slate-500 mt-1 block">شاملة الحضور والنقاش</span>
          </div>
        </div>

        {/* Client Form */}
        <CheckoutLiveClient
          sessionId={liveSession.id}
          sessionTitle={liveSession.title}
          scheduledAtFormatted={scheduledAtFormatted}
          duration={liveSession.duration}
          price={liveSession.price}
          existingStatus={existingTicket?.status || null}
          existingPhone={existingTicket?.senderPhone || null}
          existingReceipt={existingTicket?.receiptUrl || null}
        />
      </div>
    </div>
  );
}
