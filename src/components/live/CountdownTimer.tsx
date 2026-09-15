"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string | Date;
  onExpire?: () => void;
}

export default function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        <span>حان موعد الحصة الآن!</span>
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
      <Clock className="w-3.5 h-3.5 text-cyan-400" />
      <span className="text-[11px] text-slate-400 font-sans">يبدأ خلال:</span>
      <div className="flex items-center gap-1 text-white">
        {timeLeft.days > 0 && <span>{timeLeft.days}ي : </span>}
        <span>{String(timeLeft.hours).padStart(2, "0")}س : </span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}د : </span>
        <span className="text-cyan-400">{String(timeLeft.seconds).padStart(2, "0")}ث</span>
      </div>
    </div>
  );
}
