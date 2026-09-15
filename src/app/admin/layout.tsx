import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LayoutDashboard, BookOpen, Layers, Users, GraduationCap, Globe, Building2, Crown, ShieldCheck, Palette, School, Microscope, MessageSquare, CreditCard, Radio, FileQuestion } from "lucide-react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const userId = (session?.user as any)?.id || (session?.user as any)?.sub;
  const userEmail = session?.user?.email;

  if (!session?.user || (!userId && !userEmail)) {
    redirect("/maestro");
  }

  // Ensure user is still active and is admin in database
  const [dbUser, pendingSubscriptionsCount, liveActiveCount] = await Promise.all([
    prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
      select: { id: true, name: true, username: true, role: true, isActive: true },
    }),
    prisma.enrollment.count({
      where: { status: "PENDING" },
    }),
    prisma.liveSession.count({
      where: { status: "LIVE" },
    }),
  ]);

  if (!dbUser || !dbUser.isActive || !["ADMIN", "SUPERADMIN"].includes(dbUser.role)) {
    redirect("/maestro");
  }

  const isSuperAdmin = dbUser.role === "SUPERADMIN";

  const sidebarLinks = [
    { href: "/admin",              label: "الرئيسية",             icon: LayoutDashboard },
    { href: "/admin/courses",      label: "إدارة الكورسات",        icon: BookOpen },
    { href: "/admin/quizzes",      label: "الاختبارات والواجبات",  icon: FileQuestion },
    { href: "/admin/live",         label: "الحصص المباشرة (Live 🔴)", icon: Radio, badge: liveActiveCount },
    { href: "/admin/subscriptions",label: "الاشتراكات والمدفوعات", icon: CreditCard, badge: pendingSubscriptionsCount },
    { href: "/admin/secondary",    label: "المرحلة الثانوية",      icon: School },
    { href: "/admin/universities", label: "الجامعات",             icon: Building2 },
    { href: "/admin/departments",  label: "الأقسام الأكاديمية",    icon: Layers },
    { href: "/admin/countries",    label: "الدول والمناهج",       icon: Globe },
    { href: "/admin/research",     label: "الأبحاث العلمية",      icon: Microscope },
    { href: "/admin/reviews",      label: "آراء الطلاب",           icon: MessageSquare },
    { href: "/admin/users",        label: "إدارة المستخدمين",     icon: Users },
    { href: "/admin/themes",       label: "مكتبة الثيمات",        icon: Palette },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">

      {/* ── Sidebar (Right for RTL) ── */}
      <aside className="flex w-64 shrink-0 flex-col border-l border-white/10 bg-slate-900">

        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <GraduationCap className="h-6 w-6 text-cyan-400" />
          <span className="text-lg font-black tracking-wide text-slate-50">
            أوركا <span className="text-gradient">ليرن</span>
          </span>
        </div>

        {/* Current Admin Badge */}
        <div className="border-b border-white/10 p-4">
          <div className={`rounded-2xl p-3 border ${
            isSuperAdmin 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300" 
              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
          }`}>
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

        {/* Nav label */}
        <p className="px-6 pt-5 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          لوحة التحكم
        </p>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {sidebarLinks.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-[var(--theme-primary)]" />
                <span>{label}</span>
              </div>
              {!!badge && badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-4">
          <AdminLogoutButton />
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:text-slate-400"
          >
            ← العودة للموقع الرئيسي
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
