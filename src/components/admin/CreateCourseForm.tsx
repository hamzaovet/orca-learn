"use client";

import { useState, useTransition } from "react";
import { createCourse } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { School, GraduationCap, Crown, Sparkles } from "lucide-react";

interface CreateCourseFormProps {
  departments: { id: string; name: string; universityId: string }[];
  universities: { 
    id: string; 
    name: string; 
    country: { currencyCode: string; usdRate: number } 
  }[];
  secondaryGrades?: { id: string; name: string; countryCode: string }[];
}

export function CreateCourseForm({ departments, universities, secondaryGrades = [] }: CreateCourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Track selection: 'UNIVERSITY' | 'SECONDARY' | 'VIP'
  const [track, setTrack] = useState<"SECONDARY" | "UNIVERSITY" | "VIP">("SECONDARY");

  const [selectedSecondaryGradeId, setSelectedSecondaryGradeId] = useState("");
  const [selectedUniId, setSelectedUniId] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [localPrice, setLocalPrice] = useState("");
  const [usdPrice, setUsdPrice] = useState("");

  const selectedUni = universities.find(u => u.id === selectedUniId);
  const country = selectedUni?.country;

  async function handleSubmit(formData: FormData) {
    formData.append("stage", track);

    if (track === "VIP") {
      formData.append("isMaestroAcademy", "on");
    } else if (track === "SECONDARY") {
      formData.append("secondaryGradeId", selectedSecondaryGradeId);
    } else if (track === "UNIVERSITY") {
      formData.append("universityId", selectedUniId);
      formData.append("departmentId", selectedDeptId);
    }
    
    startTransition(async () => {
      const result = await createCourse(formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("تم إنشاء الكورس بنجاح! انتقل الآن لإضافة المنهج والدروس والمذكرات.");
        if (result?.courseId) {
          router.push(`/admin/courses/${result.courseId}`);
        } else {
          router.push("/admin/courses");
        }
      }
    });
  }

  return (
    <form action={handleSubmit} autoComplete="off" className="flex flex-col gap-6 rounded-3xl bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-lg border border-white/10">
      
      {/* ── Track Selector Tabs ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          حدد مسار الكورس التعليمي:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Secondary Track */}
          <button
            type="button"
            onClick={() => setTrack("SECONDARY")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
              track === "SECONDARY"
                ? "bg-[var(--theme-badge-bg)] border-[var(--theme-primary)] text-white shadow-[0_0_20px_var(--theme-glow)]"
                : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <School className="w-5 h-5 text-[var(--theme-primary)]" />
              {track === "SECONDARY" && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">محدد</span>}
            </div>
            <div>
              <h4 className="font-black text-sm text-white">المرحلة الثانوية</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">علمي علوم، الثانوية العامة، والمسارات</p>
            </div>
          </button>

          {/* University Track */}
          <button
            type="button"
            onClick={() => setTrack("UNIVERSITY")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
              track === "UNIVERSITY"
                ? "bg-[var(--theme-badge-bg)] border-[var(--theme-primary)] text-white shadow-[0_0_20px_var(--theme-glow)]"
                : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <GraduationCap className="w-5 h-5 text-[var(--theme-primary)]" />
              {track === "UNIVERSITY" && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">محدد</span>}
            </div>
            <div>
              <h4 className="font-black text-sm text-white">المرحلة الجامعية</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">كليات العلوم، الطب، الصيدلة، والزراعة</p>
            </div>
          </button>

          {/* VIP Academy Track */}
          <button
            type="button"
            onClick={() => setTrack("VIP")}
            className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
              track === "VIP"
                ? "bg-amber-500/15 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <Crown className="w-5 h-5 text-amber-400" />
              {track === "VIP" && <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">محدد</span>}
            </div>
            <div>
              <h4 className="font-black text-sm text-amber-300">أكاديمية التميز (VIP)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">برامج ودبلومات بحثية متقدمة ومستقلة</p>
            </div>
          </button>
        </div>
      </div>

      {/* Course Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-300">اسم الكورس أو المنهج</label>
        <input 
          type="text" 
          name="title" 
          required 
          autoComplete="off"
          spellCheck="false"
          disabled={isPending}
          className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--theme-primary)] transition-colors disabled:opacity-50"
          placeholder={
            track === "SECONDARY"
              ? "مثال: مراجعة البيولوجيا الجزيئية والـ DNA - الصف الثالث الثانوي"
              : track === "UNIVERSITY"
              ? "مثال: مقرر الميكروبيولوجيا العامة والفسيولوجيا البكتيرية"
              : "مثال: دبلومة تقنيات PCR والمعلوماتية الحيوية المتقدمة"
          }
        />
      </div>

      {/* ── Sub-selectors based on Track ── */}
      {track === "SECONDARY" && (
        <div className="flex flex-col gap-2 bg-slate-950/50 p-4 rounded-2xl border border-white/5 animate-in fade-in duration-300">
          <label className="text-sm font-bold text-slate-300">الصف الدراسي / المنهج الثانوي</label>
          <select
            name="secondaryGradeId"
            required
            disabled={isPending}
            value={selectedSecondaryGradeId}
            onChange={(e) => setSelectedSecondaryGradeId(e.target.value)}
            className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--theme-primary)] transition-colors cursor-pointer"
          >
            <option value="" disabled>اختر الصف الدراسي أو المنهج</option>
            {secondaryGrades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.countryCode === "EGY" ? "مصر" : g.countryCode === "KSA" ? "السعودية" : g.countryCode})
              </option>
            ))}
          </select>
        </div>
      )}

      {track === "UNIVERSITY" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-950/50 p-4 rounded-2xl border border-white/5 animate-in fade-in duration-300">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-300">الجامعة</label>
            <select
              name="universityId"
              required
              disabled={isPending}
              value={selectedUniId}
              onChange={(e) => {
                const uniId = e.target.value;
                setSelectedUniId(uniId);
                setSelectedDeptId("");
                const newUni = universities.find(u => u.id === uniId);
                const newCountry = newUni?.country;
                if (newCountry && newCountry.currencyCode !== 'EGP' && localPrice) {
                  setUsdPrice((parseFloat(localPrice) / (newCountry.usdRate || 3.75)).toFixed(2));
                } else {
                  setUsdPrice('');
                }
              }}
              className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--theme-primary)] transition-colors cursor-pointer"
            >
              <option value="" disabled>اختر الجامعة</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-300">الكلية / القسم</label>
            <select
              name="departmentId"
              required
              disabled={isPending || !selectedUniId}
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--theme-primary)] transition-colors cursor-pointer"
            >
              <option value="" disabled>اختر القسم</option>
              {departments
                .filter((d) => d.universityId === selectedUniId)
                .map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-300">وصف الكورس ومحتواه</label>
        <textarea
          name="description"
          rows={3}
          disabled={isPending}
          className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--theme-primary)] transition-colors resize-none"
          placeholder="نبذة عن المقرر، المحاور التعليمية، ونماذج الامتحانات التدريبية..."
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-300">
            السعر بالعملة المحلية
            {country && <span className="text-xs text-[var(--theme-primary)] font-normal mr-2">({country.currencyCode})</span>}
          </label>
          <input 
            type="number" 
            name="priceLocal" 
            required 
            min="0"
            step="any"
            value={localPrice}
            onChange={(e) => {
              const val = e.target.value;
              setLocalPrice(val);
              if (country && country.currencyCode !== 'EGP') {
                const calculatedUsd = parseFloat(val) / (country.usdRate || 3.75);
                setUsdPrice(isNaN(calculatedUsd) ? '' : calculatedUsd.toFixed(2));
              } else if (track === "VIP") {
                setUsdPrice(val);
              }
            }}
            disabled={isPending}
            className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--theme-primary)]"
            placeholder="مثال: 150"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-300">
            السعر بالدولار الأمريكي (USD)
          </label>
          <input 
            type="number" 
            name="priceUSD" 
            min="0"
            step="any"
            value={usdPrice}
            onChange={(e) => setUsdPrice(e.target.value)}
            disabled={isPending}
            className="bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--theme-primary)]"
            placeholder="مثال: 25"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isPending}
        className="btn-theme-primary mt-4 py-4 rounded-xl font-black text-white text-base shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        <span>{isPending ? "جاري إضافة الكورس..." : "حفظ ونشر الكورس"}</span>
      </button>

    </form>
  );
}
