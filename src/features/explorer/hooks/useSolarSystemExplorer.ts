"use client";

import { useState, useCallback, useMemo } from "react";
import { getCelestialObject, getAllCelestialObjects, CelestialCompositeObject } from "../adapters/sketchfab-solar-system";

export type CameraMode = "overview" | "focus" | "topdown";

export interface SolarSystemExplorerState {
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
  activeObject: CelestialCompositeObject;
  allObjects: CelestialCompositeObject[];
  
  // Camera
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  
  // Simulation Kinematics
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  togglePause: () => void;
  
  // Visual Layers
  showOrbits: boolean;
  setShowOrbits: React.Dispatch<React.SetStateAction<boolean>>;
  showBelts: boolean;
  setShowBelts: React.Dispatch<React.SetStateAction<boolean>>;
  showLabels: boolean;
  setShowLabels: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Attribution & Info Modal
  showAttribution: boolean;
  setShowAttribution: (show: boolean) => void;
}

export function useSolarSystemExplorer(initialObjectId = "mars"): SolarSystemExplorerState {
  const [selectedObjectId, setSelectedObjectIdState] = useState<string>(initialObjectId);
  const [cameraMode, setCameraMode] = useState<CameraMode>("focus");
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showBelts, setShowBelts] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showAttribution, setShowAttribution] = useState<boolean>(false);

  const allObjects = useMemo(() => getAllCelestialObjects(), []);

  const activeObject = useMemo(() => {
    return getCelestialObject(selectedObjectId) || allObjects[0];
  }, [selectedObjectId, allObjects]);

  const setSelectedObjectId = useCallback((id: string) => {
    setSelectedObjectIdState(id);
    // When an object is explicitly clicked, transition camera to focus mode
    setCameraMode("focus");
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return {
    selectedObjectId,
    setSelectedObjectId,
    activeObject,
    allObjects,
    cameraMode,
    setCameraMode,
    simulationSpeed,
    setSimulationSpeed,
    isPaused,
    togglePause,
    showOrbits,
    setShowOrbits,
    showBelts,
    setShowBelts,
    showLabels,
    setShowLabels,
    showAttribution,
    setShowAttribution,
  };
}
