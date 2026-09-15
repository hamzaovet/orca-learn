import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { Crown } from "lucide-react";
import { authOptions } from "@/lib/auth";
import UserMenu from "./auth/UserMenu";
import MobileNavDrawer from "./MobileNavDrawer";

export default async function Navbar() {
  // Fetch session securely on the server
  const session = await getServerSession(authOptions);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050B14]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-white flex items-center gap-1 tracking-tight">
          أوركا <span className="text-gradient">ليرن</span>
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-400">
          <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors">الرئيسية</Link>
          <Link href="/courses" className="hover:text-[var(--theme-primary)] transition-colors">المقررات والأقسام</Link>
          <Link href="/dashboard/live" className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1.5 text-rose-400/90 hover:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>الحصص المباشرة (Live)</span>
          </Link>
          <Link href="/#research" className="hover:text-[var(--theme-primary)] transition-colors">الأبحاث العلمية</Link>
          <Link href="/#reviews" className="hover:text-[var(--theme-primary)] transition-colors">آراء الطلاب</Link>
        </div>

        {/* Auth / User + Mobile Drawer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <Link className="text-slate-600 hover:text-amber-500 transition-colors p-2" href="/maestro" title="بوابة الإدارة">
                <Crown className="w-5 h-5"/>
              </Link>
              <Link href="/login" className="hidden md:flex px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white text-sm font-bold transition-all">
                تسجيل الدخول
              </Link>
              <Link href="/login" className="btn-theme-primary px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all">
                ابدأ مجاناً
              </Link>
            </>
          )}

          {/* Mobile Navigation Drawer */}
          <MobileNavDrawer session={session} />
        </div>
      </div>
    </nav>
  );
}
