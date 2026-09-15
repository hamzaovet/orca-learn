import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LiveSessionsClient from "./LiveSessionsClient";

export const dynamic = "force-dynamic";

export default async function AdminLiveSessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/maestro");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { role: true, isActive: true },
  });

  if (!dbUser || !dbUser.isActive || !["ADMIN", "SUPERADMIN"].includes(dbUser.role)) {
    redirect("/maestro");
  }

  // Fetch live sessions with courses and tickets
  const [sessions, courses, users] = await Promise.all([
    prisma.liveSession.findMany({
      include: {
        course: {
          select: { id: true, title: true },
        },
        tickets: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "USER", isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return <LiveSessionsClient sessions={sessions} courses={courses} users={users} />;
}
