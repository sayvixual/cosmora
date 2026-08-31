/**
 * COSMORA — Deep Space Scientific Domain Data
 * 
 * High-fidelity astronomical ephemeris, physical dimensions, spectral characteristics,
 * multi-wavelength callouts, and scientific coordinates for curated deep space objects.
 */

export interface DeepSpaceCallout {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: { x: number; y: number }; // Percentage (0-100) on 2D image or 3D normalized position
  position3D?: [number, number, number];
  type: "core" | "star" | "nebula" | "cluster" | "exoplanet" | "structure";
  spectralData?: string;
  temperature?: string;
  distance?: string;
}

export interface DeepSpaceDomainObject {
  id: string;
  catalogId: string;
  name: string;
  subtitle: string;
  typeLabel: string;
  category: "galaxy" | "nebula" | "cluster" | "star" | "environment";
  renderingMode: "3d" | "2d" | "hybrid" | "environment";
  distanceValue: string;
  distanceLightYears: string;
  apparentMagnitude: string;
  constellation: string;
  rightAscension: string;
  declination: string;
  physicalSpan: string;
  estimatedMass: string;
  stellarCount: string;
  age: string;
  description: string;
  scientificContext: string;
  color: string;
  glowColor: string;
  accentColor: string;
  gltfModelUrl?: string;
  primaryImageUrl: string;
  secondaryImageUrl?: string;
  callouts: DeepSpaceCallout[];
  wavelengths: {
    visible: string;
    infrared?: string;
    ultraviolet?: string;
    radio?: string;
  };
  actions: ("observe" | "photo" | "research" | "visit")[];
}

export const DEEP_SPACE_OBJECTS: Record<string, DeepSpaceDomainObject> = {
  andromeda: {
    id: "andromeda",
    catalogId: "M31 / NGC 224",
    name: "ANDROMEDA GALAXY",
    subtitle: "Nearest Major Spiral Galaxy Neighbor",
    typeLabel: "Barred Spiral Galaxy (SA(s)b)",
    category: "galaxy",
    renderingMode: "3d",
    distanceValue: "2.54M LY",
    distanceLightYears: "2,537,000 Light-Years",
    apparentMagnitude: "+3.44 mag",
    constellation: "Andromeda",
    rightAscension: "00h 42m 44.3s",
    declination: "+41° 16′ 09″",
    physicalSpan: "220,000 Light-Years Diameter",
    estimatedMass: "1.5 × 10¹² Solar Masses",
    stellarCount: "≈ 1 Trillion Stars",
    age: "10.0 Billion Years",
    description:
      "A colossal barred spiral galaxy approaching the Milky Way at 110 km/s. It features a dense double nucleus harboring a supermassive black hole, extensive starburst rings, and companion dwarf galaxies M32 and M110.",
    scientificContext:
      "Spectroscopic observations reveal a central supermassive black hole of approximately 1.4 × 10⁸ solar masses and a massive stellar halo resulting from ancient accretion mergers.",
    color: "#BA68C8",
    glowColor: "rgba(186, 104, 200, 0.5)",
    accentColor: "#BA68C8",
    gltfModelUrl: "/images/deep-space/andromeda/scene.gltf",
    primaryImageUrl: "/images/deep-space/andromeda/textures/Andromeda_baseColor.png",
    callouts: [
      {
        id: "m31-core",
        title: "Supermassive Black Hole Nucleus",
        subtitle: "P1 / P2 Double Core",
        description: "A compact nuclear star cluster surrounding a 140-million-solar-mass black hole exhibiting relativistic velocity dispersions.",
        position: { x: 50, y: 50 },
        position3D: [0, 0, 0],
        type: "core",
        spectralData: "X-ray emission (Chandra source)",
        temperature: "10,000K (Disk)",
      },
      {
        id: "m31-arms",
        title: "10-kpc Starburst Ring & Dust Lanes",
        subtitle: "Active Star-Forming Ring",
        description: "Prominent ultraviolet ring of ionizing OB stellar associations and interstellar molecular clouds offset from the galactic center.",
        position: { x: 68, y: 35 },
        position3D: [2.2, 0.4, -0.8],
        type: "structure",
        spectralData: "H-Alpha & Far-IR 160μm",
      },
      {
        id: "m32-galaxy",
        title: "M32 (NGC 221) Companion",
        subtitle: "Compact Elliptical Satellite",
        description: "A rare compact elliptical dwarf galaxy that lost its outer spiral disk during a close pass through Andromeda's halo.",
        position: { x: 56, y: 68 },
        position3D: [1.1, -1.2, 0.5],
        type: "cluster",
        distance: "2.49M LY",
      },
      {
        id: "m110-galaxy",
        title: "M110 (NGC 205) Companion",
        subtitle: "Dwarf Spheroidal Galaxy",
        description: "The brightest satellite of Andromeda with unusual dust clouds and recent star formation near its center.",
        position: { x: 30, y: 32 },
        position3D: [-2.4, 1.4, 0.3],
        type: "cluster",
        distance: "2.69M LY",
      },
    ],
    wavelengths: {
      visible: "Optical broad-band showing yellowish old core and bluish young starburst arms",
      infrared: "Spitzer 24μm & 8μm mapping warm dust lanes in the 10-kpc ring",
      ultraviolet: "GALEX UV revealing massive newborn stellar nurseries",
      radio: "21cm HI neutral hydrogen velocity maps",
    },
    actions: ["observe", "photo", "research"],
  },

  "orion-nebula": {
    id: "orion-nebula",
    catalogId: "M42 / NGC 1976",
    name: "ORION NEBULA",
    subtitle: "Massive Stellar Nursery & Starburst Core",
    typeLabel: "Diffuse Emission-Reflection Nebula (H II Region)",
    category: "nebula",
    renderingMode: "3d",
    distanceValue: "1,344 LY",
    distanceLightYears: "1,344 ± 20 Light-Years",
    apparentMagnitude: "+4.0 mag",
    constellation: "Orion",
    rightAscension: "05h 35m 17.3s",
    declination: "-05° 23′ 28″",
    physicalSpan: "24 Light-Years Across",
    estimatedMass: "2,000 Solar Masses (Gas/Dust)",
    stellarCount: "≈ 2,800 Stars in Formation",
    age: "3.0 Million Years",
    description:
      "The closest massive star-forming factory to Earth. Ultraviolet radiation from the central Trapezium cluster sculpts soaring pillars of ionized hydrogen, shock fronts, and over 150 embryonic solar systems.",
    scientificContext:
      "M42 is the archetypal H II region. Photo-evaporating circumstellar protoplanetary disks (proplyds) directly validate solar nebula planetary formation models.",
    color: "#E91E63",
    glowColor: "rgba(233, 30, 99, 0.5)",
    accentColor: "#E91E63",
    primaryImageUrl: "/images/deep-space/orion-nebula/orion_nebula.jpg",
    secondaryImageUrl: "/images/deep-space/orion-nebula/hero_space_nebula.jpg",
    callouts: [
      {
        id: "trapezium",
        title: "Trapezium Star Cluster (θ1 Orionis)",
        subtitle: "Ionizing Stellar Engine",
        description: "Four massive, brilliant young stars (Theta-1 Orionis A, B, C, D) whose extreme UV flux ionizes the entire surrounding nebula.",
        position: { x: 52, y: 48 },
        position3D: [0.0, 0.2, 0.0],
        type: "star",
        spectralData: "O7V + B0.5V (Teff: 38,000K)",
        temperature: "38,000 K",
      },
      {
        id: "omc-1",
        title: "OMC-1 Molecular Cloud Core",
        subtitle: "Deep Protostellar Core",
        description: "An infrared-bright explosion center behind the visible nebula containing Becklin-Neugebauer object and Kleinmann-Low nebula.",
        position: { x: 44, y: 38 },
        position3D: [-1.8, 1.2, -0.6],
        type: "core",
        spectralData: "Sub-millimeter dust continuum",
      },
      {
        id: "proplyds",
        title: "Protoplanetary Disks (Proplyds)",
        subtitle: "Birthplaces of New Worlds",
        description: "Tear-drop shaped circumstellar disks orbiting newborn stars, undergoing photoevaporation from Trapezium stellar winds.",
        position: { x: 62, y: 55 },
        position3D: [1.9, -0.6, 0.4],
        type: "exoplanet",
        spectralData: "HST Optical [O III] 5007Å & Hα",
      },
      {
        id: "herbig-haro",
        title: "Herbig-Haro Shock Fronts",
        subtitle: "HH 203 & HH 204 Outflows",
        description: "Supersonic protostellar gas jets colliding with interstellar clouds at over 200 km/s, generating bow shocks.",
        position: { x: 34, y: 64 },
        position3D: [-1.4, -1.3, 0.5],
        type: "structure",
        spectralData: "Shock-excited [S II] & [N II]",
      },
    ],
    wavelengths: {
      visible: "Hydrogen-alpha (656.3nm red) and doubly ionized Oxygen [O III] (500.7nm turquoise)",
      infrared: "James Webb NIRCam revealing embedded protostars & brown dwarfs",
      radio: "ALMA sub-millimeter gas velocity maps",
    },
    actions: ["observe", "photo", "research"],
  },

  pleiades: {
    id: "pleiades",
    catalogId: "M45 / Melotte 22",
    name: "PLEIADES STAR CLUSTER",
    subtitle: "The Seven Sisters Reflection Nebula",
    typeLabel: "Open Star Cluster (Trumpler II,3,r)",
    category: "cluster",
    renderingMode: "3d",
    distanceValue: "444 LY",
    distanceLightYears: "444.2 ± 1.5 Light-Years",
    apparentMagnitude: "+1.6 mag",
    constellation: "Taurus",
    rightAscension: "03h 47m 24s",
    declination: "+24° 07′ 00″",
    physicalSpan: "17.5 Light-Years Core Radius",
    estimatedMass: "800 Solar Masses",
    stellarCount: "≈ 1,000 Confirmed Members",
    age: "115 Million Years",
    description:
      "A breathtaking cluster of luminous blue B-type stars drifting through an independent interstellar dust cloud, scattering intense blue starlight as a wispy reflection nebula.",
    scientificContext:
      "A primary cosmic distance ladder benchmark via Gaia astrometric parallaxes. The cluster contains numerous brown dwarfs constituting up to 25% of the total stellar population.",
    color: "#4B9EFF",
    glowColor: "rgba(75, 158, 255, 0.55)",
    accentColor: "#4B9EFF",
    primaryImageUrl: "/images/deep-space/pleiades/pleiades.jpg",
    callouts: [
      {
        id: "alcyone",
        title: "Alcyone (η Tauri)",
        subtitle: "Brightest Sister Star (Mag 2.87)",
        description: "A brilliant B7IIIe blue giant 2,400 times more luminous than our Sun, rotating at 215 km/s with an expansive circumstellar gas disk.",
        position: { x: 50, y: 52 },
        position3D: [0.15, 0.1, 0.0],
        type: "star",
        spectralData: "B7IIIe (Teff: 12,300K)",
        temperature: "12,300 K",
      },
      {
        id: "maia",
        title: "Maia (20 Tauri) & Nebula",
        subtitle: "Chemically Peculiar Blue Giant",
        description: "Surrounded by NGC 1432 (Maia Nebula), this B8III giant displays unique manganese and mercury spectral anomalies.",
        position: { x: 42, y: 36 },
        position3D: [-1.3, 1.3, 0.4],
        type: "star",
        spectralData: "B8III (Teff: 12,600K)",
        temperature: "12,600 K",
      },
      {
        id: "electra",
        title: "Electra (17 Tauri)",
        subtitle: "Rapid Rotator (170 km/s)",
        description: "A hot B6IIIe star emitting strong hydrogen emission lines, enveloped in filamentary blue dust sheets.",
        position: { x: 30, y: 44 },
        position3D: [-2.6, 0.35, -0.3],
        type: "star",
        spectralData: "B6IIIe (Teff: 13,480K)",
        temperature: "13,480 K",
      },
      {
        id: "merope",
        title: "Merope (23 Tauri) & Reflection Cloud",
        subtitle: "Barnard's Merope Nebula (IC 349)",
        description: "Passing through the densest part of the reflection cloud at 11 km/s, compressing interstellar dust particles by radiation pressure.",
        position: { x: 54, y: 65 },
        position3D: [0.55, -1.75, 0.35],
        type: "nebula",
        spectralData: "B6IVe (Teff: 14,000K)",
        temperature: "14,000 K",
      },
      {
        id: "atlas-pleione",
        title: "Atlas & Pleione (The Parents)",
        subtitle: "Double Star Anchor",
        description: "Atlas (triple star system) and Pleione (variable Be shell star experiencing periodic equatorial plasma ejections).",
        position: { x: 74, y: 48 },
        position3D: [2.4, -0.1, -0.3],
        type: "star",
        spectralData: "B8III + B8Vne",
      },
    ],
    wavelengths: {
      visible: "Rayleigh-scattered blue starlight reflecting off microscopic graphite & silicate grains",
      infrared: "WISE & Spitzer highlighting cool dust filaments heated by hot B-stars",
    },
    actions: ["observe", "photo", "research"],
  },

  "alpha-centauri": {
    id: "alpha-centauri",
    catalogId: "Rigil Kentaurus / HIP 71683",
    name: "ALPHA CENTAURI SYSTEM",
    subtitle: "Closest Multi-Star System & Exoplanet Gateway",
    typeLabel: "Triple Star System (G2V + K1V + M5.5Ve)",
    category: "star",
    renderingMode: "3d",
    distanceValue: "4.37 LY",
    distanceLightYears: "4.367 Light-Years (Proxima: 4.246 LY)",
    apparentMagnitude: "-0.27 mag (Combined)",
    constellation: "Centaurus",
    rightAscension: "14h 39m 36.5s",
    declination: "-60° 50′ 02″",
    physicalSpan: "A-B Separation: 11.2 - 35.6 AU",
    estimatedMass: "2.13 Solar Masses (Total)",
    stellarCount: "3 Gravitationally Bound Stars",
    age: "5.3 Billion Years (Older than Sun)",
    description:
      "Our closest stellar neighbors consisting of the sun-like binary pair Alpha Centauri A & B in an 80-year eccentric orbit, and the distant red dwarf Proxima Centauri hosting habitable-zone exoplanet Proxima b.",
    scientificContext:
      "The primary target for the Breakthrough Starshot mission aiming to launch laser-propelled nanocrafts at 20% light speed to photograph Proxima b within a 20-year flight window.",
    color: "#FFA726",
    glowColor: "rgba(255, 167, 38, 0.5)",
    accentColor: "#FFA726",
    primaryImageUrl: "/images/deep-space/alpha-centauri/alpha-centauri.jpg",
    callouts: [
      {
        id: "centauri-a",
        title: "Alpha Centauri A (Rigil Kentaurus)",
        subtitle: "Yellow Solar Twin (G2V)",
        description: "1.10 times the mass and 1.52 times the luminosity of our Sun, with nearly identical surface temperature (5,790 K).",
        position: { x: 44, y: 48 },
        position3D: [-1.4, 0.0, 0.0],
        type: "star",
        spectralData: "G2V (Teff: 5,790K • 1.22 R☉)",
        temperature: "5,790 K",
      },
      {
        id: "centauri-b",
        title: "Alpha Centauri B (Toliman)",
        subtitle: "Orange K-Dwarf (K1V)",
        description: "0.91 solar masses and 0.50 solar luminosity. Its habitable zone orbits between 0.70 and 0.75 AU.",
        position: { x: 58, y: 46 },
        position3D: [1.4, 0.0, 0.0],
        type: "star",
        spectralData: "K1V (Teff: 5,260K • 0.86 R☉)",
        temperature: "5,260 K",
      },
      {
        id: "proxima-cen",
        title: "Proxima Centauri (Alpha Cen C)",
        subtitle: "Closest Known Star (4.246 LY)",
        description: "A flare red dwarf 0.24 LY from the main pair, orbiting with a 550,000-year period.",
        position: { x: 80, y: 25 },
        position3D: [4.8, 1.2, -1.2],
        type: "star",
        spectralData: "M5.5Ve Flare Star",
        temperature: "3,042 K",
      },
      {
        id: "proxima-b",
        title: "Proxima Centauri b (Exoplanet)",
        subtitle: "Habitable-Zone Terrestrial World",
        description: "A rocky planet with minimum mass of 1.17 M⊕ orbiting inside the liquid-water habitable zone every 11.2 Earth days.",
        position: { x: 82, y: 28 },
        position3D: [5.15, 1.35, -1.1],
        type: "exoplanet",
        distance: "4.246 LY",
        spectralData: "Radial Velocity Discovery (ESPRESSO/VLT)",
      },
    ],
    wavelengths: {
      visible: "Stellar photometry & high-contrast coronagraphic imaging",
      infrared: "VLT NEAR mid-infrared thermal habitable zone imaging",
      radio: "ALMA sub-millimeter stellar corona emission",
    },
    actions: ["observe", "photo", "research", "visit"],
  },

  "milky-way": {
    id: "milky-way",
    catalogId: "Our Home Galaxy / Sagittarius A*",
    name: "MILKY WAY GALAXY",
    subtitle: "Galactic Core, Spiral Arms & Skysphere",
    typeLabel: "Barred Spiral Galaxy (SBbc)",
    category: "galaxy",
    renderingMode: "environment",
    distanceValue: "0 LY (Inside)",
    distanceLightYears: "Core: 26,673 Light-Years",
    apparentMagnitude: "-6.5 mag (Integrated)",
    constellation: "Sagittarius (Galactic Center)",
    rightAscension: "17h 45m 40.0s",
    declination: "-29° 00′ 28″",
    physicalSpan: "100,000 Light-Years Diameter",
    estimatedMass: "1.15 × 10¹² Solar Masses",
    stellarCount: "100 - 400 Billion Stars",
    age: "13.6 Billion Years",
    description:
      "Our cosmic metropolis featuring a central stellar bar, four major spiral arms, dense interstellar dust lanes, and the supermassive black hole Sagittarius A* anchor.",
    scientificContext:
      "Our Solar System orbits the galactic center at 230 km/s on the inner edge of the Orion-Cygnus Spur, completing one Galactic Year every 230 million years.",
    color: "#70D6FF",
    glowColor: "rgba(112, 214, 255, 0.5)",
    accentColor: "#70D6FF",
    gltfModelUrl: "/images/deep-space/milky_way/scene.gltf",
    primaryImageUrl: "/images/deep-space/milky_way/textures/milky_way.001_baseColor.png",
    callouts: [
      {
        id: "sagittarius-a",
        title: "Sagittarius A* (Sgr A*)",
        subtitle: "Supermassive Black Hole Core",
        description: "4.15 million solar masses confined within a 12-million-km event horizon, imaged directly by the Event Horizon Telescope.",
        position: { x: 50, y: 50 },
        position3D: [0, 0, 0],
        type: "core",
        spectralData: "Sub-millimeter synchrotron ring at 230 GHz",
      },
      {
        id: "solar-position",
        title: "Solar System (You Are Here)",
        subtitle: "Orion-Cygnus Local Spur",
        description: "Situated 26,670 light-years from the galactic core, 55 light-years above the galactic plane, orbiting at 828,000 km/h.",
        position: { x: 42, y: 64 },
        position3D: [-1.8, 0.2, 1.2],
        type: "exoplanet",
        distance: "0 Light-Years",
      },
      {
        id: "perseus-arm",
        title: "Perseus Spiral Arm",
        subtitle: "Major Outer Star-Forming Arm",
        description: "One of the two major spiral arms of the Milky Way, rich in young stellar clusters and molecular gas complexes.",
        position: { x: 30, y: 72 },
        position3D: [-2.6, 0.1, 2.0],
        type: "structure",
      },
      {
        id: "fermi-bubbles",
        title: "Fermi Gamma-Ray Bubbles",
        subtitle: "Giant Galactic Outflows",
        description: "Two colossal plasma lobes extending 25,000 light-years above and below the galactic plane, produced by past black hole jet activity.",
        position: { x: 50, y: 22 },
        position3D: [0, 2.5, 0],
        type: "structure",
        spectralData: "GeV-TeV Gamma Ray emission",
      },
    ],
    wavelengths: {
      visible: "Optical panorama mapping dark interstellar dust rifts obscuring the galactic center",
      infrared: "2MASS & Spitzer penetrating dust to reveal the dense central bar & stellar bulge",
      radio: "EHT 1.3mm shadow imaging of Sgr A*",
    },
    actions: ["observe", "photo", "research", "visit"],
  },
};

export function getDeepSpaceObject(id: string): DeepSpaceDomainObject | null {
  const normalizedId = id.toLowerCase().replace("_", "-");
  return DEEP_SPACE_OBJECTS[normalizedId] || DEEP_SPACE_OBJECTS[id] || null;
}

export function getAllDeepSpaceObjectsList(): DeepSpaceDomainObject[] {
  return Object.values(DEEP_SPACE_OBJECTS);
}
