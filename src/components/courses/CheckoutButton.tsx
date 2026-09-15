"use client";

import { useRouter } from "next/navigation";
import { Lock, Clock } from "lucide-react";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
  userId?: string;
  isEnrolled: boolean;
  isPending?: boolean;
}

export default function CheckoutButton({ courseId, price, userId, isEnrolled, isPending }: CheckoutButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isEnrolled) {
      router.push(`/dashboard/courses/${courseId}`);
    } else if (!userId) {
      router.push("/login");
    } else {
      router.push(`/checkout/${courseId}`);
    }
  };

  if (isEnrolled) {
    return (
      <button 
        onClick={handleClick}
        className="btn-theme-primary w-full text-white font-black py-4 rounded-xl mt-6 transition-all shadow-lg flex justify-center items-center gap-2 cursor-pointer"
      >
        <span>متابعة المحاضرات والمنهج ↗</span>
      </button>
    );
  }

  if (isPending) {
    return (
      <button 
        onClick={handleClick}
        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex justify-center items-center gap-2 cursor-pointer"
      >
        <Clock className="w-4 h-4 animate-pulse" />
        <span>طلب الاشتراك قيد المراجعة ⏳</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className="btn-theme-primary w-full text-white font-black py-4 rounded-xl mt-6 transition-all shadow-lg flex justify-center items-center gap-2 cursor-pointer"
    >
      <span>اشترك في الكورس الآن</span>
      {!userId && <Lock className="w-4 h-4 opacity-70"/>}
    </button>
  );
}
