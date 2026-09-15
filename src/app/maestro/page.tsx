"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Crown, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MaestroLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error, {
        style: { background: '#2B1216', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
      });
      setIsLoading(false);
    } else {
      toast.success("تم تسجيل الدخول بنجاح", {
        style: { background: '#1F1709', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' },
        icon: '👑'
      });
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4 font-sans relative overflow-hidden">
      {/* Dark Luxury Amber Background FX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <Crown className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">بوابة الإدارة</h1>
          <p className="text-slate-500 text-sm tracking-widest uppercase">VIP MAESTRO ACCESS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Crown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-amber-500 transition-colors duration-300"/>
            <input 
              type="text" 
              placeholder="اسم المستخدم" 
              required 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
              className="w-full bg-[#050B14] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-inner" 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-amber-500 transition-colors duration-300"/>
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              className="w-full bg-[#050B14] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-inner font-mono" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-extrabold text-lg py-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:-translate-y-1 flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-900"/> : "تسجيل الدخول كمدير"}
          </button>
        </form>
      </div>
    </div>
  );
}
