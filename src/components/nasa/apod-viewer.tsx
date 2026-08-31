"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Camera, Info, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  date: string;
  copyright?: string;
}

interface ApodViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApodViewer({ isOpen, onClose }: ApodViewerProps) {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !data && !error) {
      setLoading(true);
      fetch("/api/nasa/apod")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load APOD");
          return res.json();
        })
        .then((json) => {
          setData(json);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isOpen, data, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-5xl h-[90vh] sm:h-[80vh] flex flex-col md:flex-row bg-[#0A0E17]/95 border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-white/50 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="font-mono text-sm tracking-widest uppercase">Contacting NASA...</span>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center text-red-400 font-mono">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Media Section */}
            <div className="flex-1 md:w-3/5 bg-black relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-white/10">
              {data.media_type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.hdurl || data.url}
                  alt={data.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full aspect-video flex items-center justify-center bg-black">
                  <iframe
                    src={data.url}
                    title={data.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
              
              {/* Media Type Badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                {data.media_type === "video" ? (
                  <Play className="w-3.5 h-3.5 text-accent" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-accent" />
                )}
                <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">
                  {data.media_type}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 md:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 text-accent/80 font-mono text-xs uppercase tracking-widest mb-3">
                <Calendar className="w-4 h-4" />
                <span>NASA Daily • {data.date}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
                {data.title}
              </h2>

              {data.copyright && (
                <p className="text-xs font-mono text-white/40 mb-6 uppercase tracking-wider">
                  © {data.copyright}
                </p>
              )}

              <div className="prose prose-invert prose-sm md:prose-base prose-p:leading-relaxed prose-p:text-white/70 max-w-none mt-4 border-t border-white/10 pt-6">
                <p>{data.explanation}</p>
              </div>

              <div className="mt-auto pt-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60 leading-relaxed font-mono">
                    This image and explanation are provided by NASA's Astronomy Picture of the Day API. 
                    Ask the COSMORA AI if you'd like to learn more about the celestial objects shown here.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
