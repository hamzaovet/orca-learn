"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle, GraduationCap, School, Award } from "lucide-react";

interface Review {
  id: string;
  name: string;
  stage: "secondary" | "university" | "postgrad";
  stageLabel: string;
  affiliation: string;
  rating: number;
  date: string;
  review: string;
  subject: string;
}

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "أحمد حسام الشربيني",
    stage: "secondary",
    stageLabel: "ثانوية عامة (علمي علوم)",
    affiliation: "المركز الرابع على المحافظة - 2024",
    rating: 5,
    date: "دفعة 2024",
    subject: "مادة الأحياء (DNA والمناعة والتكاثر)",
    review: "شرح دكتورة صالحة لفصل البيولوجيا الجزيئية والـ DNA نقل مستواي لمرحلة ثانية تماماً! الطريقة اللي بتربط بيها بين تركيب الخلية والتطبيقات الواقعية خلتني أحل أصعب أفكار امتحانات الثانوية العامة بدون تردد. قفلت الأحياء بفضل الله ثم فضل تبسيطها العبقري.",
  },
  {
    id: "r2",
    name: "مريم عبد الرحمن القاضي",
    stage: "secondary",
    stageLabel: "ثانوية عامة (علمي علوم)",
    affiliation: "طالبة طب بشري حالياً",
    rating: 5,
    date: "دفعة 2024",
    subject: "مراجعات ليلة الامتحان والنماذج الوزارية",
    review: "أهم ما يميز الدكتورة صالحة هو أنها أستاذة جامعية متمكنة تشرح منهج الثانوية بأسلوب تربوي سلس جداً. أسئلة الفهم والربط اللي كانت بتدربنا عليها هي نفسها اللي لقيناها في الامتحان بنظام البابل شيت الحديث.",
  },
  {
    id: "r3",
    name: "عمر خالد المنصوري",
    stage: "university",
    stageLabel: "المرحلة الجامعية",
    affiliation: "كلية العلوم - قسم الميكروبيولوجي",
    rating: 5,
    date: "الفصل الدراسي الثاني",
    subject: "مقرر الميكروبيولوجيا العامة والفسيولوجيا",
    review: "مقررات علم البكتيريا والأيض الميكروبي كانت دائماً تبدو معقدة في الكتب الأجنبية، لكن أسلوب دكتورة صالحة في توضيح المسارات البيوكيميائية وتجارب المعمل جعل المادة ممتعة وحصلت على تقدير امتياز في الكلية.",
  },
  {
    id: "r4",
    name: "نوران إبراهيم النجار",
    stage: "university",
    stageLabel: "المرحلة الجامعية",
    affiliation: "كلية الصيدلة - الفرقة الثالثة",
    rating: 5,
    date: "2024",
    subject: "الميكروبيولوجيا الطبية والمناعة",
    review: "كورس المناعة والبكتيريا الطبية ساعدني جداً في مواد الفارما والمضادات الحيوية. دكتورة صالحة بتشرح آليات مقاومة البكتيريا وتصنيف السلالات بمنتهى الاحترافية والعمق.",
  },
  {
    id: "r5",
    name: "د. إسلام سعد الدين رضوان",
    stage: "postgrad",
    stageLabel: "دراسات عليا وبحث علمي",
    affiliation: "باحث ماجستير في التقنية الحيوية",
    rating: 5,
    date: "2023 - 2025",
    subject: "تقنيات PCR وتطبيقات الشفاء الذاتي للخرسانة",
    review: "الإشراف العلمي والبحثي مع الدكتورة صالحة كان نقطة التحول في مسيرتي العلمية. دقتها في مراجعة النتائج المعملية وتصميم التجارب ساعدتنا في نشر بحث دولي في دوريات Springer المرموقة.",
  },
  {
    id: "r6",
    name: "سارة محمد العتيبي",
    stage: "secondary",
    stageLabel: "نظام المسارات (المرحلة الثانوية)",
    affiliation: "المملكة العربية السعودية",
    rating: 5,
    date: "2024",
    subject: "علم البيئة والأحياء المتقدمة",
    review: "المنصة أتاحت لي متابعة شروحات الأحياء والبيئة بأسلوب ممتع جداً ورسوم توضيحية غاية في الدقة. أنصح كل طالب يريد الفهم الحقيقي وليس مجرد حفظ الإجابات بمتابعة دكتورة صالحة.",
  },
];

export default function StudentReviewsSection({ reviews: initialReviews }: { reviews?: any[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const allReviews = initialReviews && initialReviews.length > 0 ? initialReviews : REVIEWS;

  const filteredReviews = activeTab === "all"
    ? allReviews
    : allReviews.filter((r) => r.stage === activeTab);

  return (
    <section id="reviews" className="py-24 bg-[#050B14] relative overflow-hidden scroll-mt-20">
      {/* Dynamic Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none opacity-10"
        style={{ background: "var(--theme-glow)" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] text-xs font-black border border-[var(--theme-border)] uppercase tracking-wider mb-4 shadow-[0_0_20px_var(--theme-glow)]">
            <MessageSquare className="w-4 h-4 text-[var(--theme-primary)]" />
            <span>قصص نجاح وتفوق</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            ماذا يقول طلابنا وباحثونا عن <span className="text-gradient">د. صالحة جابر؟</span>
          </h2>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            شهادات حقيقية من طلاب المرحلة الثانوية، كليات العلوم والطب والصيدلة، وباحثي الماجستير والدكتوراه بعد خوض تجربة التعلم والتفوق الأكاديمي.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { id: "all", label: "جميع الآراء", icon: Award },
            { id: "secondary", label: "طلاب المرحلة الثانوية (علمي علوم)", icon: School },
            { id: "university", label: "طلاب الجامعات (علوم، طب، صيدلة)", icon: GraduationCap },
            { id: "postgrad", label: "باحثو الماجستير والدكتوراه", icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "btn-theme-primary text-white shadow-lg scale-105"
                    : "bg-slate-900/60 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-[var(--theme-primary)]/50 transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_var(--theme-glow)]"
            >
              <div>
                {/* Header: Stars & Stage Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)]">
                    {item.stageLabel}
                  </span>
                </div>

                {/* Subject tag */}
                <p className="text-xs font-bold text-[var(--theme-badge-text)] mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
                  {item.subject}
                </p>

                {/* Review Text */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{item.review}"
                </p>
              </div>

              {/* Author footer */}
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--theme-primary)] to-[var(--theme-secondary)] flex items-center justify-center font-black text-slate-950 text-sm shadow-md shrink-0">
                  {item.name.slice(0, 1)}
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.affiliation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
