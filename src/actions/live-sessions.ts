"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// التحقق من صلاحيات المشرف
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

// 1. إنشاء وجدولة حصة لايف جديدة
export async function createLiveSession(formData: FormData) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const scheduledDate = formData.get("scheduledDate") as string;
  const scheduledTime = formData.get("scheduledTime") as string;
  const duration = parseInt(formData.get("duration") as string, 10) || 60;
  const stage = (formData.get("stage") as string) || "ALL";
  const courseId = (formData.get("courseId") as string) || null;
  const price = parseFloat(formData.get("price") as string) || 0;
  const isFreeForCourseEnrolled = formData.get("isFreeForCourseEnrolled") === "true";
  const sessionType = (formData.get("sessionType") as string) || "WEBRTC";
  const streamUrl = (formData.get("streamUrl") as string)?.trim() || null;
  const maxParticipants = parseInt(formData.get("maxParticipants") as string, 10) || 100;

  if (!title) {
    return { success: false, error: "يرجى كتابة عنوان الحصة المباشرة" };
  }

  if (!scheduledDate || !scheduledTime) {
    return { success: false, error: "يرجى تحديد تاريخ وتوقيت الحصة" };
  }

  const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
  if (isNaN(scheduledAt.getTime())) {
    return { success: false, error: "تاريخ أو توقيت غير صالح" };
  }

  // توليد اسم غرفة فريد وآمن للـ WebRTC
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const roomName = `orca-live-${Date.now().toString(36)}-${randomSuffix}`;

  try {
    const session = await prisma.liveSession.create({
      data: {
        title,
        description,
        scheduledAt,
        duration,
        stage,
        courseId: courseId && courseId !== "none" ? courseId : null,
        price,
        isFreeForCourseEnrolled,
        sessionType,
        roomName: sessionType === "WEBRTC" ? roomName : null,
        streamUrl,
        maxParticipants,
        status: "SCHEDULED",
      },
    });

    revalidatePath("/admin/live");
    revalidatePath("/dashboard/live");
    revalidatePath("/dashboard");

    return { success: true, message: "تمت جدولة الحصة المباشرة بنجاح", sessionId: session.id };
  } catch (error: any) {
    console.error("Error creating live session:", error);
    return { success: false, error: error.message || "فشل إنشاء الحصة المباشرة" };
  }
}

// 2. تحديث حالة الحصة المباشرة (بدء البث، إنهاء، إلغاء)
export async function updateLiveSessionStatus(
  id: string,
  status: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED",
  recordingUrl?: string
) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    const updateData: any = { status };
    if (recordingUrl !== undefined) {
      updateData.recordingUrl = recordingUrl.trim() || null;
    }

    await prisma.liveSession.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/live");
    revalidatePath(`/admin/live/${id}`);
    revalidatePath("/dashboard/live");
    revalidatePath(`/live/${id}`);

    const statusTexts: Record<string, string> = {
      LIVE: "تم بدء البث المباشر بنجاح 🔴",
      ENDED: "تم إنهاء الحصة المباشرة بنجاح ✓",
      CANCELLED: "تم إلغاء الحصة المباشرة",
      SCHEDULED: "تمت إعادة تعيين الحصة كمجدولة",
    };

    return { success: true, message: statusTexts[status] || "تم تحديث حالة الحصة" };
  } catch (error: any) {
    return { success: false, error: error.message || "حدث خطأ أثناء تحديث حالة الحصة" };
  }
}

// 3. حذف الحصة المباشرة
export async function deleteLiveSession(id: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    await prisma.liveSession.delete({
      where: { id },
    });

    revalidatePath("/admin/live");
    revalidatePath("/dashboard/live");

    return { success: true, message: "تم حذف الحصة المباشرة بنجاح" };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل حذف الحصة المباشرة" };
  }
}

// 4. تقديم طلب حجز تذكرة حضور لحصة مباشرة (Student)
export async function submitLiveTicketRequest(data: {
  sessionId: string;
  pricePaid: number;
  paymentMethod: string;
  senderPhone?: string;
  transactionRef?: string;
  receiptUrl?: string;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return { success: false, error: "يجب تسجيل الدخول أولاً لحجز تذكرة الحضور" };
  }

  if (!data.sessionId) {
    return { success: false, error: "معرف الحصة المباشرة غير صالح" };
  }

  try {
    const liveSession = await prisma.liveSession.findUnique({
      where: { id: data.sessionId },
      include: {
        tickets: {
          where: { userId },
        },
      },
    });

    if (!liveSession) {
      return { success: false, error: "الحصة المباشرة غير موجودة" };
    }

    const existing = liveSession.tickets[0];
    if (existing && existing.status === "ACTIVE") {
      return { success: false, error: "لديك تذكرة حضور مفعلة بالفعل لهذه الحصة!" };
    }

    // إذا كانت الحصة مجانية
    const isFree = data.pricePaid === 0 || liveSession.price === 0;
    const initialStatus = isFree ? "ACTIVE" : "PENDING";

    const ticket = await prisma.liveTicket.upsert({
      where: {
        sessionId_userId: {
          sessionId: data.sessionId,
          userId,
        },
      },
      update: {
        pricePaid: data.pricePaid,
        paymentMethod: data.paymentMethod || "MANUAL",
        senderPhone: data.senderPhone || null,
        transactionRef: data.transactionRef || null,
        receiptUrl: data.receiptUrl || null,
        status: initialStatus,
        adminNote: null,
        activatedAt: isFree ? new Date() : null,
      },
      create: {
        sessionId: data.sessionId,
        userId,
        pricePaid: data.pricePaid,
        paymentMethod: data.paymentMethod || "MANUAL",
        senderPhone: data.senderPhone || null,
        transactionRef: data.transactionRef || null,
        receiptUrl: data.receiptUrl || null,
        status: initialStatus,
        activatedAt: isFree ? new Date() : null,
      },
    });

    revalidatePath("/dashboard/live");
    revalidatePath(`/live/${data.sessionId}`);
    revalidatePath("/admin/live");

    return {
      success: true,
      status: initialStatus,
      ticketId: ticket.id,
      message: isFree
        ? "تم تأكيد تسجيلك في الحصة بنجاح! نراك على الموعد."
        : "تم إرسال إيصال الدفع بنجاح! سيتم فحص التحويل وتفعيل تذكرتك فوراً.",
    };
  } catch (error: any) {
    console.error("Error submitting ticket request:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء حجز التذكرة" };
  }
}

// 5. تفعيل تذكرة حضور طالب (Admin)
export async function activateLiveTicket(ticketId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    await prisma.liveTicket.update({
      where: { id: ticketId },
      data: {
        status: "ACTIVE",
        activatedAt: new Date(),
        adminNote: null,
      },
    });

    revalidatePath("/admin/live");
    revalidatePath("/dashboard/live");

    return { success: true, message: "تم تفعيل تذكرة الطالب بنجاح! يمكنه الآن دخول البث." };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل تفعيل التذكرة" };
  }
}

// 6. رفض تذكرة حضور طالب (Admin)
export async function rejectLiveTicket(ticketId: string, reason: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    await prisma.liveTicket.update({
      where: { id: ticketId },
      data: {
        status: "REJECTED",
        adminNote: reason.trim() || "بيانات التحويل غير صحيحة",
      },
    });

    revalidatePath("/admin/live");
    revalidatePath("/dashboard/live");

    return { success: true, message: "تم رفض التذكرة وتدوين السبب بنجاح" };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل رفض التذكرة" };
  }
}

// 7. حذف تذكرة حضور طالب (Admin)
export async function deleteLiveTicket(ticketId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    await prisma.liveTicket.delete({
      where: { id: ticketId },
    });

    revalidatePath("/admin/live");
    revalidatePath("/dashboard/live");

    return { success: true, message: "تم حذف التذكرة بنجاح" };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل حذف التذكرة" };
  }
}

// 8. منح تذكرة حضور يدوياً لطالب من الداشبورد (Admin)
export async function issueManualLiveTicket(sessionId: string, userId: string) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
  }

  try {
    await prisma.liveTicket.upsert({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      update: {
        status: "ACTIVE",
        paymentMethod: "MANUAL",
        pricePaid: 0,
        activatedAt: new Date(),
        adminNote: `تم المنح يدوياً بواسطة الإدارة (${admin.name})`,
      },
      create: {
        sessionId,
        userId,
        status: "ACTIVE",
        paymentMethod: "MANUAL",
        pricePaid: 0,
        activatedAt: new Date(),
        adminNote: `تم المنح يدوياً بواسطة الإدارة (${admin.name})`,
      },
    });

    revalidatePath("/admin/live");
    revalidatePath("/dashboard/live");

    return { success: true, message: "تم منح التذكرة وتفعيل وصول الطالب بنجاح" };
  } catch (error: any) {
    return { success: false, error: error.message || "فشل منح التذكرة" };
  }
}
