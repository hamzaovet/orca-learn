import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { CreateChapterForm } from "@/components/admin/CreateChapterForm";
import { CreateLessonForm } from "@/components/admin/CreateLessonForm";
import { DeleteChapterButton, DeleteLessonButton } from "@/components/admin/CurriculumActions";
import Link from "next/link";
import { ArrowRight, PlayCircle, FileText, Sparkles, ExternalLink, School, GraduationCap, Crown, Eye } from "lucide-react";

export default async function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      university: { include: { country: true } },
      department: true,
      secondaryGrade: true,
      chapters: { 
        include: { 
          lessons: { orderBy: { createdAt: "asc" } } 
        }, 
        orderBy: { order: "asc" } 
      },
    },
  });

  if (!course) {
    notFound();
  }

  const isSecondary = course.stage === "SECONDARY" || !!course.secondaryGradeId;
  const isVIP = course.isMaestroAcademy || course.stage === "VIP";

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/courses" 
          className="flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-[var(--theme-primary)]"
        >
          <ArrowRight className="h-4 w-4" />
          العودة لإدارة الكورسات
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isVIP ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> أكاديمية التميز (VIP)
                </span>
              ) : isSecondary ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <School className="w-3 h-3" /> المرحلة الثانوية
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> المرحلة الجامعية
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-slate-50">{course.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${course.id}`}
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>معاينة كما يراها الطالب</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>
            <PublishToggle courseId={course.id} isPublished={course.isPublished} />
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Curriculum) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Helpful Explanation Callout */}
          <div className="p-5 rounded-3xl bg-[var(--theme-badge-bg)] border border-[var(--theme-border)] text-xs leading-relaxed flex items-start gap-3 shadow-lg">
            <Sparkles className="w-5 h-5 text-[var(--theme-primary)] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <strong className="text-white text-sm font-bold block">دليل إدارة المحتوى وحصص المعاينة المجانية:</strong>
              <p className="text-slate-300">
                • <strong>الحصة الأولى (معاينة مجانية):</strong> عند تفعيل خيار <span className="text-emerald-400 font-bold">"متاح مجاناً للمعاينة"</span>، سيتمكن أي طالب زائر من مشاهدة فيديو هذه الحصة مجاناً للتعرف على المحتوى وأسلوب الشرح.
              </p>
              <p className="text-slate-300">
                • <strong>الحصص التالية والمذكرات:</strong> تظل مقفولة 🔒 تلقائياً ولا تفتح إلا للطالب الذي أتم الاشتراك والدفع، حيث يفتح له مشغل الكورس المتكامل وروابط تحميل المذكرات والـ PDF.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col gap-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">المنهج الدراسي والفصول</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {course.chapters.length} فصول • {course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)} حصة ومحاضرة
                </p>
              </div>
              <CreateChapterForm courseId={course.id} />
            </div>

            {course.chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-center">
                <p className="text-slate-300 font-bold text-base">لم يتم إضافة فصول دراسية بعد</p>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  اضغط على زر "إضافة فصل جديد" بالأعلى لتقسيم الكورس إلى وحدات أو فصول، ثم أضف الحصص وروابط الفيديو والمذكرات.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {course.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] text-xs font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-slate-100 text-base">{chapter.title}</h3>
                        <span className="text-xs text-slate-500 mr-2 font-mono">
                          ({chapter.lessons.length} حصص)
                        </span>
                      </div>
                      <DeleteChapterButton chapterId={chapter.id} chapterTitle={chapter.title} courseId={course.id} />
                    </div>

                    {/* Lessons list */}
                    <div className="space-y-2">
                      {chapter.lessons.length === 0 ? (
                        <p className="text-xs text-slate-500 py-3 text-center">لا توجد حصص في هذا الفصل بعد — أضف الحصة الأولى أدناه</p>
                      ) : (
                        chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between bg-black/40 px-4 py-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-4 h-4 text-[var(--theme-primary)] shrink-0"/>
                              <div>
                                <span className="text-sm font-medium text-slate-200 block">{lesson.title}</span>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                                  {lesson.videoUrl && (
                                    <span className="text-cyan-400 flex items-center gap-1 font-mono text-[10px]">
                                      فيديو مسجل ✓
                                    </span>
                                  )}
                                  {lesson.attachmentUrl && (
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      مذكرة مرفقة PDF ✓
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {lesson.isFree ? (
                                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                                  معاينة مجانية
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-slate-800/60 text-slate-400 text-xs font-bold rounded-lg border border-white/5">
                                  🔒 للمشتركين فقط
                                </span>
                              )}
                              <DeleteLessonButton lessonId={lesson.id} lessonTitle={lesson.title} courseId={course.id} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Lesson Form */}
                    <CreateLessonForm chapterId={chapter.id} courseId={course.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Course Info) */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-5 border border-white/10">
            <h2 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-3">تفاصيل الكورس</h2>
            
            {isVIP ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">المسار الأكاديمي</span>
                <span className="text-sm font-bold text-amber-400">أكاديمية التميز (VIP)</span>
              </div>
            ) : isSecondary ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">الصف الدراسي / المنهج</span>
                <span className="text-sm font-bold text-emerald-400">
                  {course.secondaryGrade?.name || "منهج ثانوي عام"}
                </span>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">الجامعة</span>
                  <span className="text-sm font-medium text-slate-200">
                    {course.university?.name || "غير محدد"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">القسم / الكلية</span>
                  <span className="text-sm font-medium text-slate-200">
                    {course.department?.name || "غير محدد"}
                  </span>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">السعر بالعملة المحلية</span>
              <span className="text-base font-black text-cyan-300 font-mono">
                {course.priceLocal} {course.university?.country?.currencyCode || "EGP"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">السعر العالمي (USD)</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                ${course.priceUSD} USD
              </span>
            </div>

            {course.description && (
              <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                <span className="text-xs text-slate-500">الوصف</span>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">{course.description}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

