import Navbar from "@/components/Navbar";
import StudentReviewsSection from "@/components/home/StudentReviewsSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "آراء الطلاب وقصص النجاح | د. صالحة جابر دسوقي",
  description: "شهادات وتجارب طلاب المرحلة الثانوية، طلاب الجامعات، وباحثي الدراسات العليا مع د. صالحة جابر.",
};

export default async function ReviewsPage() {
  const dbReviews = await prisma.studentReview.findMany({
    where: { isApproved: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-[#050B14]">
        <StudentReviewsSection reviews={dbReviews} />
      </main>
      <Footer />
    </>
  );
}
