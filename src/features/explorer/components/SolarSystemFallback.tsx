"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function SolarSystemFallback() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.5;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Telemetry Loading Hologram */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[14, 14.3, 64]} />
        <meshBasicMaterial color="#4B9EFF" wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[22, 22.4, 64]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, 0]}>
        <ringGeometry args={[32, 32.5, 64]} />
        <meshBasicMaterial color="#E65100" wireframe transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Core Glowing Orb */}
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#4B9EFF" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Sci-Fi Loading Overlay */}
      <Html center style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/30 text-white font-mono shadow-[0_0_40px_rgba(0,229,255,0.25)] min-w-[260px] animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">
              COSMORA HELIOS ENGINE
            </span>
          </div>
          <div className="text-[10px] text-white/70 mb-1 tracking-wider">
            STREAMING 3D SOLAR SYSTEM ASSETS (6.8 MB)
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <span className="text-[9px] text-white/40 mt-2">
            INITIALIZING 50-CHANNEL KINEMATICS
          </span>
        </div>
      </Html>
    </group>
  );
}
