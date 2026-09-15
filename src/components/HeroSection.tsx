import { prisma } from "@/lib/prisma";
import { TrustStrip } from "@/components/TrustStrip";
import { HeroAnimatedContent } from "@/components/HeroAnimatedContent";

export default async function HeroSection() {
  const universities = await prisma.university.findMany({ 
    select: { id: true, name: true } 
  });

  return (
    <section
      className="relative overflow-hidden min-h-[90vh] flex flex-col justify-between"
      aria-label="القسم الرئيسي"
    >
      {/* ── AI Generated High-Tech Biotech Background ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: "url('/assets/biotech-hero-bg.jpg')",
          filter: "saturate(1.2) contrast(1.1)",
        }}
      />

      {/* ── Microscopic grid overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Radial Vignette & Atmospheric Deep Darkness ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 35%, transparent 20%, #050B14 85%)",
        }}
      />

      {/* ── Dynamic Theme Ambient Glows ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Dynamic theme primary glow */}
        <div 
          className="absolute -top-40 right-10 h-[600px] w-[600px] rounded-full blur-[160px] opacity-25 transition-colors duration-700" 
          style={{ background: "var(--theme-primary)" }}
        />
        {/* Dynamic secondary glow */}
        <div 
          className="absolute -bottom-20 left-10 h-[500px] w-[500px] rounded-full blur-[140px] opacity-20 transition-colors duration-700" 
          style={{ background: "var(--theme-secondary)" }}
        />
        {/* Center subtle pulse */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full blur-[130px] opacity-15"
          style={{ background: "var(--theme-accent)" }}
        />
      </div>

      {/* ── Animated Floating Micro-Spores / Cells (Dynamic Bio Elements) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/6 w-3 h-3 rounded-full blur-[1px] animate-bio-float opacity-40 shadow-[0_0_12px_var(--theme-primary)]"
          style={{ background: "var(--theme-primary)", animationDuration: "12s" }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full blur-[1px] animate-bio-float opacity-30 shadow-[0_0_16px_var(--theme-secondary)]"
          style={{ background: "var(--theme-secondary)", animationDuration: "16s", animationDelay: "2s" }}
        />
        <div 
          className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full blur-[1px] animate-bio-float opacity-35 shadow-[0_0_10px_var(--theme-accent)]"
          style={{ background: "var(--theme-accent)", animationDuration: "10s", animationDelay: "4s" }}
        />
        <div 
          className="absolute top-2/3 right-1/6 w-2 h-2 rounded-full blur-[1px] animate-bio-float opacity-25"
          style={{ background: "var(--theme-primary)", animationDuration: "14s", animationDelay: "1s" }}
        />
      </div>

      <HeroAnimatedContent />

      <TrustStrip universities={universities} />
    </section>
  );
}
