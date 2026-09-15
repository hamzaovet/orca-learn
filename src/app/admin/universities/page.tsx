import { prisma } from "@/lib/prisma";
import { Building2, Pencil } from "lucide-react";
import { AddUniversityForm } from "@/components/admin/AddUniversityForm";
import DeleteUniversityButton from "@/components/admin/DeleteUniversityButton";

export default async function AdminUniversitiesPage() {
  const universities = await prisma.university.findMany({
    include: {
      country: true,
      _count: { select: { courses: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const countries = await prisma.country.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-50">إدارة الجامعات</h1>
          <p className="mt-1 text-sm text-slate-400">
            {universities.length} جامعة في قاعدة البيانات
          </p>
        </div>
        <AddUniversityForm countries={countries} />
      </div>

      {/* ── Data table ── */}
      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">

            {/* Head */}
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {[
                  "اسم الجامعة",
                  "الدولة التابعة لها",
                  "عدد الكورسات",
                  "إجراءات",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-white/5">
              {universities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Building2 className="h-10 w-10 text-slate-700" />
                      <p className="text-sm font-semibold text-slate-600">
                        لا توجد جامعات مضافة حالياً
                      </p>
                      <p className="text-xs text-slate-700">
                        أضف الدول أولاً، ثم أضف الجامعات التابعة لها
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                universities.map((university) => (
                  <tr
                    key={university.id}
                    className="group transition-colors hover:bg-white/[0.025]"
                  >
                    {/* University name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                          <Building2 className="h-4 w-4 text-cyan-400" />
                        </div>
                        <span className="font-bold text-slate-100">
                          {university.name}
                        </span>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                        {university.country.name}
                        <span className="font-mono text-[10px] text-blue-500">
                          ({university.country.code})
                        </span>
                      </span>
                    </td>

                    {/* Course count */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                        {university._count.courses} كورس
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`تعديل ${university.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <DeleteUniversityButton universityId={university.id} universityName={university.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
