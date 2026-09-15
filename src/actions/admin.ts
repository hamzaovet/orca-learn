"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCountry(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;

  if (!name || !code) {
    return { error: "الرجاء إدخال اسم الدولة والكود" };
  }

  // Auto-generate slug supporting Arabic and random hash to prevent collisions
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);

  try {
    await prisma.country.create({
      data: { name, code, slug },
    });

    revalidatePath("/admin/countries");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "هذه الدولة أو الكود مسجل بالفعل!" };
    }
    return { error: "حدث خطأ أثناء إضافة الدولة" };
  }
}

export async function addUniversity(formData: FormData) {
  const name = formData.get("name") as string;
  const countryId = formData.get("countryId") as string;

  if (!name || !countryId) {
    return { error: "الرجاء إدخال اسم الجامعة واختيار الدولة" };
  }

  // Auto-generate slug supporting Arabic and random hash to prevent collisions
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);

  try {
    await prisma.university.create({
      data: { name, countryId, slug },
    });

    revalidatePath("/admin/universities");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "هذه الجامعة مسجلة بالفعل!" };
    }
    return { error: "حدث خطأ أثناء إضافة الجامعة" };
  }
}

export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const isMaestroAcademy = formData.get("isMaestroAcademy") === "on";
  const stage = (formData.get("stage") as string) || (isMaestroAcademy ? "VIP" : "UNIVERSITY");
  
  const secondaryGradeId = formData.get("secondaryGradeId") as string | null;
  const departmentId = formData.get("departmentId") as string | null;
  const universityId = formData.get("universityId") as string | null;
  
  const priceLocal = formData.get("priceLocal") as string;
  const priceUSD = formData.get("priceUSD") as string;

  if (!title || !priceLocal) {
    return { error: "الرجاء إدخال اسم الكورس والسعر" };
  }

  if (stage === "UNIVERSITY" && !isMaestroAcademy && (!departmentId || !universityId)) {
    return { error: "الرجاء اختيار الجامعة والقسم للمرحلة الجامعية" };
  }

  if (stage === "SECONDARY" && !secondaryGradeId) {
    return { error: "الرجاء اختيار الصف الدراسي للمرحلة الثانوية" };
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        isMaestroAcademy: isMaestroAcademy || stage === "VIP",
        stage: isMaestroAcademy || stage === "VIP" ? "VIP" : stage,
        secondaryGradeId: stage === "SECONDARY" ? secondaryGradeId : null,
        departmentId: stage === "UNIVERSITY" ? departmentId : null,
        universityId: stage === "UNIVERSITY" ? universityId : null,
        priceLocal: parseFloat(priceLocal),
        priceUSD: parseFloat(priceUSD) || parseFloat(priceLocal) || 0,
        isPublished: true, // Auto-publish for Admin
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath("/");
    return { success: true, courseId: course.id };
  } catch (error: any) {
    console.error("Error creating course:", error);
    return { error: "حدث خطأ أثناء إضافة الكورس" };
  }
}

export async function toggleCoursePublish(courseId: string, currentStatus: boolean) {
  try {
    await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !currentStatus },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, newStatus: !currentStatus };
  } catch (error) {
    return { error: "حدث خطأ أثناء تغيير حالة الكورس" };
  }
}

export async function createChapter(formData: FormData) {
  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;

  if (!title || !courseId) {
    return { error: "الرجاء إدخال اسم الفصل" };
  }

  try {
    await prisma.chapter.create({
      data: { title, courseId },
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء إضافة الفصل" };
  }
}

export async function deleteChapter(chapterId: string, courseId: string) {
  try {
    await prisma.lesson.deleteMany({ where: { chapterId } });
    await prisma.chapter.delete({ where: { id: chapterId } });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الفصل" };
  }
}

export async function createLesson(formData: FormData) {
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const attachmentUrl = formData.get("attachmentUrl") as string;
  const isFree = formData.get("isFree") === "on";
  const chapterId = formData.get("chapterId") as string;
  const courseId = formData.get("courseId") as string;

  if (!title || !chapterId || !courseId) {
    return { error: "الرجاء إدخال اسم الدرس" };
  }

  try {
    await prisma.lesson.create({
      data: { title, videoUrl: videoUrl || null, attachmentUrl: attachmentUrl || null, isFree, chapterId },
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء إضافة الدرس" };
  }
}

export async function deleteLesson(lessonId: string, courseId: string) {
  try {
    await prisma.lesson.delete({ where: { id: lessonId } });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الدرس" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    if (!courseId) return { success: false, error: "معرف الكورس مفقود" };

    // Delete related entities safely
    await prisma.enrollment.deleteMany({ where: { courseId } });
    await prisma.module.deleteMany({ where: { courseId } });

    const chapters = await prisma.chapter.findMany({ where: { courseId }, select: { id: true } });
    const chapterIds = chapters.map((c) => c.id);
    if (chapterIds.length > 0) {
      await prisma.lesson.deleteMany({ where: { chapterId: { in: chapterIds } } });
      await prisma.chapter.deleteMany({ where: { courseId } });
    }

    await prisma.course.delete({
      where: { id: courseId }
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true, message: "تم حذف الكورس بنجاح" };
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء حذف الكورس" };
  }
}

export async function deleteCountry(countryId: string) {
  try {
    if (!countryId) return { success: false, error: "معرف الدولة مفقود" };

    // Unlink courses referencing this country
    await prisma.course.updateMany({
      where: { countryId },
      data: { countryId: null }
    });

    // Delete country
    await prisma.country.delete({
      where: { id: countryId }
    });

    revalidatePath("/admin/countries");
    revalidatePath("/admin/universities");
    return { success: true, message: "تم حذف الدولة والجامعات التابعة لها بنجاح" };
  } catch (error: any) {
    console.error("Error deleting country:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء حذف الدولة" };
  }
}

export async function deleteUniversity(universityId: string) {
  try {
    if (!universityId) return { success: false, error: "معرف الجامعة مفقود" };

    // Unlink courses referencing this university
    await prisma.course.updateMany({
      where: { universityId },
      data: { universityId: null }
    });

    // Delete departments belonging to this university
    await prisma.department.deleteMany({
      where: { universityId }
    });

    await prisma.university.delete({
      where: { id: universityId }
    });

    revalidatePath("/admin/universities");
    revalidatePath("/admin/departments");
    return { success: true, message: "تم حذف الجامعة بنجاح" };
  } catch (error: any) {
    console.error("Error deleting university:", error);
    return { success: false, error: error.message || "حدث خطأ أثناء حذف الجامعة" };
  }
}
