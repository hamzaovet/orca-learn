"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createDepartment } from "./actions";
import toast from "react-hot-toast";

export function DepartmentForm({ universities }: { universities: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createDepartment(formData);
      toast.success("تم إضافة القسم بنجاح");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
      >
        <Plus className="w-5 h-5" /> إضافة قسم
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B1221] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-white mb-6">إضافة قسم جديد</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">اسم القسم</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-[#111827] border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                  placeholder="مثال: قسم الميكروبيولوجيا الطبية والتكنولوجيا الحيوية"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">الجامعة التابع لها</label>
                <select 
                  name="universityId" 
                  required 
                  className="w-full bg-[#111827] border border-white/5 rounded-2xl px-4 py-4 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none"
                >
                  <option value="">اختر الجامعة...</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-slate-400 hover:text-white font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 font-extrabold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  حفظ القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
