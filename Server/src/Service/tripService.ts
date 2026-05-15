import { getSupabaseClient } from '@/Config/Db.js';
import { Trip, TripInsert, TripUpdate } from '@/Types/database.js';

/**
 * Trip Service
 * Handles database operations for trips.
 * Creates a request-scoped Supabase client using the provided token for RLS compliance.
 */

export const createTrip = async (token: string, tripData: TripInsert) => {
  const supabase = getSupabaseClient(token);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('trips') as any)
    .insert(tripData)
    .select()
    .single();

  if (error) throw error;
  return data as Trip;
};

export const getTrips = async (token: string, userId: string) => {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Trip[];
};

export const getTripById = async (token: string, id: string) => {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Trip;
};

export const updateTrip = async (token: string, id: string, tripData: TripUpdate) => {
  const supabase = getSupabaseClient(token);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('trips') as any)
    .update(tripData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Trip;
};

export const deleteTrip = async (token: string, id: string) => {
  const supabase = getSupabaseClient(token);
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
