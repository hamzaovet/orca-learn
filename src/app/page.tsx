import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MaestroAcademySection from "@/components/home/MaestroAcademySection";
import AcademicSmartFilters from "@/components/home/AcademicSmartFilters";
import ResearchShowcaseSection from "@/components/home/ResearchShowcaseSection";
import StudentReviewsSection from "@/components/home/StudentReviewsSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Query 1: VIP Maestro Courses
  const vipCourses = await prisma.course.findMany({
    where: { isMaestroAcademy: true, isPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  // Query 2: Deeply Nested Academic Data Hierarchy
  const academicCountries = await prisma.country.findMany({
    include: {
      universities: {
        include: {
          departments: {
            include: {
              courses: {
                where: { isMaestroAcademy: false, isPublished: true },
                orderBy: { createdAt: 'desc' }
              }
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Query 3: Published Research Papers from DB
  const dbPapers = await prisma.researchPaper.findMany({
    where: { isPublished: true },
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });

  // Query 4: Approved Student Reviews from DB
  const dbReviews = await prisma.studentReview.findMany({
    where: { isApproved: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-[#050B14]">
        <HeroSection />
        
        {/* VIP Section explicitly rendered below Hero */}
        <MaestroAcademySection courses={vipCourses} />
        
        {/* Interactive Smart Filters Section (University & Secondary Tracks) */}
        <AcademicSmartFilters countries={academicCountries} />

        {/* Scientific Research & Publications Showcase */}
        <ResearchShowcaseSection papers={dbPapers} />

        {/* Student Success Stories & Reviews */}
        <StudentReviewsSection reviews={dbReviews} />
      </main>
      <Footer />
    </>
  );
}
