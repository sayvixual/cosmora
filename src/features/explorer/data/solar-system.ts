/**
 * COSMORA — Solar System Domain Data
 * 
 * Scientific domain dataset containing authoritative planetary and celestial values.
 * All metrics include provenance metadata documenting provider, retrieval date, and source URL.
 */

export interface ProvenanceMetadata {
  provider: string;
  sourceUrl: string;
  retrievedAt: string;
  catalogId?: string;
}

export interface CelestialObjectDomain {
  id: string;
  name: string;
  arabicName: string; // from source model "المجموعة الشمسية"
  solId: string;
  type: "star" | "planet" | "moon";
  classification: string;
  
  // Physical and orbital properties (Scientific)
  distanceKm: string;
  distanceAU: number;
  diameterKm: string;
  diameterRatioToEarth: number;
  rotationPeriod: string;
  orbitPeriod: string;
  surfaceTemp: string;
  moonsCount: number;
  moonsList?: string[];
  axialTiltDeg: number;
  massKg: string;
  surfaceGravityMs2: string;
  atmosphereComposition: string[];
  
  // Editorial summary
  description: string;
  scientificContext: string;
  keyFeatures: string[];
  
  // Provenance
  provenance: ProvenanceMetadata;
}

export const SOLAR_SYSTEM_DOMAIN_DATA: Record<string, CelestialObjectDomain> = {
  sun: {
    id: "sun",
    name: "The Sun",
    arabicName: "الشمس",
    solId: "SOL-0",
    type: "star",
    classification: "Yellow Dwarf • G-Type Main Sequence (G2V)",
    distanceKm: "0 km (Center)",
    distanceAU: 0.0,
    diameterKm: "1.39M km",
    diameterRatioToEarth: 109.2,
    rotationPeriod: "25 - 35 Earth Days",
    orbitPeriod: "230M Years (Galactic Center)",
    surfaceTemp: "5,500°C (Core: 15,000,000°C)",
    moonsCount: 8, // 8 major planets in primary orbit
    moonsList: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    axialTiltDeg: 7.25,
    massKg: "1.989 × 10³⁰ kg (99.86% Solar System mass)",
    surfaceGravityMs2: "274.0 m/s²",
    atmosphereComposition: ["73.46% Hydrogen", "24.85% Helium", "0.77% Oxygen", "0.29% Carbon"],
    description: "The gravitational and energetic powerhouse at the heart of our Solar System, fusing 600 million tons of hydrogen into helium every second.",
    scientificContext: "Formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.",
    keyFeatures: ["Thermonuclear Fusion Core", "Dynamic Corona & Solar Wind", "11-Year Solar Cycle"],
    provenance: {
      provider: "NASA Goddard Space Flight Center / NASA Solar Physics",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-SUN-2026",
    },
  },
  mercury: {
    id: "mercury",
    name: "Mercury",
    arabicName: "عطارد",
    solId: "SOL-1",
    type: "planet",
    classification: "Terrestrial Silicate World • Airless",
    distanceKm: "57.9M km",
    distanceAU: 0.39,
    diameterKm: "4.88K km",
    diameterRatioToEarth: 0.383,
    rotationPeriod: "58.65 Earth Days",
    orbitPeriod: "87.97 Earth Days",
    surfaceTemp: "-180°C to 430°C",
    moonsCount: 0,
    axialTiltDeg: 0.034,
    massKg: "3.301 × 10²³ kg",
    surfaceGravityMs2: "3.7 m/s²",
    atmosphereComposition: ["Trace Exosphere (Oxygen, Sodium, Hydrogen, Helium, Potassium)"],
    description: "The smallest planet in the Solar System and closest to the Sun, featuring extreme day-night thermal swings and heavily cratered terrain.",
    scientificContext: "Possesses a disproportionately large metallic iron core occupying ~85% of its planetary radius.",
    keyFeatures: ["Caloris Basin Impact", "3:2 Spin-Orbit Resonance", "High-Density Iron Core"],
    provenance: {
      provider: "NASA Planetary Data System / JPL",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-MERCURY-2026",
    },
  },
  venus: {
    id: "venus",
    name: "Venus",
    arabicName: "الزهرة",
    solId: "SOL-2",
    type: "planet",
    classification: "Super-Rotational Terrestrial • Runaway Greenhouse",
    distanceKm: "108.2M km",
    distanceAU: 0.72,
    diameterKm: "12.1K km",
    diameterRatioToEarth: 0.949,
    rotationPeriod: "243.02 Earth Days (Retrograde)",
    orbitPeriod: "224.70 Earth Days",
    surfaceTemp: "465°C (Uniform)",
    moonsCount: 0,
    axialTiltDeg: 177.36,
    massKg: "4.867 × 10²⁴ kg",
    surfaceGravityMs2: "8.87 m/s²",
    atmosphereComposition: ["96.5% Carbon Dioxide", "3.5% Nitrogen", "0.015% Sulfur Dioxide"],
    description: "Earth's sister planet in size, enveloped in dense sulfuric acid clouds that trigger a runaway greenhouse effect making it the hottest planet in the Solar System.",
    scientificContext: "Surface atmospheric pressure reaches 92 bar (~90x Earth sea level), comparable to 900m deep ocean pressure.",
    keyFeatures: ["Runaway Greenhouse", "Retrograde Axial Rotation", "Volcanic Basalt Plains"],
    provenance: {
      provider: "NASA Planetary Data System / Magellan Mission Data",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-VENUS-2026",
    },
  },
  earth: {
    id: "earth",
    name: "Earth",
    arabicName: "الأرض",
    solId: "SOL-3",
    type: "planet",
    classification: "Habitable Terrestrial • Dynamic Biosphere",
    distanceKm: "149.6M km",
    distanceAU: 1.0,
    diameterKm: "12.7K km",
    diameterRatioToEarth: 1.0,
    rotationPeriod: "23h 56m 04s",
    orbitPeriod: "365.256 Earth Days",
    surfaceTemp: "-89°C to 58°C (Mean: 15°C)",
    moonsCount: 1,
    moonsList: ["Moon (Luna)"],
    axialTiltDeg: 23.44,
    massKg: "5.972 × 10²⁴ kg",
    surfaceGravityMs2: "9.807 m/s²",
    atmosphereComposition: ["78.08% Nitrogen", "20.95% Oxygen", "0.93% Argon", "0.04% Carbon Dioxide"],
    description: "Our home planet: the only known celestial harbor of life, characterized by vast liquid water oceans, active plate tectonics, and a protective magnetosphere.",
    scientificContext: "Maintains a stable climate via the carbonate-silicate cycle and a protective magnetic dynamo generated in its liquid iron outer core.",
    keyFeatures: ["Liquid Hydrosphere (71%)", "Active Plate Tectonics", "Complex Multicellular Biosphere"],
    provenance: {
      provider: "NASA Goddard Institute for Space Studies / JPL",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-EARTH-2026",
    },
  },
  moon: {
    id: "moon",
    name: "The Moon",
    arabicName: "القمر",
    solId: "SOL-3A",
    type: "moon",
    classification: "Major Natural Satellite • Tidally Locked",
    distanceKm: "384.4K km (Earth)",
    distanceAU: 1.0,
    diameterKm: "3.47K km",
    diameterRatioToEarth: 0.272,
    rotationPeriod: "27.32 Earth Days (Synchronous)",
    orbitPeriod: "27.32 Earth Days (around Earth)",
    surfaceTemp: "-130°C to 120°C",
    moonsCount: 0,
    axialTiltDeg: 1.54,
    massKg: "7.342 × 10²² kg",
    surfaceGravityMs2: "1.62 m/s² (1/6th Earth)",
    atmosphereComposition: ["Trace Exosphere (Argon, Helium, Neon, Sodium, Potassium)"],
    description: "Earth's sole natural satellite, formed from a giant impact 4.5 billion years ago, stabilizing Earth's axial tilt and governing oceanic tidal rhythms.",
    scientificContext: "Tidally locked in a 1:1 synchronous resonance with Earth, causing the same lunar hemisphere to always face our planet.",
    keyFeatures: ["Lunar Maria Basalt Plains", "South Pole-Aitken Basin", "Regolith Surface & Ice in Permanently Shadowed Craters"],
    provenance: {
      provider: "NASA Lunar Reconnaissance Orbiter (LRO) / NSSDC",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-MOON-2026",
    },
  },
  mars: {
    id: "mars",
    name: "Mars",
    arabicName: "المريخ",
    solId: "SOL-4",
    type: "planet",
    classification: "Desert Terrestrial • Oxidized Iron Crust",
    distanceKm: "227.9M km",
    distanceAU: 1.524,
    diameterKm: "6.78K km",
    diameterRatioToEarth: 0.532,
    rotationPeriod: "24h 37m 22s (1 Sol)",
    orbitPeriod: "686.98 Earth Days (1.88 Years)",
    surfaceTemp: "-140°C to 20°C (Mean: -63°C)",
    moonsCount: 2,
    moonsList: ["Phobos", "Deimos"],
    axialTiltDeg: 25.19,
    massKg: "6.417 × 10²³ kg",
    surfaceGravityMs2: "3.721 m/s² (38% Earth)",
    atmosphereComposition: ["95.32% Carbon Dioxide", "2.6% Nitrogen", "1.9% Argon", "0.13% Oxygen"],
    description: "The Red Planet: a dry desert world preserving ancient river valleys, polar water-ice caps, the tallest volcano in the solar system (Olympus Mons), and grand canyon systems (Valles Marineris).",
    scientificContext: "Primary target for astrobiological exploration investigating ancient habitable lacustrine environments.",
    keyFeatures: ["Olympus Mons (21.9 km height)", "Valles Marineris (4,000 km length)", "Subsurface Water Glaciers"],
    provenance: {
      provider: "NASA Mars Exploration Program / JPL Horizons",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-MARS-2026",
    },
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter",
    arabicName: "المشتري",
    solId: "SOL-5",
    type: "planet",
    classification: "Gas Giant • Jovian Primary",
    distanceKm: "778.6M km",
    distanceAU: 5.204,
    diameterKm: "139.8K km",
    diameterRatioToEarth: 10.97,
    rotationPeriod: "9h 55m 30s",
    orbitPeriod: "11.86 Earth Years",
    surfaceTemp: "-110°C (1 bar atmospheric level)",
    moonsCount: 95,
    moonsList: ["Io", "Europa", "Ganymede", "Callisto", "+91 satellites"],
    axialTiltDeg: 3.13,
    massKg: "1.898 × 10²⁷ kg (317.8x Earth)",
    surfaceGravityMs2: "24.79 m/s²",
    atmosphereComposition: ["89.8% Hydrogen (H₂)", "10.2% Helium", "Trace Methane, Ammonia, Water vapor"],
    description: "The largest planet in our Solar System with over twice the mass of all other planets combined, famous for its Great Red Spot storm and miniature solar system of 95 moons.",
    scientificContext: "Generates an immense magnetosphere extending millions of kilometers, housing ocean worlds like Europa and Ganymede.",
    keyFeatures: ["Great Red Spot (300+ yr anticyclone)", "Galilean Moons Subsurface Oceans", "Metallic Hydrogen Core Layer"],
    provenance: {
      provider: "NASA Juno Mission / JPL Planetary Data",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-JUPITER-2026",
    },
  },
  saturn: {
    id: "saturn",
    name: "Saturn",
    arabicName: "زحل",
    solId: "SOL-6",
    type: "planet",
    classification: "Ringed Gas Giant • Low Density Jovian",
    distanceKm: "1.43B km",
    distanceAU: 9.582,
    diameterKm: "116.5K km",
    diameterRatioToEarth: 9.14,
    rotationPeriod: "10h 33m 38s",
    orbitPeriod: "29.45 Earth Years",
    surfaceTemp: "-140°C (1 bar atmospheric level)",
    moonsCount: 146,
    moonsList: ["Titan", "Enceladus", "Mimas", "Iapetus", "Rhea", "+141 satellites"],
    axialTiltDeg: 26.73,
    massKg: "5.683 × 10²⁶ kg (95.2x Earth)",
    surfaceGravityMs2: "10.44 m/s²",
    atmosphereComposition: ["96.3% Hydrogen (H₂)", "3.25% Helium", "0.45% Methane"],
    description: "Adorned with the most extensive and visually spectacular ring system of any planet, composed of billions of water ice chunks ranging from micrometers to meters across.",
    scientificContext: "The only planet in the Solar System less dense than water (0.687 g/cm³). Home to Titan (dense atmosphere) and Enceladus (cryovolcanic ocean plumes).",
    keyFeatures: ["Grand Ring System (A, B, C, D, E rings)", "North Polar Hexagonal Storm", "Enceladus Active Cryovolcanoes"],
    provenance: {
      provider: "NASA Cassini-Huygens Mission / JPL",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-SATURN-2026",
    },
  },
  uranus: {
    id: "uranus",
    name: "Uranus",
    arabicName: "أورانوس",
    solId: "SOL-7",
    type: "planet",
    classification: "Ice Giant • Extreme Axial Obliquity",
    distanceKm: "2.87B km",
    distanceAU: 19.19,
    diameterKm: "50.7K km",
    diameterRatioToEarth: 3.98,
    rotationPeriod: "17h 14m 24s (Retrograde)",
    orbitPeriod: "84.02 Earth Years",
    surfaceTemp: "-195°C (Coldest: -224°C)",
    moonsCount: 28,
    moonsList: ["Titania", "Oberon", "Umbriel", "Ariel", "Miranda", "+23 satellites"],
    axialTiltDeg: 97.77,
    massKg: "8.681 × 10²⁵ kg (14.5x Earth)",
    surfaceGravityMs2: "8.69 m/s²",
    atmosphereComposition: ["82.5% Hydrogen", "15.2% Helium", "2.3% Methane"],
    description: "An ice giant composed of water, ammonia, and methane ices, famously tilted almost entirely on its side (97.8°) with pale cyan upper clouds.",
    scientificContext: "Its extreme axial tilt produces extreme 42-year long polar seasons where each pole experiences 42 years of continuous sunlight followed by 42 years of darkness.",
    keyFeatures: ["97.8° Axial Obliquity", "13 Narrow Dark Planetary Rings", "Coldest Planetary Atmosphere in Solar System"],
    provenance: {
      provider: "NASA Voyager 2 Data / Space Telescope Science Institute",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-URANUS-2026",
    },
  },
  neptune: {
    id: "neptune",
    name: "Neptune",
    arabicName: "نبتون",
    solId: "SOL-8",
    type: "planet",
    classification: "Ice Giant • Supersonic Wind Dynamics",
    distanceKm: "4.5B km",
    distanceAU: 30.07,
    diameterKm: "49.2K km",
    diameterRatioToEarth: 3.86,
    rotationPeriod: "16h 06m 36s",
    orbitPeriod: "164.79 Earth Years",
    surfaceTemp: "-200°C",
    moonsCount: 16,
    moonsList: ["Triton", "Proteus", "Nereid", "+13 satellites"],
    axialTiltDeg: 28.32,
    massKg: "1.024 × 10²⁶ kg (17.1x Earth)",
    surfaceGravityMs2: "11.15 m/s²",
    atmosphereComposition: ["80.0% Hydrogen", "19.0% Helium", "1.5% Methane"],
    description: "The outermost major planet: a vivid deep azure ice giant driven by supersonic planetary winds exceeding 2,100 km/h and host to the retrograde geyser moon Triton.",
    scientificContext: "First planet located through mathematical prediction rather than empirical telescope searching by Le Verrier and Adams.",
    keyFeatures: ["Supersonic Atmospheric Jets (2,100 km/h)", "Great Dark Spot Storms", "Triton Retrograde Kuiper Belt Capture"],
    provenance: {
      provider: "NASA Voyager 2 Data / Hubble Space Telescope",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html",
      retrievedAt: "2026-08",
      catalogId: "NASA-NSSDC-NEPTUNE-2026",
    },
  },
};

export const CELESTIAL_OBJECT_ORDER: string[] = [
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
