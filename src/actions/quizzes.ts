"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// التحقق من صلاحيات الأدمن
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, role: true, name: true, isActive: true },
  });
  if (!user || !user.isActive || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
    return null;
  }
  return user;
}

// 1. إنشاء اختبار جديد مع الأسئلة والخيارات
export async function createQuiz(data: {
  title: string;
  description?: string;
  courseId: string;
  lessonId?: string;
  passingScore?: number;
  durationMinutes?: number;
  questions: Array<{
    questionText: string;
    imageUrl?: string;
    explanation?: string;
    points?: number;
    options: Array<{
      optionText: string;
      isCorrect: boolean;
    }>;
  }>;
}) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  if (!data.title?.trim() || !data.courseId) {
    return { success: false, error: "يرجى كتابة عنوان الاختبار واختيار الكورس" };
  }

  if (!data.questions || data.questions.length === 0) {
    return { success: false, error: "يجب إضافة سؤال واحد على الأقل في الاختبار" };
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        courseId: data.courseId,
        lessonId: data.lessonId && data.lessonId !== "none" ? data.lessonId : null,
        passingScore: data.passingScore || 60,
        durationMinutes: data.durationMinutes || 20,
        questions: {
          create: data.questions.map((q, qIndex) => ({
            questionText: q.questionText.trim(),
            imageUrl: q.imageUrl?.trim() || null,
            explanation: q.explanation?.trim() || null,
            points: q.points || 1,
            order: qIndex,
            options: {
              create: q.options.map((opt, optIndex) => ({
                optionText: opt.optionText.trim(),
                isCorrect: opt.isCorrect,
                order: optIndex,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/admin/quizzes");
    revalidatePath(`/dashboard/courses/${data.courseId}`);

    return { success: true, message: "تم إنشاء الاختبار بنجاح", quizId: quiz.id };
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    return { success: false, error: error.message || "فشل إنشاء الاختبار" };
  }
}

// 2. حذف اختبار
export async function deleteQuiz(quizId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    });

    revalidatePath("/admin/quizzes");
    return { success: true, message: "تم حذف الاختبار وسجلاته بنجاح" };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل حذف الاختبار" };
  }
}

// 3. تصحيح إجابات الطالب وتسجيل النتيجة آلياً
export async function submitQuizAnswers(
  quizId: string,
  userAnswers: Record<string, string> // { questionId: selectedOptionId }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return { success: false, error: "يجب تسجيل الدخول لتسليم الاختبار" };
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: { select: { id: true, title: true } },
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: "الاختبار غير موجود" };
    }

    let totalPoints = 0;
    let earnedPoints = 0;

    const questionsReview = quiz.questions.map((q) => {
      const qPoints = q.points || 1;
      totalPoints += qPoints;

      const selectedOptionId = userAnswers[q.id];
      const correctOption = q.options.find((opt) => opt.isCorrect);
      const isUserCorrect = selectedOptionId && correctOption && selectedOptionId === correctOption.id;

      if (isUserCorrect) {
        earnedPoints += qPoints;
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        imageUrl: q.imageUrl,
        explanation: q.explanation,
        selectedOptionId,
        correctOptionId: correctOption?.id,
        isCorrect: !!isUserCorrect,
        options: q.options.map((opt) => ({
          id: opt.id,
          text: opt.optionText,
          isCorrect: opt.isCorrect,
        })),
      };
    });

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = finalScore >= quiz.passingScore;

    // تسجيل نتيجة الطالب في قاعدة البيانات
    const submission = await prisma.quizSubmission.create({
      data: {
        quizId,
        userId,
        score: finalScore,
        passed,
        answers: userAnswers,
      },
    });

    // لو نجح الطالب وكان هذا اختبار الدورة، يمكنه إصدار شهادة
    revalidatePath(`/dashboard/courses/${quiz.courseId}`);
    revalidatePath(`/admin/quizzes`);

    return {
      success: true,
      submissionId: submission.id,
      score: finalScore,
      earnedPoints,
      totalPoints,
      passed,
      passingScore: quiz.passingScore,
      questionsReview,
      message: passed
        ? `تهانينا! لقد اجتزت الاختبار بنجاح بنسبة ${finalScore}% 🎉`
        : `حصلت على ${finalScore}% (درجة النجاح المطلوبة ${quiz.passingScore}%). يمكنك مراجعة الإجابات أدناه وإعادة المحاولة.`,
    };
  } catch (error: any) {
    console.error("Error evaluating quiz:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء تصحيح الاختبار" };
  }
}
