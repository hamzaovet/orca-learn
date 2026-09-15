"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Radio,
  Microscope,
  MessageSquare,
  Crown,
  LogIn,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface MobileNavDrawerProps {
  session: any;
}

export default function MobileNavDrawer({ session }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isAdmin = ["ADMIN", "SUPERADMIN"].includes(session?.user?.role);

  const links = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/courses", label: "المقررات والأقسام", icon: BookOpen },
    {
      href: "/dashboard/live",
      label: "الحصص المباشرة (Live 🔴)",
      icon: Radio,
      highlight: true,
    },
    { href: "/#research", label: "الأبحاث العلمية", icon: Microscope },
    { href: "/#reviews", label: "آراء الطلاب", icon: MessageSquare },
  ];

  return (
    <div className="lg:hidden flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="قائمة الموقع"
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative mr-auto z-50 flex flex-col w-72 max-w-[85vw] h-full bg-[#070D18] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-black text-white">
                أوركا <span className="text-gradient">ليرن</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto">
              {links.map(({ href, label, icon: Icon, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                    highlight
                      ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 transition-colors mt-2"
                >
                  <Crown className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>لوحة تحكم الإدارة</span>
                </Link>
              )}
            </nav>

            <div className="border-t border-white/10 p-4 space-y-2 bg-slate-950/40">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-bold border border-white/10"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>كورساتي وحسابي</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-theme-primary flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>تسجيل الدخول / البدء مجاناً</span>
                  </Link>
                  <Link
                    href="/maestro"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 text-slate-400 hover:text-amber-400 text-xs font-bold"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>بوابة الإدارة (المايسترو)</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
