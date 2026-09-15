"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { 
  FileQuestion, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Award, 
  Sparkles,
  RotateCcw,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { submitQuizAnswers } from "@/actions/quizzes";

interface QuizTakeClientProps {
  quiz: any;
  courseId: string;
  studentName: string;
}

export default function QuizTakeClient({
  quiz,
  courseId,
  studentName,
}: QuizTakeClientProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(quiz.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Timer Countdown
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeftSeconds <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    // Check if unanswered
    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;

    if (answeredCount < totalQuestions) {
      if (!confirm(`لقد أجبت على ${answeredCount} من ${totalQuestions} أسئلة فقط. هل أنت متأكد من تسليم الاختبار؟`)) {
        return;
      }
    }

    startTransition(async () => {
      const res = await submitQuizAnswers(quiz.id, selectedAnswers);
      if (res.success) {
        setIsSubmitted(true);
        setResult(res);
        if (res.passed) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error(res.error || "حدث خطأ أثناء تسليم الاختبار");
      }
    });
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setTimeLeftSeconds(quiz.durationMinutes * 60);
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 py-24 px-4 md:px-8 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1525] border border-white/10 p-5 rounded-3xl shadow-xl">
          <div className="space-y-1">
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors font-bold mb-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لشرح المقرر</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-white">{quiz.title}</h1>
            <p className="text-xs text-slate-400">
              الطالب: <strong className="text-cyan-400">{studentName}</strong> • نسبة النجاح: {quiz.passingScore}%
            </p>
          </div>

          {/* Countdown Clock */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0 w-fit">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 font-bold">الوقت المتبقي:</span>
              <span className={`font-mono font-black text-sm ${timeLeftSeconds < 180 ? "text-rose-400 animate-pulse" : "text-white"}`}>
                {formatTime(timeLeftSeconds)}
              </span>
            </div>
          )}
        </div>

        {/* Result Screen (If Submitted) */}
        {isSubmitted && result && (
          <div className="bg-[#0D1525] border border-white/15 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-xl">
              {result.passed ? (
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-rose-500/15 border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                result.passed
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/15 border border-rose-500/30 text-rose-300"
              }`}>
                {result.passed ? "اجتياز ناجح ومتميز ✓" : "لم يتم الاجتياز هذه المرة ✕"}
              </span>

              <div className="text-4xl md:text-5xl font-black text-white font-mono">
                {result.score}%
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {result.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة لتحسين الدرجة</span>
              </button>

              <Link
                href={`/dashboard/courses/${courseId}`}
                className="btn-theme-primary px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-lg"
              >
                <span>متابعة دروس المقرر ↗</span>
              </Link>
            </div>
          </div>
        )}

        {/* Questions Form or Review */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(isSubmitted && result ? result.questionsReview : quiz.questions).map((q: any, qIndex: number) => {
            const isReview = isSubmitted && result;

            return (
              <div
                key={q.id || q.questionId}
                className={`bg-[#0D1525] border rounded-3xl p-6 md:p-8 space-y-5 transition-all shadow-lg ${
                  isReview
                    ? q.isCorrect
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : "border-rose-500/40 bg-rose-950/10"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-xl">
                    السؤال {qIndex + 1}
                  </span>

                  {isReview && (
                    <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full ${
                      q.isCorrect
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{q.isCorrect ? "إجابة صحيحة ✓" : "إجابة خاطئة"}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-white leading-relaxed">
                  {q.questionText}
                </h3>

                {/* Optional Image */}
                {q.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 max-h-80 flex items-center justify-center bg-black/40 p-2">
                    <img
                      src={q.imageUrl}
                      alt="مخطط السؤال"
                      className="max-h-72 object-contain rounded-xl"
                    />
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {q.options.map((opt: any) => {
                    const isSelected = selectedAnswers[q.id || q.questionId] === opt.id;
                    const isCorrectOpt = opt.isCorrect;

                    let optionBorderClass = "border-white/10 bg-white/5 hover:border-cyan-500/40";
                    if (isReview) {
                      if (isCorrectOpt) {
                        optionBorderClass = "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold";
                      } else if (isSelected && !isCorrectOpt) {
                        optionBorderClass = "border-rose-500 bg-rose-500/20 text-rose-200";
                      } else {
                        optionBorderClass = "border-white/5 opacity-50";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "border-cyan-500 bg-cyan-500/15 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]";
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id || q.questionId, opt.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm ${optionBorderClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-cyan-400 bg-cyan-500 text-slate-950"
                              : "border-white/20"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950"></div>}
                          </div>
                          <span>{opt.text || opt.optionText}</span>
                        </div>

                        {isReview && isCorrectOpt && (
                          <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                            الإجابة النموذجية ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Scientific Explanation in Review */}
                {isReview && q.explanation && (
                  <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-4 text-xs space-y-1">
                    <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>التفسير العلمي للأستاذة الدكتورة صالحة جابر:</span>
                    </p>
                    <p className="text-slate-300 leading-relaxed mr-5">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Action */}
          {!isSubmitted && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="btn-theme-primary w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>{isPending ? "جاري التصحيح وحساب النتيجة..." : "تسليم الاختبار واعتماد النتيجة ✓"}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
