-- ============================================================
-- COSMORA — Initial Schema Migration
-- Run this in Supabase Dashboard > SQL Editor
-- Requires: pgvector, postgis extensions
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- SOURCE REFERENCES (provenance — created first, referenced by others)
-- ============================================================

CREATE TABLE IF NOT EXISTS source_references (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider      text NOT NULL,            -- e.g. NASA, ESA, JPL
  source_type   text NOT NULL,            -- dataset / api / publication
  external_id   text,
  title         text,
  url           text,
  retrieved_at  timestamptz,
  license_notes text,
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz DEFAULT now(),
  UNIQUE (provider, external_id)
);

-- ============================================================
-- CELESTIAL OBJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS celestial_objects (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_type       text NOT NULL,       -- planet/moon/star/galaxy/nebula/exoplanet/etc
  name              text NOT NULL,
  canonical_name    text UNIQUE NOT NULL,
  slug              text UNIQUE NOT NULL, -- url-safe identifier
  description       text,
  right_ascension   numeric,
  declination       numeric,
  distance_value    numeric,
  distance_unit     text,                -- pc / ly / au / km
  magnitude         numeric,
  metadata          jsonb DEFAULT '{}',
  geometry          geometry(PointZ, 4326),
  status            text DEFAULT 'active', -- active / deprecated
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_celestial_objects_canonical ON celestial_objects(canonical_name);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_type ON celestial_objects(object_type);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_slug ON celestial_objects(slug);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_name ON celestial_objects USING gin(to_tsvector('english', name));

-- ============================================================
-- SCIENTIFIC FACTS
-- ============================================================

CREATE TABLE IF NOT EXISTS scientific_facts (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_id      uuid NOT NULL REFERENCES celestial_objects(id) ON DELETE CASCADE,
  fact_key       text NOT NULL,         -- e.g. mass, radius, orbital_period
  value_numeric  numeric,
  value_text     text,
  unit           text,
  source_id      uuid REFERENCES source_references(id),
  valid_at       timestamptz,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scientific_facts_object ON scientific_facts(object_id);

-- ============================================================
-- CELESTIAL EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS celestial_events (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type   text NOT NULL,  -- eclipse/conjunction/meteor_shower/transit/etc
  name         text NOT NULL,
  description  text,
  starts_at    timestamptz NOT NULL,
  ends_at      timestamptz,
  peak_at      timestamptz,
  metadata     jsonb DEFAULT '{}',
  source_id    uuid REFERENCES source_references(id),
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_celestial_events_starts ON celestial_events(starts_at);
CREATE INDEX IF NOT EXISTS idx_celestial_events_type ON celestial_events(event_type);

-- Event ↔ Object junction
CREATE TABLE IF NOT EXISTS event_objects (
  event_id   uuid NOT NULL REFERENCES celestial_events(id) ON DELETE CASCADE,
  object_id  uuid NOT NULL REFERENCES celestial_objects(id) ON DELETE CASCADE,
  role       text,  -- primary / secondary / backdrop
  PRIMARY KEY (event_id, object_id)
);

-- ============================================================
-- MISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS missions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text UNIQUE NOT NULL,
  agency      text,  -- NASA / ESA / JAXA / SpaceX / etc
  description text,
  launch_at   timestamptz,
  status      text DEFAULT 'unknown',  -- planned/active/completed/unknown
  metadata    jsonb DEFAULT '{}',
  source_id   uuid REFERENCES source_references(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_missions_name ON missions(name);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);

-- Mission ↔ Object junction
CREATE TABLE IF NOT EXISTS mission_objects (
  mission_id        uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  object_id         uuid NOT NULL REFERENCES celestial_objects(id) ON DELETE CASCADE,
  relationship_type text,  -- target/origin/flyby/orbit/landing_site
  PRIMARY KEY (mission_id, object_id)
);

-- ============================================================
-- ASTRONOMY DESTINATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS destinations (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  text NOT NULL,
  slug                  text UNIQUE NOT NULL,
  description           text,
  country_code          text,
  region                text,
  location              geometry(Point, 4326) NOT NULL,
  elevation_m           numeric,
  sky_quality           numeric,           -- Bortle-normalized 0–10
  light_pollution_class text,              -- Bortle class 1–9
  website_url           text,
  metadata              jsonb DEFAULT '{}',
  source_id             uuid REFERENCES source_references(id),
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_location ON destinations USING GIST(location);

CREATE TABLE IF NOT EXISTS destination_activities (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id  uuid NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  activity_type   text NOT NULL,  -- stargazing/astrophotography/observatory/education/research/camping
  description     text,
  requirements    jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS destination_objects (
  destination_id    uuid NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  object_id         uuid NOT NULL REFERENCES celestial_objects(id) ON DELETE CASCADE,
  visibility_notes  text,
  best_season       jsonb,
  PRIMARY KEY (destination_id, object_id)
);

-- ============================================================
-- USER PROFILES (linked to Supabase Auth — optional for MVP)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- standalone for demo (no auth)
  display_name      text,
  experience_level  text DEFAULT 'beginner',  -- beginner/intermediate/advanced
  location          geometry(Point, 4326),
  equipment         jsonb DEFAULT '{}',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ============================================================
-- OBSERVATIONS (user-created)
-- ============================================================

CREATE TABLE IF NOT EXISTS observations (
  id                 uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            uuid REFERENCES profiles(id) ON DELETE CASCADE,
  object_id          uuid REFERENCES celestial_objects(id),
  event_id           uuid REFERENCES celestial_events(id),
  destination_id     uuid REFERENCES destinations(id),
  observed_at        timestamptz NOT NULL DEFAULT now(),
  location           geometry(Point, 4326),
  notes              text,
  equipment          jsonb DEFAULT '{}',
  visibility_context jsonb DEFAULT '{}',  -- weather, seeing, transparency
  created_at         timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_observations_user ON observations(user_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_observations_object ON observations(object_id);

CREATE TABLE IF NOT EXISTS observation_media (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  observation_id  uuid NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
  storage_path    text NOT NULL,  -- Supabase Storage path
  media_type      text,           -- image/video
  caption         text,
  metadata        jsonb DEFAULT '{}',
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- RESEARCH NOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS research_notes (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  object_id  uuid REFERENCES celestial_objects(id),
  mission_id uuid REFERENCES missions(id),
  title      text NOT NULL,
  content    text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_notes_user ON research_notes(user_id, updated_at DESC);

-- ============================================================
-- SAVED OBJECTS (bookmarks)
-- ============================================================

CREATE TABLE IF NOT EXISTS saved_objects (
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  object_id  uuid NOT NULL REFERENCES celestial_objects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, object_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_objects_user ON saved_objects(user_id);

-- ============================================================
-- AI KNOWLEDGE BASE (pgvector for semantic search)
-- ============================================================

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          text NOT NULL,
  document_type  text,  -- object_overview/mission_brief/research_article/guide
  source_id      uuid REFERENCES source_references(id),
  content_hash   text UNIQUE,
  metadata       jsonb DEFAULT '{}',
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id  uuid NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index  integer NOT NULL,
  content      text NOT NULL,
  embedding    vector(1536),  -- adjust dim based on embedding model
  token_count  integer,
  metadata     jsonb DEFAULT '{}'
);

-- HNSW vector index for fast semantic search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ============================================================
-- AI CONVERSATIONS (lightweight metadata only)
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid REFERENCES profiles(id) ON DELETE SET NULL,
  context_object_id uuid REFERENCES celestial_objects(id) ON DELETE SET NULL,
  context_event_id  uuid REFERENCES celestial_events(id) ON DELETE SET NULL,
  session_metadata  jsonb DEFAULT '{}',  -- model used, tool calls count, etc
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id, created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER (auto-update timestamps)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_celestial_objects_updated_at
  BEFORE UPDATE ON celestial_objects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — permissive for demo/hackathon
-- Public read on astronomical data; user writes for personal data
-- ============================================================

-- Public readonly tables (no auth needed)
ALTER TABLE celestial_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read celestial_objects" ON celestial_objects FOR SELECT USING (true);

ALTER TABLE scientific_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read scientific_facts" ON scientific_facts FOR SELECT USING (true);

ALTER TABLE celestial_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read celestial_events" ON celestial_events FOR SELECT USING (true);

ALTER TABLE event_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read event_objects" ON event_objects FOR SELECT USING (true);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read missions" ON missions FOR SELECT USING (true);

ALTER TABLE mission_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mission_objects" ON mission_objects FOR SELECT USING (true);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);

ALTER TABLE destination_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read destination_activities" ON destination_activities FOR SELECT USING (true);

ALTER TABLE destination_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read destination_objects" ON destination_objects FOR SELECT USING (true);

ALTER TABLE source_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read source_references" ON source_references FOR SELECT USING (true);

ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read knowledge_documents" ON knowledge_documents FOR SELECT USING (true);

ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read knowledge_chunks" ON knowledge_chunks FOR SELECT USING (true);

-- User-owned tables — for demo: allow all (no auth required)
-- In production: replace with auth.uid() checks
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo allow all profiles" ON profiles FOR ALL USING (true);

ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo allow all observations" ON observations FOR ALL USING (true);

ALTER TABLE observation_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo allow all observation_media" ON observation_media FOR ALL USING (true);

ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo allow all research_notes" ON research_notes FOR ALL USING (true);

ALTER TABLE saved_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo allow all saved_objects" ON saved_objects FOR ALL USING (true);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo allow all ai_conversations" ON ai_conversations FOR ALL USING (true);
