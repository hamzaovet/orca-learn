import Navbar from "@/components/Navbar";
import ResearchShowcaseSection from "@/components/home/ResearchShowcaseSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "الأبحاث العلمية والنشر الدولي | د. صالحة جابر دسوقي",
  description: "سجل الأبحاث العلمية وبراءات الابتكار في الميكروبيولوجيا والتكنولوجيا الحيوية والشفاء الذاتي للخرسانة بالبكتيريا.",
};

export default async function ResearchPage() {
  const dbPapers = await prisma.researchPaper.findMany({
    where: { isPublished: true },
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-[#050B14]">
        <ResearchShowcaseSection papers={dbPapers} />
      </main>
      <Footer />
    </>
  );
}
