"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { DEFAULT_THEME_ID, THEMES } from "@/lib/themes";

/**
 * Get active theme ID from DB (with fallback to DEFAULT_THEME_ID)
 */
export async function getActiveThemeId(): Promise<string> {
  try {
    // 1. Check cookies first for instant client preference if any
    const cookieStore = await cookies();
    const cookieTheme = cookieStore.get("app_theme")?.value;
    if (cookieTheme && THEMES.some((t) => t.id === cookieTheme)) {
      return cookieTheme;
    }

    // 2. Fetch from DB
    const setting = await prisma.siteSetting.findUnique({
      where: { id: "global" },
      select: { theme: true },
    });

    if (setting?.theme && THEMES.some((t) => t.id === setting.theme)) {
      return setting.theme;
    }
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("DYNAMIC_SERVER_USAGE")) {
      throw error;
    }
    console.error("Error fetching active theme:", error);
  }

  return DEFAULT_THEME_ID;
}

/**
 * Update global platform theme (Admin / SuperAdmin only)
 */
export async function setGlobalTheme(themeId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "غير مصرح لك بتغيير الثيم. يرجى تسجيل الدخول كمسؤول." };
  }

  const userRole = (session.user as any).role;
  if (!["ADMIN", "SUPERADMIN"].includes(userRole)) {
    return { success: false, error: "فقط مسؤولو النظام يمكنهم تغيير ثيم المنصة." };
  }

  const validTheme = THEMES.find((t) => t.id === themeId);
  if (!validTheme) {
    return { success: false, error: "الثيم المحدد غير صالح." };
  }

  try {
    // 1. Upsert DB Setting
    await prisma.siteSetting.upsert({
      where: { id: "global" },
      update: { theme: themeId },
      create: { id: "global", theme: themeId },
    });

    // 2. Set Cookie for SSR
    const cookieStore = await cookies();
    cookieStore.set("app_theme", themeId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    // 3. Revalidate cache
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    return {
      success: true,
      theme: validTheme,
      message: `تم تفعيل ثيم "${validTheme.name}" بنجاح وتطبيقه على كافة أرجاء المنصة!`,
    };
  } catch (error: any) {
    console.error("Error saving theme:", error);
    return { success: false, error: error?.message || "حدث خطأ أثناء حفظ الثيم." };
  }
}
