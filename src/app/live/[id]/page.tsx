import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import LiveRoomClient from "./LiveRoomClient";

interface LiveRoomPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function LiveRoomPage({ params }: LiveRoomPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/live/${id}`);
  }

  const userId = (session.user as any).id;

  const [dbUser, liveSession] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    }),
    prisma.liveSession.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true },
        },
        tickets: {
          where: { userId },
        },
      },
    }),
  ]);

  if (!liveSession) {
    notFound();
  }

  if (!dbUser || !dbUser.isActive) {
    redirect("/login");
  }

  const isHost = ["ADMIN", "SUPERADMIN"].includes(dbUser.role);

  // If not host, check student ticket / course enrollment eligibility
  if (!isHost) {
    let hasAccess = false;

    // Check if session is free
    if (liveSession.price === 0) {
      hasAccess = true;
    }

    // Check active ticket
    const userTicket = liveSession.tickets[0];
    if (userTicket && userTicket.status === "ACTIVE") {
      hasAccess = true;
    }

    // Check course enrollment
    if (liveSession.courseId && liveSession.isFreeForCourseEnrolled) {
      const courseEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: liveSession.courseId,
          },
        },
      });
      if (courseEnrollment && courseEnrollment.status === "ACTIVE") {
        hasAccess = true;
      }
    }

    // Deny access if not eligible
    if (!hasAccess) {
      redirect(`/checkout/live/${id}`);
    }
  }

  return (
    <LiveRoomClient
      session={liveSession}
      user={{
        id: dbUser.id,
        name: dbUser.name || "طالب أوركا",
        email: dbUser.email || undefined,
        role: dbUser.role,
      }}
      isHost={isHost}
    />
  );
}
