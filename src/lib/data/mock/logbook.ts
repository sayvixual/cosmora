import { LogbookEntry, LogbookStats } from "@/features/logbook/types";

export const INITIAL_LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    id: "log_perseids_mauna_kea",
    title: "Perseid Meteor Shower Zenith Burst & Airglow",
    category: "astrophotography",
    targetObject: "Perseid Meteor Shower (109P/Swift-Tuttle)",
    targetType: "meteor",
    observerName: "Dr. Elena Rostova",
    observerRole: "Field Astrophotographer & Optical Specialist",
    date: "2025-08-12",
    timeUtc: "08:45 UTC",
    locationName: "Mauna Kea Summit Observatories Ridge, Hawaii, USA",
    coordinates: "19.8206° N, 155.4681° W",
    altitudeM: 4205,
    summary: "High-cadence ultra-wide tracking of the Perseid peak rate during astronomical new moon. Captured 64 meteor trails with vivid green magnesium ionization trains.",
    detailedNotes: "Observed from the high-altitude volcanic ridge above the inversion cloud layer. The sky darkness was exceptional at Bortle Class 1 with SQM 21.98 mag/arcsec². Atmospheric airglow was prominently visible in long exposures. A total of 64 meteors were registered in a 4-hour time window, including two fireballs exceeding magnitude -4 with persistent smoke trails lasting up to 90 seconds.",
    scientificFindings: [
      "Peak Zenithal Hourly Rate (ZHR) measured at 112 ± 8 meteors/hour at 09:15 UTC.",
      "Green persistent ionization trails confirmed high atmospheric magnesium content at 95km altitude.",
      "Zero light pollution interference; atmospheric transparency reached 98%."
    ],
    skyCondition: {
      bortleScale: 1,
      seeingIndex: "I (Superb, <0.4\")",
      transparencyPercent: 98,
      moonPhase: "Waning Crescent (2%)",
      temperatureC: -2.4,
      humidityPercent: 12
    },
    imagingHardware: {
      telescopeOrLens: "Sony FE 14mm f/1.8 GM Ultra-Wide Lens",
      mountType: "Sky-Watcher Star Adventurer GTi Tracking Mount",
      cameraSensor: "Full-Frame Back-Illuminated CMOS (Sony A7S III)",
      iso: 3200,
      exposureSeconds: 20,
      totalIntegrationMinutes: 240,
      filtersUsed: ["Baader Clear Focusing Filter", "Anti-Dew Heating Strip"],
      subFramesCount: 720
    },
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
    tags: ["Meteors", "Mauna Kea", "Bortle 1", "Fireball", "Airglow"],
    verified: true
  },
  {
    id: "log_saturn_encke_division",
    title: "Saturn Ring Plane High-Resolution Photometry",
    category: "stargazing",
    targetObject: "Saturn & Cassini Division",
    targetType: "planet",
    observerName: "Marcus Vance",
    observerRole: "Planetary Observer & Astrometric Specialist",
    date: "2025-09-24",
    timeUtc: "21:30 UTC",
    locationName: "Pic du Midi High-Altitude Observatory, Pyrenees, France",
    coordinates: "42.9369° N, 0.1411° E",
    altitudeM: 2877,
    summary: "Exceptional laminar seeing session capturing sub-arcsecond ring structures including the elusive Encke Division and atmospheric cloud bands on Saturn's northern hemisphere.",
    detailedNotes: "Atmospheric turbulence over the Pyrenees settled into a dead calm laminar state (Pickering Scale 9/10). At 450x magnification, the Cassini Division appeared sharp as an inked razor line. The subtle 0.05-arcsecond Encke Gap in the outer A-ring was repeatedly resolved visually and confirmed on 10,000-frame lucky imaging capture stacks.",
    scientificFindings: [
      "Resolved Encke Gap (325 km wide) at ring distance of 133,500 km.",
      "Hexagonal jet stream at Saturn's North Pole displayed distinct golden-olive hue shift.",
      "Shadow of Saturn cast across the B-Ring exhibited distinct curvature corresponding to ring tilt angle of 2.1°."
    ],
    skyCondition: {
      bortleScale: 2,
      seeingIndex: "I (Laminar, 0.45\")",
      transparencyPercent: 95,
      moonPhase: "First Quarter (52%)",
      temperatureC: 1.2,
      humidityPercent: 24
    },
    imagingHardware: {
      telescopeOrLens: "Celestron EdgeHD 11\" Schmidt-Cassegrain (2800mm f/10)",
      apertureMm: 280,
      focalLengthMm: 5600,
      mountType: "Paramount ME II Robotic German Equatorial",
      cameraSensor: "ZWO ASI290MM Monochrome Planetary Sensor",
      iso: 400,
      exposureSeconds: 0.015,
      totalIntegrationMinutes: 45,
      filtersUsed: ["Astronomik Planet IR Pro 742nm", "RGB High-Throughput Set"],
      subFramesCount: 15000
    },
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    tags: ["Saturn", "Cassini Division", "Planetary", "Lucky Imaging", "Pic du Midi"],
    verified: true
  },
  {
    id: "log_jades_deep_field",
    title: "JWST JADES Deep Field: Lyman-Break Redshift Reduction",
    category: "research",
    targetObject: "JADES-GS-z14-0 (Early Cosmic Dawn Galaxy)",
    targetType: "galaxy",
    observerName: "Prof. Sarah Lindqvist",
    observerRole: "Extragalactic Astrophysicist, ESA/STScI",
    date: "2025-10-04",
    timeUtc: "14:10 UTC",
    locationName: "STScI Science Operations / JWST NIRSpec Pipeline",
    coordinates: "L2 Lagrange Point (1.5M km from Earth)",
    summary: "Spectroscopic confirmation of cosmic dawn galaxy at redshift z=14.32, dating to merely 290 million years post Big Bang. Strong Lyman-alpha continuum break detected.",
    detailedNotes: "Spectroscopic reduction utilizing NIRSpec Micro-Shutter Array (MSA) in prism mode (0.6–5.3 μm) with 65 hours of integrated exposure. The Lyman-alpha absorption break is decisively identified at 1.86 μm, yielding a spectroscopic redshift of z = 14.324 ± 0.005. Surprising dust-to-gas ratio and oxygen ionization lines indicate rapid early chemical enrichment.",
    scientificFindings: [
      "Confirmed distance of z=14.32; light emitted 13.51 billion years ago.",
      "Galaxy stellar mass estimated at 5 × 10⁸ solar masses, substantially more massive than standard CDM models predicted.",
      "Ionized oxygen [O III] emission detected at 88 μm rest-frame equivalent."
    ],
    skyCondition: {
      bortleScale: 0,
      seeingIndex: "Diffraction-Limited (0.07\")",
      transparencyPercent: 100,
      moonPhase: "N/A (L2 Orbit)",
      temperatureC: -233.0
    },
    imagingHardware: {
      telescopeOrLens: "James Webb Space Telescope 6.5m Beryllium Primary Array",
      apertureMm: 6500,
      focalLengthMm: 131400,
      mountType: "Sun-Earth L2 Halo Orbit Spacecraft Bus",
      cameraSensor: "Teledyne HAWAII-2RG HgCdTe Focal Plane Array (NIRSpec / NIRCam)",
      exposureSeconds: 1400,
      totalIntegrationMinutes: 3900,
      filtersUsed: ["F090W", "F115W", "F150W", "F200W", "F277W", "F356W", "F444W"],
      subFramesCount: 168
    },
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop",
    tags: ["JWST", "Cosmic Dawn", "Redshift z=14", "Spectroscopy", "JADES"],
    verified: true
  },
  {
    id: "log_andromeda_m31_halpha",
    title: "Andromeda (M31) Hydrogen-Alpha Starburst Arms Survey",
    category: "astrophotography",
    targetObject: "Andromeda Galaxy (Messier 31 / NGC 224)",
    targetType: "galaxy",
    observerName: "Liam Sterling",
    observerRole: "Deep Space Imaging Specialist",
    date: "2025-11-02",
    timeUtc: "02:15 UTC",
    locationName: "Paranal Dark Sky Plateau, Atacama Desert, Chile",
    coordinates: "24.6272° S, 70.4042° W",
    altitudeM: 2635,
    summary: "24-hour total LRGB + H-Alpha composite revealing intense starburst HII ionization pockets throughout Andromeda's outer spiral arms and satellite galaxies M32 & M110.",
    detailedNotes: "Conducted over four consecutive moonless nights in the ultra-dry Atacama atmosphere (relative humidity <8%). Narrowband 3nm Hydrogen-Alpha filtering isolated over 400 distinct glowing nebulae within the outer spiral disk of M31. The stellar nucleus was processed with HDR multiscale transform to preserve core brightness dynamic range without blowing out.",
    scientificFindings: [
      "Mapped NGC 206 stellar association with resolved blue supergiant star clusters.",
      "Identified 38 previously uncataloged faint HII emission knots in outer tidal stream.",
      "SNR (Signal-to-Noise Ratio) improved by 340% over standard broadband imaging."
    ],
    skyCondition: {
      bortleScale: 1,
      seeingIndex: "I (Superb, 0.52\")",
      transparencyPercent: 99,
      moonPhase: "New Moon (0%)",
      temperatureC: 4.8,
      humidityPercent: 7
    },
    imagingHardware: {
      telescopeOrLens: "Takahashi FSQ-106EDX IV Quadruplet Petzval Refractor",
      apertureMm: 106,
      focalLengthMm: 530,
      mountType: "10Micron GM1000 HPS Direct Drive Mount",
      cameraSensor: "ZWO ASI6200MM Pro Full-Frame Cooled Mono CMOS",
      iso: 100,
      exposureSeconds: 300,
      totalIntegrationMinutes: 1440,
      filtersUsed: ["Chroma 3nm H-Alpha", "Chroma 2\" Luminance", "Chroma RGB Set"],
      subFramesCount: 288
    },
    imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop",
    tags: ["M31", "Andromeda", "H-Alpha", "Atacama", "Deep Sky"],
    verified: true
  },
  {
    id: "log_comet_tsuchinshan",
    title: "Comet C/2023 A3 (Tsuchinshan-ATLAS) Anti-Tail Disconnection",
    category: "stargazing",
    targetObject: "Comet C/2023 A3 (Tsuchinshan-ATLAS)",
    targetType: "comet",
    observerName: "Klaus Bergmann",
    observerRole: "Cometary Dynamics & Solar System Observer",
    date: "2025-10-18",
    timeUtc: "18:20 UTC",
    locationName: "Roque de los Muchachos Observatory, La Palma, Canary Islands",
    coordinates: "28.7566° N, 17.8833° W",
    altitudeM: 2396,
    summary: "Visual and photographic monitoring of the dramatic perihelion dust tail and rare sunward-pointing anti-tail spanning 14 degrees across the western dusk horizon.",
    detailedNotes: "Visible to the naked eye shortly after sunset with magnitude +1.8. Through 10x50 binoculars and 130mm refractor, the coma exhibited an intense cyan Swan-band emission glow. The dust tail stretched over 18 degrees across Ophiuchus with a sharp needle-like anti-tail created by geometric orbital plane crossing.",
    scientificFindings: [
      "Estimated dust production rate of 8,500 kg/s during peak solar heating.",
      "Disconnection event observed in the blue ion tail at 18:45 UTC caused by coronal mass ejection interaction.",
      "Nucleus remained intact without major catastrophic fragmentation."
    ],
    skyCondition: {
      bortleScale: 1,
      seeingIndex: "II (Good, 0.7\")",
      transparencyPercent: 96,
      moonPhase: "Waxing Gibbous (82%)",
      temperatureC: 8.5,
      humidityPercent: 18
    },
    imagingHardware: {
      telescopeOrLens: "William Optics Zenithstar 103 Apo Doublet (f/6.9)",
      apertureMm: 103,
      focalLengthMm: 710,
      mountType: "ZWO AM5 Harmonic Drive Mount",
      cameraSensor: "Canon EOS R5 Full-Frame (Astro-Modified)",
      iso: 1600,
      exposureSeconds: 60,
      totalIntegrationMinutes: 90,
      filtersUsed: ["Optolong L-Pro Broadband Light Pollution Filter"],
      subFramesCount: 90
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    tags: ["Comet", "Anti-Tail", "La Palma", "Perihelion", "Solar Wind"],
    verified: true
  },
  {
    id: "log_orion_trapezium_photometry",
    title: "Orion Nebula (M42) Micro-Variability & Proplyds Survey",
    category: "research",
    targetObject: "Great Orion Nebula & Trapezium Cluster (M42 / NGC 1976)",
    targetType: "nebula",
    observerName: "Dr. Kenji Takahashi",
    observerRole: "Stellar Formation Researcher, NAOJ",
    date: "2025-12-14",
    timeUtc: "23:00 UTC",
    locationName: "Subaru Telescope / National Astronomical Observatory of Japan",
    coordinates: "19.8255° N, 155.4760° W",
    altitudeM: 4139,
    summary: "Infrared high-resolution mapping of 42 proto-planetary disks (proplyds) bathed in intense UV radiation from Theta-1 Orionis C.",
    detailedNotes: "Utilizing adaptive optics with laser guide star correction to bypass atmospheric turbulence. High-precision photometry of the central four Trapezium stars (A, B, C, D) and detection of young stellar objects (YSOs) with circumstellar silhouette disks evaporating under photoevaporative winds.",
    scientificFindings: [
      "Photoevaporation mass-loss rate for proplyd 177-341 calculated at 1.2 × 10⁻⁷ solar masses/year.",
      "Trapezium star Theta-1 C confirmed as dominant ionizing source producing 99% of Lyman continuum flux in inner 0.5 pc.",
      "Adaptive optics resolved binary separation down to 0.08 arcseconds."
    ],
    skyCondition: {
      bortleScale: 1,
      seeingIndex: "I (Adaptive Optics Corrected, 0.08\")",
      transparencyPercent: 99,
      moonPhase: "Waxing Crescent (22%)",
      temperatureC: -1.8,
      humidityPercent: 15
    },
    imagingHardware: {
      telescopeOrLens: "Subaru 8.2m Optical-Infrared Telescope",
      apertureMm: 8200,
      focalLengthMm: 15000,
      mountType: "Alt-Azimuth Robotic Dome",
      cameraSensor: "Infrared Camera and Spectrograph (IRCS) + AO188",
      exposureSeconds: 600,
      totalIntegrationMinutes: 360,
      filtersUsed: ["J-band (1.25 μm)", "H-band (1.65 μm)", "Ks-band (2.15 μm)"],
      subFramesCount: 36
    },
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1200&auto=format&fit=crop",
    tags: ["M42", "Orion", "Proplyds", "Subaru Telescope", "Adaptive Optics"],
    verified: true
  }
];

export const INITIAL_LOGBOOK_STATS: LogbookStats = {
  totalSessions: 148,
  totalDarkSkyHours: 642,
  targetsObserved: 312,
  avgBortle: 1.8,
  verifiedDiscoveries: 24
};
