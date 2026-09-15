import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersTable from "@/components/admin/UsersTable";
import { Users, UserCheck, UserX, Crown } from "lucide-react";

export const metadata = {
  title: "إدارة المستخدمين والصلاحيات | لوحة التحكم",
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || (session?.user as any)?.sub;
  const userEmail = session?.user?.email;

  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        ...(userId ? [{ id: userId }] : []),
        ...(userEmail ? [{ email: userEmail }] : []),
      ],
    },
    select: { id: true, role: true, isActive: true },
  });

  if (!dbUser || !dbUser.isActive || !["ADMIN", "SUPERADMIN"].includes(dbUser.role)) {
    redirect("/maestro");
  }

  const isSuperAdmin = dbUser.role === "SUPERADMIN";

  // Strict isolation: if regular ADMIN, never fetch SUPERADMIN from DB
  const whereClause = isSuperAdmin ? {} : { role: { not: "SUPERADMIN" as const } };

  const [users, totalCount, activeCount, inactiveCount] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),
    prisma.user.count({ where: { ...whereClause, isActive: true } }),
    prisma.user.count({ where: { ...whereClause, isActive: false } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-50 flex items-center gap-3">
            <span>إدارة المستخدمين والحسابات</span>
            {isSuperAdmin && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-400">
                <Crown className="h-3.5 w-3.5" />
                تحكم مطلق (المايسترو)
              </span>
            )}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSuperAdmin
              ? "التحكم الكامل بجميع الحسابات، الصلاحيات، كلمات المرور، وتفعيل/تعطيل الحسابات."
              : "إدارة حسابات الطلاب وتعديل كلمات المرور وحالات التفعيل."}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="glass-panel flex items-center gap-4 rounded-2xl p-5 border border-white/10 bg-[#0F172A]/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-50">{totalCount}</p>
            <p className="text-xs font-medium text-slate-400">إجمالي الحسابات</p>
          </div>
        </div>

        <div className="glass-panel flex items-center gap-4 rounded-2xl p-5 border border-white/10 bg-[#0F172A]/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-50">{activeCount}</p>
            <p className="text-xs font-medium text-slate-400">حسابات نشطة</p>
          </div>
        </div>

        <div className="glass-panel flex items-center gap-4 rounded-2xl p-5 border border-white/10 bg-[#0F172A]/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <UserX className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-50">{inactiveCount}</p>
            <p className="text-xs font-medium text-slate-400">حسابات معطلة</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        initialUsers={users}
        currentUserRole={dbUser.role as "ADMIN" | "SUPERADMIN"}
        currentUserId={dbUser.id}
      />
    </div>
  );
}
