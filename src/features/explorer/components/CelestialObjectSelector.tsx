"use client";

import { useRef, useEffect } from "react";
import { getAllCelestialObjects } from "../adapters/sketchfab-solar-system";
import { cn } from "@/lib/utils";

interface CelestialObjectSelectorProps {
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  className?: string;
}

export function CelestialObjectSelector({
  selectedObjectId,
  onSelectObject,
  className,
}: CelestialObjectSelectorProps) {
  const allObjects = getAllCelestialObjects();
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll active item into view on smaller screens
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedObjectId]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={cn(
        "relative w-full overflow-x-auto no-scrollbar py-2 px-3 flex items-center justify-start gap-1.5 sm:gap-2 touch-pan-x select-none",
        className
      )}
      role="tablist"
      aria-label="Solar System Celestial Object Selector"
    >
      {allObjects.map((obj) => {
        const isSelected = obj.domain.id === selectedObjectId;

        return (
          <button
            key={obj.domain.id}
            ref={isSelected ? activeBtnRef : null}
            role="tab"
            aria-selected={isSelected}
            aria-label={`Select ${obj.domain.name} (${obj.domain.solId})`}
            onClick={() => onSelectObject(obj.domain.id)}
            className={cn(
              "group relative shrink-0 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border font-mono text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isSelected
                ? "bg-white/[0.08] border-accent/60 text-white shadow-[0_0_12px_rgba(75,158,255,0.25)]"
                : "bg-white/[0.02] hover:bg-white/[0.05] border-white/10 text-white/60 hover:text-white/90"
            )}
          >
            {/* Visual Planet Miniature Orb */}
            <div className="relative size-4 sm:size-4.5 rounded-full flex items-center justify-center shrink-0">
              <div
                className="size-3.5 sm:size-4 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: obj.visual.color,
                  boxShadow: isSelected ? `0 0 8px ${obj.visual.glowColor}` : "none",
                }}
              />
              {isSelected && (
                <div
                  className="absolute -inset-0.5 rounded-full border border-accent animate-ping opacity-40"
                  style={{ animationDuration: "2.5s" }}
                />
              )}
            </div>

            {/* Object Name & SOL ID */}
            <div className="flex flex-col items-start leading-none">
              <span
                className={cn(
                  "font-sans font-bold text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wider",
                  isSelected ? "text-white" : "text-white/80"
                )}
              >
                {obj.domain.name.replace("The ", "")}
              </span>
              <span className="font-mono text-[7.5px] sm:text-[8px] text-white/40 uppercase mt-0.5">
                {obj.domain.solId}
              </span>
            </div>

            {/* Active Indicator Pip */}
            {isSelected && (
              <span className="size-1 rounded-full bg-accent ml-0.5 shadow-[0_0_4px_#4B9EFF]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
