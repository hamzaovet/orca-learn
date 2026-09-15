import { prisma } from "@/lib/prisma";
import { DepartmentForm } from "./DepartmentForm";
import { Layers } from "lucide-react";
import DeleteDepartmentButton from "@/components/admin/DeleteDepartmentButton";

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: { university: true },
    orderBy: { createdAt: 'desc' }
  });

  const universities = await prisma.university.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-50 flex items-center gap-3">
            <Layers className="text-cyan-400 w-8 h-8" />
            إدارة الأقسام
          </h1>
          <p className="mt-2 text-sm text-slate-400">تحكم كامل في الأقسام الدراسية وربطها المباشر بالجامعات.</p>
        </div>
        <DepartmentForm universities={universities} />
      </div>

      <div className="glass-panel overflow-hidden rounded-3xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-300">
            <thead className="bg-[#0B1221] border-b border-white/5 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-5 font-black">اسم القسم</th>
                <th className="px-6 py-5 font-black">الجامعة التابع لها</th>
                <th className="px-6 py-5 font-black">تاريخ الإضافة</th>
                <th className="px-6 py-5 font-black">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Layers className="w-12 h-12 text-slate-600 mb-2" />
                      <p className="text-slate-400 text-lg">لا يوجد أقسام مضافة بعد</p>
                    </div>
                  </td>
                </tr>
              ) : (
                departments.map(dept => (
                  <tr key={dept.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 font-bold text-white">{dept.name}</td>
                    <td className="px-6 py-5">
                      <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg border border-cyan-500/20 text-xs font-bold">
                        {dept.university?.name || 'غير محدد'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-mono text-xs">
                      {new Date(dept.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <DeleteDepartmentButton departmentId={dept.id} departmentName={dept.name} />
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
