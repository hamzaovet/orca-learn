"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface CertificatePrintViewProps {
  certificate: any;
}

export default function CertificatePrintView({ certificate }: CertificatePrintViewProps) {
  const issueDateFormatted = new Date(certificate.issueDate).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify?code=${certificate.certificateCode}`
    : `https://orca-learn.com/verify?code=${certificate.certificateCode}`;

  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=050b14`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      toast.success("تم نسخ رابط التحقق من الشهادة");
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 py-16 px-4 md:px-8 font-sans relative">
      {/* Top Toolbar (Hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link
          href="/dashboard"
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للوحة التحكم</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>مشاركة الرابط المعتمد</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-theme-primary px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة أو حفظ الشهادة كـ PDF</span>
          </button>
        </div>
      </div>

      {/* ── THE OFFICIAL LUXURY CERTIFICATE CONTAINER ── */}
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0B1323] via-[#0E1A30] to-[#0A1120] border-4 border-amber-500/50 rounded-3xl p-8 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden text-center print:border-2 print:p-8 print:shadow-none print:bg-white print:text-black">
        {/* Inner Gold Frame */}
        <div className="absolute inset-3 border-2 border-amber-500/30 rounded-2xl pointer-events-none print:border-amber-700"></div>

        {/* Watermark Crest */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Award className="w-[500px] h-[500px] text-amber-400" />
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 space-y-6">
          {/* Header Logos & Title */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>وثيقة أكاديمية معتمدة وموثقة رقمياً</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide print:text-slate-900">
              شهادة إتمام واجتياز مقرر
            </h1>
            <p className="text-xs md:text-sm text-cyan-400 font-mono tracking-wider font-bold">
              CERTIFICATE OF COMPLETION & ACADEMIC EXCELLENCE
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-300 font-serif leading-relaxed print:text-slate-700">
            يشهد مركز <strong className="text-white print:text-black">Orca Learn</strong> التعليمي بالاشتراك مع الأستاذة الدكتورة:
          </p>

          {/* Supervisor Name */}
          <div className="py-1">
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-yellow-200 to-amber-400 print:text-amber-700 font-serif">
              أ.د. صالحة جابر الدسوقي
            </h2>
            <p className="text-xs text-slate-400 mt-1 print:text-slate-600 font-bold">
              دكتوراه الفلسفة في العلوم (ميكروبيولوجيا وبيوتكنولوجي) • رائدة ابتكار الخرسانة ذاتية الشفاء
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-300 font-serif leading-relaxed print:text-slate-700">
            بأن الطالب المتميز / الطالبة المتميزة:
          </p>

          {/* Student Name */}
          <div className="py-2">
            <div className="inline-block border-b-2 border-amber-400/60 pb-2 px-8">
              <h3 className="text-2xl md:text-4xl font-black text-white print:text-black tracking-wide">
                {certificate.studentName}
              </h3>
            </div>
          </div>

          <p className="text-sm md:text-base text-slate-300 font-serif leading-relaxed max-w-2xl mx-auto print:text-slate-700">
            قد اجتاز/ت بنجاح واقتدار كافة المتطلبات العلمية والتطبيقات والاختبارات التقييمية المقررة لمقرر:
          </p>

          {/* Course Title & Grade */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-xl mx-auto space-y-2 print:bg-slate-100 print:border-slate-300">
            <h4 className="text-xl md:text-2xl font-black text-cyan-300 print:text-cyan-800">
              {certificate.courseTitle}
            </h4>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-300 print:text-slate-700">
              <span>التقدير العام: <strong className="text-emerald-400 print:text-emerald-700">{certificate.grade}</strong></span>
              {certificate.score && (
                <span>الدرجة المحرزة: <strong className="font-mono text-white print:text-black">{certificate.score}%</strong></span>
              )}
            </div>
          </div>

          {/* Signatures & QR Section */}
          <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-right print:border-slate-300">
            {/* Left: QR Code & Verification */}
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 print:bg-transparent print:border-slate-300">
              <img
                src={qrCodeImgUrl}
                alt="كود التحقق QR"
                className="w-20 h-20 rounded-xl bg-white p-1"
              />
              <div className="text-right space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">امسح الرمز للتحقق:</span>
                <span className="text-xs font-mono font-black text-cyan-400 print:text-cyan-700 block">
                  {certificate.certificateCode}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  موثقة ومعتمدة رسمياً ✓
                </span>
              </div>
            </div>

            {/* Middle: Issue Date */}
            <div className="text-center space-y-1">
              <span className="text-[11px] text-slate-400 block">تاريخ الاعتماد والإصدار</span>
              <span className="text-xs font-bold text-white print:text-black block font-mono">
                {issueDateFormatted}
              </span>
            </div>

            {/* Right: Academic Seal */}
            <div className="text-center md:text-left space-y-1">
              <span className="text-[11px] text-slate-400 block font-bold">الاعتماد الأكاديمي والختم</span>
              <div className="text-sm font-black text-amber-400 print:text-amber-800 font-serif">
                أ.د. صالحة جابر الدسوقي
              </div>
              <span className="text-[10px] text-slate-500 block">
                Orca Learn Academic Board
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
