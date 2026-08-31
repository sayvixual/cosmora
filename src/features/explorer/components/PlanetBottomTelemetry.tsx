"use client";

import React from "react";
import { CelestialCompositeObject } from "../adapters/sketchfab-solar-system";
import { CelestialObjectSelector } from "./CelestialObjectSelector";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanetBottomTelemetryProps {
  activeObject: CelestialCompositeObject;
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  onOpenAI?: () => void;
  onOpenDeepInspect?: (planetId: string) => void;
  className?: string;
}

export function PlanetBottomTelemetry({
  activeObject,
  selectedObjectId,
  onSelectObject,
  onOpenAI,
  onOpenDeepInspect,
  className,
}: PlanetBottomTelemetryProps) {
  const domain = activeObject?.domain;
  const visual = activeObject?.visual;

  if (!domain || !visual) return null;

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#080B10]/90 backdrop-blur-xl border border-white/10 shadow-2xl shrink-0 z-30 select-none",
        className
      )}
    >
      {/* 1. Top Row: 10-Planet Selector Dock */}
      <div className="w-full">
        <CelestialObjectSelector
          selectedObjectId={selectedObjectId}
          onSelectObject={onSelectObject}
        />
      </div>

      {/* 2. Bottom Row: Comprehensive Horizontal Telemetry Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 pt-1.5 sm:pt-2 border-t border-white/10">
        
        {/* Left: Identity & Holographic Orb */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
          <div className="relative size-8 sm:size-10 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border border-dashed border-accent/40 animate-[spin_10s_linear_infinite]" />
            <div
              className="size-5.5 sm:size-7 rounded-full flex items-center justify-center border border-white/20 shadow-md"
              style={{
                backgroundColor: visual.color,
                boxShadow: `0 0 12px ${visual.glowColor}`,
              }}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 font-mono text-[7.5px] sm:text-[8px] md:text-[8.5px] uppercase tracking-[0.2em] text-white/40">
              <span className="size-1 rounded-full bg-accent animate-pulse" />
              <span>{domain.solId} {"//"} TARGET</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-display font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white uppercase leading-none truncate">
                {domain.name}
              </h3>
            </div>
            <span className="font-mono text-[8px] sm:text-[9px] md:text-[9.5px] text-accent font-medium mt-0.5 truncate">
              {domain.classification}
            </span>
          </div>
        </div>

        {/* Center: 4 Concise Scientific Metric Cards in a Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 flex-1 font-mono">
          <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] min-w-0">
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] uppercase tracking-wider text-white/40 block">
              DISTANCE
            </span>
            <span className="text-[10.5px] sm:text-xs md:text-sm lg:text-base font-bold text-white font-display block mt-0.5 truncate">
              {domain.distanceAU} <span className="text-[8px] sm:text-[8.5px] md:text-[9px] text-accent font-normal">AU</span>
            </span>
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] text-white/40 block truncate">
              {domain.distanceKm}
            </span>
          </div>

          <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] min-w-0">
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] uppercase tracking-wider text-white/40 block">
              ROTATION
            </span>
            <span className="text-[10.5px] sm:text-xs md:text-sm lg:text-base font-bold text-white font-display block mt-0.5 truncate" title={domain.rotationPeriod}>
              {domain.rotationPeriod.replace(/\s*\(.*?\)/, "")}
            </span>
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] text-emerald-400 block truncate">
              Tilt: {domain.axialTiltDeg}°
            </span>
          </div>

          <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] min-w-0">
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] uppercase tracking-wider text-white/40 block">
              DIAMETER
            </span>
            <span className="text-[10.5px] sm:text-xs md:text-sm lg:text-base font-bold text-white font-display block mt-0.5 truncate">
              {domain.diameterKm}
            </span>
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] text-white/40 block truncate">
              {domain.diameterRatioToEarth}x Earth
            </span>
          </div>

          <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] min-w-0">
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] uppercase tracking-wider text-white/40 block">
              {domain.type === "star" ? "MAJOR BODIES" : "MOONS"}
            </span>
            <span className="text-[10.5px] sm:text-xs md:text-sm lg:text-base font-bold text-white font-display block mt-0.5 truncate">
              {domain.type === "star"
                ? "8 Planets"
                : `${domain.moonsCount} ${domain.moonsCount === 1 ? "Moon" : "Moons"}`}
            </span>
            <span className="text-[7px] sm:text-[7.5px] md:text-[8px] text-accent block truncate" title={domain.moonsList?.join(", ") || (domain.moonsCount === 0 ? "No Satellites" : "")}>
              {domain.moonsList && domain.moonsList.length > 0
                ? domain.moonsList.slice(0, 2).join(", ")
                : domain.moonsCount === 0
                ? "No Satellites"
                : `${domain.moonsCount} Satellites`}
            </span>
          </div>
        </div>

        {/* Right: Investigation Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenDeepInspect?.(domain.id)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-black font-mono text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shrink-0 shadow-[0_0_16px_rgba(75,158,255,0.35)] cursor-pointer"
            title={`Investigate High-Resolution Standalone 3D Model of ${domain.name}`}
          >
            <Eye className="size-3.5 sm:size-4 text-black" />
            <span>INVESTIGATION</span>
          </button>
        </div>

      </div>
    </div>
  );
}
