"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  GraduationCap,
  Globe,
  Building2,
  Crown,
  ShieldCheck,
  Palette,
  School,
  Microscope,
  MessageSquare,
  CreditCard,
  Radio,
  FileQuestion,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

interface AdminSidebarProps {
  dbUser: {
    id: string;
    name: string | null;
    username: string | null;
    role: string;
  };
  pendingSubscriptionsCount: number;
  liveActiveCount: number;
}

export default function AdminSidebar({
  dbUser,
  pendingSubscriptionsCount,
  liveActiveCount,
}: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isSuperAdmin = dbUser.role === "SUPERADMIN";

  const sidebarLinks = [
    { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/admin/courses", label: "إدارة الكورسات", icon: BookOpen },
    { href: "/admin/quizzes", label: "الاختبارات والواجبات", icon: FileQuestion },
    { href: "/admin/live", label: "الحصص المباشرة (Live 🔴)", icon: Radio, badge: liveActiveCount },
    { href: "/admin/subscriptions", label: "الاشتراكات والمدفوعات", icon: CreditCard, badge: pendingSubscriptionsCount },
    { href: "/admin/secondary", label: "المرحلة الثانوية", icon: School },
    { href: "/admin/universities", label: "الجامعات", icon: Building2 },
    { href: "/admin/departments", label: "الأقسام الأكاديمية", icon: Layers },
    { href: "/admin/countries", label: "الدول والمناهج", icon: Globe },
    { href: "/admin/research", label: "الأبحاث العلمية", icon: Microscope },
    { href: "/admin/reviews", label: "آراء الطلاب", icon: MessageSquare },
    { href: "/admin/users", label: "إدارة المستخدمين", icon: Users },
    { href: "/admin/themes", label: "مكتبة الثيمات", icon: Palette },
  ];

  const totalNotifications = (pendingSubscriptionsCount || 0) + (liveActiveCount || 0);

  const renderNavContent = () => (
    <>
      <div className="border-b border-white/10 p-4">
        <div
          className={`rounded-2xl p-3 border ${
            isSuperAdmin
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {isSuperAdmin ? (
              <Crown className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-slate-100">
                {dbUser.name || dbUser.username}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isSuperAdmin ? "سوبر أدمن (المايسترو)" : "مدير النظام (أدمن)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          لوحة التحكم
        </span>
        {totalNotifications > 0 && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {totalNotifications} تنبيه
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 overflow-y-auto">
        {sidebarLinks.map(({ href, label, icon: Icon, badge }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-l from-white/15 to-white/5 text-white shadow-sm border-r-4 border-[var(--theme-primary)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-[var(--theme-primary)]"
                      : "text-slate-500 group-hover:text-[var(--theme-primary)]"
                  }`}
                />
                <span className="truncate">{label}</span>
              </div>
              {!!badge && badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-4 bg-slate-950/40">
        <AdminLogoutButton />
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <span>← العودة للموقع الرئيسي</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
        </Link>
      </div>
    </>
  );

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="فتح قائمة الإدارة"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-900 animate-pulse" />
            )}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-cyan-400" />
            <span className="text-base font-black tracking-wide text-white">
              أوركا <span className="text-gradient">ليرن</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-left">
            <p className="text-xs font-bold text-slate-200 max-w-[120px] truncate">
              {dbUser.name || dbUser.username}
            </p>
            <p className="text-[9px] font-semibold text-cyan-400">
              {isSuperAdmin ? "سوبر أدمن" : "مدير النظام"}
            </p>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside className="relative mr-auto z-50 flex flex-col w-72 max-w-[85vw] h-full bg-slate-900 border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
                <span className="text-base font-black text-slate-50">
                  أوركا <span className="text-gradient">ليرن</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق القائمة"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {renderNavContent()}
          </aside>
        </div>
      )}

      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-white/10 bg-slate-900 min-h-screen sticky top-0 h-screen">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <GraduationCap className="h-6 w-6 text-cyan-400" />
          <span className="text-lg font-black tracking-wide text-slate-50">
            أوركا <span className="text-gradient">ليرن</span>
          </span>
        </div>

        {renderNavContent()}
      </aside>
    </>
  );
}
