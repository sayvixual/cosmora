"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSolarSystemExplorer } from "../hooks/useSolarSystemExplorer";
import { FloatingSideControls } from "./FloatingSideControls";
import { PlanetBottomTelemetry } from "./PlanetBottomTelemetry";
import { AttributionModal } from "./AttributionModal";
import { DeepPlanetInspectorModal } from "./DeepPlanetInspectorModal";

// Dynamically import Three.js Scene to prevent SSR hydration mismatches
const DynamicSolarSystemScene = dynamic(
  () => import("./SolarSystemScene").then((mod) => mod.SolarSystemScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-transparent text-white/50 font-mono text-xs gap-3">
        <div className="size-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <span className="tracking-widest uppercase text-[11px] text-accent animate-pulse">
          INITIALIZING THREE.JS SPATIAL SIMULATOR...
        </span>
      </div>
    ),
  }
);

interface SolarSystemExplorerProps {
  initialObjectId?: string;
  onSelectStage?: (stage: "home" | "explore") => void;
  onOpenAI?: () => void;
}

export function SolarSystemExplorer({
  initialObjectId = "mars",
  onSelectStage,
  onOpenAI,
}: SolarSystemExplorerProps) {
  const {
    selectedObjectId,
    setSelectedObjectId,
    activeObject,
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
    showLabels,
    setShowLabels,
    showAttribution,
    setShowAttribution,
  } = useSolarSystemExplorer(initialObjectId);

  const [deepInspectPlanetId, setDeepInspectPlanetId] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-row items-stretch gap-2 sm:gap-3 lg:gap-3.5 w-full h-full max-h-full min-h-0 overflow-hidden animate-in fade-in duration-300 relative">
      
      {/* 1. Left Floating Minimalist Tools & Controls Palette */}
      <div className="flex items-center justify-center shrink-0 relative z-40">
        <FloatingSideControls
          activeObject={activeObject}
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          isPaused={isPaused}
          togglePause={togglePause}
          showOrbits={showOrbits}
          setShowOrbits={setShowOrbits}
          showBelts={showBelts}
          setShowBelts={setShowBelts}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          onSelectStage={onSelectStage}
          onOpenAI={onOpenAI}
          onOpenAttribution={() => setShowAttribution(true)}
        />
      </div>

      {/* 2. Main Expansive 3D Space Viewport + Bottom Planet Telemetry */}
      <div className="flex-1 flex flex-col justify-between gap-1.5 sm:gap-2.5 h-full min-h-0 relative overflow-hidden">
        
        {/* Full-Bleed 3D Interactive Simulation Canvas */}
        <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
          <DynamicSolarSystemScene
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            cameraMode={cameraMode}
            simulationSpeed={simulationSpeed}
            isPaused={isPaused}
            showOrbits={showOrbits}
            showBelts={showBelts}
            showLabels={showLabels && !deepInspectPlanetId}
          />
        </div>

        {/* Bottom Planet Telemetry & Selector Dock (Planet Info at the Bottom) */}
        <PlanetBottomTelemetry
          activeObject={activeObject}
          selectedObjectId={selectedObjectId}
          onSelectObject={setSelectedObjectId}
          onOpenAI={onOpenAI}
          onOpenDeepInspect={(id) => setDeepInspectPlanetId(id)}
        />

      </div>

      {/* Legal CC BY Attribution & NASA Sources Modal */}
      <AttributionModal
        isOpen={showAttribution}
        onClose={() => setShowAttribution(false)}
      />

      {/* High-Fidelity Micro Planetary 3D Inspector Modal */}
      <DeepPlanetInspectorModal
        planetId={deepInspectPlanetId}
        onClose={() => setDeepInspectPlanetId(null)}
        onOpenAI={onOpenAI}
      />
    </div>
  );
}
