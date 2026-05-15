/**
 * This file defines the structure of the Supabase Database.
 * It mirrors the PostgreSQL schema defined for 'profiles' and 'trips'.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // uuid
          email: string;
          name: string | null;
          updated_at: string; // timestamp with time zone
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string; // uuid
          user_id: string; // uuid
          country: string;
          city: string[];
          travel_date: string; // ISO date string
          rating: number; // smallint (1-5)
          likes: string[]; // text[]
          hates: string[]; // text[]
          free_text: string | null;
          created_at: string; // timestamp with time zone
        };
        Insert: {
          id?: string;
          user_id: string;
          country: string;
          city: string[];
          travel_date: string;
          rating: number;
          likes?: string[];
          hates?: string[];
          free_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          country?: string;
          city?: string[];
          travel_date?: string;
          rating?: number;
          likes?: string[];
          hates?: string[];
          free_text?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Helper types for easier consumption in services/controllers
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Trip = Database['public']['Tables']['trips']['Row'];
export type TripInsert = Database['public']['Tables']['trips']['Insert'];
export type TripUpdate = Database['public']['Tables']['trips']['Update'];
