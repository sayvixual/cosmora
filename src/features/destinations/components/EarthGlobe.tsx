"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { resolveAssetUrl } from "@/lib/assets/registry";
import { Destination } from "@/features/destinations/types";

// Radius of our 3D Earth
const EARTH_RADIUS = 2;

// Utility to convert Lat/Lng to Vector3 on a sphere
function latLongToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 90) * (Math.PI / 180); 
  const spherical = new THREE.Spherical(radius, phi, theta);
  return new THREE.Vector3().setFromSpherical(spherical);
}

interface EarthGlobeProps {
  destinations: Destination[];
  selectedId: string | null;
  hoveredId?: string | null;
  onSelect: (id: string) => void;
}

export function EarthGlobe({ destinations, selectedId, hoveredId, onSelect }: EarthGlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Smooth one-shot camera flight tracking
  const isTransitioningRef = useRef<boolean>(false);
  const transitionProgressRef = useRef<number>(0);
  const startCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const prevSelectedIdRef = useRef<string | null>(null);
  
  // Load high-res earth texture
  const [colorMap] = useTexture([
    resolveAssetUrl("/models/earth/textures/earth_baseColor.jpeg")
  ]);
  
  // Create markers based on destinations
  const markers = useMemo(() => {
    return destinations.map(dest => {
      // Small offset (1.02) so markers hover just slightly above the terrain
      const position = latLongToVector3(dest.latitude, dest.longitude, EARTH_RADIUS * 1.02);
      return { ...dest, position };
    });
  }, [destinations]);

  // Trigger cinematic swoop flight whenever a destination selection changes
  useEffect(() => {
    if (selectedId !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedId;

      if (selectedId && earthRef.current) {
        const selected = markers.find(m => m.id === selectedId);
        if (selected) {
          // Calculate destination world position with current Earth rotation
          const worldPos = selected.position.clone();
          worldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), earthRef.current.rotation.y - Math.PI / 2);

          // Fly directly facing the destination at a clean distance
          targetCamPosRef.current.copy(worldPos.clone().normalize().multiplyScalar(EARTH_RADIUS * 2.35));
          startCamPosRef.current.copy(camera.position);
          transitionProgressRef.current = 0;
          isTransitioningRef.current = true;
        }
      } else if (!selectedId) {
        // Reset to overview distance
        targetCamPosRef.current.set(0, 0, 6.2);
        startCamPosRef.current.copy(camera.position);
        transitionProgressRef.current = 0;
        isTransitioningRef.current = true;
      }
    }
  }, [selectedId, markers, camera]);

  // Frame loop: smooth camera flight + gentle idle rotation
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Always keep orbit target locked at the center of the Earth (0,0,0)
    controlsRef.current.target.set(0, 0, 0);

    if (isTransitioningRef.current) {
      transitionProgressRef.current += delta * 1.8;
      const t = Math.min(transitionProgressRef.current, 1);
      
      // Smooth cubic ease in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      camera.position.lerpVectors(startCamPosRef.current, targetCamPosRef.current, ease);
      controlsRef.current.update();

      if (t >= 1) {
        isTransitioningRef.current = false;
      }
    } else {
      // Gentle auto-spin ONLY when no specific location is active
      if (!selectedId && earthRef.current) {
        earthRef.current.rotation.y += delta * 0.04;
      }
      controlsRef.current.update();
    }
  });

  const getMarkerDotStyle = (category?: string, active?: boolean, hovered?: boolean) => {
    let baseColor = "bg-[#4BA2FF]";
    let shadowColor = "rgba(75,158,255,0.9)";
    let ringColor = "ring-[#4BA2FF]/40";

    if (category === "dark_sky") {
      baseColor = "bg-emerald-400";
      shadowColor = "rgba(16,185,129,0.9)";
      ringColor = "ring-emerald-400/40";
    } else if (category === "analog_habitat") {
      baseColor = "bg-orange-400";
      shadowColor = "rgba(249,115,22,0.9)";
      ringColor = "ring-orange-400/40";
    } else if (category === "historic") {
      baseColor = "bg-purple-400";
      shadowColor = "rgba(168,85,247,0.9)";
      ringColor = "ring-purple-400/40";
    }

    if (active) {
      return `${baseColor} size-3 ring-4 ${ringColor} shadow-[0_0_15px_${shadowColor}] scale-125`;
    }
    if (hovered) {
      return `${baseColor} size-2.5 ring-2 ${ringColor} shadow-[0_0_12px_${shadowColor}] scale-125`;
    }
    return `${baseColor} size-2 opacity-85 hover:scale-125`;
  };

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={2.6} />
      <directionalLight position={[-5, 3, -5]} intensity={0.7} color="#4BA2FF" />

      {/* Group rotation aligns the Prime Meridian correctly if the texture is offset */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial 
            map={colorMap} 
            roughness={0.6}
            metalness={0.1}
          />
          
          {/* Plot Destination Markers */}
          {markers.map((marker) => {
            const isSelected = selectedId === marker.id;
            const isHovered = hoveredId === marker.id;
            const isHighlighted = isSelected || isHovered;
            const shortLabel = marker.region ? marker.region.toUpperCase() : marker.name.toUpperCase();
            
            return (
              <group key={marker.id} position={marker.position}>
                {/* occlude="blending" makes it disappear when behind the earth */}
                <Html center occlude={[earthRef as React.RefObject<THREE.Object3D>]} zIndexRange={[10, 0]} transform={false}>
                  <div 
                    className={`cursor-pointer transition-all duration-300 group flex flex-col items-center
                      ${isHighlighted ? 'scale-115 z-10' : 'scale-100 opacity-80 hover:opacity-100 hover:scale-110 z-0'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(marker.id);
                    }}
                  >
                    {/* Pulsing Dot Indicator */}
                    <div className="relative flex items-center justify-center">
                      {isHighlighted && (
                        <span className="absolute size-5 rounded-full bg-accent/40 animate-ping" />
                      )}
                      <div className={`rounded-full border border-black/40 transition-all duration-300 ${getMarkerDotStyle(marker.category, isSelected, isHovered)}`} />
                    </div>
                    
                    {/* Compact sleek micro-label badge */}
                    <div className={`mt-1 px-1.5 py-0.5 rounded-md bg-[#05070A]/90 backdrop-blur border text-[9px] font-mono font-bold tracking-wider transition-all pointer-events-none shadow-md whitespace-nowrap
                      ${isHighlighted ? 'border-accent text-accent shadow-[0_0_12px_rgba(75,158,255,0.35)] opacity-100 scale-100' : 'border-white/15 text-white/70 opacity-0 group-hover:opacity-100 scale-95'}
                    `}>
                      {shortLabel}
                    </div>
                  </div>
                </Html>
              </group>
            );
          })}
        </mesh>
      </group>

      {/* OrbitControls with butter-smooth inertia damping and uninterrupted user control */}
      <OrbitControls 
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.06}
        minDistance={EARTH_RADIUS * 1.4}
        maxDistance={EARTH_RADIUS * 6}
        onStart={() => {
          // If user drags or touches screen, immediately release automated flight to the user
          isTransitioningRef.current = false;
        }}
        makeDefault
      />
    </>
  );
}
