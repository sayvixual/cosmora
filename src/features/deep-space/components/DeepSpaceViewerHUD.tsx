"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  RotateCw,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
} from "lucide-react";

export interface DeepSpaceViewerHUDProps {
  primaryToggle?: {
    active: boolean;
    onToggle: () => void;
    label: string;
    icon?: React.ReactNode;
    activeColorClass?: string;
    title: string;
  };
  dragMode?: {
    mode: "rotate" | "pan";
    onToggle: () => void;
  };
  featureToggle?: {
    active: boolean;
    onToggle: () => void;
    label: string;
    icon?: React.ReactNode;
    activeColorClass?: string;
    title: string;
  };
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  className?: string;
}

export function DeepSpaceViewerHUD({
  primaryToggle,
  dragMode,
  featureToggle,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  className,
}: DeepSpaceViewerHUDProps) {
  return (
    <div
      className={cn(
        "absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-[#060912]/90 backdrop-blur-xl border border-white/20 shadow-2xl z-30 select-none",
        className
      )}
    >
      {/* 1. Primary Toggle (Rotation, Flow, Orbit) */}
      {primaryToggle && (
        <button
          type="button"
          onClick={primaryToggle.onToggle}
          className={cn(
            "flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-[9px] sm:text-[10px] font-semibold transition-all active:scale-95 cursor-pointer min-h-[26px] sm:min-h-[28px]",
            primaryToggle.active
              ? primaryToggle.activeColorClass ||
                  "bg-accent/25 text-accent border border-accent/40 shadow-[0_0_10px_rgba(75,158,255,0.25)]"
              : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
          )}
          title={primaryToggle.title}
        >
          {primaryToggle.icon || (
            <RotateCw
              className={cn(
                "size-3 sm:size-3.5 shrink-0",
                primaryToggle.active && "animate-[spin_4s_linear_infinite]"
              )}
            />
          )}
          <span className="hidden sm:inline">
            {primaryToggle.label} ({primaryToggle.active ? "ON" : "OFF"})
          </span>
        </button>
      )}

      {/* 2. Drag Mode Toggle (Rotate vs Pan) */}
      {dragMode && (
        <button
          type="button"
          onClick={dragMode.onToggle}
          className={cn(
            "flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-[9px] sm:text-[10px] font-semibold transition-all active:scale-95 cursor-pointer min-h-[26px] sm:min-h-[28px]",
            dragMode.mode === "pan"
              ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(0,230,118,0.25)]"
              : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
          )}
          title={
            dragMode.mode === "pan"
              ? "Pan Mode (Drag to move canvas)"
              : "Rotate Mode (Drag to orbit 360°)"
          }
        >
          {dragMode.mode === "pan" ? (
            <Move className="size-3 sm:size-3.5 shrink-0 text-emerald-400" />
          ) : (
            <RotateCcw className="size-3 sm:size-3.5 shrink-0 text-white/70" />
          )}
          <span className="hidden sm:inline">
            {dragMode.mode === "pan" ? "PAN" : "ORBIT"}
          </span>
        </button>
      )}

      {/* 3. Feature Toggle (Callouts, Structures, Nebula, Orbits) */}
      {featureToggle && (
        <button
          type="button"
          onClick={featureToggle.onToggle}
          className={cn(
            "flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-[9px] sm:text-[10px] font-semibold transition-all active:scale-95 cursor-pointer min-h-[26px] sm:min-h-[28px]",
            featureToggle.active
              ? featureToggle.activeColorClass ||
                  "bg-purple-500/25 text-purple-300 border border-purple-500/40"
              : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
          )}
          title={featureToggle.title}
        >
          {featureToggle.icon || <Layers className="size-3 sm:size-3.5 shrink-0" />}
          <span className="hidden sm:inline">{featureToggle.label}</span>
        </button>
      )}

      <div className="w-[1px] h-3 sm:h-3.5 bg-white/20 mx-0.5 shrink-0" />

      {/* 4. Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn className="size-3.5 sm:size-4" />
      </button>

      {/* 5. Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <ZoomOut className="size-3.5 sm:size-4" />
      </button>

      {/* 6. Reset Camera */}
      <button
        type="button"
        onClick={onResetCamera}
        className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        title="Reset Camera View"
        aria-label="Reset Camera View"
      >
        <Maximize2 className="size-3 sm:size-3.5" />
      </button>
    </div>
  );
}
