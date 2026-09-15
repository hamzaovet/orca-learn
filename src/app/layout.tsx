import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getActiveThemeId } from "@/actions/theme";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة د. صالحة جابر دسوقي | الأحياء والميكروبيولوجيا — للمرحلة الثانوية والجامعية",
  description:
    "المنصة الأكاديمية والتعليمية الرائدة في تدريس مادة الأحياء والميكروبيولوجيا والتكنولوجيا الحيوية لطلاب المرحلة الثانوية والجامعات — بإشراف د. صالحة جابر دسوقي، كلية العلوم جامعة السويس.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeTheme = await getActiveThemeId();

  return (
    <html dir="rtl" lang="ar" className="dark" data-theme={activeTheme} suppressHydrationWarning>
      <body
        className={`${tajawal.className} bg-[#050B14] text-slate-200 antialiased`}
        suppressHydrationWarning
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0B0F19",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
