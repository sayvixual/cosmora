"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CameraMode } from "../hooks/useSolarSystemExplorer";
import { CelestialCompositeObject } from "../adapters/sketchfab-solar-system";

interface ExplorerCameraProps {
  activeObject: CelestialCompositeObject;
  cameraMode: CameraMode;
  targetWorldPositionRef?: React.RefObject<THREE.Vector3 | null>;
}

// ULTRA CLOSE-UP MACRO DISTANCES (Planet fills 85-95% of the screen)
const ULTRA_CLOSEUP_DISTANCES: Record<string, number> = {
  sun: 2.8,
  mercury: 0.95,
  venus: 1.5,
  earth: 2.0,
  moon: 0.45,
  mars: 2.0,
  jupiter: 3.4,
  saturn: 4.2,
  uranus: 1.7,
  neptune: 2.8,
};

export function ExplorerCamera({
  activeObject,
  cameraMode,
  targetWorldPositionRef,
}: ExplorerCameraProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const prevObjectId = useRef<string>("");
  const prevMode = useRef<CameraMode>("focus");
  const hasInitialFramed = useRef<boolean>(false);

  const isTransitioning = useRef<boolean>(false);
  const transitionProgress = useRef<number>(0);
  const startCamPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const startTargetPos = useRef<THREE.Vector3>(new THREE.Vector3());

  // When active planet or camera mode changes, initiate a smooth cinematic swoop flight
  useEffect(() => {
    const objectId = activeObject?.domain?.id || "sun";
    const objectChanged = objectId !== prevObjectId.current;
    const modeChanged = cameraMode !== prevMode.current;

    if (objectChanged || modeChanged) {
      prevObjectId.current = objectId;
      prevMode.current = cameraMode;

      isTransitioning.current = true;
      transitionProgress.current = 0;
      startCamPos.current.copy(camera.position);

      if (controlsRef.current) {
        startTargetPos.current.copy(controlsRef.current.target);
      } else {
        startTargetPos.current.set(0, 0, 0);
      }
    }
  }, [activeObject, cameraMode, camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const objectId = activeObject?.domain?.id || "sun";
    const targetDist = ULTRA_CLOSEUP_DISTANCES[objectId] || 2.0;

    if (cameraMode === "overview") {
      controls.minDistance = 2.5;
      controls.maxDistance = 30;

      const targetPos = new THREE.Vector3(0, 0, 0);
      const overviewCamPos = new THREE.Vector3(0, 5.6, 9.8);

      if (isTransitioning.current) {
        transitionProgress.current += delta * 1.5;
        const t = Math.min(transitionProgress.current, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        controls.target.lerpVectors(startTargetPos.current, targetPos, ease);
        camera.position.lerpVectors(startCamPos.current, overviewCamPos, ease);

        if (t >= 1) isTransitioning.current = false;
      }
      controls.update();
    } else if (cameraMode === "topdown") {
      controls.minDistance = 2.5;
      controls.maxDistance = 30;

      const targetPos = new THREE.Vector3(0, 0, 0);
      const topdownCamPos = new THREE.Vector3(0, 10.5, 0.01);

      if (isTransitioning.current) {
        transitionProgress.current += delta * 1.5;
        const t = Math.min(transitionProgress.current, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        controls.target.lerpVectors(startTargetPos.current, targetPos, ease);
        camera.position.lerpVectors(startCamPos.current, topdownCamPos, ease);

        if (t >= 1) isTransitioning.current = false;
      }
      controls.update();
    } else {
      // -----------------------------------------------------------------------
      // Focus Mode: Smooth Swoop Flight & Ultra Close-Up Lock
      // -----------------------------------------------------------------------
      controls.minDistance = Math.max(targetDist * 0.35, 0.2);
      controls.maxDistance = 60;

      const planetPos = targetWorldPositionRef?.current || new THREE.Vector3(0, 0, 0);

      // Instant close-up macro framing on initial page open (no distant camera dot)
      if (!hasInitialFramed.current) {
        controls.target.copy(planetPos);
        const initialCamPos = planetPos.clone().add(
          new THREE.Vector3(0, targetDist * 0.25, targetDist * 0.96)
        );
        camera.position.copy(initialCamPos);
        camera.lookAt(planetPos);
        controls.update();

        if (planetPos.lengthSq() > 0.001 || objectId === "sun") {
          hasInitialFramed.current = true;
        }
        return;
      }

      if (isTransitioning.current) {
        transitionProgress.current += delta * 1.6;
        const t = Math.min(transitionProgress.current, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Destination camera position placed in front of the planet with gentle elevation
        const desiredCamPos = planetPos.clone().add(
          new THREE.Vector3(0, targetDist * 0.25, targetDist * 0.96)
        );

        controls.target.lerpVectors(startTargetPos.current, planetPos, ease);
        camera.position.lerpVectors(startCamPos.current, desiredCamPos, ease);

        if (t >= 1) isTransitioning.current = false;
      } else {
        // Continuous lock-on: Move camera in lockstep with the revolving planet
        const moveDelta = planetPos.clone().sub(controls.target);
        controls.target.copy(planetPos);
        camera.position.add(moveDelta);
      }

      controls.update();
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.7}
      zoomSpeed={0.85}
      panSpeed={0.4}
      enablePan={cameraMode === "overview"}
    />
  );
}

