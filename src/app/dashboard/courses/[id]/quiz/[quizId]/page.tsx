import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import QuizTakeClient from "./QuizTakeClient";

interface QuizPageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export const dynamic = "force-dynamic";

export default async function StudentQuizPage({ params }: QuizPageProps) {
  const { id: courseId, quizId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/courses/${courseId}/quiz/${quizId}`);
  }

  const userId = (session.user as any).id;

  // Verify Active Enrollment in course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    redirect(`/courses/${courseId}`);
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: {
            select: { id: true, optionText: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!quiz || quiz.courseId !== courseId) {
    notFound();
  }

  return (
    <QuizTakeClient
      quiz={quiz}
      courseId={courseId}
      studentName={session.user.name || "طالب أوركا"}
    />
  );
}
