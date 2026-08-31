"use client";

import React, { useState } from "react";
import { SPACE_MISSIONS } from "@/lib/data/mock/missions";
import { SpacecraftViewer } from "./SpacecraftViewer";
import { MissionSidebar } from "./MissionSidebar";
import { Rocket, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionsStageProps {
  onOpenAI?: (missionName?: string) => void;
}

export function MissionsStage({ onOpenAI }: MissionsStageProps) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>("mission_jwst");
  const [mobileViewMode, setMobileViewMode] = useState<"spacecraft" | "sidebar">("spacecraft");

  const selectedMissionIndex = SPACE_MISSIONS.findIndex(m => m.id === selectedMissionId);
  const selectedMission = SPACE_MISSIONS[selectedMissionIndex >= 0 ? selectedMissionIndex : 0];

  const handleSelectMission = (id: string | null) => {
    setSelectedMissionId(id);
  };

  const handleNextMission = () => {
    const nextIndex = (selectedMissionIndex + 1) % SPACE_MISSIONS.length;
    setSelectedMissionId(SPACE_MISSIONS[nextIndex].id);
  };

  const handlePrevMission = () => {
    const prevIndex = (selectedMissionIndex - 1 + SPACE_MISSIONS.length) % SPACE_MISSIONS.length;
    setSelectedMissionId(SPACE_MISSIONS[prevIndex].id);
  };

  const handleOpenAIGuide = (missionName: string) => {
    if (onOpenAI) {
      onOpenAI(missionName);
    } else {
      window.dispatchEvent(
        new CustomEvent("cosmora:open-ai", {
          detail: { query: `Tell me about the ${missionName} space mission, its instruments, and scientific discoveries.` }
        })
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full max-h-full min-h-0 overflow-hidden relative select-none">
      
      {/* 1. Mobile Top View Mode Switcher Pill (Visible strictly on screens < md) */}
      <div className="flex md:hidden items-center justify-between gap-1.5 p-1 rounded-xl bg-[#0B0F17]/90 backdrop-blur-xl border border-white/15 mb-2 shrink-0 select-none shadow-lg z-30">
        <button
          type="button"
          onClick={() => setMobileViewMode("spacecraft")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
            mobileViewMode === "spacecraft"
              ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]"
              : "text-white/60 hover:text-white hover:bg-white/[0.04]"
          )}
        >
          <Rocket className="size-3.5 shrink-0" />
          <span className="truncate">3D SPACECRAFT</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileViewMode("sidebar")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
            mobileViewMode === "sidebar"
              ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]"
              : "text-white/60 hover:text-white hover:bg-white/[0.04]"
          )}
        >
          <Compass className="size-3.5 shrink-0" />
          <span className="truncate">{selectedMission ? selectedMission.name : `FLEET (${SPACE_MISSIONS.length})`}</span>
        </button>
      </div>

      {/* 2. Main Responsive Cockpit Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch gap-3 md:gap-4 lg:gap-5 w-full h-full max-h-full min-h-0 overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER: 3D SPACECRAFT INTERACTIVE VIEWPORT                         */}
        {/* ========================================================================= */}
        <div 
          className={cn(
            "w-full md:flex-1 relative overflow-hidden transition-all duration-300 min-h-0 rounded-2xl md:rounded-3xl border border-white/10 bg-[#05070A]",
            // Mobile: full-height in spacecraft mode, hidden in sidebar mode. Tablet/Desktop: always visible flex-1
            mobileViewMode === "spacecraft" ? "flex-1 flex h-full" : "hidden md:flex md:h-full"
          )}
        >
          {/* Top Spacecraft Mission Breadcrumb Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 pointer-events-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-white shadow-xl">
              <span className="size-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="text-white/50">STAGE 05 //</span>
              <span className="font-bold text-accent truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                {selectedMission.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 3D Canvas with Responsive Navigation Controls */}
          <div className="w-full h-full">
            <SpacecraftViewer 
              mission={selectedMission} 
              onSelectInstrument={() => {}}
              onViewDossier={() => setMobileViewMode("sidebar")}
              onNextMission={handleNextMission}
              onPrevMission={handlePrevMission}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: EXECUTIVE MISSION CONTROL DOSSIER HUD                              */}
        {/* ========================================================================= */}
        <div 
          className={cn(
            "w-full md:w-[350px] lg:w-[420px] xl:w-[460px] 2xl:w-[500px] md:h-full relative z-10 flex flex-col rounded-2xl md:rounded-3xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] shrink-0 overflow-hidden min-h-0 transition-all duration-300",
            // Mobile: full-height in sidebar mode, hidden in spacecraft mode. Tablet/Desktop: always visible
            mobileViewMode === "sidebar" ? "flex-1 flex h-full" : "hidden md:flex"
          )}
        >
          <MissionSidebar
            missions={SPACE_MISSIONS}
            selectedId={selectedMissionId}
            onSelect={handleSelectMission}
            onOpenAIGuide={handleOpenAIGuide}
            onView3D={() => setMobileViewMode("spacecraft")}
          />
        </div>

      </div>
    </div>
  );
}
