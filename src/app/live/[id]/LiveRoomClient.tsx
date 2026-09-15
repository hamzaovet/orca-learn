"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Radio, 
  Clock, 
  ArrowLeft, 
  ExternalLink, 
  PlayCircle, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Video,
  FileText
} from "lucide-react";
import JitsiClassroom from "@/components/live/JitsiClassroom";
import CountdownTimer from "@/components/live/CountdownTimer";
import { useRouter } from "next/navigation";

interface LiveRoomClientProps {
  session: any;
  user: {
    id: string;
    name: string;
    email?: string;
    role: string;
  };
  isHost: boolean;
}

export default function LiveRoomClient({
  session,
  user,
  isHost,
}: LiveRoomClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLive = session.status === "LIVE";
  const isScheduled = session.status === "SCHEDULED";
  const isEnded = session.status === "ENDED";

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // 1. WAITING ROOM (For students when session is scheduled but not started by Dr. Salha yet)
  if (isScheduled && !isHost) {
    const scheduledDate = new Date(session.scheduledAt);
    const dateFormatted = scheduledDate.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="min-h-screen bg-[#050B14] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-xl w-full bg-[#0D1525] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-6 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_40px_rgba(6,182,212,0.2)]">
            <Radio className="w-10 h-10 animate-pulse" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>قاعة الانتظار الافتراضية</span>
            </span>
            <h1 className="text-2xl font-black text-white leading-snug">
              {session.title}
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              موعد الحصة: {dateFormatted} (المدة: {session.duration} دقيقة)
            </p>
          </div>

          {/* Countdown */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-bold">الوقت المتبقي حتى موعد الحصة:</span>
            <CountdownTimer targetDate={session.scheduledAt} onExpire={handleRefresh} />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            أهلاً بك <strong className="text-cyan-400">{user.name}</strong>! تذكرتك مفعلة ومؤكدة بنجاح ✓. سيتم فتح قاعة البث المباشر فور قيام الدكتورة صالحة بإطلاق البث.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleRefresh}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
              <span>تحديث حالة القاعة</span>
            </button>

            <Link
              href="/dashboard/live"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>العودة لجدول الحصص</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. ENDED SESSION
  if (isEnded) {
    return (
      <div className="min-h-screen bg-[#050B14] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="max-w-md w-full bg-[#0D1525] border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-slate-500/15 border border-slate-500/30 flex items-center justify-center text-slate-400 mx-auto">
            <Video className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">{session.title}</h1>
            <p className="text-xs text-slate-400 mt-2">
              لقد انتهت هذه الحصة المباشرة بالفعل.
            </p>
          </div>

          {session.recordingUrl ? (
            <div className="space-y-3">
              <p className="text-xs text-emerald-400 font-bold">
                تسجيل الحصة متاح للمشاهدة الآن:
              </p>
              <a
                href={session.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-theme-primary w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>مشاهدة التسجيل الآن 📼</span>
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              سيتم إتاحة تسجيل الحصة بالأرشيف فور اكتمال معالجته.
            </p>
          )}

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/dashboard/live"
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>العودة للحصص المباشرة</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. LIVE CLASSROOM (WebRTC, Stream, or External)
  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 flex flex-col pt-20 pb-8 px-3 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4">
        {/* Navigation Bar for Room */}
        <div className="flex items-center justify-between py-2 px-2">
          <Link
            href="/dashboard/live"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>مغادرة القاعة والعودة للحصص</span>
          </Link>

          {isHost && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>أنت مسجل كـ Host (الدكتورة صالحة / المشرف)</span>
              </span>
            </div>
          )}
        </div>

        {/* Room Body */}
        {session.sessionType === "WEBRTC" && (
          <JitsiClassroom
            roomName={session.roomName || `orca-live-${session.id}`}
            sessionTitle={session.title}
            userName={user.name}
            userEmail={user.email}
            isHost={isHost}
            onLeave={() => router.push("/dashboard/live")}
          />
        )}

        {session.sessionType === "STREAM" && (
          <div className="relative w-full h-[80vh] min-h-[500px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
            <div className="flex-1 w-full h-full">
              {session.streamUrl ? (
                <iframe
                  src={
                    session.streamUrl.includes("watch?v=")
                      ? session.streamUrl.replace("watch?v=", "embed/")
                      : session.streamUrl
                  }
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  لم يتم تحديد رابط البث بعد
                </div>
              )}
            </div>
          </div>
        )}

        {session.sessionType === "EXTERNAL" && (
          <div className="max-w-xl mx-auto w-full bg-[#0D1525] border border-white/10 rounded-3xl p-8 text-center space-y-6 my-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
              <Video className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">{session.title}</h2>
              <p className="text-xs text-slate-400 mt-2">
                هذه الحصة منعقدة عبر تطبيق Zoom / Google Meet.
              </p>
            </div>

            {session.streamUrl && (
              <a
                href={session.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-theme-primary w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl"
              >
                <span>الانضمام للاجتماع الآن ↗</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
