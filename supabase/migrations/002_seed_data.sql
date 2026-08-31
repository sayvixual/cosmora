-- ============================================================
-- COSMORA — Seed Data
-- Run AFTER 001_initial_schema.sql
-- Seeds: source references, celestial objects, missions, events
-- ============================================================

-- Source reference for internal seed data
INSERT INTO source_references (id, provider, source_type, title, url, license_notes)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'NASA', 'dataset', 'NASA Solar System Exploration', 'https://solarsystem.nasa.gov', 'Public Domain'),
  ('00000000-0000-0000-0000-000000000002', 'SIMBAD', 'database', 'SIMBAD Astronomical Database', 'https://simbad.cds.unistra.fr', 'CC BY 4.0'),
  ('00000000-0000-0000-0000-000000000003', 'NASA', 'api', 'NASA Exoplanet Archive', 'https://exoplanetarchive.ipac.caltech.edu', 'Public Domain')
ON CONFLICT (provider, external_id) DO NOTHING;

-- ============================================================
-- CELESTIAL OBJECTS — Solar System Planets
-- ============================================================

INSERT INTO celestial_objects (id, object_type, name, canonical_name, slug, description, distance_value, distance_unit, magnitude, metadata)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'star', 'Sun', 'Sol', 'sun',
   'The star at the center of the Solar System. A nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
   0, 'au', -26.74,
   '{"diameter_km": 1392700, "mass_kg": "1.989e30", "surface_temp_k": 5778, "age_years": "4.6e9", "spectral_type": "G2V"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174001', 'planet', 'Mercury', 'Mercury', 'mercury',
   'The smallest planet in the Solar System and the closest to the Sun. It has no natural satellites.',
   0.39, 'au', -1.9,
   '{"diameter_km": 4879, "mass_kg": "3.30e23", "moons": 0, "orbital_period_days": 87.97, "surface_temp_k_max": 700}'
  ),
  ('123e4567-e89b-12d3-a456-426614174002', 'planet', 'Venus', 'Venus', 'venus',
   'The second planet from the Sun. It is named after the Roman goddess of love and beauty. Venus is the brightest natural object in Earths night sky.',
   0.72, 'au', -4.9,
   '{"diameter_km": 12104, "mass_kg": "4.87e24", "moons": 0, "orbital_period_days": 224.7, "atmosphere": "CO2 96.5%"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174003', 'planet', 'Earth', 'Earth', 'earth',
   'Our home planet and the only known harbor of life in the universe. Earth has one natural satellite, the Moon.',
   1.0, 'au', NULL,
   '{"diameter_km": 12756, "mass_kg": "5.97e24", "moons": 1, "orbital_period_days": 365.25, "atmosphere": "N2 78%, O2 21%"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174004', 'planet', 'Mars', 'Mars', 'mars',
   'The Red Planet, fourth from the Sun. Mars is a cold desert world with the largest volcano and canyon in the Solar System.',
   1.52, 'au', -2.91,
   '{"diameter_km": 6792, "mass_kg": "6.42e23", "moons": 2, "orbital_period_days": 686.97, "surface_temp_k_avg": 210}'
  ),
  ('123e4567-e89b-12d3-a456-426614174005', 'planet', 'Jupiter', 'Jupiter', 'jupiter',
   'The largest planet in the Solar System, a gas giant with a mass more than two and a half times that of all the other planets combined.',
   5.20, 'au', -2.94,
   '{"diameter_km": 142984, "mass_kg": "1.898e27", "moons": 95, "orbital_period_years": 11.86, "great_red_spot": true}'
  ),
  ('123e4567-e89b-12d3-a456-426614174006', 'planet', 'Saturn', 'Saturn', 'saturn',
   'The sixth planet from the Sun, known for its stunning ring system composed of ice and rock particles.',
   9.58, 'au', 0.46,
   '{"diameter_km": 120536, "mass_kg": "5.68e26", "moons": 146, "orbital_period_years": 29.46, "ring_system": true}'
  ),
  ('123e4567-e89b-12d3-a456-426614174007', 'planet', 'Uranus', 'Uranus', 'uranus',
   'The seventh planet from the Sun, an ice giant that rotates on its side with a dramatic axial tilt of 98 degrees.',
   19.18, 'au', 5.68,
   '{"diameter_km": 51118, "mass_kg": "8.68e25", "moons": 28, "orbital_period_years": 84.01, "axial_tilt_deg": 97.77}'
  ),
  ('123e4567-e89b-12d3-a456-426614174008', 'planet', 'Neptune', 'Neptune', 'neptune',
   'The eighth and farthest-known planet from the Sun in the Solar System. An ice giant with the strongest winds in the Solar System.',
   30.07, 'au', 7.78,
   '{"diameter_km": 49528, "mass_kg": "1.024e26", "moons": 16, "orbital_period_years": 164.8, "wind_speed_kmh": 2100}'
  ),

  -- Deep Space Objects
  ('123e4567-e89b-12d3-a456-426614174009', 'galaxy', 'Andromeda Galaxy', 'M31', 'andromeda',
   'The Andromeda Galaxy is a barred spiral galaxy and the nearest large galaxy to the Milky Way. It is on a collision course with our galaxy.',
   2537000, 'ly', 3.44,
   '{"diameter_ly": 220000, "stars_estimate": "1e12", "constellation": "Andromeda", "ra": "00h 42m 44.3s", "dec": "+41° 16 09"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174010', 'nebula', 'Orion Nebula', 'M42', 'orion-nebula',
   'The Orion Nebula is a diffuse nebula situated in the Milky Way, south of Orions Belt. One of the most photographed and studied objects in the night sky.',
   1344, 'ly', 4.0,
   '{"diameter_ly": 24, "constellation": "Orion", "ra": "05h 35m 17.3s", "dec": "-05° 23 28", "type": "emission/reflection"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174011', 'star-cluster', 'Pleiades', 'M45', 'pleiades',
   'The Pleiades star cluster, also known as the Seven Sisters, contains hot blue stars formed roughly 100 million years ago.',
   444, 'ly', 1.6,
   '{"stars_count": 1000, "age_million_years": 100, "constellation": "Taurus", "ra": "03h 47m 24s", "dec": "+24° 07 00"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174012', 'star', 'Alpha Centauri', 'Alpha Centauri', 'alpha-centauri',
   'The closest star system to Earth, comprising a triple star system. Proxima Centauri is the individual closest star at 4.24 light-years away.',
   4.37, 'ly', -0.29,
   '{"system_type": "triple_star", "components": ["Alpha Centauri A", "Alpha Centauri B", "Proxima Centauri"], "constellation": "Centaurus"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174013', 'nebula', 'Crab Nebula', 'M1', 'crab-nebula',
   'The Crab Nebula is a supernova remnant and pulsar wind nebula in the constellation Taurus. It was the first astronomical object identified with a historical supernova explosion.',
   6523, 'ly', 8.4,
   '{"constellation": "Taurus", "ra": "05h 34m 31.9s", "dec": "+22° 00 52", "expansion_km_s": 1500, "pulsar": true}'
  ),
  
  -- Additional objects for richness
  ('123e4567-e89b-12d3-a456-426614174020', 'galaxy', 'Milky Way', 'Milky Way', 'milky-way',
   'Our home galaxy. A barred spiral galaxy containing between 100 and 400 billion stars, with the Solar System located about 26,000 light-years from the galactic center.',
   0, 'ly', NULL,
   '{"diameter_ly": 100000, "stars_estimate": "2.5e11", "age_years": "1.36e10", "type": "barred_spiral"}'
  ),
  ('123e4567-e89b-12d3-a456-426614174021', 'moon', 'Moon', 'Luna', 'moon',
   'Earth''s only natural satellite. The Moon is the fifth-largest satellite in the Solar System and the largest relative to its host planet.',
   0.00257, 'au', -12.74,
   '{"diameter_km": 3475, "orbital_period_days": 27.32, "distance_from_earth_km": 384400, "phases": true}'
  ),
  ('123e4567-e89b-12d3-a456-426614174022', 'nebula', 'Pillars of Creation', 'M16 Pillars', 'pillars-of-creation',
   'Famous columns of interstellar gas and dust in the Eagle Nebula (M16), captured by Hubble and Webb. Active star-forming regions.',
   6500, 'ly', NULL,
   '{"location": "Eagle Nebula M16", "height_ly": 4, "constellation": "Serpens", "jwst_observed": true}'
  ),
  ('123e4567-e89b-12d3-a456-426614174023', 'black-hole', 'Sagittarius A*', 'Sgr A*', 'sagittarius-a-star',
   'The supermassive black hole at the center of the Milky Way galaxy, with a mass approximately 4 million times that of the Sun.',
   26000, 'ly', NULL,
   '{"mass_solar_masses": 4000000, "schwarzschild_radius_km": 12, "eht_imaged": true, "constellation": "Sagittarius"}'
  )
ON CONFLICT (canonical_name) DO UPDATE
  SET description = EXCLUDED.description,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- ============================================================
-- SCIENTIFIC FACTS — Key planet data
-- ============================================================

INSERT INTO scientific_facts (object_id, fact_key, value_numeric, unit)
SELECT id, 'mass_earth_ratio', 
  CASE canonical_name
    WHEN 'Mercury' THEN 0.055
    WHEN 'Venus' THEN 0.815
    WHEN 'Earth' THEN 1.0
    WHEN 'Mars' THEN 0.107
    WHEN 'Jupiter' THEN 317.8
    WHEN 'Saturn' THEN 95.2
    WHEN 'Uranus' THEN 14.5
    WHEN 'Neptune' THEN 17.1
  END,
  'Earth masses'
FROM celestial_objects
WHERE canonical_name IN ('Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune')
ON CONFLICT DO NOTHING;

-- ============================================================
-- MISSIONS — Major Space Missions
-- ============================================================

INSERT INTO missions (id, name, agency, description, launch_at, status, metadata)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'James Webb Space Telescope', 'NASA/ESA/CSA',
   'The premier infrared space observatory operating at the Sun-Earth L2 Lagrange point 1.5 million km from Earth.',
   '2021-12-25T12:20:00Z', 'active',
   '{"designation": "JWST", "orbit": "L2 Halo", "mirror_diameter_m": 6.5}'
  ),
  ('a0000000-0000-0000-0000-000000000002', 'Voyager 1', 'NASA',
   'The most distant human-made object, exploring interstellar space beyond the heliosphere.',
   '1977-09-05T12:56:00Z', 'active',
   '{"current_region": "interstellar", "distance_from_sun_au": 163}'
  ),
  ('a0000000-0000-0000-0000-000000000003', 'Perseverance Rover', 'NASA',
   'Mars 2020 rover exploring Jezero Crater, searching for signs of ancient microbial life and collecting samples.',
   '2020-07-30T11:50:00Z', 'active',
   '{"landing_site": "Jezero Crater", "rover_type": "Mars Rover", "has_helicopter": true}'
  ),
  ('a0000000-0000-0000-0000-000000000004', 'Hubble Space Telescope', 'NASA/ESA',
   'Iconic space telescope in low Earth orbit that has transformed our understanding of the universe since 1990.',
   '1990-04-24T12:33:00Z', 'active',
   '{"orbit_altitude_km": 537, "mirror_diameter_m": 2.4}'
  ),
  ('a0000000-0000-0000-0000-000000000005', 'Artemis Program', 'NASA',
   'NASAs program to return humans to the Moon and establish sustainable lunar exploration by the late 2020s.',
   NULL, 'active',
   '{"goal": "Lunar return", "target": "South Pole"}'
  ),
  ('a0000000-0000-0000-0000-000000000006', 'Cassini-Huygens', 'NASA/ESA/ASI',
   'Mission that orbited Saturn for 13 years, revealing its rings, moons, and depositing the Huygens probe on Titan.',
   '1997-10-15T08:43:00Z', 'completed',
   '{"end_date": "2017-09-15", "mission_duration_years": 19.9, "titan_probe": true}'
  ),
  ('a0000000-0000-0000-0000-000000000007', 'New Horizons', 'NASA',
   'First spacecraft to explore Pluto and the Kuiper Belt, now traveling through the outer Solar System.',
   '2006-01-19T19:00:00Z', 'active',
   '{"pluto_flyby": "2015-07-14", "current_region": "Kuiper Belt"}'
  )
ON CONFLICT (name) DO UPDATE
  SET description = EXCLUDED.description,
      status = EXCLUDED.status,
      metadata = EXCLUDED.metadata;

-- ============================================================
-- MISSION ↔ OBJECT relationships
-- ============================================================

INSERT INTO mission_objects (mission_id, object_id, relationship_type)
VALUES
  -- Perseverance → Mars
  ('a0000000-0000-0000-0000-000000000003', '123e4567-e89b-12d3-a456-426614174004', 'target'),
  -- Artemis → Moon
  ('a0000000-0000-0000-0000-000000000005', '123e4567-e89b-12d3-a456-426614174021', 'target'),
  -- Cassini → Saturn
  ('a0000000-0000-0000-0000-000000000006', '123e4567-e89b-12d3-a456-426614174006', 'orbit')
ON CONFLICT (mission_id, object_id) DO NOTHING;

-- ============================================================
-- CELESTIAL EVENTS — Near-future events (adjust dates as needed)
-- ============================================================

INSERT INTO celestial_events (name, event_type, description, starts_at, ends_at, peak_at, metadata)
VALUES
  ('Perseid Meteor Shower 2025', 'meteor_shower',
   'One of the best annual meteor showers, producing up to 100 meteors per hour at peak under ideal conditions. Associated with Comet Swift-Tuttle.',
   '2025-07-17T00:00:00Z', '2025-08-24T00:00:00Z', '2025-08-12T22:00:00Z',
   '{"peak_rate": 100, "radiant": "Perseus", "parent_comet": "Swift-Tuttle", "best_viewing": "Northern Hemisphere"}'
  ),
  ('Leonid Meteor Shower 2025', 'meteor_shower',
   'The Leonid meteor shower is associated with Comet Tempel-Tuttle. Can produce storm years with thousands of meteors per hour.',
   '2025-11-03T00:00:00Z', '2025-11-20T00:00:00Z', '2025-11-17T05:00:00Z',
   '{"peak_rate": 15, "radiant": "Leo", "parent_comet": "Tempel-Tuttle"}'
  ),
  ('Jupiter at Opposition 2025', 'opposition',
   'Jupiter reaches opposition, rising at sunset and setting at sunrise. The planet will be at its closest to Earth and fully illuminated by the Sun.',
   '2025-12-07T00:00:00Z', '2025-12-08T00:00:00Z', '2025-12-07T20:00:00Z',
   '{"magnitude": -2.8, "angular_diameter_arcsec": 49.9, "constellation": "Gemini"}'
  ),
  ('Total Lunar Eclipse 2025', 'lunar_eclipse',
   'A total lunar eclipse visible from North and South America, Europe, and Africa. The Moon will turn reddish-orange during totality.',
   '2025-09-07T17:28:00Z', '2025-09-07T21:55:00Z', '2025-09-07T19:11:00Z',
   '{"type": "total", "totality_duration_min": 64, "visibility": "Americas, Europe, Africa, Asia"}'
  ),
  ('Venus Greatest Elongation 2025', 'elongation',
   'Venus reaches its greatest eastern elongation, appearing highest in the western sky after sunset. Excellent viewing opportunity.',
   '2025-01-10T00:00:00Z', '2025-01-11T00:00:00Z', '2025-01-10T18:00:00Z',
   '{"elongation_deg": 47.1, "magnitude": -4.5, "type": "eastern"}'
  ),
  ('Geminid Meteor Shower 2025', 'meteor_shower',
   'The Geminids are considered one of the best annual meteor showers, producing up to 120 multicolored meteors per hour.',
   '2025-12-04T00:00:00Z', '2025-12-17T00:00:00Z', '2025-12-14T02:00:00Z',
   '{"peak_rate": 120, "radiant": "Gemini", "parent_body": "3200 Phaethon (asteroid)", "colors": "white, yellow, red, blue, green"}'
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- DESTINATIONS — Famous Astronomy Locations
-- ============================================================

INSERT INTO destinations (id, name, slug, description, country_code, region, location, elevation_m, sky_quality, light_pollution_class, website_url, metadata)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Mauna Kea Observatories', 'mauna-kea',
   'Located atop the dormant volcano Mauna Kea on Hawaii, this is one of the worlds most important astronomical research centers. Exceptional atmospheric clarity and minimal light pollution.',
   'US', 'Hawaii', ST_SetSRID(ST_MakePoint(-155.4681, 19.8207), 4326),
   4205, 9.5, '1', 'https://www.ifa.hawaii.edu/mko/',
   '{"telescopes": ["Keck I", "Keck II", "Subaru", "CFHT", "UKIRT"], "accessible": true}'
  ),
  ('d0000000-0000-0000-0000-000000000002', 'Atacama Desert, Chile', 'atacama-desert',
   'One of the driest places on Earth, home to ALMA, ESOs Paranal Observatory (VLT), and some of the clearest skies on the planet.',
   'CL', 'Antofagasta', ST_SetSRID(ST_MakePoint(-68.1193, -24.6268), 4326),
   2400, 9.8, '1', 'https://www.eso.org/public/chile/',
   '{"observatories": ["ALMA", "VLT/Paranal", "La Silla"], "humidity_percent": 0}'
  ),
  ('d0000000-0000-0000-0000-000000000003', 'NamibRand Nature Reserve', 'namibrand',
   'Africa''s first International Dark Sky Reserve. Offers pristine dark skies in the Namib Desert with exceptional Milky Way views.',
   'NA', 'Hardap', ST_SetSRID(ST_MakePoint(16.3, -25.0), 4326),
   1100, 9.2, '1', 'https://www.namibrand.com/',
   '{"designation": "International Dark Sky Reserve", "milky_way_visible": true}'
  ),
  ('d0000000-0000-0000-0000-000000000004', 'Cherry Springs State Park', 'cherry-springs',
   'One of the darkest spots in the eastern United States, designated as a Gold-Tier International Dark Sky Park.',
   'US', 'Pennsylvania', ST_SetSRID(ST_MakePoint(-77.8256, 41.6623), 4326),
   670, 8.5, '2', 'https://www.dcnr.pa.gov/StateParks/FindAPark/CherrySpringsStatePark/',
   '{"designation": "Gold Tier IDA Dark Sky Park", "star_field": "Astronomy Field of Penn''s Woods"}'
  ),
  ('d0000000-0000-0000-0000-000000000005', 'La Palma, Canary Islands', 'la-palma',
   'Home to the Roque de los Muchachos Observatory, one of the worlds best astronomical sites. Protected by strict lighting ordinances.',
   'ES', 'Canary Islands', ST_SetSRID(ST_MakePoint(-17.8922, 28.7566), 4326),
   2396, 9.0, '1', 'https://www.iac.es/en',
   '{"observatories": ["GTC", "WHT", "INT", "NOT"], "designation": "Starlight Reserve"}'
  )
ON CONFLICT (slug) DO UPDATE
  SET description = EXCLUDED.description,
      metadata = EXCLUDED.metadata,
      updated_at = now();

-- Activities for destinations
INSERT INTO destination_activities (destination_id, activity_type, description)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'observatory', 'Keck Observatory tours and public stargazing programs'),
  ('d0000000-0000-0000-0000-000000000001', 'astrophotography', 'Exceptional conditions for deep-sky and Milky Way photography'),
  ('d0000000-0000-0000-0000-000000000002', 'research', 'ALMA and VLT access for professional researchers'),
  ('d0000000-0000-0000-0000-000000000002', 'astrophotography', 'Sub-zero humidity enables extraordinary long-exposure imaging'),
  ('d0000000-0000-0000-0000-000000000003', 'stargazing', 'Pure dark sky experience with zero light pollution'),
  ('d0000000-0000-0000-0000-000000000003', 'camping', 'Desert camping under the Milky Way'),
  ('d0000000-0000-0000-0000-000000000004', 'stargazing', 'Dedicated astronomy observing field with 360° dark horizon'),
  ('d0000000-0000-0000-0000-000000000005', 'observatory', 'Gran Telescopio Canarias public outreach programs'),
  ('d0000000-0000-0000-0000-000000000005', 'education', 'IAC Astrophysics Institute visitor programs')
ON CONFLICT DO NOTHING;
