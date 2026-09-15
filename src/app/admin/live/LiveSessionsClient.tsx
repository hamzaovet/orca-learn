"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { 
  Radio, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Square, 
  Trash2, 
  FileText, 
  Copy, 
  DollarSign,
  Search,
  Eye,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { confirmToast } from "@/lib/confirmToast";
import { 
  createLiveSession, 
  updateLiveSessionStatus, 
  deleteLiveSession, 
  activateLiveTicket, 
  rejectLiveTicket, 
  deleteLiveTicket, 
  issueManualLiveTicket 
} from "@/actions/live-sessions";

interface LiveSessionsClientProps {
  sessions: any[];
  courses: any[];
  users: any[];
}

export default function LiveSessionsClient({
  sessions,
  courses,
  users,
}: LiveSessionsClientProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "LIVE" | "SCHEDULED" | "ENDED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);
  const [selectedUserIdForManual, setSelectedUserIdForManual] = useState("");

  // End Session Modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [endSessionId, setEndSessionId] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState("");

  // Create Form State
  const [sessionType, setSessionType] = useState<string>("WEBRTC");
  const [sessionPrice, setSessionPrice] = useState<number>(0);

  // Statistics
  const totalSessions = sessions.length;
  const liveCount = sessions.filter((s) => s.status === "LIVE").length;
  const scheduledCount = sessions.filter((s) => s.status === "SCHEDULED").length;
  const totalTickets = sessions.reduce((acc, s) => acc + (s.tickets?.length || 0), 0);

  // Filtered Sessions
  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "LIVE" && session.status !== "LIVE") return false;
    if (activeTab === "SCHEDULED" && session.status !== "SCHEDULED") return false;
    if (activeTab === "ENDED" && session.status !== "ENDED") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = session.title.toLowerCase().includes(q);
      const matchCourse = session.course?.title?.toLowerCase().includes(q);
      return matchTitle || matchCourse;
    }
    return true;
  });

  // Action Handlers
  const handleStartLive = (id: string, title: string) => {
    confirmToast({
      title: "بدء البث المباشر 🔴",
      message: `هل أنتِ متأكدة من إطلاق البث المباشر لحصة "${title}" الآن؟ سيتلقى الطلاب إشعاراً بالبدء.`,
      confirmText: "نعم، ابدأ البث الآن",
      onConfirm: () => {
        startTransition(async () => {
          const res = await updateLiveSessionStatus(id, "LIVE");
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const openEndSessionModal = (id: string) => {
    setEndSessionId(id);
    setRecordingUrl("");
    setIsEndModalOpen(true);
  };

  const handleConfirmEndSession = () => {
    if (!endSessionId) return;
    startTransition(async () => {
      const res = await updateLiveSessionStatus(endSessionId, "ENDED", recordingUrl);
      if (res.success) {
        toast.success(res.message);
        setIsEndModalOpen(false);
      } else {
        toast.error(res.error || "حدث خطأ");
      }
    });
  };

  const handleDeleteSession = (id: string, title: string) => {
    confirmToast({
      title: "حذف الحصة المباشرة نهائياً",
      message: `هل أنت متأكد من حذف حصة "${title}"؟ سيتم حذف جميع التذاكر وسجلات الحضور المرتبطة بها.`,
      confirmText: "نعم، احذف الحصة",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteLiveSession(id);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createLiveSession(formData);
      if (res.success) {
        toast.success(res.message);
        setIsCreateModalOpen(false);
        form.reset();
      } else {
        toast.error(res.error || "حدث خطأ أثناء الإنشاء");
      }
    });
  };

  // Ticket Handlers
  const handleActivateTicket = (ticketId: string, studentName: string) => {
    confirmToast({
      title: "تأكيد تفعيل تذكرة الحضور",
      message: `هل تريد تفعيل تذكرة الطالب "${studentName}" للسماح له بدخول البث؟`,
      confirmText: "نعم، فعّل التذكرة",
      onConfirm: () => {
        startTransition(async () => {
          const res = await activateLiveTicket(ticketId);
          if (res.success) {
            toast.success(res.message);
            // Refresh local selectedSession tickets
            setSelectedSession((prev: any) => ({
              ...prev,
              tickets: prev.tickets.map((t: any) =>
                t.id === ticketId ? { ...t, status: "ACTIVE" } : t
              ),
            }));
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const handleRejectTicket = (ticketId: string) => {
    const reason = prompt("يرجى كتابة سبب رفض التذكرة:", "بيانات التحويل غير مطابقة أو لم يصل المبلغ");
    if (!reason) return;

    startTransition(async () => {
      const res = await rejectLiveTicket(ticketId, reason);
      if (res.success) {
        toast.success(res.message);
        setSelectedSession((prev: any) => ({
          ...prev,
          tickets: prev.tickets.map((t: any) =>
            t.id === ticketId ? { ...t, status: "REJECTED", adminNote: reason } : t
          ),
        }));
      } else {
        toast.error(res.error || "حدث خطأ");
      }
    });
  };

  const handleDeleteTicket = (ticketId: string) => {
    confirmToast({
      title: "حذف التذكرة",
      message: "هل أنت متأكد من حذف هذه التذكرة؟",
      confirmText: "نعم، احذف التذكرة",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteLiveTicket(ticketId);
          if (res.success) {
            toast.success(res.message);
            setSelectedSession((prev: any) => ({
              ...prev,
              tickets: prev.tickets.filter((t: any) => t.id !== ticketId),
            }));
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const handleIssueManualTicket = () => {
    if (!selectedSession || !selectedUserIdForManual) {
      toast.error("يرجى اختيار الطالب أولاً");
      return;
    }

    startTransition(async () => {
      const res = await issueManualLiveTicket(selectedSession.id, selectedUserIdForManual);
      if (res.success) {
        toast.success(res.message);
        setIsTicketsModalOpen(false);
        setSelectedUserIdForManual("");
      } else {
        toast.error(res.error || "حدث خطأ أثناء منح التذكرة");
      }
    });
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>منظومة الفصول الافتراضية والبث المباشر</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            إدارة الحصص المباشرة واللايف 🔴
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            جدولة الفصول الافتراضية التفاعلية المدمجة، إطلاق البث، وإدارة تذاكر الحضور والمدفوعات.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-theme-primary px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>جدولة حصة لايف جديدة</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total */}
        <div className="bg-[#0D1525] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400">إجمالي الحصص</span>
            <p className="text-2xl font-black text-white">{totalSessions}</p>
          </div>
        </div>

        {/* Card 2: Live Now */}
        <div className="bg-[#0D1525] border border-rose-500/30 rounded-2xl p-5 shadow-xl flex items-center gap-4 relative overflow-hidden">
          {liveCount > 0 && (
            <span className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          )}
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400">مباشر الآن 🔴</span>
            <p className="text-2xl font-black text-rose-400">{liveCount}</p>
          </div>
        </div>

        {/* Card 3: Scheduled */}
        <div className="bg-[#0D1525] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400">حصص قادمة مجدولة</span>
            <p className="text-2xl font-black text-amber-400">{scheduledCount}</p>
          </div>
        </div>

        {/* Card 4: Tickets */}
        <div className="bg-[#0D1525] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400">إجمالي التذاكر والحضور</span>
            <p className="text-2xl font-black text-emerald-400">{totalTickets}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#08101E] border border-white/10 p-3 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: "كافة الحصص" },
            { id: "LIVE", label: "مباشر الآن 🔴" },
            { id: "SCHEDULED", label: "القادمة ⏳" },
            { id: "ENDED", label: "المنتهية والمسجلة ✓" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "btn-theme-primary"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بعنوان الحصة أو الكورس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="bg-[#0D1525] border border-white/10 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <Radio className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-2">لا توجد حصص مباشرة في هذا التبويب</h3>
          <p className="text-slate-400 text-sm max-w-md">
            يمكنك جدولة أول حصة لايف تفاعلية بالضغط على زر "جدولة حصة لايف جديدة" بالأعلى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const scheduledDate = new Date(session.scheduledAt);
            const dateFormatted = scheduledDate.toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const timeFormatted = scheduledDate.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const activeTicketsCount = session.tickets?.filter(
              (t: any) => t.status === "ACTIVE"
            ).length || 0;
            const pendingTicketsCount = session.tickets?.filter(
              (t: any) => t.status === "PENDING"
            ).length || 0;

            const isLive = session.status === "LIVE";
            const isEnded = session.status === "ENDED";

            return (
              <div
                key={session.id}
                className={`bg-[#0D1525] border rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 ${
                  isLive
                    ? "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/30"
                    : "border-white/10"
                }`}
              >
                <div>
                  {/* Card Header: Badges */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                          مباشر الآن 🔴
                        </span>
                      ) : isEnded ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-500/15 border border-slate-500/30 text-slate-400 text-xs font-bold">
                          انتهت الحصة ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                          ⏳ قادمة
                        </span>
                      )}

                      {/* Type Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold">
                        {session.sessionType === "WEBRTC"
                          ? "غرفة مدمجة 🎓"
                          : session.sessionType === "STREAM"
                          ? "بث مباشر 📡"
                          : "زووم خارجي 🔗"}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div>
                      {session.price > 0 ? (
                        <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                          {session.price} ج.م للتذكرة
                        </span>
                      ) : (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                          مجانية لجميع الطلاب
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Course */}
                  <h3 className="text-xl font-black text-white mb-2 leading-snug">
                    {session.title}
                  </h3>

                  {session.course && (
                    <p className="text-xs text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
                      <span>تابعة لكورس:</span>
                      <span className="underline">{session.course.title}</span>
                    </p>
                  )}

                  {session.description && (
                    <p className="text-slate-400 text-xs line-clamp-2 mb-5 leading-relaxed">
                      {session.description}
                    </p>
                  )}

                  {/* Date & Time Info */}
                  <div className="grid grid-cols-2 gap-3 bg-white/5 border border-white/5 rounded-2xl p-3.5 text-xs text-slate-300 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{dateFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{timeFormatted} ({session.duration} دقيقة)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Left: Attendees count & View Button */}
                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      setIsTicketsModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10"
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>الحضور والتذاكر ({activeTicketsCount})</span>
                    {pendingTicketsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                        +{pendingTicketsCount} مراجعة
                      </span>
                    )}
                  </button>

                  {/* Right: Host Actions */}
                  <div className="flex items-center gap-2">
                    {/* Enter Host Room Button */}
                    <Link
                      href={`/live/${session.id}`}
                      target="_blank"
                      className="btn-theme-primary px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md"
                      title="دخول القاعة كمعلمة (Host)"
                    >
                      <Video className="w-4 h-4" />
                      <span>دخول القاعة (Host)</span>
                    </Link>

                    {/* Start / End toggle */}
                    {!isLive && !isEnded && (
                      <button
                        onClick={() => handleStartLive(session.id, session.title)}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                        title="بدء البث المباشر فوراً"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>إطلاق</span>
                      </button>
                    )}

                    {isLive && (
                      <button
                        onClick={() => openEndSessionModal(session.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                        title="إنهاء البث المباشر"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>إنهاء</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteSession(session.id, session.title)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                      title="حذف الحصة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Create New Live Session ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B1323] border border-white/15 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-black text-white">جدولة حصة لايف جديدة</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  عنوان الحصة المباشرة *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="مثال: مراجعة ليلة الامتحان الشاملة - الأحياء الدقيقة"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  وصف ومحاور الحصة المباشرة
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="أبرز النقاط التي سيتم شرحها والأسئلة الشائعة..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Date & Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    تاريخ الحصة *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    توقيت البدء *
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    required
                    defaultValue="20:00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    المدة بالدقائق
                  </label>
                  <input
                    type="number"
                    name="duration"
                    defaultValue={90}
                    min={15}
                    max={360}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  نوع الغرفة التفاعلية والبث *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "WEBRTC", label: "غرفة مدمجة بالمنصة 🎓", desc: "كامل ميزات زووم تفاعلي داخل الموقع" },
                    { id: "STREAM", label: "بث مباشر عالي الكثافة 📡", desc: "يوتيوب مدمج مع شات للمراجعات الضخمة" },
                    { id: "EXTERNAL", label: "رابط خارجي (زووم) 🔗", desc: "توجيه لرابط زووم أو جوجل ميت" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSessionType(item.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        sessionType === item.id
                          ? "bg-cyan-500/15 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-xs font-black">{item.label}</span>
                      <span className="text-[10px] text-slate-500 mt-1">{item.desc}</span>
                    </button>
                  ))}
                </div>
                <input type="hidden" name="sessionType" value={sessionType} />
              </div>

              {/* Stream / Zoom URL if not WebRTC */}
              {sessionType !== "WEBRTC" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {sessionType === "STREAM" ? "رابط البث (YouTube / HLS URL) *" : "رابط اجتماع زووم (Zoom Meeting URL) *"}
                  </label>
                  <input
                    type="url"
                    name="streamUrl"
                    required
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Course Link & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ربط بكورس معين (اختياري)
                  </label>
                  <select
                    name="courseId"
                    className="w-full bg-[#0D1525] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="none">حصة عامة مستقلة (غير تابعة لكورس)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    المرحلة الدراسية
                  </label>
                  <select
                    name="stage"
                    className="w-full bg-[#0D1525] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">الجميع (كافة الطلاب)</option>
                    <option value="SECONDARY">المرحلة الثانوية 🎒</option>
                    <option value="UNIVERSITY">المرحلة الجامعية 🎓</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Free for course checkbox */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      سعر التذكرة (بالجنيه المصري)
                    </label>
                    <input
                      type="number"
                      name="price"
                      min={0}
                      defaultValue={0}
                      onChange={(e) => setSessionPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0D1525] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      ضع 0 لتكون الحصة مجانية بالكامل.
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        name="isFreeForCourseEnrolled"
                        value="true"
                        defaultChecked
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        متاحة مجاناً لطلاب الكورس المشتركين
                      </span>
                    </label>
                    <span className="text-[10px] text-slate-400 mt-1 mr-6">
                      إذا تم ربط الحصة بكورس، يُعفى طلاب الكورس المفعلون من سداد سعر التذكرة.
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-theme-primary px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  {isPending ? "جاري الجدولة..." : "حفظ وجدولة الحصة المباشرة ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: End Session & Add Recording ── */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B1323] border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Square className="w-5 h-5 fill-current" />
              <h3 className="text-lg font-black text-white">إنهاء الحصة المباشرة</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              سيتم إنهاء البث المباشر للطلاب. إذا قمتِ بتسجيل الحصة وترغبين في حفظ رابط التسجيل ليتمكن الطلاب من مشاهدتها كأرشيف لاحقاً، يمكنك إدخاله هنا:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رابط تسجيل الحصة (اختياري)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... أو رابط درايف"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEndModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmEndSession}
                disabled={isPending}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-2 rounded-xl text-xs font-black transition-all"
              >
                {isPending ? "جاري الإنهاء..." : "تأكيد إنهاء الحصة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Tickets & Attendees Management ── */}
      {isTicketsModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B1323] border border-white/15 rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  سجل التذاكر والحضور: {selectedSession.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  مراجعة طلبات الدفع وإيصالات الحضور، وتفعيل التذاكر أو منح تذاكر مجانية يدوياً.
                </p>
              </div>
              <button
                onClick={() => setIsTicketsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            {/* Manual Ticket Issuer Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-white">منح تذكرة حضور يدوياً لطالب:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedUserIdForManual}
                  onChange={(e) => setSelectedUserIdForManual(e.target.value)}
                  className="bg-[#0D1525] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-full sm:w-64"
                >
                  <option value="">-- اختر طالباً مسجلاً --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleIssueManualTicket}
                  disabled={!selectedUserIdForManual || isPending}
                  className="btn-theme-primary px-4 py-2 rounded-xl text-xs font-black shrink-0 disabled:opacity-50"
                >
                  منح التذكرة ✓
                </button>
              </div>
            </div>

            {/* Tickets Table */}
            {selectedSession.tickets?.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                لم يقم أي طالب بحجز تذكرة حضور لهذه الحصة بعد.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">الطالب</th>
                      <th className="py-3 px-4">طريقة السداد</th>
                      <th className="py-3 px-4">المبلغ</th>
                      <th className="py-3 px-4">الإيصال</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {selectedSession.tickets.map((ticket: any) => (
                      <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold">
                          <p className="text-white">{ticket.user?.name || "طالب"}</p>
                          <p className="text-[10px] text-slate-400">{ticket.user?.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-slate-300">
                            {ticket.paymentMethod}
                          </span>
                          {ticket.senderPhone && (
                            <p className="text-[10px] text-slate-400">{ticket.senderPhone}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-300">
                          {ticket.pricePaid} ج.م
                        </td>
                        <td className="py-3.5 px-4">
                          {ticket.receiptUrl ? (
                            <button
                              onClick={() => setPreviewReceiptUrl(ticket.receiptUrl)}
                              className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>عرض الإيصال</span>
                            </button>
                          ) : (
                            <span className="text-slate-500">لا يوجد</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {ticket.status === "ACTIVE" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              مفعلة ✓
                            </span>
                          ) : ticket.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                              بانتظار المراجعة ⏳
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                              مرفوضة ✕
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {ticket.status !== "ACTIVE" && (
                              <button
                                onClick={() => handleActivateTicket(ticket.id, ticket.user?.name || "طالب")}
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                                title="تفعيل التذكرة"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {ticket.status === "PENDING" && (
                              <button
                                onClick={() => handleRejectTicket(ticket.id)}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors"
                                title="رفض التذكرة"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="حذف التذكرة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: High-Res Receipt Preview ── */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B1323] border border-white/15 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>إيصال تحويل تذكرة الحضور</span>
              </h4>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[65vh] overflow-auto rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center p-2">
              <img
                src={previewReceiptUrl}
                alt="إيصال السداد"
                className="max-h-[60vh] object-contain rounded-xl"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <a
                href={previewReceiptUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح الصورة الأصلية في نافذة جديدة</span>
              </a>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
