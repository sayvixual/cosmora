/**
 * COSMORA — Centralized Astronomical Asset Types
 * 
 * Defines strict types for 3D GLTF assets, 2D deep-space imagery,
 * hybrid visualizations, and skysphere environment maps.
 */

export type SpaceVisualMode = "3d" | "2d" | "hybrid" | "environment";

export type SpaceAssetCategory =
  | "solar-system"
  | "planet"
  | "moon"
  | "star"
  | "galaxy"
  | "nebula"
  | "cluster"
  | "environment"
  | "vehicle";

export interface SpaceVisualAttribution {
  title: string;
  creator: string;
  source: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  creditText?: string;
  triangleCount?: number;
  vertexCount?: number;
}

export interface SpaceVisualAsset {
  id: string;
  name: string;
  subtitle?: string;
  category: SpaceAssetCategory;
  mode: SpaceVisualMode;
  assetPath: string;
  thumbnailPath?: string;
  bannerPath?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSizeFormatted?: string;
  description?: string;
  attribution?: SpaceVisualAttribution;
}
