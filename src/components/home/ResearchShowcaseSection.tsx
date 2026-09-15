"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Award, Sparkles, FileText, CheckCircle2, MessageCircle, Mail } from "lucide-react";

interface ResearchPaper {
  id: string;
  title: string;
  titleAr: string;
  journal: string;
  year: number;
  category: "concrete" | "marine" | "probiotics" | "biodegradation";
  categoryName: string;
  authors: string;
  abstractAr: string;
  impact: string;
  doi?: string;
}

const PAPERS: ResearchPaper[] = [
  {
    id: "p1",
    title: "Bacterial self-healing and mechanical strength enhancement in concrete: a comparative study of Bacillus subtilis, Bacillus sphaericus, and Escherichia coli",
    titleAr: "الشفاء الذاتي للخرسانة بالبكتيريا وتعزيز قوتها الميكانيكية: دراسة مقارنة",
    journal: "Innovative Infrastructure Solutions (Springer)",
    year: 2025,
    category: "concrete",
    categoryName: "بكتيريا الشفاء الذاتي",
    authors: "Sameh Yehia, Arafa M. A. Ibrahim, Doaa F. Ahmed, Salha G. Desouky",
    abstractAr: "بحث رائد يدرس استخدام سلالات بكتيريا معينة لمعالجة تشققات الخرسانة ذاتياً وترسيب كربونات الكالسيوم الحيوية لإطالة العمر الافتراضي للمنشآت.",
    impact: "نشر دولي مفهرس في Springer Nature (2025)",
    doi: "https://doi.org/10.1007/s41062-025-0509-x",
  },
  {
    id: "p2",
    title: "Effect of eggshell powder as fly ash replacement and nutrient source for bacteria on the properties and self-healing of geopolymer concrete",
    titleAr: "تأثير مسحوق قشر البيض كمصدر غذائي للبكتيريا في الشفاء الذاتي للخرسانة الجيوبوليمرية",
    journal: "Innovative Infrastructure Solutions (Springer)",
    year: 2025,
    category: "concrete",
    categoryName: "بكتيريا الشفاء الذاتي",
    authors: "Nour Bassim, Omar Mohamed, Ibrahim Saad, Abdullah M. Zeyad, Salha G. Desouky",
    abstractAr: "تطوير خرسانة خضراء مستدامة تعتمد على إعادة تدوير المخلفات الحيوية كمغذيات لبكتيريا الشفاء الذاتي، محققة وفراً اقتصادياً وحماية بيئية.",
    impact: "ابتكار بيئي تطبيقي في الخرسانة الحيوية المستدامة",
    doi: "https://doi.org/10.1007/s41062-025-0410-y",
  },
  {
    id: "p3",
    title: "The natural product biosynthetic potential of Red Sea nudibranch microbiomes",
    titleAr: "القدرة التخليقية للمنتجات الطبيعية لميكروبيوم كائنات البحر الأحمر",
    journal: "PeerJ (Life & Environment)",
    year: 2021,
    category: "marine",
    categoryName: "ميكروبيولوجيا البحر الأحمر",
    authors: "Samar M. Abdelrahman, Amro Hanora, Salha G. Desouky, Frank J. Stewart, Nicole B. Lopanik",
    abstractAr: "كشف التسلسل الجيني والميكروبي لكائنات البحر الأحمر لاستخلاص مركبات حيوية طبيعية ذات فاعلية مضادة للأورام السرطانية والميكروبات المقاومة للمضادات.",
    impact: "بحث دولي مشترك بالتعاون مع فرق بحثية أمريكية وأوروبية",
    doi: "https://doi.org/10.7717/peerj.11985",
  },
  {
    id: "p4",
    title: "Evaluate the Toxicity of Pyrethroid Insecticide Cypermethrin before and after Biodegradation by Lysinibacillus cresolivorans Strain HIS7",
    titleAr: "تقييم سُمية مبيد السايبرمثرين قبل وبعد التحلل الحيوي بواسطة بكتيريا Lysinibacillus",
    journal: "Plants (MDPI)",
    year: 2021,
    category: "biodegradation",
    categoryName: "معالجة التلوث الحيوي",
    authors: "Ebrahim Saied, Amr Fouda, Salha G. Desouky, Saad El-Din Hassan, et al.",
    abstractAr: "عزل وتوصيف سلالة بكتيرية قادرة على التكسير الحيوي للمبيدات الحشرية الخطرة وتحويلها إلى مركبات آمنة لحماية المياه الجوفية والتربة الزراعية.",
    impact: "نشر في MDPI بتصنيف Q1 في العلوم البيئية والنباتية",
    doi: "https://doi.org/10.3390/plants10101903",
  },
  {
    id: "p5",
    title: "Subsequent improvement of lactic acid production from beet molasses by Enterococcus hirae using different fermentation strategies",
    titleAr: "تحسين إنتاج حمض اللاكتيك من مولاس البنجر بواسطة بكتيريا التخمر Enterococcus hirae",
    journal: "Bioresource Technology Reports (Elsevier)",
    year: 2021,
    category: "probiotics",
    categoryName: "التخمير والميكروبيولوجيا الصناعية",
    authors: "Mohamed Ali Abdel-Rahman, Amr Fouda, Salha G. Desouky, Sadat Khattab",
    abstractAr: "استراتيجيات تخمير متطورة لإنتاج حمض اللاكتيك الحيوي عالي النقاوة من المخلفات الزراعية، واستخدامه في الصناعات الدوائية والبوليمرات الحيوية القابلة للتحلل.",
    impact: "أبحاث تطبيقية رائدة في التكنولوجيا الحيوية الصناعية",
    doi: "https://doi.org/10.1016/j.biteb.2020.100615",
  },
  {
    id: "p6",
    title: "Cholesterol reduction in vitro by Novel probiotic lactic acid bacteria strains isolated from healthy infants stool",
    titleAr: "خفض الكوليسترول معملياً بواسطة سلالات بروبيوتيك جديدة من بكتيريا حمض اللاكتيك",
    journal: "African Journal of Microbiology Research",
    year: 2017,
    category: "probiotics",
    categoryName: "البروبيوتيك والعلوم الطبية",
    authors: "Akram A. Aboseidah, Abdel-Hamied Rasmey, Magdy Osman, Salha G. Desouky, Nehal Kamal",
    abstractAr: "عزل سلالات بروبيوتيك نافعة ذات قدرة استثنائية على امتصاص وتكسير الكوليسترول الضار في الأمعاء لاستخدامها كمكملات علاجية وطبية آمنة.",
    impact: "دراسة سريرية ومعملية واعدة لصحة الجهاز الهضمي والقلب",
  },
];

export default function ResearchShowcaseSection({ papers: initialPapers }: { papers?: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const allPapers = initialPapers && initialPapers.length > 0 ? initialPapers : PAPERS;

  const filteredPapers = selectedCategory === "all"
    ? allPapers
    : allPapers.filter((p) => p.category === selectedCategory);

  return (
    <section id="research" className="py-24 bg-[#030712] relative overflow-hidden border-t border-white/5 scroll-mt-20">
      {/* Background glow */}
      <div 
        className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-15"
        style={{ background: "var(--theme-glow)" }}
      />
      <div 
        className="absolute bottom-10 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ background: "var(--theme-secondary)" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] text-xs font-black border border-[var(--theme-border)] uppercase tracking-wider mb-4 shadow-[0_0_20px_var(--theme-glow)]">
            <BookOpen className="w-4 h-4 text-[var(--theme-primary)]" />
            <span>الإنتاج العلمي والنشر الدولي</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            الأبحاث العلمية وبراءات <span className="text-gradient">الابتكار الحيوي</span>
          </h2>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            سجل بحثي حافل يضم أكثر من 20 بحثاً منشوراً في كبرى المجلات الدولية المفهرسة (Springer Nature, MDPI, Elsevier, PeerJ) بإشراف وإسهام د. صالحة جابر دسوقي.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: "all", label: "كافة الأبحاث العلمية" },
            { id: "concrete", label: "الشفاء الذاتي للخرسانة بالبكتيريا (2025)" },
            { id: "marine", label: "ميكروبيولوجيا البحر الأحمر" },
            { id: "probiotics", label: "البروبيوتيك واللاكتيك" },
            { id: "biodegradation", label: "معالجة التلوث الحيوي" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "btn-theme-primary text-white shadow-lg scale-105"
                  : "bg-slate-900/60 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Research Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <article
              key={paper.id}
              className="glass-panel group relative rounded-3xl p-6 border border-white/10 hover:border-[var(--theme-primary)]/50 transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_40px_var(--theme-glow)]"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {paper.categoryName}
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)]">
                    {paper.year}
                  </span>
                </div>

                {/* Paper title */}
                <h3 className="text-lg font-black text-white group-hover:text-[var(--theme-badge-text)] transition-colors leading-snug mb-2">
                  {paper.titleAr}
                </h3>

                <p className="text-xs text-slate-400 font-serif italic line-clamp-2 mb-3 leading-relaxed">
                  "{paper.title}"
                </p>

                {/* Journal & Authors */}
                <div className="space-y-1.5 text-xs text-slate-400 border-t border-white/5 pt-3 mb-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Award className="w-3.5 h-3.5 shrink-0 text-[var(--theme-primary)]" />
                    <span className="truncate">{paper.journal}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    الباحثون: {paper.authors}
                  </p>
                </div>

                {/* Abstract */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {paper.abstractAr}
                </p>
              </div>

              {/* Footer impact & DOI link */}
              <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                  <span className="truncate max-w-[180px]">{paper.impact}</span>
                </div>

                {paper.doi ? (
                  <a
                    href={paper.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-[var(--theme-primary)] hover:text-slate-950 text-[var(--theme-primary)] transition-all"
                    title="الاطلاع على البحث في دورية النشر"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="p-2 rounded-xl bg-white/5 text-slate-600">
                    <FileText className="w-4 h-4" />
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Stat Strip */}
        <div className="mt-16 glass-panel rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] flex items-center justify-center shrink-0 border border-[var(--theme-border)] shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">ترغب في الاستشهاد بأحد الأبحاث أو الإشراف العلمي؟</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                تواصل مباشر مع د. صالحة جابر للاستشارات والأبحاث في الميكروبيولوجيا والـ PCR ومشاريع التخرج.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct WhatsApp Button */}
            <a
              href="https://wa.me/201011358667?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%AF.%20%D8%B5%D8%A7%D9%84%D8%AD%D8%A9%D8%8C%20%D8%A3%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%D9%83%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%A7%D9%84%D8%A3%D8%A8%D8%AD%D8%A7%D8%AB%20%D9%88%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B9%D9%84%D9%85%D9%8A%D8%A9%20%D8%B9%D8%A8%D8%B1%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%A3%D9%88%D8%B1%D9%83%D8%A7%20%D9%84%D9%8A%D8%B1%D9%86"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 py-3 rounded-xl text-xs md:text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-105 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>واتساب: 01011358667</span>
            </a>

            {/* University Email Button */}
            <a
              href="mailto:Salha.Desouky@sci.suezuni.edu.eg"
              className="glass-panel hover:border-[var(--theme-primary)] text-slate-200 hover:text-white px-5 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all"
              title="مراسلة عبر الإيميل الجامعي الرسمي"
            >
              <Mail className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>الإيميل الجامعي</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
