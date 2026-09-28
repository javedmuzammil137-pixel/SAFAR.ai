export type KarachiArea = 
  | 'Saddar'
  | 'Clifton'
  | 'DHA'
  | 'Shahrah-e-Faisal'
  | 'Gulshan-e-Iqbal'
  | 'Kemari / Manora'
  | 'Bahria / Outskirts'
  | 'Civil Lines'
  | 'PECHS';

export type PlaceCategory = 
  | 'food'
  | 'beach'
  | 'heritage'
  | 'bazaars'
  | 'adventure'
  | 'cafes';

export type TimeWindow = 'Morning' | 'Afternoon' | 'Sunset' | 'Night';
export type BudgetTier = 'low' | 'balanced' | 'luxury';
export type TravelerGroup = 'solo' | 'friends' | 'family' | 'couple';
export type TransportPreference = 'bykea_rickshaw' | 'careem_ac' | 'personal_car';
export type DurationType = 'half_day' | 'full_day' | 'weekend' | 'three_days';

export interface Place {
  id: string;
  name: string;
  area: KarachiArea;
  category: PlaceCategory;
  cost: number; // PKR estimated total activity/meal/entry
  entry_cost: number; // PKR entry ticket
  food_cost: number; // PKR typical meal/chai
  rating: number; // e.g. 4.8
  description: string;
  image_url: string;
  duration_hours: number;
  best_time_window: TimeWindow;
  lat: number;
  lng: number;
  budget_tier: BudgetTier;
  traveler_fit: TravelerGroup[];
  local_tips: string[];
  address: string;
  is_free?: boolean;
  must_try_food?: boolean;
}

export interface TripPreferences {
  budget: number; // in PKR (e.g. 3500)
  duration_type: DurationType;
  interests: PlaceCategory[];
  traveler_group: TravelerGroup;
  transport_pref: TransportPreference;
}

export interface ItineraryStop {
  place: Place;
  order_index: number;
  arrival_time: string;
  departure_time: string;
  cost: number;
  transport_cost_to_next: number;
  transport_mode: string;
  travel_time_mins: number;
  traffic_note?: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  budget: number;
  duration_type: DurationType;
  interests: PlaceCategory[];
  traveler_group: TravelerGroup;
  transport_pref: TransportPreference;
  total_cost: number;
  stops: ItineraryStop[];
  created_at: string;
  is_saved?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}
