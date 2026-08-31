/**
 * COSMORA — Solar System Visuals Configuration
 * 
 * Separation of Rendering Parameters from Domain Scientific Data.
 * Contains scale, emissive parameters, ring geometry, materials, and camera offsets.
 */

export interface RingVisualConfig {
  innerRadius: number;
  outerRadius: number;
  color: string;
  opacity: number;
  tiltEuler: [number, number, number];
}

export interface CelestialVisualConfig {
  id: string;
  // Spatial Geometry
  radius: number;
  orbitRadius: number;
  axialTiltEuler: [number, number, number];
  
  // Materials & Shaders
  color: string;
  emissive: string;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  glowColor: string;
  glowRadius: number;
  
  // Kinematics in scene
  orbitSpeed: number; // orbital angular velocity scale
  rotationSpeed: number; // axial rotation speed
  
  // Specific features
  rings?: RingVisualConfig;
  parentPlanetId?: string; // e.g. for moon -> earth
  moonOrbitRadius?: number; // relative to parent
  
  // Camera focus presets
  cameraFocusDistance: number;
  cameraFocusOffset: [number, number, number];
  cameraOverviewDistance: number;
}

export const SOLAR_SYSTEM_VISUALS: Record<string, CelestialVisualConfig> = {
  sun: {
    id: "sun",
    radius: 4.5,
    orbitRadius: 0,
    axialTiltEuler: [0, 0, (7.25 * Math.PI) / 180],
    color: "#FFAA22",
    emissive: "#FF8800",
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.1,
    glowColor: "rgba(255, 140, 20, 0.95)",
    glowRadius: 12.0,
    orbitSpeed: 0,
    rotationSpeed: 0.003,
    cameraFocusDistance: 22.0,
    cameraFocusOffset: [0, 8, 22],
    cameraOverviewDistance: 95.0,
  },
  mercury: {
    id: "mercury",
    radius: 0.55,
    orbitRadius: 9.0,
    axialTiltEuler: [0, 0, (0.034 * Math.PI) / 180],
    color: "#B5A7A0",
    emissive: "#3A3532",
    emissiveIntensity: 0.1,
    roughness: 0.85,
    metalness: 0.15,
    glowColor: "rgba(181, 167, 160, 0.4)",
    glowRadius: 1.5,
    orbitSpeed: 0.035,
    rotationSpeed: 0.005,
    cameraFocusDistance: 4.5,
    cameraFocusOffset: [0, 1.5, 4.5],
    cameraOverviewDistance: 95.0,
  },
  venus: {
    id: "venus",
    radius: 1.05,
    orbitRadius: 14.0,
    axialTiltEuler: [0, 0, (177.36 * Math.PI) / 180],
    color: "#E3BB7B",
    emissive: "#4D3B1C",
    emissiveIntensity: 0.15,
    roughness: 0.7,
    metalness: 0.1,
    glowColor: "rgba(227, 187, 123, 0.5)",
    glowRadius: 2.2,
    orbitSpeed: 0.024,
    rotationSpeed: -0.002, // retrograde
    cameraFocusDistance: 6.0,
    cameraFocusOffset: [0, 2.2, 6.0],
    cameraOverviewDistance: 95.0,
  },
  earth: {
    id: "earth",
    radius: 1.15,
    orbitRadius: 19.5,
    axialTiltEuler: [0, 0, (23.44 * Math.PI) / 180],
    color: "#2B82C9",
    emissive: "#0A2540",
    emissiveIntensity: 0.2,
    roughness: 0.5,
    metalness: 0.2,
    glowColor: "rgba(75, 158, 255, 0.6)",
    glowRadius: 2.5,
    orbitSpeed: 0.018,
    rotationSpeed: 0.012,
    cameraFocusDistance: 6.8,
    cameraFocusOffset: [0, 2.5, 6.8],
    cameraOverviewDistance: 95.0,
  },
  moon: {
    id: "moon",
    radius: 0.32,
    orbitRadius: 19.5, // follows Earth
    parentPlanetId: "earth",
    moonOrbitRadius: 2.6,
    axialTiltEuler: [0, 0, (1.54 * Math.PI) / 180],
    color: "#D0D0D0",
    emissive: "#202020",
    emissiveIntensity: 0.08,
    roughness: 0.9,
    metalness: 0.05,
    glowColor: "rgba(220, 220, 220, 0.35)",
    glowRadius: 0.9,
    orbitSpeed: 0.018, // Earth orbit
    rotationSpeed: 0.008,
    cameraFocusDistance: 3.2,
    cameraFocusOffset: [0, 1.0, 3.2],
    cameraOverviewDistance: 95.0,
  },
  mars: {
    id: "mars",
    radius: 0.82,
    orbitRadius: 25.5,
    axialTiltEuler: [0, 0, (25.19 * Math.PI) / 180],
    color: "#E25A38",
    emissive: "#4D1D10",
    emissiveIntensity: 0.2,
    roughness: 0.75,
    metalness: 0.15,
    glowColor: "rgba(226, 90, 56, 0.55)",
    glowRadius: 2.0,
    orbitSpeed: 0.014,
    rotationSpeed: 0.011,
    cameraFocusDistance: 5.8,
    cameraFocusOffset: [0, 2.0, 5.8],
    cameraOverviewDistance: 95.0,
  },
  jupiter: {
    id: "jupiter",
    radius: 2.9,
    orbitRadius: 39.0,
    axialTiltEuler: [0, 0, (3.13 * Math.PI) / 180],
    color: "#D4A373",
    emissive: "#3D2B1A",
    emissiveIntensity: 0.15,
    roughness: 0.6,
    metalness: 0.05,
    glowColor: "rgba(212, 163, 115, 0.5)",
    glowRadius: 5.5,
    orbitSpeed: 0.008,
    rotationSpeed: 0.024,
    cameraFocusDistance: 15.0,
    cameraFocusOffset: [0, 5.0, 15.0],
    cameraOverviewDistance: 95.0,
  },
  saturn: {
    id: "saturn",
    radius: 2.3,
    orbitRadius: 52.0,
    axialTiltEuler: [0, 0, (26.73 * Math.PI) / 180],
    color: "#E8D8A6",
    emissive: "#383220",
    emissiveIntensity: 0.15,
    roughness: 0.55,
    metalness: 0.05,
    glowColor: "rgba(232, 216, 166, 0.5)",
    glowRadius: 4.8,
    orbitSpeed: 0.0055,
    rotationSpeed: 0.022,
    rings: {
      innerRadius: 3.1,
      outerRadius: 5.8,
      color: "#CBB38B",
      opacity: 0.85,
      tiltEuler: [(26.73 * Math.PI) / 180, 0, 0],
    },
    cameraFocusDistance: 18.0,
    cameraFocusOffset: [0, 6.5, 18.0],
    cameraOverviewDistance: 95.0,
  },
  uranus: {
    id: "uranus",
    radius: 1.65,
    orbitRadius: 65.0,
    axialTiltEuler: [(97.77 * Math.PI) / 180, 0, 0],
    color: "#7DE2E8",
    emissive: "#154245",
    emissiveIntensity: 0.2,
    roughness: 0.45,
    metalness: 0.1,
    glowColor: "rgba(125, 226, 232, 0.6)",
    glowRadius: 3.5,
    orbitSpeed: 0.0035,
    rotationSpeed: -0.015,
    rings: {
      innerRadius: 2.0,
      outerRadius: 2.7,
      color: "#9EE8EE",
      opacity: 0.4,
      tiltEuler: [(97.77 * Math.PI) / 180, 0, 0],
    },
    cameraFocusDistance: 10.5,
    cameraFocusOffset: [0, 3.8, 10.5],
    cameraOverviewDistance: 95.0,
  },
  neptune: {
    id: "neptune",
    radius: 1.6,
    orbitRadius: 78.0,
    axialTiltEuler: [0, 0, (28.32 * Math.PI) / 180],
    color: "#3F64E8",
    emissive: "#0D1E5E",
    emissiveIntensity: 0.25,
    roughness: 0.4,
    metalness: 0.15,
    glowColor: "rgba(63, 100, 232, 0.65)",
    glowRadius: 3.5,
    orbitSpeed: 0.0025,
    rotationSpeed: 0.016,
    cameraFocusDistance: 10.5,
    cameraFocusOffset: [0, 3.8, 10.5],
    cameraOverviewDistance: 95.0,
  },
};

export const ASTEROID_BELT_CONFIG = {
  innerRadius: 6.2,
  outerRadius: 7.4,
  count: 1000,
  color: "#D4B895",
  particleSize: 0.16,
};
