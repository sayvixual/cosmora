/**
 * COSMORA — Sketchfab Solar System Asset Adapter
 * 
 * Maps the 3D model asset "Solar System : المجموعة الشمسية" by shooogp into COSMORA celestial domain objects.
 * Maintains licensing metadata, explicit GLTF node mappings, and animation channel classification.
 */

import { SOLAR_SYSTEM_DOMAIN_DATA, CelestialObjectDomain } from "../data/solar-system";
import { SOLAR_SYSTEM_VISUALS, CelestialVisualConfig } from "../data/solar-system-visuals";
import { resolveAssetUrl } from "@/lib/assets/registry";

export const SOLAR_SYSTEM_GLTF_URL = resolveAssetUrl("/models/Solar System/scene.gltf");

export interface GLTFNodeMapping {
  domainId: string;
  nodeName: string;
  meshName: string;
  materialName: string;
  textureFile: string;
  parentOrbitNode?: string;
  orbitIndex?: number;
}

export const GLTF_SOLAR_SYSTEM_NODES: Record<string, GLTFNodeMapping> = {
  sun: {
    domainId: "sun",
    nodeName: "Sphere_001",
    meshName: "Sphere_001_Material_002_0",
    materialName: "Material_002",
    textureFile: "textures/Material_002_baseColor.jpeg",
  },
  mercury: {
    domainId: "mercury",
    nodeName: "Sphere_002",
    parentOrbitNode: "BezierCircle",
    meshName: "Sphere_002_Material_005_0",
    materialName: "Material_005",
    textureFile: "textures/Material_005_baseColor.jpeg",
    orbitIndex: 1,
  },
  venus: {
    domainId: "venus",
    nodeName: "Sphere_009",
    parentOrbitNode: "BezierCircle_001",
    meshName: "Sphere_009_Material_006_0",
    materialName: "Material_006",
    textureFile: "textures/Material_006_baseColor.jpeg",
    orbitIndex: 2,
  },
  earth: {
    domainId: "earth",
    nodeName: "Sphere_003",
    parentOrbitNode: "BezierCircle_002",
    meshName: "Sphere_003_Material_004_0",
    materialName: "Material_004",
    textureFile: "textures/Material_004_baseColor.jpeg",
    orbitIndex: 3,
  },
  moon: {
    domainId: "moon",
    nodeName: "Sphere_010",
    parentOrbitNode: "BezierCircle_003",
    meshName: "Sphere_010_Material_011_0",
    materialName: "Material_011",
    textureFile: "textures/Material_011_baseColor.jpeg",
    orbitIndex: 3.1,
  },
  mars: {
    domainId: "mars",
    nodeName: "Sphere",
    parentOrbitNode: "BezierCircle_004",
    meshName: "Sphere_Material_003_0",
    materialName: "Material_003",
    textureFile: "textures/Material_003_baseColor.jpeg",
    orbitIndex: 4,
  },
  jupiter: {
    domainId: "jupiter",
    nodeName: "Sphere_005",
    parentOrbitNode: "BezierCircle_005",
    meshName: "Sphere_005_Material_007_0",
    materialName: "Material_007",
    textureFile: "textures/Material_007_baseColor.jpeg",
    orbitIndex: 5,
  },
  saturn: {
    domainId: "saturn",
    nodeName: "Sphere_006",
    parentOrbitNode: "BezierCircle_006",
    meshName: "Sphere_006_Material_008_0",
    materialName: "Material_008",
    textureFile: "textures/Material_008_baseColor.jpeg",
    orbitIndex: 6,
  },
  uranus: {
    domainId: "uranus",
    nodeName: "Sphere_007",
    parentOrbitNode: "BezierCircle_007",
    meshName: "Sphere_007_Material_009_0",
    materialName: "Material_009",
    textureFile: "textures/Material_009_baseColor.jpeg",
    orbitIndex: 7,
  },
  neptune: {
    domainId: "neptune",
    nodeName: "Sphere_008",
    parentOrbitNode: "BezierCircle_008",
    meshName: "Sphere_008_Material_010_0",
    materialName: "Material_010",
    textureFile: "textures/Material_010_baseColor.jpeg",
    orbitIndex: 8,
  },
};

export const GLTF_ORBIT_TORUS_NODES = [
  "Torus_001",
  "Torus_000",
  "Torus_002",
  "Torus_003",
  "Torus_004",
  "Torus_005",
  "Torus_006",
  "Torus_007",
];

export const GLTF_HELPER_NODES = [
  "Sun",
  "Object_50",
  "Object_51",
  "Lamp_001",
  "Object_53",
  "Object_54",
  "Lamp",
  "Object_56",
  "Object_57",
];

export function mapGLTFNodeToCelestialId(nodeOrMeshName: string): string | null {
  if (!nodeOrMeshName) return null;

  // 1. Direct exact matches for planet sphere nodes and meshes
  for (const [id, mapping] of Object.entries(GLTF_SOLAR_SYSTEM_NODES)) {
    if (
      nodeOrMeshName === mapping.nodeName ||
      nodeOrMeshName === mapping.meshName
    ) {
      return id;
    }
  }

  // 2. Exact compound mesh names (e.g. Sphere_005_Material_007_0)
  for (const [id, mapping] of Object.entries(GLTF_SOLAR_SYSTEM_NODES)) {
    if (nodeOrMeshName === `${mapping.nodeName}_${mapping.materialName}_0`) {
      return id;
    }
  }

  return null;
}

export interface SketchfabModelAttribution {
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  description: string;
  triangleCount: number;
  vertexCount: number;
}

export const SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION: SketchfabModelAttribution = {
  title: "Solar System : المجموعة الشمسية",
  creator: "shooogp",
  license: "Creative Commons Attribution (CC BY 4.0)",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  sourceUrl: "https://sketchfab.com/3d-models/solar-system-fad1f8a62d3848d0be664339e6f3b1a2",
  description: "Base 3D Solar System celestial asset containing the Sun, planetary orbits, terrestrial bodies, gas giants, and satellite systems.",
  triangleCount: 25400,
  vertexCount: 2820,
};

export interface CelestialCompositeObject {
  domain: CelestialObjectDomain;
  visual: CelestialVisualConfig;
  gltfMapping: GLTFNodeMapping;
  nodeKey: string;
}

/**
 * Adapter mapping domain ID to combined domain, visual, and GLTF node configuration
 */
export function getCelestialObject(id: string): CelestialCompositeObject | null {
  const domain = SOLAR_SYSTEM_DOMAIN_DATA[id];
  const visual = SOLAR_SYSTEM_VISUALS[id];
  const gltfMapping = GLTF_SOLAR_SYSTEM_NODES[id];
  if (!domain || !visual || !gltfMapping) return null;

  return {
    domain,
    visual,
    gltfMapping,
    nodeKey: `celestial_node_${id}`,
  };
}

/**
 * Get all celestial objects in order
 */
export function getAllCelestialObjects(): CelestialCompositeObject[] {
  const order = [
    "sun",
    "mercury",
    "venus",
    "earth",
    "moon",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];

  return order
    .map((id) => getCelestialObject(id))
    .filter((obj): obj is CelestialCompositeObject => obj !== null);
}

/**
 * Animation track classifications
 */
export interface AnimationTrackClassification {
  orbitalTracks: string[];
  axialSpinTracks: string[];
  torusTracks: string[];
  helperTracks: string[];
}

export function classifyAnimationTrackNames(trackNames: string[]): AnimationTrackClassification {
  const orbitalTracks: string[] = [];
  const axialSpinTracks: string[] = [];
  const torusTracks: string[] = [];
  const helperTracks: string[] = [];

  trackNames.forEach((name) => {
    if (name.includes("BezierCircle")) {
      orbitalTracks.push(name);
    } else if (name.includes("Torus")) {
      torusTracks.push(name);
    } else if (name.includes("Lamp") || name.startsWith("Sun.") || name.startsWith("Object_")) {
      helperTracks.push(name);
    } else if (name.includes("Sphere")) {
      axialSpinTracks.push(name);
    }
  });

  return {
    orbitalTracks,
    axialSpinTracks,
    torusTracks,
    helperTracks,
  };
}
