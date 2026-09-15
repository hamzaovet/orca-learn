"use client";

import React, { useState, useTransition } from "react";
import { 
  FileQuestion, 
  Plus, 
  Trash2, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Image as ImageIcon,
  BookOpen,
  UserCheck,
  Search,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { confirmToast } from "@/lib/confirmToast";
import { createQuiz, deleteQuiz } from "@/actions/quizzes";
import { issueCertificate } from "@/actions/certificates";

interface QuizzesClientProps {
  quizzes: any[];
  courses: any[];
}

export default function QuizzesClient({ quizzes, courses }: QuizzesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewSubmissionsQuiz, setViewSubmissionsQuiz] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Quiz Form State
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [passingScore, setPassingScore] = useState(60);
  const [durationMinutes, setDurationMinutes] = useState(20);

  // Questions Builder State
  const [questions, setQuestions] = useState<Array<{
    questionText: string;
    imageUrl: string;
    explanation: string;
    points: number;
    options: Array<{ optionText: string; isCorrect: boolean }>;
  }>>([
    {
      questionText: "",
      imageUrl: "",
      explanation: "",
      points: 1,
      options: [
        { optionText: "", isCorrect: true },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ],
    },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        imageUrl: "",
        explanation: "",
        points: 1,
        options: [
          { optionText: "", isCorrect: true },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("يجب أن يحتوي الاختبار على سؤال واحد على الأقل");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].questionText = text;
      return copy;
    });
  };

  const updateQuestionImage = (index: number, url: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].imageUrl = url;
      return copy;
    });
  };

  const updateQuestionExplanation = (index: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].explanation = text;
      return copy;
    });
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options[optIndex].optionText = text;
      return copy;
    });
  };

  const setCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options = copy[qIndex].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIndex,
      }));
      return copy;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`يرجى كتابة نص السؤال رقم ${i + 1}`);
        return;
      }
      const filledOptions = q.options.filter((o) => o.optionText.trim());
      if (filledOptions.length < 2) {
        toast.error(`السؤال رقم ${i + 1} يتطلب خيارين على الأقل`);
        return;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        toast.error(`يرجى تحديد الإجابة الصحيحة للسؤال رقم ${i + 1}`);
        return;
      }
    }

    startTransition(async () => {
      const res = await createQuiz({
        title: quizTitle,
        description: quizDesc,
        courseId: selectedCourseId,
        passingScore,
        durationMinutes,
        questions: questions.map((q) => ({
          ...q,
          options: q.options.filter((o) => o.optionText.trim()),
        })),
      });

      if (res.success) {
        toast.success(res.message);
        setIsCreateModalOpen(false);
        setQuizTitle("");
        setQuizDesc("");
      } else {
        toast.error(res.error || "حدث خطأ");
      }
    });
  };

  const handleDeleteQuiz = (quizId: string, title: string) => {
    confirmToast({
      title: "حذف الاختبار نهائياً",
      message: `هل أنت متأكد من حذف اختبار "${title}" وسجلات إجابات الطلاب؟`,
      confirmText: "نعم، احذف الاختبار",
      onConfirm: () => {
        startTransition(async () => {
          const res = await deleteQuiz(quizId);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.error || "حدث خطأ");
          }
        });
      },
    });
  };

  const handleIssueCertificate = (userId: string, courseId: string, studentName: string) => {
    confirmToast({
      title: "إصدار شهادة إتمام رسمية",
      message: `هل تريد إصدار شهادة إتمام للدورة معتمدة برمز QR للطالب "${studentName}"؟`,
      confirmText: "نعم، أصدر الشهادة الآن",
      onConfirm: () => {
        startTransition(async () => {
          const res = await issueCertificate({ userId, courseId });
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.error || "حدث خطأ أثناء إصدار الشهادة");
          }
        });
      },
    });
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (!searchQuery.trim()) return true;
    const s = searchQuery.toLowerCase();
    return q.title.toLowerCase().includes(s) || q.course?.title?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black mb-3">
            <FileQuestion className="w-3.5 h-3.5 text-cyan-400" />
            <span>محرك التقييم الذاتي والاختبارات الأكاديمية</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            إدارة الاختبارات والواجبات 📝
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            بناء اختبارات الاختيار من متعدد مع الرسوم التوضيحية البيولوجية، والتصحيح الفوري، وإصدار شهادات الإتمام المعتمدة.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-theme-primary px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء اختبار جديد</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center justify-between gap-4 bg-[#08101E] border border-white/10 p-3.5 rounded-2xl">
        <div className="text-xs font-bold text-slate-300">
          إجمالي الاختبارات المجهزة: <span className="text-cyan-400 font-mono font-black">{quizzes.length}</span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم الاختبار أو الكورس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Quizzes List */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-[#0D1525] border border-white/10 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <FileQuestion className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لا توجد اختبارات مسجلة بعد</h3>
          <p className="text-slate-400 text-sm max-w-md">
            اضغط على زر "إنشاء اختبار جديد" بالأعلى لإضافة أول اختبار إلكتروني مصحح آلياً لطلابك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const submissionsCount = quiz.submissions?.length || 0;
            const passedCount = quiz.submissions?.filter((s: any) => s.passed).length || 0;

            return (
              <div
                key={quiz.id}
                className="bg-[#0D1525] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      {quiz.questions?.length || 0} أسئلة
                    </span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{quiz.durationMinutes} دقيقة</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white leading-snug">
                    {quiz.title}
                  </h3>

                  {quiz.course && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>الكورس:</span>
                      <span className="text-white font-bold">{quiz.course.title}</span>
                    </p>
                  )}

                  {quiz.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>
                  )}

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-xs flex justify-between items-center text-slate-300">
                    <span>نسبة النجاح المطلوبة:</span>
                    <span className="font-mono font-bold text-emerald-400">{quiz.passingScore}%</span>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewSubmissionsQuiz(quiz)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>النتائج ({submissionsCount})</span>
                  </button>

                  <button
                    onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                    title="حذف الاختبار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Create New Quiz ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B1323] border border-white/15 rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-black text-white">بناء اختبار إلكتروني جديد</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    عنوان الاختبار *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الاختبار الشامل في الوراثة الجزيئية"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    المقرر المرتبط به *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-[#0D1525] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      درجة النجاح (%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={passingScore}
                      onChange={(e) => setPassingScore(parseInt(e.target.value) || 60)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      المدة (بالدقائق)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 20)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>أسئلة الاختبار ({questions.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn-theme-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة سؤال جديد</span>
                  </button>
                </div>

                {questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-[#0D1525] border border-white/10 rounded-2xl p-5 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                        السؤال {qIndex + 1}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف هذا السؤال</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="اكتب نص السؤال هنا..."
                        value={q.questionText}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="url"
                          placeholder="رابط صورة توضيحية للسؤال (اختياري)"
                          value={q.imageUrl}
                          onChange={(e) => updateQuestionImage(qIndex, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="تفسير الإجابة الصحيحة للطلاب (اختياري)"
                          value={q.explanation}
                          onChange={(e) => updateQuestionExplanation(qIndex, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Options (Radio + Text) */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[11px] font-bold text-slate-400">
                        الخيارات (اختر الدائرة بجانب الإجابة الصحيحة):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                              opt.isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/50"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct-opt-${qIndex}`}
                              checked={opt.isCorrect}
                              onChange={() => setCorrectOption(qIndex, optIndex)}
                              className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                              title="تحديد كإجابة صحيحة"
                            />
                            <input
                              type="text"
                              placeholder={`الخيار ${optIndex + 1}`}
                              value={opt.optionText}
                              onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                              className="w-full bg-transparent border-none text-xs text-white focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-theme-primary px-8 py-3 rounded-xl font-black text-xs transition-all shadow-xl"
                >
                  {isPending ? "جاري الحفظ..." : "حفظ ونشر الاختبار الآن ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Submissions & Results ── */}
      {viewSubmissionsQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B1323] border border-white/15 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  سجل نتائج الطلاب: {viewSubmissionsQuiz.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  درجة النجاح المعتمدة: {viewSubmissionsQuiz.passingScore}%
                </p>
              </div>
              <button
                onClick={() => setViewSubmissionsQuiz(null)}
                className="text-slate-400 hover:text-white p-1 text-lg"
              >
                ✕
              </button>
            </div>

            {viewSubmissionsQuiz.submissions?.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                لم يقم أي طالب بأداء هذا الاختبار بعد.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">الطالب</th>
                      <th className="py-3 px-4">النتيجة</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4">تاريخ الأداء</th>
                      <th className="py-3 px-4 text-center">الشهادة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {viewSubmissionsQuiz.submissions.map((sub: any) => {
                      const date = new Date(sub.submittedAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={sub.id} className="hover:bg-white/5">
                          <td className="py-3.5 px-4 font-bold text-white">
                            {sub.user?.name || "طالب"}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-sm">
                            <span className={sub.passed ? "text-emerald-400" : "text-rose-400"}>
                              {sub.score}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.passed ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>ناجح ✓</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" />
                                <span>راسب ✕</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {date}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {sub.passed && (
                              <button
                                onClick={() =>
                                  handleIssueCertificate(
                                    sub.userId,
                                    viewSubmissionsQuiz.courseId,
                                    sub.user?.name || "طالب"
                                  )
                                }
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-[11px] font-black transition-all"
                                title="إصدار شهادة إتمام معتمدة"
                              >
                                <Award className="w-3.5 h-3.5 text-amber-400" />
                                <span>إصدار شهادة</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
