// ============================================================
// COSMORA — Supabase Database TypeScript Types
// Auto-aligned with 001_initial_schema.sql
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ── ASTRONOMY ──────────────────────────────────────────
      celestial_objects: {
        Row: {
          id: string;
          object_type: string;
          name: string;
          canonical_name: string;
          slug: string;
          description: string | null;
          right_ascension: number | null;
          declination: number | null;
          distance_value: number | null;
          distance_unit: string | null;
          magnitude: number | null;
          metadata: Json;
          geometry: unknown | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['celestial_objects']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['celestial_objects']['Insert']>;
      };

      scientific_facts: {
        Row: {
          id: string;
          object_id: string;
          fact_key: string;
          value_numeric: number | null;
          value_text: string | null;
          unit: string | null;
          source_id: string | null;
          valid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scientific_facts']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['scientific_facts']['Insert']>;
      };

      celestial_events: {
        Row: {
          id: string;
          event_type: string;
          name: string;
          description: string | null;
          starts_at: string;
          ends_at: string | null;
          peak_at: string | null;
          metadata: Json;
          source_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['celestial_events']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['celestial_events']['Insert']>;
      };

      event_objects: {
        Row: {
          event_id: string;
          object_id: string;
          role: string | null;
        };
        Insert: Database['public']['Tables']['event_objects']['Row'];
        Update: Partial<Database['public']['Tables']['event_objects']['Row']>;
      };

      missions: {
        Row: {
          id: string;
          name: string;
          agency: string | null;
          description: string | null;
          launch_at: string | null;
          status: string;
          metadata: Json;
          source_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['missions']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['missions']['Insert']>;
      };

      mission_objects: {
        Row: {
          mission_id: string;
          object_id: string;
          relationship_type: string | null;
        };
        Insert: Database['public']['Tables']['mission_objects']['Row'];
        Update: Partial<Database['public']['Tables']['mission_objects']['Row']>;
      };

      // ── DESTINATIONS ───────────────────────────────────────
      destinations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          country_code: string | null;
          region: string | null;
          location: unknown;
          elevation_m: number | null;
          sky_quality: number | null;
          light_pollution_class: string | null;
          website_url: string | null;
          metadata: Json;
          source_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['destinations']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>;
      };

      destination_activities: {
        Row: {
          id: string;
          destination_id: string;
          activity_type: string;
          description: string | null;
          requirements: Json;
        };
        Insert: Omit<Database['public']['Tables']['destination_activities']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['destination_activities']['Insert']>;
      };

      destination_objects: {
        Row: {
          destination_id: string;
          object_id: string;
          visibility_notes: string | null;
          best_season: Json | null;
        };
        Insert: Database['public']['Tables']['destination_objects']['Row'];
        Update: Partial<Database['public']['Tables']['destination_objects']['Row']>;
      };

      // ── USER DATA ──────────────────────────────────────────
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          experience_level: string;
          location: unknown | null;
          equipment: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };

      observations: {
        Row: {
          id: string;
          user_id: string | null;
          object_id: string | null;
          event_id: string | null;
          destination_id: string | null;
          observed_at: string;
          location: unknown | null;
          notes: string | null;
          equipment: Json;
          visibility_context: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['observations']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['observations']['Insert']>;
      };

      observation_media: {
        Row: {
          id: string;
          observation_id: string;
          storage_path: string;
          media_type: string | null;
          caption: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['observation_media']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['observation_media']['Insert']>;
      };

      research_notes: {
        Row: {
          id: string;
          user_id: string | null;
          object_id: string | null;
          mission_id: string | null;
          title: string;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['research_notes']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['research_notes']['Insert']>;
      };

      saved_objects: {
        Row: {
          user_id: string;
          object_id: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['saved_objects']['Row'];
        Update: Partial<Database['public']['Tables']['saved_objects']['Row']>;
      };

      // ── AI KNOWLEDGE ───────────────────────────────────────
      knowledge_documents: {
        Row: {
          id: string;
          title: string;
          document_type: string | null;
          source_id: string | null;
          content_hash: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['knowledge_documents']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['knowledge_documents']['Insert']>;
      };

      knowledge_chunks: {
        Row: {
          id: string;
          document_id: string;
          chunk_index: number;
          content: string;
          embedding: number[] | null;
          token_count: number | null;
          metadata: Json;
        };
        Insert: Omit<Database['public']['Tables']['knowledge_chunks']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['knowledge_chunks']['Insert']>;
      };

      ai_conversations: {
        Row: {
          id: string;
          user_id: string | null;
          context_object_id: string | null;
          context_event_id: string | null;
          session_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>;
      };

      source_references: {
        Row: {
          id: string;
          provider: string;
          source_type: string;
          external_id: string | null;
          title: string | null;
          url: string | null;
          retrieved_at: string | null;
          license_notes: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['source_references']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['source_references']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ── Convenience row types ──────────────────────────────────
export type CelestialObjectRow = Database['public']['Tables']['celestial_objects']['Row'];
export type CelestialEventRow = Database['public']['Tables']['celestial_events']['Row'];
export type MissionRow = Database['public']['Tables']['missions']['Row'];
export type DestinationRow = Database['public']['Tables']['destinations']['Row'];
export type ObservationRow = Database['public']['Tables']['observations']['Row'];
export type ResearchNoteRow = Database['public']['Tables']['research_notes']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ScientificFactRow = Database['public']['Tables']['scientific_facts']['Row'];
export type AiConversationRow = Database['public']['Tables']['ai_conversations']['Row'];
