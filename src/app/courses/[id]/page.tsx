import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle, MonitorPlay, FileText } from 'lucide-react';
import { LessonPreviewRow } from '@/components/courses/LessonPreviewRow';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import CheckoutButton from "@/components/courses/CheckoutButton";

export default async function PublicCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      department: true,
      university: { include: { country: true } },
      chapters: {
        orderBy: { createdAt: 'asc' },
        include: { lessons: { orderBy: { createdAt: 'asc' } } }
      }
    }
  });

  if (!course) {
    return <div className="min-h-screen bg-[#06080F] flex items-center justify-center text-slate-400">Course not found</div>;
  }

  const currencyCode = course.university?.country?.currencyCode || 'SAR';
  const isFree = course.priceLocal === 0;

  let isEnrolled = false;
  let isPending = false;
  if (session?.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: (session.user as any).id,
          courseId: course.id,
        }
      }
    });
    isEnrolled = !!enrollment && enrollment.status === "ACTIVE";
    isPending = !!enrollment && enrollment.status === "PENDING";
  }

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
          <ArrowRight className="w-5 h-5"/> العودة لتصفح الكورسات
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col gap-4">
              <span className="w-fit px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
                {course.department?.name || 'عام'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white">{course.title}</h1>
              <p className="text-lg text-slate-400">{course.university?.name || 'كورس عام'}</p>
              {course.description && (
                <p className="text-slate-300 mt-2 leading-relaxed">{course.description}</p>
              )}
            </div>

            <div className="pt-8">
              <h2 className="text-2xl font-bold text-white mb-6">محتوى الكورس</h2>
              {course.chapters.length === 0 ? (
                <p className="text-slate-500">لم يتم إضافة فصول دراسية بعد.</p>
              ) : (
                <div className="space-y-4">
                  {course.chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
                      <h3 className="text-lg font-bold text-cyan-100 mb-4">{chapter.title}</h3>
                      <div className="flex flex-col">
                        {chapter.lessons.length === 0 ? (
                          <p className="text-sm text-slate-500">لا توجد دروس في هذا الفصل</p>
                        ) : (
                          chapter.lessons.map((lesson) => (
                            <LessonPreviewRow key={lesson.id} lesson={lesson} />
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar/Checkout Card) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#0B0F19] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col gap-2 mb-6 border-b border-white/10 pb-6">
                <span className="text-slate-400 text-sm">سعر الاشتراك</span>
                {isFree ? (
                  <span className="text-4xl font-black text-emerald-400">مجاناً</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-black text-white">{course.priceLocal} <span className="text-xl text-slate-400">{currencyCode}</span></span>
                    {course.priceUSD > 0 && currencyCode !== 'EGP' && (
                      <span className="text-sm text-slate-500 mt-1">يعادل {course.priceUSD} USD تقريباً</span>
                    )}
                  </div>
                )}
              </div>

              <CheckoutButton 
                courseId={course.id} 
                price={course.priceLocal} 
                userId={(session?.user as any)?.id} 
                isEnrolled={isEnrolled} 
                isPending={isPending}
              />

              <div className="mt-8 flex flex-col gap-4">
                <p className="text-sm font-bold text-slate-300">هذا الكورس يتضمن:</p>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <MonitorPlay className="w-4 h-4 text-cyan-400" />
                  <span>فيديوهات مسجلة عالية الجودة</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>مذكرات وملفات PDF مرفقة</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>وصول مدى الحياة للمحتوى</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
