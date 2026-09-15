import { prisma } from "@/lib/prisma";
import SubscriptionsClient from "./SubscriptionsClient";

export const metadata = {
  title: "إدارة طلبات واشتراكات الطلاب | لوحة التحكم",
};

export default async function SubscriptionsPage() {
  const [enrollments, users, courses] = await Promise.all([
    prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
        course: {
          include: {
            secondaryGrade: true,
            university: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        priceLocal: true,
        stage: true,
      },
      orderBy: { title: "asc" },
    }),
  ]);

  const stats = {
    total: enrollments.length,
    active: enrollments.filter((e) => e.status === "ACTIVE").length,
    pending: enrollments.filter((e) => e.status === "PENDING").length,
    suspended: enrollments.filter((e) => e.status === "SUSPENDED" || e.status === "REJECTED").length,
    revenue: enrollments
      .filter((e) => e.status === "ACTIVE")
      .reduce((sum, e) => sum + e.pricePaid, 0),
  };

  return (
    <SubscriptionsClient
      initialEnrollments={enrollments}
      users={users}
      courses={courses}
      stats={stats}
    />
  );
}
