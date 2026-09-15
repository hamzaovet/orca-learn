import { prisma } from "@/lib/prisma";
import ResearchPapersClient from "./ResearchPapersClient";

export const metadata = {
  title: "إدارة الأبحاث العلمية | لوحة الإدارة",
  description: "إدارة وتوثيق الأبحاث العلمية المنشورة وبراءات الابتكار",
};

export default async function AdminResearchPage() {
  const papers = await prisma.researchPaper.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)] uppercase tracking-wider">
            الإنتاج العلمي والنشر الدولي
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          إدارة الأبحاث العلمية وبراءات الابتكار
        </h1>
        <p className="text-slate-400 mt-2 text-base max-w-2xl leading-relaxed">
          تحكم بسجل الأبحاث المنشورة لدكتورة صالحة جابر، أضف أبحاثاً جديدة وروابط المعرف الرقمي (DOI) والمجلات المفهرسة، والتي تظهر فورياً في صفحة وقسم الأبحاث.
        </p>
      </div>

      <ResearchPapersClient initialPapers={papers} />
    </div>
  );
}
