"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitEnrollmentRequest(data: {
  courseId: string;
  pricePaid: number;
  paymentMethod: string;
  senderPhone?: string;
  transactionRef?: string;
  receiptUrl?: string;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return { success: false, error: "يجب تسجيل الدخول أولاً لإرسال طلب الاشتراك" };
  }

  if (!data.courseId) {
    return { success: false, error: "كود الكورس غير صالح" };
  }

  try {
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: data.courseId,
        },
      },
    });

    if (existing && existing.status === "ACTIVE") {
      return { success: false, error: "أنت مشترك بالفعل في هذا الكورس وحسابك مفعل!" };
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: data.courseId,
        },
      },
      update: {
        pricePaid: data.pricePaid,
        paymentMethod: data.paymentMethod || "MANUAL",
        senderPhone: data.senderPhone || null,
        transactionRef: data.transactionRef || null,
        receiptUrl: data.receiptUrl || null,
        status: "PENDING",
        adminNote: null,
      },
      create: {
        userId,
        courseId: data.courseId,
        pricePaid: data.pricePaid,
        paymentMethod: data.paymentMethod || "MANUAL",
        senderPhone: data.senderPhone || null,
        transactionRef: data.transactionRef || null,
        receiptUrl: data.receiptUrl || null,
        status: "PENDING",
      },
    });

    revalidatePath(`/checkout/${data.courseId}`);
    revalidatePath(`/courses/${data.courseId}`);
    revalidatePath("/dashboard");
    revalidatePath("/admin/subscriptions");

    return { success: true, enrollmentId: enrollment.id };
  } catch (error: any) {
    console.error("Error submitting enrollment:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء إرسال طلب الاشتراك" };
  }
}

export async function activateEnrollment(enrollmentId: string) {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "ACTIVE",
        activatedAt: new Date(),
      },
      include: { user: true, course: true },
    });

    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/courses/${enrollment.courseId}`);
    revalidatePath(`/courses/${enrollment.courseId}`);

    return { 
      success: true, 
      message: `تم تفعيل اشتراك الطالب (${enrollment.user.name || enrollment.user.email}) بنجاح!` 
    };
  } catch (error: any) {
    console.error("Error activating enrollment:", error);
    return { success: false, error: "حدث خطأ أثناء تفعيل الاشتراك" };
  }
}

export async function suspendEnrollment(enrollmentId: string) {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "SUSPENDED",
      },
      include: { user: true },
    });

    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/courses/${enrollment.courseId}`);

    return { 
      success: true, 
      message: `تم تعطيل اشتراك الطالب (${enrollment.user.name || enrollment.user.email}) بنجاح.` 
    };
  } catch (error: any) {
    console.error("Error suspending enrollment:", error);
    return { success: false, error: "حدث خطأ أثناء تعطيل الاشتراك" };
  }
}

export async function rejectEnrollment(enrollmentId: string, adminNote?: string) {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "REJECTED",
        adminNote: adminNote || "تم رفض الطلب لعدم صحة بيانات التحويل أو الإيصال",
      },
      include: { user: true },
    });

    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");

    return { 
      success: true, 
      message: `تم رفض طلب اشتراك الطالب (${enrollment.user.name || enrollment.user.email}).` 
    };
  } catch (error: any) {
    console.error("Error rejecting enrollment:", error);
    return { success: false, error: "حدث خطأ أثناء رفض الطلب" };
  }
}

export async function createManualEnrollment(formData: FormData) {
  const userId = formData.get("userId") as string;
  const courseId = formData.get("courseId") as string;
  const pricePaid = parseFloat((formData.get("pricePaid") as string) || "0");
  const adminNote = (formData.get("adminNote") as string) || "تفعيل يدوي مباشر من لوحة التحكم";

  if (!userId || !courseId) {
    return { success: false, error: "الرجاء اختيار الطالب والكورس" };
  }

  try {
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        status: "ACTIVE",
        paymentMethod: "MANUAL",
        pricePaid,
        adminNote,
        activatedAt: new Date(),
      },
      create: {
        userId,
        courseId,
        pricePaid,
        status: "ACTIVE",
        paymentMethod: "MANUAL",
        adminNote,
        activatedAt: new Date(),
      },
      include: { user: true, course: true },
    });

    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/courses/${courseId}`);

    return { 
      success: true, 
      message: `تم تفعيل اشتراك الطالب (${enrollment.user.name || enrollment.user.email}) في كورس (${enrollment.course.title}) يدوياً!` 
    };
  } catch (error: any) {
    console.error("Error creating manual enrollment:", error);
    return { success: false, error: "حدث خطأ أثناء تفعيل الاشتراك اليدوي" };
  }
}

export async function deleteEnrollment(enrollmentId: string) {
  try {
    await prisma.enrollment.delete({
      where: { id: enrollmentId },
    });

    revalidatePath("/admin/subscriptions");
    revalidatePath("/dashboard");
    return { success: true, message: "تم حذف سجل الاشتراك بنجاح." };
  } catch (error: any) {
    console.error("Error deleting enrollment:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الاشتراك" };
  }
}
