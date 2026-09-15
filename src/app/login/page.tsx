"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, ArrowRight, GraduationCap, Microscope, Dna, Award, MailOpen } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Smart email provider router (Updated for GCC/Apple Users)
  const getEmailProviderUrl = (email: string) => {
    const lowerEmail = email.toLowerCase();
    
    // Google
    if (lowerEmail.includes("@gmail.com")) return "https://mail.google.com";
    
    // Apple / iCloud
    if (lowerEmail.includes("@icloud.com") || lowerEmail.includes("@me.com") || lowerEmail.includes("@mac.com")) return "https://www.icloud.com/mail";
    
    // Microsoft
    if (lowerEmail.includes("@outlook.com") || lowerEmail.includes("@hotmail.com") || lowerEmail.includes("@live.com")) return "https://outlook.live.com";
    
    // Yahoo
    if (lowerEmail.includes("@yahoo.com")) return "https://mail.yahoo.com";
    
    // Fallback (Default to Gmail if custom domain or unknown)
    return "https://mail.google.com";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNeedsVerification(false);

    if (isLogin) {
      const res = await signIn("credentials", {
        username: formData.email,
        password: formData.password,
        redirect: false
      });
      if (res?.error) { 
        if (res.error.includes("تفعيل حسابك")) {
          setNeedsVerification(true);
        } else {
          toast.error(res.error); 
        }
        setIsLoading(false); 
      } 
      else {
        toast.success("تم تسجيل الدخول بنجاح!");
        const session = await getSession();
        if (session?.user && ["ADMIN", "SUPERADMIN"].includes((session.user as any).role)) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/courses";
        }
      }
    } else {
      try {
        const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Automatically show the verification screen after successful registration
        setNeedsVerification(true);
        setIsLogin(true); // Reset to login mode for later
        setFormData({ ...formData, password: "" }); // Clear password
      } catch (error: any) { toast.error(error.message || "حدث خطأ أثناء التسجيل"); } 
      finally { setIsLoading(false); }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />
      
      <div className="min-h-screen flex w-full bg-[#050B14] overflow-hidden font-sans">
        
        
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050B14] to-[#050B14] pointer-events-none"></div>
          
          <Link className="absolute top-8 right-8 inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium z-20" href="/courses">
            <ArrowRight className="w-4 h-4"/> العودة للمنصة
          </Link>

          <div className="w-full max-w-md mx-auto relative z-20">
            
            {needsVerification ? (
              /* Verification Required Screen */
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 mb-8 border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                  <MailOpen className="w-10 h-10 animate-bounce"/>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-4">راجع بريدك الإلكتروني</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  أرسلنا رابط التفعيل إلى <br/>
                  <span className="text-cyan-400 font-bold">{formData.email}</span><br/>
                  برجاء الضغط على الرابط لتفعيل حسابك.
                </p>
                
                <a 
                  href={getEmailProviderUrl(formData.email)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 font-extrabold text-lg py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] hover:-translate-y-1"
                >
                  الذهاب إلى البريد الإلكتروني <ArrowRight className="w-5 h-5"/>
                </a>
                
                <button 
                  onClick={() => setNeedsVerification(false)} 
                  className="mt-6 text-slate-500 hover:text-white transition-colors"
                >
                  تم التفعيل؟ العودة لتسجيل الدخول
                </button>
              </div>
            ) : (
              /* Standard Login/Register Form */
              <>
                <div className="mb-10 text-right animate-in fade-in duration-500">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <GraduationCap className="w-7 h-7"/>
                  </div>
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-white to-slate-400 mb-3 tracking-tight">
                    {isLogin ? "أهلاً بعودتك" : "ابدأ رحلتك"}
                  </h1>
                  <p className="text-cyan-100/60 text-lg">
                    {isLogin ? "سجل دخولك لمتابعة كورساتك وتحقيق أهدافك." : "أنشئ حسابك الآن وانضم لنخبة المتعلمين."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!isLogin && (
                    <div className="relative group">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"/>
                      <input type="text" placeholder="الاسم بالكامل" required={!isLogin} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#0B1221] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner" />
                    </div>
                  )}

                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"/>
                    <input 
                      type={isLogin ? "text" : "email"} 
                      placeholder={isLogin ? "البريد الإلكتروني أو اسم المستخدم" : "البريد الإلكتروني"} 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      className="w-full bg-[#0B1221] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner" 
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"/>
                    <input type="password" placeholder="كلمة المرور" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-[#0B1221] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner" />
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 font-extrabold text-lg py-4 rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] hover:-translate-y-1 flex justify-center items-center gap-2 mt-4">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative flex items-center gap-2">
                      {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-900"/>}
                      {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
                    </span>
                  </button>
                </form>

                <div className="mt-8 text-center text-slate-500 animate-in fade-in duration-700">
                  {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
                  <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:text-cyan-300 font-bold transition-all hover:tracking-wide ml-1">
                    {isLogin ? "سجل الآن مجاناً" : "تسجيل الدخول"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        
        <div className="hidden lg:flex w-1/2 relative bg-[#0B1221] items-center justify-center p-12 overflow-hidden border-r border-white/5">
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          
          <div className="animate-float relative z-10 w-full max-w-lg bg-[#111827]/60 border border-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="mb-10 border-b border-white/5 pb-8">
              <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">تعلم من <span className="text-gradient">نخبة أكاديمية وبحثية</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                أكثر من 25 عاماً من الريادة في أبحاث الميكروبيولوجيا والتكنولوجيا الحيوية والتدريس الجامعي بإشراف د. صالحة جابر دسوقي، نضعها بين يديك في منصة واحدة.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-5 bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/5 group">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"><Microscope className="w-7 h-7"/></div>
                <div>
                  <h4 className="text-white font-bold text-lg">تطبيقات معملية وبحثية متطورة</h4>
                  <p className="text-sm text-slate-400 mt-1">شروحات دقيقة تربط بين الأساسيات النظرية وأحدث تقنيات PCR والبيوتكنولوجي</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/5 group">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"><Award className="w-7 h-7"/></div>
                <div>
                  <h4 className="text-white font-bold text-lg">نشر علمي دولي محكّم</h4>
                  <p className="text-sm text-slate-400 mt-1">أكثر من 20 بحثاً دولياً وإشراف على رسائل الماجستير والدكتوراه</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
