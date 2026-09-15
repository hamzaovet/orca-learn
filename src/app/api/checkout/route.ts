import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { courseId, price } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "الكورس غير صالح" }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (existing) {
      return NextResponse.json({ error: "أنت مشترك بالفعل في هذا الكورس" }, { status: 400 });
    }

    // Create Enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        pricePaid: price || 0,
      }
    });

    return NextResponse.json({ success: true, enrollmentId: enrollment.id, courseId: courseId });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}
