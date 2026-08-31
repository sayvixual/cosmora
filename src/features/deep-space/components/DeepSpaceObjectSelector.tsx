"use client";

import React, { useRef, useEffect } from "react";
import { DEEP_SPACE_OBJECTS, DeepSpaceDomainObject } from "@/lib/data/deep-space";
import { cn } from "@/lib/utils";

interface DeepSpaceObjectSelectorProps {
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  className?: string;
}

export function DeepSpaceObjectSelector({
  selectedObjectId,
  onSelectObject,
  className,
}: DeepSpaceObjectSelectorProps) {
  const allObjects = Object.values(DEEP_SPACE_OBJECTS);
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

  const normalizeId = (id: string) => (id === "orion" ? "orion-nebula" : id);
  const currentNormalized = normalizeId(selectedObjectId);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={cn(
        "relative w-full overflow-x-auto scrollbar-none py-1.5 px-2.5 sm:px-4 flex items-center justify-start gap-1.5 sm:gap-2 touch-pan-x select-none shrink-0 bg-white/[0.015] border-b border-white/10",
        className
      )}
      role="tablist"
      aria-label="Deep Space Cosmic Object Selector"
    >
      {allObjects.map((obj: DeepSpaceDomainObject) => {
        const isSelected = obj.id === currentNormalized || obj.id === selectedObjectId;

        return (
          <button
            key={obj.id}
            ref={isSelected ? activeBtnRef : null}
            role="tab"
            aria-selected={isSelected}
            aria-label={`Select ${obj.name} (${obj.distanceValue})`}
            onClick={() => onSelectObject(obj.id)}
            className={cn(
              "group relative shrink-0 flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border font-mono transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isSelected
                ? "bg-white/[0.09] text-white shadow-lg"
                : "bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-white/60 hover:text-white/90"
            )}
            style={{
              borderColor: isSelected ? `${obj.color}80` : undefined,
              boxShadow: isSelected
                ? `0 0 16px ${obj.color}35, inset 0 0 12px ${obj.color}15`
                : undefined,
            }}
          >
            {/* Miniature Cosmic Orb with Glow */}
            <div className="relative size-3.5 sm:size-4 rounded-full flex items-center justify-center shrink-0">
              <div
                className="size-2.5 sm:size-3 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: obj.color,
                  boxShadow: isSelected ? `0 0 8px ${obj.color}` : "none",
                }}
              />
              {isSelected && (
                <div
                  className="absolute -inset-0.5 rounded-full border animate-ping opacity-50"
                  style={{
                    borderColor: obj.color,
                    animationDuration: "2.5s",
                  }}
                />
              )}
            </div>

            {/* Object Title & Distance */}
            <div className="flex flex-col items-start leading-none text-left">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "font-sans font-bold text-[10.5px] sm:text-xs uppercase tracking-wider",
                    isSelected ? "text-white" : "text-white/80"
                  )}
                >
                  {obj.name
                    .replace(" GALAXY", "")
                    .replace(" SYSTEM", "")
                    .replace(" STAR CLUSTER", "")
                    .replace(" EMISSION", "")}
                </span>
                <span
                  className="font-mono text-[7.5px] px-1 py-0.2 rounded font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${obj.color}20`,
                    color: obj.color,
                  }}
                >
                  {obj.category}
                </span>
              </div>

              <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase mt-0.5">
                {obj.distanceValue}
              </span>
            </div>

            {/* Active Pip */}
            {isSelected && (
              <span
                className="size-1 rounded-full ml-0.5 animate-pulse"
                style={{ backgroundColor: obj.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
