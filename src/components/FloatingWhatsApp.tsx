"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const whatsappUrl =
    "https://wa.me/201011358667?text=" +
    encodeURIComponent(
      "السلام عليكم د. صالحة، أتواصل معك بخصوص منصة أوركا ليرن والاستفسار عن الشروحات والمناهج."
    );

  return (
    <aside
      aria-label="التواصل المباشر عبر واتساب"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 group"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold border border-white/10 shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        تواصل مع د. صالحة عبر واتساب 💬
      </span>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مع د. صالحة عبر واتساب"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
}
