"use client";

import React, { useState, useRef, useMemo, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  X,
  Globe,
  RotateCw,
  Eye,
  Compass,
  Zap,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStandalonePlanetModel } from "@/lib/assets/registry";
import { getCelestialObject } from "../adapters/sketchfab-solar-system";
import { getDeepSpaceObject } from "@/lib/data/deep-space";
import { UnifiedDeepSpaceViewer } from "@/features/deep-space/components/UnifiedDeepSpaceViewer";

interface DeepPlanetInspectorModalProps {
  planetId: string | null;
  onClose: () => void;
  onOpenAI?: () => void;
}

// ---------------------------------------------------------------------------
// 1. High-Resolution Auto-Normalized Standalone GLTF 3D Planet Loader
// ---------------------------------------------------------------------------
function StandaloneGLTFPlanet({
  modelUrl,
  planetId,
}: {
  modelUrl: string;
  planetId?: string;
}) {
  const gltf = useGLTF(modelUrl);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);

  // Auto-normalize bounding box to a uniform radius of 3.2 units & center at (0,0,0)
  const normalizedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const isMars = planetId === "mars" || modelUrl.toLowerCase().includes("mars");

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const rawMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          const mat = (rawMat as THREE.MeshStandardMaterial).clone();
          mat.side = THREE.FrontSide;

          if (isMars) {
            // Calibrate Mars terrain model to authentic NASA Red Planet palette:
            // Rich oxidized rust-red (#B84620) with vertex coloring modulation for volcanic ochre summits & dark rift valleys
            mat.color = new THREE.Color("#B84620");
            mat.roughness = 0.85;
            mat.metalness = 0.05;
            mat.vertexColors = true;
            mat.emissive = new THREE.Color("#1F0A04");
            mat.emissiveIntensity = 0.25;
          }

          mesh.material = mat;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 3.2; // Standardized diameter
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;

    clone.scale.setScalar(scaleFactor);
    clone.position.sub(center.clone().multiplyScalar(scaleFactor));

    return clone;
  }, [gltf.scene, modelUrl, planetId]);

  useEffect(() => {
    if (actions && names && names.length > 0) {
      const firstAction = actions[names[0]];
      if (firstAction) firstAction.play();
    }
  }, [actions, names]);

  return <primitive object={normalizedScene} />;
}

// ---------------------------------------------------------------------------
// 2. Deep Planet Inspector Modal Component
// ---------------------------------------------------------------------------
export function DeepPlanetInspectorModal({
  planetId,
  onClose,
  onOpenAI,
}: DeepPlanetInspectorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if target is a deep space astronomical entity
  const deepSpaceData = useMemo(() => {
    if (!planetId) return null;
    return getDeepSpaceObject(planetId);
  }, [planetId]);

  // Retrieve celestial scientific data for solar system planets
  const celestialData = useMemo(() => {
    if (!planetId) return null;
    return getCelestialObject(planetId);
  }, [planetId]);

  const modelUrl = useMemo(() => {
    if (!planetId) return null;
    return getStandalonePlanetModel(planetId);
  }, [planetId]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!planetId || !mounted) return null;

  // Render dedicated Deep Space viewer if matched
  if (deepSpaceData) {
    return (
      <UnifiedDeepSpaceViewer
        objectData={deepSpaceData}
        onClose={onClose}
        onOpenAI={onOpenAI}
      />
    );
  }

  if (!celestialData) return null;

  const { domain, visual } = celestialData;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deep-inspect-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 select-none pointer-events-auto"
    >
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[92vh] md:h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#06080D]/98 border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.98)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 shrink-0 bg-white/[0.02] gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div
              className="size-8 sm:size-9 rounded-xl border flex items-center justify-center shadow-lg shrink-0"
              style={{
                backgroundColor: `${visual.color}25`,
                borderColor: `${visual.color}60`,
                color: visual.color,
              }}
            >
              <Globe className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center flex-wrap gap-1.5 min-w-0 leading-none">
                <span
                  className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 shrink-0"
                  style={{ color: visual.color }}
                >
                  {domain.solId}
                </span>
                <span className="hidden sm:inline-block font-mono text-[8px] sm:text-[8.5px] uppercase tracking-wider text-white/50">
                  GLTF 3D ASSET
                </span>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[7.5px] sm:text-[8px] uppercase tracking-wider font-medium shrink-0">
                  HIGH-FIDELITY 3D
                </span>
              </div>
              <h2
                id="deep-inspect-title"
                className="font-display text-xs sm:text-base md:text-lg lg:text-xl font-bold text-white uppercase tracking-wider truncate leading-tight mt-1"
              >
                {domain.name} <span className="text-white/40 font-normal hidden xs:inline sm:inline">— INVESTIGATION</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-8 sm:size-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 ml-2"
            aria-label="Close Inspector"
          >
            <X className="size-4 sm:size-5" />
          </button>
        </div>

        {/* Modal Body: Interactive 3D Canvas + Scientific Inspector Telemetry */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-0">
          
          {/* Main 3D Canvas (Clean, Interactive, Zero Watermarks) */}
          <div className="lg:col-span-7 xl:col-span-8 relative w-full h-[32vh] sm:h-[38vh] md:h-[42vh] lg:h-full min-h-[220px] sm:min-h-[280px] bg-gradient-to-b from-[#03060c] via-[#050914] to-[#020307] shrink-0">
            <Canvas dpr={[1, 1.5]}
              camera={{ position: [0, 0.6, 5.2], fov: 45 }}
              gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            >
              {/* Cinematic Space Lighting without internal blowout pointLight */}
              <ambientLight intensity={0.45} color="#D8E2EC" />
              <directionalLight position={[12, 8, 10]} intensity={2.2} color="#FFF8E7" />
              <directionalLight position={[-10, -4, -8]} intensity={0.35} color="#4A6572" />

              <Suspense
                fallback={
                  <mesh>
                    <sphereGeometry args={[1.6, 32, 32]} />
                    <meshBasicMaterial wireframe color={visual.color} />
                  </mesh>
                }
              >
                {modelUrl ? (
                  <StandaloneGLTFPlanet key={modelUrl} modelUrl={modelUrl} planetId={planetId} />
                ) : (
                  <mesh>
                    <sphereGeometry args={[1.6, 32, 32]} />
                    <meshStandardMaterial color={visual.color} roughness={0.4} />
                  </mesh>
                )}
              </Suspense>

              <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.06}
                autoRotate={autoRotate}
                autoRotateSpeed={1.8}
                minDistance={1.8}
                maxDistance={12.0}
                rotateSpeed={0.7}
              />
            </Canvas>

            {/* Quick Interactive HUD Overlays on 3D Viewport */}
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] text-white/60 bg-black/70 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-lg border border-white/10 pointer-events-none select-none">
              <Compass className="size-3 text-accent animate-spin" />
              <span>DRAG TO ROTATE • SCROLL TO ZOOM</span>
            </div>

            {/* Viewport Layer Toggles */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setAutoRotate((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md font-mono text-[8px] sm:text-[9px] transition-all cursor-pointer",
                  autoRotate
                    ? "bg-accent/20 text-accent border border-accent/40"
                    : "text-white/40 hover:text-white"
                )}
                title="Toggle Auto Rotation"
              >
                <RotateCw className={cn("size-2.5", autoRotate && "animate-spin")} />
                <span>ROTATION ({autoRotate ? "ON" : "OFF"})</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar / Card Drawer: Scientific Planetary Inspector Telemetry */}
          <div className="lg:col-span-5 xl:col-span-4 p-3 sm:p-4.5 md:p-5 flex flex-col justify-between overflow-y-auto space-y-2.5 sm:space-y-3.5 border-t lg:border-t-0 lg:border-l border-white/10 bg-white/[0.01] flex-1 lg:flex-initial min-h-0 scrollbar-none">
            
            <div className="space-y-2.5 sm:space-y-3.5">
              {/* Planetary Classification & Summary Card */}
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <span className="font-mono text-[7.5px] sm:text-[8.5px] text-white/40 uppercase tracking-wider block mb-0.5 font-semibold">
                  CLASSIFICATION &amp; STATUS
                </span>
                <span className="font-mono text-xs font-bold text-accent block mb-1">
                  {domain.classification}
                </span>
                <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                  {domain.description}
                </p>
              </div>

              {/* Physical Metrics Grid - 4 Columns on Tablet (md:), 2 on Mobile, 2 on Desktop Sidebar */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-2.5 font-mono">
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] min-w-0">
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 uppercase tracking-wider block font-medium">
                    MEAN RADIUS
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-white block mt-0.5 truncate">
                    {domain.diameterKm}
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 block truncate">
                    {domain.diameterRatioToEarth}x Earth Scale
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] min-w-0">
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 uppercase tracking-wider block font-medium">
                    DISTANCE FROM SUN
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-accent block mt-0.5 truncate">
                    {domain.distanceAU} AU
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 block truncate">
                    {domain.distanceKm}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] min-w-0">
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 uppercase tracking-wider block font-medium">
                    ROTATION PERIOD
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-white block mt-0.5 truncate" title={domain.rotationPeriod}>
                    {domain.rotationPeriod}
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] text-emerald-400 block truncate">
                    Tilt: {domain.axialTiltDeg}°
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] min-w-0">
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 uppercase tracking-wider block font-medium">
                    SURFACE TEMP
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-amber-400 block mt-0.5 truncate" title={domain.surfaceTemp}>
                    {domain.surfaceTemp.replace(/\s*\(.*?\)/, "")}
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] text-white/40 block truncate">
                    {domain.surfaceTemp.includes("Mean:")
                      ? domain.surfaceTemp.match(/\((.*?)\)/)?.[1] || `${domain.moonsCount} Satellites`
                      : `${domain.moonsCount} Satellites`}
                  </span>
                </div>
              </div>

              {/* Special Features Badge Card */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="size-3.5 sm:size-4 text-accent shrink-0" />
                  <span className="text-white/80 text-[11px] sm:text-xs">3D Model Asset:</span>
                </div>
                <span className="font-bold text-accent uppercase text-[9px] sm:text-[10px]">
                  LOCAL GLTF 2.0
                </span>
              </div>

              {/* Ask AI Assistant Action Button for this Planet */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const targetName = domain.name.replace("The ", "");
                  const query = `Tell me about ${targetName}`;
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-ai", {
                      detail: { targetName, query },
                    })
                  );
                }}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-accent hover:bg-accent/90 text-black font-bold font-sans text-xs uppercase tracking-wider shadow-lg shadow-accent/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <Bot className="size-4 text-black shrink-0" />
                <span>ASK ABOUT {domain.name.replace("The ", "")}</span>
              </button>
            </div>

            {/* Footer Summary */}
            <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono text-white/40">
              <span className="flex items-center gap-1 text-accent font-semibold">
                <Eye className="size-3" />
                <span>NATIVE 3D GPU RENDERER</span>
              </span>
              <span>COSMORA LAB</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
