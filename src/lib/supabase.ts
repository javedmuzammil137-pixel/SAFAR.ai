import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KARACHI_PLACES } from '../data/karachiPlaces';
import { Place, Trip, UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const realSupabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys
const LOCAL_STORAGE_USER_KEY = 'safar_ai_current_user';
const LOCAL_STORAGE_TRIPS_KEY = 'safar_ai_saved_trips';
const LOCAL_STORAGE_PLACES_KEY = 'safar_ai_places';

export const SUPABASE_SCHEMA_SQL = `
-- Safar.ai Karachi Trip Planner Database Schema
-- Run this in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS public.places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  category TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  entry_cost NUMERIC DEFAULT 0,
  food_cost NUMERIC DEFAULT 0,
  rating NUMERIC NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  duration_hours NUMERIC NOT NULL,
  best_time_window TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  budget_tier TEXT NOT NULL,
  traveler_fit TEXT[] DEFAULT '{}',
  local_tips TEXT[] DEFAULT '{}',
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  duration_type TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  traveler_group TEXT NOT NULL,
  transport_pref TEXT NOT NULL,
  total_cost NUMERIC NOT NULL,
  stops JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, trip_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to places" ON public.places FOR SELECT USING (true);
CREATE POLICY "Allow users to view own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);
`;

// In-Memory & LocalStorage client implementation matching Supabase interface
export const dbService = {
  // Authentication
  async getCurrentUser(): Promise<UserProfile | null> {
    if (realSupabase) {
      const { data: { user } } = await realSupabase.auth.getUser();
      if (!user) return null;
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Karachi Explorer',
        created_at: user.created_at,
      };
    }
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  async signUp(email: string, password: string, name: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (realSupabase) {
      const { data, error } = await realSupabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return { user: null, error: error.message };
      const user = data.user ? {
        id: data.user.id,
        email: data.user.email || email,
        name: name,
        created_at: data.user.created_at,
      } : null;
      return { user, error: null };
    }

    // Local simulation
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split('@')[0],
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    return { user: newUser, error: null };
  },

  async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (realSupabase) {
      const { data, error } = await realSupabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error: error.message };
      const user = data.user ? {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        created_at: data.user.created_at,
      } : null;
      return { user, error: null };
    }

    // Local simulation
    const newUser: UserProfile = {
      id: 'usr_local_khi',
      email,
      name: email.split('@')[0] || 'Karachi Traveler',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    return { user: newUser, error: null };
  },

  async signOut(): Promise<void> {
    if (realSupabase) {
      await realSupabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  // Places
  async getPlaces(): Promise<Place[]> {
    if (realSupabase) {
      try {
        const { data, error } = await realSupabase.from('places').select('*');
        if (!error && data && data.length > 0) {
          return data as Place[];
        }
      } catch (e) {
        console.warn('Falling back to local Karachi places dataset', e);
      }
    }
    const local = localStorage.getItem(LOCAL_STORAGE_PLACES_KEY);
    if (!local) {
      localStorage.setItem(LOCAL_STORAGE_PLACES_KEY, JSON.stringify(KARACHI_PLACES));
      return KARACHI_PLACES;
    }
    return JSON.parse(local);
  },

  // Trips
  async saveTrip(trip: Trip): Promise<{ success: boolean; id?: string }> {
    const tripToSave = {
      ...trip,
      id: trip.id || 'trip_' + Date.now(),
      created_at: new Date().toISOString(),
      is_saved: true,
    };

    if (realSupabase) {
      try {
        const { data, error } = await realSupabase.from('trips').insert([
          {
            id: tripToSave.id,
            user_id: tripToSave.user_id,
            title: tripToSave.title,
            budget: tripToSave.budget,
            duration_type: tripToSave.duration_type,
            interests: tripToSave.interests,
            traveler_group: tripToSave.traveler_group,
            transport_pref: tripToSave.transport_pref,
            total_cost: tripToSave.total_cost,
            stops: tripToSave.stops,
          }
        ]).select();
        if (!error) return { success: true, id: tripToSave.id };
      } catch (err) {
        console.warn('Supabase remote insert failed, caching locally', err);
      }
    }

    // Local storage persistence
    const savedTripsRaw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    const trips: Trip[] = savedTripsRaw ? JSON.parse(savedTripsRaw) : [];
    const existingIndex = trips.findIndex(t => t.id === tripToSave.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = tripToSave;
    } else {
      trips.unshift(tripToSave);
    }
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
    return { success: true, id: tripToSave.id };
  },

  async getSavedTrips(userId?: string): Promise<Trip[]> {
    if (realSupabase && userId) {
      try {
        const { data, error } = await realSupabase
          .from('trips')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data as Trip[];
        }
      } catch (err) {
        console.warn('Supabase trips query failed, using local', err);
      }
    }

    const savedTripsRaw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    return savedTripsRaw ? JSON.parse(savedTripsRaw) : [];
  },

  async deleteTrip(tripId: string): Promise<boolean> {
    if (realSupabase) {
      try {
        await realSupabase.from('trips').delete().eq('id', tripId);
      } catch (err) {
        console.warn('Supabase delete trip failed', err);
      }
    }

    const savedTripsRaw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (savedTripsRaw) {
      const trips: Trip[] = JSON.parse(savedTripsRaw);
      const filtered = trips.filter(t => t.id !== tripId);
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }
};
