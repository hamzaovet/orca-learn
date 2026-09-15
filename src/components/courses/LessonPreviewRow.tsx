"use client";

import { useState } from "react";
import { PlayCircle, Lock, FileText, X } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  isFree: boolean;
  videoUrl: string | null;
  attachmentUrl: string | null;
};

export function LessonPreviewRow({ lesson }: { lesson: Lesson }) {
  const [isOpen, setIsOpen] = useState(false);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return '';
    try {
      let videoId = '';
      
      // Handle youtu.be/VIDEO_ID
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } 
      // Handle youtube.com/watch?v=VIDEO_ID
      else if (url.includes('youtube.com/watch')) {
        // Using URL object for safe parameter extraction
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        videoId = urlObj.searchParams.get('v') || '';
      }

      // If we successfully extracted a YouTube ID, build the exact nocookie URL
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;
      }

      // Fallback for non-YouTube URLs (like Vimeo)
      return url;
    } catch (e) {
      console.error("Error parsing video URL:", e);
      return url;
    }
  };

  const isClickable = lesson.isFree && lesson.videoUrl;

  return (
    <>
      <div 
        onClick={() => isClickable ? setIsOpen(true) : null}
        className={`flex items-center justify-between py-3 border-b border-white/5 last:border-0 ${
          isClickable ? 'cursor-pointer hover:bg-white/5 transition-colors px-2 rounded-lg -mx-2' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {lesson.isFree ? (
            <PlayCircle className="w-5 h-5 text-cyan-400" />
          ) : (
            <Lock className="w-5 h-5 text-slate-500" />
          )}
          <span className={`text-sm ${lesson.isFree ? 'text-slate-200' : 'text-slate-400'}`}>
            {lesson.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {lesson.isFree && (
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded border border-emerald-500/30">
              معاينة مجانية
            </span>
          )}
          {lesson.attachmentUrl && (
            <span title="يحتوي على مرفق">
              <FileText className="w-4 h-4 text-slate-500" />
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe 
              src={getEmbedUrl(lesson.videoUrl)} 
              className="w-full max-w-4xl aspect-video rounded-xl shadow-2xl" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
