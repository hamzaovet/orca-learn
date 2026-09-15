"use client";

import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon, LayoutDashboard, Crown } from "lucide-react";
import Link from "next/link";

export default function UserMenu({ user }: { user: any }) {
  const isAdmin = ["ADMIN", "SUPERADMIN"].includes(user?.role);
  const isSuper = user?.role === "SUPERADMIN";

  return (
    <div className="flex items-center gap-2 md:gap-4 bg-[#0B1221] border border-white/10 rounded-2xl p-1.5 md:pr-4 shadow-lg">
      <div className="flex items-center gap-2 text-white hidden md:flex">
        <div className={`p-1.5 rounded-xl border ${
          isSuper 
            ? "bg-amber-500/20 text-amber-400 border-amber-500/30" 
            : isAdmin 
            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            : "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/20"
        }`}>
          {isSuper ? <Crown className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
        </div>
        <span className="font-extrabold text-sm ml-2">
          {user.name || user.username || "مستخدم أوركا"}
        </span>
      </div>

      <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>

      {isAdmin && (
        <Link 
          href="/admin" 
          className="text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-xl transition-all hover:bg-amber-500/10 flex items-center gap-1.5 text-xs font-black border border-amber-500/20" 
          title="لوحة تحكم الإدارة"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>لوحة الإدارة</span>
        </Link>
      )}

      <Link 
        href="/dashboard" 
        className="text-slate-400 hover:text-cyan-400 p-2 rounded-xl transition-all hover:bg-white/5 flex items-center gap-2" 
        title="كورساتي"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="text-xs font-bold md:hidden">كورساتي</span>
      </Link>
      
      <button 
        onClick={() => signOut({ callbackUrl: '/' })} 
        className="text-slate-400 hover:text-rose-400 p-2 rounded-xl transition-all hover:bg-rose-500/10 flex items-center gap-2"
        title="تسجيل الخروج"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
