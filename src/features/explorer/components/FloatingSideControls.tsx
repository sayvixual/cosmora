"use client";

import React from "react";
import { CameraMode } from "../hooks/useSolarSystemExplorer";
import { CelestialCompositeObject } from "../adapters/sketchfab-solar-system";
import {
  ArrowLeft,
  Orbit,
  Layers,
  Bot,
  Play,
  Pause,
  Info,
  Focus,
  Maximize2,
  Minimize2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingSideControlsProps {
  activeObject?: CelestialCompositeObject;
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  togglePause: () => void;
  showOrbits: boolean;
  setShowOrbits: React.Dispatch<React.SetStateAction<boolean>>;
  showBelts: boolean;
  setShowBelts: React.Dispatch<React.SetStateAction<boolean>>;
  showLabels?: boolean;
  setShowLabels?: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectStage?: (stage: "home" | "explore") => void;
  onOpenAI?: () => void;
  onOpenAttribution?: () => void;
  className?: string;
}

export function FloatingSideControls({
  cameraMode,
  setCameraMode,
  simulationSpeed,
  setSimulationSpeed,
  isPaused,
  togglePause,
  showOrbits,
  setShowOrbits,
  showBelts,
  setShowBelts,
  showLabels = true,
  setShowLabels,
  onSelectStage,
  onOpenAI,
  onOpenAttribution,
  className,
}: FloatingSideControlsProps) {
  // Cycle simulation speed
  const handleCycleSpeed = () => {
    if (simulationSpeed === 1) setSimulationSpeed(3);
    else if (simulationSpeed === 3) setSimulationSpeed(8);
    else setSimulationSpeed(1);
  };

  return (
    <aside
      className={cn(
        "flex flex-col items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-[#080B10]/85 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.8)] select-none relative z-40 shrink-0",
        className
      )}
      aria-label="Floating Controls Deck"
    >
      {/* 1. Return Home Button */}
      <button
        type="button"
        onClick={() => onSelectStage?.("home")}
        className="group relative flex items-center justify-center size-8 sm:size-9 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Return to 01 Home (Press 1 or Esc)"
      >
        <ArrowLeft className="size-3.5 sm:size-4 text-accent group-hover:-translate-x-0.5 transition-transform" />
        <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          01 HOME (ESC)
        </span>
      </button>

      <div className="w-4 sm:w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 2. Camera View Modes (Focus / Overview / TopDown) */}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={() => setCameraMode("focus")}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
            cameraMode === "focus"
              ? "bg-accent text-black font-bold shadow-[0_0_12px_rgba(75,158,255,0.4)] scale-105"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
          aria-label="Camera Focus on Planet"
        >
          <Focus className="size-3.5 sm:size-4" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Camera: Focus
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCameraMode("overview")}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
            cameraMode === "overview"
              ? "bg-accent text-black font-bold shadow-[0_0_12px_rgba(75,158,255,0.4)] scale-105"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
          aria-label="Wide 3D Orbit Overview"
        >
          <Maximize2 className="size-3.5 sm:size-4" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Camera: 3D Overview
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCameraMode("topdown")}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
            cameraMode === "topdown"
              ? "bg-accent text-black font-bold shadow-[0_0_12px_rgba(75,158,255,0.4)] scale-105"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
          aria-label="2D Top-Down Orbital View"
        >
          <Minimize2 className="size-3.5 sm:size-4" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Camera: Top-Down
          </span>
        </button>
      </div>

      <div className="w-4 sm:w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 3. Simulation Kinematics Controls */}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
        {/* Play/Pause Toggle */}
        <button
          type="button"
          onClick={togglePause}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
            isPaused
              ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
          aria-label={isPaused ? "Resume Simulation" : "Pause Simulation"}
        >
          {isPaused ? <Play className="size-3 sm:size-3.5" /> : <Pause className="size-3 sm:size-3.5" />}
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {isPaused ? "Resume Motion" : "Pause Motion"}
          </span>
        </button>

        {/* Speed Cycle Button */}
        <button
          type="button"
          onClick={handleCycleSpeed}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg font-mono text-[9px] sm:text-[10px] font-bold border transition-all cursor-pointer",
            !isPaused
              ? "bg-accent/15 border-accent/40 text-accent"
              : "bg-white/[0.03] border-white/10 text-white/50"
          )}
          aria-label="Cycle Simulation Speed (1x, 3x, 8x)"
        >
          {simulationSpeed}x
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Speed: {simulationSpeed}x (Click to change)
          </span>
        </button>
      </div>

      <div className="w-4 sm:w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 4. Display Layer Toggles (Orbits, Belts, Labels) */}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={() => setShowOrbits((prev) => !prev)}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
            showOrbits
              ? "bg-accent/15 border border-accent/40 text-accent shadow-[0_0_8px_rgba(75,158,255,0.25)]"
              : "text-white/40 hover:text-white hover:bg-white/10"
          )}
          aria-label="Toggle Orbit Lines"
        >
          <Orbit className="size-3.5 sm:size-4" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Toggle Orbits ({showOrbits ? "ON" : "OFF"})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowBelts((prev) => !prev)}
          className={cn(
            "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
            showBelts
              ? "bg-accent/15 border border-accent/40 text-accent shadow-[0_0_8px_rgba(75,158,255,0.25)]"
              : "text-white/40 hover:text-white hover:bg-white/10"
          )}
          aria-label="Toggle Asteroid Belt"
        >
          <Layers className="size-3.5 sm:size-4" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Toggle Asteroid Belt ({showBelts ? "ON" : "OFF"})
          </span>
        </button>

        {setShowLabels && (
          <button
            type="button"
            onClick={() => setShowLabels((prev) => !prev)}
            className={cn(
              "group relative flex items-center justify-center size-7 sm:size-8 rounded-lg transition-all cursor-pointer",
              showLabels
                ? "bg-accent/15 border border-accent/40 text-accent shadow-[0_0_8px_rgba(75,158,255,0.25)]"
                : "text-white/40 hover:text-white hover:bg-white/10"
            )}
            aria-label="Toggle Planet Labels"
          >
            <Tag className="size-3.5 sm:size-4" />
            <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              Toggle Planet Labels ({showLabels ? "ON" : "OFF"})
            </span>
          </button>
        )}
      </div>

      <div className="w-4 sm:w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 5. AI Action & Attribution Info */}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={onOpenAI}
          className="group relative flex items-center justify-center size-7 sm:size-8 rounded-lg bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent transition-all hover:scale-105 shadow-[0_0_10px_rgba(75,158,255,0.3)] cursor-pointer"
          aria-label="Ask Cosmos AI"
        >
          <Bot className="size-3.5 sm:size-4 animate-pulse" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Ask Cosmos AI
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenAttribution}
          className="group relative flex items-center justify-center size-7 sm:size-8 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          aria-label="CC BY Model Attribution & Sources"
        >
          <Info className="size-3.5 sm:size-4" />
          <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0D1117]/95 backdrop-blur-md border border-white/20 text-[10.5px] font-mono text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            CC BY 4.0 Attribution & Sources
          </span>
        </button>
      </div>
    </aside>
  );
}
