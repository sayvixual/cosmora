/**
 * COSMORA — Centralized Astronomical Asset Registry & Loader
 * 
 * Single source of truth for all 3D models, deep space imagery,
 * texture maps, and scientific attribution metadata.
 */

import { SpaceVisualAsset } from "./types";

/**
 * Normalizes and encodes asset paths safely for web & 3D loaders (e.g. handling spaces).
 */
export function resolveAssetUrl(rawPath: string): string {
  if (!rawPath) return "";
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }
  // Clean leading slashes and ensure proper single leading slash
  const cleanPath = "/" + rawPath.replace(/^\/+/, "");
  // Encode URI to safely handle directory names with spaces (e.g. /models/Solar System/scene.gltf)
  return encodeURI(cleanPath);
}

/**
 * Centralized Asset Definitions
 */
export const SPACE_ASSET_REGISTRY: Record<string, SpaceVisualAsset> = {
  // 1. Solar System 3D Master Asset
  "solar-system": {
    id: "solar-system",
    name: "Solar System",
    subtitle: "Complete Heliocentric Planetary System",
    category: "solar-system",
    mode: "3d",
    assetPath: resolveAssetUrl("/models/Solar System/scene.gltf"),
    thumbnailPath: "/images/earth_mauna_kea.jpg",
    fileSizeFormatted: "6.81 MB",
    description:
      "Comprehensive 3D GLTF 2.0 asset containing the Sun, all 8 planetary orbits, terrestrial bodies, gas giants, satellite systems, and 50 synchronized kinematic channels.",
    attribution: {
      title: "Solar System : المجموعة الشمسية",
      creator: "shooogp",
      source: "Sketchfab",
      license: "Creative Commons Attribution (CC BY 4.0)",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://sketchfab.com/3d-models/solar-system-fad1f8a62d3848d0be664339e6f3b1a2",
      creditText:
        'This work is based on "Solar System : المجموعة الشمسية" (https://sketchfab.com/3d-models/solar-system-fad1f8a62d3848d0be664339e6f3b1a2) by shooogp licensed under CC-BY-4.0',
      triangleCount: 25400,
      vertexCount: 2820,
    },
  },

  // 2. Andromeda Galaxy (3D & Hybrid)
  andromeda: {
    id: "andromeda",
    name: "Andromeda Galaxy (M31)",
    subtitle: "Nearest Major Spiral Galaxy Neighbor",
    category: "galaxy",
    mode: "3d",
    assetPath: "/images/deep-space/andromeda/textures/Andromeda_baseColor.png",
    thumbnailPath: "/images/deep-space/andromeda/textures/Andromeda_baseColor.png",
    dimensions: { width: 1024, height: 1024 },
    fileSizeFormatted: "6.44 MB (3D GLTF)",
    description:
      "High-resolution observation of the Andromeda Galaxy (M31), harboring approximately one trillion stars spanning 220,000 light-years across.",
    attribution: {
      title: "Andromeda Galaxy 3D Model & Textures",
      creator: "NASA / ESA / Sketchfab Public Domain",
      source: "Hubble Space Telescope Archive",
      license: "Public Domain / NASA Educational Use",
      licenseUrl: "https://images.nasa.gov/",
      sourceUrl: "https://hubblesite.org/contents/media/images/2015/02/3477-Image.html",
    },
  },

  // 3. Orion Nebula (2D Multi-Layer)
  "orion-nebula": {
    id: "orion-nebula",
    name: "Orion Nebula (M42)",
    subtitle: "Massive Stellar Nursery & Starburst Core",
    category: "nebula",
    mode: "2d",
    assetPath: "/images/deep-space/orion-nebula/orion_nebula.jpg",
    thumbnailPath: "/images/deep-space/orion-nebula/orion_nebula.jpg",
    bannerPath: "/images/deep-space/orion-nebula/hero_space_nebula.jpg",
    dimensions: { width: 1024, height: 1024 },
    fileSizeFormatted: "683 KB (Square) / 820 KB (Banner)",
    description:
      "Ionized gas clouds and cosmic dust sculpting newborn massive stars inside the Orion Nebula situated 1,344 light-years from Earth.",
    attribution: {
      title: "Orion Nebula M42 Hubble Mosaic",
      creator: "NASA / ESA / M. Robberto",
      source: "Hubble Space Telescope",
      license: "Public Domain / NASA Guidelines",
      licenseUrl: "https://www.nasa.gov/multimedia/guidelines/index.html",
      sourceUrl: "https://hubblesite.org/contents/media/images/2006/01/1826-Image.html",
    },
  },

  // 4. Pleiades Open Star Cluster (2D Ultra-HD)
  pleiades: {
    id: "pleiades",
    name: "Pleiades Star Cluster (M45)",
    subtitle: "The Seven Sisters Reflection Nebula",
    category: "cluster",
    mode: "2d",
    assetPath: "/images/deep-space/pleiades/pleiades.jpg",
    thumbnailPath: "/images/deep-space/pleiades/pleiades.jpg",
    dimensions: { width: 4728, height: 3702 },
    fileSizeFormatted: "1.79 MB (Ultra-HD 4.7K)",
    description:
      "Ultra-high-definition astronomical capture of the open cluster M45 illuminating ethereal blue reflection nebular clouds.",
    attribution: {
      title: "Pleiades (Messier 45) Reflection Nebula",
      creator: "NASA / ESA / AURA / Caltech",
      source: "Palomar Observatory / Digitized Sky Survey",
      license: "Public Domain / Educational Use",
      licenseUrl: "https://images.nasa.gov/",
      sourceUrl: "https://apod.nasa.gov/apod/ap191125.html",
    },
  },

  // 5. Alpha Centauri Stellar System (2D / Hybrid)
  "alpha-centauri": {
    id: "alpha-centauri",
    name: "Alpha Centauri System",
    subtitle: "Closest Multi-Star System & Proxima Gateway",
    category: "star",
    mode: "hybrid",
    assetPath: "/images/deep-space/alpha-centauri/alpha-centauri.jpg",
    thumbnailPath: "/images/deep-space/alpha-centauri/alpha-centauri.jpg",
    dimensions: { width: 1920, height: 1949 },
    fileSizeFormatted: "2.10 MB (HD 2K)",
    description:
      "High-resolution astronomical imagery of Alpha Centauri A and B binary pair with Proxima Centauri situated 4.37 light-years away.",
    attribution: {
      title: "Alpha Centauri Binary Star Field",
      creator: "European Southern Observatory (ESO)",
      source: "ESO VLT Survey Archive",
      license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://www.eso.org/public/images/eso1241a/",
    },
  },

  // 6. Milky Way Panorama / Environment Skysphere (3D Environment)
  "milky-way": {
    id: "milky-way",
    name: "Milky Way Galaxy Panorama",
    subtitle: "Galactic Core & Deep Sky Panorama",
    category: "environment",
    mode: "environment",
    assetPath: "/images/deep-space/milky_way/textures/milky_way.001_baseColor.png",
    thumbnailPath: "/images/deep-space/milky_way/textures/milky_way.001_baseColor.png",
    dimensions: { width: 4689, height: 3126 },
    fileSizeFormatted: "6.50 MB (3D Environment)",
    description:
      "Ultra-wide 360-capable galactic core panorama featuring stellar dust lanes, glowing nebulae, and high-density star clusters.",
    attribution: {
      title: "Milky Way Galactic Core Panoramic Survey",
      creator: "ESO / Serge Brunier",
      source: "GigaGalaxy Zoom Survey",
      license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://www.eso.org/public/images/eso0932a/",
    },
  },

  // Additional Curated Planetary & Lunar Assets
  earth: {
    id: "earth",
    name: "Earth (Mauna Kea Observatory View)",
    subtitle: "Our Home World",
    category: "planet",
    mode: "2d",
    assetPath: "/images/earth_mauna_kea.jpg",
    thumbnailPath: "/images/earth_mauna_kea.jpg",
    fileSizeFormatted: "717 KB",
  },
  mars: {
    id: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    category: "planet",
    mode: "2d",
    assetPath: "/images/planet_mars.jpg",
    thumbnailPath: "/images/planet_mars.jpg",
    fileSizeFormatted: "631 KB",
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter",
    subtitle: "The King of Planets",
    category: "planet",
    mode: "2d",
    assetPath: "/images/thumb_jupiter.jpg",
    thumbnailPath: "/images/thumb_jupiter.jpg",
    fileSizeFormatted: "768 KB",
  },
  moon: {
    id: "moon",
    name: "The Moon (Luna)",
    subtitle: "Earth's Natural Satellite",
    category: "moon",
    mode: "2d",
    assetPath: "/images/thumb_moon.jpg",
    thumbnailPath: "/images/thumb_moon.jpg",
    fileSizeFormatted: "729 KB",
  },
};

/**
 * Retrieve an asset by its unique identifier.
 * Throws or falls back gracefully if not found.
 */
export function getSpaceAsset(id: string): SpaceVisualAsset {
  const asset = SPACE_ASSET_REGISTRY[id];
  if (!asset) {
    console.warn(`[AssetRegistry] Asset with id "${id}" not found in registry.`);
    // Safe fallback to earth or generic placeholder
    return SPACE_ASSET_REGISTRY["solar-system"] || {
      id: "unknown",
      name: "Unknown Asset",
      category: "solar-system",
      mode: "3d",
      assetPath: resolveAssetUrl("/models/Solar System/scene.gltf"),
    };
  }
  return asset;
}

/**
 * Standalone High-Resolution 3D Planetary Models Registry
 * (Direct local GLTF assets downloaded for deep micro inspection)
 */
export const STANDALONE_PLANET_MODELS: Record<string, string> = {
  sun: resolveAssetUrl("/models/sun/scene.gltf"),
  mercury: resolveAssetUrl("/models/mercury/scene.gltf"),
  venus: resolveAssetUrl("/models/venus/scene.gltf"),
  earth: resolveAssetUrl("/models/earth/scene.gltf"),
  moon: resolveAssetUrl("/models/the_moon/scene.gltf"),
  the_moon: resolveAssetUrl("/models/the_moon/scene.gltf"),
  mars: resolveAssetUrl("/models/mars/scene.gltf"),
  jupiter: resolveAssetUrl("/models/jupiter/scene.gltf"),
  saturn: resolveAssetUrl("/models/saturn/scene.gltf"),
  uranus: resolveAssetUrl("/models/uranus/scene.gltf"),
  neptune: resolveAssetUrl("/models/neptune/scene.gltf"),
};

export function getStandalonePlanetModel(id: string): string | null {
  const normalizedId = id.toLowerCase().replace("the_", "").replace("the-", "");
  return STANDALONE_PLANET_MODELS[normalizedId] || STANDALONE_PLANET_MODELS[id] || null;
}

/**
 * Returns all deep space visual assets.
 */
export function getAllDeepSpaceAssets(): SpaceVisualAsset[] {
  return [
    SPACE_ASSET_REGISTRY["andromeda"],
    SPACE_ASSET_REGISTRY["orion-nebula"],
    SPACE_ASSET_REGISTRY["pleiades"],
    SPACE_ASSET_REGISTRY["alpha-centauri"],
    SPACE_ASSET_REGISTRY["milky-way"],
  ];
}
