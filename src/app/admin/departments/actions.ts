"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDepartment(formData: FormData) {
  const name = formData.get("name") as string;
  const universityId = formData.get("universityId") as string;

  if (!name || !universityId) {
    throw new Error("Missing required fields");
  }

  // Auto-generate slug supporting Arabic and random hash to prevent collisions
  const slug = name.trim().replace(/\s+/g, '-') + '-' + Date.now().toString(36);

  await prisma.department.create({
    data: {
      name,
      slug,
      universityId
    }
  });

  revalidatePath("/admin/departments");
}

export async function deleteDepartment(departmentId: string) {
  try {
    if (!departmentId) return { success: false, error: "معرف القسم مفقود" };

    // Unlink any courses that reference this department
    await prisma.course.updateMany({
      where: { departmentId },
      data: { departmentId: null }
    });

    await prisma.department.delete({
      where: { id: departmentId }
    });

    revalidatePath("/admin/departments");
    revalidatePath("/admin/courses");
    return { success: true, message: "تم حذف القسم بنجاح" };
  } catch (error: any) {
    console.error("Error deleting department:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء حذف القسم" };
  }
}
