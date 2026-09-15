"use client";

import { motion } from "framer-motion";
import { Dna, Award, Sparkles, Microscope, BookOpen, CheckCircle2 } from "lucide-react";

/* ─── Animation variants ─────────────────────────────────────────────────── */
const fadeRight: any = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeLeft: any = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 },
  },
};

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  delay,
  icon: Icon,
}: {
  value: string;
  label: string;
  delay: number;
  icon?: any;
}) {
  return (
    <motion.div
      variants={fadeLeft}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="glass-panel flex flex-col items-center rounded-2xl px-4 py-3.5 text-center border border-white/10 hover:border-[var(--theme-primary)] transition-all duration-300"
    >
      {Icon && <Icon className="w-4 h-4 mb-1 text-[var(--theme-primary)]" />}
      <span className="text-lg font-black text-gradient">{value}</span>
      <span className="mt-0.5 text-[11px] font-medium text-slate-400">{label}</span>
    </motion.div>
  );
}

export function HeroAnimatedContent() {
  return (
    <div className="relative z-10 mx-auto grid min-h-[65vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">

      {/* ══════════════════════════════════
          COLUMN 1 — RIGHT (Text & CTA)
      ══════════════════════════════════ */}
      <div className="flex flex-col items-start gap-7 text-right order-2 lg:order-1">

        {/* Glowing launch badge */}
        <motion.div
          id="hero-badge"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          custom={0}
          className="theme-badge inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-bold shadow-[0_0_20px_var(--theme-glow)]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-primary)] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)]" />
          </span>
          <Dna className="w-4 h-4 text-[var(--theme-primary)]" />
          بوابتك لإتقان الأحياء والميكروبيولوجيا — للمرحلة الثانوية والجامعية
        </motion.div>

        {/* Massive hook headline */}
        <motion.h1
          id="hero-headline"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          custom={0.12}
          className="text-4xl font-black leading-[1.2] tracking-tight text-slate-50 md:text-5xl lg:text-6xl xl:text-7xl"
        >
          تعلم{" "}
          <span className="text-gradient">الأحياء والميكروبيولوجيا</span>
          <br />
          <span className="text-slate-200">بمنهجية علمية وتطبيقية رائدة</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          id="hero-subheadline"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          custom={0.24}
          className="max-w-xl text-right text-base md:text-lg font-medium leading-relaxed text-slate-300"
        >
          شروحات تفاعلية مبسطة لطلاب الثانوية العامة (أحياء علمي علوم) ومقررات كليات العلوم والطب والصيدلة، مع ربط المناهج بالبيولوجيا الجزيئية وأحدث التطبيقات المعملية — بإشراف د. صالحة جابر دسوقي.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          id="hero-cta"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          custom={0.36}
          className="flex flex-wrap items-center gap-4"
        >
          {/* Primary */}
          <motion.a
            id="cta-browse-courses"
            href="/courses"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="btn-theme-primary group relative overflow-hidden rounded-2xl px-8 py-4 text-base font-extrabold flex items-center gap-2"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-500 group-hover:translate-x-full" />
            <Microscope className="w-5 h-5 text-white" />
            <span>تصفح المقررات والأقسام</span>
          </motion.a>

          {/* Secondary */}
          <motion.a
            id="cta-free-trial"
            href="/login"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="glass-panel rounded-2xl border border-white/15 px-8 py-4 text-base font-bold text-slate-200 transition-all duration-300 hover:border-[var(--theme-primary)] hover:text-white hover:shadow-[0_0_25px_var(--theme-glow)] flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-[var(--theme-primary)]" />
            <span>ابدأ التعلم الآن</span>
          </motion.a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          id="hero-trust"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          custom={0.48}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-slate-400"
        >
          {[
            "محتوى أكاديمي معتمد",
            "أحدث تقنيات PCR والبيوتكنولوجي",
            "أبحاث دولية محكّمة",
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════
          COLUMN 2 — LEFT (Biotech Core & Doctor Affiliation)
      ══════════════════════════════════ */}
      <div className="flex flex-col items-center gap-6 order-1 lg:order-2">

        {/* Dynamic Holographic Biotech Core Orb (No personal photo) */}
        <motion.div
          id="hero-biotech-core"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="relative flex items-center justify-center"
        >
          {/* Ambient Glow */}
          <div 
            className="absolute h-[380px] w-[380px] rounded-full blur-3xl opacity-40 transition-colors duration-700" 
            style={{ background: "var(--theme-glow)" }}
          />

          {/* Outer rotating molecular orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute rounded-full border border-dashed border-white/20"
            style={{
              width: "calc(100% + 40px)",
              height: "calc(100% + 40px)",
            }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--theme-primary)] shadow-[0_0_10px_var(--theme-primary)]" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--theme-secondary)] shadow-[0_0_8px_var(--theme-secondary)]" />
          </motion.div>

          {/* Middle counter-rotating gradient ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute rounded-full p-[2px]"
            style={{
              width: "calc(100% + 14px)",
              height: "calc(100% + 14px)",
              background: "var(--theme-gradient)",
              boxShadow: "0 0 30px var(--theme-glow)",
            }}
          />

          {/* Holographic Cellular Core Container */}
          <div className="relative h-64 w-64 rounded-full border-4 border-[#050B14] shadow-[0_0_80px_var(--theme-glow)] lg:h-76 lg:w-76 overflow-hidden bg-slate-950 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/biotech-core-orb.jpg"
              alt="النواة الحيوية وجزيئات الـ DNA ثلاثية الأبعاد"
              className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
            />

            {/* Inner holographic scan line */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--theme-primary)]/10 to-transparent opacity-60 animate-pulse" />

            {/* Overlay badge */}
            <div className="absolute bottom-3 inset-x-0 mx-auto w-max px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[var(--theme-badge-text)] flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              مختبر الميكروبيولوجيا والتقنيات الحيوية
            </div>
          </div>
        </motion.div>

        {/* Doctor Credential & Affiliation Card */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="glass-panel flex w-full max-w-sm flex-col items-center gap-2 rounded-3xl p-5 shadow-2xl border border-white/10 text-center hover:border-[var(--theme-primary)]/50 transition-colors duration-300"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] text-xs font-bold border border-[var(--theme-border)]">
            <Award className="w-3.5 h-3.5" />
            <span>إشراف أكاديمي وبحثي</span>
          </div>

          <h3 className="text-xl font-black text-slate-50 mt-1">
            د. صالحة جابر دسوقي
          </h3>

          <p className="text-xs font-bold text-[var(--theme-primary)] leading-tight">
            أستاذ مساعد بقسم النبات والميكروبيولوجي — كلية العلوم جامعة السويس
          </p>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
            دكتوراه في العلوم (ميكروبيولوجي) جامعة قناة السويس • دراسات بيوكيميائية ومضادات حيوية طبيعية • أبحاث متقدمة في البكتيريا والشفاء الذاتي
          </p>
        </motion.div>

        {/* Academic Stats row */}
        <div className="grid w-full max-w-sm grid-cols-3 gap-2.5">
          <StatCard value="+25 عاماً" label="خبرة أكاديمية" delay={0.65} icon={BookOpen} />
          <StatCard value="+20 بحثاً" label="نشر دولي محكّم" delay={0.75} icon={Microscope} />
          <StatCard value="4.9★" label="تقييم التميز" delay={0.85} icon={Award} />
        </div>
      </div>
    </div>
  );
}
