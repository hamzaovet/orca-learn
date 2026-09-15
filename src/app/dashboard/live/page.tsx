import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Radio, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  PlayCircle, 
  Lock, 
  ArrowRight,
  BookOpen,
  GraduationCap
} from "lucide-react";
import CountdownTimer from "@/components/live/CountdownTimer";

export const dynamic = "force-dynamic";

export default async function StudentLiveDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const userName = session.user.name || "طالب أوركا";

  // Fetch all live sessions with course info
  const [liveSessions, userTickets, userEnrollments] = await Promise.all([
    prisma.liveSession.findMany({
      where: {
        status: { in: ["LIVE", "SCHEDULED", "ENDED"] },
      },
      include: {
        course: {
          select: { id: true, title: true, thumbnail: true },
        },
      },
      orderBy: [
        { status: "asc" }, // LIVE first conceptually
        { scheduledAt: "desc" },
      ],
    }),
    prisma.liveTicket.findMany({
      where: { userId },
    }),
    prisma.enrollment.findMany({
      where: { userId, status: "ACTIVE" },
      select: { courseId: true },
    }),
  ]);

  const activeEnrolledCourseIds = new Set(userEnrollments.map((e) => e.courseId));
  const ticketsMap = new Map(userTickets.map((t) => [t.sessionId, t]));

  // Categorize
  const liveNowSessions = liveSessions.filter((s) => s.status === "LIVE");
  const upcomingSessions = liveSessions.filter((s) => s.status === "SCHEDULED");
  const pastSessions = liveSessions.filter((s) => s.status === "ENDED");

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 py-24 px-4 md:px-8 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black mb-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>الفصول الافتراضية والحصص المباشرة</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              حصص البث المباشر (Live Classroom) 🔴
            </h1>
            <p className="text-slate-400 mt-2 text-base max-w-2xl leading-relaxed">
              احضر الحصص والمراجعات التفاعلية المباشرة مع <strong className="text-cyan-400">د. صالحة جابر</strong> داخل المنصة، وشارك بالصوت والصورة والشات دون مغادرة الموقع.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>العودة لكورساتي</span>
            </Link>
          </div>
        </div>

        {/* ── SECTION 1: LIVE NOW (If Any) ── */}
        {liveNowSessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <h2 className="text-xl font-black text-rose-400">جارٍ البث المباشر الآن!</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveNowSessions.map((session) => {
                const userTicket = ticketsMap.get(session.id);
                const isCourseEnrolled =
                  session.courseId &&
                  session.isFreeForCourseEnrolled &&
                  activeEnrolledCourseIds.has(session.courseId);

                const hasAccess =
                  session.price === 0 ||
                  isCourseEnrolled ||
                  userTicket?.status === "ACTIVE";

                const isPending = userTicket?.status === "PENDING";

                return (
                  <div
                    key={session.id}
                    className="bg-gradient-to-br from-[#0D1525] via-[#101B2E] to-[#150E22] border-2 border-rose-500/60 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.25)] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-slate-950 text-xs font-black animate-pulse">
                          <Radio className="w-3.5 h-3.5" />
                          <span>مباشر الآن 🔴</span>
                        </span>

                        <span className="text-xs font-bold text-slate-400">
                          المدة: {session.duration} دقيقة
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white leading-snug">
                        {session.title}
                      </h3>

                      {session.course && (
                        <p className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                          <span>تابعة لكورس:</span>
                          <span>{session.course.title}</span>
                        </p>
                      )}

                      {session.description && (
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {session.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-4">
                      {hasAccess ? (
                        <Link
                          href={`/live/${session.id}`}
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black py-4 rounded-2xl text-center shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Video className="w-5 h-5" />
                          <span>انضم للبث المباشر فوراً (القاعة مفتوحة) ↗</span>
                        </Link>
                      ) : isPending ? (
                        <Link
                          href={`/checkout/live/${session.id}`}
                          className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold py-3.5 rounded-2xl text-center text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          <span>طلب تذكرتك قيد مراجعة الإيصال ⏳ (عرض الفاتورة)</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/checkout/live/${session.id}`}
                          className="w-full btn-theme-primary py-4 rounded-2xl font-black text-center text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          <span>احجز تذكرتك وادخل البث ({session.price} ج.م)</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECTION 2: UPCOMING SESSIONS ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">الحصص القادمة والمراجعات المجدولة ⏳</h2>
              <p className="text-xs text-slate-400 mt-1">
                سجل تذكرتك مسبقاً وتأكد من تفعيلها لتتمكن من الدخول فور بدء البث.
              </p>
            </div>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="bg-[#0D1525] border border-white/5 rounded-3xl p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-bold">
                لا توجد حصص مجدولة حالياً. ترقبوا الإعلان عن الحصص القادمة قريباً!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => {
                const userTicket = ticketsMap.get(session.id);
                const isCourseEnrolled =
                  session.courseId &&
                  session.isFreeForCourseEnrolled &&
                  activeEnrolledCourseIds.has(session.courseId);

                const hasAccess =
                  session.price === 0 ||
                  isCourseEnrolled ||
                  userTicket?.status === "ACTIVE";

                const isPending = userTicket?.status === "PENDING";

                const scheduledDate = new Date(session.scheduledAt);
                const dateFormatted = scheduledDate.toLocaleDateString("ar-EG", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const timeFormatted = scheduledDate.toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={session.id}
                    className="bg-[#0D1525] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        {session.price > 0 ? (
                          <span className="text-[11px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                            تذكرة: {session.price} ج.م
                          </span>
                        ) : (
                          <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            مجانية لجميع الطلاب
                          </span>
                        )}

                        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md font-bold">
                          {session.sessionType === "WEBRTC" ? "غرفة مدمجة 🎓" : "بث مباشر 📡"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-black text-white leading-snug group-hover:text-cyan-400 transition-colors">
                        {session.title}
                      </h3>

                      {session.course && (
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <span>المقرر:</span>
                          <span className="text-slate-300 font-bold">{session.course.title}</span>
                        </p>
                      )}

                      {/* Date & Time */}
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-xs space-y-1.5 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{dateFormatted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{timeFormatted} ({session.duration} دقيقة)</span>
                        </div>
                      </div>

                      {/* Countdown Timer */}
                      <div className="pt-1">
                        <CountdownTimer targetDate={session.scheduledAt} />
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-6 mt-6 border-t border-white/10">
                      {hasAccess ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>أنت مسجل ومؤهل للحضور ✓</span>
                          </div>
                          <Link
                            href={`/live/${session.id}`}
                            className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl text-center text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>فتح قاعة الانتظار ↗</span>
                          </Link>
                        </div>
                      ) : isPending ? (
                        <Link
                          href={`/checkout/live/${session.id}`}
                          className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold py-3 rounded-xl text-center text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          <span>الإيصال قيد المراجعة ⏳</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/checkout/live/${session.id}`}
                          className="w-full btn-theme-primary py-3.5 rounded-xl font-black text-center text-xs transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <span>حجز تذكرة الحضور ({session.price} ج.م) ↗</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── SECTION 3: PAST & RECORDED SESSIONS (Archive) ── */}
        {pastSessions.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div>
              <h2 className="text-xl font-black text-slate-300">أرشيف الحصص السابقة والتسجيلات 📼</h2>
              <p className="text-xs text-slate-400 mt-1">
                يمكنك إعادة مشاهدة تسجيلات الحصص السابقة لمراجعة ما فاتك.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0A101C] border border-white/5 rounded-3xl p-5 shadow-lg flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2.5 py-0.5 rounded-md">
                      حصة سابقة منتهية
                    </span>
                    <h4 className="text-base font-bold text-white line-clamp-1">{session.title}</h4>
                    {session.course && (
                      <p className="text-xs text-slate-400">{session.course.title}</p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5">
                    {session.recordingUrl ? (
                      <a
                        href={session.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-theme-primary w-full py-2.5 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>مشاهدة التسجيل الآن 📼</span>
                      </a>
                    ) : (
                      <span className="block text-center text-xs text-slate-500 py-2">
                        التسجيل قيد المعالجة قريباً
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
