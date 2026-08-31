import { describe, it, expect } from "vitest";
import {
  SPACE_ASSET_REGISTRY,
  getSpaceAsset,
  resolveAssetUrl,
  getAllDeepSpaceAssets,
} from "../registry";

describe("Centralized Space Asset Registry", () => {
  it("resolves raw paths and properly encodes spaces", () => {
    expect(resolveAssetUrl("/models/Solar System/scene.gltf")).toBe("/models/Solar%20System/scene.gltf");
    expect(resolveAssetUrl("images/deep-space/andromeda/andromeda_galaxy.jpg")).toBe("/images/deep-space/andromeda/andromeda_galaxy.jpg");
    expect(resolveAssetUrl("https://example.com/asset.jpg")).toBe("https://example.com/asset.jpg");
  });

  it("contains all 6 primary astronomical assets", () => {
    const requiredKeys = [
      "solar-system",
      "andromeda",
      "orion-nebula",
      "pleiades",
      "alpha-centauri",
      "milky-way",
    ];

    requiredKeys.forEach((key) => {
      const asset = SPACE_ASSET_REGISTRY[key];
      expect(asset).toBeDefined();
      expect(asset.id).toBe(key);
      expect(asset.assetPath).toBeTruthy();
      expect(asset.name).toBeTruthy();
      expect(asset.mode).toMatch(/^(3d|2d|hybrid|environment)$/);
    });
  });

  it("getSpaceAsset retrieves existing assets and handles fallbacks", () => {
    const andromeda = getSpaceAsset("andromeda");
    expect(andromeda.name).toContain("Andromeda");
    expect(andromeda.assetPath).toBe("/images/deep-space/andromeda/textures/Andromeda_baseColor.png");

    const solar = getSpaceAsset("solar-system");
    expect(solar.mode).toBe("3d");
    expect(solar.assetPath).toBe("/models/Solar%20System/scene.gltf");
    expect(solar.attribution?.creator).toBe("shooogp");
  });

  it("getAllDeepSpaceAssets returns all 5 deep space visuals", () => {
    const deepSpace = getAllDeepSpaceAssets();
    expect(deepSpace).toHaveLength(5);
    const ids = deepSpace.map((a) => a.id);
    expect(ids).toContain("andromeda");
    expect(ids).toContain("orion-nebula");
    expect(ids).toContain("pleiades");
    expect(ids).toContain("alpha-centauri");
    expect(ids).toContain("milky-way");
  });
});
