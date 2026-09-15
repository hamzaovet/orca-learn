import { prisma } from "@/lib/prisma";
import { Globe, Pencil } from "lucide-react";
import { AddCountryForm } from "@/components/admin/AddCountryForm";
import DeleteCountryButton from "@/components/admin/DeleteCountryButton";

export default async function AdminCountriesPage() {
  const countries = await prisma.country.findMany({
    include: { _count: { select: { universities: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-50">إدارة الدول</h1>
          <p className="mt-1 text-sm text-slate-400">
            {countries.length} دولة في قاعدة البيانات
          </p>
        </div>
        <AddCountryForm />
      </div>

      {/* ── Data table ── */}
      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">

            {/* Head */}
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["اسم الدولة", "الكود (Code)", "عدد الجامعات", "إجراءات"].map((col) => (
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
              {countries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Globe className="h-10 w-10 text-slate-700" />
                      <p className="text-sm font-semibold text-slate-600">
                        لا توجد دول مضافة حالياً
                      </p>
                      <p className="text-xs text-slate-700">
                        أضف أول دولة لبدء بناء التسلسل الهرمي
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                countries.map((country) => (
                  <tr
                    key={country.id}
                    className="group transition-colors hover:bg-white/[0.025]"
                  >
                    {/* Country name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                          <Globe className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="font-bold text-slate-100">
                          {country.name}
                        </span>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg border border-slate-600/40 bg-slate-800/60 px-3 py-1 font-mono text-xs font-bold tracking-widest text-slate-300">
                        {country.code}
                      </span>
                    </td>

                    {/* University count */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
                        {country._count.universities} جامعة
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`تعديل ${country.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <DeleteCountryButton countryId={country.id} countryName={country.name} />
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
