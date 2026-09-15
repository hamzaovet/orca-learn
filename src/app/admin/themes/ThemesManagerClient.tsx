"use client";

import { useState, useTransition } from "react";
import { ThemeConfig } from "@/lib/themes";
import { setGlobalTheme } from "@/actions/theme";
import toast from "react-hot-toast";
import { Check, Sparkles, Palette, Loader2, Eye, Dna, Microscope, Laptop } from "lucide-react";

export default function ThemesManagerClient({
  initialThemeId,
  themes,
}: {
  initialThemeId: string;
  themes: ThemeConfig[];
}) {
  const [activeThemeId, setActiveThemeId] = useState(initialThemeId);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentTheme = themes.find((t) => t.id === (previewThemeId || activeThemeId)) || themes[0];

  const handleApplyTheme = (themeId: string) => {
    startTransition(async () => {
      // Instant visual feedback
      document.documentElement.setAttribute("data-theme", themeId);
      setActiveThemeId(themeId);
      setPreviewThemeId(null);

      const res = await setGlobalTheme(themeId);
      if (res.success) {
        toast.success(res.message || "تم حفظ الثيم بنجاح!", {
          icon: "🎨",
          style: {
            background: "#0F172A",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
          },
        });
      } else {
        toast.error(res.error || "تعذر حفظ الثيم.");
      }
    });
  };

  const handlePreview = (themeId: string) => {
    setPreviewThemeId(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
  };

  const handleCancelPreview = () => {
    setPreviewThemeId(null);
    document.documentElement.setAttribute("data-theme", activeThemeId);
  };

  return (
    <div className="space-y-10">

      {/* ── Live Interactive Preview Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-500">
        <div 
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
          style={{ background: currentTheme.colors.glow }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Eye className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>معاينة حية فورية لعناصر الموقع</span>
              {previewThemeId && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 text-[10px]">
                  وضع التجربة المؤقت
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              ثيم: <span className="text-gradient">{currentTheme.name}</span> ({currentTheme.nameEn})
            </h2>
            <p className="text-xs text-slate-400 mt-1">{currentTheme.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            {previewThemeId && (
              <button
                type="button"
                onClick={handleCancelPreview}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
              >
                إلغاء المعاينة
              </button>
            )}
            <button
              type="button"
              disabled={isPending || activeThemeId === currentTheme.id}
              onClick={() => handleApplyTheme(currentTheme.id)}
              className="btn-theme-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : activeThemeId === currentTheme.id ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>الثيم النشط حالياً</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>تفعيل وحفظ هذا الثيم</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Component Showcase Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Buttons & Badges */}
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">الأزرار والشارات</span>
            <div className="flex flex-wrap gap-2.5">
              <span className="theme-badge px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
                <Dna className="w-3.5 h-3.5" />
                شارة تفاعلية
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <button className="btn-theme-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                زر أساسي متوهج
              </button>
              <button className="glass-panel px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:border-[var(--theme-primary)] hover:text-white transition-colors">
                زر زجاجي ثانوي
              </button>
            </div>
          </div>

          {/* Card 2: Gradient Typography */}
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">التدرجات النصية والعناوين</span>
            <h3 className="text-xl font-black text-white">
              مرحباً بكم في <span className="text-gradient">أوركا ليرن</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تدرج لوني فائق الجودة ينساب تلقائياً عبر العناوين الرئيسية وأسماء المقررات الأكاديمية.
            </p>
          </div>

          {/* Card 3: Live Metric Card */}
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 space-y-2 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">بطاقات البيانات</span>
            <div className="p-4 rounded-xl glass-panel border border-[var(--theme-border)] text-center">
              <span className="text-2xl font-black text-gradient block">+25 عاماً</span>
              <span className="text-xs text-slate-400">خبرة بحثية وتدريس جامعي</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Themes Grid ── */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-[var(--theme-primary)]" />
          <h2 className="text-xl font-black text-white">اختر الثيم الأنسب لتخصص المنصة:</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            const isPreviewing = previewThemeId === theme.id;

            return (
              <div
                key={theme.id}
                className={`relative rounded-3xl p-6 border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group ${
                  isSelected
                    ? "bg-slate-900/90 border-white/30 shadow-[0_0_40px_var(--theme-glow)] ring-2 ring-[var(--theme-primary)]"
                    : isPreviewing
                    ? "bg-slate-900/80 border-amber-500/50 shadow-xl"
                    : "bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900/70"
                }`}
              >
                {/* Active / Preview Ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-white/5">
                    {theme.category}
                  </span>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Check className="w-3.5 h-3.5" />
                      النشط حالياً
                    </span>
                  ) : isPreviewing ? (
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-full">
                      قيد المعاينة
                    </span>
                  ) : null}
                </div>

                {/* Theme Title */}
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-white group-hover:text-slate-100 transition-colors flex items-center justify-between">
                    <span>{theme.name}</span>
                    <span className="text-xs font-normal text-slate-500 tracking-wider font-mono">
                      {theme.nameEn}
                    </span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {theme.tagline}
                  </p>
                </div>

                {/* Color Palette Chips */}
                <div className="space-y-2 mb-6 bg-slate-950/50 rounded-2xl p-4 border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    توليفة الألوان والتدرج
                  </span>
                  {/* Gradient bar */}
                  <div
                    className="h-4 w-full rounded-lg shadow-inner"
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`,
                    }}
                  />
                  {/* Color Swatches */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ background: theme.colors.primary }}
                        title={`اللون الأساسي: ${theme.colors.primary}`}
                      />
                      <span className="text-[11px] text-slate-300 font-mono">
                        {theme.colors.primary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ background: theme.colors.secondary }}
                        title={`اللون الثانوي: ${theme.colors.secondary}`}
                      />
                      <span className="text-[11px] text-slate-300 font-mono">
                        {theme.colors.secondary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handlePreview(theme.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    معاينة سريعة
                  </button>

                  <button
                    type="button"
                    disabled={isPending || isSelected}
                    onClick={() => handleApplyTheme(theme.id)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-white/10 text-slate-400 cursor-default"
                        : "btn-theme-primary text-white shadow-md hover:scale-105"
                    }`}
                  >
                    {isPending && activeThemeId === theme.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSelected ? (
                      "مفعّل"
                    ) : (
                      "تفعيل"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
