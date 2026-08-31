"use client";

import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getAllCelestialObjects } from "../adapters/sketchfab-solar-system";
import { ASTEROID_BELT_CONFIG } from "../data/solar-system-visuals";
import { ExplorerCamera } from "./ExplorerCamera";
import { CameraMode } from "../hooks/useSolarSystemExplorer";
import { SolarSystem3DAsset } from "./SolarSystem3DAsset";
import { SolarSystemFallback } from "./SolarSystemFallback";

interface SolarSystemSceneProps {
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  cameraMode: CameraMode;
  simulationSpeed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showBelts: boolean;
  showLabels: boolean;
}

// ---------------------------------------------------------------------------
// 0. Circular Glowing Particle Sprite Texture
// ---------------------------------------------------------------------------
function getCircleParticleTexture(): THREE.Texture {
  if (typeof document === "undefined") {
    return new THREE.Texture();
  }
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.55, "rgba(180, 210, 255, 0.25)");
    gradient.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// 1. Deep Space Starfield (Smooth Spherical Distribution)
// ---------------------------------------------------------------------------
function generateStarfieldData(count = 1800) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  // Use Mulberry32 PRNG for uniform non-patterned distribution
  let a = 18452391;
  const prng = () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const u = prng();
    const v = prng();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(prng()) * 180 + 220; // 220 - 400 distance

    const sinPhi = Math.sin(phi);
    pos[i * 3] = r * sinPhi * Math.cos(theta);
    pos[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    // Subtle star temperature coloring (OBAFGKM stellar classification)
    const colorType = prng();
    if (colorType > 0.85) {
      col[i * 3] = 0.65; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 1.0; // Blue-white
    } else if (colorType > 0.65) {
      col[i * 3] = 1.0; col[i * 3 + 1] = 0.9; col[i * 3 + 2] = 0.7; // Warm yellow
    } else if (colorType > 0.5) {
      col[i * 3] = 1.0; col[i * 3 + 1] = 0.7; col[i * 3 + 2] = 0.6; // Reddish
    } else {
      col[i * 3] = 0.92; col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 1.0; // Pure white
    }
  }
  return { pos, col };
}

const STATIC_STARFIELD = generateStarfieldData(1800);

function Starfield() {
  const texture = useMemo(() => getCircleParticleTexture(), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_STARFIELD.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STATIC_STARFIELD.col, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={2.2}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 2. Asteroid Belt Debris Field (Fine Organic Dust Ring)
// ---------------------------------------------------------------------------
function generateAsteroidBeltData() {
  const { count, innerRadius, outerRadius } = ASTEROID_BELT_CONFIG;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  let a = 94827113;
  const prng = () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const angle = prng() * Math.PI * 2;
    // Natural gaussian-like concentration towards the center of the belt
    const spread = (prng() + prng() + prng()) / 3;
    const radius = innerRadius + spread * (outerRadius - innerRadius);
    const zOffset = (prng() - 0.5) * 0.35;

    // Aligned to the Solar System's authentic XY orbital plane between Mars and Jupiter!
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = Math.sin(angle) * radius;
    pos[i * 3 + 2] = zOffset;

    // Rich varied stony asteroid mineral colors (warm gold, silica grey, reddish chondrite)
    const colorType = prng();
    if (colorType > 0.6) {
      col[i * 3] = 0.95; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.70; // Silicate warm gold
    } else if (colorType > 0.3) {
      col[i * 3] = 0.82; col[i * 3 + 1] = 0.88; col[i * 3 + 2] = 0.96; // Bright icy/metallic
    } else {
      col[i * 3] = 0.92; col[i * 3 + 1] = 0.68; col[i * 3 + 2] = 0.52; // Iron-rich reddish
    }
  }
  return { pos, col };
}

const STATIC_ASTEROID_BELT = generateAsteroidBeltData();

function AsteroidBelt({
  visible,
  simulationSpeed = 1,
  isPaused = false,
}: {
  visible: boolean;
  simulationSpeed?: number;
  isPaused?: boolean;
}) {
  const texture = useMemo(() => getCircleParticleTexture(), []);
  const beltRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (beltRef.current && !isPaused) {
      // Gentle orbital motion of asteroids around the Sun in the XY orbital plane
      beltRef.current.rotation.z += delta * 0.006 * simulationSpeed;
    }
  });

  if (!visible) return null;

  return (
    <points ref={beltRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_ASTEROID_BELT.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STATIC_ASTEROID_BELT.col, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.14}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 3. Main Solar System Scene Container
// ---------------------------------------------------------------------------
export function SolarSystemScene({
  selectedObjectId,
  onSelectObject,
  cameraMode,
  simulationSpeed,
  isPaused,
  showOrbits,
  showBelts,
  showLabels,
}: SolarSystemSceneProps) {
  const allObjects = useMemo(() => getAllCelestialObjects(), []);
  const activeObject = useMemo(() => {
    return allObjects.find((o) => o.domain.id === selectedObjectId) || allObjects[0];
  }, [allObjects, selectedObjectId]);

  const targetWorldPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 5.6, 9.8], fov: 45, near: 0.1, far: 1000 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: typeof window !== "undefined" && window.innerWidth < 768 ? "low-power" : "high-performance" 
        }}
      >
        {/* Cinematic Camera & Orbit Controller */}
        <ExplorerCamera
          activeObject={activeObject}
          cameraMode={cameraMode}
          targetWorldPositionRef={targetWorldPosRef}
        />

        {/* Space Lighting System (Luminous, Photorealistic & Vibrant) */}
        <ambientLight intensity={1.6} color="#E2EEFF" />
        <hemisphereLight
          args={["#93C5FD", "#1E293B", 1.4]}
        />
        <directionalLight
          position={[50, 60, 50]}
          intensity={3.2}
          color="#FFFBEB"
        />
        <directionalLight
          position={[-50, -40, -50]}
          intensity={1.5}
          color="#93C5FD"
        />
        <pointLight
          position={[0, 0, 0]}
          intensity={12.0}
          distance={500}
          decay={0.7}
          color="#FFA500"
        />

        {/* Deep Space Starfield */}
        <Starfield />

        {/* Main Asteroid Belt */}
        <AsteroidBelt
          visible={showBelts}
          simulationSpeed={simulationSpeed}
          isPaused={isPaused}
        />

        {/* Actual 3D GLTF Solar System Asset with Fallback */}
        <Suspense fallback={<SolarSystemFallback />}>
          <SolarSystem3DAsset
            selectedObjectId={selectedObjectId}
            onSelectObject={onSelectObject}
            simulationSpeed={simulationSpeed}
            isPaused={isPaused}
            showOrbits={showOrbits}
            showLabels={showLabels}
            targetWorldPositionRef={targetWorldPosRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

