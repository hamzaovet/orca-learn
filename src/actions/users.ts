"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Helper to get authenticated user and verify admin access
async function getAdminCaller() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || (session?.user as any)?.sub;
  const userEmail = session?.user?.email;

  if (!session?.user || (!userId && !userEmail)) {
    throw new Error("غير مصرح لك بالوصول. يرجى تسجيل الدخول.");
  }

  const caller = await prisma.user.findFirst({
    where: {
      OR: [
        ...(userId ? [{ id: userId }] : []),
        ...(userEmail ? [{ email: userEmail }] : []),
      ]
    },
    select: { id: true, role: true, isActive: true }
  });

  if (!caller || !caller.isActive || !["ADMIN", "SUPERADMIN"].includes(caller.role)) {
    throw new Error("ليس لديك صلاحيات للقيام بهذا الإجراء.");
  }

  return caller;
}

// 1. Toggle User Active / Inactive Status
export async function toggleUserStatus(targetUserId: string) {
  try {
    const caller = await getAdminCaller();

    if (caller.id === targetUserId) {
      return { success: false, error: "لا يمكنك تعطيل حسابك الشخصي!" };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, role: true, isActive: true }
    });

    if (!targetUser) {
      return { success: false, error: "المستخدم غير موجود." };
    }

    // Role restrictions
    if (caller.role === "ADMIN") {
      // Normal admin cannot touch Super Admin or another Admin
      if (targetUser.role === "SUPERADMIN" || targetUser.role === "ADMIN") {
        return { success: false, error: "ليس لديك صلاحية لتعديل حالة هذا الحساب." };
      }
    }

    const newStatus = !targetUser.isActive;

    await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: newStatus }
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return {
      success: true,
      newStatus,
      message: newStatus ? "تم تفعيل الحساب بنجاح" : "تم تعطيل الحساب بنجاح"
    };
  } catch (error: any) {
    return { success: false, error: error.message || "حدث خطأ أثناء تعديل حالة الحساب." };
  }
}

// 2. Update User Password
export async function updateUserPassword(targetUserId: string, newPassword: string) {
  try {
    const caller = await getAdminCaller();

    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: "كلمة المرور يجب ألا تقل عن 6 أحرف." };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true, role: true }
    });

    if (!targetUser) {
      return { success: false, error: "المستخدم غير موجود." };
    }

    // Role restrictions
    if (caller.role === "ADMIN") {
      // Normal admin cannot change Super Admin's password
      if (targetUser.role === "SUPERADMIN") {
        return { success: false, error: "ليس لديك صلاحية لتعديل كلمة مرور هذا الحساب." };
      }
      // Normal admin can change their own password or a regular student's password
      if (targetUser.role === "ADMIN" && targetUser.id !== caller.id) {
        return { success: false, error: "لا يمكنك تعديل كلمة مرور مشرف آخر." };
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword }
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: `تم تحديث كلمة مرور ${targetUser.name || "المستخدم"} بنجاح!`
    };
  } catch (error: any) {
    return { success: false, error: error.message || "حدث خطأ أثناء تغيير كلمة المرور." };
  }
}

// 3. Change User Role (Superadmin only)
export async function changeUserRole(targetUserId: string, newRole: "USER" | "ADMIN") {
  try {
    const caller = await getAdminCaller();

    if (caller.role !== "SUPERADMIN") {
      return { success: false, error: "تغيير الصلاحيات متاح فقط للسوبر أدمن (المايسترو)." };
    }

    if (caller.id === targetUserId) {
      return { success: false, error: "لا يمكنك تغيير صلاحية حسابك الخاص." };
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole }
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: `تم تغيير صلاحية المستخدم بنجاح إلى ${newRole === "ADMIN" ? "مدير النظام" : "طالب"}.`
    };
  } catch (error: any) {
    return { success: false, error: error.message || "حدث خطأ أثناء تغيير الصلاحية." };
  }
}
