import { prisma } from "@/lib/prisma";
import { BookOpen, TrendingUp, Users, DollarSign } from "lucide-react";

const statCards = [
  { label: "إجمالي الكورسات",  icon: BookOpen,    color: "text-cyan-400",   bg: "bg-cyan-500/10",   value: null, key: "courses"  },
  { label: "الطلاب المسجلين", icon: Users,        color: "text-violet-400", bg: "bg-violet-500/10", value: null, key: "students" },
  { label: "الإيرادات (SAR)",  icon: DollarSign,  color: "text-emerald-400",bg: "bg-emerald-500/10",value: null, key: "revenue"  },
  { label: "معدل النمو",       icon: TrendingUp,  color: "text-amber-400",  bg: "bg-amber-500/10",  value: null, key: "growth"   },
];

export default async function AdminPage() {
  const [courseCount, studentCount] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  const dynamicValues: Record<string, string> = {
    courses:  String(courseCount),
    students: String(studentCount),
    revenue:  "—",
    growth:   "—",
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-slate-50">
          مرحباً بك في لوحة تحكم{" "}
          <span className="text-gradient">أوركا ليرن</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          نظرة عامة على حالة المنصة واحصائياتها.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, icon: Icon, color, bg, key }) => (
          <div
            key={key}
            className="glass-panel flex items-center gap-4 rounded-2xl p-5"
          >
            <div className={`${bg} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-50">
                {dynamicValues[key]}
              </p>
              <p className="text-xs font-medium text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder activity area */}
      <div className="glass-panel flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-3xl">
        <TrendingUp className="h-10 w-10 text-slate-700" />
        <p className="text-sm font-semibold text-slate-600">
          سيتم عرض الرسوم البيانية والنشاط الأخير قريباً
        </p>
      </div>
    </div>
  );
}
