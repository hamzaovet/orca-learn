"use client";

import { useState, useTransition } from "react";
import {
  CreditCard,
  UserCheck,
  Clock,
  UserX,
  Search,
  CheckCircle2,
  XCircle,
  PauseCircle,
  RefreshCw,
  Trash2,
  Loader2,
  ExternalLink,
  PlusCircle,
  X,
  Smartphone,
  Calendar,
  School,
  GraduationCap,
  Crown,
  Eye,
  FileText,
  AlertCircle
} from "lucide-react";
import {
  activateEnrollment,
  suspendEnrollment,
  rejectEnrollment,
  createManualEnrollment,
  deleteEnrollment
} from "@/actions/enrollments";
import { confirmToast } from "@/lib/confirmToast";
import toast from "react-hot-toast";

interface EnrollmentItem {
  id: string;
  userId: string;
  courseId: string;
  pricePaid: number;
  status: string;
  paymentMethod: string;
  senderPhone: string | null;
  transactionRef: string | null;
  receiptUrl: string | null;
  adminNote: string | null;
  activatedAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    username: string | null;
  };
  course: {
    id: string;
    title: string;
    stage: string;
    secondaryGrade?: { name: string } | null;
    university?: { name: string } | null;
    department?: { name: string } | null;
  };
}

interface SubscriptionsClientProps {
  initialEnrollments: EnrollmentItem[];
  users: { id: string; name: string | null; email: string | null; username: string | null }[];
  courses: { id: string; title: string; priceLocal: number; stage: string }[];
  stats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    revenue: number;
  };
}

export default function SubscriptionsClient({
  initialEnrollments,
  users,
  courses,
  stats,
}: SubscriptionsClientProps) {
  const [filterTab, setFilterTab] = useState<"ALL" | "PENDING" | "ACTIVE" | "SUSPENDED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectEnrollmentId, setRejectEnrollmentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [isPending, startTransition] = useTransition();

  // Filter logic
  const filteredEnrollments = initialEnrollments.filter((item) => {
    // Tab filter
    if (filterTab === "PENDING" && item.status !== "PENDING") return false;
    if (filterTab === "ACTIVE" && item.status !== "ACTIVE") return false;
    if (filterTab === "SUSPENDED" && (item.status !== "SUSPENDED" && item.status !== "REJECTED")) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const userName = (item.user.name || "").toLowerCase();
      const userEmail = (item.user.email || "").toLowerCase();
      const phone = (item.senderPhone || "").toLowerCase();
      const courseTitle = (item.course.title || "").toLowerCase();
      const ref = (item.transactionRef || "").toLowerCase();

      return (
        userName.includes(q) ||
        userEmail.includes(q) ||
        phone.includes(q) ||
        courseTitle.includes(q) ||
        ref.includes(q)
      );
    }

    return true;
  });

  // Action handlers
  const handleActivate = (id: string, userName: string, courseTitle: string) => {
    confirmToast({
      title: "تأكيد تفعيل الاشتراك",
      message: `هل أنت متأكد من تفعيل اشتراك الطالب "${userName}" في كورس "${courseTitle}"؟`,
      confirmText: "نعم، فعّل الكورس الآن",
      onConfirm: () => {
        startTransition(async () => {
          const res = await activateEnrollment(id);
          if (res.success) {
            toast.success(res.message || "تم تفعيل الاشتراك بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const handleSuspend = (id: string, userName: string, courseTitle: string) => {
    confirmToast({
      title: "تعطيل اشتراك الطالب",
      message: `هل تريد تعطيل وصول الطالب "${userName}" لكورس "${courseTitle}" مؤقتاً؟`,
      confirmText: "نعم، عطل الاشتراك",
      onConfirm: () => {
        startTransition(async () => {
          const res = await suspendEnrollment(id);
          if (res.success) {
            toast.success(res.message || "تم تعطيل الاشتراك");
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const openRejectModal = (id: string) => {
    setRejectEnrollmentId(id);
    setRejectReason("بيانات التحويل غير مطابقة أو لم يتم استلام المبلغ في المحفظة");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectEnrollmentId) return;
    startTransition(async () => {
      const res = await rejectEnrollment(rejectEnrollmentId, rejectReason);
      if (res.success) {
        toast.success(res.message || "تم رفض الطلب بنجاح");
        setIsRejectModalOpen(false);
      } else {
        toast.error(res.error || "حدث خطأ");
      }
    });
  };

  const handleDelete = (id: string, userName: string) => {
    confirmToast({
      title: "حذف سجل الاشتراك نهائياً",
      message: `هل أنت متأكد من حذف اشتراك "${userName}"؟ لن يتمكن الطالب من الدخول للكورس.`,
      confirmText: "نعم، احذف السجل",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteEnrollment(id);
          if (res.success) {
            toast.success(res.message || "تم حذف الاشتراك بنجاح");
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createManualEnrollment(formData);
      if (res.success) {
        toast.success(res.message || "تم تسجيل وتفعيل الطالب بنجاح");
        setIsManualModalOpen(false);
        form.reset();
      } else {
        toast.error(res.error || "حدث خطأ");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-border)] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>المالية والاشتراكات</span>
            </span>
            {stats.pending > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stats.pending} طلب بانتظار المراجعة
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-50">إدارة طلبات واشتراكات الطلاب</h1>
          <p className="mt-1 text-sm text-slate-400">
            مراجعة إيصالات التحويل (فودافون كاش، انستاباي، وبنوك)، وتفعيل أو تعطيل اشتراكات الطلاب لحظياً.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="btn-theme-primary flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold text-white shadow-lg w-fit cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>تفعيل اشتراك يدوي لطالب</span>
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Card */}
        <div className={`glass-panel p-5 rounded-3xl border transition-all ${
          stats.pending > 0 
            ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.15)]" 
            : "border-white/10"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400">بانتظار المراجعة والإيصال</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats.pending}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">طلب دفع يحتاج للتدقيق والتفعيل</span>
        </div>

        {/* Active Card */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400">اشتراكات مفعلة ونشطة</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats.active}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">طالب يستطيع مشاهدة الكورسات</span>
        </div>

        {/* Suspended Card */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-400">اشتراكات معطلة / مرفوضة</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{stats.suspended}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">حسابات منتهية أو ملغاة</span>
        </div>

        {/* Revenue Card */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--theme-primary)]">إجمالي الإيرادات المحصلة</span>
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-badge-bg)] flex items-center justify-center text-[var(--theme-primary)]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats.revenue.toLocaleString("en-US")} <span className="text-sm font-bold text-slate-400">ج.م</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">مجموع مدفوعات الاشتراكات المفعلة</span>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/5 w-full md:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "ALL"
                ? "bg-[var(--theme-badge-bg)] text-white border border-[var(--theme-border)] shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            الكل ({initialEnrollments.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              filterTab === "PENDING"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow"
                : "text-slate-400 hover:text-amber-400"
            }`}
          >
            <span>قيد المراجعة</span>
            {stats.pending > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("ACTIVE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "ACTIVE"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow"
                : "text-slate-400 hover:text-emerald-400"
            }`}
          >
            المفعلة ({stats.active})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("SUSPENDED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === "SUSPENDED"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow"
                : "text-slate-400 hover:text-rose-400"
            }`}
          >
            المعطلة والمرفوضة ({stats.suspended})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب، الهاتف، الكورس..."
            className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
          />
        </div>
      </div>

      {/* ── Enrollments Table ── */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                {[
                  "الطالب وبياناته",
                  "الكورس والمسار",
                  "المبلغ والوسيلة",
                  "إيصال التحويل",
                  "الحالة",
                  "تاريخ الطلب",
                  "الإجراءات",
                ].map((col) => (
                  <th key={col} className="px-5 py-4 font-bold text-slate-400 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    لا توجد طلبات اشتراك تطابق الفلتر الحالي.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((item) => {
                  const studentName = item.user.name || item.user.username || "طالب بدون اسم";
                  const isSecondary = item.course.stage === "SECONDARY" || !!item.course.secondaryGrade;
                  const isVIP = item.course.stage === "VIP";

                  const createdDate = new Date(item.createdAt).toLocaleDateString("ar-EG", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Student info */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-100 block text-sm">{studentName}</span>
                          <span className="text-[11px] text-slate-400 block font-mono">{item.user.email}</span>
                          {item.senderPhone && (
                            <span className="text-[11px] text-cyan-400 block font-mono" dir="ltr">
                              📱 {item.senderPhone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Course info */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span className="font-bold text-white block max-w-xs truncate" title={item.course.title}>
                            {item.course.title}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isVIP ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Crown className="w-3 h-3" /> VIP
                              </span>
                            ) : isSecondary ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <School className="w-3 h-3" /> ثانوي
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" /> جامعي
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">
                              {item.course.secondaryGrade?.name || item.course.university?.name || ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price & Method */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-black text-slate-100 block font-mono text-sm">
                            {item.pricePaid > 0 ? `${item.pricePaid} ج.م` : "مجاناً"}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-bold">
                            {item.paymentMethod === "VODAFONE_CASH"
                              ? "فودافون كاش"
                              : item.paymentMethod === "INSTAPAY"
                              ? "انستاباي"
                              : item.paymentMethod === "BANK_TRANSFER"
                              ? "تحويل بنكي"
                              : "تفعيل يدوي"}
                          </span>
                          {item.transactionRef && (
                            <span className="text-[10px] text-slate-500 block font-mono">
                              Ref: {item.transactionRef}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Receipt */}
                      <td className="px-5 py-4">
                        {item.receiptUrl ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(item.receiptUrl)}
                              className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-[var(--theme-primary)] transition-all group/img shrink-0 cursor-pointer"
                              title="اضغط لمعاينة صورة الإيصال مكبرة"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.receiptUrl}
                                alt="إيصال"
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(item.receiptUrl)}
                              className="text-[11px] text-[var(--theme-primary)] hover:underline font-bold"
                            >
                              معاينة الإيصال 👁️
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">لا يوجد إيصال</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {item.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مفعل ونشط</span>
                          </span>
                        ) : item.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>قيد المراجعة</span>
                          </span>
                        ) : item.status === "REJECTED" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>مرفوض</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs bg-slate-800/80 text-slate-400 border border-white/10">
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>معطل</span>
                          </span>
                        )}

                        {item.adminNote && (
                          <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate" title={item.adminNote}>
                            {item.adminNote}
                          </p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                        {createdDate}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {item.status !== "ACTIVE" && (
                            <button
                              type="button"
                              onClick={() => handleActivate(item.id, studentName, item.course.title)}
                              disabled={isPending}
                              title="تفعيل اشتراك الطالب فوراً"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تفعيل</span>
                            </button>
                          )}

                          {item.status === "ACTIVE" && (
                            <button
                              type="button"
                              onClick={() => handleSuspend(item.id, studentName, item.course.title)}
                              disabled={isPending}
                              title="تعطيل اشتراك الطالب"
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>تعطيل</span>
                            </button>
                          )}

                          {item.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => openRejectModal(item.id)}
                              disabled={isPending}
                              title="رفض طلب الاشتراك مع سبب"
                              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>رفض</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, studentName)}
                            disabled={isPending}
                            title="حذف السجل نهائياً"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Receipt Full Preview Modal ── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-[#0B0F19] border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--theme-primary)]" />
                <span>صورة إيصال التحويل البنكي / المحفظة</span>
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={selectedReceipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>فتح بحجم الشاشة</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-white/10 bg-black/60 p-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedReceipt}
                alt="إيصال التحويل"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Manual Enrollment Modal ── */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[#0B0F19] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-black text-white">تفعيل اشتراك يدوي لطالب</h3>
                <p className="text-xs text-slate-400 mt-0.5">منح الطالب وصولاً فورياً لكورس معين بدون إيصال</p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              {/* Student Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">اختر الطالب *</label>
                <select
                  name="userId"
                  required
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[var(--theme-primary)]"
                >
                  <option value="" disabled selected>
                    اختر الطالب من القائمة ({users.length} طالب مسجل)
                  </option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.username} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">اختر الكورس *</label>
                <select
                  name="courseId"
                  required
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[var(--theme-primary)]"
                >
                  <option value="" disabled selected>
                    اختر الكورس المراد تفعيله
                  </option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.priceLocal} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Paid */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">المبلغ المدفوع (ج.م)</label>
                <input
                  type="number"
                  name="pricePaid"
                  min="0"
                  defaultValue="0"
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              {/* Admin Note */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">ملاحظات الإدارة (اختياري)</label>
                <input
                  type="text"
                  name="adminNote"
                  defaultValue="تفعيل مباشر من لوحة التحكم"
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[var(--theme-primary)]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-theme-primary flex-1 py-3 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>تفعيل الاشتراك فوراً</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reject Reason Modal ── */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#0B0F19] border border-white/15 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-black text-white mb-2">تأكيد رفض طلب الاشتراك</h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنك كتابة سبب الرفض ليظهر في السجل، مع إمكانية قيام الطالب بإعادة إرسال إيصال جديد:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
              placeholder="سبب الرفض..."
            />

            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow flex items-center justify-center gap-1.5"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                <span>تأكيد الرفض</span>
              </button>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

