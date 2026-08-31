import { AIMessage, EphemerisHighlight, ObservationCartItem, TargetType } from "../types";

export interface AIResponseData {
  summary: string;
  highlights: EphemerisHighlight[];
  recommendations: string[];
  suggestedPrompts: string[];
  actionType?: "observe" | "photo" | "research" | "visit";
  sourceDataset: string;
  cartItem?: Omit<ObservationCartItem, "id" | "addedAt">;
}

export const INITIAL_OBSERVATION_CART: ObservationCartItem[] = [
  {
    id: "cart_saturn_opposition",
    targetName: "Saturn & Ring System",
    targetType: "planet",
    windowTime: "19:50 – 02:40 UTC",
    magnitude: "+0.6 mag",
    coordinates: { ra: "22h 45m 12s", dec: "-09° 15' 20\"" },
    bestInstrument: "90mm+ Refractor or 8\" Dobsonian",
    opticsFilter: "#80A Blue Filter / Polarizing Filter",
    altitude: "48° Elevation",
    notes: "Resolve Cassini Division and Encke Gap. Optimal seeing after local midnight.",
    addedAt: "2026-08-29 14:00",
    completed: false
  },
  {
    id: "cart_perseids_radiant",
    targetName: "Perseid Meteor Shower Peak",
    targetType: "meteor",
    windowTime: "22:00 – Dawn (Peak)",
    magnitude: "ZHR ~100 meteors/hr",
    coordinates: { ra: "03h 04m 00s", dec: "+58° 00' 00\"" },
    bestInstrument: "Naked Eye / 14mm f/1.8 Ultra-Wide Lens",
    opticsFilter: "Baader Clear Focusing Filter",
    altitude: "65° Radiant Zenith",
    notes: "Bortle 1-2 dark sky site recommended for maximum ionization train visibility.",
    addedAt: "2026-08-29 14:05",
    completed: false
  }
];

export const TARGET_PRESETS = [
  { id: "mars", name: "Mars", type: "planet" as TargetType, symbol: "♂" },
  { id: "jupiter", name: "Jupiter", type: "planet" as TargetType, symbol: "♃" },
  { id: "saturn", name: "Saturn", type: "planet" as TargetType, symbol: "♄" },
  { id: "moon", name: "Moon", type: "moon" as TargetType, symbol: "☾" },
  { id: "orion", name: "Orion Nebula (M42)", type: "nebula" as TargetType, symbol: "✦" },
  { id: "pleiades", name: "Pleiades Cluster (M45)", type: "star-cluster" as TargetType, symbol: "✧" },
  { id: "andromeda", name: "Andromeda Galaxy (M31)", type: "galaxy" as TargetType, symbol: "⊛" },
  { id: "jwst", name: "James Webb Telescope", type: "spacecraft" as TargetType, symbol: "🛰" },
  { id: "voyager1", name: "Voyager 1 Interstellar", type: "spacecraft" as TargetType, symbol: "🛸" },
];

export const PROMPT_CATEGORIES = [
  {
    category: "tonight",
    label: "Tonight's Ephemeris",
    prompts: [
      "What can I observe tonight with naked eye and binoculars?",
      "When is the best observation window for Jupiter and Saturn?",
      "Calculate current Moon phase and its impact on deep-sky targets.",
      "Show highest altitude targets currently transiting the meridian."
    ]
  },
  {
    category: "astrophotography",
    label: "Astrophotography Rig",
    prompts: [
      "What camera settings (ISO, exposure, f-stop) for Perseids meteor shower?",
      "How to shoot high-resolution planetary images of Mars with Barlow 2x?",
      "Explain multi-frame lucky imaging and stacking for planetary detail.",
      "Which narrowband filter (H-Alpha / OIII) is best for Orion Nebula?"
    ]
  },
  {
    category: "science",
    label: "Astrophysics & Geology",
    prompts: [
      "Why is Mars red and what causes its intense global dust storms?",
      "Explain the composition and ring dynamics of Saturn's Cassini Division.",
      "How did Olympus Mons grow three times taller than Mount Everest?",
      "What atmospheric gases create the vivid colors in Jupiter's Great Red Spot?"
    ]
  },
  {
    category: "deep-space",
    label: "Deep Space & Stars",
    prompts: [
      "Tell me about the star nursery inside the Orion Nebula (M42).",
      "How far is the Andromeda Galaxy (M31) and when will it collide with Milky Way?",
      "Why do the Pleiades (Seven Sisters) emit a blue reflection glow?",
      "What are the best dark-sky sites worldwide for astrotourism?"
    ]
  },
  {
    category: "missions",
    label: "Space Exploration",
    prompts: [
      "What are James Webb's deepest infrared cosmological discoveries?",
      "Where is Voyager 1 right now and how does it transmit telemetry?",
      "What robotic missions are currently active on the Martian surface?",
      "Explain the Artemis program architecture for Lunar base camp."
    ]
  }
];

export function generateAIResponse(query: string, activeTarget: string = "Mars"): AIResponseData {
  const lower = query.toLowerCase();

  // 1. ASTROPHOTOGRAPHY
  if (lower.includes("photograph") || lower.includes("photo") || lower.includes("camera") || lower.includes("iso") || lower.includes("exposure") || lower.includes("stack")) {
    return {
      summary: `High-resolution Astrophotography Protocol for ${activeTarget}: Optimal imaging requires high-cadence lucky imaging to beat atmospheric turbulence, paired with focal amplification and appropriate chromatic filtering.`,
      highlights: [
        {
          name: `${activeTarget} Focal Ratio`,
          targetType: "planet",
          window: "Optimal at f/15 to f/25",
          magnitude: "2x - 3x Barlow Lens",
          bestInstrument: "ZWO Planetary CMOS or DSLR with 1:1 Pixel Crop",
          altitude: "> 40° above horizon",
          filterRecommendation: "IR-Cut / Baader Contrast Booster",
          coordinates: { ra: "05h 35m 17s", dec: "-05° 23' 28\"" }
        },
        {
          name: "Sensor Exposure Timing",
          targetType: "deep-space",
          window: "10ms – 30ms / frame",
          magnitude: "Gain: ISO 800 - 1600",
          bestInstrument: "High FPS USB3.0 Sensor",
          filterRecommendation: "Atmospheric Dispersion Corrector (ADC)"
        },
        {
          name: "Stacking & Processing Pipeline",
          targetType: "planet",
          window: "3,000 – 10,000 frames captured",
          magnitude: "Best 15% stacked in AutoStakkert!4",
          bestInstrument: "RegiStax Wavelet Sharpening + Siril",
          filterRecommendation: "Dark & Flat Calibration Frames"
        }
      ],
      recommendations: [
        "Wait for culmination (transit above 45° altitude) to reduce atmospheric refraction and chromatic blur.",
        "Ensure telescope optics reach thermal equilibrium with ambient nighttime air (cool-down time ~45 mins).",
        "Use an electronic focuser with Bahtinov mask on adjacent magnitude 2 reference stars."
      ],
      suggestedPrompts: [
        `What telescope mount is required for ${activeTarget}?`,
        "How do I use an Atmospheric Dispersion Corrector (ADC)?",
        "What is the difference between narrowband H-Alpha and broadband filters?"
      ],
      actionType: "photo",
      sourceDataset: "IAU Working Group on Cartographic Coordinates & Optical Astrophotography Standards",
      cartItem: {
        targetName: `${activeTarget} Astrophotography Session`,
        targetType: "planet",
        windowTime: "Midnight – 04:00 UTC",
        magnitude: "High Res Planetary",
        coordinates: { ra: "05h 35m 17s", dec: "-05° 23' 28\"" },
        bestInstrument: "8\"-11\" SCT + 2x Barlow + ZWO ASI224MC",
        opticsFilter: "UV/IR Cut + #25 Red Filter",
        altitude: "52° Elevation",
        notes: "Targeting lucky imaging multi-frame capture with 5000 frames.",
        completed: false
      }
    };
  }

  // 2. SATURN SPECIFIC
  if (lower.includes("saturn") || lower.includes("ring") || lower.includes("cassini") || lower.includes("titan")) {
    return {
      summary: "Saturn Ephemeris & Ring System: Currently presenting prime observational opportunities. The Cassini Division and Encke Gap in the A-ring are resolvable in steady seeing conditions with apertures ≥90mm.",
      highlights: [
        {
          name: "Saturn Disc & Rings",
          targetType: "planet",
          window: "19:50 – 02:40 UTC",
          magnitude: "+0.6 mag",
          bestInstrument: "90mm - 200mm Telescope (150x - 300x)",
          altitude: "48° S-SE",
          coordinates: { ra: "22h 45m 12s", dec: "-09° 15' 20\"" },
          filterRecommendation: "#80A Light Blue (enhances ring contrast)"
        },
        {
          name: "Titan & Galilean-Class Moons",
          targetType: "moon",
          window: "Visible all night",
          magnitude: "+8.4 mag (Titan)",
          bestInstrument: "70mm+ Binoculars / Refractor",
          filterRecommendation: "Clear / Polarizing"
        },
        {
          name: "Cassini Division (4,800 km gap)",
          targetType: "planet",
          window: "Best at Transit (22:15 UTC)",
          magnitude: "0.6 arcsec width",
          bestInstrument: "150mm+ Newtonian / SCT",
          filterRecommendation: "Yellow-Green #11"
        }
      ],
      recommendations: [
        "Use medium-high magnification (180x-250x) with an Orthoscopic or Plössl eyepiece.",
        "Look for the shadow of the planetary globe cast across the rear rings.",
        "Observe during Bortle 1-4 sky for subtle pastel atmospheric cloud bands on the northern hemisphere."
      ],
      suggestedPrompts: [
        "How thick are Saturn's rings?",
        "Can Titan's atmosphere be detected visually?",
        "What causes the hexagon storm on Saturn's north pole?"
      ],
      actionType: "observe",
      sourceDataset: "NASA JPL HORIZONS System & Ephemerides DE440",
      cartItem: {
        targetName: "Saturn & Ring System",
        targetType: "planet",
        windowTime: "19:50 – 02:40 UTC",
        magnitude: "+0.6 mag",
        coordinates: { ra: "22h 45m 12s", dec: "-09° 15' 20\"" },
        bestInstrument: "90mm+ Refractor or 8\" Dobsonian",
        opticsFilter: "#80A Blue Filter / Polarizing Filter",
        altitude: "48° Elevation",
        notes: "Resolve Cassini Division and Encke Gap. Optimal seeing after local midnight.",
        completed: false
      }
    };
  }

  // 3. JUPITER SPECIFIC
  if (lower.includes("jupiter") || lower.includes("great red spot") || lower.includes("grs") || lower.includes("galilean") || lower.includes("europa") || lower.includes("ganymede") || lower.includes("io")) {
    return {
      summary: "Jupiter Ephemeris & Great Red Spot Transit: Jupiter dominates the night sky as a brilliant beacon at magnitude -2.4. Four Galilean moons (Io, Europa, Ganymede, Callisto) are in dynamic orbital motion.",
      highlights: [
        {
          name: "Jupiter Planetary Disc",
          targetType: "planet",
          window: "21:15 – 03:10 UTC",
          magnitude: "-2.4 mag (Ultra Bright)",
          bestInstrument: "Binoculars (moons) / 100mm+ Scope (bands)",
          altitude: "62° Zenith Meridian",
          coordinates: { ra: "03h 12m 44s", dec: "+16° 45' 10\"" },
          filterRecommendation: "#80A Blue (Great Red Spot) or #21 Orange"
        },
        {
          name: "Great Red Spot (GRS) Transit",
          targetType: "planet",
          window: "Central Meridian at 23:45 UTC",
          magnitude: "16,000 km diameter",
          bestInstrument: "120mm+ Refractor / 8\" Dobsonian",
          filterRecommendation: "#56 Light Green Filter"
        },
        {
          name: "Galilean Moons Shadow Transit",
          targetType: "moon",
          window: "Io Shadow Transit 01:10 UTC",
          magnitude: "High Contrast Inky Black Shadow",
          bestInstrument: "100mm+ Telescope",
          filterRecommendation: "Broadband contrast booster"
        }
      ],
      recommendations: [
        "A 7x50 binocular reveals all 4 Galilean moons as needle-sharp points of light.",
        "Use high magnification (150x-220x) to witness turbulent festoons in the Equatorial Zone.",
        "Record moon shadow transit times to replicate Ole Rømer's 1676 measurement of the speed of light."
      ],
      suggestedPrompts: [
        "What causes Jupiter's Great Red Spot color?",
        "When is the next double moon shadow transit?",
        "How do gravitational tidal forces heat Io's volcanoes?"
      ],
      actionType: "observe",
      sourceDataset: "IAU Minor Planet Center & NASA JPL Horizons Planetary Telemetry",
      cartItem: {
        targetName: "Jupiter & GRS Transit",
        targetType: "planet",
        windowTime: "21:15 – 03:10 UTC",
        magnitude: "-2.4 mag",
        coordinates: { ra: "03h 12m 44s", dec: "+16° 45' 10\"" },
        bestInstrument: "100mm Refractor or 8\" Dobsonian",
        opticsFilter: "#80A Blue / #21 Orange Filter",
        altitude: "62° Elevation",
        notes: "Great Red Spot central meridian transit at 23:45 UTC with Io shadow transit.",
        completed: false
      }
    };
  }

  // 4. MARS SPECIFIC & WHY RED
  if (lower.includes("mars") || lower.includes("red") || lower.includes("olympus") || lower.includes("valles") || lower.includes("dust")) {
    return {
      summary: "Mars Telemetry & Geological Composition: Mars exhibits its fiery rust-red hue because its surface is saturated with iron(III) oxide (hematite and magnetite). The planet features solar-system records like Olympus Mons (21.9 km height) and Valles Marineris (4,000 km canyon).",
      highlights: [
        {
          name: "Mars Opposition Window",
          targetType: "planet",
          window: "01:20 – 05:40 UTC",
          magnitude: "-0.8 mag (Brilliant Ochre)",
          bestInstrument: "100mm+ Reflector / SCT (200x+)",
          altitude: "54° Meridian Culmination",
          coordinates: { ra: "06h 18m 22s", dec: "+24° 12' 08\"" },
          filterRecommendation: "#25 Red (Dark Features) / #80A (Polar Caps)"
        },
        {
          name: "Syrtis Major & Dark Albedo Markings",
          targetType: "planet",
          window: "Visible during Martian mid-day",
          magnitude: "Contrast feature",
          bestInstrument: "150mm+ Telescope with steady seeing",
          filterRecommendation: "#23A Light Red / #21 Orange"
        },
        {
          name: "North Polar Ice Cap",
          targetType: "planet",
          window: "Waxing Martian Spring",
          magnitude: "Bright White Reflective",
          bestInstrument: "100mm+ Refractor",
          filterRecommendation: "Variable Polarizing Filter"
        }
      ],
      recommendations: [
        "Observe when Mars crosses 40° altitude to minimize turbulent atmospheric smear.",
        "Use a #25 Red filter to dramatically increase contrast on dark volcanic basalt fields.",
        "Switch to a #80A Blue or #58 Green filter to inspect Martian atmospheric hazes and ice clouds."
      ],
      suggestedPrompts: [
        "Does Mars have liquid water underground?",
        "How high is Olympus Mons compared to Mount Everest?",
        "Can a human survive inside Martian lava tubes?"
      ],
      actionType: "research",
      sourceDataset: "USGS Astrogeology Science Center & NASA MRO CRISM Spectral Telemetry",
      cartItem: {
        targetName: "Mars Surface & Polar Cap",
        targetType: "planet",
        windowTime: "01:20 – 05:40 UTC",
        magnitude: "-0.8 mag",
        coordinates: { ra: "06h 18m 22s", dec: "+24° 12' 08\"" },
        bestInstrument: "100mm+ Reflector (200x+)",
        opticsFilter: "#25 Red / #80A Blue Filter",
        altitude: "54° Elevation",
        notes: "Observe Syrtis Major Planum and North Polar Ice Cap during transit.",
        completed: false
      }
    };
  }

  // 5. DEEP SPACE / ORION / PLEIADES / ANDROMEDA
  if (lower.includes("orion") || lower.includes("m42") || lower.includes("nebula") || lower.includes("pleiades") || lower.includes("m45") || lower.includes("andromeda") || lower.includes("m31") || lower.includes("deep space")) {
    return {
      summary: "Deep-Sky Ephemeris & Interstellar Nursery: Prominent emission nebulae, reflection clouds, and galaxies are in prime dark-sky position. Orion Nebula (M42) offers stunning ionizing H-Alpha glow, while Pleiades (M45) sparkles in cobalt reflection dust.",
      highlights: [
        {
          name: "Orion Great Nebula (Messier 42)",
          targetType: "nebula",
          window: "20:30 – 03:00 UTC",
          magnitude: "+4.0 mag (Naked Eye under Bortle 3)",
          bestInstrument: "Binoculars / 80mm-200mm Scope",
          altitude: "58° Elevation",
          coordinates: { ra: "05h 35m 17s", dec: "-05° 23' 28\"" },
          filterRecommendation: "OIII / H-Beta / UHC Filter"
        },
        {
          name: "Pleiades Star Cluster (Messier 45)",
          targetType: "star-cluster",
          window: "19:00 – 04:00 UTC",
          magnitude: "+1.6 mag (Seven Sisters)",
          bestInstrument: "7x50 or 10x50 Binoculars / Wide Field Scope",
          altitude: "72° Elevation",
          coordinates: { ra: "03h 47m 24s", dec: "+24° 07' 00\"" },
          filterRecommendation: "Broadband Dark-Sky Light Pollution Filter"
        },
        {
          name: "Andromeda Spiral Galaxy (Messier 31)",
          targetType: "galaxy",
          window: "21:00 – 02:30 UTC",
          magnitude: "+3.4 mag (2.5 Million Light Years)",
          bestInstrument: "Binoculars / 14mm-85mm Camera Lens",
          altitude: "68° Elevation",
          coordinates: { ra: "00h 42m 44s", dec: "+41° 16' 09\"" },
          filterRecommendation: "Bortle 1-2 Dark Sky Site (No city light filter needed)"
        }
      ],
      recommendations: [
        "Allow your eyes 20-30 minutes of complete dark adaptation before observing faint nebular filaments.",
        "Employ averted vision (looking slightly off-center) to stimulate high-sensitivity retinal rod cells.",
        "Use an OIII (Oxygen-III) narrowband filter on M42 to make the green-teal ion shockwaves pop vividly."
      ],
      suggestedPrompts: [
        "What is the Trapezium Cluster inside Orion Nebula?",
        "When will Andromeda merge with our Milky Way galaxy?",
        "How were the young blue stars in Pleiades formed?"
      ],
      actionType: "observe",
      sourceDataset: "Messier Deep-Sky Catalog & SIMBAD Astronomical Database (Strasbourg)",
      cartItem: {
        targetName: "Orion Nebula (M42) & Trapezium",
        targetType: "nebula",
        windowTime: "20:30 – 03:00 UTC",
        magnitude: "+4.0 mag",
        coordinates: { ra: "05h 35m 17s", dec: "-05° 23' 28\"" },
        bestInstrument: "Binoculars or 80mm ED Refractor",
        opticsFilter: "UHC / OIII Narrowband Filter",
        altitude: "58° Elevation",
        notes: "Spectacular H-Alpha emission and ionization shock front. Resolve Trapezium 4-star core.",
        completed: false
      }
    };
  }

  // 6. METEOR SHOWERS / PERSEIDS
  if (lower.includes("meteor") || lower.includes("perseid") || lower.includes("shower") || lower.includes("shooting star") || lower.includes("fireball")) {
    return {
      summary: "Perseid Meteor Shower Ephemeris: Spawned by comet 109P/Swift-Tuttle. The radiant point in Perseus rises in the northeast. Produces high-speed (59 km/s) meteors with bright green-white magnesium ionization trains.",
      highlights: [
        {
          name: "Zenithal Hourly Rate (ZHR)",
          targetType: "meteor",
          window: "Peak Window: 22:00 – 04:30 Local",
          magnitude: "100+ meteors / hour",
          bestInstrument: "Naked Eye (Wide 120° Panoramic Field)",
          altitude: "65° Radiant Zenith",
          coordinates: { ra: "03h 04m 00s", dec: "+58° 00' 00\"" },
          filterRecommendation: "Zero filters - Maximum optical throughput"
        },
        {
          name: "Persistent Ionization Trails",
          targetType: "meteor",
          window: "High frequency between 01:00 - 03:30",
          magnitude: "Mag -3 to -5 Fireballs",
          bestInstrument: "Wide Lens (14mm-24mm f/1.4 - f/2.8)",
          altitude: "All sky azimuths",
          filterRecommendation: "Anti-Dew Heating Strip"
        }
      ],
      recommendations: [
        "Lie flat on a reclining camp chair facing northeast 45° away from radiant to catch longest streak tails.",
        "Mount DSLR on a sturdy tripod: ISO 3200, 15-20s exposure, f/1.8-2.8, continuous intervalometer.",
        "Choose a dark sky location rated Bortle Class 1 to 3 for maximum fainter meteor detection."
      ],
      suggestedPrompts: [
        "What causes the emerald green color in Perseid meteors?",
        "What is the parent comet of the Geminids vs Perseids?",
        "How do radio astronomers detect meteor ionization echoes?"
      ],
      actionType: "observe",
      sourceDataset: "International Meteor Organization (IMO) Planetary Ephemerides",
      cartItem: {
        targetName: "Perseid Meteor Shower Peak",
        targetType: "meteor",
        windowTime: "22:00 – Dawn (Peak)",
        magnitude: "ZHR ~100 meteors/hr",
        coordinates: { ra: "03h 04m 00s", dec: "+58° 00' 00\"" },
        bestInstrument: "Naked Eye / 14mm f/1.8 Ultra-Wide Lens",
        opticsFilter: "Baader Clear Focusing Filter",
        altitude: "65° Radiant Zenith",
        notes: "Bortle 1-2 dark sky site recommended for maximum ionization train visibility.",
        completed: false
      }
    };
  }

  // 7. MISSIONS / JWST / VOYAGER
  if (lower.includes("jwst") || lower.includes("james webb") || lower.includes("telescope") || lower.includes("voyager") || lower.includes("spacecraft") || lower.includes("mission") || lower.includes("artemis")) {
    return {
      summary: "Deep Space Exploration & Robotic Flagships: James Webb Space Telescope operates at Sun-Earth L2 Lagrange point (1.5M km away), uncovering early cosmic dawn galaxies, while Voyager 1 traverses interstellar plasma at 162 AU from Earth.",
      highlights: [
        {
          name: "James Webb Space Telescope (JWST)",
          targetType: "spacecraft",
          window: "Continuous Infrared Orbit at L2",
          magnitude: "Instruments: NIRCam, MIRI, NIRSpec",
          bestInstrument: "6.5-meter Beryllium-Gold Mirror Array",
          altitude: "Sun-Earth L2 (Lagrange Point)",
          coordinates: { ra: "06h 00m 00s", dec: "-23° 30' 00\"" },
          filterRecommendation: "Cryogenic Mid-Infrared 0.6 – 28.8 µm"
        },
        {
          name: "Voyager 1 Interstellar Mission",
          targetType: "spacecraft",
          window: "Distance: 24.3 Billion km (162.5 AU)",
          magnitude: "Roundtrip Light Time: 45 Hours",
          bestInstrument: "NASA Deep Space Network (DSN 70m Dishes)",
          altitude: "Interstellar Medium (Ophiuchus)",
          coordinates: { ra: "17h 14m 00s", dec: "+12° 03' 00\"" },
          filterRecommendation: "8.4 GHz X-Band Radio Frequency"
        }
      ],
      recommendations: [
        "Inspect JWST's high-redshift galaxy spectra (z > 14) breaking cosmological dark age paradigms.",
        "Monitor Deep Space Network real-time dish locks at Goldstone, Madrid, and Canberra.",
        "Check the Space Missions 3D viewport in Cosmora to inspect solar panel and thruster mechanics."
      ],
      suggestedPrompts: [
        "How does JWST's 5-layer Kapton sunshield cool instruments to -233°C?",
        "What power source keeps Voyager 1 transmitting after 48 years in space?",
        "What are the planned landing coordinates for Artemis III near Shackleton Crater?"
      ],
      actionType: "research",
      sourceDataset: "NASA Deep Space Network (DSN Now) & STScI JWST Archive",
      cartItem: {
        targetName: "JWST Deep Infrared Field Analysis",
        targetType: "spacecraft",
        windowTime: "Continuous L2 Telemetry",
        magnitude: "Infrared 0.6 - 28µm",
        coordinates: { ra: "06h 00m 00s", dec: "-23° 30' 00\"" },
        bestInstrument: "NASA STScI Archive / Cosmora 3D Inspector",
        opticsFilter: "Infrared NIRCam Bands",
        altitude: "L2 Lagrange Orbit",
        notes: "Study high-redshift early cosmic dawn galaxy spectra and exoplanet atmospheres.",
        completed: false
      }
    };
  }

  // 8. DEFAULT / GENERAL TONIGHT QUERY
  return {
    summary: `Tonight's Celestial Ephemeris for ${activeTarget}: Atmospheric seeing index is 0.8 arcseconds with 82% transparency. Optimal planetary and deep-sky observation windows open shortly after astronomical twilight.`,
    highlights: [
      {
        name: "Jupiter & Galilean Moons",
        targetType: "planet",
        window: "21:15 – 03:10 UTC",
        magnitude: "-2.4 mag (High Luminance)",
        bestInstrument: "7x50 Binoculars or 90mm+ Refractor",
        altitude: "62° Zenith Meridian",
        coordinates: { ra: "03h 12m 44s", dec: "+16° 45' 10\"" },
        filterRecommendation: "#80A Blue / Contrast Filter"
      },
      {
        name: "Saturn & Cassini Ring Division",
        targetType: "planet",
        window: "19:50 – 02:40 UTC",
        magnitude: "+0.6 mag (Golden Glow)",
        bestInstrument: "90mm - 200mm Telescope",
        altitude: "48° Elevation",
        coordinates: { ra: "22h 45m 12s", dec: "-09° 15' 20\"" },
        filterRecommendation: "Polarizing Filter"
      },
      {
        name: "Perseids Radiant Point",
        targetType: "meteor",
        window: "Peak 22:00 – Dawn",
        magnitude: "ZHR ~100 meteors/hr",
        bestInstrument: "Naked Eye / Ultra-Wide 14mm Lens",
        altitude: "65° Altitude",
        coordinates: { ra: "03h 04m 00s", dec: "+58° 00' 00\"" },
        filterRecommendation: "No Filter"
      },
      {
        name: `${activeTarget} Culmination`,
        targetType: "planet",
        window: "01:20 – 05:40 UTC",
        magnitude: "-0.8 mag",
        bestInstrument: "100mm Reflector / SCT",
        altitude: "54° Meridian Culmination",
        coordinates: { ra: "06h 18m 22s", dec: "+24° 12' 08\"" },
        filterRecommendation: "#25 Red Optical Filter"
      }
    ],
    recommendations: [
      "Optimal observation window begins at 22:00 UTC once the Moon dips below the western horizon.",
      "Calibrate telescope polar alignment using Polaris or Sigma Octantis before slewing to deep-sky targets.",
      "Add favorite celestial targets to your Observation Cart to build an exportable stargazing mission plan."
    ],
    suggestedPrompts: [
      `What camera settings do I need for ${activeTarget}?`,
      `Why does ${activeTarget} appear bright tonight?`,
      "What are the best dark sky reserves in the world?"
    ],
    actionType: "observe",
    sourceDataset: "NASA JPL HORIZONS & International Astronomical Union Ephemeris Network",
    cartItem: {
      targetName: `${activeTarget} Prime Transit Observation`,
      targetType: "planet",
      windowTime: "01:20 – 05:40 UTC",
      magnitude: "-0.8 mag",
      coordinates: { ra: "06h 18m 22s", dec: "+24° 12' 08\"" },
      bestInstrument: "100mm Reflector / 8\" Dobsonian",
      opticsFilter: "#25 Red / Contrast Filter",
      altitude: "54° Elevation",
      notes: "High altitude transit observation with optimal atmospheric transparency.",
      completed: false
    }
  };
}
