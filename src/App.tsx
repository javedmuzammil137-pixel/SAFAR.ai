import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { PlanPreferencesScreen } from './screens/PlanPreferencesScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';
import { PlaceDetailModal } from './screens/PlaceDetailModal';
import { ItineraryScreen } from './screens/ItineraryScreen';
import { SavedTripsScreen } from './screens/SavedTripsScreen';
import { KarachiGuideScreen } from './screens/KarachiGuideScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthModal } from './screens/AuthModal';

import { KARACHI_PLACES } from './data/karachiPlaces';
import { dbService } from './lib/supabase';
import {
  buildClusteredItinerary,
  getRecommendedPlaces,
} from './lib/recommendationEngine';
import {
  ItineraryStop,
  Place,
  Trip,
  TripPreferences,
  UserProfile,
} from './types';

export default function App() {
  // Navigation & Screen State
  const [currentTab, setCurrentTab] = useState<TabType>('explore');
  const [planSubView, setPlanSubView] = useState<'preferences' | 'recommendations' | 'itinerary'>('preferences');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Trips & Places State
  const [allPlaces, setAllPlaces] = useState<Place[]>(KARACHI_PLACES);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<Place | null>(null);

  // Active Planning State
  const [preferences, setPreferences] = useState<TripPreferences>({
    budget: 3500,
    duration_type: 'full_day',
    interests: ['food', 'heritage', 'beach'],
    traveler_group: 'friends',
    transport_pref: 'bykea_rickshaw',
  });

  const [recommendedPlaces, setRecommendedPlaces] = useState<
    (Place & { score: number; scoreReasons: string[] })[]
  >([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryStop[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [isCurrentTripSaved, setIsCurrentTripSaved] = useState(false);

  // Initial Data Load (Auth, Places, Saved Trips)
  useEffect(() => {
    async function initData() {
      try {
        const user = await dbService.getCurrentUser();
        if (user) setCurrentUser(user);

        const places = await dbService.getPlaces();
        if (places && places.length > 0) setAllPlaces(places);

        const trips = await dbService.getSavedTrips(user?.id);
        setSavedTrips(trips);
      } catch (err) {
        console.error('Initialization error', err);
      }
    }
    initData();
  }, []);

  // Compute recommendations whenever preferences change or generate is clicked
  const handleGenerateRecommendations = () => {
    const scored = getRecommendedPlaces(preferences, allPlaces);
    setRecommendedPlaces(scored);

    // Auto-select top places that fit within budget to give user a great starting plan
    const initialSelection: Place[] = [];
    let runningCost = 0;
    for (const p of scored) {
      if (runningCost + p.cost <= preferences.budget * 0.95 && initialSelection.length < 4) {
        initialSelection.push(p);
        runningCost += p.cost;
      }
    }
    setSelectedPlaces(initialSelection.length > 0 ? initialSelection : scored.slice(0, 3));

    setPlanSubView('recommendations');
    setCurrentTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build sequential clustered itinerary
  const handleBuildItinerary = () => {
    const stops = buildClusteredItinerary(selectedPlaces, preferences);
    setGeneratedItinerary(stops);
    setPlanSubView('itinerary');
    setIsCurrentTripSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Action: "Surprise Me Run (Rs. 1,500)"
  const handleSurpriseMe = () => {
    const surprisePrefs: TripPreferences = {
      budget: 1500,
      duration_type: 'half_day',
      interests: ['food', 'heritage', 'bazaars'],
      traveler_group: 'solo',
      transport_pref: 'bykea_rickshaw',
    };
    setPreferences(surprisePrefs);

    // Pick iconic Old Karachi spots (Frere Hall, Burns Road, Empress Market)
    const surpriseSpots = allPlaces.filter((p) =>
      ['frere-hall', 'burns-road', 'empress-market'].includes(p.id)
    );

    setSelectedPlaces(surpriseSpots.length > 0 ? surpriseSpots : allPlaces.slice(0, 3));
    const stops = buildClusteredItinerary(surpriseSpots, surprisePrefs);
    setGeneratedItinerary(stops);
    setActiveTripId('surprise_' + Date.now());
    setIsCurrentTripSaved(false);
    setCurrentTab('plan');
    setPlanSubView('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Budget Tier quick-starter from Home
  const handleSelectBudgetTier = (budget: number) => {
    const updated: TripPreferences = {
      ...preferences,
      budget,
      interests:
        budget >= 10000
          ? ['food', 'beach', 'adventure']
          : budget >= 5000
          ? ['food', 'heritage', 'cafes']
          : ['food', 'bazaars', 'heritage'],
    };
    setPreferences(updated);
    const scored = getRecommendedPlaces(updated, allPlaces);
    setRecommendedPlaces(scored);
    setSelectedPlaces(scored.slice(0, 3));
    setCurrentTab('plan');
    setPlanSubView('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add / Remove place from plan
  const handleTogglePlace = (place: Place) => {
    const exists = selectedPlaces.some((p) => p.id === place.id);
    if (exists) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  // Save Trip to Supabase / Local Storage
  const handleSaveTrip = async () => {
    if (generatedItinerary.length === 0) return;

    const grandCost = generatedItinerary.reduce(
      (sum, s) => sum + s.cost + s.transport_cost_to_next,
      0
    );

    const tripToSave: Trip = {
      id: activeTripId || 'trip_' + Date.now(),
      user_id: currentUser?.id || 'guest_user',
      title: `${selectedPlaces.length}-Stop Karachi Tour (${preferences.traveler_group})`,
      budget: preferences.budget,
      duration_type: preferences.duration_type,
      interests: preferences.interests,
      traveler_group: preferences.traveler_group,
      transport_pref: preferences.transport_pref,
      total_cost: grandCost,
      stops: generatedItinerary,
      created_at: new Date().toISOString(),
      is_saved: true,
    };

    const res = await dbService.saveTrip(tripToSave);
    if (res.success) {
      setIsCurrentTripSaved(true);
      setActiveTripId(res.id || tripToSave.id);
      const updatedTrips = await dbService.getSavedTrips(currentUser?.id);
      setSavedTrips(updatedTrips);
    }
  };

  // Load an existing saved trip
  const handleOpenSavedTrip = (trip: Trip) => {
    setPreferences({
      budget: trip.budget,
      duration_type: trip.duration_type as any,
      interests: trip.interests as any,
      traveler_group: trip.traveler_group as any,
      transport_pref: trip.transport_pref as any,
    });
    setSelectedPlaces(trip.stops.map((s) => s.place));
    setGeneratedItinerary(trip.stops);
    setActiveTripId(trip.id);
    setIsCurrentTripSaved(true);
    setCurrentTab('plan');
    setPlanSubView('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete saved trip
  const handleDeleteSavedTrip = async (tripId: string) => {
    await dbService.deleteTrip(tripId);
    const updated = await dbService.getSavedTrips(currentUser?.id);
    setSavedTrips(updated);
  };

  // Optimize route (re-runs spatial clustering)
  const handleOptimizeRoute = () => {
    const stops = buildClusteredItinerary(selectedPlaces, preferences);
    setGeneratedItinerary(stops);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] w-full text-[#0F172A]">
      {/* Responsive Top Navigation Bar */}
      <TopBar
        currentUser={currentUser}
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'plan') {
            if (generatedItinerary.length > 0) {
              setPlanSubView('itinerary');
            } else if (selectedPlaces.length > 0) {
              setPlanSubView('recommendations');
            } else {
              setPlanSubView('preferences');
            }
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateProfile={() => setCurrentTab('profile')}
        onStartPlanning={() => {
          setCurrentTab('plan');
          setPlanSubView('preferences');
        }}
        selectedPlacesCount={selectedPlaces.length}
      />

      {/* Main Content Area (Max 7XL container that adapts gracefully from phone to 4K monitor) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: Explore / Home */}
        {currentTab === 'explore' && (
          <HomeScreen
            onStartPlanning={() => {
              setCurrentTab('plan');
              setPlanSubView('preferences');
            }}
            onSelectBudgetTier={handleSelectBudgetTier}
            onSelectPlace={(p) => setSelectedPlaceForModal(p)}
            onSurpriseMe={handleSurpriseMe}
          />
        )}

        {/* TAB 2: Plan Trip */}
        {currentTab === 'plan' && (
          <>
            {planSubView === 'preferences' && (
              <PlanPreferencesScreen
                preferences={preferences}
                onChangePreferences={setPreferences}
                onGenerate={handleGenerateRecommendations}
              />
            )}

            {planSubView === 'recommendations' && (
              <RecommendationsScreen
                preferences={preferences}
                recommendations={
                  recommendedPlaces.length > 0
                    ? recommendedPlaces
                    : getRecommendedPlaces(preferences, allPlaces)
                }
                selectedPlaces={selectedPlaces}
                onTogglePlace={handleTogglePlace}
                onSelectPlaceDetails={(p) => setSelectedPlaceForModal(p)}
                onViewItinerary={handleBuildItinerary}
                onBack={() => setPlanSubView('preferences')}
              />
            )}

            {planSubView === 'itinerary' && (
              <ItineraryScreen
                stops={generatedItinerary}
                preferences={preferences}
                onBack={() => setPlanSubView('recommendations')}
                onSaveTrip={handleSaveTrip}
                isSaved={isCurrentTripSaved}
                onSelectPlaceDetails={(p) => setSelectedPlaceForModal(p)}
                onReorderOrOptimize={handleOptimizeRoute}
              />
            )}
          </>
        )}

        {/* TAB 3: Saved Trips */}
        {currentTab === 'saved' && (
          <SavedTripsScreen
            trips={savedTrips}
            onSelectTrip={handleOpenSavedTrip}
            onDeleteTrip={handleDeleteSavedTrip}
            onPlanNew={() => {
              setCurrentTab('plan');
              setPlanSubView('preferences');
            }}
          />
        )}

        {/* TAB 4: Karachi Local Guide */}
        {currentTab === 'guide' && <KarachiGuideScreen />}

        {/* TAB 5: Profile & Backend */}
        {currentTab === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            savedTripsCount={savedTrips.length}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSignOut={async () => {
              await dbService.signOut();
              setCurrentUser(null);
            }}
            onNavigateSaved={() => setCurrentTab('saved')}
          />
        )}
      </main>

      {/* Place Detail Modal (Responsive Dialog) */}
      <PlaceDetailModal
        place={selectedPlaceForModal}
        isSelected={Boolean(
          selectedPlaceForModal &&
            selectedPlaces.some((p) => p.id === selectedPlaceForModal.id)
        )}
        onClose={() => setSelectedPlaceForModal(null)}
        onTogglePlan={(p) => handleTogglePlace(p)}
        onSelectOtherPlace={(p) => setSelectedPlaceForModal(p)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          dbService.getSavedTrips(user.id).then(setSavedTrips);
        }}
      />

      {/* Fixed Bottom Tab Bar (Visible on Mobile Only, Hidden on Tablets and Desktops) */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'plan') {
            if (generatedItinerary.length > 0) {
              setPlanSubView('itinerary');
            } else if (selectedPlaces.length > 0) {
              setPlanSubView('recommendations');
            } else {
              setPlanSubView('preferences');
            }
          }
        }}
        selectedPlacesCount={selectedPlaces.length}
      />
    </div>
  );
}
