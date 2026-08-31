"use client";

import React, { useState } from "react";
import { DeepSpaceDomainObject } from "@/lib/data/deep-space";
import { Andromeda3DViewer } from "./Andromeda3DViewer";
import { OrionNebulaViewer } from "./OrionNebulaViewer";
import { PleiadesClusterViewer } from "./PleiadesClusterViewer";
import { AlphaCentauriViewer } from "./AlphaCentauriViewer";
import { MilkyWay3DViewer } from "./MilkyWay3DViewer";
import { cn } from "@/lib/utils";
import {
  X,
  Compass,
  Radio,
  Eye,
  Camera,
  BookOpen,
  Bot,
  Layers,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";

interface UnifiedDeepSpaceViewerProps {
  objectData: DeepSpaceDomainObject;
  onClose: () => void;
  onOpenAI?: () => void;
  onOpenAction?: (action: "observe" | "photo" | "research" | "visit") => void;
}

export function UnifiedDeepSpaceViewer({
  objectData,
  onClose,
  onOpenAI,
  onOpenAction,
}: UnifiedDeepSpaceViewerProps) {
  const [wavelength, setWavelength] = useState<"visible" | "infrared" | "ultraviolet">("visible");
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);

  const activeCallout = objectData.callouts.find((c) => c.id === activeCalloutId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deep-space-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 select-none pointer-events-auto"
    >
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[92vh] md:h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#06080D]/98 border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.98)] overflow-hidden z-50">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 shrink-0 bg-white/[0.02] gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div
              className="size-8 sm:size-9 rounded-xl border flex items-center justify-center shadow-lg shrink-0"
              style={{
                backgroundColor: `${objectData.color}25`,
                borderColor: `${objectData.color}60`,
                color: objectData.color,
              }}
            >
              <Compass className="size-4 sm:size-5" />
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center flex-wrap gap-1.5 min-w-0 leading-none">
                <h1
                  id="deep-space-title"
                  className="font-display font-bold text-xs sm:text-base md:text-lg text-white uppercase tracking-wider truncate"
                >
                  {objectData.name} <span className="text-white/40 font-normal hidden xs:inline sm:inline">— INVESTIGATION</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 font-mono text-[7.5px] sm:text-[8.5px] text-accent border border-accent/30 font-semibold uppercase shrink-0">
                  {objectData.renderingMode.toUpperCase()}
                </span>
              </div>
              <span className="font-mono text-[8px] sm:text-[9.5px] text-white/50 tracking-wider truncate mt-0.5">
                {objectData.catalogId} • {objectData.typeLabel}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
            {/* Multi-Wavelength Filter Selector */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 font-mono text-[8px] sm:text-[10px]">
              <button
                type="button"
                onClick={() => setWavelength("visible")}
                className={cn(
                  "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all cursor-pointer font-bold",
                  wavelength === "visible"
                    ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <span className="sm:hidden">OPT</span>
                <span className="hidden sm:inline">OPTICAL</span>
              </button>
              <button
                type="button"
                onClick={() => setWavelength("infrared")}
                className={cn(
                  "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all cursor-pointer font-bold",
                  wavelength === "infrared"
                    ? "bg-amber-500 text-black shadow-[0_0_12px_rgba(255,167,38,0.5)]"
                    : "text-white/60 hover:text-amber-300 hover:bg-white/10"
                )}
              >
                <span className="sm:hidden">IR</span>
                <span className="hidden sm:inline">INFRARED</span>
              </button>
              <button
                type="button"
                onClick={() => setWavelength("ultraviolet")}
                className={cn(
                  "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all cursor-pointer font-bold",
                  wavelength === "ultraviolet"
                    ? "bg-purple-500 text-white shadow-[0_0_12px_rgba(156,39,176,0.6)]"
                    : "text-white/60 hover:text-purple-300 hover:bg-white/10"
                )}
              >
                <span className="sm:hidden">UV</span>
                <span className="hidden sm:inline">UV / X-RAY</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center size-8 sm:size-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="size-4 sm:size-5" />
            </button>
          </div>
        </div>

        {/* Modal Center Body: Viewport (Left/Center) + Telemetry & Callout Drawer (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* Main Visualizer Stage */}
          <div className="relative flex-1 w-full h-[32vh] sm:h-[38vh] md:h-[42vh] lg:h-full min-h-[220px] sm:min-h-[280px] overflow-hidden bg-black flex items-center justify-center shrink-0">
            {objectData.id === "andromeda" && objectData.gltfModelUrl && (
              <Andromeda3DViewer
                modelUrl={objectData.gltfModelUrl}
                callouts={objectData.callouts}
                activeCalloutId={activeCalloutId}
                onSelectCallout={setActiveCalloutId}
                wavelength={wavelength}
              />
            )}

            {objectData.id === "orion-nebula" && (
              <OrionNebulaViewer
                primaryImageUrl={objectData.primaryImageUrl}
                secondaryImageUrl={objectData.secondaryImageUrl}
                callouts={objectData.callouts}
                activeCalloutId={activeCalloutId}
                onSelectCallout={setActiveCalloutId}
                wavelength={wavelength}
              />
            )}

            {objectData.id === "pleiades" && (
              <PleiadesClusterViewer
                primaryImageUrl={objectData.primaryImageUrl}
                callouts={objectData.callouts}
                activeCalloutId={activeCalloutId}
                onSelectCallout={setActiveCalloutId}
                wavelength={wavelength}
              />
            )}

            {objectData.id === "alpha-centauri" && (
              <AlphaCentauriViewer
                primaryImageUrl={objectData.primaryImageUrl}
                callouts={objectData.callouts}
                activeCalloutId={activeCalloutId}
                onSelectCallout={setActiveCalloutId}
                wavelength={wavelength}
              />
            )}

            {objectData.id === "milky-way" && objectData.gltfModelUrl && (
              <MilkyWay3DViewer
                modelUrl={objectData.gltfModelUrl}
                callouts={objectData.callouts}
                activeCalloutId={activeCalloutId}
                onSelectCallout={setActiveCalloutId}
                wavelength={wavelength}
              />
            )}
          </div>

          {/* Right Sidebar / Card Drawer: Scientific Telemetry, Active Callout Details & AI Console Trigger */}
          <div className="w-full lg:w-96 shrink-0 flex-1 min-h-0 lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-[#080B11]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto scrollbar-none p-3.5 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
            
            <div className="space-y-3 sm:space-y-4">
              {/* Active Scientific Callout Banner */}
              {activeCallout ? (
                <div
                  className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border space-y-1.5 sm:space-y-2 animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    backgroundColor: `${objectData.color}15`,
                    borderColor: `${objectData.color}50`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[8.5px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ color: objectData.color }}>
                      <Info className="size-3 sm:size-3.5" />
                      <span>SELECTED FEATURE</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCalloutId(null)}
                      className="text-white/40 hover:text-white font-mono text-[8.5px] sm:text-[9px]"
                    >
                      CLEAR
                    </button>
                  </div>

                  <h2 className="font-display font-bold text-xs sm:text-sm text-white">
                    {activeCallout.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-white/80 font-sans leading-relaxed">
                    {activeCallout.description}
                  </p>

                  {activeCallout.spectralData && (
                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between font-mono text-[8px] sm:text-[9px]">
                      <span className="text-white/40">SPECTRAL / SENSOR:</span>
                      <span className="text-white/90 font-semibold">{activeCallout.spectralData}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-white/50">
                  <Layers className="size-3.5 sm:size-4 text-accent shrink-0" />
                  <span>Click any pulsating callout reticle in the viewport to inspect astrophysical data.</span>
                </div>
              )}

              {/* Scientific Physical Telemetry Grid */}
              <div className="space-y-1.5 sm:space-y-2">
                <span className="font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.2em] text-white/40 font-semibold block">
                  ASTROPHYSICAL TELEMETRY
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                    <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">DISTANCE</span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate">
                      {objectData.distanceValue}
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                    <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">MAGNITUDE</span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate">
                      {objectData.apparentMagnitude}
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                    <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">CONSTELLATION</span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate">
                      {objectData.constellation}
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                    <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">AGE / POP</span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate">
                      {objectData.age}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description & Scientific Context */}
              <div className="space-y-1.5 sm:space-y-2">
                <span className="font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.2em] text-white/40 font-semibold block">
                  OBSERVATIONAL SUMMARY
                </span>
                <p className="text-[11px] sm:text-xs text-white/70 font-sans leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {objectData.description}
                </p>
                <div className="p-2 sm:p-2.5 rounded-xl bg-accent/5 border border-accent/20 font-sans text-[11px] sm:text-xs text-accent/90 leading-relaxed">
                  {objectData.scientificContext}
                </div>
              </div>

              {/* Contextual Actions */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAction) onOpenAction("observe");
                    window.dispatchEvent(
                      new CustomEvent("cosmora:open-action", {
                        detail: { actionType: "observe", objectName: objectData?.name || "Deep Space" },
                      })
                    );
                  }}
                  className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <Eye className="size-3.5 sm:size-4 text-accent" />
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase font-semibold">OBSERVE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAction) onOpenAction("photo");
                    window.dispatchEvent(
                      new CustomEvent("cosmora:open-action", {
                        detail: { actionType: "photo", objectName: objectData?.name || "Deep Space" },
                      })
                    );
                  }}
                  className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <Camera className="size-3.5 sm:size-4 text-accent" />
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase font-semibold">ASTROPHOTO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAction) onOpenAction("research");
                    window.dispatchEvent(
                      new CustomEvent("cosmora:open-action", {
                        detail: { actionType: "research", objectName: objectData?.name || "Deep Space" },
                      })
                    );
                  }}
                  className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <BookOpen className="size-3.5 sm:size-4 text-accent" />
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase font-semibold">PAPERS</span>
                </button>
              </div>
            </div>

            {/* ASK ABOUT OBJECT AI Button */}
            <div className="pt-2 sm:pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const targetName = objectData.name.replace(" GALAXY", "").replace(" SYSTEM", "").replace(" STAR CLUSTER", "");
                  const query = `Tell me about ${targetName}`;
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-ai", {
                      detail: { targetName, query },
                    })
                  );
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white text-black font-mono font-bold text-xs tracking-wider hover:bg-white/90 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
              >
                <Bot className="size-4 text-black shrink-0" />
                <span>ASK ABOUT {objectData.name.replace(" GALAXY", "").replace(" SYSTEM", "").replace(" STAR CLUSTER", "")}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
