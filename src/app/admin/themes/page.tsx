import { getActiveThemeId } from "@/actions/theme";
import { THEMES } from "@/lib/themes";
import ThemesManagerClient from "./ThemesManagerClient";

export const metadata = {
  title: "مكتبة الثيمات | لوحة الإدارة",
  description: "إدارة وتخصيص ثيمات وألوان المنصة بالكامل",
};

export default async function AdminThemesPage() {
  const currentThemeId = await getActiveThemeId();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[var(--theme-badge-bg)] text-[var(--theme-primary)] border border-[var(--theme-border)] uppercase tracking-wider">
            محرك المظهر المتقدم
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          مكتبة الثيمات والألوان الأكاديمية
        </h1>
        <p className="text-slate-400 mt-2 text-base max-w-2xl leading-relaxed">
          تحكم بهوية المنصة البصرية بنقرة واحدة. عند اختيار وتفعيل أي ثيم، سيتم تحديث الأزرار، التدرجات، الحواف المضيئة، والظلال فورياً لكافة الزوار والطلاب.
        </p>
      </div>

      {/* Interactive Client Manager */}
      <ThemesManagerClient initialThemeId={currentThemeId} themes={THEMES} />
    </div>
  );
}
