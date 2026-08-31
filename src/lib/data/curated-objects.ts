import { getSpaceAsset } from "../assets/registry";

export interface CuratedCelestialObject {
  id: string;
  name: string;
  subtitle: string;
  typeLabel: string;
  category: "planet" | "moon" | "galaxy" | "nebula" | "cluster" | "star";
  distanceValue: string;
  distanceFromEarth: string;
  dayLengthOrRotation: string;
  moonsOrStars: string;
  magnitude: string;
  coordinates: string;
  description: string;
  imageSrc: string;
  glowColor: string;
  accentColor: string;
  actions: ("observe" | "photo" | "research" | "visit")[];
  spatialPosition: {
    x: number; // percentage offset in scene
    y: number;
    scale: number;
  };
}

export const CURATED_OBJECTS: CuratedCelestialObject[] = [
  {
    id: "mars",
    name: "MARS",
    subtitle: "The Red Planet",
    typeLabel: "Terrestrial Planet",
    category: "planet",
    distanceValue: "225M KM",
    distanceFromEarth: "225M km",
    dayLengthOrRotation: "24h 39m",
    moonsOrStars: "2 Moons (Phobos & Deimos)",
    magnitude: "-0.8 mag",
    coordinates: "RA 21h 38m • DEC -14°22′",
    description:
      "Mars is a terrestrial planet known for its red appearance, cold desert climate, ancient dry river valleys, and colossal shield volcanoes.",
    imageSrc: getSpaceAsset("mars").assetPath,
    glowColor: "rgba(230, 81, 0, 0.45)",
    accentColor: "#E65100",
    actions: ["observe", "photo", "research", "visit"],
    spatialPosition: { x: 58, y: 72, scale: 0.42 },
  },
  {
    id: "earth",
    name: "EARTH",
    subtitle: "Our Living World",
    typeLabel: "Terrestrial Planet",
    category: "planet",
    distanceValue: "0 KM",
    distanceFromEarth: "0 km (Station)",
    dayLengthOrRotation: "24h 00m",
    moonsOrStars: "1 Moon (Luna)",
    magnitude: "-3.9 mag (from Mars)",
    coordinates: "LAT 19.82°N • LON 155.46°W",
    description:
      "Our home oasis with dynamic oceans, protective magnetic shield, atmosphere supporting diverse biosphere, and observation platform for the cosmos.",
    imageSrc: getSpaceAsset("earth").assetPath,
    glowColor: "rgba(41, 182, 246, 0.4)",
    accentColor: "#29B6F6",
    actions: ["observe", "photo", "research", "visit"],
    spatialPosition: { x: 50, y: 44, scale: 1.0 },
  },
  {
    id: "jupiter",
    name: "JUPITER",
    subtitle: "The Giant Gas World",
    typeLabel: "Gas Giant",
    category: "planet",
    distanceValue: "591M KM",
    distanceFromEarth: "591M km",
    dayLengthOrRotation: "9h 55m",
    moonsOrStars: "95 Moons (4 Galilean)",
    magnitude: "-2.4 mag",
    coordinates: "RA 04h 12m • DEC +18°04′",
    description:
      "The solar system's king planet, famous for swirling atmospheric cloud bands, magnetic field, and the ancient Great Red Spot storm.",
    imageSrc: getSpaceAsset("jupiter").assetPath,
    glowColor: "rgba(255, 179, 71, 0.45)",
    accentColor: "#FFA726",
    actions: ["observe", "photo", "research"],
    spatialPosition: { x: 38, y: 15, scale: 0.38 },
  },
  {
    id: "andromeda",
    name: "ANDROMEDA",
    subtitle: "Nearest Spiral Neighbor",
    typeLabel: "Spiral Galaxy (M31)",
    category: "galaxy",
    distanceValue: "2.54M LY",
    distanceFromEarth: "2.54M LY",
    dayLengthOrRotation: "225M Year Cycle",
    moonsOrStars: "1 Trillion Stars",
    magnitude: "+3.4 mag",
    coordinates: "RA 00h 42m • DEC +41°16′",
    description:
      "A majestic barred spiral galaxy containing over one trillion stars, gravitationally bound on a slow collision course with our Milky Way.",
    imageSrc: getSpaceAsset("andromeda").assetPath,
    glowColor: "rgba(186, 104, 200, 0.4)",
    accentColor: "#BA68C8",
    actions: ["observe", "photo", "research"],
    spatialPosition: { x: 74, y: 18, scale: 0.48 },
  },
  {
    id: "moon",
    name: "THE MOON",
    subtitle: "Earth's Natural Satellite",
    typeLabel: "Lunar Satellite",
    category: "moon",
    distanceValue: "384K KM",
    distanceFromEarth: "384.4K km",
    dayLengthOrRotation: "27.3 Earth Days",
    moonsOrStars: "Earth-Moon System",
    magnitude: "-12.7 mag (Full)",
    coordinates: "RA 18h 22m • DEC -23°14′",
    description:
      "Earth's tidally locked satellite featuring ancient basaltic maria, heavily cratered highlands, and humanity's proving ground for deep space travel.",
    imageSrc: getSpaceAsset("moon").assetPath,
    glowColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#E0E0E0",
    actions: ["observe", "photo", "research", "visit"],
    spatialPosition: { x: 70, y: 38, scale: 0.34 },
  },
  {
    id: "orion",
    name: "ORION NEBULA",
    subtitle: "Great Cosmic Nursery",
    typeLabel: "Diffuse Nebula (M42)",
    category: "nebula",
    distanceValue: "1,344 LY",
    distanceFromEarth: "1,344 Light Years",
    dayLengthOrRotation: "24 Light-Year Span",
    moonsOrStars: "Trapezium Star Cluster",
    magnitude: "+4.0 mag",
    coordinates: "RA 05h 35m • DEC -05°23′",
    description:
      "A luminous stellar nursery visible to the naked eye where massive newborn stars illuminate towering sculpted clouds of ionized hydrogen and cosmic dust.",
    imageSrc: getSpaceAsset("orion-nebula").assetPath,
    glowColor: "rgba(233, 30, 99, 0.45)",
    accentColor: "#E91E63",
    actions: ["observe", "photo", "research"],
    spatialPosition: { x: 42, y: 78, scale: 0.44 },
  },
  {
    id: "pleiades",
    name: "PLEIADES",
    subtitle: "Seven Sisters Cluster",
    typeLabel: "Open Star Cluster (M45)",
    category: "cluster",
    distanceValue: "444 LY",
    distanceFromEarth: "444 Light Years",
    dayLengthOrRotation: "100M Year Age",
    moonsOrStars: "1,000+ Bound Stars",
    magnitude: "+1.6 mag",
    coordinates: "RA 03h 47m • DEC +24°07′",
    description:
      "An open cluster of brilliant hot B-type blue stars enveloped in an ethereal reflection nebula passing through cosmic interstellar clouds.",
    imageSrc: getSpaceAsset("pleiades").assetPath,
    glowColor: "rgba(75, 158, 255, 0.45)",
    accentColor: "#4B9EFF",
    actions: ["observe", "photo", "research"],
    spatialPosition: { x: 26, y: 46, scale: 0.36 },
  },
  {
    id: "alpha-centauri",
    name: "ALPHA CENTAURI",
    subtitle: "Closest Multi-Star Gateway",
    typeLabel: "Triple Star System",
    category: "star",
    distanceValue: "4.37 LY",
    distanceFromEarth: "4.367 Light Years",
    dayLengthOrRotation: "79.9-Year Orbit",
    moonsOrStars: "3 Stars + Exoplanet b",
    magnitude: "-0.27 mag",
    coordinates: "RA 14h 39m • DEC -60°50′",
    description:
      "Our closest stellar neighbors consisting of the Sun-like binary pair Rigil Kentaurus & Toliman, and red dwarf Proxima Centauri harboring habitable-zone exoplanet Proxima b.",
    imageSrc: getSpaceAsset("alpha-centauri").assetPath,
    glowColor: "rgba(255, 167, 38, 0.45)",
    accentColor: "#FFA726",
    actions: ["observe", "photo", "research", "visit"],
    spatialPosition: { x: 18, y: 68, scale: 0.38 },
  },
  {
    id: "milky-way",
    name: "MILKY WAY",
    subtitle: "Our Home Cosmic Metropolis",
    typeLabel: "Barred Spiral Galaxy",
    category: "galaxy",
    distanceValue: "0 LY (Inside)",
    distanceFromEarth: "Core: 26,670 Light Years",
    dayLengthOrRotation: "230M-Year Galactic Year",
    moonsOrStars: "100-400 Billion Stars",
    magnitude: "-6.5 mag",
    coordinates: "RA 17h 45m • DEC -29°00′",
    description:
      "Our home barred spiral galaxy featuring a central supermassive black hole Sagittarius A*, majestic Perseus & Scutum-Centaurus spiral arms, and dense interstellar dust rifts.",
    imageSrc: getSpaceAsset("milky-way").assetPath,
    glowColor: "rgba(112, 214, 255, 0.45)",
    accentColor: "#70D6FF",
    actions: ["observe", "photo", "research", "visit"],
    spatialPosition: { x: 82, y: 62, scale: 0.52 },
  },
];

