import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KARACHI_PLACES } from '../data/karachiPlaces';
import { Place, Trip, UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validates whether Supabase environment variables are provided and not placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

export const realSupabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local Storage Keys for reliable fallback
const LOCAL_STORAGE_USER_KEY = 'safar_ai_current_user';
const LOCAL_STORAGE_TRIPS_KEY = 'safar_ai_saved_trips';
const LOCAL_STORAGE_PLACES_KEY = 'safar_ai_places';

// UUID validation regex to ensure compatibility with PostgreSQL UUID columns
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const SUPABASE_SCHEMA_SQL = `
-- Safar.ai Karachi Trip Planner Database Schema
-- Run this in your Supabase SQL Editor:

-- 1. USERS PROFILE TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PLACES TABLE
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
  is_free BOOLEAN DEFAULT FALSE,
  must_try_food BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  duration_type TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  traveler_group TEXT NOT NULL,
  transport_pref TEXT NOT NULL,
  total_cost NUMERIC NOT NULL,
  stops JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TRIP_PLACES TABLE
CREATE TABLE IF NOT EXISTS public.trip_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  place_id TEXT REFERENCES public.places(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  arrival_time TEXT NOT NULL,
  departure_time TEXT,
  cost NUMERIC NOT NULL,
  transport_cost_to_next NUMERIC DEFAULT 0,
  transport_mode TEXT,
  travel_time_mins INTEGER DEFAULT 0,
  traffic_note TEXT
);

-- 5. SAVED_TRIPS TABLE
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
ALTER TABLE public.trip_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to places" ON public.places FOR SELECT USING (true);
CREATE POLICY "Allow public insert to places" ON public.places FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to view own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Allow users to insert own trips" ON public.trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Allow read trip places" ON public.trip_places FOR SELECT USING (true);
CREATE POLICY "Allow insert trip places" ON public.trip_places FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read saved trips" ON public.saved_trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert saved trips" ON public.saved_trips FOR INSERT WITH CHECK (auth.uid() = user_id);
`;

export const dbService = {
  // Test connection live status
  async testConnection(): Promise<{
    connected: boolean;
    provider: 'supabase' | 'local';
    latencyMs?: number;
    placesCount?: number;
    error?: string;
  }> {
    if (!realSupabase) {
      return {
        connected: true,
        provider: 'local',
        placesCount: KARACHI_PLACES.length,
      };
    }

    const start = Date.now();
    try {
      const { count, error } = await realSupabase
        .from('places')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return {
          connected: false,
          provider: 'supabase',
          error: error.message,
        };
      }

      return {
        connected: true,
        provider: 'supabase',
        latencyMs: Date.now() - start,
        placesCount: count ?? 0,
      };
    } catch (err: any) {
      return {
        connected: false,
        provider: 'supabase',
        error: err?.message || 'Connection timeout',
      };
    }
  },

  // Auth State Listener
  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (realSupabase) {
      const { data: { subscription } } = realSupabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const user: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Karachi Explorer',
            created_at: session.user.created_at,
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
          callback(user);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          callback(null);
        }
      });
      return () => subscription.unsubscribe();
    }
    return () => {};
  },

  // Authentication
  async getCurrentUser(): Promise<UserProfile | null> {
    if (realSupabase) {
      try {
        const { data: { user } } = await realSupabase.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Karachi Explorer',
            created_at: user.created_at,
          };
        }
      } catch (err) {
        console.warn('Supabase auth.getUser() error, checking local cache:', err);
      }
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

      if (user) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
        // Optional profile insert
        try {
          await realSupabase.from('users').upsert({
            id: user.id,
            name: user.name,
            email: user.email,
          });
        } catch (_) {}
      }
      return { user, error: null };
    }

    // Local simulation
    const newUser: UserProfile = {
      id: generateUUID(),
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

      if (user) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      }
      return { user, error: null };
    }

    // Local simulation
    const newUser: UserProfile = {
      id: generateUUID(),
      email,
      name: email.split('@')[0] || 'Karachi Traveler',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    return { user: newUser, error: null };
  },

  async signOut(): Promise<void> {
    if (realSupabase) {
      try {
        await realSupabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  // Auto-seeding for Supabase places table
  async seedPlacesIfEmpty(): Promise<void> {
    if (!realSupabase) return;
    try {
      const { count, error } = await realSupabase
        .from('places')
        .select('*', { count: 'exact', head: true });

      if (!error && (count === 0 || count === null)) {
        console.log('Seeding Supabase places table with Karachi dataset...');
        const payload = KARACHI_PLACES.map((p) => ({
          id: p.id,
          name: p.name,
          area: p.area,
          category: p.category,
          cost: p.cost,
          entry_cost: p.entry_cost,
          food_cost: p.food_cost,
          rating: p.rating,
          description: p.description,
          image_url: p.image_url,
          duration_hours: p.duration_hours,
          best_time_window: p.best_time_window,
          lat: p.lat,
          lng: p.lng,
          budget_tier: p.budget_tier,
          traveler_fit: p.traveler_fit,
          local_tips: p.local_tips,
          address: p.address,
          is_free: p.is_free ?? false,
          must_try_food: p.must_try_food ?? false,
        }));
        await realSupabase.from('places').upsert(payload);
      }
    } catch (err) {
      console.warn('Auto-seed check failed:', err);
    }
  },

  // Places
  async getPlaces(): Promise<Place[]> {
    if (realSupabase) {
      try {
        const { data, error } = await realSupabase.from('places').select('*');
        if (!error && data && data.length > 0) {
          return data as Place[];
        }
        // If empty, auto-seed
        await this.seedPlacesIfEmpty();
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

  // Trips & Trip Places
  async saveTrip(trip: Trip): Promise<{ success: boolean; id?: string }> {
    // Ensure trip ID is a valid UUID for PostgreSQL
    const tripId = UUID_REGEX.test(trip.id) ? trip.id : generateUUID();
    const validUserId = trip.user_id && UUID_REGEX.test(trip.user_id) ? trip.user_id : null;

    const tripToSave: Trip = {
      ...trip,
      id: tripId,
      created_at: new Date().toISOString(),
      is_saved: true,
    };

    if (realSupabase) {
      try {
        // 1. Insert into public.trips
        const { error: tripError } = await realSupabase.from('trips').upsert([
          {
            id: tripId,
            user_id: validUserId,
            title: tripToSave.title,
            budget: tripToSave.budget,
            duration_type: tripToSave.duration_type,
            interests: tripToSave.interests,
            traveler_group: tripToSave.traveler_group,
            transport_pref: tripToSave.transport_pref,
            total_cost: tripToSave.total_cost,
            stops: tripToSave.stops,
          },
        ]);

        if (!tripError) {
          // 2. Insert into relational public.trip_places
          if (tripToSave.stops && tripToSave.stops.length > 0) {
            const tripPlacesPayload = tripToSave.stops.map((stop, idx) => ({
              id: generateUUID(),
              trip_id: tripId,
              place_id: stop.place.id,
              order_index: idx + 1,
              arrival_time: stop.arrival_time,
              departure_time: stop.departure_time,
              cost: stop.cost,
              transport_cost_to_next: stop.transport_cost_to_next || 0,
              transport_mode: stop.transport_mode || 'Auto Rickshaw',
              travel_time_mins: stop.travel_time_mins || 0,
              traffic_note: stop.traffic_note || null,
            }));

            await realSupabase.from('trip_places').upsert(tripPlacesPayload);
          }

          // 3. Insert into public.saved_trips if authenticated
          if (validUserId) {
            await realSupabase.from('saved_trips').upsert([
              {
                id: generateUUID(),
                user_id: validUserId,
                trip_id: tripId,
              },
            ]);
          }

          return { success: true, id: tripId };
        } else {
          console.warn('Supabase trip insert error, saving locally:', tripError);
        }
      } catch (err) {
        console.warn('Supabase remote insert failed, caching locally', err);
      }
    }

    // Local storage persistence
    const savedTripsRaw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    const trips: Trip[] = savedTripsRaw ? JSON.parse(savedTripsRaw) : [];
    const existingIndex = trips.findIndex((t) => t.id === tripToSave.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = tripToSave;
    } else {
      trips.unshift(tripToSave);
    }
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
    return { success: true, id: tripId };
  },

  async getSavedTrips(userId?: string): Promise<Trip[]> {
    if (realSupabase) {
      try {
        let query = realSupabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId && UUID_REGEX.test(userId)) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
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
    if (realSupabase && UUID_REGEX.test(tripId)) {
      try {
        await realSupabase.from('trips').delete().eq('id', tripId);
      } catch (err) {
        console.warn('Supabase delete trip failed', err);
      }
    }

    const savedTripsRaw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (savedTripsRaw) {
      const trips: Trip[] = JSON.parse(savedTripsRaw);
      const filtered = trips.filter((t) => t.id !== tripId);
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },
};
