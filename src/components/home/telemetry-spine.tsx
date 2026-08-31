"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TelemetrySpineProps {
  className?: string;
  variant?: "auto" | "vertical" | "horizontal";
}

// ---------------------------------------------------------------------------
// SCI-FI HIGH-PRECISION EASING NUMBER COUNTER HOOK
// ---------------------------------------------------------------------------
function useAnimatedNumber(target: number, duration: number = 1800, decimals: number = 0, delay: number = 100) {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const timeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Ease-out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;
        
        setCurrent(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCurrent(target);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, delay]);

  return current.toFixed(decimals);
}

export function TelemetrySpine({ className, variant = "auto" }: TelemetrySpineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ageUniverse = useAnimatedNumber(13.78, 2000, 2, 200);
  const galaxies = useAnimatedNumber(2, 1600, 0, 400);
  const planets = useAnimatedNumber(8, 1400, 0, 600);
  const you = useAnimatedNumber(1, 1200, 0, 800);

  const metrics = [
    { value: `${ageUniverse}`, suffix: "", label: "AGE OF UNIVERSE (GYR)" },
    { value: `${galaxies}`, suffix: "T+", label: "GALAXIES" },
    { value: `${planets}`, suffix: "", label: "PLANETS" },
    { value: `${you}`, suffix: "", label: "YOU" },
  ];

  return (
    <aside
      className={cn("font-mono select-none pointer-events-auto", className)}
      aria-label="Astronomical Telemetry"
    >
      {/* 1. Mobile & Tablet Horizontal Telemetry Strip */}
      {(variant === "auto" || variant === "horizontal") && (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md w-full",
            variant === "auto" && "lg:hidden"
          )}
        >
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/5 text-center group hover:bg-white/[0.06] transition-colors"
            >
              <span className="text-sm sm:text-base md:text-lg font-display font-bold text-white tracking-tight flex items-baseline justify-center group-hover:text-accent transition-colors">
                <span className="tabular-nums">{item.value}</span>
                {item.suffix && <span className="text-accent text-xs sm:text-sm ml-0.5">{item.suffix}</span>}
              </span>
              <span className="text-[7px] sm:text-[7.5px] md:text-[8px] font-mono uppercase tracking-wider text-white/50 font-medium leading-tight mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 2. Desktop Vertical Laser Spine */}
      {(variant === "auto" || variant === "vertical") && (
        <div
          className={cn(
            "relative pl-5 border-l-2 border-white/20 space-y-7 transition-colors py-1",
            variant === "auto" && "hidden lg:block"
          )}
        >
          {/* Full-Height Animated Scanning Laser Pulse */}
          <div 
            className="absolute -left-[2px] w-[3px] h-16 bg-gradient-to-b from-transparent via-accent to-white animate-laser-scan pointer-events-none rounded-full shadow-[0_0_12px_#4B9EFF,0_0_24px_rgba(75,158,255,0.9)]"
          >
            {/* Laser Head Glow Dot */}
            <div className="absolute bottom-0 -left-[2.5px] size-2 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_16px_#4B9EFF]" />
          </div>

          {metrics.map((item, idx) => (
            <div key={idx} className="group flex flex-col cursor-default">
              <span className="text-2xl xl:text-3xl font-display font-bold text-white tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:text-accent group-hover:drop-shadow-[0_0_12px_rgba(75,158,255,0.4)] transition-all duration-300 flex items-baseline">
                <span className="font-mono tabular-nums">{item.value}</span>
                {item.suffix && <span className="text-accent text-xl xl:text-2xl ml-0.5">{item.suffix}</span>}
              </span>
              <span className="text-[10px] xl:text-[11px] font-mono uppercase tracking-[0.22em] text-white/70 font-medium leading-tight mt-1.5 group-hover:text-white/95 transition-colors duration-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
