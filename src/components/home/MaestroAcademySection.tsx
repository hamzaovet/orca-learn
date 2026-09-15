import Link from "next/link";
import { Crown, ArrowLeft, Microscope, Sparkles } from "lucide-react";

export default function MaestroAcademySection({ courses }: { courses: any[] }) {
  return (
    <section className="relative py-24 bg-[#030712] overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ background: "var(--theme-glow)" }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] mb-6 border border-[var(--theme-border)] shadow-[0_0_30px_var(--theme-glow)]">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-[var(--theme-badge-text)] to-[var(--theme-primary)] mb-4">
            أكاديمية التميز — برامج البحث والتأهيل التخصصي
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            برامج تدريبية وبحثية متقدمة مصممة لنقل المعرفة المخبرية الحديثة في الميكروبيولوجيا والتكنولوجيا الحيوية بأعلى المعايير الأكاديمية الدولية.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-[#0B0F19]/60 border border-[var(--theme-border)] rounded-3xl backdrop-blur-xl animate-in fade-in zoom-in duration-700 max-w-3xl mx-auto">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] mb-6 animate-pulse">
              <Microscope className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">ترقبوا إطلاق الدبلومات والمقررات التخصصية المتقدمة قريباً...</h3>
            <p className="text-slate-400 max-w-md text-sm leading-relaxed">
              نقوم بإعداد وتحديث المحتوى العلمي وفق أحدث الأبحاث المنشورة والتطبيقات المعملية لضمان تجربة تعليمية فريدة وموثوقة.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group relative bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_20px_50px_var(--theme-glow)] hover:-translate-y-2 hover:border-[var(--theme-primary)]/50 flex flex-col">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] text-xs font-black px-3 py-1.5 rounded-full border border-[var(--theme-border)] uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    VIP
                  </span>
                </div>
                
                <div className="mt-8 mb-4">
                  <h3 className="text-2xl font-black text-white group-hover:text-[var(--theme-primary)] transition-colors leading-tight mb-3">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {course.description || "برنامج أكاديمي وبحثي متكامل يركز على المهارات العملية والتطبيقية في التخصص."}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">رسوم التسجيل</span>
                    <span className="text-2xl font-black text-[var(--theme-primary)]">${course.priceUSD}</span>
                  </div>
                  
                  <Link 
                    href={`/courses/${course.id}`}
                    className="w-12 h-12 rounded-full bg-[var(--theme-badge-bg)] flex items-center justify-center text-[var(--theme-primary)] group-hover:bg-[var(--theme-primary)] group-hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_var(--theme-glow)]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
