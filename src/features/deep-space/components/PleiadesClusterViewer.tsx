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
  X,
  Eye,
  Info,
} from "lucide-react";
import { DeepSpaceViewerHUD } from "./DeepSpaceViewerHUD";

interface PleiadesClusterViewerProps {
  primaryImageUrl?: string;
  callouts: DeepSpaceCallout[];
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  wavelength: "visible" | "infrared" | "ultraviolet";
}

// ---------------------------------------------------------------------------
// 1. Procedural Texture Generators (Soft Circular Glows, No Square Pixels!)
// ---------------------------------------------------------------------------
function createSoftStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.15, "rgba(220, 242, 255, 0.95)");
    gradient.addColorStop(0.42, "rgba(75, 158, 255, 0.45)");
    gradient.addColorStop(0.72, "rgba(30, 90, 220, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createNebulaPuffTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.22, "rgba(100, 190, 255, 0.5)");
    gradient.addColorStop(0.52, "rgba(45, 130, 255, 0.18)");
    gradient.addColorStop(0.82, "rgba(15, 60, 180, 0.04)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createSpikeFlareTexture(): THREE.CanvasTexture {
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
    coreGrad.addColorStop(0.35, "rgba(180, 225, 255, 0.75)");
    coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal Diffraction Spike
    const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
    hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
    hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(cx, cy - 2);
    ctx.lineTo(128, cy);
    ctx.lineTo(cx, cy + 2);
    ctx.closePath();
    ctx.fill();

    // Vertical Diffraction Spike
    const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
    vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    vGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
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
// 2. Harmoniously Balanced Seven Sisters Star Definitions
// ---------------------------------------------------------------------------
interface MajorStarDef {
  id: string;
  name: string;
  bayer: string;
  pos: [number, number, number];
  radius: number;
  color: string;
  glowColor: string;
  spectral: string;
  temp: string;
  mag: string;
  calloutId?: string;
  hasDisk?: boolean;
  isPrimary?: boolean;
}

const PLEIADES_STARS: MajorStarDef[] = [
  {
    id: "alcyone",
    name: "Alcyone",
    bayer: "η Tauri (25 Tau)",
    pos: [0.0, -0.15, 0.0],
    radius: 0.28,
    color: "#FFFFFF",
    glowColor: "#40C4FF",
    spectral: "B7IIIe",
    temp: "12,300 K",
    mag: "+2.87 mag",
    calloutId: "alcyone",
    isPrimary: true,
  },
  {
    id: "maia",
    name: "Maia",
    bayer: "20 Tauri",
    pos: [-0.95, 0.75, 0.25],
    radius: 0.23,
    color: "#F0F8FF",
    glowColor: "#80D8FF",
    spectral: "B8III",
    temp: "12,600 K",
    mag: "+3.87 mag",
    calloutId: "maia",
    isPrimary: true,
  },
  {
    id: "electra",
    name: "Electra",
    bayer: "17 Tauri",
    pos: [-1.9, 0.1, -0.18],
    radius: 0.24,
    color: "#F0F8FF",
    glowColor: "#448AFF",
    spectral: "B6IIIe",
    temp: "13,480 K",
    mag: "+3.70 mag",
    calloutId: "electra",
    isPrimary: true,
  },
  {
    id: "merope",
    name: "Merope",
    bayer: "23 Tauri",
    pos: [0.4, -1.1, 0.25],
    radius: 0.23,
    color: "#E1F5FE",
    glowColor: "#00E5FF",
    spectral: "B6IVe",
    temp: "14,000 K",
    mag: "+4.17 mag",
    calloutId: "merope",
    isPrimary: true,
  },
  {
    id: "taygeta",
    name: "Taygeta",
    bayer: "19 Tauri",
    pos: [-1.6, 1.05, -0.28],
    radius: 0.19,
    color: "#E8EAF6",
    glowColor: "#82B1FF",
    spectral: "B6V",
    temp: "13,400 K",
    mag: "+4.30 mag",
  },
  {
    id: "celaeno",
    name: "Celaeno",
    bayer: "16 Tauri",
    pos: [-2.05, 0.55, 0.12],
    radius: 0.15,
    color: "#E3F2FD",
    glowColor: "#82B1FF",
    spectral: "B7IV",
    temp: "12,800 K",
    mag: "+5.45 mag",
  },
  {
    id: "asterope",
    name: "Asterope",
    bayer: "21 Tauri",
    pos: [-0.95, 1.35, 0.08],
    radius: 0.15,
    color: "#E1F5FE",
    glowColor: "#80D8FF",
    spectral: "B8V",
    temp: "12,000 K",
    mag: "+5.65 mag",
  },
  {
    id: "atlas",
    name: "Atlas",
    bayer: "27 Tauri",
    pos: [1.7, -0.25, -0.18],
    radius: 0.24,
    color: "#E0F2F1",
    glowColor: "#29B6F6",
    spectral: "B8III",
    temp: "12,300 K",
    mag: "+3.63 mag",
    calloutId: "atlas-pleione",
    isPrimary: true,
  },
  {
    id: "pleione",
    name: "Pleione",
    bayer: "28 Tauri (Be Star)",
    pos: [1.95, 0.2, -0.28],
    radius: 0.17,
    color: "#E0F7FA",
    glowColor: "#00E5FF",
    spectral: "B8Vne",
    temp: "12,000 K",
    mag: "+5.05 mag",
    hasDisk: true,
    calloutId: "atlas-pleione",
  },
];

// ---------------------------------------------------------------------------
// 3. Individual 3D Star Entity with Clean Focused Reticle
// ---------------------------------------------------------------------------
function StarEntity({
  star,
  isSelected,
  activeCalloutId,
  showCallouts,
  showDiffraction,
  wavelength,
  starTexture,
  spikeTexture,
  onSelect,
}: {
  star: MajorStarDef;
  isSelected: boolean;
  activeCalloutId: string | null;
  showCallouts: boolean;
  showDiffraction: boolean;
  wavelength: "visible" | "infrared" | "ultraviolet";
  starTexture: THREE.CanvasTexture | null;
  spikeTexture: THREE.CanvasTexture | null;
  onSelect: (id: string) => void;
}) {
  const haloRef = useRef<THREE.Sprite>(null);
  const spikeRef = useRef<THREE.Sprite>(null);
  const diskRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const emissiveColor = useMemo(() => {
    if (wavelength === "infrared") return "#FFA726";
    if (wavelength === "ultraviolet") return "#B388FF";
    return star.glowColor;
  }, [wavelength, star.glowColor]);

  useFrame((_, delta) => {
    if (haloRef.current) {
      const pulse = 1.0 + Math.sin(Date.now() * 0.0025 + star.radius * 20) * 0.06;
      haloRef.current.scale.setScalar(star.radius * (isSelected ? 7.2 : 5.8) * pulse);
    }
    if (spikeRef.current && showDiffraction) {
      spikeRef.current.scale.setScalar(star.radius * (isSelected ? 9.0 : 7.0));
    }
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.7;
    }
  });

  // Render in-scene micro labels when Astrometry callouts are enabled
  const shouldRenderHtml = showCallouts;

  return (
    <group position={star.pos}>
      {/* Point Light for Primary Stars */}
      {star.isPrimary && (
        <pointLight
          color={emissiveColor}
          intensity={isSelected ? 3.5 : 2.0}
          distance={6.5}
          decay={2}
        />
      )}

      {/* 1. Star Core Mesh */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(star.calloutId || star.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <sphereGeometry args={[star.radius, 32, 32]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 2.8 : 1.9}
          roughness={0.05}
        />
      </mesh>

      {/* 2. Soft Radial Glow Halo */}
      {starTexture && (
        <sprite ref={haloRef} scale={[star.radius * 5.8, star.radius * 5.8, 1]}>
          <spriteMaterial
            map={starTexture}
            color={emissiveColor}
            transparent
            opacity={isSelected ? 0.9 : 0.72}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 3. 4-Point Telescopic Lens Flare / Diffraction Spikes */}
      {showDiffraction && spikeTexture && star.isPrimary && (
        <sprite ref={spikeRef} scale={[star.radius * 7.0, star.radius * 7.0, 1]}>
          <spriteMaterial
            map={spikeTexture}
            color="#FFFFFF"
            transparent
            opacity={isSelected ? 0.85 : 0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 4. Equatorial Accretion Disk for Pleione */}
      {star.hasDisk && (
        <mesh ref={diskRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[star.radius * 1.5, star.radius * 3.0, 32]} />
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 5. In-Scene Target Reticle & Astrometric Label */}
      {shouldRenderHtml && (
        <>
          {/* Active Target Reticle (Centered on Star) */}
          {isSelected && (
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              <div className="relative size-8 flex items-center justify-center pointer-events-none select-none">
                {/* Pulsing outer sensor ring */}
                <div className="absolute inset-0 border border-cyan-400/60 rounded-full animate-ping opacity-60" />
                {/* Rotating dashed precision ring */}
                <div className="absolute size-6 border border-dashed border-cyan-300 rounded-full animate-[spin_8s_linear_infinite]" />
                {/* 4 Corner Crosshairs */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-0.5 h-1.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-0.5 h-1.5 bg-cyan-300 shadow-[0_0_4px_#00E5FF]" />
                <div className="size-1 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
              </div>
            </Html>
          )}

          {/* Floating Label (Above Star) */}
          <group position={[0, star.radius + 0.32, 0]}>
            <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
              {isSelected ? (
                /* Active Target Lock Marker Badge */
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider bg-cyan-950/90 backdrop-blur-md border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.7)] whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-150">
                  <span className="size-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="font-bold text-cyan-300">TARGET:</span>
                  <span className="font-extrabold text-white">{star.name}</span>
                </div>
              ) : (
                /* Sleek Idle Micro Label */
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(star.calloutId || star.id);
                  }}
                  className={cn(
                    "group flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[7.5px] uppercase tracking-wider transition-all duration-150 pointer-events-auto cursor-pointer shadow-sm select-none whitespace-nowrap",
                    hovered
                      ? "bg-cyan-500/40 border border-cyan-300 text-white scale-105 shadow-[0_0_8px_rgba(75,158,255,0.6)] z-10"
                      : "bg-[#050811]/75 border border-white/15 text-white/70 hover:text-white hover:border-cyan-400/50"
                  )}
                  title={`Inspect ${star.name}`}
                >
                  <span
                    className="size-1 rounded-full animate-pulse shrink-0"
                    style={{ backgroundColor: emissiveColor }}
                  />
                  <span className="font-semibold text-[7.5px]">{star.name}</span>
                </button>
              )}
            </Html>
          </group>
        </>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 4. Volumetric Reflection Nebula Clouds (Soft Radial Puffs)
// ---------------------------------------------------------------------------
function ReflectionNebulaCloud({
  wavelength,
  showNebula,
  nebulaTexture,
}: {
  wavelength: "visible" | "infrared" | "ultraviolet";
  showNebula: boolean;
  nebulaTexture: THREE.CanvasTexture | null;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    let seed = 424242;
    const prng = () => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const count = 2200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const centroids = [
      { x: 0.4, y: -1.1, z: 0.25, spread: 1.5, weight: 0.38 }, // Merope (IC 349)
      { x: -0.95, y: 0.75, z: 0.25, spread: 1.4, weight: 0.26 }, // Maia (NGC 1432)
      { x: 0.0, y: -0.15, z: 0.0, spread: 1.7, weight: 0.22 }, // Alcyone
      { x: -1.9, y: 0.1, z: -0.18, spread: 1.3, weight: 0.14 }, // Electra
    ];

    for (let i = 0; i < count; i++) {
      const rPick = prng();
      let picked = centroids[0];
      let acc = 0;
      for (const c of centroids) {
        acc += c.weight;
        if (rPick <= acc) {
          picked = c;
          break;
        }
      }

      const u1 = Math.max(prng(), 1e-6);
      const u2 = prng();
      const radius = Math.sqrt(-2.0 * Math.log(u1)) * picked.spread * 0.65;
      const theta = u2 * Math.PI * 2;
      const phi = (prng() - 0.5) * Math.PI;

      pos[i * 3] = picked.x + radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = picked.y + radius * Math.sin(phi);
      pos[i * 3 + 2] = picked.z + radius * Math.sin(theta) * Math.cos(phi) * 0.6;

      const tempR = prng();
      let c: THREE.Color;

      if (wavelength === "infrared") {
        c = tempR > 0.6 ? new THREE.Color("#FFA726") : tempR > 0.3 ? new THREE.Color("#FF7043") : new THREE.Color("#FFB300");
      } else if (wavelength === "ultraviolet") {
        c = tempR > 0.6 ? new THREE.Color("#7C4DFF") : tempR > 0.3 ? new THREE.Color("#00E5FF") : new THREE.Color("#E040FB");
      } else {
        c = tempR > 0.6 ? new THREE.Color("#4B9EFF") : tempR > 0.3 ? new THREE.Color("#00E5FF") : new THREE.Color("#70D6FF");
      }

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, [wavelength]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012;
    }
  });

  if (!showNebula || !nebulaTexture) return null;

  return (
    <points ref={pointsRef} key={`reflection-cloud-${wavelength}`}>
      <bufferGeometry key={`geom-${wavelength}`}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        key={`mat-${wavelength}`}
        map={nebulaTexture}
        size={0.65}
        vertexColors
        transparent
        opacity={wavelength === "infrared" ? 0.35 : 0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 5. Background Open Cluster Point Stars (~750 Soft Radial Points)
// ---------------------------------------------------------------------------
function OpenClusterMemberStars({
  starTexture,
  wavelength,
}: {
  starTexture: THREE.CanvasTexture | null;
  wavelength: "visible" | "infrared" | "ultraviolet";
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    let seed = 777123;
    const prng = () => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const count = 750;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.pow(prng(), 0.65) * 11.5;
      const theta = prng() * Math.PI * 2;
      const phi = (prng() - 0.5) * Math.PI;

      pos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi) * 0.8;

      const pVal = prng();
      let color: THREE.Color;

      if (wavelength === "infrared") {
        color = pVal > 0.5 ? new THREE.Color("#FFA726") : pVal > 0.25 ? new THREE.Color("#FF7043") : new THREE.Color("#FFD54F");
      } else if (wavelength === "ultraviolet") {
        color = pVal > 0.5 ? new THREE.Color("#B388FF") : pVal > 0.25 ? new THREE.Color("#7C4DFF") : new THREE.Color("#E040FB");
      } else {
        color =
          pVal > 0.65
            ? new THREE.Color("#E0F7FA") // B-type blue-white
            : pVal > 0.35
            ? new THREE.Color("#FFFFFF") // A/F white
            : pVal > 0.15
            ? new THREE.Color("#FFF9C4") // G/K warm
            : new THREE.Color("#FFCC80"); // M dwarf
      }

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { positions: pos, colors: col };
  }, [wavelength]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.008;
    }
  });

  if (!starTexture) return null;

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
// 6. Main 3D Pleiades Cluster Scene Container
// ---------------------------------------------------------------------------
function PleiadesScene({
  activeCalloutId,
  onSelectCallout,
  autoRotate,
  showNebula,
  showCallouts,
  showDiffraction,
  wavelength,
}: {
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  autoRotate: boolean;
  showNebula: boolean;
  showCallouts: boolean;
  showDiffraction: boolean;
  wavelength: "visible" | "infrared" | "ultraviolet";
}) {
  const sceneGroupRef = useRef<THREE.Group>(null);

  const [textures, setTextures] = useState<{
    star: THREE.CanvasTexture | null;
    nebula: THREE.CanvasTexture | null;
    spike: THREE.CanvasTexture | null;
  }>({ star: null, nebula: null, spike: null });

  useEffect(() => {
    setTextures({
      star: createSoftStarTexture(),
      nebula: createNebulaPuffTexture(),
      spike: createSpikeFlareTexture(),
    });
  }, []);

  useFrame((_, delta) => {
    if (autoRotate && sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* 1. Volumetric Reflection Nebula Gas & Dust */}
      <ReflectionNebulaCloud
        wavelength={wavelength}
        showNebula={showNebula}
        nebulaTexture={textures.nebula}
      />

      {/* 2. Background Open Cluster Member Stars */}
      <OpenClusterMemberStars starTexture={textures.star} wavelength={wavelength} />

      {/* 3. Principal Seven Sisters Luminous Stars */}
      {PLEIADES_STARS.map((star) => {
        const isSelected =
          (star.calloutId && star.calloutId === activeCalloutId) ||
          star.id === activeCalloutId;

        return (
          <StarEntity
            key={star.id}
            star={star}
            isSelected={!!isSelected}
            activeCalloutId={activeCalloutId}
            showCallouts={showCallouts}
            showDiffraction={showDiffraction}
            wavelength={wavelength}
            starTexture={textures.star}
            spikeTexture={textures.spike}
            onSelect={(id) => {
              onSelectCallout(activeCalloutId === id ? null : id);
            }}
          />
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. PleiadesClusterViewer Component Export with Fixed 2D Telemetry Card
// ---------------------------------------------------------------------------
export function PleiadesClusterViewer({
  callouts,
  activeCalloutId,
  onSelectCallout,
  wavelength,
}: PleiadesClusterViewerProps) {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showNebula, setShowNebula] = useState<boolean>(true);
  const [showCallouts, setShowCallouts] = useState<boolean>(true);
  const [showDiffraction, setShowDiffraction] = useState<boolean>(true);
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

  const ambientColor = wavelength === "infrared" ? "#FFE082" : wavelength === "ultraviolet" ? "#E1BEE7" : "#D0E8FF";
  const lightColor1 = wavelength === "infrared" ? "#FFB74D" : wavelength === "ultraviolet" ? "#B388FF" : "#FFFFFF";
  const lightColor2 = wavelength === "infrared" ? "#FF7043" : wavelength === "ultraviolet" ? "#7C4DFF" : "#2979FF";

  return (
    <div className="relative w-full h-full min-h-0 bg-gradient-to-b from-[#020409] via-[#040813] to-[#010206] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      
      {/* 3D Three.js Interactive Viewport */}
      <Canvas dpr={[1, 1.5]}
        camera={{ position: [0, 0.25, 8.5], fov: 42 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: typeof window !== "undefined" && window.innerWidth < 768 ? "low-power" : "high-performance",
        }}
      >
        <ambientLight intensity={1.0} color={ambientColor} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} color={lightColor1} />
        <directionalLight position={[-10, -10, -10]} intensity={0.7} color={lightColor2} />

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[2.0, 16, 16]} />
              <meshBasicMaterial wireframe color="#4B9EFF" />
            </mesh>
          }
        >
          <PleiadesScene
            activeCalloutId={activeCalloutId}
            onSelectCallout={onSelectCallout}
            autoRotate={autoRotate}
            showNebula={showNebula}
            showCallouts={showCallouts}
            showDiffraction={showDiffraction}
            wavelength={wavelength}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          target={[0, -0.05, 0]}
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
          minDistance={2.0}
          maxDistance={18.0}
          rotateSpeed={0.7}
        />
      </Canvas>

      {/* Responsive Floating HUD Viewport Controls */}
      <DeepSpaceViewerHUD
        primaryToggle={{
          active: autoRotate,
          onToggle: () => setAutoRotate((prev) => !prev),
          label: "ROTATION",
          activeColorClass:
            "bg-accent/25 text-accent border border-accent/40 shadow-[0_0_10px_rgba(75,158,255,0.25)]",
          title: "Toggle Cluster Orbital Rotation",
        }}
        dragMode={{
          mode: dragMode,
          onToggle: () =>
            setDragMode((prev) => (prev === "rotate" ? "pan" : "rotate")),
        }}
        featureToggle={{
          active: showNebula,
          onToggle: () => setShowNebula((prev) => !prev),
          label: "NEBULA",
          icon: <Sparkles className="size-3 sm:size-3.5 shrink-0" />,
          activeColorClass:
            "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]",
          title: "Toggle Reflection Nebula Gas Clouds",
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
      />

      {/* Bottom Telemetry Legend */}
      <div className="flex absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 items-center gap-1.5 sm:gap-2 font-mono text-[8.5px] sm:text-[10px] text-white/70 bg-black/75 backdrop-blur-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/15 shadow-xl z-20 pointer-events-none whitespace-nowrap">
        <Compass className="size-3.5 text-cyan-400 animate-spin shrink-0" />
        <span>LEFT CLICK: {dragMode === "pan" ? "PAN VIEW" : "360° ORBIT"} • RIGHT CLICK: PAN • SCROLL: ZOOM</span>
      </div>

    </div>
  );
}
