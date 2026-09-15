"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createResearchPaper(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  const title = formData.get("title") as string;
  const titleAr = formData.get("titleAr") as string;
  const journal = formData.get("journal") as string;
  const year = parseInt(formData.get("year") as string) || 2025;
  const category = (formData.get("category") as string) || "general";
  const authors = formData.get("authors") as string;
  const abstractAr = formData.get("abstractAr") as string;
  const impact = formData.get("impact") as string;
  const doi = formData.get("doi") as string;

  if (!title || !titleAr || !journal || !abstractAr) {
    return { error: "جميع الحقول الأساسية مطلوبة (العنوان بالإنجليزية والعربية والمجلة والملخص)." };
  }

  try {
    await prisma.researchPaper.create({
      data: {
        title,
        titleAr,
        journal,
        year,
        category,
        authors: authors || "د. صالحة جابر دسوقي وآخرون",
        abstractAr,
        impact,
        doi,
      },
    });

    revalidatePath("/admin/research");
    revalidatePath("/research");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل إضافة البحث العلمي." };
  }
}

export async function deleteResearchPaper(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
    return { error: "غير مصرح لك بتنفيذ هذه العملية." };
  }

  try {
    await prisma.researchPaper.delete({
      where: { id },
    });

    revalidatePath("/admin/research");
    revalidatePath("/research");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف البحث العلمي." };
  }
}
