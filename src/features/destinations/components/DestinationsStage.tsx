"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EarthGlobe } from "./EarthGlobe";
import { DestinationSidebar } from "./DestinationSidebar";
import { destinations } from "@/lib/data/mock/destinations";
import { Globe, Compass, ArrowRight, X, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationsStageProps {
  onSelectStage?: (stage: "home" | "explore" | "deepspace" | "destinations") => void;
  onOpenAI?: (destinationName?: string) => void;
}

export function DestinationsStage({ onSelectStage, onOpenAI }: DestinationsStageProps) {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [hoveredDestinationId, setHoveredDestinationId] = useState<string | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<"globe" | "sidebar">("sidebar");

  const selectedDestination = destinations.find(d => d.id === selectedDestinationId);

  const handleSelectDestination = (id: string | null) => {
    setSelectedDestinationId(id);
  };

  const handleOpenAIGuide = (destinationName: string) => {
    if (onOpenAI) {
      onOpenAI(destinationName);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full max-h-full min-h-0 overflow-hidden relative">
      
      {/* 1. Mobile Top View Mode Switcher Pill (Visible only on screens < md) */}
      <div className="flex md:hidden items-center justify-between gap-1.5 p-1 rounded-xl bg-[#0B0F17]/90 backdrop-blur-xl border border-white/15 mb-2 shrink-0 select-none shadow-lg z-30">
        <button
          type="button"
          onClick={() => setMobileViewMode("globe")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
            mobileViewMode === "globe"
              ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]"
              : "text-white/60 hover:text-white hover:bg-white/[0.04]"
          )}
        >
          <Globe className="size-3.5" />
          <span>3D GLOBE</span>
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
          <Compass className="size-3.5" />
          <span>{selectedDestinationId ? "SITE DOSSIER" : `DIRECTORY (${destinations.length})`}</span>
        </button>
      </div>

      {/* 2. Main Responsive Cockpit Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch gap-3 md:gap-4 lg:gap-5 w-full h-full max-h-full min-h-0 overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT / CENTER: 3D EARTH GLOBE VIEWPORT                                    */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "w-full md:flex-1 relative overflow-hidden transition-all duration-300 min-h-0",
            // On mobile, show full-height when in globe mode, hide when in sidebar mode
            mobileViewMode === "globe" ? "flex-1 flex h-full" : "hidden md:flex md:h-full"
          )}
        >
          {/* Canvas Viewport */}
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} gl={{ alpha: true }}>
              <Suspense fallback={null}>
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <EarthGlobe 
                  destinations={destinations} 
                  selectedId={selectedDestinationId} 
                  hoveredId={hoveredDestinationId}
                  onSelect={(id) => {
                    handleSelectDestination(id);
                  }} 
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Top-Left Tactical Stage Indicator Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 pointer-events-none select-none">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#05070A]/85 backdrop-blur-md border border-white/15 text-white font-mono text-[9px] sm:text-[10px] uppercase shadow-xl">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-white/50">STAGE 04 //</span>
              <span className="font-bold text-accent">TERRESTRIAL OBSERVATORIES</span>
            </div>
          </div>

          {/* Mobile Bottom Floating Preview Card (When Globe Mode is Active on Mobile) */}
          <div className="md:hidden absolute bottom-3 left-3 right-3 z-50 pointer-events-auto">
            {selectedDestination ? (
              <div className="p-3 rounded-2xl bg-[#0B0F17]/95 backdrop-blur-2xl border border-accent/40 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(75,158,255,0.25)] flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="size-2 rounded-full bg-accent animate-ping shrink-0" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold truncate">
                      {selectedDestination.region}, {selectedDestination.countryCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDestinationId(null)}
                    className="p-1 rounded-lg text-white/40 hover:text-white bg-white/5 hover:bg-white/10 shrink-0 cursor-pointer active:scale-95 transition-all"
                    title="Close selection"
                    aria-label="Close selection"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-sm text-white truncate leading-snug">
                      {selectedDestination.name}
                    </h3>
                    <p className="font-mono text-[9px] text-white/50 truncate mt-0.5">
                      {selectedDestination.elevationM > 0 ? `${selectedDestination.elevationM.toLocaleString()}m` : "Sea Level"} • Bortle {selectedDestination.observationContext?.skyQuality || 1}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileViewMode("sidebar")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-black font-mono font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_12px_rgba(75,158,255,0.4)] shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>DOSSIER</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 px-3.5 rounded-xl bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 text-center shadow-lg flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-left min-w-0">
                  <MapPin className="size-3.5 text-accent shrink-0 animate-bounce" />
                  <span className="font-mono text-[9.5px] text-white/70 truncate">
                    Tap any marker to view data
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileViewMode("sidebar")}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[9.5px] font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                >
                  DIRECTORY →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: EXECUTIVE OBSERVATORY DIRECTORY & DOSSIER SIDEBAR HUD       */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "w-full md:w-[380px] lg:w-[440px] xl:w-[480px] md:h-full relative z-10 flex flex-col rounded-2xl md:rounded-3xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] shrink-0 overflow-hidden min-h-0 transition-all duration-300",
            // On mobile, show full-height when in sidebar mode, hide when in globe mode
            mobileViewMode === "sidebar" ? "flex-1 flex h-full" : "hidden md:flex"
          )}
        >
          <DestinationSidebar 
            destinations={destinations} 
            selectedId={selectedDestinationId} 
            onSelect={handleSelectDestination}
            onHover={setHoveredDestinationId}
            onOpenAIGuide={handleOpenAIGuide}
            onViewOnGlobe={() => setMobileViewMode("globe")}
          />
        </div>

      </div>
    </div>
  );
}
