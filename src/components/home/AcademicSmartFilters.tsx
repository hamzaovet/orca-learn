"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, School, Search, Filter, BookOpen, Dna, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";

// Curated high school biology modules & courses
const SECONDARY_MODULES = [
  {
    id: "sec-dna",
    grade: "الصف الثالث الثانوي (علمي علوم)",
    gradeKey: "grade3",
    country: "مصر - الثانوية العامة",
    countryKey: "egypt",
    title: "البيولوجيا الجزيئية: الحمض النووي DNA & RNA وتخليق البروتين",
    description: "شرح تفصيلي مع نماذج ثلاثية الأبعاد لآليات تضاعف الـ DNA، الطفرات الجينية، وتخليق البروتين والهندسة الوراثية مع حل بنك أسئلة الوزارة.",
    lessonsCount: 16,
    hours: "22 ساعة",
    badge: "الأكثر طلباً للثانوية",
  },
  {
    id: "sec-immuno",
    grade: "الصف الثالث الثانوي (علمي علوم)",
    gradeKey: "grade3",
    country: "مصر - الثانوية العامة",
    countryKey: "egypt",
    title: "المناعة في الكائنات الحية (النبات والإنسان)",
    description: "فهم عميق لخطوط الدفاع المناعية، الخلايا الليمفاوية، الأجسام المضادة، والمناعة الخلطية والخلوية بأسلوب الربط الطبي الحديث.",
    lessonsCount: 12,
    hours: "18 ساعة",
    badge: "علمي علوم",
  },
  {
    id: "sec-repro",
    grade: "الصف الثالث الثانوي (علمي علوم)",
    gradeKey: "grade3",
    country: "مصر - الثانوية العامة",
    countryKey: "egypt",
    title: "التكاثر في الكائنات الحية ودورة الطمث والإخصاب",
    description: "شرح شامل لدورات حياة الكائنات الحية، التكاثر في النباتات الزهرية، والتكاثر في الإنسان مع استعراض كامل للرسوم والقطاعات المعملية.",
    lessonsCount: 14,
    hours: "20 ساعة",
    badge: "شامل الرسوم والنماذج",
  },
  {
    id: "sec-support",
    grade: "الصف الثالث الثانوي (علمي علوم)",
    gradeKey: "grade3",
    country: "مصر - الثانوية العامة",
    countryKey: "egypt",
    title: "الدعامة والحركة والتنسيق الهرموني",
    description: "شرح الهيكل العظمي، العضلات وآلية الانقباض العضلي، والغدد الصماء والهرمونات وتأثيراتها الفسيولوجية مع تدريبات مكثفة على البابل شيت.",
    lessonsCount: 15,
    hours: "24 ساعة",
    badge: "تأسيس وامتحانات",
  },
  {
    id: "sec-grade2",
    grade: "الصف الثاني الثانوي",
    gradeKey: "grade2",
    country: "مصر - الثانوية العامة",
    countryKey: "egypt",
    title: "التغذية الذاتية، النقل، والتنفس الخلوي في الكائنات الحية",
    description: "تأسيس فسيولوجي عميق لعملية البناء الضوئي، الجهاز الدوري، ودورة كريبس وسلسلة نقل الإلكترون بأبسط الطرق الممكنة.",
    lessonsCount: 18,
    hours: "25 ساعة",
    badge: "تأسيس للثانوية العامة",
  },
  {
    id: "sec-grade1",
    grade: "الصف الأول الثانوي",
    gradeKey: "grade1",
    country: "مصر - الثانوية العامة",
    countryKey: "egypt",
    title: "التركيب الكيميائي للخلية والوراثة والكروموسومات",
    description: "الجزيئات البيولوجية الكبيرة (الكربوهيدرات والليبيدات والبروتينات)، النظرية الخلوية، وقوانين مندل وتوارث الصفات.",
    lessonsCount: 14,
    hours: "20 ساعة",
    badge: "المدخل للبيولوجيا",
  },
  {
    id: "sec-ksa-tracks",
    grade: "المرحلة الثانوية (المسار التخصصي)",
    gradeKey: "grade3",
    country: "السعودية - نظام المسارات",
    countryKey: "ksa",
    title: "أحياء 2-1 و 3: أجهزة الدوران، المناعة، وعلم الوراثة الجزيئية",
    description: "مقرر شامل ومطابق لمنهج وزارة التعليم السعودية والتحضير لاختبار التحصيلي بمادة الأحياء.",
    lessonsCount: 15,
    hours: "20 ساعة",
    badge: "تحضير التحصيلي",
  },
];

export default function AcademicSmartFilters({ countries }: { countries: any[] }) {
  // Stage tab: 'secondary' | 'university'
  const [activeStage, setActiveStage] = useState<"secondary" | "university">("secondary");

  // Secondary Filters
  const [selectedCountryKey, setSelectedCountryKey] = useState("all");
  const [selectedGradeKey, setSelectedGradeKey] = useState("all");

  // University Filters
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const selectedCountry = countries.find(c => c.id === selectedCountryId);
  const universities = selectedCountry?.universities || [];
  const selectedUniversity = universities.find((u: any) => u.id === selectedUniversityId);
  const departments = selectedUniversity?.departments || [];
  const selectedDepartment = departments.find((d: any) => d.id === selectedDepartmentId);
  const coursesToDisplay = selectedDepartment ? selectedDepartment.courses : [];

  // Filtered secondary modules
  const filteredSecondary = SECONDARY_MODULES.filter(m => {
    if (selectedCountryKey !== "all" && m.countryKey !== selectedCountryKey) return false;
    if (selectedGradeKey !== "all" && m.gradeKey !== selectedGradeKey) return false;
    return true;
  });

  return (
    <section className="py-24 bg-[#050B14] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] mb-4 border border-[var(--theme-border)] shadow-[0_0_25px_var(--theme-glow)]">
            <GraduationCap className="w-7 h-7" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-3">
            المسارات التعليمية والأكاديمية
          </h2>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            سواء كنت طالباً في <span className="text-[var(--theme-primary)] font-bold">المرحلة الثانوية</span> تستعد لأعلى الدرجات، أو في <span className="text-[var(--theme-primary)] font-bold">المرحلة الجامعية</span> تبحث عن التميز، اختر مسارك التعليمي للوصول المباشر للشروحات المطابقة لمنهجك.
          </p>
        </div>

        {/* ── Segmented Stage Switcher ── */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveStage("secondary")}
              className={`flex items-center gap-2.5 px-6 md:px-8 py-3.5 rounded-xl text-sm md:text-base font-black transition-all duration-300 ${
                activeStage === "secondary"
                  ? "btn-theme-primary text-white shadow-lg scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <School className="w-5 h-5" />
              <span>المرحلة الثانوية (علمي علوم)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStage("university")}
              className={`flex items-center gap-2.5 px-6 md:px-8 py-3.5 rounded-xl text-sm md:text-base font-black transition-all duration-300 ${
                activeStage === "university"
                  ? "btn-theme-primary text-white shadow-lg scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>المرحلة الجامعية والدراسات العليا</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            STAGE 1: المرحلة الثانوية (High School)
        ══════════════════════════════════════════════════════════ */}
        {activeStage === "secondary" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Filter Bar */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--theme-primary)]">
                  <Filter className="w-4 h-4" />
                  <span>تصفية مناهج الأحياء والعلوم الحيوية للمرحلة الثانوية:</span>
                </div>
                <span className="text-xs text-slate-400 font-bold hidden sm:inline">
                  متاح لجميع الأنظمة التعليمية
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Filter 1: Country / System */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">الدولة والمنهج الوزاري:</label>
                  <select
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors cursor-pointer"
                    value={selectedCountryKey}
                    onChange={(e) => setSelectedCountryKey(e.target.value)}
                  >
                    <option value="all">جميع المناهج والدول</option>
                    <option value="egypt">مصر — الثانوية العامة والأزهرية</option>
                    <option value="ksa">السعودية — نظام المسارات والتحصيلي</option>
                  </select>
                </div>

                {/* Filter 2: Grade Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">الصف الدراسي:</label>
                  <select
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors cursor-pointer"
                    value={selectedGradeKey}
                    onChange={(e) => setSelectedGradeKey(e.target.value)}
                  >
                    <option value="all">جميع الصفوف الثانوية</option>
                    <option value="grade3">الصف الثالث الثانوي (علمي علوم)</option>
                    <option value="grade2">الصف الثاني الثانوي</option>
                    <option value="grade1">الصف الأول الثانوي</option>
                  </select>
                </div>
              </div>
            </div>

            {/* High School Course Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSecondary.map((mod) => (
                <div
                  key={mod.id}
                  className="glass-panel group relative rounded-3xl p-6 border border-white/10 hover:border-[var(--theme-primary)]/50 transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_var(--theme-glow)]"
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                        {mod.country}
                      </span>
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)]">
                        {mod.badge}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      {mod.grade}
                    </span>

                    <h3 className="text-xl font-black text-white group-hover:text-[var(--theme-badge-text)] transition-colors leading-snug mb-3">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      {mod.description}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-bold flex items-center gap-3">
                      <span>{mod.lessonsCount} درس تفاعلي</span>
                      <span>•</span>
                      <span>{mod.hours}</span>
                    </div>

                    <Link
                      href="/courses"
                      className="btn-theme-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
                    >
                      <span>عرض المحتوى</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            STAGE 2: المرحلة الجامعية (University)
        ══════════════════════════════════════════════════════════ */}
        {activeStage === "university" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Smart University Filters */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative z-20">
              <div className="flex items-center gap-3 text-[var(--theme-primary)] mb-6 font-bold">
                <Filter className="w-5 h-5" />
                <span>البحث الأكاديمي الجامعي (الدولة • الجامعة • الكلية / القسم)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <select 
                  className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors appearance-none cursor-pointer"
                  value={selectedCountryId}
                  onChange={(e) => {
                    setSelectedCountryId(e.target.value);
                    setSelectedUniversityId("");
                    setSelectedDepartmentId("");
                  }}
                >
                  <option value="">1. اختر الدولة</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select 
                  className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  value={selectedUniversityId}
                  onChange={(e) => {
                    setSelectedUniversityId(e.target.value);
                    setSelectedDepartmentId("");
                  }}
                  disabled={!selectedCountryId}
                >
                  <option value="">2. اختر الجامعة</option>
                  {universities.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>

                <select 
                  className="bg-[#111827] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  disabled={!selectedUniversityId}
                >
                  <option value="">3. اختر الكلية / القسم</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            {/* Results Area */}
            <div className="min-h-[300px]">
              {!selectedDepartmentId ? (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white/5 border border-white/5 rounded-3xl border-dashed">
                  <Search className="w-14 h-14 text-slate-600 mb-3 opacity-50" />
                  <p className="text-lg font-bold text-slate-400">اختر الدولة والجامعة والقسم لعرض المقررات الجامعية المطابقة</p>
                  <p className="text-xs text-slate-500 mt-1">كليات العلوم، الطب البشري، الصيدلة، الزراعة، وطب الأسنان</p>
                </div>
              ) : coursesToDisplay.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                  <BookOpen className="w-12 h-12 text-[var(--theme-primary)] mb-3 opacity-50" />
                  <p className="text-xl font-bold text-white mb-1">المقررات قيد الإعداد لهذا القسم</p>
                  <p className="text-xs text-slate-400">يتم حالياً مواءمة محتوى المحاضرات والسكاشن العملية وفق لائحة كليتك.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  {coursesToDisplay.map((course: any) => (
                    <div key={course.id} className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_20px_50px_var(--theme-glow)] hover:-translate-y-2 flex flex-col justify-between">
                      <div>
                        <div className="mb-4">
                          <span className="bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] text-xs font-bold px-3 py-1 rounded-full border border-[var(--theme-border)]">
                            {selectedDepartment?.name}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 leading-relaxed">{course.title}</h3>
                        <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                          {course.description || "شرح شامل ومفصل للمقرر يغطي جميع الجوانب النظرية والعملية بطريقة أكاديمية مبسطة."}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                        <span className="text-xl font-black text-[var(--theme-primary)]">
                          {course.priceLocal} <span className="text-sm text-slate-400">{selectedCountry?.currencyCode}</span>
                        </span>
                        <Link 
                          href={`/courses/${course.id}`}
                          className="btn-theme-primary px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                        >
                          متابعة التفاصيل
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
