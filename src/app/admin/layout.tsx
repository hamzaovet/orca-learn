import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

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

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col lg:flex-row">
      <AdminSidebar
        dbUser={dbUser}
        pendingSubscriptionsCount={pendingSubscriptionsCount}
        liveActiveCount={liveActiveCount}
      />

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
