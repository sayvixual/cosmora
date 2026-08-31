-- ============================================================
-- COSMORA — Secure RLS Migration
-- Drops open demo policies and enforces auth.uid() ownership
-- ============================================================

-- 1. PROFILES
DROP POLICY IF EXISTS "Demo allow all profiles" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- 2. OBSERVATIONS
DROP POLICY IF EXISTS "Demo allow all observations" ON observations;
CREATE POLICY "Users can read own observations" ON observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own observations" ON observations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own observations" ON observations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own observations" ON observations FOR DELETE USING (auth.uid() = user_id);

-- 3. OBSERVATION MEDIA
DROP POLICY IF EXISTS "Demo allow all observation_media" ON observation_media;
CREATE POLICY "Users can read own observation media" ON observation_media FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM observations
    WHERE observations.id = observation_media.observation_id
    AND observations.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own observation media" ON observation_media FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM observations
    WHERE observations.id = observation_media.observation_id
    AND observations.user_id = auth.uid()
  )
);
CREATE POLICY "Users can delete own observation media" ON observation_media FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM observations
    WHERE observations.id = observation_media.observation_id
    AND observations.user_id = auth.uid()
  )
);

-- 4. RESEARCH NOTES
DROP POLICY IF EXISTS "Demo allow all research_notes" ON research_notes;
CREATE POLICY "Users can read own research notes" ON research_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own research notes" ON research_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own research notes" ON research_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own research notes" ON research_notes FOR DELETE USING (auth.uid() = user_id);

-- 5. SAVED OBJECTS
DROP POLICY IF EXISTS "Demo allow all saved_objects" ON saved_objects;
CREATE POLICY "Users can read own saved objects" ON saved_objects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved objects" ON saved_objects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved objects" ON saved_objects FOR DELETE USING (auth.uid() = user_id);

-- 6. AI CONVERSATIONS
DROP POLICY IF EXISTS "Demo allow all ai_conversations" ON ai_conversations;
CREATE POLICY "Users can read own ai conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own ai conversations" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ai conversations" ON ai_conversations FOR DELETE USING (auth.uid() = user_id);
