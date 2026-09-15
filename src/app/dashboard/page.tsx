import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight, PlayCircle } from 'lucide-react';

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as any).id;
  const userName = session.user.name || "طالب أوركا";

  // Fetch Enrollments with Course details
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 py-24 px-4 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2">مرحباً بك، <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-blue-500">{userName}</span></h1>
          <p className="text-slate-400 text-lg">هذه هي لوحة التحكم الخاصة بك. يمكنك متابعة كورساتك من هنا.</p>
        </div>

        {/* Enrollments Logic */}
        {enrollments.length === 0 ? (
          /* Empty State */
          <div className="bg-[#111827]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-16 text-center shadow-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-500/10 text-cyan-500 mb-6 border border-cyan-500/20">
              <BookOpen className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">لم تشترك في أي كورس بعد</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">ابدأ رحلتك التعليمية الآن واكتشف كورساتنا المتميزة المصممة خصيصاً لتطوير مهاراتك.</p>
            
            <Link 
              href="/courses" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 font-extrabold text-lg px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] hover:-translate-y-1 inline-flex items-center gap-2"
            >
              تصفح الكورسات <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Populated State (Grid) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              const enrolledDate = new Date(enrollment.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'short', day: 'numeric'
              });

              return (
                <div key={enrollment.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:bg-white/10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-2">
                  
                  {/* Top Half - Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 relative flex items-center justify-center border-b border-white/10 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-800/30 via-transparent to-transparent group-hover:scale-150 transition-transform duration-700"></div>
                    )}
                    <PlayCircle className="w-16 h-16 text-white/50 absolute group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  
                  {/* Bottom Half - Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      {enrollment.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          مفعل ونشط ✓
                        </span>
                      ) : enrollment.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                          بانتظار مراجعة الإيصال ⏳
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                          معطل / منتهي ⏸️
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-relaxed line-clamp-2" title={course.title}>
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 mt-auto">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>تاريخ الطلب: {enrolledDate}</span>
                    </div>

                    {enrollment.status === "ACTIVE" ? (
                      <Link 
                        href={`/dashboard/courses/${course.id}`} 
                        className="btn-theme-primary w-full text-center py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>متابعة التعلم والمحاضرات ↗</span>
                      </Link>
                    ) : (
                      <Link 
                        href={`/checkout/${course.id}`} 
                        className="w-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-center py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <span>عرض حالة الطلب والإيصال</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
