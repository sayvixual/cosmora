"use client";

import React, { useState, useEffect } from "react";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { spaceAudio } from "@/lib/audio-manager";

interface AudioAmbienceToggleProps {
  className?: string;
  compact?: boolean;
}

export function AudioAmbienceToggle({ className, compact = false }: AudioAmbienceToggleProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!spaceAudio) return;
    const unsubscribe = spaceAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const toggleSoundscape = async () => {
    if (spaceAudio) {
      await spaceAudio.toggle();
    }
  };

  return (
    <button
      onClick={toggleSoundscape}
      type="button"
      className={cn(
        "group relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer select-none",
        isPlaying
          ? "bg-accent/15 border border-accent/40 text-accent shadow-[0_0_12px_rgba(75,158,255,0.25)]"
          : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/20",
        className
      )}
      title={isPlaying ? "Mute Space Soundscape" : "Activate Cosmic Soundscape Ambience"}
      aria-label={isPlaying ? "Mute Space Soundscape" : "Activate Cosmic Soundscape Ambience"}
    >
      {isPlaying ? (
        <>
          <div className="flex items-end gap-[2px] h-3.5 w-3.5 justify-center">
            <span className="w-[2px] bg-accent rounded-full animate-audio-1" />
            <span className="w-[2px] bg-accent rounded-full animate-audio-2" />
            <span className="w-[2px] bg-accent rounded-full animate-audio-3" />
            <span className="w-[2px] bg-accent rounded-full animate-audio-4" />
          </div>
          {!compact && (
            <span className="text-[10px] tracking-wider font-semibold text-accent flex items-center gap-1">
              AUDIO <span className="size-1 rounded-full bg-accent animate-ping" />
            </span>
          )}
        </>
      ) : (
        <>
          <Radio className="size-3.5 group-hover:text-white transition-colors" />
          {!compact && (
            <span className="text-[10px] tracking-wider text-white/50 group-hover:text-white/80 transition-colors">
              AMB SFX
            </span>
          )}
        </>
      )}
    </button>
  );
}
