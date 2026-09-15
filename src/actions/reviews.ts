"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createStudentReview(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  const name = formData.get("name") as string;
  const stage = (formData.get("stage") as string) || "secondary";
  const stageLabel = formData.get("stageLabel") as string;
  const affiliation = formData.get("affiliation") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const subject = formData.get("subject") as string;
  const review = formData.get("review") as string;
  const date = formData.get("date") as string;

  if (!name || !review || !subject) {
    return { error: "اسم الطالب، المادة، ونص التقييم حقول مطلوبة." };
  }

  try {
    await prisma.studentReview.create({
      data: {
        name,
        stage,
        stageLabel: stageLabel || (stage === "secondary" ? "المرحلة الثانوية" : "المرحلة الجامعية"),
        affiliation: affiliation || "طالب متميز",
        rating,
        subject,
        review,
        date: date || "حديثاً",
        isApproved: true,
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل إضافة رأي الطالب." };
  }
}

export async function toggleReviewApproval(id: string, isApproved: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  try {
    await prisma.studentReview.update({
      where: { id },
      data: { isApproved },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل تحديث حالة التقييم." };
  }
}

export async function deleteStudentReview(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  try {
    await prisma.studentReview.delete({
      where: { id },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف تقييم الطالب." };
  }
}
