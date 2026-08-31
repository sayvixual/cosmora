import { describe, it, expect } from "vitest";
import { SOLAR_SYSTEM_DOMAIN_DATA, CELESTIAL_OBJECT_ORDER } from "../data/solar-system";
import { SOLAR_SYSTEM_VISUALS } from "../data/solar-system-visuals";
import {
  getCelestialObject,
  getAllCelestialObjects,
  SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION,
  GLTF_SOLAR_SYSTEM_NODES,
  GLTF_ORBIT_TORUS_NODES,
  mapGLTFNodeToCelestialId,
  classifyAnimationTrackNames,
  SOLAR_SYSTEM_GLTF_URL,
} from "../adapters/sketchfab-solar-system";

describe("Solar System Explorer Data & Adapter Layer", () => {
  it("contains all 10 domain objects with valid scientific properties", () => {
    expect(CELESTIAL_OBJECT_ORDER).toHaveLength(10);
    CELESTIAL_OBJECT_ORDER.forEach((id) => {
      const obj = SOLAR_SYSTEM_DOMAIN_DATA[id];
      expect(obj).toBeDefined();
      expect(obj.id).toBe(id);
      expect(obj.name).toBeTruthy();
      expect(obj.solId).toMatch(/^SOL-/);
      expect(obj.distanceKm).toBeTruthy();
      expect(obj.diameterKm).toBeTruthy();
      expect(obj.rotationPeriod).toBeTruthy();
      expect(obj.orbitPeriod).toBeTruthy();
      expect(obj.provenance).toBeDefined();
      expect(obj.provenance.provider).toBeTruthy();
      expect(obj.provenance.sourceUrl).toContain("https://");
    });
  });

  it("contains corresponding rendering visuals for all 10 objects", () => {
    CELESTIAL_OBJECT_ORDER.forEach((id) => {
      const visual = SOLAR_SYSTEM_VISUALS[id];
      expect(visual).toBeDefined();
      expect(visual.id).toBe(id);
      expect(visual.radius).toBeGreaterThan(0);
      expect(visual.cameraFocusOffset).toHaveLength(3);
      expect(visual.color).toMatch(/^#/);
    });
  });

  it("maps all 10 celestial objects to concrete GLTF nodes and meshes", () => {
    CELESTIAL_OBJECT_ORDER.forEach((id) => {
      const mapping = GLTF_SOLAR_SYSTEM_NODES[id];
      expect(mapping).toBeDefined();
      expect(mapping.domainId).toBe(id);
      expect(mapping.nodeName).toBeTruthy();
      expect(mapping.meshName).toBeTruthy();
      expect(mapping.materialName).toBeTruthy();
      expect(mapping.textureFile).toContain("textures/");
    });
  });

  it("correctly maps GLTF node names back to celestial domain IDs", () => {
    expect(mapGLTFNodeToCelestialId("Sphere_001")).toBe("sun");
    expect(mapGLTFNodeToCelestialId("Sphere_002")).toBe("mercury");
    expect(mapGLTFNodeToCelestialId("Sphere_009")).toBe("venus");
    expect(mapGLTFNodeToCelestialId("Sphere_003")).toBe("earth");
    expect(mapGLTFNodeToCelestialId("Sphere_010")).toBe("moon");
    expect(mapGLTFNodeToCelestialId("Sphere")).toBe("mars");
    expect(mapGLTFNodeToCelestialId("Sphere_005")).toBe("jupiter");
    expect(mapGLTFNodeToCelestialId("Sphere_006")).toBe("saturn");
    expect(mapGLTFNodeToCelestialId("Sphere_007")).toBe("uranus");
    expect(mapGLTFNodeToCelestialId("Sphere_008")).toBe("neptune");
    expect(mapGLTFNodeToCelestialId("UnknownMesh_99")).toBeNull();
  });

  it("includes all 8 orbit ring torus nodes", () => {
    expect(GLTF_ORBIT_TORUS_NODES).toHaveLength(8);
    expect(GLTF_ORBIT_TORUS_NODES).toContain("Torus_001");
    expect(GLTF_ORBIT_TORUS_NODES).toContain("Torus_007");
  });

  it("adapter correctly stitches domain, visual, and GLTF node configurations together", () => {
    const all = getAllCelestialObjects();
    expect(all).toHaveLength(10);

    const mars = getCelestialObject("mars");
    expect(mars).not.toBeNull();
    expect(mars?.domain.name).toBe("Mars");
    expect(mars?.domain.solId).toBe("SOL-4");
    expect(mars?.visual.orbitRadius).toBe(25.5);
    expect(mars?.gltfMapping.nodeName).toBe("Sphere");
    expect(mars?.gltfMapping.materialName).toBe("Material_003");
  });

  it("classifies GLTF animation tracks accurately", () => {
    const sampleTracks = [
      "BezierCircle_008.rotation",
      "Sphere_008.rotation",
      "Sphere_008.translation",
      "Torus_007.rotation",
      "Lamp_001.rotation",
    ];

    const classification = classifyAnimationTrackNames(sampleTracks);
    expect(classification.orbitalTracks).toContain("BezierCircle_008.rotation");
    expect(classification.axialSpinTracks).toContain("Sphere_008.rotation");
    expect(classification.torusTracks).toContain("Torus_007.rotation");
    expect(classification.helperTracks).toContain("Lamp_001.rotation");
  });

  it("encodes Solar System GLTF URL safely for web fetch", () => {
    expect(SOLAR_SYSTEM_GLTF_URL).toBe("/models/Solar%20System/scene.gltf");
    expect(SOLAR_SYSTEM_GLTF_URL).not.toContain(" ");
  });

  it("maintains CC BY attribution metadata for Sketchfab asset", () => {
    expect(SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION.title).toBe("Solar System : المجموعة الشمسية");
    expect(SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION.creator).toBe("shooogp");
    expect(SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION.license).toContain("CC BY");
    expect(SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION.sourceUrl).toContain("sketchfab.com");
  });
});
