import { prisma } from "@/lib/prisma";
import StudentReviewsClient from "./StudentReviewsClient";

export const metadata = {
  title: "إدارة آراء الطلاب وقصص النجاح | لوحة الإدارة",
  description: "إدارة واعتماد وتوثيق شهادات وتجارب طلاب الثانوية والجامعة",
};

export default async function AdminReviewsPage() {
  const reviews = await prisma.studentReview.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)] uppercase tracking-wider">
            شهادات وتجارب الطلاب
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          إدارة آراء الطلاب وقصص النجاح
        </h1>
        <p className="text-slate-400 mt-2 text-base max-w-2xl leading-relaxed">
          تحكم بالآراء المنشورة، اعتمد شهادات جديدة لطلاب الثانوية والجامعات والدراسات العليا، أو قم بتعطيل أو حذف أي تقييم.
        </p>
      </div>

      <StudentReviewsClient initialReviews={reviews} />
    </div>
  );
}
