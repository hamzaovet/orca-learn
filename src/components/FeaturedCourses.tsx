import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Category badge colour map
const categoryColors: Record<string, string> = {
  accounting: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300",
  finance:    "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300",
  management: "from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-300",
};

const categoryIcons: Record<string, string> = {
  accounting: "📊",
  finance:    "💹",
  management: "🏛️",
};

export default async function FeaturedCourses() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: { 
      department: true,
      university: { include: { country: true } }
    },
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  if (courses.length === 0) return null;

  return (
    <section className="relative py-20" aria-labelledby="featured-heading">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute left-1/4 top-0 h-[350px] w-[350px] rounded-full bg-blue-700/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            ✦ الكورسات المميزة
          </span>
          <h2
            id="featured-heading"
            className="text-3xl font-black text-slate-50 sm:text-4xl"
          >
            ابدأ رحلتك مع{" "}
            <span className="text-gradient">أفضل الكورسات</span>
          </h2>
          <p className="max-w-md text-base text-slate-400">
            محتوى أكاديمي معتمد، شرح مبسّط، وتمارين تطبيقية لكل مقرر.
          </p>
        </div>

        {/* Course cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const slug = course.department?.slug || '';
            const colorClass =
              categoryColors[slug] ?? "from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-300";
            const icon = categoryIcons[slug] ?? "📚";

            return (
              <article
                key={course.id}
                className="glass-panel group flex flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] hover:border-white/20"
              >
                {/* Category badge */}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-bold ${colorClass}`}
                  >
                    <span>{icon}</span>
                    {course.department?.name || 'عام'}
                  </span>
                  {/* Published indicator */}
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    متاح
                  </span>
                </div>

                {/* Course title */}
                <h3 className="mb-3 flex-1 text-lg font-extrabold leading-snug text-slate-50 transition-colors group-hover:text-cyan-300">
                  {course.title}
                </h3>

                {/* Description */}
                {course.description && (
                  <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {course.description}
                  </p>
                )}

                {/* Footer: price + CTA */}
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">السعر</span>
                    {course.priceLocal > 0 ? (
                      <span className="text-xl font-black text-gradient">
                        {course.priceLocal} {course.university?.country?.currencyCode || 'SAR'}
                      </span>
                    ) : (
                      <span className="text-xl font-black text-emerald-400">مجاناً</span>
                    )}
                  </div>

                  <a
                    href={`/courses/${course.id}`}
                    className="rounded-xl bg-gradient-to-l from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    aria-label={`تسجيل في ${course.title}`}
                  >
                    سجّل الآن
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <a
            href="/courses"
            className="glass-panel inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-3.5 text-sm font-bold text-slate-200 transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-300"
          >
            عرض جميع الكورسات
            <span className="text-base">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
