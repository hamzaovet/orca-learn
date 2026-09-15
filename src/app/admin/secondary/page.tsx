import { prisma } from "@/lib/prisma";
import SecondaryGradesClient from "./SecondaryGradesClient";

export const metadata = {
  title: "إدارة المرحلة الثانوية | لوحة الإدارة",
  description: "إدارة صفوف ومناهج المرحلة الثانوية لطلاب الأحياء وعلمي علوم",
};

export default async function AdminSecondaryPage() {
  const grades = await prisma.secondaryGrade.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)] uppercase tracking-wider">
            المسار التعليمي الثانوي
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          إدارة صفوف ومناهج المرحلة الثانوية
        </h1>
        <p className="text-slate-400 mt-2 text-base max-w-2xl leading-relaxed">
          قم بإضافة وتعديل وحذف صفوف ومناهج المرحلة الثانوية (الثانوية العامة، نظام المسارات، واللغات)، وربطها بالكورسات والمراجعات.
        </p>
      </div>

      <SecondaryGradesClient initialGrades={grades} />
    </div>
  );
}
