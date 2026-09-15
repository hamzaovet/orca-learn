"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/maestro" })}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-400/80 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>تسجيل الخروج</span>
    </button>
  );
}
