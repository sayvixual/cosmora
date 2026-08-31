import { SpaceMission } from "@/features/missions/types";

export const SPACE_MISSIONS: SpaceMission[] = [
  {
    id: "mission_jwst",
    name: "James Webb Space Telescope",
    designation: "JWST / NGST",
    agency: "NASA / ESA / CSA",
    internationalPartners: ["European Space Agency", "Canadian Space Agency", "STScI"],
    category: "space_telescope",
    status: "active",
    launchDate: "2021-12-25",
    launchVehicle: "Ariane 5 ECA (Flight VA256)",
    launchSite: "Guiana Space Centre, Kourou, French Guiana",
    targetBody: "Deep Space / Cosmic Dawn (L2)",
    summary: "The premier infrared space observatory, operating in a halo orbit around the Sun-Earth L2 Lagrange point 1.5 million km from Earth. Equipped with a 6.5-meter gold-coated beryllium primary mirror and cryogenic sunshield.",
    highlight: "Detecting the earliest galaxies formed 300M years after the Big Bang and analyzing exoplanet atmospheric compositions.",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    modelType: "jwst",
    telemetry: {
      velocityKmS: 0.202,
      distanceFromEarthKm: 1520000,
      distanceFromEarthAU: 0.0102,
      distanceFromSunKm: 151100000,
      oneWayLightTimeSeconds: 5.07,
      roundTripLightTimeFormatted: "10.14 seconds",
      missionDurationDays: 1708,
      orbitType: "Sun-Earth L2 Halo Quasi-Periodic Orbit",
      powerSource: "2.0 kW Solar Array + 5-Layer Kapton Sunshield (-233°C Cold Side)"
    },
    instruments: [
      {
        name: "NIRCam (Near-Infrared Camera)",
        type: "0.6 to 5.0 µm Imager",
        description: "Primary imager for detecting light from the first stars and star-forming regions in distant galaxies."
      },
      {
        name: "NIRSpec (Near-Infrared Spectrograph)",
        type: "Multi-Object Microshutter Array Spectrometer",
        description: "Capable of capturing simultaneous spectra of up to 100 astronomical targets in a single field."
      },
      {
        name: "MIRI (Mid-Infrared Instrument)",
        type: "4.9 to 28.8 µm Camera & Spectrometer",
        description: "Equipped with a mechanical helium cryocooler operating at 6.7 Kelvin (-266.4°C) to pierce thick cosmic dust."
      },
      {
        name: "FGS/NIRISS (Fine Guidance Sensor)",
        type: "Wide-Field Slitless & Precision Guider",
        description: "Ensures milliharcsecond pointing accuracy and performs exoplanet transit spectroscopy."
      }
    ],
    keyDiscoveries: [
      {
        title: "Detection of Galaxy JADES-GS-z14-0 (z = 14.32)",
        year: 2024,
        description: "Discovered the most distant confirmed galaxy, shining just 290 million years after the Big Bang with unexpected luminosity and mass.",
        scientificImpact: "Overturned existing cosmological models regarding early stellar formation rates in the infant universe."
      },
      {
        title: "Carbon Dioxide & Water in Exoplanet WASP-39 b",
        year: 2022,
        description: "Provided the first clear molecular signature of CO2, SO2, and water vapor photochemistry in an exoplanetary atmosphere 700 light-years away.",
        scientificImpact: "Established high-precision transmission spectroscopy as a viable standard for exoplanet habitability assessment."
      }
    ],
    primaryObjectives: [
      "Search for the first galaxies or luminous objects formed after the Big Bang.",
      "Determine how galaxies evolved from their formation until the present day.",
      "Observe the formation of stars from the first stages to the formation of planetary systems.",
      "Measure the physical and chemical properties of planetary systems and investigate the potential for life."
    ],
    trajectoryNodes: [
      { label: "Launch & Separation", date: "Dec 25, 2021", distance: "0 km", description: "Flawless insertion by Ariane 5 rocket directly onto L2 transfer trajectory." },
      { label: "Sunshield Deployment", date: "Jan 4, 2022", distance: "900,000 km", description: "Fully unfurled and tensioned all five tennis-court sized Kapton layers." },
      { label: "L2 Insertion Burn", date: "Jan 24, 2022", distance: "1,500,000 km", description: "Entered stable periodic halo orbit around the Sun-Earth L2 Lagrange point." }
    ]
  },
  {
    id: "mission_voyager1",
    name: "Voyager 1",
    designation: "Voyager Interstellar Mission (VIM)",
    agency: "NASA / JPL",
    internationalPartners: ["NASA Deep Space Network (DSN)"],
    category: "interstellar_probe",
    status: "interstellar",
    launchDate: "1977-09-05",
    launchVehicle: "Titan IIIE-Centaur",
    launchSite: "Cape Canaveral Space Force Station, Florida, USA",
    targetBody: "Interstellar Space (Outer Heliopause Boundary)",
    summary: "The farthest human-made object from Earth. Having completed grand flybys of Jupiter and Saturn, it crossed the Heliopause in August 2012 to become humanity's first probe exploring true interstellar space.",
    highlight: "First spacecraft in history to directly sample the interstellar plasma medium beyond the Sun's protective magnetic bubble.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    modelType: "voyager",
    telemetry: {
      velocityKmS: 16.999,
      distanceFromEarthKm: 24450000000,
      distanceFromEarthAU: 163.43,
      distanceFromSunKm: 24390000000,
      oneWayLightTimeSeconds: 81550,
      roundTripLightTimeFormatted: "45 hours 18 minutes 20 seconds",
      missionDurationDays: 17890,
      orbitType: "Interstellar Hyperbolic Escape Trajectory (Inclination 35.5°)",
      powerSource: "3 Radioisotope Thermoelectric Generators (RTGs) fueled by Plutonium-238"
    },
    instruments: [
      {
        name: "CRS (Cosmic Ray Subsystem)",
        type: "High-Energy Particle Detector",
        description: "Monitors galactic cosmic rays originating outside our solar system from supernova shockwaves."
      },
      {
        name: "MAG (Triaxial Fluxgate Magnetometer)",
        type: "Interstellar Magnetic Field Sensor",
        description: "Measures interstellar magnetic field intensity, direction, and solar wind termination shocks."
      },
      {
        name: "PWS (Plasma Wave Subsystem)",
        type: "Electric Dipole Radio Antenna",
        description: "Detects electron density oscillations in interstellar plasma and coronal mass ejection reverberations."
      },
      {
        name: "The Golden Record",
        type: "Gold-Plated Copper Phonograph Record",
        description: "Contains 115 images, natural sounds of Earth, greetings in 55 human languages, and musical selections for extraterrestrial life."
      }
    ],
    keyDiscoveries: [
      {
        title: "Crossing the Heliopause into Interstellar Space",
        year: 2012,
        description: "Recorded a dramatic drop in solar particles and a 40x surge in galactic cosmic rays at 121.6 AU, marking the official exit from the heliosphere.",
        scientificImpact: "Provided humanity's first direct in-situ measurements of the pristine interstellar medium."
      },
      {
        title: "Discovery of Active Volcanism on Io & Rings of Jupiter",
        year: 1979,
        description: "Discovered active sulfur geysers on Jupiter's moon Io and photographed Jupiter's faint ring system for the first time.",
        scientificImpact: "Revolutionized planetary geodynamics by proving tidal heating can maintain active volcanism beyond the asteroid belt."
      }
    ],
    primaryObjectives: [
      "Conduct close-up reconnaissance of Jupiter and Saturn systems.",
      "Explore the outer boundary of the solar wind (heliosphere).",
      "Characterize the magnetic, cosmic ray, and plasma environment of interstellar space."
    ],
    trajectoryNodes: [
      { label: "Jupiter Flyby", date: "Mar 5, 1979", distance: "349,000 km from Jupiter", description: "Gravity assist boost accelerating the probe towards Saturn." },
      { label: "Saturn Flyby", date: "Nov 12, 1980", distance: "124,000 km from Saturn", description: "Close flyby of Titan redirected trajectory northward out of ecliptic plane." },
      { label: "Heliopause Crossing", date: "Aug 25, 2012", distance: "121.6 AU", description: "Entered interstellar space after passing through the solar wind termination shock." }
    ]
  },
  {
    id: "mission_perseverance",
    name: "Perseverance Rover & Ingenuity",
    designation: "Mars 2020 Mission",
    agency: "NASA / JPL",
    internationalPartners: ["CNES (France)", "CAB / INTA (Spain)", "FFI (Norway)"],
    category: "planetary_rover",
    status: "active",
    launchDate: "2020-07-30",
    launchVehicle: "Atlas V 541",
    launchSite: "Cape Canaveral Space Force Station, Florida, USA",
    targetBody: "Mars (Jezero Crater Paleolake Delta)",
    summary: "NASA's flagship car-sized Mars astrobiology rover exploring Jezero Crater, an ancient 3.5-billion-year-old river delta lake. Deployed Ingenuity, the first powered aircraft on another planet, and caches pristine rock cores for Earth return.",
    highlight: "Extracting oxygen from the Martian CO2 atmosphere using MOXIE and discovering diverse organic carbon molecules in river delta sedimentary rocks.",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    modelType: "perseverance",
    telemetry: {
      velocityKmS: 0.042,
      distanceFromEarthKm: 225000000,
      distanceFromEarthAU: 1.504,
      distanceFromSunKm: 227900000,
      oneWayLightTimeSeconds: 750,
      roundTripLightTimeFormatted: "25 minutes 00 seconds",
      missionDurationDays: 1845,
      solCount: 1253,
      orbitType: "Surface Robotic Roving (Jezero Crater Rim Trajectory)",
      powerSource: "Multi-Mission Radioisotope Thermoelectric Generator (MMRTG) producing 110W"
    },
    instruments: [
      {
        name: "SuperCam & Mastcam-Z",
        type: "Laser-Induced Breakdown Spectrometer & Multispectral Zoom Stereo",
        description: "Fires laser pulses at rock targets up to 7m away to vaporize minerals and analyze chemical spectra."
      },
      {
        name: "SHERLOC & WATSON",
        type: "Deep UV Raman & Fluorescence Spectrometer",
        description: "Scans rock surfaces with a fine ultraviolet laser beam to detect organic molecules and bio-signatures."
      },
      {
        name: "MOXIE (Mars Oxygen ISRU Experiment)",
        type: "Solid Oxide Electrolysis Fuel Cell",
        description: "Successfully synthesized 122 grams of breathable oxygen directly from atmospheric carbon dioxide."
      },
      {
        name: "Ingenuity Mars Helicopter",
        type: "Twin-Rotor 1.8 kg Aerial Scout",
        description: "Completed 72 powered flights in thin Martian atmosphere (1% Earth density), logging over 128 flight minutes."
      }
    ],
    keyDiscoveries: [
      {
        title: "Diverse Organic Molecules in Jezero Delta Mudstones",
        year: 2023,
        description: "Identified a rich suite of carbon-based organic aromatics preserved in fine-grained clays within the delta sediment layers.",
        scientificImpact: "Strongest candidate bio-signature samples collected for the Mars Sample Return campaign."
      },
      {
        title: "First Powered Atmospheric Flight on Another Planet",
        year: 2021,
        description: "Ingenuity successfully demonstrated powered, controlled flight in Mars' ultra-thin atmosphere on Sol 58.",
        scientificImpact: "Unlocked aerial scouting and robotic rotorcraft for future planetary exploration architectures."
      }
    ],
    primaryObjectives: [
      "Identify past Martian environments capable of supporting microbial life.",
      "Seek bio-signatures in preserved rock formations.",
      "Collect and hermetically seal 30+ sample cores for future return to Earth.",
      "Demonstrate in-situ resource utilization (ISRU) for future human crews."
    ]
  },
  {
    id: "mission_artemis",
    name: "Artemis III & Orion",
    designation: "Artemis Human Lunar Exploration Program",
    agency: "NASA",
    internationalPartners: ["ESA (European Service Module)", "JAXA", "CSA", "SpaceX (Starship HLS)"],
    category: "lunar_exploration",
    status: "en_route",
    launchDate: "2026-09-01",
    launchVehicle: "Space Launch System (SLS Block 1B)",
    launchSite: "Kennedy Space Center LC-39B, Florida, USA",
    targetBody: "Moon (South Pole / Shackleton Crater Rim)",
    summary: "Humanity's return to the lunar surface. Artemis will land the first woman and first person of color near the Moon's South Pole, unlocking permanently shadowed craters containing billions of tons of water ice for sustainable base camps.",
    highlight: "Establishing the first permanent human outpost and lunar gateway orbiting architecture for future Mars voyages.",
    imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1200&auto=format&fit=crop",
    modelType: "artemis",
    telemetry: {
      velocityKmS: 1.05,
      distanceFromEarthKm: 384400,
      distanceFromEarthAU: 0.00257,
      distanceFromSunKm: 149600000,
      oneWayLightTimeSeconds: 1.28,
      roundTripLightTimeFormatted: "2.56 seconds",
      missionDurationDays: 30,
      orbitType: "Near-Rectilinear Halo Orbit (NRHO) ➔ Lunar South Pole Descent",
      powerSource: "4 Large Solar Array Wings (ESM) generating 11 kW"
    },
    instruments: [
      {
        name: "Starship Human Landing System (HLS)",
        type: "Heavy Reusable Lunar Descent/Ascent Vehicle",
        description: "Transports 4 crew members from NRHO orbit to the lunar South Pole surface for a 7-day science expedition."
      },
      {
        name: "AxEMU Next-Gen Spacesuits",
        type: "Advanced Extravehicular Mobility Unit",
        description: "Engineered for cryogenic South Pole shadows (-200°C) with 8-hour continuous surface EVA endurance."
      },
      {
        name: "Lunar Ice Volatiles Coring Drill",
        type: "1-Meter Cryogenic Subsurface Drill",
        description: "Extracts pristine frozen volatile samples from permanently shadowed regions (PSRs)."
      }
    ],
    keyDiscoveries: [
      {
        title: "Artemis I Trans-Lunar Record Orbit",
        year: 2022,
        description: "Orion flew 432,210 km from Earth, farther than any spacecraft built for humans has ever flown, before a perfect Pacific splashdown.",
        scientificImpact: "Validated heat shield performance at lunar re-entry velocity of 40,000 km/h (Mach 32)."
      }
    ],
    primaryObjectives: [
      "Land astronauts at the lunar South Pole region.",
      "Investigate water ice reservoirs for oxygen and hydrogen rocket propellant extraction.",
      "Deploy long-term science packages to study the Moon's geologic origin."
    ]
  },
  {
    id: "mission_iss",
    name: "International Space Station",
    designation: "ISS / Alpha (Zvezda, Destiny, Columbus, Kibo)",
    agency: "NASA / ESA / JAXA / CSA / Roscosmos",
    internationalPartners: ["15 Nations Collaborative Consortium"],
    category: "space_station",
    status: "active",
    launchDate: "1998-11-20",
    launchVehicle: "Proton-K (Zarya FGB) & Space Shuttle Endeavour (STS-88)",
    launchSite: "Baikonur Cosmodrome & Kennedy Space Center",
    targetBody: "Low Earth Orbit (418 km Altitude)",
    summary: "The largest modular space station in human history. Continuously inhabited since November 2000, serving as an orbital microgravity physics, biology, and materials laboratory flying at 27,600 km/h.",
    highlight: "Over 25 years of continuous human presence in space and 3,000+ scientific investigations conducted across 100+ countries.",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    modelType: "iss",
    telemetry: {
      velocityKmS: 7.66,
      distanceFromEarthKm: 418,
      distanceFromEarthAU: 0.0000028,
      distanceFromSunKm: 149600000,
      oneWayLightTimeSeconds: 0.0014,
      roundTripLightTimeFormatted: "2.8 milliseconds",
      missionDurationDays: 10145,
      orbitType: "Circular Low Earth Orbit (Inclination 51.64°, Period 92.9 min)",
      powerSource: "8 Solar Array Wings (1 acre area) generating 120 kW (240V DC)"
    },
    instruments: [
      {
        name: "AMS-02 (Alpha Magnetic Spectrometer)",
        type: "Superconducting Particle Physics Detector",
        description: "Searches for dark matter signatures and primordial antimatter by measuring 200+ billion cosmic rays."
      },
      {
        name: "Cupola Observatory Module",
        type: "360° 7-Window Earth Observation Dome",
        description: "Provides crew direct visual monitoring of robotic operations, spacecraft dockings, and Earth atmospheric dynamics."
      },
      {
        name: "Cold Atom Lab (CAL)",
        type: "Bose-Einstein Condensate Quantum Physics Facility",
        description: "Chills atomic gas clouds to 50 picokelvins above absolute zero to study quantum mechanics in persistent microgravity."
      }
    ],
    keyDiscoveries: [
      {
        title: "Observation of Fifth State of Matter (Bose-Einstein Condensate)",
        year: 2020,
        description: "Created long-lived macroscopic quantum waves uninhibited by Earth's gravity gradient.",
        scientificImpact: "Pioneered high-precision atom interferometry for ultra-sensitive gravitational wave detection."
      }
    ],
    primaryObjectives: [
      "Maintain a permanent microgravity research outpost.",
      "Test human physiological resilience and life-support systems for deep-space Mars transit.",
      "Foster peaceful multinational science cooperation."
    ]
  },
  {
    id: "mission_cassini",
    name: "Cassini-Huygens",
    designation: "Cassini Saturn Orbiter & Huygens Titan Probe",
    agency: "NASA / ESA / ASI",
    internationalPartners: ["European Space Agency", "Italian Space Agency"],
    category: "deep_space_orbiter",
    status: "completed",
    launchDate: "1997-10-15",
    launchVehicle: "Titan IVB / Centaur",
    launchSite: "Cape Canaveral SLC-40, Florida, USA",
    targetBody: "Saturnian System (Titan, Enceladus, Saturn Rings)",
    summary: "One of the most ambitious interplanetary voyages ever undertaken. Spent 13 years exploring Saturn, its rings, and ocean worlds, ending with a dramatic deliberate plunge into Saturn's atmosphere in the 'Grand Finale' of 2017.",
    highlight: "Discovered global subsurface liquid water oceans with hydrothermal vents on Enceladus and methane liquid seas on Titan.",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    modelType: "cassini",
    telemetry: {
      velocityKmS: 34.0,
      distanceFromEarthKm: 1430000000,
      distanceFromEarthAU: 9.56,
      distanceFromSunKm: 1433000000,
      oneWayLightTimeSeconds: 4770,
      roundTripLightTimeFormatted: "2 hours 39 minutes",
      missionDurationDays: 7274,
      orbitType: "Saturnian Equatorial & Inclined Orbits (294 orbits completed)",
      powerSource: "3 Radioisotope Thermoelectric Generators (GPHS-RTG)"
    },
    instruments: [
      {
        name: "Huygens Titan Atmospheric Lander",
        type: "Surface Descent Probe & Gas Chromatograph",
        description: "First landing in the outer solar system; photographed river channels carved by liquid methane on Titan."
      },
      {
        name: "INMS (Ion & Neutral Mass Spectrometer)",
        type: "Atmospheric & Plume Chemical Sensor",
        description: "Directly sampled organic molecules, molecular hydrogen, and salts shooting from Enceladus geysers."
      },
      {
        name: "Radar & Synthetic Aperture Mapping",
        type: "13.78 GHz Microwave Radar",
        description: "Pierced Titan's opaque nitrogen smog to map vast hydrocarbon lakes (Kraken Mare)."
      }
    ],
    keyDiscoveries: [
      {
        title: "Subsurface Ocean & Hydrothermal Plumes on Enceladus",
        year: 2005,
        description: "Flew directly through plumes erupting from south pole 'tiger stripe' fractures, detecting salinity and organic carbon.",
        scientificImpact: "Established ocean worlds with tidal heating as prime candidates for extraterrestrial life in our solar system."
      }
    ],
    primaryObjectives: [
      "Determine the 3D structure and dynamic behavior of Saturn's rings.",
      "Conduct in-situ exploration of Titan's dense atmosphere and surface.",
      "Study Saturn's magnetosphere and atmospheric circulation."
    ]
  },
  {
    id: "mission_hubble",
    name: "Hubble Space Telescope",
    designation: "HST / Great Observatories Program",
    agency: "NASA / ESA",
    internationalPartners: ["European Space Agency", "STScI"],
    category: "space_telescope",
    status: "extended_mission",
    launchDate: "1990-04-24",
    launchVehicle: "Space Shuttle Discovery (STS-31)",
    launchSite: "Kennedy Space Center LC-39B, Florida, USA",
    targetBody: "Cosmic Optical / UV Universe (535 km LEO)",
    summary: "The most celebrated telescope in human history. Operating above atmospheric distortion for over three decades, Hubble revolutionized every domain of modern astronomy from stellar birth to the accelerating expansion of the universe.",
    highlight: "Measuring the Hubble Constant expansion rate, capturing the iconic Ultra Deep Field, and verifying supermassive black holes in galactic cores.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    modelType: "hubble",
    telemetry: {
      velocityKmS: 7.59,
      distanceFromEarthKm: 535,
      distanceFromEarthAU: 0.0000035,
      distanceFromSunKm: 149600000,
      oneWayLightTimeSeconds: 0.0018,
      roundTripLightTimeFormatted: "3.6 milliseconds",
      missionDurationDays: 13270,
      orbitType: "Circular Low Earth Orbit (Inclination 28.5°)",
      powerSource: "2 GaAs Rigid Solar Arrays generating 5.5 kW + 6 NiMH Batteries"
    },
    instruments: [
      {
        name: "WFC3 (Wide Field Camera 3)",
        type: "UV / Visible / Near-Infrared Panchromatic Imager",
        description: "Main workhorse capturing sharp wide-field deep-space vistas and gravitational lenses."
      },
      {
        name: "ACS (Advanced Camera for Surveys)",
        type: "High-Resolution Optical & Coronagraphic Imager",
        description: "Engineered specifically to map dark matter distributions through weak gravitational lensing."
      },
      {
        name: "COS (Cosmic Origins Spectrograph)",
        type: "High-Sensitivity Far-Ultraviolet Spectrograph",
        description: "Probes the cosmic web of intergalactic gas threads that feed growing galaxies."
      }
    ],
    keyDiscoveries: [
      {
        title: "Hubble Ultra Deep Field (10,000 Ancient Galaxies)",
        year: 2004,
        description: "Stared into a tiny keyhole patch of empty sky for 11 days, revealing thousands of infant galaxies back to 800M years post-Big Bang.",
        scientificImpact: "Provided the deepest optical view into cosmic time in human history."
      },
      {
        title: "Accelerating Expansion of the Universe (Dark Energy)",
        year: 1998,
        description: "Observations of distant Type Ia supernovae proved that cosmic expansion is accelerating rather than slowing down (Nobel Prize 2011).",
        scientificImpact: "Led to the discovery of Dark Energy, comprising 68% of the total energy-mass density of the universe."
      }
    ],
    primaryObjectives: [
      "Determine the expansion rate of the universe (Hubble constant).",
      "Characterize properties of supermassive black holes.",
      "Investigate planetary atmospheres and distant stellar nurseries."
    ]
  },
  {
    id: "mission_newhorizons",
    name: "New Horizons",
    designation: "First Mission to the Kuiper Belt (New Frontiers 1)",
    agency: "NASA / JHUAPL / SwRI",
    internationalPartners: ["Johns Hopkins Applied Physics Laboratory"],
    category: "interstellar_probe",
    status: "extended_mission",
    launchDate: "2006-01-19",
    launchVehicle: "Atlas V 551 (Fastest Manmade Launch Velocity)",
    launchSite: "Cape Canaveral SLC-41, Florida, USA",
    targetBody: "Pluto, Charon & Outer Kuiper Belt (Arrokoth)",
    summary: "The fastest spacecraft ever launched from Earth, speeding past the Moon in just 9 hours. Conducted the historic first close-up flyby of the Pluto system in 2015 and explored the primordial contact binary Arrokoth 6.6 billion km from Earth.",
    highlight: "Discovered active nitrogen ice glaciers in Pluto's heart-shaped Sputnik Planitia and mapped the pristine snowman-like contact binary 486958 Arrokoth.",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    modelType: "newhorizons",
    telemetry: {
      velocityKmS: 13.78,
      distanceFromEarthKm: 8750000000,
      distanceFromEarthAU: 58.48,
      distanceFromSunKm: 8710000000,
      oneWayLightTimeSeconds: 29180,
      roundTripLightTimeFormatted: "16 hours 12 minutes 40 seconds",
      missionDurationDays: 7528,
      orbitType: "Interstellar Heliocentric Escape Trajectory",
      powerSource: "1 GPHS-RTG Radioisotope Thermoelectric Generator producing ~190W"
    },
    instruments: [
      {
        name: "LORRI (Long Range Reconnaissance Imager)",
        type: "High-Resolution 20.8cm Telescopic Optical Camera",
        description: "Provided the iconic crisp photos of Pluto's ice mountains, nitrogen plains, and hazy blue atmospheric rings."
      },
      {
        name: "Ralph (Multispectral Visible & Infrared Spectrometer)",
        type: "Surface Composition & Thermal Mapper",
        description: "Mapped methane, nitrogen, carbon monoxide, and water ice distributions on Kuiper Belt objects."
      },
      {
        name: "Alice (Ultraviolet Imaging Spectrometer)",
        type: "Atmospheric Structure Sensor",
        description: "Measured atmospheric escape rates and nitrogen haze layers during Pluto occultation."
      }
    ],
    keyDiscoveries: [
      {
        title: "Active Nitrogen Glaciers on Pluto (Sputnik Planitia)",
        year: 2015,
        description: "Proved Pluto is not a geologically dead world, but dynamically refreshed by 3km-deep convective nitrogen ice glaciers.",
        scientificImpact: "Redefined planetary geophysics by demonstrating volatile sublimation cycles on dwarf planets."
      },
      {
        title: "Pristine Contact Binary Geometry of Arrokoth",
        year: 2019,
        description: "Photographed a pristine planetesimal formed by gentle gravitational merging of two distinct lobes in the early solar nebula.",
        scientificImpact: "Provided direct observational proof for the streaming instability model of planetesimal accretion."
      }
    ],
    primaryObjectives: [
      "Map the global geology and morphology of Pluto and Charon.",
      "Characterize Pluto's neutral atmosphere and its escape rate.",
      "Explore primitive Kuiper Belt Objects to understand solar system origins."
    ]
  }
];
