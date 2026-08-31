"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  DEEP_SPACE_OBJECTS,
  DeepSpaceDomainObject,
} from "@/lib/data/deep-space";
import { Andromeda3DViewer } from "./Andromeda3DViewer";
import { OrionNebulaViewer } from "./OrionNebulaViewer";
import { PleiadesClusterViewer } from "./PleiadesClusterViewer";
import { AlphaCentauriViewer } from "./AlphaCentauriViewer";
import { MilkyWay3DViewer } from "./MilkyWay3DViewer";
import { DeepSpaceObjectSelector } from "./DeepSpaceObjectSelector";
import { cn } from "@/lib/utils";
import {
  Telescope,
  Layers,
  Info,
  Orbit,
  Eye,
  Camera,
  BookOpen,
  Bot,
  LayoutGrid,
  X,
  Compass,
} from "lucide-react";

interface DeepSpaceStageProps {
  initialObjectId?: string;
  onSelectStage?: (stage: "home" | "explore" | "deepspace") => void;
  onOpenAI?: () => void;
  onOpenAction?: (action: "observe" | "photo" | "research" | "visit") => void;
}

export function DeepSpaceStage({
  initialObjectId = "andromeda",
  onSelectStage,
  onOpenAI,
  onOpenAction,
}: DeepSpaceStageProps) {
  const allObjects = useMemo(() => Object.values(DEEP_SPACE_OBJECTS), []);

  const [selectedId, setSelectedId] = useState<string>(initialObjectId);
  const [wavelength, setWavelength] = useState<"visible" | "infrared" | "ultraviolet">("visible");
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  const normalizedId = useMemo(() => {
    if (selectedId === "orion") return "orion-nebula";
    return selectedId;
  }, [selectedId]);

  const activeObject: DeepSpaceDomainObject = useMemo(() => {
    return (
      DEEP_SPACE_OBJECTS[normalizedId] ||
      allObjects.find((o) => o?.id === normalizedId || o?.id === selectedId) ||
      allObjects[0]
    );
  }, [normalizedId, selectedId, allObjects]);

  const activeCallout = activeObject?.callouts?.find((c) => c?.id === activeCalloutId);

  const handleSelectObject = (id: string) => {
    const normalized = id === "orion" ? "orion-nebula" : id;
    setSelectedId(normalized);
    setActiveCalloutId(null);
  };

  // Sync with initialObjectId if prop changes
  React.useEffect(() => {
    if (initialObjectId) {
      const normalized = initialObjectId === "orion" ? "orion-nebula" : initialObjectId;
      setSelectedId(normalized);
    }
  }, [initialObjectId]);

  // Synchronize global select events (e.g. from Search Modal or Navigation)
  React.useEffect(() => {
    const handleSelectEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ planetId?: string; objectId?: string }>;
      const targetId = customEvent.detail?.objectId || customEvent.detail?.planetId;
      if (targetId) {
        const normalized = targetId === "orion" ? "orion-nebula" : targetId;
        if (DEEP_SPACE_OBJECTS[normalized]) {
          setSelectedId(normalized);
        }
      }
    };
    window.addEventListener("cosmora:select-deep-space", handleSelectEvent);
    window.addEventListener("cosmora:select-planet", handleSelectEvent);
    return () => {
      window.removeEventListener("cosmora:select-deep-space", handleSelectEvent);
      window.removeEventListener("cosmora:select-planet", handleSelectEvent);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full min-h-0 max-h-full rounded-2xl bg-[#06080D]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(75,158,255,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">

      {/* 1. TOP TELEMETRY & FILTER CONTROL BAR */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 lg:px-5 py-2 border-b border-white/10 bg-white/[0.02] shrink-0 select-none">

        {/* Left: Stage Title & Stage Pill + Desktop Spectral Controls */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="size-8 sm:size-9 rounded-xl border flex items-center justify-center shadow-lg transition-colors shrink-0"
            style={{
              backgroundColor: `${activeObject.color}20`,
              borderColor: `${activeObject.color}60`,
              color: activeObject.color,
            }}
          >
            <Telescope className="size-4 sm:size-4.5" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-display font-bold text-xs sm:text-sm text-white uppercase tracking-wider truncate">
              DEEP SPACE
            </span>
            <span className="font-display font-bold text-xs sm:text-sm text-white uppercase tracking-wider hidden sm:inline">
              OBSERVATORY
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 font-mono text-[7.5px] sm:text-[9px] text-accent font-semibold uppercase shrink-0">
              STAGE 03
            </span>
          </div>

          {/* Desktop Spectral Filter Selector */}
          <div className="hidden md:flex items-center gap-0.5 p-0.5 rounded-lg sm:rounded-xl bg-white/[0.05] border border-white/10 font-mono text-[8.5px] sm:text-[9px] ml-2">
            <button
              type="button"
              onClick={() => setWavelength("visible")}
              className={cn(
                "px-2 py-0.5 rounded-md sm:rounded-lg transition-all cursor-pointer border",
                wavelength === "visible"
                  ? "bg-cyan-500/25 text-cyan-200 border-cyan-400/60 shadow-[0_0_8px_rgba(0,229,255,0.3)] font-bold"
                  : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/10"
              )}
              title="Optical Wavelength (Human Eye / Hubble Visible 380-750nm)"
            >
              OPTICAL
            </button>
            <button
              type="button"
              onClick={() => setWavelength("infrared")}
              className={cn(
                "px-2 py-0.5 rounded-md sm:rounded-lg transition-all cursor-pointer border",
                wavelength === "infrared"
                  ? "bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-[0_0_8px_rgba(255,167,38,0.3)] font-bold"
                  : "bg-transparent text-white/60 border-transparent hover:text-amber-300 hover:bg-white/10"
              )}
              title="Infrared Wavelength (JWST / Spitzer Thermal 1-30µm)"
            >
              INFRARED
            </button>
            <button
              type="button"
              onClick={() => setWavelength("ultraviolet")}
              className={cn(
                "px-2 py-0.5 rounded-md sm:rounded-lg transition-all cursor-pointer border",
                wavelength === "ultraviolet"
                  ? "bg-purple-500/25 text-purple-200 border-purple-400/60 shadow-[0_0_8px_rgba(156,39,176,0.35)] font-bold"
                  : "bg-transparent text-white/60 border-transparent hover:text-purple-300 hover:bg-white/10"
              )}
              title="Ultraviolet & X-Ray (Chandra / GALEX High-Energy Ionization)"
            >
              UV/X-RAY
            </button>
          </div>
        </div>

        {/* Top-Right Corner Controls: Mobile Spectral, Orbit Jump & Prominent Galaxy Catalog Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          {/* Mobile Spectral Filter Selector */}
          <div className="flex md:hidden items-center gap-0.5 p-0.5 rounded-lg bg-black/60 border border-white/15 font-mono text-[8.5px]">
            <button
              type="button"
              onClick={() => setWavelength("visible")}
              className={cn(
                "px-2 py-1 rounded transition-all cursor-pointer font-bold",
                wavelength === "visible"
                  ? "bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                  : "text-white/60 hover:text-white"
              )}
            >
              OPT
            </button>
            <button
              type="button"
              onClick={() => setWavelength("infrared")}
              className={cn(
                "px-2 py-1 rounded transition-all cursor-pointer font-bold",
                wavelength === "infrared"
                  ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(255,167,38,0.4)]"
                  : "text-white/60 hover:text-white"
              )}
            >
              IR
            </button>
            <button
              type="button"
              onClick={() => setWavelength("ultraviolet")}
              className={cn(
                "px-2 py-1 rounded transition-all cursor-pointer font-bold",
                wavelength === "ultraviolet"
                  ? "bg-purple-400 text-black shadow-[0_0_10px_rgba(156,39,176,0.4)]"
                  : "text-white/60 hover:text-white"
              )}
            >
              UV
            </button>
          </div>

          {/* Orbit Return Button */}
          <button
            type="button"
            onClick={() => onSelectStage?.("explore")}
            className="hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-accent/15 hover:bg-accent/30 text-accent font-mono text-[8.5px] sm:text-[9.5px] font-bold border border-accent/30 transition-all cursor-pointer"
            title="Switch to Stage 02: 3D Solar Orbit"
          >
            <Orbit className="size-3 text-accent shrink-0" />
            <span>ORBIT</span>
          </button>

          {/* Top-Right Dedicated Galaxy Catalog Button (Icon Only) */}
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center justify-center size-7 sm:size-8 rounded-lg sm:rounded-xl bg-accent/20 hover:bg-accent/35 text-white border border-accent/60 shadow-[0_0_14px_rgba(75,158,255,0.35)] transition-all cursor-pointer active:scale-95 shrink-0"
            title="Open Full Interactive Cosmic & Galaxy Catalog"
            aria-label="Open Cosmic Catalog"
          >
            <LayoutGrid className="size-3.5 sm:size-4 text-accent" />
          </button>
        </div>

      </div>

      {/* 2. DEDICATED COSMIC OBJECT SELECTOR BAR (Smooth Horizontal Scroll) */}
      <DeepSpaceObjectSelector
        selectedObjectId={normalizedId}
        onSelectObject={handleSelectObject}
      />

      {/* 3. MAIN OBSERVATORY CANVAS & SIDEBAR */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0 relative">

        {/* LEFT / CENTER: Interactive Deep Space Viewer Stage */}
        <div className="relative w-full h-[300px] xs:h-[340px] sm:h-[380px] lg:h-full lg:flex-1 shrink-0 overflow-hidden bg-black flex items-center justify-center select-none">

          {activeObject.id === "andromeda" && activeObject.gltfModelUrl && (
            <Andromeda3DViewer
              modelUrl={activeObject.gltfModelUrl}
              callouts={activeObject.callouts}
              activeCalloutId={activeCalloutId}
              onSelectCallout={setActiveCalloutId}
              wavelength={wavelength}
            />
          )}

          {activeObject.id === "orion-nebula" && (
            <OrionNebulaViewer
              primaryImageUrl={activeObject.primaryImageUrl}
              secondaryImageUrl={activeObject.secondaryImageUrl}
              callouts={activeObject.callouts}
              activeCalloutId={activeCalloutId}
              onSelectCallout={setActiveCalloutId}
              wavelength={wavelength}
            />
          )}

          {activeObject.id === "pleiades" && (
            <PleiadesClusterViewer
              primaryImageUrl={activeObject.primaryImageUrl}
              callouts={activeObject.callouts}
              activeCalloutId={activeCalloutId}
              onSelectCallout={setActiveCalloutId}
              wavelength={wavelength}
            />
          )}

          {activeObject.id === "alpha-centauri" && (
            <AlphaCentauriViewer
              primaryImageUrl={activeObject.primaryImageUrl}
              callouts={activeObject.callouts}
              activeCalloutId={activeCalloutId}
              onSelectCallout={setActiveCalloutId}
              wavelength={wavelength}
            />
          )}

          {activeObject.id === "milky-way" && activeObject.gltfModelUrl && (
            <MilkyWay3DViewer
              modelUrl={activeObject.gltfModelUrl}
              callouts={activeObject.callouts}
              activeCalloutId={activeCalloutId}
              onSelectCallout={setActiveCalloutId}
              wavelength={wavelength}
            />
          )}


        </div>

        {/* RIGHT: ASTROPHYSICAL TELEMETRY & CALLOUT DETAILS */}
        <div className="w-full lg:w-88 xl:w-96 shrink-0 lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-[#080B11]/95 backdrop-blur-xl flex flex-col justify-between overflow-visible lg:overflow-y-auto scrollbar-none p-3 sm:p-4 space-y-2.5 sm:space-y-3">

          <div className="space-y-2.5 sm:space-y-3">
            {/* Active Scientific Callout Banner */}
            {activeCallout ? (
              <div
                className="p-2.5 sm:p-3 rounded-xl border space-y-1 animate-in fade-in zoom-in-95 duration-200"
                style={{
                  backgroundColor: `${activeObject?.color || "#4B9EFF"}15`,
                  borderColor: `${activeObject?.color || "#4B9EFF"}50`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider font-bold truncate"
                    style={{ color: activeObject?.color || "#4B9EFF" }}
                  >
                    <Info className="size-3.5 shrink-0" />
                    <span className="truncate">TARGET HOTSPOT // {activeCallout.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveCalloutId(null)}
                    className="text-white/40 hover:text-white font-mono text-[9px] cursor-pointer ml-2"
                  >
                    CLEAR
                  </button>
                </div>

                <h3 className="font-display font-bold text-xs sm:text-sm text-white">
                  {activeCallout.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 font-sans leading-relaxed line-clamp-2">
                  {activeCallout.description}
                </p>

                {activeCallout.spectralData && (
                  <div className="pt-1 border-t border-white/10 flex items-center justify-between font-mono text-[8.5px]">
                    <span className="text-white/40">SPECTRAL / SENSOR:</span>
                    <span className="text-white/90 font-semibold">{activeCallout.spectralData}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 font-mono text-[9px] sm:text-[9.5px] text-white/60">
                <Layers className="size-3.5 text-accent shrink-0" />
                <span className="leading-snug">Click pulsating hotspots in the viewport to inspect astrophysical data.</span>
              </div>
            )}

            {/* Astrophysical Telemetry Grid */}
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.2em] text-white/40 font-semibold block">
                ASTROPHYSICAL TELEMETRY
              </span>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                  <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">DISTANCE</span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate" title={activeObject?.distanceValue || "N/A"}>
                    {activeObject?.distanceValue || "N/A"}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                  <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">MAGNITUDE</span>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-white mt-0.5 truncate" title={activeObject?.apparentMagnitude || "N/A"}>
                    {activeObject?.apparentMagnitude || "N/A"}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                  <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">CONSTELLATION</span>
                  <span className="font-mono text-[10.5px] sm:text-xs font-bold text-white mt-0.5 truncate" title={activeObject?.constellation || "N/A"}>
                    {activeObject?.constellation || "N/A"}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col min-w-0">
                  <span className="font-mono text-[8px] sm:text-[8.5px] text-white/40 uppercase">PHYSICAL SPAN</span>
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white mt-0.5 leading-snug break-words truncate" title={activeObject?.physicalSpan || "N/A"}>
                    {activeObject?.physicalSpan || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Scientific Description */}
            <div className="space-y-1">
              <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.2em] text-white/40 font-semibold block">
                SCIENTIFIC SUMMARY
              </span>
              <p className="text-[11px] sm:text-xs text-white/70 font-sans leading-relaxed line-clamp-3 sm:line-clamp-4">
                {activeObject?.description || ""}
              </p>
            </div>

            {/* Expedition Actions */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAction) onOpenAction("observe");
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-action", {
                      detail: { actionType: "observe", objectName: activeObject?.name || "Deep Space" },
                    })
                  );
                }}
                className="flex flex-col items-center justify-center gap-0.5 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm min-h-[42px]"
                title={`Open Observation Suite for ${activeObject?.name || "Deep Space"}`}
              >
                <Eye className="size-3.5 text-accent" />
                <span className="font-mono text-[8px] sm:text-[8.5px] uppercase font-semibold">OBSERVE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAction) onOpenAction("photo");
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-action", {
                      detail: { actionType: "photo", objectName: activeObject?.name || "Deep Space" },
                    })
                  );
                }}
                className="flex flex-col items-center justify-center gap-0.5 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm min-h-[42px]"
                title={`Open Astrophotography Suite for ${activeObject?.name || "Deep Space"}`}
              >
                <Camera className="size-3.5 text-accent" />
                <span className="font-mono text-[8px] sm:text-[8.5px] uppercase font-semibold">PHOTO</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAction) onOpenAction("research");
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-action", {
                      detail: { actionType: "research", objectName: activeObject?.name || "Deep Space" },
                    })
                  );
                }}
                className="flex flex-col items-center justify-center gap-0.5 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm min-h-[42px]"
                title={`Open Research & Astrophysics Papers for ${activeObject?.name || "Deep Space"}`}
              >
                <BookOpen className="size-3.5 text-accent" />
                <span className="font-mono text-[8px] sm:text-[8.5px] uppercase font-semibold">PAPERS</span>
              </button>
            </div>
          </div>

          {/* AI Console Action Button */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                if (onOpenAI) onOpenAI();
                window.dispatchEvent(new CustomEvent("cosmora:open-ai"));
              }}
              className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs tracking-wider hover:bg-white/90 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all min-h-[38px] cursor-pointer"
            >
              <Bot className="size-3.5 text-black shrink-0" />
              <span className="truncate">
                ASK AI ABOUT {(activeObject?.name || "").replace(" GALAXY", "").replace(" SYSTEM", "").replace(" STAR CLUSTER", "")}
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. ALL TARGETS INTERACTIVE CATALOG MODAL OVERLAY */}
      {showCatalogModal && (
        <div className="absolute inset-0 z-[120] bg-black/85 backdrop-blur-2xl flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(75,158,255,0.3)]">
                <LayoutGrid className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display font-bold text-base sm:text-lg md:text-xl text-white uppercase tracking-wider">
                    ALL DEEP SPACE TARGETS
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 font-mono text-[8.5px] sm:text-[9px] text-accent font-bold">
                    {allObjects.length} OBJECTS LOADED
                  </span>
                </div>
                <p className="text-white/60 font-sans text-xs mt-0.5">
                  Pilih objek kosmis untuk memuat simulasi 3D interaktif dan telemetri astrofisika lengkap.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCatalogModal(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Close Catalog"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-6 max-w-6xl mx-auto w-full pb-8">
            {allObjects.map((obj) => {
              const isCurrent = obj.id === activeObject.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => {
                    handleSelectObject(obj.id);
                    setShowCatalogModal(false);
                  }}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border p-3.5 sm:p-4 transition-all duration-300 cursor-pointer overflow-hidden text-left",
                    isCurrent
                      ? "bg-white/[0.12] border-accent shadow-[0_0_25px_rgba(75,158,255,0.35)] scale-[1.01]"
                      : "bg-[#0A0E17]/90 hover:bg-[#121927] border-white/10 hover:border-white/30 hover:shadow-xl"
                  )}
                >
                  {/* Card Image Banner */}
                  <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-3 bg-black border border-white/10">
                    <Image
                      src={obj.primaryImageUrl}
                      alt={obj.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Category & 3D Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 font-mono text-[8px] sm:text-[8.5px] uppercase font-bold text-white">
                        {obj.category.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-accent/30 backdrop-blur-md border border-accent/50 font-mono text-[8px] sm:text-[8.5px] uppercase font-bold text-accent">
                        3D INTERACTIVE
                      </span>
                    </div>

                    {/* Active Target Indicator */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500/30 backdrop-blur-md border border-emerald-400 font-mono text-[8px] sm:text-[8.5px] uppercase font-bold text-emerald-300 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ACTIVE
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[8.5px] sm:text-[9px] text-white/80">
                      <span>{obj.catalogId}</span>
                      <span className="text-accent font-semibold">{obj.distanceValue}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide group-hover:text-accent transition-colors">
                        {obj.name}
                      </h3>
                      <p className="font-mono text-[9.5px] sm:text-[10px] text-white/50">{obj.typeLabel}</p>
                      <p className="font-sans text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                        {obj.description}
                      </p>
                    </div>

                    {/* Footer Launch Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectObject(obj.id);
                        setShowCatalogModal(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-1.5 sm:py-2 rounded-xl font-mono text-[9.5px] sm:text-[10px] uppercase font-bold transition-all cursor-pointer min-h-[32px]",
                        isCurrent
                          ? "bg-accent text-black shadow-md"
                          : "bg-white/10 group-hover:bg-white text-white group-hover:text-black"
                      )}
                    >
                      <Eye className="size-3.5" />
                      <span>{isCurrent ? "VIEW CURRENT TARGET" : "OPEN 3D VIEW"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
