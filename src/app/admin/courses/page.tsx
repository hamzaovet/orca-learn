import { prisma } from "@/lib/prisma";
import { Pencil, PlusCircle, School, GraduationCap, Crown, BookOpen } from "lucide-react";
import Link from "next/link";
import { PublishToggle } from "@/components/admin/PublishToggle";
import DeleteCourseButton from "@/components/admin/DeleteCourseButton";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { 
      department: true, 
      university: true,
      secondaryGrade: true,
      chapters: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-50">إدارة الكورسات</h1>
          <p className="mt-1 text-sm text-slate-400">
            {courses.length} كورس في قاعدة البيانات (ثانوي • جامعي • VIP)
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="btn-theme-primary flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold text-white shadow-lg w-fit"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إضافة كورس جديد</span>
        </Link>
      </div>

      {/* ── Data table ── */}
      <div className="glass-panel overflow-hidden rounded-3xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">

            {/* Head */}
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {[
                  "اسم الكورس",
                  "المسار التعليمي",
                  "الجهة / التخصص",
                  "السعر المحلي",
                  "السعر (USD)",
                  "الحالة",
                  "إجراءات",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-white/5">
              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    لا توجد كورسات بعد — أضف كورسك الأول للمرحلة الثانوية أو الجامعية!
                  </td>
                </tr>
              ) : (
                courses.map((course) => {
                  const isSecondary = course.stage === "SECONDARY" || !!course.secondaryGradeId;
                  const isVIP = course.isMaestroAcademy || course.stage === "VIP";

                  return (
                    <tr
                      key={course.id}
                      className="group transition-colors hover:bg-white/[0.025]"
                    >
                      {/* Course title */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-100 block">
                          {course.title}
                        </span>
                        {(() => {
                          const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
                          return (
                            <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                              <BookOpen className="w-3 h-3 text-[var(--theme-primary)]" />
                              {course.chapters.length} فصول • {totalLessons} حصة
                            </span>
                          );
                        })()}
                      </td>

                      {/* Track badge */}
                      <td className="px-6 py-4">
                        {isVIP ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            VIP أبحاث
                          </span>
                        ) : isSecondary ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                            <School className="w-3.5 h-3.5 text-emerald-400" />
                            ثانوي
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300">
                            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                            جامعي
                          </span>
                        )}
                      </td>

                      {/* Affiliation / Department / Grade */}
                      <td className="px-6 py-4">
                        {isVIP ? (
                          <span className="text-xs text-amber-400 font-bold">أكاديمية التميز</span>
                        ) : isSecondary ? (
                          <span className="text-xs font-bold text-slate-200">
                            {course.secondaryGrade?.name || "منهج ثانوي عام"}
                          </span>
                        ) : (
                          <div className="text-xs">
                            <span className="font-bold text-slate-200 block">{course.university?.name || "جامعة عامة"}</span>
                            <span className="text-slate-400">{course.department?.name || "قسم عام"}</span>
                          </div>
                        )}
                      </td>

                      {/* Price Local */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-300">
                        {course.priceLocal}
                      </td>

                      {/* Price USD */}
                      <td className="px-6 py-4 font-mono font-bold text-[var(--theme-primary)]">
                        ${course.priceUSD}
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <PublishToggle courseId={course.id} isPublished={course.isPublished} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/courses/${course.id}`}
                            aria-label={`تعديل وإدارة منهج ${course.title}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] hover:border-[var(--theme-primary)] text-xs font-bold transition-all shadow-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>المنهج والدروس</span>
                          </Link>
                          <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
