"use client";

import { motion } from "framer-motion";

export function TrustStrip({ universities }: { universities: { id: string, name: string }[] }) {
  if (!universities || universities.length === 0) return null;

  return (
    <div className="relative mt-12 w-full overflow-hidden border-y border-white/10 bg-white/[0.03] py-6 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.05)] lg:mt-16">
      {/* Edge fade-out masks */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#0B0F19] via-transparent to-[#0B0F19]" />

      {/* Label */}
      <p className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-[var(--theme-primary)] drop-shadow-[0_0_8px_var(--theme-glow)]">
        يثق بنا وبأبحاثنا طلاب وباحثون من
      </p>

      {/* Infinite marquee track */}
      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="flex min-w-max items-center gap-16 px-8"
        >
          {/* Original set */}
          {universities.map((uni) => (
            <div key={uni.id} className="flex items-center gap-4">
              <div 
                className="h-2 w-2 rounded-full shadow-[0_0_8px_var(--theme-glow)]"
                style={{ background: "var(--theme-primary)" }}
              />
              <span className="text-xl font-extrabold tracking-wider text-slate-100 drop-shadow-md whitespace-nowrap">
                {uni.name}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {universities.map((uni) => (
            <div key={`dup-${uni.id}`} className="flex items-center gap-4">
              <div 
                className="h-2 w-2 rounded-full shadow-[0_0_8px_var(--theme-glow)]"
                style={{ background: "var(--theme-primary)" }}
              />
              <span className="text-xl font-extrabold tracking-wider text-slate-100 drop-shadow-md whitespace-nowrap">
                {uni.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
