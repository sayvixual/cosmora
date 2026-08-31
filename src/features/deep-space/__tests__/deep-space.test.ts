import { describe, it, expect } from "vitest";
import {
  DEEP_SPACE_OBJECTS,
  getDeepSpaceObject,
  getAllDeepSpaceObjectsList,
} from "@/lib/data/deep-space";
import { getAllDeepSpaceAssets, getSpaceAsset } from "@/lib/assets/registry";
import { CURATED_OBJECTS } from "@/lib/data/curated-objects";

describe("Phase 7 — Deep Space Domain & Asset Integration", () => {
  it("defines all 5 curated deep space objects with complete scientific metadata", () => {
    const requiredDeepSpaceIds = [
      "andromeda",
      "orion-nebula",
      "pleiades",
      "alpha-centauri",
      "milky-way",
    ];

    requiredDeepSpaceIds.forEach((id) => {
      const obj = getDeepSpaceObject(id);
      expect(obj).toBeDefined();
      expect(obj?.name).toBeTruthy();
      expect(obj?.distanceValue).toBeTruthy();
      expect(obj?.callouts.length).toBeGreaterThan(0);
      expect(obj?.renderingMode).toMatch(/^(3d|2d|hybrid|environment)$/);
      expect(obj?.primaryImageUrl).toBeTruthy();
    });
  });

  it("assigns appropriate rendering mediums to all deep-space targets", () => {
    // Andromeda: 3D / Hybrid
    const andromeda = getDeepSpaceObject("andromeda");
    expect(andromeda?.renderingMode).toBe("3d");
    expect(andromeda?.gltfModelUrl).toBe("/images/deep-space/andromeda/scene.gltf");

    // Orion Nebula: 3D Emission-Reflection Nebula Simulation
    const orion = getDeepSpaceObject("orion-nebula");
    expect(orion?.renderingMode).toBe("3d");
    expect(orion?.primaryImageUrl).toContain("orion_nebula.jpg");

    // Pleiades: 3D Open Star Cluster Simulation
    const pleiades = getDeepSpaceObject("pleiades");
    expect(pleiades?.renderingMode).toBe("3d");
    expect(pleiades?.primaryImageUrl).toContain("pleiades.jpg");

    // Alpha Centauri: 3D Triple Star System Simulation
    const alphaCentauri = getDeepSpaceObject("alpha-centauri");
    expect(alphaCentauri?.renderingMode).toBe("3d");
    expect(alphaCentauri?.primaryImageUrl).toContain("alpha-centauri.jpg");

    // Milky Way: 3D environment / background
    const milkyWay = getDeepSpaceObject("milky-way");
    expect(milkyWay?.renderingMode).toBe("environment");
    expect(milkyWay?.gltfModelUrl).toBe("/images/deep-space/milky_way/scene.gltf");
  });

  it("contains valid asset registry links and resolves fallbacks", () => {
    const assets = getAllDeepSpaceAssets();
    expect(assets.length).toBe(5);

    const andrAsset = getSpaceAsset("andromeda");
    expect(andrAsset.assetPath).toContain("textures/Andromeda_baseColor.png");

    const mwAsset = getSpaceAsset("milky-way");
    expect(mwAsset.assetPath).toContain("textures/milky_way.001_baseColor.png");
  });

  it("includes all deep-space objects in CURATED_OBJECTS for unified UX navigation", () => {
    const curatedIds = CURATED_OBJECTS.map((o) => o.id);
    expect(curatedIds).toContain("andromeda");
    expect(curatedIds).toContain("orion");
    expect(curatedIds).toContain("pleiades");
    expect(curatedIds).toContain("alpha-centauri");
    expect(curatedIds).toContain("milky-way");
  });

  it("correctly categorizes all targets into galaxy, nebula, cluster, star", () => {
    const allObjects = getAllDeepSpaceObjectsList();
    const galaxies = allObjects.filter((o) => o.category === "galaxy");
    const nebulae = allObjects.filter((o) => o.category === "nebula");
    const clusters = allObjects.filter((o) => o.category === "cluster");
    const stars = allObjects.filter((o) => o.category === "star");

    expect(galaxies.map((g) => g.id)).toContain("andromeda");
    expect(galaxies.map((g) => g.id)).toContain("milky-way");
    expect(nebulae.map((n) => n.id)).toContain("orion-nebula");
    expect(clusters.map((c) => c.id)).toContain("pleiades");
    expect(stars.map((s) => s.id)).toContain("alpha-centauri");
  });
});
