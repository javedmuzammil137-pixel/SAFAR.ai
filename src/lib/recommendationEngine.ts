import { KARACHI_PLACES } from '../data/karachiPlaces';
import {
  DurationType,
  ItineraryStop,
  Place,
  PlaceCategory,
  TransportPreference,
  TripPreferences,
} from '../types';

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Maps Karachi areas to geographic traffic clusters to avoid Shahrah-e-Faisal bottlenecks
 */
export function getAreaCluster(area: string): string {
  switch (area) {
    case 'Saddar':
    case 'Civil Lines':
    case 'PECHS':
      return 'South-Central Hub (Old City & Saddar)';
    case 'Clifton':
    case 'DHA':
      return 'South Coastal Hub (Clifton & DHA)';
    case 'Shahrah-e-Faisal':
    case 'Gulshan-e-Iqbal':
      return 'East Corridor (Shahrah-e-Faisal)';
    case 'Kemari / Manora':
      return 'Harbor & Marine Strip';
    case 'Bahria / Outskirts':
      return 'Outskirts Highway Hub';
    default:
      return 'Karachi Central';
  }
}

/**
 * Calculates transport fare and travel duration based on distance and transport mode
 */
export function calculateTransportLeg(
  fromPlace: Place,
  toPlace: Place,
  mode: TransportPreference
): { cost: number; durationMins: number; note: string } {
  const km = calculateDistanceKm(fromPlace.lat, fromPlace.lng, toPlace.lat, toPlace.lng);

  let cost = 0;
  let speedKmH = 22; // Average Karachi traffic speed
  let note = '';

  if (mode === 'bykea_rickshaw') {
    cost = Math.max(150, Math.round(120 + km * 45));
    speedKmH = 26; // Rickshaws and bikes bypass gridlock easily
    note = km > 8 ? 'Long rickshaw leg across traffic; hold tight' : 'Quick local rickshaw hop';
  } else if (mode === 'careem_ac') {
    cost = Math.max(380, Math.round(280 + km * 90));
    speedKmH = 20; // Cars move slower during rush hour
    note = 'AC ride via Shahrah-e-Faisal / Khayaban-e-Iqbal';
  } else {
    // Personal car petrol
    cost = Math.max(120, Math.round(80 + km * 40));
    speedKmH = 20;
    note = 'Personal vehicle fuel estimate + parking';
  }

  // Add traffic peak delay if crossing Shahrah-e-Faisal
  const crossCorridor =
    (fromPlace.area === 'Clifton' && toPlace.area === 'Shahrah-e-Faisal') ||
    (fromPlace.area === 'Saddar' && toPlace.area === 'DHA');

  let durationMins = Math.max(12, Math.round((km / speedKmH) * 60));
  if (crossCorridor) {
    durationMins += 15;
    note += ' (Includes +15m Shahrah-e-Faisal bottleneck allowance)';
  }

  return { cost, durationMins, note };
}

/**
 * Core Rule-Based Scoring Engine
 * Deterministically ranks Karachi places by budget-fit, category overlap,
 * group suitability, and area clustering.
 */
export function getRecommendedPlaces(
  prefs: TripPreferences,
  allPlaces: Place[] = KARACHI_PLACES
): (Place & { score: number; scoreReasons: string[] })[] {
  const targetStops = prefs.duration_type === 'half_day' ? 3 : prefs.duration_type === 'full_day' ? 5 : 7;
  const targetPerStopSpend = Math.max(300, Math.round((prefs.budget * 0.75) / targetStops));

  return allPlaces
    .map((place) => {
      let score = 50;
      const scoreReasons: string[] = [];

      // 1. Interest Match (+35 pts per matching category)
      if (prefs.interests.includes(place.category)) {
        score += 35;
        scoreReasons.push(`Matches interest: ${place.category}`);
      }

      // 2. Traveler Group Match (+25 pts)
      if (place.traveler_fit.includes(prefs.traveler_group)) {
        score += 25;
        scoreReasons.push(`Optimized for ${prefs.traveler_group} travelers`);
      }

      // 3. Rating Weight (up to +20 pts)
      score += (place.rating - 4.0) * 20;

      // 4. Budget Constraint Fitness
      // Place cost should not exceed 60% of entire trip budget
      if (place.cost > prefs.budget * 0.65) {
        score -= 40;
        scoreReasons.push('Exceeds safe single-stop allocation');
      } else {
        const diff = Math.abs(place.cost - targetPerStopSpend);
        const costFitPct = Math.max(0, 1 - diff / targetPerStopSpend);
        const budgetBonus = Math.round(costFitPct * 20);
        score += budgetBonus;
        if (place.cost <= targetPerStopSpend) {
          scoreReasons.push(`Budget friendly (Rs. ${place.cost})`);
        }
      }

      // 5. Must-try local culinary landmark boost
      if (place.must_try_food && prefs.interests.includes('food')) {
        score += 15;
        scoreReasons.push('Iconic Karachi culinary heritage');
      }

      return {
        ...place,
        score: Math.round(score),
        scoreReasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Builds a clustered, traffic-optimized 1-Day Karachi Itinerary from selected places
 */
export function buildClusteredItinerary(
  selectedPlaces: Place[],
  prefs: TripPreferences
): ItineraryStop[] {
  if (selectedPlaces.length === 0) return [];

  // Group sequencing by best time window: Morning -> Afternoon -> Sunset -> Night
  const timeWeight: Record<string, number> = {
    Morning: 1,
    Afternoon: 2,
    Sunset: 3,
    Night: 4,
  };

  // Sort by time window first
  const sequenced = [...selectedPlaces].sort(
    (a, b) => timeWeight[a.best_time_window] - timeWeight[b.best_time_window]
  );

  const itinerary: ItineraryStop[] = [];
  const startHour = prefs.duration_type === 'half_day' ? 14 : 9; // 2 PM or 9 AM
  let currentMinutes = startHour * 60;

  for (let i = 0; i < sequenced.length; i++) {
    const currentPlace = sequenced[i];
    const nextPlace = sequenced[i + 1];

    const arrivalH = Math.floor(currentMinutes / 60);
    const arrivalM = currentMinutes % 60;
    const arrivalTime = formatTime(arrivalH, arrivalM);

    const stayMins = Math.round(currentPlace.duration_hours * 60);
    const departureMinutes = currentMinutes + stayMins;
    const depH = Math.floor(departureMinutes / 60);
    const depM = departureMinutes % 60;
    const departureTime = formatTime(depH, depM);

    let transportCost = 0;
    let travelMins = 0;
    let trafficNote = '';

    if (nextPlace) {
      const leg = calculateTransportLeg(currentPlace, nextPlace, prefs.transport_pref);
      transportCost = leg.cost;
      travelMins = leg.durationMins;
      trafficNote = leg.note;
      currentMinutes = departureMinutes + travelMins;
    } else {
      currentMinutes = departureMinutes;
    }

    itinerary.push({
      place: currentPlace,
      order_index: i + 1,
      arrival_time: arrivalTime,
      departure_time: departureTime,
      cost: currentPlace.cost,
      transport_cost_to_next: transportCost,
      transport_mode: prefs.transport_pref === 'bykea_rickshaw' ? 'Bykea / Rickshaw' : prefs.transport_pref === 'careem_ac' ? 'Careem AC' : 'Personal Vehicle',
      travel_time_mins: travelMins,
      traffic_note: trafficNote,
    });
  }

  return itinerary;
}

function formatTime(hours: number, minutes: number): string {
  const normH = hours % 24;
  const ampm = normH >= 12 ? 'PM' : 'AM';
  const displayH = normH % 12 === 0 ? 12 : normH % 12;
  const displayM = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${displayH}:${displayM} ${ampm}`;
}

/**
 * Computes estimated financial breakdown for UI charts
 */
export function computeTripBudgetBreakdown(stops: ItineraryStop[], totalBudget: number) {
  let foodTotal = 0;
  let ticketsTotal = 0;
  let transportTotal = 0;

  stops.forEach((stop) => {
    foodTotal += stop.place.food_cost;
    ticketsTotal += stop.place.entry_cost;
    transportTotal += stop.transport_cost_to_next;
  });

  const grandTotal = foodTotal + ticketsTotal + transportTotal;
  const remainingSurplus = Math.max(0, totalBudget - grandTotal);
  const isOverBudget = grandTotal > totalBudget;

  return {
    foodTotal,
    ticketsTotal,
    transportTotal,
    grandTotal,
    remainingSurplus,
    isOverBudget,
    pctFood: grandTotal > 0 ? Math.round((foodTotal / grandTotal) * 100) : 40,
    pctTransport: grandTotal > 0 ? Math.round((transportTotal / grandTotal) * 100) : 25,
    pctTickets: grandTotal > 0 ? Math.round((ticketsTotal / grandTotal) * 100) : 35,
  };
}
