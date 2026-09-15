"use client";

import { useState } from "react";
import { PlayCircle, FileText, ChevronDown, ChevronUp, FileQuestion, ArrowRight } from "lucide-react";
import Link from "next/link";
import AntiPiracyWatermark from "./AntiPiracyWatermark";

export default function CoursePlayer({ 
  course, 
  student 
}: { 
  course: any; 
  student?: {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}) {
  // Find first lesson to set as default
  let initialLesson = null;
  if (course.chapters.length > 0 && course.chapters[0].lessons.length > 0) {
    initialLesson = course.chapters[0].lessons[0];
  }

  const [activeLesson, setActiveLesson] = useState<any>(initialLesson);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(
    course.chapters.reduce((acc: any, chapter: any, idx: number) => {
      acc[chapter.id] = idx === 0; // Open first chapter by default
      return acc;
    }, {})
  );

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const getEmbedUrl = (url: string | null) => {
    if (!url) return '';
    try {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen pt-20">
      {/* Left Column - Main Content (approx 70%) */}
      <div className="w-full lg:w-[70%] flex flex-col border-r border-white/5 bg-[#0A101C] overflow-y-auto custom-scrollbar">
        {/* Header / Back Link */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0B1221]">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--theme-primary)] transition-colors text-sm font-medium">
            <ArrowRight className="w-4 h-4"/> العودة للوحة التحكم
          </Link>
          <h2 className="text-white font-bold truncate max-w-[300px] md:max-w-[500px]">{course.title}</h2>
        </div>

        {activeLesson ? (
          <div className="flex-1 flex flex-col">
            {/* Video Player */}
            <div 
              onContextMenu={(e) => e.preventDefault()}
              className="w-full aspect-video bg-black relative flex items-center justify-center border-b border-white/5 overflow-hidden select-none"
            >
              {activeLesson.videoUrl ? (
                <>
                  <iframe
                    key={activeLesson.id}
                    src={getEmbedUrl(activeLesson.videoUrl)}
                    className="w-full h-full aspect-video border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {student && <AntiPiracyWatermark student={student} />}
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-3 p-8 text-center">
                  <FileText className="w-12 h-12 text-[var(--theme-primary)] opacity-60" />
                  <p className="font-bold text-slate-200 text-base">درس نظري / مذكرة مرفقة</p>
                  <p className="text-xs text-slate-400 max-w-sm">هذا الدرس يعتمد على المذكرة العلمية والملف المرفق أدناه.</p>
                </div>
              )}
            </div>

            {/* Lesson Details & Attachments */}
            <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <h1 className="text-2xl md:text-3xl font-black text-white">{activeLesson.title}</h1>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold w-fit">
                  مشترك في الكورس ✓
                </span>
              </div>
              
              {activeLesson.attachmentUrl ? (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">المذكرة والمواد المرفقة للحصة</h4>
                      <p className="text-xs text-slate-400 mt-0.5">ملف PDF / ملخص الشرح متاح للتحميل والطباعة</p>
                    </div>
                  </div>
                  <a 
                    href={activeLesson.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-theme-primary px-6 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FileText className="w-4 h-4" />
                    <span>تحميل المذكرة (PDF)</span>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500">لا توجد ملفات مرفقة إضافية لهذا الدرس.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <PlayCircle className="w-16 h-16 opacity-20 mb-4" />
            <p>لا توجد دروس متاحة في هذا الكورس بعد.</p>
          </div>
        )}
      </div>

      {/* Right Column - Curriculum Sidebar (approx 30%) */}
      <div className="w-full lg:w-[30%] bg-[#050B14] flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#0B1221]">
          <h3 className="text-xl font-black text-white">المنهج الدراسي</h3>
          <p className="text-sm text-cyan-500 mt-1 font-bold">{course.chapters.length} فصول</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {course.chapters.map((chapter: any, index: number) => (
            <div key={chapter.id} className="bg-[#111827]/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-right"
              >
                <div>
                  <span className="text-xs text-slate-500 font-bold mb-1 block">الفصل {index + 1}</span>
                  <h4 className="text-white font-bold text-sm leading-relaxed">{chapter.title}</h4>
                </div>
                {openChapters[chapter.id] ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>

              {openChapters[chapter.id] && (
                <div className="bg-black/20 border-t border-white/5 py-2">
                  {chapter.lessons.length === 0 ? (
                    <p className="p-4 text-xs text-slate-500 text-center">لا توجد دروس</p>
                  ) : (
                    chapter.lessons.map((lesson: any) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-all border-r-2 ${
                            isActive 
                              ? "bg-cyan-500/10 border-cyan-500" 
                              : "border-transparent hover:bg-white/5"
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-400"}`}>
                            {lesson.videoUrl ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <span className={`text-sm ${isActive ? "text-cyan-400 font-bold" : "text-slate-300 hover:text-slate-100 transition-colors"}`}>
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Quizzes & Self-Assessment Section */}
          {course.quizzes && course.quizzes.length > 0 && (
            <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-black text-cyan-400 block px-1">
                الاختبارات والتقييم الذاتي 📝
              </span>
              {course.quizzes.map((quiz: any) => (
                <Link
                  key={quiz.id}
                  href={`/dashboard/courses/${course.id}/quiz/${quiz.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-500/50 text-xs font-bold text-white transition-all hover:bg-cyan-950/50 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileQuestion className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">{quiz.title}</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-lg shrink-0">
                    ابدأ ↗
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
