"use client";

import { useState, useTransition, useRef } from "react";
import { addUniversity } from "@/actions/admin";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export function AddUniversityForm({ countries }: { countries: { id: string, name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await addUniversity(formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("تمت إضافة الجامعة بنجاح! 🏛️");
        formRef.current?.reset();
        setIsOpen(false);
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-l from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"
      >
        <PlusCircle className="h-4 w-4" />
        إضافة جامعة جديدة
      </button>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} autoComplete="off" className="flex items-center gap-3 rounded-2xl bg-white/5 p-2 shadow-lg backdrop-blur-md border border-white/10">
      <input 
        type="text" 
        name="name" 
        placeholder="اسم الجامعة" 
        required 
        autoComplete="off"
        spellCheck="false"
        disabled={isPending}
        className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 min-w-[250px]"
      />
      <select
        name="countryId"
        required
        disabled={isPending}
        defaultValue=""
        className="bg-[#0B0F19] border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
      >
        <option value="" disabled>اختر الدولة</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button 
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-l from-cyan-500 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-200 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "جاري الإضافة..." : "إضافة"}
      </button>
      <button 
        type="button"
        onClick={() => setIsOpen(false)}
        disabled={isPending}
        className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
      >
        إلغاء
      </button>
    </form>
  );
}
