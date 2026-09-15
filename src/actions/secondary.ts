"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSecondaryGrade(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  const name = formData.get("name") as string;
  const countryCode = (formData.get("countryCode") as string) || "EGY";
  const description = formData.get("description") as string;

  if (!name || name.trim().length === 0) {
    return { error: "اسم الصف الدراسي مطلوب." };
  }

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0621-\u064A]/gi, "")
    .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

  try {
    await prisma.secondaryGrade.create({
      data: {
        name,
        slug,
        countryCode,
        description,
      },
    });

    revalidatePath("/admin/secondary");
    revalidatePath("/");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل إنشاء الصف الدراسي." };
  }
}

export async function deleteSecondaryGrade(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  try {
    await prisma.secondaryGrade.delete({
      where: { id },
    });

    revalidatePath("/admin/secondary");
    revalidatePath("/");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف الصف الدراسي." };
  }
}
