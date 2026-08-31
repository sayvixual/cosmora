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
  Sparkles,
  Flame,
  Activity,
  Disc,
} from "lucide-react";
import { DeepSpaceViewerHUD } from "./DeepSpaceViewerHUD";

interface OrionNebulaViewerProps {
  primaryImageUrl?: string;
  secondaryImageUrl?: string;
  callouts: DeepSpaceCallout[];
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  wavelength: "visible" | "infrared" | "ultraviolet";
}

// ---------------------------------------------------------------------------
// 1. Procedural Soft Texture Generators (Subtle, Atmospheric Falloffs)
// ---------------------------------------------------------------------------
function createSoftNebulaTexture(
  colorStop1: string,
  colorStop2: string,
  colorStop3: string
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, colorStop1);
    gradient.addColorStop(0.35, colorStop2);
    gradient.addColorStop(0.7, colorStop3);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createStarSpikeTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 64;
    const cy = 64;

    // Core Glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
    coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    coreGrad.addColorStop(0.35, color);
    coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal Spikes
    const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
    hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
    hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(cx, cy - 1.5);
    ctx.lineTo(128, cy);
    ctx.lineTo(cx, cy + 1.5);
    ctx.closePath();
    ctx.fill();

    // Vertical Spikes
    const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
    vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    vGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
    vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx - 1.5, cy);
    ctx.lineTo(cx, 128);
    ctx.lineTo(cx + 1.5, cy);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ---------------------------------------------------------------------------
// 2. Embedded Infant Starfield & Background Field
// ---------------------------------------------------------------------------
function NebulaStarfield({ wavelength }: { wavelength: "visible" | "infrared" | "ultraviolet" }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, starTexture } = useMemo(() => {
    let seed = 48291;
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
      const radius = 1.2 + Math.pow(prng(), 2.0) * 11.0;
      const theta = prng() * Math.PI * 2;
      const phi = (prng() - 0.5) * Math.PI * 0.85;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi) * 0.8;
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const pVal = prng();
      let color: THREE.Color;
      if (wavelength === "infrared") {
        color = pVal > 0.6 ? new THREE.Color("#FFE082") : pVal > 0.3 ? new THREE.Color("#FFAB91") : new THREE.Color("#FF7043");
      } else if (wavelength === "ultraviolet") {
        color = pVal > 0.5 ? new THREE.Color("#EA80FC") : pVal > 0.25 ? new THREE.Color("#B388FF") : new THREE.Color("#80D8FF");
      } else {
        color = pVal > 0.7 ? new THREE.Color("#E1F5FE") : pVal > 0.4 ? new THREE.Color("#FFFFFF") : pVal > 0.15 ? new THREE.Color("#FFCCBC") : new THREE.Color("#F8BBD0");
      }

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
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      gradient.addColorStop(0.25, "rgba(200, 230, 255, 0.7)");
      gradient.addColorStop(0.6, "rgba(100, 150, 255, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;

    return { positions: pos, colors: col, starTexture: tex };
  }, [wavelength]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.004;
    }
  });

  return (
    <points ref={pointsRef} key={`starfield-${wavelength}`}>
      <bufferGeometry key={`geom-${wavelength}`}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        key={`star-mat-${wavelength}`}
        map={starTexture}
        size={0.11}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 3. Volumetric Nebular Cloud Layer (Atmospheric & Dimmer Plasma Puffs)
// ---------------------------------------------------------------------------
interface NebularPuff {
  position: [number, number, number];
  baseScale: [number, number, number];
  rotationZ: number;
  speed: number;
  pulsePhase: number;
  type: "h-alpha" | "o-iii" | "dust-veil" | "uv-cavity";
}

function VolumetricNebulaClouds({
  flowEnabled,
  wavelength,
}: {
  flowEnabled: boolean;
  wavelength: "visible" | "infrared" | "ultraviolet";
}) {
  const cloudGroupRef = useRef<THREE.Group>(null);
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);

  const textures = useMemo(() => {
    if (wavelength === "infrared") {
      return {
        hAlpha: createSoftNebulaTexture(
          "rgba(255, 112, 67, 0.95)",
          "rgba(230, 81, 0, 0.65)",
          "rgba(191, 54, 12, 0.25)"
        ),
        oIII: createSoftNebulaTexture(
          "rgba(255, 183, 77, 0.9)",
          "rgba(245, 124, 0, 0.6)",
          "rgba(230, 81, 0, 0.2)"
        ),
        dustVeil: createSoftNebulaTexture(
          "rgba(255, 204, 128, 0.95)",
          "rgba(255, 152, 0, 0.65)",
          "rgba(216, 67, 21, 0.25)"
        ),
        uvCavity: createSoftNebulaTexture(
          "rgba(255, 224, 130, 0.85)",
          "rgba(255, 167, 38, 0.55)",
          "rgba(239, 108, 0, 0.18)"
        ),
      };
    } else if (wavelength === "ultraviolet") {
      return {
        hAlpha: createSoftNebulaTexture(
          "rgba(245, 0, 87, 0.95)",
          "rgba(197, 17, 98, 0.65)",
          "rgba(136, 14, 79, 0.25)"
        ),
        oIII: createSoftNebulaTexture(
          "rgba(0, 229, 255, 0.95)",
          "rgba(0, 176, 255, 0.65)",
          "rgba(41, 121, 255, 0.25)"
        ),
        dustVeil: createSoftNebulaTexture(
          "rgba(101, 31, 255, 0.9)",
          "rgba(98, 0, 234, 0.6)",
          "rgba(49, 27, 146, 0.2)"
        ),
        uvCavity: createSoftNebulaTexture(
          "rgba(224, 64, 251, 0.98)",
          "rgba(170, 0, 255, 0.7)",
          "rgba(74, 20, 140, 0.25)"
        ),
      };
    } else {
      // Visible Optical spectrum
      return {
        hAlpha: createSoftNebulaTexture(
          "rgba(255, 64, 129, 0.95)",
          "rgba(216, 27, 96, 0.55)",
          "rgba(136, 14, 79, 0.2)"
        ),
        oIII: createSoftNebulaTexture(
          "rgba(0, 229, 255, 0.95)",
          "rgba(0, 184, 212, 0.55)",
          "rgba(0, 96, 100, 0.2)"
        ),
        dustVeil: createSoftNebulaTexture(
          "rgba(255, 171, 64, 0.85)",
          "rgba(255, 109, 0, 0.45)",
          "rgba(191, 54, 12, 0.15)"
        ),
        uvCavity: createSoftNebulaTexture(
          "rgba(224, 64, 251, 0.9)",
          "rgba(170, 0, 255, 0.5)",
          "rgba(74, 20, 140, 0.18)"
        ),
      };
    }
  }, [wavelength]);

  // Generate deterministic clouds with variety of morphological shells
  const puffs = useMemo(() => {
    let seed = 73921;
    const prng = () => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const list: NebularPuff[] = [];
    const count = 42;

    for (let i = 0; i < count; i++) {
      const angle = prng() * Math.PI * 2;
      const dist = 0.6 + Math.pow(prng(), 1.4) * 3.8;
      const x = Math.cos(angle) * dist * 1.35;
      const y = Math.sin(angle) * dist * 0.95;
      const z = (prng() - 0.5) * 2.8;

      const size = 2.4 + prng() * 3.2;
      const rot = prng() * Math.PI * 2;
      const speed = 0.003 + prng() * 0.008;
      const pulsePhase = prng() * Math.PI * 2;

      const type: NebularPuff["type"] =
        dist < 1.3
          ? "o-iii"
          : dist < 2.6
          ? "h-alpha"
          : prng() > 0.5
          ? "dust-veil"
          : "uv-cavity";

      list.push({
        position: [x, y, z],
        baseScale: [size, size * (0.85 + prng() * 0.3), 1],
        rotationZ: rot,
        speed,
        pulsePhase,
        type,
      });
    }

    return list;
  }, []);

  // Organic fluid breathing oscillation in useFrame
  useFrame((_, delta) => {
    const time = Date.now() * 0.001;

    if (flowEnabled && cloudGroupRef.current) {
      cloudGroupRef.current.rotation.z += delta * 0.008;
      cloudGroupRef.current.rotation.y += delta * 0.005;
    }

    puffs.forEach((puff, idx) => {
      const sprite = spriteRefs.current[idx];
      if (sprite) {
        // Subtle organic breathing pulsation
        const wave = 1.0 + Math.sin(time * 0.6 + puff.pulsePhase) * 0.06;
        sprite.scale.set(
          puff.baseScale[0] * wave,
          puff.baseScale[1] * wave,
          1
        );
      }
    });
  });

  const getSpriteTexture = (type: NebularPuff["type"]) => {
    if (wavelength === "infrared") return type === "dust-veil" ? textures.dustVeil : textures.hAlpha;
    if (wavelength === "ultraviolet") return type === "uv-cavity" ? textures.uvCavity : textures.oIII;
    if (type === "o-iii") return textures.oIII;
    if (type === "h-alpha") return textures.hAlpha;
    if (type === "dust-veil") return textures.dustVeil;
    return textures.uvCavity;
  };

  const getSpriteOpacity = (type: NebularPuff["type"]) => {
    if (wavelength === "infrared") return type === "dust-veil" ? 0.52 : 0.36;
    if (wavelength === "ultraviolet") return type === "uv-cavity" ? 0.58 : 0.38;
    return type === "o-iii" ? 0.45 : 0.36;
  };

  return (
    <group ref={cloudGroupRef} key={`clouds-${wavelength}`}>
      {puffs.map((puff, idx) => {
        const tex = getSpriteTexture(puff.type);
        if (!tex) return null;

        return (
          <sprite
            key={`nebula-puff-${idx}-${wavelength}`}
            ref={(el) => {
              spriteRefs.current[idx] = el;
            }}
            position={puff.position}
            scale={puff.baseScale}
          >
            <spriteMaterial
              key={`sprite-mat-${wavelength}-${puff.type}-${idx}`}
              map={tex}
              transparent
              opacity={getSpriteOpacity(puff.type)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Central Trapezium Cluster Stars (θ1 Orionis A, B, C, D)
// ---------------------------------------------------------------------------
const TRAPEZIUM_STARS = [
  { id: "theta-c", name: "θ1 Ori C (O7V)", pos: [0.0, 0.12, 0.0] as [number, number, number], radius: 0.11, color: "#E1F5FE", emissive: "#00E5FF" },
  { id: "theta-a", name: "θ1 Ori A (B0.5V)", pos: [-0.25, 0.28, 0.05] as [number, number, number], radius: 0.08, color: "#FFFFFF", emissive: "#40C4FF" },
  { id: "theta-b", name: "θ1 Ori B (B1V)", pos: [-0.20, -0.12, -0.05] as [number, number, number], radius: 0.07, color: "#FFFFFF", emissive: "#00B0FF" },
  { id: "theta-d", name: "θ1 Ori D (B0.5V)", pos: [0.26, -0.04, 0.02] as [number, number, number], radius: 0.085, color: "#FFFFFF", emissive: "#80D8FF" },
];

function TrapeziumCluster({
  isSelected,
  onSelect,
  showCallouts,
  wavelength = "visible",
}: {
  isSelected: boolean;
  onSelect: () => void;
  showCallouts: boolean;
  wavelength?: "visible" | "infrared" | "ultraviolet";
}) {
  const haloRef = useRef<THREE.Sprite>(null);
  const [haloTexture, setHaloTexture] = useState<THREE.CanvasTexture | null>(null);
  const [spikeTexture, setSpikeTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setHaloTexture(createSoftNebulaTexture("rgba(255, 255, 255, 0.95)", "rgba(128, 216, 255, 0.6)", "rgba(0, 229, 255, 0.2)"));
    setSpikeTexture(createStarSpikeTexture("#80D8FF"));
  }, []);

  useFrame(() => {
    if (haloRef.current) {
      const pulse = 1.0 + Math.sin(Date.now() * 0.003) * 0.08;
      haloRef.current.scale.set(3.4 * pulse, 3.4 * pulse, 1);
    }
  });

  const clusterLightColor =
    wavelength === "infrared" ? "#FFA726" : wavelength === "ultraviolet" ? "#B388FF" : "#E0F7FA";

  const getStarEmissive = (star: (typeof TRAPEZIUM_STARS)[number]) => {
    if (wavelength === "infrared") return "#FFA726";
    if (wavelength === "ultraviolet") return "#B388FF";
    return star.emissive;
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Intense Core Ionizing Stellar Light Source */}
      <pointLight color={clusterLightColor} intensity={3.5} distance={10.0} decay={2} />

      {/* Shared Volumetric Ionization Bubble Glow */}
      {haloTexture && (
        <sprite ref={haloRef} scale={[3.4, 3.4, 1]}>
          <spriteMaterial
            map={haloTexture}
            color={clusterLightColor}
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* Individual 4 Primary Massive Stars */}
      {TRAPEZIUM_STARS.map((star) => (
        <group key={star.id} position={star.pos}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <sphereGeometry args={[star.radius, 24, 24]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={getStarEmissive(star)}
              emissiveIntensity={isSelected ? 2.2 : 1.4}
              roughness={0.05}
            />
          </mesh>

          {/* 4-Point Telescopic Flare */}
          {spikeTexture && (
            <sprite scale={[star.radius * 10, star.radius * 10, 1]}>
              <spriteMaterial
                map={spikeTexture}
                color="#FFFFFF"
                transparent
                opacity={0.65}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      ))}

      {/* Target Reticle (Centered) */}
      {showCallouts && isSelected && (
        <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <div className="relative size-9 flex items-center justify-center pointer-events-none select-none">
            <div className="absolute inset-0 border border-cyan-400/60 rounded-full animate-ping opacity-60" />
            <div className="absolute size-7 border border-dashed border-cyan-300 rounded-full animate-[spin_8s_linear_infinite]" />
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
            <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-0.5 h-1.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-0.5 h-1.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
            <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
          </div>
        </Html>
      )}

      {/* Floating Label (Above Cluster) */}
      {showCallouts && (
        <group position={[0, 0.58, 0]}>
          <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            {isSelected ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider bg-cyan-950/90 backdrop-blur-md border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                <span className="size-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span className="font-bold text-cyan-300">TARGET:</span>
                <span className="font-extrabold text-white">TRAPEZIUM CLUSTER</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-cyan-400/40 text-cyan-200 hover:text-white hover:border-cyan-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
              >
                <Sparkles className="size-2 text-cyan-400 shrink-0" />
                <span className="font-bold text-white">TRAPEZIUM</span>
                <span className="text-cyan-300/70 text-[7px] font-semibold">θ1 ORI</span>
              </button>
            )}
          </Html>
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. Astrophysical Feature Structures (OMC-1, Proplyds, Herbig-Haro)
// ---------------------------------------------------------------------------
function AstrophysicalStructures({
  activeCalloutId,
  onSelectCallout,
  showCallouts,
  showStructures,
}: {
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  showCallouts: boolean;
  showStructures: boolean;
}) {
  const proplydDiskRef = useRef<THREE.Mesh>(null);
  const hhJetRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (proplydDiskRef.current) {
      proplydDiskRef.current.rotation.z += delta * 0.3;
    }
    if (hhJetRef.current) {
      hhJetRef.current.rotation.y += delta * 0.2;
    }
  });

  const isSelectedOMC = activeCalloutId === "omc-1";
  const isSelectedProplyd = activeCalloutId === "proplyds";
  const isSelectedHH = activeCalloutId === "herbig-haro";

  return (
    <group>
      {/* ----------------------------------------------------------------- */}
      {/* 5A. OMC-1 MOLECULAR CORE                                          */}
      {/* ----------------------------------------------------------------- */}
      <group
        position={[-1.8, 1.2, -0.6]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCallout("omc-1");
        }}
      >
        <pointLight color="#FF9800" intensity={1.1} distance={3.8} decay={2} />

        {/* Dense Infrared Core Sphere */}
        <mesh>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color="#FF6F00"
            emissive="#FF8F00"
            emissiveIntensity={isSelectedOMC ? 2.2 : 1.2}
            roughness={0.5}
          />
        </mesh>

        {/* Delicate Shockwave Rings */}
        {showStructures && (
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.22, 0.36, 32]} />
            <meshBasicMaterial
              color="#FFB300"
              transparent
              opacity={0.22}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Reticle Lock */}
        {showCallouts && isSelectedOMC && (
          <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <div className="relative size-8 flex items-center justify-center pointer-events-none select-none">
              <div className="absolute inset-0 border border-amber-400/60 rounded-full animate-ping opacity-60" />
              <div className="absolute size-6 border border-dashed border-amber-300 rounded-full animate-[spin_8s_linear_infinite]" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-amber-300 shadow-[0_0_4px_#FFA726]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-amber-300 shadow-[0_0_4px_#FFA726]" />
              <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
            </div>
          </Html>
        )}

        {/* Floating Label */}
        {showCallouts && (
          <group position={[0, 0.38, 0]}>
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              {isSelectedOMC ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-amber-950/90 backdrop-blur-md border border-amber-400 text-white shadow-[0_0_12px_rgba(255,167,38,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                  <span className="size-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span className="font-bold text-amber-300">TARGET:</span>
                  <span className="font-extrabold text-white">OMC-1 CORE</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCallout("omc-1");
                  }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-amber-400/40 text-amber-200 hover:text-white hover:border-amber-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
                >
                  <Flame className="size-2 text-amber-400 shrink-0" />
                  <span className="font-bold text-white">OMC-1 CORE</span>
                  <span className="text-amber-300/70 text-[6.5px]">PROTOSTAR</span>
                </button>
              )}
            </Html>
          </group>
        )}
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 5B. PROPLYDS (Photo-Evaporating Protoplanetary Disks)              */}
      {/* ----------------------------------------------------------------- */}
      <group
        position={[1.9, -0.6, 0.4]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCallout("proplyds");
        }}
      >
        <pointLight color="#00E676" intensity={0.9} distance={3.0} decay={2} />

        {/* Infant Protostar */}
        <mesh>
          <sphereGeometry args={[0.065, 20, 20]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#00E676" emissiveIntensity={1.5} />
        </mesh>

        {/* Circumstellar Protoplanetary Disk */}
        {showStructures && (
          <mesh ref={proplydDiskRef} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
            <ringGeometry args={[0.09, 0.28, 32]} />
            <meshBasicMaterial
              color="#00E676"
              transparent
              opacity={0.28}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Reticle Lock */}
        {showCallouts && isSelectedProplyd && (
          <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <div className="relative size-8 flex items-center justify-center pointer-events-none select-none">
              <div className="absolute inset-0 border border-emerald-400/60 rounded-full animate-ping opacity-60" />
              <div className="absolute size-6 border border-dashed border-emerald-300 rounded-full animate-[spin_8s_linear_infinite]" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-emerald-300 shadow-[0_0_4px_#00E676]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-emerald-300 shadow-[0_0_4px_#00E676]" />
              <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
            </div>
          </Html>
        )}

        {/* Floating Label */}
        {showCallouts && (
          <group position={[0, 0.35, 0]}>
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              {isSelectedProplyd ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-white shadow-[0_0_12px_rgba(0,230,118,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="font-bold text-emerald-300">TARGET:</span>
                  <span className="font-extrabold text-white">PROPLYD DISKS</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCallout("proplyds");
                  }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-emerald-400/40 text-emerald-200 hover:text-white hover:border-emerald-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
                >
                  <Disc className="size-2 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white">PROPLYDS</span>
                  <span className="text-emerald-300/70 text-[6.5px]">DISK</span>
                </button>
              )}
            </Html>
          </group>
        )}
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 5C. HERBIG-HARO SHOCK FRONTS (HH 203 & HH 204 Outflow Jets)        */}
      {/* ----------------------------------------------------------------- */}
      <group
        position={[-1.4, -1.3, 0.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCallout("herbig-haro");
        }}
      >
        <pointLight color="#E040FB" intensity={1.0} distance={3.2} decay={2} />

        {/* Shock Jet Cone Outflow */}
        {showStructures && (
          <group ref={hhJetRef}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <coneGeometry args={[0.18, 0.55, 16, 1, true]} />
              <meshBasicMaterial
                color="#E040FB"
                transparent
                opacity={0.25}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}

        {/* Reticle Lock */}
        {showCallouts && isSelectedHH && (
          <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <div className="relative size-8 flex items-center justify-center pointer-events-none select-none">
              <div className="absolute inset-0 border border-fuchsia-400/60 rounded-full animate-ping opacity-60" />
              <div className="absolute size-6 border border-dashed border-fuchsia-300 rounded-full animate-[spin_8s_linear_infinite]" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-fuchsia-300 shadow-[0_0_4px_#E040FB]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-fuchsia-300 shadow-[0_0_4px_#E040FB]" />
              <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
            </div>
          </Html>
        )}

        {/* Floating Label */}
        {showCallouts && (
          <group position={[0, 0.35, 0]}>
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              {isSelectedHH ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-fuchsia-950/90 backdrop-blur-md border border-fuchsia-400 text-white shadow-[0_0_12px_rgba(224,64,251,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                  <span className="size-1.5 rounded-full bg-fuchsia-400 animate-ping shrink-0" />
                  <span className="font-bold text-fuchsia-300">TARGET:</span>
                  <span className="font-extrabold text-white">HERBIG-HARO JETS</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCallout("herbig-haro");
                  }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-[#050811]/90 backdrop-blur-md border border-fuchsia-400/40 text-fuchsia-200 hover:text-white hover:border-fuchsia-300 transition-all pointer-events-auto cursor-pointer shadow-md whitespace-nowrap select-none"
                >
                  <Activity className="size-2 text-fuchsia-400 shrink-0" />
                  <span className="font-bold text-white">HH JETS</span>
                  <span className="text-fuchsia-300/70 text-[6.5px]">SHOCK</span>
                </button>
              )}
            </Html>
          </group>
        )}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. OrionNebulaViewer Main Export Component
// ---------------------------------------------------------------------------
export function OrionNebulaViewer({
  callouts,
  activeCalloutId,
  onSelectCallout,
  wavelength,
}: OrionNebulaViewerProps) {
  const [flowEnabled, setFlowEnabled] = useState<boolean>(true);
  const [showStructures, setShowStructures] = useState<boolean>(true);
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

  const isTrapeziumSelected = activeCalloutId === "trapezium";

  return (
    <div className="relative w-full h-full min-h-0 bg-gradient-to-b from-[#020104] via-[#040208] to-[#010002] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      
      {/* 3D Interactive Three.js Viewport */}
      <Canvas
        camera={{ position: [0, 0.3, 7.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: typeof window !== "undefined" && window.innerWidth < 768 ? "low-power" : "high-performance",
        }}
      >
        <ambientLight
          intensity={0.3}
          color={wavelength === "infrared" ? "#FFE082" : wavelength === "ultraviolet" ? "#CE93D8" : "#E1BEE7"}
        />
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.4}
          color={wavelength === "infrared" ? "#FFB74D" : wavelength === "ultraviolet" ? "#B388FF" : "#FFFFFF"}
        />

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial wireframe color="#E91E63" />
            </mesh>
          }
        >
          <group>
            {/* Embedded Starfield */}
            <NebulaStarfield wavelength={wavelength} />

            {/* Volumetric Hydrodynamic Multi-Spectrum Nebular Gas Clouds */}
            <VolumetricNebulaClouds flowEnabled={flowEnabled} wavelength={wavelength} />

            {/* Central Ionizing Trapezium Cluster Engine */}
            <TrapeziumCluster
              isSelected={isTrapeziumSelected}
              onSelect={() => onSelectCallout("trapezium")}
              showCallouts={showCallouts}
              wavelength={wavelength}
            />

            {/* Astrophysical Structures: OMC-1, Proplyds, Herbig-Haro */}
            <AstrophysicalStructures
              activeCalloutId={activeCalloutId}
              onSelectCallout={onSelectCallout}
              showCallouts={showCallouts}
              showStructures={showStructures}
            />
          </group>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
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
          active: flowEnabled,
          onToggle: () => setFlowEnabled((prev) => !prev),
          label: "FLOW",
          activeColorClass:
            "bg-fuchsia-500/25 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_10px_rgba(224,64,251,0.25)]",
          title: "Toggle Nebular Hydrodynamic Plasma Flow",
        }}
        dragMode={{
          mode: dragMode,
          onToggle: () =>
            setDragMode((prev) => (prev === "rotate" ? "pan" : "rotate")),
        }}
        featureToggle={{
          active: showStructures,
          onToggle: () => setShowStructures((prev) => !prev),
          label: "STRUCTURES",
          activeColorClass:
            "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]",
          title: "Toggle Proplyds & Herbig-Haro Outflow Structures",
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
      />

      {/* Bottom Telemetry Legend */}
      <div className="flex absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 items-center gap-1.5 sm:gap-2 font-mono text-[8.5px] sm:text-[10px] text-white/70 bg-black/75 backdrop-blur-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/15 shadow-xl z-20 pointer-events-none whitespace-nowrap">
        <Compass className="size-3.5 text-fuchsia-400 animate-spin shrink-0" />
        <span>LEFT CLICK: {dragMode === "pan" ? "PAN VIEW" : "360° ORBIT"} • RIGHT CLICK: PAN • SCROLL: ZOOM</span>
      </div>

    </div>
  );
}
