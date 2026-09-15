import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PublicCoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { department: true, university: { include: { country: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#06080F] py-20 px-6 relative">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-50">تصفح الكورسات</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            استكشف أحدث الكورسات الجامعية والمقررات المتخصصة المصممة خصيصاً لمساعدتك على التفوق.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-lg">
            <h3 className="text-xl font-bold text-slate-300">لا توجد كورسات منشورة حالياً</h3>
            <p className="text-slate-500 mt-2">يرجى العودة لاحقاً لاستكشاف الكورسات الجديدة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="glass-panel group flex flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] border border-white/10 bg-white/5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
                    {course.department?.name || 'عام'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-2 line-clamp-2">{course.title}</h2>
                <p className="text-sm text-slate-400 mb-6 flex-1">
                  {course.university?.name || 'كورس عام'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {course.priceLocal > 0 ? (
                    <span className="font-bold text-lg text-white">
                      {course.priceLocal} {course.university?.country?.currencyCode || 'SAR'}
                    </span>
                  ) : (
                    <span className="font-bold text-lg text-emerald-400">مجاناً</span>
                  )}
                  <Link 
                    href={`/courses/${course.id}`}
                    className="px-4 py-2 bg-gradient-to-l from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
