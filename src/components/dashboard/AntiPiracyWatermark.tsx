"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

interface AntiPiracyWatermarkProps {
  student: {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}

export default function AntiPiracyWatermark({ student }: AntiPiracyWatermarkProps) {
  const [position, setPosition] = useState({ top: 20, left: 30 });
  const [timestamp, setTimestamp] = useState("");

  // Update timestamp and randomly move watermark every 12 seconds
  useEffect(() => {
    const updatePosition = () => {
      // Keep within 10% to 75% so it stays comfortably visible inside the video frame
      const randomTop = Math.floor(Math.random() * 65) + 10;
      const randomLeft = Math.floor(Math.random() * 65) + 10;
      setPosition({ top: randomTop, left: randomLeft });

      const now = new Date();
      setTimestamp(
        now.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updatePosition();
    const interval = setInterval(updatePosition, 12000);
    return () => clearInterval(interval);
  }, []);

  const identifier = student.phone || student.email || student.name || "Orca Student";
  const studentShortId = student.id.slice(-6).toUpperCase();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 overflow-hidden">
      {/* 1. Dynamic Floating Bouncing Watermark */}
      <div
        style={{
          top: `${position.top}%`,
          left: `${position.left}%`,
        }}
        className="absolute transition-all duration-1000 ease-in-out transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="bg-black/35 backdrop-blur-[1px] border border-white/10 px-3 py-1 rounded-full text-white/30 text-[11px] font-mono tracking-wider flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-cyan-400/40" />
          <span>{student.name || "طالب أوركا"}</span>
          <span className="text-white/20">•</span>
          <span>{identifier}</span>
          <span className="text-white/20">•</span>
          <span className="text-[10px] text-cyan-400/30">ID:{studentShortId}</span>
        </div>
      </div>

      {/* 2. Permanent Corner Subtle Stamp */}
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/20 tracking-widest">
        <span>ORCA-SECURE • {studentShortId}</span>
      </div>

      {/* 3. Top Right Timestamp Stamp */}
      <div className="absolute top-4 right-4 text-[9px] font-mono text-white/15">
        {timestamp}
      </div>
    </div>
  );
}
