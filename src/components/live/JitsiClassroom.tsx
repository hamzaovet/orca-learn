"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { 
  Maximize2, 
  Minimize2, 
  PhoneOff, 
  Radio, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Volume2
} from "lucide-react";

interface JitsiClassroomProps {
  roomName: string;
  sessionTitle: string;
  userName: string;
  userEmail?: string;
  isHost?: boolean;
  onLeave?: () => void;
}

export default function JitsiClassroom({
  roomName,
  sessionTitle,
  userName,
  userEmail,
  isHost = false,
  onLeave,
}: JitsiClassroomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);

  // تهيئة وتجهيز غرفة Jitsi Meet
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;

    // التأكد من عدم تكرار التهيئة
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.error("Dispose error:", e);
      }
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: roomName || "orca-live-default-room",
      width: "100%",
      height: "100%",
      parentNode: containerRef.current,
      userInfo: {
        displayName: isHost ? `د. ${userName} (المحاضرة)` : userName,
        email: userEmail || "student@orca-learn.com",
      },
      configOverwrite: {
        startWithAudioMuted: !isHost,
        startWithVideoMuted: !isHost,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
        enableClosePage: false,
        defaultRemoteDisplayName: "طالب أوركا",
        toolbarButtons: isHost
          ? [
              "camera",
              "chat",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "microphone",
              "participants-pane",
              "profile",
              "raisehand",
              "recording",
              "security",
              "select-background",
              "settings",
              "tileview",
              "toggle-camera",
              "videoquality",
              "whiteboard",
              "mute-everyone",
            ]
          : [
              "camera",
              "chat",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "microphone",
              "profile",
              "raisehand",
              "select-background",
              "settings",
              "tileview",
            ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: "",
        DEFAULT_BACKGROUND: "#050B14",
        TOOLBAR_ALWAYS_VISIBLE: true,
        MOBILE_APP_PROMO: false,
      },
    };

    try {
      const api = new (window as any).JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      api.addEventListeners({
        videoConferenceJoined: () => {
          setIsJoined(true);
        },
        videoConferenceLeft: () => {
          setIsJoined(false);
          if (onLeave) onLeave();
        },
        participantJoined: () => {
          setParticipantCount((prev) => prev + 1);
        },
        participantLeft: () => {
          setParticipantCount((prev) => Math.max(1, prev - 1));
        },
      });
    } catch (err) {
      console.error("Failed to initialize Jitsi Meet:", err);
    }

    return () => {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          // ignore
        }
        jitsiApiRef.current = null;
      }
    };
  }, [isScriptLoaded, roomName, userName, userEmail, isHost, onLeave]);

  // ملء الشاشة
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleHangup = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand("hangup");
    }
    if (onLeave) onLeave();
  };

  return (
    <div className="relative w-full h-[82vh] min-h-[600px] bg-[#050B14] rounded-3xl overflow-hidden border border-cyan-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col">
      {/* Script Loader */}
      <Script
        src="https://meet.jit.si/external_api.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      {/* Top Header Bar */}
      <div className="h-16 bg-[#08101E]/95 border-b border-white/10 px-6 flex items-center justify-between z-20 backdrop-blur-md">
        {/* Left: Live indicator & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3 py-1 rounded-full shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
              مباشر الآن
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-bold text-white truncate max-w-md" title={sessionTitle}>
              {sessionTitle}
            </h2>
          </div>
        </div>

        {/* Right: Controls & Badge */}
        <div className="flex items-center gap-3">
          {isHost ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>قاعة المحاضرة (Host)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>طالب معتمد ✓</span>
            </span>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 text-xs flex items-center gap-1"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Leave Button */}
          <button
            onClick={handleHangup}
            className="p-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors text-xs font-bold flex items-center gap-1.5"
            title="مغادرة القاعة"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مغادرة</span>
          </button>
        </div>
      </div>

      {/* Main Jitsi Container */}
      <div className="relative flex-1 w-full h-full bg-[#050B14]">
        {!isScriptLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#050B14] z-10">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
            <p className="text-slate-400 text-sm font-bold animate-pulse">
              جاري تجهيز القاعة التفاعلية والاتصال الآمن...
            </p>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Footer Info / Tips */}
      <div className="h-10 bg-[#060D18] border-t border-white/5 px-6 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>القاعة مشفرة ومؤمنة بالكامل داخل منصة أوركا ليرن</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>💡 نصيحة: يمكنك استخدام زر رفع اليد (Raise Hand) لسؤال الدكتورة صوتياً</span>
        </div>
      </div>
    </div>
  );
}
