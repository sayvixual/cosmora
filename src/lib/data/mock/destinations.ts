import { Destination } from "@/features/destinations/types";

export const destinations: Destination[] = [
  {
    id: "dest_001",
    slug: "mauna-kea-observatories",
    name: "Mauna Kea Observatories",
    category: "observatory",
    description: "Located on the dormant volcanic summit of Mauna Kea on the Island of Hawaiʻi. Perched above 40% of Earth's atmosphere with an inversion layer locking clouds below 2,000m, it provides some of the world's most stable atmospheric seeing (sub-0.5 arcsecond optical seeing).",
    countryCode: "US",
    region: "Hawaii",
    elevationM: 4205,
    latitude: 19.8206,
    longitude: -155.4681,
    imageUrl: "https://images.unsplash.com/photo-1549490141-86311ce63a9a?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.ifa.hawaii.edu/mko/",
    managedBy: "University of Hawaiʻi / International Consortium",
    establishedYear: 1967,
    instruments: [
      "W. M. Keck Observatory (Twin 10m Optical/Near-IR)",
      "Subaru Telescope (8.2m Optical-IR, NAOJ)",
      "Gemini North (8.1m Optical/IR)",
      "Submillimeter Array (SMA 8x 6m Antennas)",
      "James Clerk Maxwell Telescope (JCMT 15m Submillimeter)"
    ],
    highlight: "Home to 13 massive optical and submillimeter telescopes above the atmospheric boundary layer.",
    keyDiscoveries: [
      "First direct optical imaging of a multi-planet exoplanetary system (HR 8799)",
      "Orbital kinematics tracking confirming the Supermassive Black Hole at the galactic center (Sagittarius A*)",
      "Spectroscopic characterization of the first discovered interstellar object 1I/'Oumuamua"
    ],
    observationContext: {
      bestSeason: "Year-round (Except localized winter storms in Dec-Feb)",
      skyQuality: 1,
      sqmRating: "21.90 mag/arcsec²",
      clearNightsPerYear: 300,
      humidityAverage: "< 10% (Summit)",
      lightPollutionClass: "Bortle Class 1 (Pristine Dark Sky)",
      visibilityNotes: "Extreme 4,205m altitude requires acclimatization at Hale Pōhaku (2,800m). 4WD required for summit access.",
    },
    activities: [
      {
        id: "act_1_1",
        type: "stargazing",
        description: "Public stargazing programs and solar viewing at the Onizuka Center for International Astronomy Visitor Information Station (VIS).",
        requirements: ["Acclimatization stop at 2,800m", "Heavy thermal winter parkas"],
      },
      {
        id: "act_1_2",
        type: "observatory_tour",
        description: "Summit sunset and exterior telescope facility architectural tours (daytime only).",
        requirements: ["4-Wheel Drive (4WD) low range vehicle", "Minimum age 16 for summit"],
      }
    ]
  },
  {
    id: "dest_002",
    slug: "paranal-alma-atacama",
    name: "Paranal Observatory & ALMA",
    category: "observatory",
    description: "Located in the hyper-arid Atacama Desert in northern Chile. Home to ESO's Very Large Telescope (VLT) at Cerro Paranal (2,635m) and the ALMA interferometer array on the Chajnantor Plateau (5,058m), benefiting from less than 0.5mm precipitable water vapor.",
    countryCode: "CL",
    region: "Antofagasta",
    elevationM: 5058,
    latitude: -24.6272,
    longitude: -70.4042,
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.eso.org/public/teles-instr/paranal-observatory/",
    managedBy: "European Southern Observatory (ESO) & ALMA Consortium",
    establishedYear: 1998,
    instruments: [
      "VLT 4x 8.2m Unit Telescopes (Antu, Kueyen, Melipal, Yepun)",
      "ALMA 66 High-Precision Radio Antennas (Chajnantor)",
      "VLTI Optical Interferometer (130m baseline)",
      "MUSE 3D Integral Field Spectrograph",
      "Extremely Large Telescope (ELT 39m, under construction nearby)"
    ],
    highlight: "The world's most productive ground-based astronomical facility with over 330 clear nights/year.",
    keyDiscoveries: [
      "26-year tracking of star S2 orbiting Sagittarius A* showing gravitational redshift (Nobel Prize in Physics 2020)",
      "First direct image of a proto-planetary transition disk with concentric gap rings (HL Tauri)",
      "Detection of complex organic prebiotic molecules in protoplanetary systems"
    ],
    observationContext: {
      bestSeason: "Year-round (Except Altiplanic 'Invierno Boliviano' in Jan-Feb)",
      skyQuality: 1,
      sqmRating: "21.99 mag/arcsec²",
      clearNightsPerYear: 340,
      humidityAverage: "< 5% (Chajnantor PWV < 0.5mm)",
      lightPollutionClass: "Bortle Class 1 (Earth's Darkest Measured Sky)",
      visibilityNotes: "Zero light pollution for 100+ km radius. Chajnantor Plateau requires supplemental oxygen for personnel.",
    },
    activities: [
      {
        id: "act_2_1",
        type: "observatory_tour",
        description: "Official weekend guided public tours of the VLT control rooms, Residencia, and ALMA Operations Support Facility (OSF).",
        requirements: ["Advance registration (2-3 months)", "Valid government passport"],
      },
      {
        id: "act_2_2",
        type: "astrophotography",
        description: "Deep space and southern Milky Way core astrophotography expeditions in San Pedro de Atacama.",
        requirements: ["Full-frame DSLR/mirrorless", "Equatorial tracker recommended", "Sub-zero windbreaker"],
      }
    ]
  },
  {
    id: "dest_003",
    slug: "bosscha-observatory",
    name: "Bosscha Observatory",
    category: "historic",
    description: "The oldest modern astronomical research observatory in Indonesia, founded in 1923 in Lembang, West Java. Recognized as a National Cultural Heritage site and a pioneer in Southern Hemisphere double star astrometry, variable stars, and Islamic astronomical calendar calculations.",
    countryCode: "ID",
    region: "West Java",
    elevationM: 1310,
    latitude: -6.8248,
    longitude: 107.6166,
    imageUrl: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://bosscha.itb.ac.id/",
    managedBy: "Institut Teknologi Bandung (ITB) Faculty of Mathematics & Natural Sciences",
    establishedYear: 1923,
    instruments: [
      "Zeiss 60cm Double Refractor (Focal length 10.7m)",
      "Schmidt Telescope Bima Sakti (71cm corrector, 51cm mirror)",
      "Bamberg 37cm Refractor",
      "GOTO 45cm Solar Flare Telescope",
      "GAO-ITB 45cm Remote Robotic Telescope (RTS)"
    ],
    highlight: "Century-old active heritage observatory with a monumental 10.7-meter Zeiss double refractor dome.",
    keyDiscoveries: [
      "Catalog of over 10,000 visual binary star systems in the southern celestial hemisphere",
      "Pioneering southern sky stellar classification and open cluster radial velocity studies",
      "High-precision astronomical crescent moon (Hilal) ephemeris validation"
    ],
    observationContext: {
      bestSeason: "Dry Season (May - September)",
      skyQuality: 5,
      sqmRating: "19.20 mag/arcsec²",
      clearNightsPerYear: 140,
      humidityAverage: "65% - 85%",
      lightPollutionClass: "Bortle Class 5-6 (Suburban / Heritage)",
      visibilityNotes: "Urban light from the Bandung basin affects faint deep sky, but planetary, lunar, and narrow-band solar observing remain optimal.",
    },
    activities: [
      {
        id: "act_3_1",
        type: "education",
        description: "Public and student educational tours exploring historical astrophysics instruments and the revolving Kuppel dome.",
        requirements: ["Pre-booking via ITB official portal"],
      },
      {
        id: "act_3_2",
        type: "stargazing",
        description: "Scheduled public night observation sessions observing the Moon, Jupiter, and Saturn through portable tracking telescopes.",
        requirements: ["Clear sky dependent", "Advance reservation"],
      }
    ]
  },
  {
    id: "dest_004",
    slug: "timau-national-observatory",
    name: "Timau National Observatory",
    category: "observatory",
    description: "Indonesia's flagship national astronomical observatory situated on Mount Timau in Kupang Regency, East Nusa Tenggara. Located at 9.5° South latitude, it commands an unobstructed view across both the Northern and Southern celestial hemispheres.",
    countryCode: "ID",
    region: "East Nusa Tenggara",
    elevationM: 1300,
    latitude: -9.5833,
    longitude: 123.9333,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://brin.go.id/",
    managedBy: "BRIN (National Research and Innovation Agency) & ITB",
    establishedYear: 2023,
    instruments: [
      "3.8m Optical Segmented Telescope (Collaborative with Kyoto University)",
      "Solar Magnetic Field Telescope (SMFT Array)",
      "Atmospheric Optical Boundary Layer LiDAR",
      "All-Sky Airglow & Transient Monitor"
    ],
    highlight: "Houses Southeast Asia's largest ground-based optical telescope (3.8-meter aperture).",
    keyDiscoveries: [
      "Equatorial multi-band monitoring of transiting exoplanets and short-period variable stars",
      "Near-Earth Asteroid (NEA) trajectory verification across both celestial poles",
      "Equatorial ionospheric plasma bubble dynamics observation"
    ],
    observationContext: {
      bestSeason: "Dry Season (April - November)",
      skyQuality: 2,
      sqmRating: "21.75 mag/arcsec²",
      clearNightsPerYear: 240,
      humidityAverage: "35% - 55% (Dry season)",
      lightPollutionClass: "Bortle Class 2 (Dark Sky Rural Plateau)",
      visibilityNotes: "Protected by dark sky preservation spatial regulations across Amfoang Tengah.",
    },
    activities: [
      {
        id: "act_4_1",
        type: "research",
        description: "Scientific collaborations in exoplanet transit photometry and equatorial transient follow-ups.",
        requirements: ["BRIN / ITB scientific research permit"],
      }
    ]
  },
  {
    id: "dest_005",
    slug: "roque-de-los-muchachos",
    name: "Roque de los Muchachos Observatory",
    category: "observatory",
    description: "Perched on the caldera rim of La Palma island in Spain's Canary Islands at 2,396 meters. Protected by the landmark Spanish 'Ley del Cielo' (Sky Law), it houses an extraordinary fleet of European optical, infrared, and Cherenkov gamma-ray telescopes.",
    countryCode: "ES",
    region: "Canary Islands",
    elevationM: 2396,
    latitude: 28.7583,
    longitude: -17.8917,
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.iac.es/en/observatorios-de-canarias/roque-de-los-muchachos-observatory",
    managedBy: "Instituto de Astrofísica de Canarias (IAC) & European Consortium",
    establishedYear: 1985,
    instruments: [
      "Gran Telescopio Canarias (GTC 10.4m Segmented Optical-IR)",
      "William Herschel Telescope (WHT 4.2m with WEAVE Spectrograph)",
      "MAGIC Twin 17m Atmospheric Cherenkov Gamma-Ray Telescopes",
      "LST-1 (Large Size Telescope 23m, CTA Northern Array)",
      "Swedish 1m Solar Telescope (SST with Adaptive Optics)"
    ],
    highlight: "Home to the Gran Telescopio Canarias (10.4m), one of the world's largest single-aperture optical telescopes.",
    keyDiscoveries: [
      "Detection of very high-energy gamma-ray emissions from distant active galactic nuclei (AGN blazars)",
      "Sub-diffraction adaptive optics resolution of solar flare magnetic reconnection flux tubes",
      "High-resolution spectroscopic chemical tagging of Milky Way stellar stream populations (WEAVE Survey)"
    ],
    observationContext: {
      bestSeason: "May - October (Stable trade-wind inversion layer)",
      skyQuality: 1,
      sqmRating: "21.85 mag/arcsec²",
      clearNightsPerYear: 290,
      humidityAverage: "< 15% (Summit inversion)",
      lightPollutionClass: "Bortle Class 1 (Starlight Reserve Protected)",
      visibilityNotes: "Natural marine cloud inversion forms below 1,500m, leaving the summit under completely transparent skies.",
    },
    activities: [
      {
        id: "act_5_1",
        type: "stargazing",
        description: "Certified Starlight Foundation guided night observing sessions at designated summit viewpoints.",
        requirements: ["Red-light torches only", "Warm mountain attire"],
      },
      {
        id: "act_5_2",
        type: "observatory_tour",
        description: "Daytime guided public tours inside the giant dome of the Gran Telescopio Canarias (GTC).",
        requirements: ["Advance online booking via IAC", "Closed shoes"],
      }
    ]
  },
  {
    id: "dest_006",
    slug: "aoraki-mackenzie",
    name: "Aoraki Mackenzie Dark Sky Reserve",
    category: "dark_sky",
    description: "Encompassing 4,300 square kilometers in New Zealand's South Island, this is the Southern Hemisphere's first and largest Gold-Tier International Dark Sky Reserve. Surrounding Mount Cook and Lake Tekapo, it offers world-renowned southern stargazing.",
    countryCode: "NZ",
    region: "Canterbury",
    elevationM: 1029,
    latitude: -43.9866,
    longitude: 170.4633,
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.darkskyreserve.org.nz/",
    managedBy: "DarkSky International & University of Canterbury",
    establishedYear: 2012,
    instruments: [
      "Mt John Observatory MOA 1.8m Microlensing Optical Telescope",
      "McLellan 1.0m Reflecting Telescope",
      "Boller & Chivens 0.61m Telescope",
      "Continuous High-Density SQM Automated Sensor Network"
    ],
    highlight: "Gold-tier pristine dark sky sanctuary showcasing the Magellanic Clouds, Carina Nebula, and Aurora Australis.",
    keyDiscoveries: [
      "Discovery of free-floating rogue exoplanets via gravitational microlensing (MOA Collaboration)",
      "High-precision variable star light curves in the Large and Small Magellanic Clouds",
      "Southern sky transient nova and supernovae monitoring"
    ],
    observationContext: {
      bestSeason: "March - September (Autumn & Winter: 12+ hour dark nights)",
      skyQuality: 1,
      sqmRating: "21.85 mag/arcsec²",
      clearNightsPerYear: 220,
      humidityAverage: "40% - 60%",
      lightPollutionClass: "Bortle Class 1 (Gold-Tier Sanctuary)",
      visibilityNotes: "Regular sightings of Aurora Australis (Southern Lights), Zodiacal Light, and the Dark Doodad Nebula.",
    },
    activities: [
      {
        id: "act_6_1",
        type: "stargazing",
        description: "Dark Sky Project evening guided telescope tours atop Mount John and the historic Church of the Good Shepherd.",
        requirements: ["Thermal down jackets", "Dark sky preservation compliance"],
      },
      {
        id: "act_6_2",
        type: "astrophotography",
        description: "Alpine astrophotography workshops capturing the Southern Cross reflected on glacial lakes.",
        requirements: ["Wide-angle fast lens (f/1.4 - f/2.8)", "Sturdy tripod"],
      }
    ]
  },
  {
    id: "dest_007",
    slug: "mars-desert-research-station",
    name: "Mars Desert Research Station (MDRS)",
    category: "analog_habitat",
    description: "Located in the remote badlands of the San Juan Formation near Hanksville, Utah. Operated by The Mars Society, it is the world's longest-running operational human spaceflight analog habitat, studying field astrobiology, rover robotics, and EVA crew protocols.",
    countryCode: "US",
    region: "Utah",
    elevationM: 1400,
    latitude: 38.4064,
    longitude: -110.7919,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "http://mdrs.marssociety.org/",
    managedBy: "The Mars Society",
    establishedYear: 2001,
    instruments: [
      "Musk Mars Desert Observatory (14-inch Celestron EdgeHD Schmidt-Cassegrain)",
      "MDRS Robotic Solar Observatory (Lunt 100mm H-Alpha Solar Telescope)",
      "Science Dome Geology & Microbiology Analytical Wet Lab",
      "Two-Story 8m Diameter Cylindrical Habitat Core (Hab)",
      "RAM (Repair and Assembly Module) & GreenHab Aquaponics"
    ],
    highlight: "Full-fidelity Mars surface operational analog facility with over 280 crew mission rotations conducted.",
    keyDiscoveries: [
      "Astrobiology detection protocols for endolithic extremophiles in Jurassic sandstone analogs",
      "Human factor metrics on crew cognitive performance during simulated 15-minute Mars-Earth communication latency",
      "Testing of pressurized spacesuit joint mobility and field geology sample caching"
    ],
    observationContext: {
      bestSeason: "October - May (Active mission simulation season)",
      skyQuality: 2,
      sqmRating: "21.75 mag/arcsec²",
      clearNightsPerYear: 280,
      humidityAverage: "< 15% (Colorado Plateau Semi-Arid)",
      lightPollutionClass: "Bortle Class 2 (Colorado Plateau Dark Sky)",
      visibilityNotes: "Isolated canyon geology provides zero artificial horizon glow and minimal radio frequency interference.",
    },
    activities: [
      {
        id: "act_7_1",
        type: "research",
        description: "Simulated extravehicular activity (EVA) field geology operations with autonomous uncrewed rovers.",
        requirements: ["Selected simulation crew credential", "Strict mission simulation quarantine"],
      }
    ]
  },
  {
    id: "dest_008",
    slug: "namibrand-nature-reserve",
    name: "NamibRand Dark Sky Reserve",
    category: "dark_sky",
    description: "Spanning over 200,000 hectares in the Namib Desert of southwestern Namibia. Designated as Africa's first International Dark Sky Reserve (Gold Tier), its red sand dunes and isolated mountains produce some of the darkest, crispiest night skies on Earth.",
    countryCode: "NA",
    region: "Hardap",
    elevationM: 950,
    latitude: -24.9500,
    longitude: 15.9833,
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.namibrand.org/",
    managedBy: "NamibRand Nature Reserve Association",
    establishedYear: 2012,
    instruments: [
      "Wolwedans Stargazing Observatory Domes",
      "Wide-Aperture Field Dobsonian Telescopes (16-inch f/4.5)",
      "Automated SQM-LU Sky Brightness Continuous Monitors"
    ],
    highlight: "Africa's first Gold-Tier Dark Sky Reserve with zero artificial light sources within 50+ km.",
    keyDiscoveries: [
      "Continuous baseline monitoring for Earth's optical darkness (regularly exceeding SQM 22.0 mag/arcsec²)",
      "High-contrast observations of the Zodiacal Light, Gegenschein, and Southern Milky Way dust rifts",
      "Ecological studies on nocturnal desert fauna under pure natural starlight illumination"
    ],
    observationContext: {
      bestSeason: "May - September (Southern winter: bone-dry, cloudless skies)",
      skyQuality: 1,
      sqmRating: "21.98 mag/arcsec²",
      clearNightsPerYear: 320,
      humidityAverage: "< 10%",
      lightPollutionClass: "Bortle Class 1 (True Pristine Darkness)",
      visibilityNotes: "The Milky Way casts distinct shadows on the ground; naked-eye limiting magnitude exceeds 7.5.",
    },
    activities: [
      {
        id: "act_8_1",
        type: "stargazing",
        description: "Open-air desert dune sky-bed stargazing with resident conservation astronomers.",
        requirements: ["Eco-lodge accommodation reservation"],
      }
    ]
  },
  {
    id: "dest_009",
    slug: "hi-seas-analog",
    name: "HI-SEAS Habitat",
    category: "analog_habitat",
    description: "The Hawaiʻi Space Exploration Analog and Simulation habitat located at 2,500 meters (8,200 ft) on the barren northern slope of Mauna Loa. Surrounded by young basaltic lava flows, it mimics the geology and isolation of lunar and Martian volcanic terrains.",
    countryCode: "US",
    region: "Hawaii",
    elevationM: 2500,
    latitude: 19.5333,
    longitude: -155.5833,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.hi-seas.org/",
    managedBy: "International MoonBase Alliance (IMA)",
    establishedYear: 2013,
    instruments: [
      "36-foot Geodesic Dome Habitat with 1,200 sq ft living area",
      "Lava Tube Subterranean Exploration Sensors",
      "NASA-standard Biosensing Crew Biometrics Array",
      "Off-Grid 10 kW Photovoltaic & Hydrogen Fuel Cell Microgrid"
    ],
    highlight: "Premier NASA-funded human factors and subterranean lava tube exploration analog base.",
    keyDiscoveries: [
      "Validated food systems and nutritional stability protocols for 365-day isolated crew missions",
      "Discovered potential subsurface microbial biosignatures inside volcanic basalt lava tubes",
      "Developed psycho-social interventions for isolated crew autonomy during high-consequence planetary EVAs"
    ],
    observationContext: {
      bestSeason: "Year-round (Isolated alpine volcanic plateau)",
      skyQuality: 1,
      sqmRating: "21.90 mag/arcsec²",
      clearNightsPerYear: 290,
      humidityAverage: "< 20%",
      lightPollutionClass: "Bortle Class 1 (Mauna Loa Volcanic Dark Sky)",
      visibilityNotes: "Rugged aʻā and pāhoehoe lava terrain under extreme isolation protocols.",
    },
    activities: [
      {
        id: "act_9_1",
        type: "research",
        description: "Lunar and Martian EVA simulation studies in pressurized mock spacesuits inside volcanic lava tubes.",
        requirements: ["IMA Mission Scientist / Analog Astronaut Credential"],
      }
    ]
  },
  {
    id: "dest_010",
    slug: "fast-radio-telescope",
    name: "FAST Radio Telescope (Tianyan)",
    category: "observatory",
    description: "The Five-hundred-meter Aperture Spherical radio Telescope (FAST), nicknamed 'Tianyan' (Eye of Heaven), nestled in the natural karst depression of Dawodang, Guizhou. It is the largest filled-aperture and most sensitive single-dish radio telescope in the world.",
    countryCode: "CN",
    region: "Guizhou",
    elevationM: 1000,
    latitude: 25.6529,
    longitude: 106.8566,
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://fast.bao.ac.cn/",
    managedBy: "National Astronomical Observatories, Chinese Academy of Sciences (NAOC)",
    establishedYear: 2016,
    instruments: [
      "500m Active Cable-Net Spherical Reflector (4,450 triangular aluminum panels)",
      "19-beam L-band Cryogenic Receiver (1.05 - 1.45 GHz)",
      "Focus Cabin suspended by 6 high-precision steel cables",
      "Pulsar & Fast Transient Search Real-Time HPC Cluster"
    ],
    highlight: "The world's most sensitive radio telescope, with a collecting area equivalent to 30 football fields.",
    keyDiscoveries: [
      "Discovered over 900 new pulsars, including dozens of millisecond pulsars and eclipsing binaries",
      "Detected over 1,600 bursts from single repeating Fast Radio Burst source FRB 121102",
      "Set stringent upper limits on nano-Hertz gravitational wave backgrounds and interstellar SETI signals"
    ],
    observationContext: {
      bestSeason: "Autumn & Winter (Minimal rainfall in karst basin)",
      skyQuality: 2,
      sqmRating: "Radio-Quiet Protected Zone",
      clearNightsPerYear: 180,
      humidityAverage: "70% (Protected within mountain basin)",
      lightPollutionClass: "Class 2 (Radio Silence Protected Area)",
      visibilityNotes: "Strict 5-kilometer electromagnetic silence zone: all mobile phones, digital cameras, and smartwatches are prohibited.",
    },
    activities: [
      {
        id: "act_10_1",
        type: "education",
        description: "Visitor observation platform overlooking the 500-meter dish and Astronomy Experience Hall.",
        requirements: ["Complete surrender of all electronic devices at checkpoint", "Film cameras only permitted"],
      }
    ]
  },
  {
    id: "dest_011",
    slug: "siding-spring-observatory",
    name: "Siding Spring Observatory",
    category: "observatory",
    description: "Located atop Mount Woorat at 1,165 meters on the edge of Warrumbungle National Park in New South Wales. It is Australia's premier optical and infrared observatory, located inside Australia's first certified Dark Sky Park.",
    countryCode: "AU",
    region: "New South Wales",
    elevationM: 1165,
    latitude: -31.2755,
    longitude: 149.0615,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://rsaa.anu.edu.au/observatories/siding-spring-observatory",
    managedBy: "Australian National University (ANU) Research School of Astronomy and Astrophysics",
    establishedYear: 1964,
    instruments: [
      "Anglo-Australian Telescope (AAT 3.9m with 2dF Robotic Fiber Positioner)",
      "SkyMapper 1.35m Automated Wide-Field Survey Telescope",
      "Faulkes Telescope South (2.0m Robotic, LCOGT Network)",
      "ANU 2.3m Advanced Technology Telescope"
    ],
    highlight: "Home to the 3.9m Anglo-Australian Telescope, pioneer of massive spectroscopic galaxy surveys.",
    keyDiscoveries: [
      "2dF Galaxy Redshift Survey measuring 221,000 galaxies to confirm Cosmic Baryon Acoustic Oscillations",
      "Discovery of the oldest known star in the universe (SMSS J031300.36-670839.3, ~13.6 billion years old)",
      "Discovery of Comet Siding Spring (C/2013 A1) that made an ultra-close flyby of Mars in 2014"
    ],
    observationContext: {
      bestSeason: "April - October (Autumn / Winter with long southern nights)",
      skyQuality: 1,
      sqmRating: "21.80 mag/arcsec²",
      clearNightsPerYear: 260,
      humidityAverage: "30% - 50%",
      lightPollutionClass: "Bortle Class 1-2 (Certified Dark Sky Park)",
      visibilityNotes: "Protected by local council lighting ordinances across the Warrumbungle Shire.",
    },
    activities: [
      {
        id: "act_11_1",
        type: "observatory_tour",
        description: "Exploratory self-guided tour of the AAT visitor gallery and astronomy exhibition center.",
        requirements: ["Daytime access only", "Open 7 days"],
      }
    ]
  },
  {
    id: "dest_012",
    slug: "kitt-peak-observatory",
    name: "Kitt Peak National Observatory",
    category: "observatory",
    description: "Located on the Tohono O'odham Nation in the Quinlan Mountains of Arizona at 2,096 meters (6,877 ft). Established in 1958, it hosts the world's largest and most diverse gathering of optical and radio astronomical instruments on a single mountain.",
    countryCode: "US",
    region: "Arizona",
    elevationM: 2096,
    latitude: 31.9583,
    longitude: -111.5967,
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.noirlab.edu/public/programs/kitt-peak-national-observatory/",
    managedBy: "NSF's NOIRLab / Association of Universities for Research in Astronomy (AURA)",
    establishedYear: 1958,
    instruments: [
      "Nicholas U. Mayall 4.0m Telescope (Equipped with 5,000-fiber DESI Spectrograph)",
      "WIYN 3.5m Observatory (High-precision radial velocity exoplanet spectrometer NEID)",
      "McMath-Pierce Solar Telescope Facility",
      "VLBA 25m Radio Antenna Dish (NRAO)"
    ],
    highlight: "Home to DESI (Dark Energy Spectroscopic Instrument), constructing the largest 3D map of the cosmos.",
    keyDiscoveries: [
      "First direct observational evidence of Dark Matter in spiral galaxies by Vera Rubin and Kent Ford (1970)",
      "Constructed the largest 3D map of the universe with over 40 million galaxies and quasars (DESI Survey 2024)",
      "First optical identification of a gravitational lens system (Twin Quasar Q0957+561)"
    ],
    observationContext: {
      bestSeason: "October - May (Dry desert winters, avoiding the summer monsoon)",
      skyQuality: 2,
      sqmRating: "21.65 mag/arcsec²",
      clearNightsPerYear: 280,
      humidityAverage: "< 20% (Desert)",
      lightPollutionClass: "Bortle Class 2 (Protected Sky Reserve)",
      visibilityNotes: "Protected by Pima County outdoor lighting codes preserving astronomy research.",
    },
    activities: [
      {
        id: "act_12_1",
        type: "stargazing",
        description: "Nightly Observing Programs (NOP) and Advanced Observing Programs with dedicated astronomers.",
        requirements: ["Advance reservation via NOIRLab", "Warm layered clothing"],
      }
    ]
  },
  {
    id: "dest_013",
    slug: "concordia-antarctic-station",
    name: "Concordia Research Station",
    category: "analog_habitat",
    description: "Located on Dome C on the Antarctic Plateau at 3,233 meters altitude, 1,000 km inland from the coast. Jointly operated by France and Italy with ESA participation, it experiences extreme isolation, temperatures plunging to -80°C, and 3 months of continuous polar night.",
    countryCode: "AQ",
    region: "Antarctica (Dome C)",
    elevationM: 3233,
    latitude: -75.0998,
    longitude: 123.3333,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    websiteUrl: "https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Concordia",
    managedBy: "IPEV (France), PNRA (Italy) & European Space Agency (ESA)",
    establishedYear: 2005,
    instruments: [
      "ASTEP 400 (Antarctic Search for Transiting ExoPlanets)",
      "ICE-T Twin 0.6m Photometric Telescopes",
      "Extreme Altitude Medical Research & Hypoxia Biomonitoring Rig",
      "Atmospheric Boundary Layer Sonic Anemometer Towers"
    ],
    highlight: "The most isolated human outpost on Earth, serving as ESA's highest-fidelity deep space mission analog.",
    keyDiscoveries: [
      "Continuous 24-hour baseline transit photometry of southern exoplanets during continuous polar night",
      "Epigenetic and neuro-cognitive adaptation metrics under 9 months of total winter-over isolation and chronic hypoxia",
      "Extracted 800,000-year atmospheric climate records from EPICA deep ice cores"
    ],
    observationContext: {
      bestSeason: "May - August (Austral Polar Night: 3 months of uninterrupted 24-hour darkness)",
      skyQuality: 1,
      sqmRating: "22.00 mag/arcsec²",
      clearNightsPerYear: 300,
      humidityAverage: "< 1% (Extremely dry polar desert)",
      lightPollutionClass: "Bortle Class 1 (Purest Atmospheric Transparency on Earth)",
      visibilityNotes: "Boundary layer turbulence is confined to the lowest 30 meters; above it, seeing matches space-telescope quality.",
    },
    activities: [
      {
        id: "act_13_1",
        type: "research",
        description: "Long-duration winter-over medical and human performance analog research for Mars missions.",
        requirements: ["ESA / IPEV / PNRA crew selection and psychological clearance"],
      }
    ]
  }
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find(d => d.slug === slug);
}
