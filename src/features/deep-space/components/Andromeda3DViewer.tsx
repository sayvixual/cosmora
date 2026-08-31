"use client";

import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { DeepSpaceCallout } from "@/lib/data/deep-space";
import { cn } from "@/lib/utils";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Compass, Layers, Info } from "lucide-react";
import { DeepSpaceViewerHUD } from "./DeepSpaceViewerHUD";

interface Andromeda3DViewerProps {
  modelUrl: string;
  callouts: DeepSpaceCallout[];
  activeCalloutId: string | null;
  onSelectCallout: (id: string | null) => void;
  wavelength: "visible" | "infrared" | "ultraviolet";
}

function AndromedaModel({
  modelUrl,
  autoRotate,
  wavelength,
}: {
  modelUrl: string;
  autoRotate: boolean;
  wavelength: string;
}) {
  const gltf = useGLTF(modelUrl);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);
  const groupRef = useRef<THREE.Group>(null);

  // Normalize model scale and center at origin
  const normalizedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? 5.2 / maxDim : 1.0;

    clone.position.x -= center.x * scaleFactor;
    clone.position.y -= center.y * scaleFactor;
    clone.position.z -= center.z * scaleFactor;
    clone.scale.setScalar(scaleFactor);

    // Tone materials safely based on wavelength mode
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else {
            mesh.material = mesh.material.clone();
          }

          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if ("emissive" in mat && mat.emissive && (mat.emissive as THREE.Color).isColor) {
              const emissiveColor =
                wavelength === "infrared"
                  ? "#FF5722"
                  : wavelength === "ultraviolet"
                  ? "#9C27B0"
                  : "#BA68C8";
              const intensity =
                wavelength === "infrared"
                  ? 1.8
                  : wavelength === "ultraviolet"
                  ? 2.0
                  : 0.9;
              (mat.emissive as THREE.Color).set(emissiveColor);
              if ("emissiveIntensity" in mat) {
                (mat as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
              }
              mat.needsUpdate = true;
            }
          });
        }
      }
    });

    return clone;
  }, [gltf.scene, wavelength]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  const haloColor = wavelength === "infrared" ? "#FF8F00" : wavelength === "ultraviolet" ? "#B388FF" : "#BA68C8";

  return (
    <group ref={groupRef}>
      <primitive object={normalizedScene} />
      
      {/* Surrounding Ambient Particle Halo */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              useMemo(() => {
                let a = 98765;
                const prng = () => {
                  let t = (a += 0x6d2b79f5);
                  t = Math.imul(t ^ (t >>> 15), t | 1);
                  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
                };
                const count = 600;
                const pos = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                  const r = 2.0 + prng() * 4.5;
                  const theta = prng() * Math.PI * 2;
                  const y = (prng() - 0.5) * 0.8;
                  pos[i * 3] = Math.cos(theta) * r;
                  pos[i * 3 + 1] = y;
                  pos[i * 3 + 2] = Math.sin(theta) * r;
                }
                return pos;
              }, []),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={haloColor}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export function Andromeda3DViewer({
  modelUrl,
  callouts,
  activeCalloutId,
  onSelectCallout,
  wavelength,
}: Andromeda3DViewerProps) {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(true);
  const [dragMode, setDragMode] = useState<"rotate" | "pan">("rotate");
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.25);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.25);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const ambientColor = wavelength === "infrared" ? "#FFE082" : wavelength === "ultraviolet" ? "#E1BEE7" : "#E8D5F5";
  const lightColor1 = wavelength === "infrared" ? "#FFB74D" : wavelength === "ultraviolet" ? "#CE93D8" : "#FFF5FF";
  const lightColor2 = wavelength === "infrared" ? "#FF7043" : wavelength === "ultraviolet" ? "#7C4DFF" : "#7B1FA2";
  const pointLightColor = wavelength === "infrared" ? "#FF6D00" : wavelength === "ultraviolet" ? "#E040FB" : "#BA68C8";

  return (
    <div className="relative w-full h-full min-h-0 bg-gradient-to-b from-[#030408] via-[#080711] to-[#020205] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2.5, 6.5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: typeof window !== "undefined" && window.innerWidth < 768 ? "low-power" : "high-performance" 
        }}
      >
        <ambientLight intensity={1.6} color={ambientColor} />
        <directionalLight position={[10, 15, 10]} intensity={2.8} color={lightColor1} />
        <directionalLight position={[-10, -10, -10]} intensity={1.4} color={lightColor2} />
        <pointLight position={[0, 0, 0]} intensity={4.5} distance={20} color={pointLightColor} />

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[2.5, 32, 32]} />
              <meshBasicMaterial wireframe color="#BA68C8" />
            </mesh>
          }
        >
          <AndromedaModel
            modelUrl={modelUrl}
            autoRotate={autoRotate}
            wavelength={wavelength}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
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
          maxDistance={16.0}
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
          title: "Toggle Galaxy Rotation",
        }}
        dragMode={{
          mode: dragMode,
          onToggle: () =>
            setDragMode((prev) => (prev === "rotate" ? "pan" : "rotate")),
        }}
        featureToggle={{
          active: showCalloutPins,
          onToggle: () => setShowCalloutPins((prev) => !prev),
          label: "CALLOUTS",
          activeColorClass:
            "bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(186,104,200,0.3)]",
          title: "Toggle Scientific Callout Reticles",
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
      />

      {/* Interactive Scientific Callout Pins Overlay */}
      {showCalloutPins && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {callouts.map((callout) => {
            const isSelected = activeCalloutId === callout.id;
            return (
              <div
                key={callout.id}
                style={{
                  top: `${callout.position.y}%`,
                  left: `${callout.position.x}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={() => onSelectCallout(isSelected ? null : callout.id)}
                  className={cn(
                    "group relative flex items-center justify-center p-1 rounded-full transition-all duration-300 active:scale-95",
                    isSelected
                      ? "ring-2 ring-purple-400 scale-110 shadow-[0_0_20px_rgba(186,104,200,0.8)]"
                      : "hover:scale-105 opacity-80 hover:opacity-100"
                  )}
                  title={callout.title}
                >
                  <span className="size-3 rounded-full bg-purple-400 animate-ping absolute" />
                  <span className="size-3 rounded-full bg-purple-500 border-2 border-white shadow-md relative z-10" />

                  {/* Badge Tooltip */}
                  <div
                    className={cn(
                      "absolute left-full ml-2 px-2.5 py-1 rounded-xl bg-black/90 backdrop-blur-md border border-purple-500/40 text-white font-mono text-[9px] whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none",
                      isSelected
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  >
                    <span className="font-bold text-purple-300 block">{callout.title}</span>
                    <span className="text-white/60 text-[8px]">{callout.subtitle}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Telemetry Legend */}
      <div className="flex absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 items-center gap-1.5 sm:gap-2 font-mono text-[8.5px] sm:text-[10px] text-white/70 bg-black/75 backdrop-blur-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/15 shadow-xl z-20 pointer-events-none whitespace-nowrap">
        <Compass className="size-3.5 text-purple-400 animate-spin shrink-0" />
        <span>LEFT CLICK: {dragMode === "pan" ? "PAN VIEW" : "360° ORBIT"} • RIGHT CLICK: PAN • SCROLL: ZOOM</span>
      </div>
    </div>
  );
}
