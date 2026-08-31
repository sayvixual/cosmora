"use client";

import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { DeepSpaceCallout } from "@/lib/data/deep-space";
import { cn } from "@/lib/utils";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Layers,
  Orbit,
  Sparkles,
  Globe,
} from "lucide-react";
import { DeepSpaceViewerHUD } from "./DeepSpaceViewerHUD";

interface AlphaCentauriViewerProps {
  primaryImageUrl?: string;
  callouts: DeepSpaceCallout[];
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  wavelength: "visible" | "infrared" | "ultraviolet";
}

// ---------------------------------------------------------------------------
// 1. Procedural Texture Generators (Soft Solar Coronas & Diffraction Flares)
// ---------------------------------------------------------------------------
function createSolarGlowTexture(coreColor: string, outerColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, coreColor);
    gradient.addColorStop(0.55, outerColor);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createDiffractionSpikeTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 64;
    const cy = 64;

    // Center Core Glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
    coreGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    coreGrad.addColorStop(0.35, color);
    coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal Diffraction Flare
    const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
    hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
    hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(cx, cy - 2);
    ctx.lineTo(128, cy);
    ctx.lineTo(cx, cy + 2);
    ctx.closePath();
    ctx.fill();

    // Vertical Diffraction Flare
    const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
    vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    vGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
    vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx - 2, cy);
    ctx.lineTo(cx, 128);
    ctx.lineTo(cx + 2, cy);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ---------------------------------------------------------------------------
// 2. Background Starfield (~600 Soft Star Points)
// ---------------------------------------------------------------------------
function BackgroundStarfield() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, starTexture } = useMemo(() => {
    let seed = 918231;
    const prng = () => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const count = 650;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 8.0 + prng() * 12.0;
      const theta = prng() * Math.PI * 2;
      const phi = (prng() - 0.5) * Math.PI;

      pos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      const pVal = prng();
      const color =
        pVal > 0.65
          ? new THREE.Color("#FFF8E1") // Warm yellow
          : pVal > 0.35
          ? new THREE.Color("#FFFFFF") // White
          : pVal > 0.15
          ? new THREE.Color("#FFE082") // Orange
          : new THREE.Color("#FF8A80"); // Red dwarf

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 245, 210, 0.9)");
      gradient.addColorStop(0.5, "rgba(255, 180, 50, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;

    return { positions: pos, colors: col, starTexture: tex };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.006;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        size={0.16}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 3. Orbital Path Ring Helper
// ---------------------------------------------------------------------------
function OrbitRing({
  radiusX,
  radiusY,
  color = "#FFA726",
  opacity = 0.25,
}: {
  radiusX: number;
  radiusY: number;
  color?: string;
  opacity?: number;
}) {
  const lineObject = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusY));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geometry, material);
  }, [radiusX, radiusY, color, opacity]);

  return <primitive object={lineObject} />;
}

// ---------------------------------------------------------------------------
// 4. Habitable Zone Torus Indicator
// ---------------------------------------------------------------------------
function HabitableZoneIndicator({
  innerRadius,
  outerRadius,
}: {
  innerRadius: number;
  outerRadius: number;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial
        color="#00E676"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// 5. Main 3D Alpha Centauri System Scene
// ---------------------------------------------------------------------------
function AlphaCentauriScene({
  activeCalloutId,
  onSelectCallout,
  autoRotate,
  showOrbits,
  showCallouts,
  wavelength,
}: {
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  autoRotate: boolean;
  showOrbits: boolean;
  showCallouts: boolean;
  wavelength: "visible" | "infrared" | "ultraviolet";
}) {
  const binaryGroupRef = useRef<THREE.Group>(null);
  const proximaGroupRef = useRef<THREE.Group>(null);
  const proximaBPlanetRef = useRef<THREE.Group>(null);

  const starAHaloRef = useRef<THREE.Sprite>(null);
  const starBHaloRef = useRef<THREE.Sprite>(null);
  const proximaHaloRef = useRef<THREE.Sprite>(null);

  const [textures, setTextures] = useState<{
    glowA: THREE.CanvasTexture | null;
    glowB: THREE.CanvasTexture | null;
    glowProxima: THREE.CanvasTexture | null;
    spikeA: THREE.CanvasTexture | null;
    spikeB: THREE.CanvasTexture | null;
    spikeProxima: THREE.CanvasTexture | null;
  }>({
    glowA: null,
    glowB: null,
    glowProxima: null,
    spikeA: null,
    spikeB: null,
    spikeProxima: null,
  });

  useEffect(() => {
    if (wavelength === "infrared") {
      setTextures({
        glowA: createSolarGlowTexture("rgba(255, 179, 0, 0.95)", "rgba(255, 111, 0, 0.4)"),
        glowB: createSolarGlowTexture("rgba(255, 109, 0, 0.95)", "rgba(216, 67, 21, 0.4)"),
        glowProxima: createSolarGlowTexture("rgba(255, 61, 0, 0.95)", "rgba(191, 54, 12, 0.4)"),
        spikeA: createDiffractionSpikeTexture("#FFA000"),
        spikeB: createDiffractionSpikeTexture("#FF6D00"),
        spikeProxima: createDiffractionSpikeTexture("#FF3D00"),
      });
    } else if (wavelength === "ultraviolet") {
      setTextures({
        glowA: createSolarGlowTexture("rgba(179, 136, 255, 0.95)", "rgba(124, 77, 255, 0.4)"),
        glowB: createSolarGlowTexture("rgba(124, 77, 255, 0.95)", "rgba(106, 27, 154, 0.4)"),
        glowProxima: createSolarGlowTexture("rgba(224, 64, 251, 0.95)", "rgba(156, 39, 176, 0.4)"),
        spikeA: createDiffractionSpikeTexture("#B388FF"),
        spikeB: createDiffractionSpikeTexture("#7C4DFF"),
        spikeProxima: createDiffractionSpikeTexture("#E040FB"),
      });
    } else {
      setTextures({
        glowA: createSolarGlowTexture("rgba(255, 235, 150, 0.95)", "rgba(255, 167, 38, 0.4)"),
        glowB: createSolarGlowTexture("rgba(255, 180, 100, 0.95)", "rgba(230, 81, 0, 0.4)"),
        glowProxima: createSolarGlowTexture("rgba(255, 80, 80, 0.95)", "rgba(213, 0, 0, 0.4)"),
        spikeA: createDiffractionSpikeTexture("#FFE082"),
        spikeB: createDiffractionSpikeTexture("#FFB74D"),
        spikeProxima: createDiffractionSpikeTexture("#FF5252"),
      });
    }
  }, [wavelength]);

  const spectralColors = useMemo(() => {
    if (wavelength === "infrared") {
      return {
        emissiveA: "#FFA000",
        lightA: "#FFB300",
        emissiveB: "#FF6D00",
        lightB: "#FF8F00",
        emissiveProxima: "#FF3D00",
        lightProxima: "#FF5722",
      };
    }
    if (wavelength === "ultraviolet") {
      return {
        emissiveA: "#B388FF",
        lightA: "#D1C4E9",
        emissiveB: "#7C4DFF",
        lightB: "#B388FF",
        emissiveProxima: "#E040FB",
        lightProxima: "#EA80FC",
      };
    }
    return {
      emissiveA: "#FFD54F",
      lightA: "#FFE082",
      emissiveB: "#FF7043",
      lightB: "#FFAB91",
      emissiveProxima: "#FF1744",
      lightProxima: "#FF5252",
    };
  }, [wavelength]);

  // Animation frame for orbital revolutions
  useFrame((_, delta) => {
    // 1. Binary mutual orbit rotation
    if (autoRotate && binaryGroupRef.current) {
      binaryGroupRef.current.rotation.y += delta * 0.12;
    }

    // 2. Proxima orbit around distant barycenter
    if (autoRotate && proximaGroupRef.current) {
      proximaGroupRef.current.rotation.y += delta * 0.03;
    }

    // 3. Proxima b exoplanet orbit around Proxima Centauri
    if (autoRotate && proximaBPlanetRef.current) {
      proximaBPlanetRef.current.rotation.y += delta * 0.85;
    }

    // 4. Star halo pulsating breathing animation
    const time = Date.now() * 0.002;
    if (starAHaloRef.current) {
      const pulseA = 1.0 + Math.sin(time) * 0.05;
      starAHaloRef.current.scale.set(1.9 * pulseA, 1.9 * pulseA, 1);
    }
    if (starBHaloRef.current) {
      const pulseB = 1.0 + Math.sin(time + 1.5) * 0.05;
      starBHaloRef.current.scale.set(1.5 * pulseB, 1.5 * pulseB, 1);
    }
    if (proximaHaloRef.current) {
      const pulseP = 1.0 + Math.sin(time * 2.2) * 0.09; // Flare star rapid pulse
      proximaHaloRef.current.scale.set(0.9 * pulseP, 0.9 * pulseP, 1);
    }
  });

  const isSelectedA = activeCalloutId === "centauri-a";
  const isSelectedB = activeCalloutId === "centauri-b";
  const isSelectedProxima = activeCalloutId === "proxima-cen";
  const isSelectedProximaB = activeCalloutId === "proxima-b";

  return (
    <group>
      {/* Background Soft Starfield */}
      <BackgroundStarfield />

      {/* ------------------------------------------------------------------- */}
      {/* 1. BINARY PAIR A & B (Barycentric Orbit System)                     */}
      {/* ------------------------------------------------------------------- */}
      <group ref={binaryGroupRef}>
        {/* Keplerian Binary Mutual Orbital Tracks */}
        {showOrbits && (
          <>
            <OrbitRing radiusX={1.4} radiusY={1.3} color={spectralColors.emissiveA} opacity={0.25} />
            <HabitableZoneIndicator innerRadius={1.1} outerRadius={1.7} />
          </>
        )}

        {/* 1A. ALPHA CENTAURI A (Rigil Kentaurus - Yellow G2V Solar Twin) */}
        <group position={[-1.4, 0, 0]}>
          <pointLight color={spectralColors.lightA} intensity={2.8} distance={7.0} decay={2} />

          {/* Star Core Mesh */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelectCallout("centauri-a");
            }}
          >
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={spectralColors.emissiveA}
              emissiveIntensity={isSelectedA ? 2.8 : 1.9}
              roughness={0.05}
            />
          </mesh>

          {/* Soft Corona Luminous Halo */}
          {textures.glowA && (
            <sprite ref={starAHaloRef} scale={[1.9, 1.9, 1]}>
              <spriteMaterial
                map={textures.glowA}
                color={spectralColors.lightA}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}

          {/* 4-Point Telescopic Lens Flare */}
          {textures.spikeA && (
            <sprite scale={[2.6, 2.6, 1]}>
              <spriteMaterial
                map={textures.spikeA}
                color="#FFFFFF"
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}

          {/* Astrometric Target Reticle (Centered on Star) */}
          {showCallouts && isSelectedA && (
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              <div className="relative size-9 flex items-center justify-center pointer-events-none select-none">
                <div className="absolute inset-0 border border-amber-400/60 rounded-full animate-ping opacity-60" />
                <div className="absolute size-7 border border-dashed border-amber-300 rounded-full animate-[spin_8s_linear_infinite]" />
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-amber-300 shadow-[0_0_4px_#FFA726]" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-amber-300 shadow-[0_0_4px_#FFA726]" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-0.5 h-1.5 bg-amber-300 shadow-[0_0_4px_#FFA726]" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-0.5 h-1.5 bg-amber-300 shadow-[0_0_4px_#FFA726]" />
                <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
              </div>
            </Html>
          )}

          {/* Astrometric Name Label (Floats Cleanly Above Star) */}
          {showCallouts && (
            <group position={[0, 0.55, 0]}>
              <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                {isSelectedA ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider bg-amber-950/90 backdrop-blur-md border border-amber-400 text-white shadow-[0_0_12px_rgba(255,167,38,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                    <span className="size-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                    <span className="font-bold text-amber-300">TARGET:</span>
                    <span className="font-extrabold text-white">ALPHA CEN A</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCallout("centauri-a");
                    }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-amber-400/40 text-amber-200 hover:text-white hover:border-amber-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
                  >
                    <span className="size-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span className="font-bold text-white">ALPHA CEN A</span>
                    <span className="text-amber-300/70 text-[7px] font-semibold">G2V</span>
                  </button>
                )}
              </Html>
            </group>
          )}
        </group>

        {/* 1B. ALPHA CENTAURI B (Toliman - Orange K1V Dwarf) */}
        <group position={[1.4, 0, 0]}>
          <pointLight color={spectralColors.lightB} intensity={2.2} distance={6.0} decay={2} />

          {/* Star Core Mesh */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelectCallout("centauri-b");
            }}
          >
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={spectralColors.emissiveB}
              emissiveIntensity={isSelectedB ? 2.8 : 1.9}
              roughness={0.05}
            />
          </mesh>

          {/* Soft Corona Luminous Halo */}
          {textures.glowB && (
            <sprite ref={starBHaloRef} scale={[1.5, 1.5, 1]}>
              <spriteMaterial
                map={textures.glowB}
                color={spectralColors.lightB}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}

          {/* 4-Point Telescopic Lens Flare */}
          {textures.spikeB && (
            <sprite scale={[2.1, 2.1, 1]}>
              <spriteMaterial
                map={textures.spikeB}
                color="#FFFFFF"
                transparent
                opacity={0.65}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}

          {/* Astrometric Target Reticle (Centered on Star) */}
          {showCallouts && isSelectedB && (
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              <div className="relative size-8 flex items-center justify-center pointer-events-none select-none">
                <div className="absolute inset-0 border border-orange-400/60 rounded-full animate-ping opacity-60" />
                <div className="absolute size-6 border border-dashed border-orange-300 rounded-full animate-[spin_8s_linear_infinite]" />
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-orange-300 shadow-[0_0_4px_#FF7043]" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-orange-300 shadow-[0_0_4px_#FF7043]" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-0.5 h-1.5 bg-orange-300 shadow-[0_0_4px_#FF7043]" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-0.5 h-1.5 bg-orange-300 shadow-[0_0_4px_#FF7043]" />
                <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
              </div>
            </Html>
          )}

          {/* Astrometric Name Label (Floats Cleanly Above Star) */}
          {showCallouts && (
            <group position={[0, 0.48, 0]}>
              <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                {isSelectedB ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider bg-orange-950/90 backdrop-blur-md border border-orange-400 text-white shadow-[0_0_12px_rgba(255,112,67,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                    <span className="size-1.5 rounded-full bg-orange-400 animate-ping shrink-0" />
                    <span className="font-bold text-orange-300">TARGET:</span>
                    <span className="font-extrabold text-white">ALPHA CEN B</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCallout("centauri-b");
                    }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-orange-400/40 text-orange-200 hover:text-white hover:border-orange-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
                  >
                    <span className="size-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
                    <span className="font-bold text-white">ALPHA CEN B</span>
                    <span className="text-orange-300/70 text-[7px] font-semibold">K1V</span>
                  </button>
                )}
              </Html>
            </group>
          )}
        </group>
      </group>

      {/* ------------------------------------------------------------------- */}
      {/* 2. PROXIMA CENTAURI SYSTEM (Distant Red Dwarf & Exoplanet b)        */}
      {/* ------------------------------------------------------------------- */}
      <group ref={proximaGroupRef}>
        {showOrbits && (
          <OrbitRing radiusX={4.8} radiusY={4.0} color={spectralColors.emissiveProxima} opacity={0.15} />
        )}

        <group position={[4.8, 1.1, -1.2]}>
          <pointLight color={spectralColors.lightProxima} intensity={1.6} distance={4.5} decay={2} />

          {/* Proxima Habitable Zone Ring */}
          {showOrbits && (
            <HabitableZoneIndicator innerRadius={0.45} outerRadius={0.7} />
          )}

          {/* Proxima Centauri Star Core Mesh */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelectCallout("proxima-cen");
            }}
          >
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={spectralColors.emissiveProxima}
              emissiveIntensity={isSelectedProxima ? 2.8 : 1.9}
              roughness={0.05}
            />
          </mesh>

          {/* Proxima Red Dwarf Corona Halo */}
          {textures.glowProxima && (
            <sprite ref={proximaHaloRef} scale={[0.9, 0.9, 1]}>
              <spriteMaterial
                map={textures.glowProxima}
                color={spectralColors.lightProxima}
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}

          {/* Flare Star Diffraction Glint */}
          {textures.spikeProxima && (
            <sprite scale={[1.3, 1.3, 1]}>
              <spriteMaterial
                map={textures.spikeProxima}
                color="#FFFFFF"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}

          {/* Proxima Target Reticle (Centered) */}
          {showCallouts && isSelectedProxima && (
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              <div className="relative size-7 flex items-center justify-center pointer-events-none select-none">
                <div className="absolute inset-0 border border-red-400/60 rounded-full animate-ping opacity-60" />
                <div className="absolute size-5 border border-dashed border-red-300 rounded-full animate-[spin_8s_linear_infinite]" />
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-red-300 shadow-[0_0_4px_#FF1744]" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-red-300 shadow-[0_0_4px_#FF1744]" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-0.5 h-1.5 bg-red-300 shadow-[0_0_4px_#FF1744]" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-0.5 h-1.5 bg-red-300 shadow-[0_0_4px_#FF1744]" />
                <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
              </div>
            </Html>
          )}

          {/* Proxima Star Label (Floats Cleanly Above Proxima) */}
          {showCallouts && (
            <group position={[0, 0.38, 0]}>
              <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                {isSelectedProxima ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-red-950/90 backdrop-blur-md border border-red-400 text-white shadow-[0_0_12px_rgba(255,23,68,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                    <span className="size-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="font-bold text-red-300">TARGET:</span>
                    <span className="font-extrabold text-white">PROXIMA CEN</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCallout("proxima-cen");
                    }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-red-400/40 text-red-200 hover:text-white hover:border-red-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
                  >
                    <span className="size-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="font-bold text-white">PROXIMA CEN</span>
                    <span className="text-red-300/70 text-[7px] font-semibold">M5.5V</span>
                  </button>
                )}
              </Html>
            </group>
          )}

          {/* 2B. PROXIMA CENTAURI b (Habitable Zone Exoplanet) */}
          <group ref={proximaBPlanetRef}>
            {showOrbits && (
              <OrbitRing radiusX={0.78} radiusY={0.78} color="#00E676" opacity={0.4} />
            )}

            <group position={[0.78, 0, 0]}>
              {/* Exoplanet Sphere Mesh */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCallout("proxima-b");
                }}
              >
                <sphereGeometry args={[0.06, 24, 24]} />
                <meshStandardMaterial
                  color="#4DB6AC"
                  roughness={0.8}
                  metalness={0.1}
                />
              </mesh>

              {/* Atmospheric Glow */}
              <mesh>
                <sphereGeometry args={[0.065, 24, 24]} />
                <meshBasicMaterial
                  color="#80CBC4"
                  transparent
                  opacity={0.3}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>

              {/* Exoplanet Target Reticle (Centered) */}
              {showCallouts && isSelectedProximaB && (
                <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                  <div className="relative size-6 flex items-center justify-center pointer-events-none select-none">
                    <div className="absolute inset-0 border border-emerald-400/60 rounded-full animate-ping opacity-60" />
                    <div className="absolute size-4.5 border border-dashed border-emerald-300 rounded-full animate-[spin_8s_linear_infinite]" />
                  </div>
                </Html>
              )}

              {/* Exoplanet Label (Floats Cleanly Below Planet) */}
              {showCallouts && (
                <group position={[0, -0.22, 0]}>
                  <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                    {isSelectedProximaB ? (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[7px] uppercase tracking-wider bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-white shadow-[0_0_10px_rgba(0,230,118,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                        <Globe className="size-2 text-emerald-300 shrink-0" />
                        <span className="font-bold text-emerald-300">TARGET:</span>
                        <span className="font-extrabold text-white">PROXIMA b</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCallout("proxima-b");
                        }}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[7px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-emerald-400/40 text-emerald-300 hover:text-white hover:border-emerald-300 transition-all pointer-events-auto cursor-pointer shadow-sm whitespace-nowrap select-none"
                      >
                        <Globe className="size-2 text-emerald-400 shrink-0" />
                        <span className="font-bold">PROXIMA b</span>
                      </button>
                    )}
                  </Html>
                </group>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. AlphaCentauriViewer Main Export Component
// ---------------------------------------------------------------------------
export function AlphaCentauriViewer({
  callouts,
  activeCalloutId,
  onSelectCallout,
  wavelength,
}: AlphaCentauriViewerProps) {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showCallouts, setShowCallouts] = useState<boolean>(true);
  const [dragMode, setDragMode] = useState<"rotate" | "pan">("rotate");
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.3);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.3);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full min-h-0 bg-gradient-to-b from-[#050302] via-[#080502] to-[#020201] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      
      {/* 3D Three.js Interactive Viewport */}
      <Canvas
        camera={{ position: [0, 2.2, 7.8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: typeof window !== "undefined" && window.innerWidth < 768 ? "low-power" : "high-performance",
        }}
      >
        <ambientLight intensity={0.9} color="#FFE0B2" />
        <directionalLight position={[10, 15, 10]} intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#FF7043" />

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial wireframe color="#FFA726" />
            </mesh>
          }
        >
          <AlphaCentauriScene
            activeCalloutId={activeCalloutId}
            onSelectCallout={onSelectCallout}
            autoRotate={autoRotate}
            showOrbits={showOrbits}
            showCallouts={showCallouts}
            wavelength={wavelength}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          target={[0.5, 0.0, 0]}
          enablePan={true}
          panSpeed={1.2}
          screenSpacePanning={true}
          mouseButtons={{
            LEFT: dragMode === "pan" ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: dragMode === "pan" ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
          }}
          touches={{
            ONE: dragMode === "pan" ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          enableDamping
          dampingFactor={0.06}
          minDistance={1.8}
          maxDistance={18.0}
          rotateSpeed={0.7}
        />
      </Canvas>

      {/* Responsive Floating HUD Viewport Controls */}
      <DeepSpaceViewerHUD
        primaryToggle={{
          active: autoRotate,
          onToggle: () => setAutoRotate((prev) => !prev),
          label: "ORBIT",
          activeColorClass:
            "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(255,167,38,0.25)]",
          title: "Toggle Binary & Exoplanet Orbital Motion",
        }}
        dragMode={{
          mode: dragMode,
          onToggle: () =>
            setDragMode((prev) => (prev === "rotate" ? "pan" : "rotate")),
        }}
        featureToggle={{
          active: showOrbits,
          onToggle: () => setShowOrbits((prev) => !prev),
          label: "ZONES",
          icon: <Orbit className="size-3 sm:size-3.5 shrink-0" />,
          activeColorClass:
            "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(0,230,118,0.25)]",
          title: "Toggle Keplerian Orbits & Habitable Zones",
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
      />

      {/* Bottom Telemetry Legend */}
      <div className="flex absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 items-center gap-1.5 sm:gap-2 font-mono text-[8.5px] sm:text-[10px] text-white/70 bg-black/75 backdrop-blur-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/15 shadow-xl z-20 pointer-events-none whitespace-nowrap">
        <Compass className="size-3.5 text-amber-400 animate-spin shrink-0" />
        <span>LEFT CLICK: {dragMode === "pan" ? "PAN VIEW" : "360° ORBIT"} • RIGHT CLICK: PAN • SCROLL: ZOOM</span>
      </div>

    </div>
  );
}
