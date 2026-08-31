"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { SpaceMission } from "../types";
import { Crosshair, Loader2, ChevronLeft, ChevronRight, ArrowRight, Gauge, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpacecraftViewerProps {
  mission: SpaceMission;
  onSelectInstrument?: (instrumentName: string) => void;
  onViewDossier?: () => void;
  onNextMission?: () => void;
  onPrevMission?: () => void;
}

// -----------------------------------------------------------------------------
// MODEL PATH MAPPER WITH OPTIMAL CAMERA FACING ANGLES
// -----------------------------------------------------------------------------
const MISSION_GLTF_MAP: Record<string, { path: string; rotationOffset: [number, number, number] }> = {
  mission_jwst: {
    path: "/models/missions/James Webb Space Telescope NASA/scene.gltf",
    rotationOffset: [0.15, 0, 0] // Gold honeycomb mirrors facing front
  },
  mission_voyager1: {
    path: "/models/missions/Voyager NASA/scene.gltf",
    rotationOffset: [0.25, 0.4, 0] // High-gain dish & Golden Record facing front
  },
  mission_perseverance: {
    path: "/models/missions/Perseverance Rover NASA/scene.gltf",
    rotationOffset: [0.15, -Math.PI / 4, 0] // SuperCam mast & arm facing front
  },
  mission_iss: {
    path: "/models/missions/International Space Station ISS NASA/scene.gltf",
    rotationOffset: [0.25, 0.6, 0] // 8 Solar wings & Cupola facing front
  },
  mission_artemis: {
    path: "/models/missions/Orion Spacecraft NASA/scene.gltf",
    rotationOffset: [0.2, 0.3, 0] // Crew capsule & X-wings facing front
  },
  mission_hubble: {
    path: "/models/missions/Hubble Space Telescope NASA/scene.gltf",
    rotationOffset: [0.2, 0.5, 0] // Silver telescope tube & solar wings facing front
  },
  mission_cassini: {
    path: "/models/missions/Voyager NASA/scene.gltf",
    rotationOffset: [0.25, 0.4, 0]
  },
  mission_newhorizons: {
    path: "/models/missions/Hubble Space Telescope NASA/scene.gltf",
    rotationOffset: [0.2, 0.5, 0]
  }
};

// -----------------------------------------------------------------------------
// DYNAMIC GLTF AUTO-BOUNDING BOX NORMALIZER & ULTRA-BRIGHT PBR MATERIAL ENGINE
// -----------------------------------------------------------------------------
function LoadedGLTFModel({ config }: { config: { path: string; rotationOffset: [number, number, number] } }) {
  const gltf = useGLTF(config.path);
  const groupRef = useRef<THREE.Group>(null);

  // Auto-calculate exact geometric bounding box, center offset, and normalize scale
  const { normalizedScene, autoScale } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    
    // 1. Force update matrix world to calculate true global bounding box
    clone.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    // 2. Subtract center from root position so geometric center is strictly at (0, 0, 0)
    clone.position.set(-center.x, -center.y, -center.z);

    // 3. Normalize maximum dimension to 2.35 units (crisp, beautifully framed showcase view)
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = maxDim > 0 ? 2.35 / maxDim : 1;

    // 4. Boost material brightness, specular response, and eliminate pitch black shadows
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            mat.side = THREE.DoubleSide;
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              // If material has dark albedo, brighten it to prevent silhouette darkness
              if (mat.color && mat.color.r < 0.08 && mat.color.g < 0.08 && mat.color.b < 0.08) {
                mat.color.setRGB(0.22, 0.22, 0.26);
              }
              mat.roughness = THREE.MathUtils.clamp(mat.roughness, 0.15, 0.55);
              mat.metalness = THREE.MathUtils.clamp(mat.metalness, 0.35, 0.85);
              mat.needsUpdate = true;
            }
          });
        }
      }
    });

    return { normalizedScene: clone, autoScale: targetScale };
  }, [gltf.scene]);

  // Gentle 360-degree cosmic rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} rotation={config.rotationOffset} scale={autoScale}>
      <primitive object={normalizedScene} />
    </group>
  );
}

// -----------------------------------------------------------------------------
// HOLOGRAPHIC 3D LOADER SPINNER
// -----------------------------------------------------------------------------
function ModelLoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl font-mono text-[9px] sm:text-[10px] text-accent select-none shadow-2xl">
        <Loader2 className="size-5 sm:size-6 text-accent animate-spin" />
        <span className="tracking-widest uppercase font-bold animate-pulse">STREAMING 3D TELEMETRY...</span>
      </div>
    </Html>
  );
}

// -----------------------------------------------------------------------------
// MAIN SPACECRAFT CANVAS SCENE WITH 360° ALL-ANGLE STUDIO LIGHTING RIG
// -----------------------------------------------------------------------------
export function SpacecraftViewer({ 
  mission, 
  onSelectInstrument,
  onViewDossier,
  onNextMission,
  onPrevMission
}: SpacecraftViewerProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  const modelConfig = MISSION_GLTF_MAP[mission.id] || MISSION_GLTF_MAP.mission_jwst;

  return (
    <div 
      className="relative w-full h-full bg-[#05070A] overflow-hidden select-none"
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setIsInteracting(false)}
    >
      {/* 3D WebGL Canvas with High Exposure ACES Filmic Tone Mapping */}
      <Canvas dpr={[1, 1.5]}
        camera={{ position: [0, 0.8, 4.6], fov: 42 }}
        gl={{ 
          antialias: false, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 2.2
        }}
      >
        <color attach="background" args={["#05070A"]} />

        {/* 1. Global High-Lumen Ambient & Hemisphere Lights */}
        <ambientLight intensity={2.8} color="#ffffff" />
        <hemisphereLight args={["#ffffff", "#334155", 3.2]} />

        {/* 2. Primary Solar Key Light */}
        <directionalLight position={[10, 14, 12]} intensity={5.5} color="#ffffff" />

        {/* 3. Front Fill Light */}
        <directionalLight position={[-8, 6, 10]} intensity={4.2} color="#e0f2fe" />

        {/* 4. Deep Cyan Rimlight */}
        <directionalLight position={[-12, 6, -10]} intensity={3.5} color="#38bdf8" />

        {/* 5. Golden Solar Bounce Light */}
        <directionalLight position={[4, -10, 6]} intensity={3.0} color="#fef08a" />

        {/* 6. Dynamic Headlight */}
        <pointLight position={[0, 0, 8]} intensity={4.5} color="#ffffff" distance={45} />
        <pointLight position={[0, 8, 0]} intensity={2.5} color="#ffffff" distance={30} />

        {/* Boundless Deep Cosmos Stars */}
        <Stars radius={90} depth={60} count={4500} factor={4} saturation={0.7} fade speed={0.8} />

        {/* Floating 3D Spacecraft with Auto-Normalized Scale & True Origin Centering */}
        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.25}>
          <Suspense fallback={<ModelLoadingFallback />}>
            <LoadedGLTFModel key={mission.id} config={modelConfig} />
          </Suspense>
        </Float>

        {/* Smooth OrbitControls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={1.4}
          maxDistance={9.0}
          target={[0, 0, 0]}
          autoRotate={!isInteracting}
          autoRotateSpeed={0.5}
          dampingFactor={0.06}
        />
      </Canvas>

      {/* Floating Left/Right Spacecraft Fleet Switcher (Quick Browsing) */}
      {(onPrevMission || onNextMission) && (
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
          {onPrevMission && (
            <button
              type="button"
              onClick={onPrevMission}
              aria-label="Previous Spacecraft"
              className="size-8 sm:size-9 rounded-full bg-black/60 hover:bg-accent hover:text-black text-white/80 border border-white/15 backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto active:scale-95 shadow-lg"
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>
          )}

          {onNextMission && (
            <button
              type="button"
              onClick={onNextMission}
              aria-label="Next Spacecraft"
              className="size-8 sm:size-9 rounded-full bg-black/60 hover:bg-accent hover:text-black text-white/80 border border-white/15 backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto active:scale-95 shadow-lg ml-auto"
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          )}
        </div>
      )}

      {/* MOBILE BOTTOM FLOATING HUD PREVIEW CARD (Visible on screens < md) */}
      <div className="md:hidden absolute bottom-2.5 left-2.5 right-2.5 z-20 pointer-events-auto">
        <div className="p-3 rounded-2xl bg-[#0B0F17]/95 backdrop-blur-2xl border border-accent/30 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(75,158,255,0.15)] flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="size-1.5 rounded-full bg-accent animate-ping shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold truncate">
                {mission.agency} • {mission.targetBody}
              </span>
            </div>
            
            <div className="flex items-center gap-1 font-mono text-[8.5px] text-white/70 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 shrink-0">
              <Gauge className="size-2.5 text-accent" />
              <span>{mission.telemetry.velocityKmS > 0 ? `${mission.telemetry.velocityKmS} km/s` : "Stationary"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-sm text-white truncate leading-tight">
                {mission.name}
              </h3>
              <p className="font-mono text-[8.5px] text-white/50 truncate mt-0.5">
                Launch {mission.launchDate} • {mission.telemetry.orbitType?.split('(')[0].trim()}
              </p>
            </div>

            {onViewDossier && (
              <button
                type="button"
                onClick={onViewDossier}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-black font-mono font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_12px_rgba(75,158,255,0.3)] shrink-0 cursor-pointer active:scale-95"
              >
                <span>DOSSIER</span>
                <ArrowRight className="size-3" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* TABLET & DESKTOP FLOATING HUD GUIDANCE (Visible on md+) */}
      <div className="hidden md:flex absolute bottom-3.5 left-3.5 right-3.5 pointer-events-none items-center justify-between font-mono text-[9px] text-white/50 z-10">
        <div className="px-3 py-1.5 rounded-full bg-black/75 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span>DRAG TO ORBIT 360° • SCROLL TO ZOOM</span>
        </div>


      </div>
    </div>
  );
}

// Preload all GLTF models in background for instantaneous switching
Object.values(MISSION_GLTF_MAP).forEach((config) => {
  useGLTF.preload(config.path);
});
