import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuizzesClient from "./QuizzesClient";

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
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

  const [quizzes, courses] = await Promise.all([
    prisma.quiz.findMany({
      include: {
        course: { select: { id: true, title: true } },
        questions: {
          select: { id: true },
        },
        submissions: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { submittedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return <QuizzesClient quizzes={quizzes} courses={courses} />;
}
