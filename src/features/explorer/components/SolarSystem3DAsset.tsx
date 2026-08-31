"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  SOLAR_SYSTEM_GLTF_URL,
  mapGLTFNodeToCelestialId,
  getAllCelestialObjects,
  CelestialCompositeObject,
} from "../adapters/sketchfab-solar-system";
import { resolveAssetUrl } from "@/lib/assets/registry";

interface SolarSystem3DAssetProps {
  selectedObjectId: string;
  onSelectObject: (id: string) => void;
  simulationSpeed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  targetWorldPositionRef?: React.RefObject<THREE.Vector3 | null>;
}

// ---------------------------------------------------------------------------
// Holographic Orbit Configuration (Authentic 3D Trajectories)
// ---------------------------------------------------------------------------
const TORUS_PLANET_MAP: Record<string, { id: string; color: string; name: string }> = {
  Torus_001: { id: "mercury", color: "#A8B2BD", name: "Mercury" },
  Torus_000: { id: "venus", color: "#E3BB7B", name: "Venus" },
  Torus_002: { id: "earth", color: "#4BA2FF", name: "Earth" },
  Torus_003: { id: "mars", color: "#FF5533", name: "Mars" },
  Torus_004: { id: "jupiter", color: "#E0A96D", name: "Jupiter" },
  Torus_005: { id: "saturn", color: "#F4D06F", name: "Saturn" },
  Torus_006: { id: "uranus", color: "#70D6FF", name: "Uranus" },
  Torus_007: { id: "neptune", color: "#4361EE", name: "Neptune" },
};

export function SolarSystem3DAsset({
  selectedObjectId,
  onSelectObject,
  simulationSpeed,
  isPaused,
  showOrbits,
  showLabels,
  targetWorldPositionRef,
}: SolarSystem3DAssetProps) {
  // 1. Load the authentic 3D GLTF asset
  const gltf = useGLTF(SOLAR_SYSTEM_GLTF_URL);
  const { actions, names } = useAnimations(gltf.animations, gltf.scene);

  // Object map cache for quick lookup of nodes by domain ID
  const nodeMap = useRef<Map<string, THREE.Object3D>>(new Map());
  const torusObjects = useRef<THREE.Object3D[]>([]);

  // 2. Setup node cache, celestial mapping & inject high-resolution textures
  useEffect(() => {
    if (!gltf.scene) return;
    nodeMap.current.clear();
    torusObjects.current = [];

    gltf.scene.traverse((child) => {
      // Find and cache celestial nodes (prefer the exact Mesh instance for precision)
      const matchedDomainId = mapGLTFNodeToCelestialId(child.name);
      if (matchedDomainId) {
        if ((child as THREE.Mesh).isMesh || !nodeMap.current.has(matchedDomainId)) {
          nodeMap.current.set(matchedDomainId, child);
        }
      }

      // Cache authentic Torus orbit rings & assign futuristic additive glowing materials
      if (child.name.startsWith("Torus_") && !child.name.includes("unnamed")) {
        torusObjects.current.push(child);
        child.visible = showOrbits;
        const torusInfo = TORUS_PLANET_MAP[child.name];
        const planetColor = torusInfo ? torusInfo.color : "#4BA2FF";

        child.traverse((tChild) => {
          if ((tChild as THREE.Mesh).isMesh) {
            const mesh = tChild as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(planetColor),
              emissive: new THREE.Color(planetColor),
              emissiveIntensity: 0.85,
              transparent: true,
              opacity: 0.65,
              roughness: 0.1,
              metalness: 0.5,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            });
          }
        });
      }
    });

    const loader = new THREE.TextureLoader();

    // 1. High-Res Jupiter Texture (2.2 MB Ultra-HD storm bands)
    loader.load(resolveAssetUrl("/models/jupiter/textures/JUPITER_baseColor.png"), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const jupiterNode = nodeMap.current.get("jupiter");
      if (jupiterNode) {
        jupiterNode.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              map: tex,
              roughness: 0.6,
              metalness: 0.05,
            });
          }
        });
      }
    });

    // 2. High-Res Saturn Texture (6.7 MB Ultra-HD) & 3D Saturn Rings
    loader.load(resolveAssetUrl("/models/saturn/textures/material_0_baseColor.jpeg"), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const saturnNode = nodeMap.current.get("saturn");
      if (saturnNode) {
        saturnNode.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              map: tex,
              roughness: 0.6,
              metalness: 0.05,
            });
          }
        });
      }
    });

    // Attach 3D Saturn Rings to Saturn in the planet's equatorial plane
    loader.load(resolveAssetUrl("/models/saturn/textures/material_baseColor.png"), (ringTex) => {
      ringTex.colorSpace = THREE.SRGBColorSpace;
      const saturnNode = nodeMap.current.get("saturn");
      if (saturnNode && !saturnNode.getObjectByName("CosmoraSaturnRings")) {
        const ringGeo = new THREE.RingGeometry(2.3, 4.4, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
          roughness: 0.5,
          metalness: 0.05,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.name = "CosmoraSaturnRings";
        saturnNode.add(ringMesh);
      }
    });

    // 3. High-Res Earth Texture (19.8 MB Ultra-HD) — Only apply to Earth mesh, not child Moon!
    loader.load(resolveAssetUrl("/models/earth/textures/earth_baseColor.jpeg"), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const earthNode = nodeMap.current.get("earth");
      if (earthNode) {
        earthNode.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && child.name.includes("Sphere_003")) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              map: tex,
              roughness: 0.45,
              metalness: 0.1,
            });
          }
        });
      }
    });

    // 4. High-Res Moon Texture (18.4 MB Ultra-HD Lunar Surface)
    loader.load(resolveAssetUrl("/models/the_moon/textures/moon_baseColor.jpeg"), (moonTex) => {
      moonTex.colorSpace = THREE.SRGBColorSpace;
      const moonNode = nodeMap.current.get("moon");
      if (moonNode) {
        moonNode.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              map: moonTex,
              roughness: 0.9,
              metalness: 0.05,
            });
          }
        });
      }
    });

    // 5. High-Res Sun Emissive Plasma Surface
    loader.load(resolveAssetUrl("/models/sun/textures/material_baseColor.jpeg"), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const sunNode = nodeMap.current.get("sun");
      if (sunNode) {
        sunNode.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              map: tex,
              emissive: new THREE.Color("#FF8C00"),
              emissiveMap: tex,
              emissiveIntensity: 1.8,
              roughness: 0.9,
            });
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf.scene]);

  // 3. Controlled Animation Playback
  useEffect(() => {
    const animName = names?.[0] || "Default Take";
    const action = actions?.[animName];
    if (action) {
      action.play();
      if (isPaused) {
        // eslint-disable-next-line react-hooks/immutability
        action.paused = true;
      } else {
        action.paused = false;
        action.timeScale = simulationSpeed * 0.2;
      }
    }
  }, [actions, names, isPaused, simulationSpeed]);

  // 4. Toggle Orbit Ring Visibility
  useEffect(() => {
    torusObjects.current.forEach((torus) => {
      torus.visible = showOrbits;
    });
  }, [showOrbits]);

  // 5. Track positions, world coordinates & animate dynamic holographic orbit lines
  useFrame((state) => {
    // Explicitly calculate world matrix so animations from parent nodes propagate correctly
    if (gltf.scene) {
      gltf.scene.updateMatrixWorld(true);
    }
    if (selectedObjectId && targetWorldPositionRef?.current) {
      const activeNode = nodeMap.current.get(selectedObjectId);
      if (activeNode) {
        activeNode.getWorldPosition(targetWorldPositionRef.current);
      }
    }

    // Dynamic Holographic Orbit Lines Pulse Animation
    if (showOrbits) {
      const pulse = Math.sin(state.clock.elapsedTime * 3.5) * 0.15 + 0.85;

      torusObjects.current.forEach((torus) => {
        const info = TORUS_PLANET_MAP[torus.name];
        if (!info) return;

        const isSelected = info.id === selectedObjectId;

        torus.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.isMeshStandardMaterial) {
              if (isSelected) {
                // Active planet's orbit pulses with ultra-radiant signature color!
                mat.color.set(info.color);
                mat.emissive.set(info.color);
                mat.emissiveIntensity = 2.8 * pulse;
                mat.opacity = 0.95 * pulse;
              } else {
                // Inactive orbits remain crisp, clear, and glowing in their distinctive planet hue!
                mat.color.set(info.color);
                mat.emissive.set(info.color);
                mat.emissiveIntensity = 0.85;
                mat.opacity = 0.6;
              }
            }
          }
        });
      });
    }
  });

  // Handle pointer clicks on 3D meshes and orbit lines
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    let current: THREE.Object3D | null = e.object;
    while (current && current !== gltf.scene) {
      // 1. Direct planet mesh match
      const domainId = mapGLTFNodeToCelestialId(current.name);
      if (domainId) {
        onSelectObject(domainId);
        return;
      }
      // 2. Direct orbit line click (interactivity!)
      const torusInfo = TORUS_PLANET_MAP[current.name];
      if (torusInfo) {
        onSelectObject(torusInfo.id);
        return;
      }
      current = current.parent;
    }
  };

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  const allCelestialObjects = useMemo(() => getAllCelestialObjects(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Actual 3D GLTF Scene with Interactive Event Listeners */}
      <primitive
        object={gltf.scene}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Interactive Selection Highlight & Dynamic Labels */}
      {allCelestialObjects.map((obj) => (
        <CelestialObjectTracker
          key={obj.domain.id}
          obj={obj}
          nodeMap={nodeMap}
          isSelected={obj.domain.id === selectedObjectId}
          selectedObjectId={selectedObjectId}
          showLabels={showLabels}
          onSelect={onSelectObject}
        />
      ))}
    </group>
  );
}

// Preload the asset
useGLTF.preload(SOLAR_SYSTEM_GLTF_URL);

/**
 * Tracks individual celestial node's real-time position in 3D space
 * to render selection rings and HUD labels tight to the actual planet mesh.
 */
function CelestialObjectTracker({
  obj,
  nodeMap,
  isSelected,
  selectedObjectId,
  showLabels,
  onSelect,
}: {
  obj: CelestialCompositeObject;
  nodeMap: React.MutableRefObject<Map<string, THREE.Object3D>>;
  isSelected: boolean;
  selectedObjectId: string;
  showLabels: boolean;
  onSelect: (id: string) => void;
}) {
  const markerRef = useRef<THREE.Group>(null);
  const labelGroupRef = useRef<THREE.Group>(null);
  const tempPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempScreenPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const tempSunPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const boxHelper = useMemo(() => new THREE.Box3(), []);
  const boxSize = useMemo(() => new THREE.Vector3(), []);
  const reticleDivRef = useRef<HTMLDivElement>(null);

  const tempScaleRef = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame(({ camera, size }) => {
    const targetNode = nodeMap.current.get(obj.domain.id);
    if (!targetNode || !markerRef.current) return;

    // 1. Get exact world position of the celestial body mesh
    targetNode.getWorldPosition(tempPosRef.current);
    markerRef.current.position.copy(tempPosRef.current);
    markerRef.current.updateMatrixWorld(true);

    // 2. Extract true visual sphere radius of this specific body (ignoring rings/parent nodes)
    let worldRadius = 0.25;
    if ((targetNode as THREE.Mesh).isMesh) {
      const mesh = targetNode as THREE.Mesh;
      if (!mesh.geometry.boundingSphere) {
        mesh.geometry.computeBoundingSphere();
      }
      if (mesh.geometry.boundingSphere) {
        mesh.getWorldScale(tempScaleRef.current);
        const maxScale = Math.max(
          tempScaleRef.current.x,
          tempScaleRef.current.y,
          tempScaleRef.current.z
        );
        worldRadius = Math.max(mesh.geometry.boundingSphere.radius * maxScale, 0.05);
      }
    } else {
      boxHelper.setFromObject(targetNode);
      boxHelper.getSize(boxSize);
      worldRadius = Math.max(Math.max(boxSize.x, boxSize.y, boxSize.z) * 0.5, 0.05);
    }

    // 3. Dynamic screen pixel size for reticle framing (tight & compact)
    const camDist = camera.position.distanceTo(tempPosRef.current);
    let pixelDiameter = 32;
    if (camDist > 0.01 && "fov" in camera) {
      const perspCam = camera as THREE.PerspectiveCamera;
      const fovRad = (perspCam.fov * Math.PI) / 180;
      const screenPx = (2 * worldRadius / (2 * camDist * Math.tan(fovRad / 2))) * size.height;
      // Frame with tighter padding: clamped between 26px (overview) and 130px (macro)
      pixelDiameter = Math.min(Math.max(Math.round(screenPx * 1.1 + 4), 26), 130);
    }

    if (reticleDivRef.current) {
      reticleDivRef.current.style.width = `${pixelDiameter}px`;
      reticleDivRef.current.style.height = `${pixelDiameter}px`;
    }

    // 4. Intelligent Screen-Space Proximity & Occlusion Decluttering for Unselected Labels
    if (labelGroupRef.current && showLabels && !isSelected) {
      const offsetY = worldRadius + Math.max(worldRadius * 0.15, 0.08);
      labelGroupRef.current.position.set(0, offsetY, 0);

      // Project 3D position to 2D normalized device coordinates
      tempScreenPosRef.current.copy(tempPosRef.current).project(camera);

      // Hide if behind camera near plane
      if (tempScreenPosRef.current.z > 1) {
        labelGroupRef.current.visible = false;
        return;
      }

      const pxX = ((tempScreenPosRef.current.x + 1) * size.width) / 2;
      const pxY = ((-tempScreenPosRef.current.y + 1) * size.height) / 2;

      let hideDueToOverlap = false;

      // A. When SUN is targeted: Clear all overlapping inner & mid planet labels around the Sun
      if (selectedObjectId === "sun") {
        const sunNode = nodeMap.current.get("sun");
        if (sunNode) {
          sunNode.getWorldPosition(tempSunPosRef.current);
          tempSunPosRef.current.project(camera);
          if (tempSunPosRef.current.z <= 1) {
            const sunPxX = ((tempSunPosRef.current.x + 1) * size.width) / 2;
            const sunPxY = ((-tempSunPosRef.current.y + 1) * size.height) / 2;
            const distToSun = Math.hypot(pxX - sunPxX, pxY - sunPxY);

            // Generous clear zone around Sun (160px on mobile, 130px on desktop)
            const sunClearRadius = size.width < 768 ? 160 : 130;
            if (distToSun < sunClearRadius) {
              hideDueToOverlap = true;
            }
          }
        }
      } else {
        // B. When any other planet is targeted: Protect the active target reticle
        const selectedNode = nodeMap.current.get(selectedObjectId);
        if (selectedNode) {
          selectedNode.getWorldPosition(tempTargetPosRef.current);
          tempTargetPosRef.current.project(camera);
          if (tempTargetPosRef.current.z <= 1) {
            const targetPxX = ((tempTargetPosRef.current.x + 1) * size.width) / 2;
            const targetPxY = ((-tempTargetPosRef.current.y + 1) * size.height) / 2;
            const distToTarget = Math.hypot(pxX - targetPxX, pxY - targetPxY);

            // Clear radius around active planet (120px on mobile, 95px on desktop)
            const targetClearRadius = size.width < 768 ? 120 : 95;
            if (distToTarget < targetClearRadius) {
              hideDueToOverlap = true;
            }
          }
        }

        // Also protect Sun from being covered when looking around other planets
        if (!hideDueToOverlap && obj.domain.id !== "sun") {
          const sunNode = nodeMap.current.get("sun");
          if (sunNode) {
            sunNode.getWorldPosition(tempSunPosRef.current);
            tempSunPosRef.current.project(camera);
            if (tempSunPosRef.current.z <= 1) {
              const sunPxX = ((tempSunPosRef.current.x + 1) * size.width) / 2;
              const sunPxY = ((-tempSunPosRef.current.y + 1) * size.height) / 2;
              const distToSun = Math.hypot(pxX - sunPxX, pxY - sunPxY);

              const sunClearRadius = size.width < 768 ? 85 : 65;
              if (distToSun < sunClearRadius) {
                hideDueToOverlap = true;
              }
            }
          }
        }
      }

      // C. Moon special rule: never overlap Earth when not specifically focusing on the Moon
      if (obj.domain.id === "moon") {
        if (selectedObjectId !== "moon" && (camDist > 3.2 || selectedObjectId !== "earth")) {
          hideDueToOverlap = true;
        }
      }

      // D. Distant inner planets declutter when zoomed out
      if (camDist > 14 && (obj.domain.id === "mercury" || obj.domain.id === "venus" || obj.domain.id === "moon")) {
        hideDueToOverlap = true;
      }

      if (hideDueToOverlap) {
        labelGroupRef.current.visible = false;
      } else {
        labelGroupRef.current.visible = true;
        // Distance-based scaling to prevent label collision
        const maxDist = 20;
        const scale = Math.max(0.35, 1.1 - (camDist / maxDist));
        labelGroupRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={markerRef}>
      {/* Expanded 3D Click Hitbox for Easy Tap/Click on Small Celestial Spheres */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(obj.domain.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[Math.max(obj.visual.radius * 2.5, 0.35), 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 1. Selected — Sleek HUD Reticle centered EXACTLY on the planet */}
      {showLabels && isSelected && (
        <Html center style={{ pointerEvents: "none" }}>
          <div className="relative flex items-center justify-center select-none pointer-events-none">
            {/* Sci-fi targeting reticle box dynamically scaled to frame the planet */}
            <div
              ref={reticleDivRef}
              style={{ width: "32px", height: "32px" }}
              className="relative border border-cyan-400/35 rounded-lg animate-[pulse_2.5s_ease-in-out_infinite] shadow-[0_0_12px_rgba(0,229,255,0.25)] flex items-center justify-center"
            >
              {/* Sci-fi corner brackets */}
              <span className="absolute -top-0.5 -left-0.5 size-1.5 border-t-[1.5px] border-l-[1.5px] border-cyan-400 rounded-tl-[1px] shadow-[0_0_6px_rgba(0,229,255,0.7)]" />
              <span className="absolute -top-0.5 -right-0.5 size-1.5 border-t-[1.5px] border-r-[1.5px] border-cyan-400 rounded-tr-[1px] shadow-[0_0_6px_rgba(0,229,255,0.7)]" />
              <span className="absolute -bottom-0.5 -left-0.5 size-1.5 border-b-[1.5px] border-l-[1.5px] border-cyan-400 rounded-bl-[1px] shadow-[0_0_6px_rgba(0,229,255,0.7)]" />
              <span className="absolute -bottom-0.5 -right-0.5 size-1.5 border-b-[1.5px] border-r-[1.5px] border-cyan-400 rounded-br-[1px] shadow-[0_0_6px_rgba(0,229,255,0.7)]" />

              {/* Sci-fi crosshair calibration ticks */}
              <span className="absolute top-1/2 -left-1.5 w-1 h-[1px] bg-cyan-400/60 -translate-y-1/2" />
              <span className="absolute top-1/2 -right-1.5 w-1 h-[1px] bg-cyan-400/60 -translate-y-1/2" />
              <span className="absolute -top-1.5 left-1/2 h-1 w-[1px] bg-cyan-400/60 -translate-x-1/2" />
              <span className="absolute -bottom-1.5 left-1/2 h-1 w-[1px] bg-cyan-400/60 -translate-x-1/2" />

              {/* Active target badge snug above the top bracket */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400 text-black font-mono text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider whitespace-nowrap shadow-[0_0_8px_rgba(0,229,255,0.4)] animate-in fade-in zoom-in-95 duration-200">
                <span className="size-1 rounded-full bg-black animate-ping" />
                <span>TARGET // {obj.domain.name.replace("The ", "")}</span>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* 2. Unselected — compact, sleek floating name pill, tight above planet */}
      {showLabels && !isSelected && (
        <group ref={labelGroupRef}>
          <Html center style={{ pointerEvents: "none" }}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect(obj.domain.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3.5px",
                padding: "1.5px 6px",
                borderRadius: "999px",
                background: "rgba(6, 9, 15, 0.78)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: `1px solid ${obj.visual.color}50`,
                color: "#FFFFFF",
                boxShadow: `0 0 8px ${obj.visual.color}20`,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: "7.5px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                pointerEvents: "auto",
                cursor: "pointer",
                userSelect: "none",
                transition: "transform 0.15s ease, background 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
                (e.currentTarget as HTMLElement).style.borderColor = obj.visual.color;
                (e.currentTarget as HTMLElement).style.background = "rgba(6, 9, 15, 0.95)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.borderColor = `${obj.visual.color}50`;
                (e.currentTarget as HTMLElement).style.background = "rgba(6, 9, 15, 0.78)";
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: obj.visual.color,
                  boxShadow: `0 0 5px ${obj.visual.color}`,
                  flexShrink: 0,
                  display: "inline-block",
                }}
              />
              <span>{obj.domain.name.replace("The ", "")}</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
