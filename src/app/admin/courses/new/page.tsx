import { prisma } from "@/lib/prisma";
import { CreateCourseForm } from "@/components/admin/CreateCourseForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function NewCoursePage() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });
  
  const universities = await prisma.university.findMany({
    include: { country: true },
    orderBy: { name: "asc" },
  });

  const secondaryGrades = await prisma.secondaryGrade.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full p-6 md:p-10">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/admin/courses" 
          className="flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-[var(--theme-primary)]"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للكورسات
        </Link>
        <h1 className="text-3xl font-black text-slate-50 mt-2">إضافة كورس جديد</h1>
        <p className="text-sm text-slate-400">
          حدد المرحلة التعليمية (ثانوي أو جامعي أو VIP)، وأدخل تفاصيل الكورس وسعر الاشتراك.
        </p>
      </div>

      {/* ── Form ── */}
      <CreateCourseForm 
        departments={departments} 
        universities={universities} 
        secondaryGrades={secondaryGrades} 
      />
    </div>
  );
}
