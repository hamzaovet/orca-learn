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

// 1. إصدار شهادة إتمام جديدة لطالب
export async function issueCertificate(data: {
  userId: string;
  courseId: string;
  grade?: string;
  score?: number;
}) {
  const admin = await checkAdmin();
  if (!admin) {
    return { success: false, error: "غير مصرح لك بإصدار الشهادات" };
  }

  try {
    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.userId } }),
      prisma.course.findUnique({ where: { id: data.courseId } }),
    ]);

    if (!user || !course) {
      return { success: false, error: "بيانات الطالب أو الكورس غير صحيحة" };
    }

    // توليد كود فريد للشهادة
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certificateCode = `ORCA-${year}-${randomHex}`;

    // التحقق من عدم وجود شهادة سابقة لنفس الطالب في نفس الكورس
    const existing = await prisma.certificate.findFirst({
      where: {
        userId: data.userId,
        courseId: data.courseId,
        isRevoked: false,
      },
    });

    if (existing) {
      return {
        success: true,
        message: "هذا الطالب لديه شهادة صادرة بالفعل لهذا الكورس",
        certificateCode: existing.certificateCode,
      };
    }

    const cert = await prisma.certificate.create({
      data: {
        certificateCode,
        userId: data.userId,
        courseId: data.courseId,
        studentName: user.name || "طالب أوركا",
        courseTitle: course.title,
        grade: data.grade || "امتياز مع مرتبة الشرف",
        score: data.score || 100,
        issueDate: new Date(),
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/verify");

    return {
      success: true,
      message: `تم إصدار الشهادة الرسمية بنجاح بكود: ${certificateCode}`,
      certificateCode: cert.certificateCode,
    };
  } catch (error: any) {
    console.error("Error issuing certificate:", error);
    return { success: false, error: error.message || "فشل إصدار الشهادة" };
  }
}

// 2. التحقق من صحة كود الشهادة (استعلام عام)
export async function verifyCertificate(certificateCode: string) {
  if (!certificateCode?.trim()) {
    return { success: false, error: "يرجى إدخال كود الشهادة للتحقق" };
  }

  try {
    const cert = await prisma.certificate.findUnique({
      where: {
        certificateCode: certificateCode.trim().toUpperCase(),
      },
      include: {
        user: { select: { id: true, name: true } },
        course: { select: { id: true, title: true, stage: true } },
      },
    });

    if (!cert) {
      return {
        success: false,
        error: "لم يتم العثور على شهادة بهذا الكود. يرجى التأكد من كتابة الكود بشكل صحيح.",
      };
    }

    if (cert.isRevoked) {
      return {
        success: false,
        isRevoked: true,
        error: "هذه الشهادة تم إلغاؤها أو سحبها من قبل إدارة الأكاديمية.",
      };
    }

    return {
      success: true,
      certificate: {
        code: cert.certificateCode,
        studentName: cert.studentName,
        courseTitle: cert.courseTitle,
        grade: cert.grade,
        score: cert.score,
        issueDate: cert.issueDate,
        supervisor: "أ.د. صالحة جابر الدسوقي",
        organization: "منصة Orca Learn الأكاديمية",
        status: "معتمدة وموثقة رسمياً ✓",
      },
    };
  } catch (error: any) {
    return { success: false, error: "حدث خطأ أثناء فحص الشهادة" };
  }
}
