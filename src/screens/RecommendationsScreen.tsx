import React, { useState } from 'react';
import { ArrowLeft, Check, Plus, Star, MapPin, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Place, TripPreferences } from '../types';

interface RecommendationsScreenProps {
  preferences: TripPreferences;
  recommendations: (Place & { score: number; scoreReasons: string[] })[];
  selectedPlaces: Place[];
  onTogglePlace: (place: Place) => void;
  onSelectPlaceDetails: (place: Place) => void;
  onViewItinerary: () => void;
  onBack: () => void;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  preferences,
  recommendations,
  selectedPlaces,
  onTogglePlace,
  onSelectPlaceDetails,
  onViewItinerary,
  onBack,
}) => {
  const [filter, setFilter] = useState<'all' | 'free' | 'under500' | 'food'>('all');

  // Calculate planned spend so far
  const totalPlannedSpend = selectedPlaces.reduce((sum, p) => sum + p.cost, 0);
  const remainingBudget = preferences.budget - totalPlannedSpend;
  const spendPct = Math.min(100, Math.round((totalPlannedSpend / preferences.budget) * 100));
  const isOverBudget = totalPlannedSpend > preferences.budget;

  const filteredPlaces = recommendations.filter((p) => {
    if (filter === 'free') return p.is_free || p.entry_cost === 0;
    if (filter === 'under500') return p.cost <= 500;
    if (filter === 'food') return p.category === 'food' || p.must_try_food;
    return true;
  });

  return (
    <div className="pb-32 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
              Step 2 of 2
            </span>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Recommended for You
            </h1>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          {selectedPlaces.length} selected
        </span>
      </div>

      {/* Top Budget Progress Tracker */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06)] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Planned Spend vs Budget:</span>
          <div className="font-bold tabular-nums">
            <span className={isOverBudget ? 'text-rose-600' : 'text-[#0D9488]'}>
              Rs. {totalPlannedSpend.toLocaleString()}
            </span>
            <span className="text-slate-400 font-normal"> / Rs. {preferences.budget.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${spendPct}%` }}
            className={`h-full transition-all duration-300 ${
              isOverBudget ? 'bg-rose-500' : spendPct > 80 ? 'bg-amber-500' : 'bg-[#0D9488]'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          {isOverBudget ? (
            <div className="flex items-center gap-1 text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Over budget by Rs. {Math.abs(remainingBudget).toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-slate-500">
              Surplus left: <strong className="text-emerald-700">Rs. {remainingBudget.toLocaleString()}</strong>
            </span>
          )}
          <span className="text-slate-400">{spendPct}% utilized</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          All ({recommendations.length})
        </button>

        <button
          onClick={() => setFilter('free')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'free'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Free Entry
        </button>

        <button
          onClick={() => setFilter('under500')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'under500'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Under Rs. 500
        </button>

        <button
          onClick={() => setFilter('food')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'food'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          Must-Try Food
        </button>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-3 px-1">
        {filteredPlaces.map((place) => {
          const isSelected = selectedPlaces.some((p) => p.id === place.id);

          return (
            <div
              key={place.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] transition-all ${
                isSelected ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200/80'
              }`}
            >
              <div className="flex">
                {/* Left Thumbnail */}
                <div
                  onClick={() => onSelectPlaceDetails(place)}
                  className="w-28 sm:w-32 relative bg-slate-100 shrink-0 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                    {place.best_time_window}
                  </div>
                </div>

                {/* Right Details */}
                <div className="flex-1 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div
                        onClick={() => onSelectPlaceDetails(place)}
                        className="cursor-pointer"
                      >
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-[#0D9488] transition-colors">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#0D9488] shrink-0" />
                          <span>{place.area}</span>
                          <span>·</span>
                          <span className="capitalize">{place.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{place.rating}</span>
                      </div>
                    </div>

                    {/* AI Score match tag */}
                    {place.scoreReasons && place.scoreReasons[0] && (
                      <p className="text-[10px] text-teal-700 font-medium line-clamp-1 mb-2">
                        ✨ {place.scoreReasons[0]}
                      </p>
                    )}
                  </div>

                  {/* Pricing and Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400">Est. Total Cost</div>
                      <div className="text-xs font-extrabold text-slate-900 tabular-nums">
                        Rs. {place.cost.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => onTogglePlace(place)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-[#0D9488] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-900'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar to View Itinerary */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <div className="max-w-[440px] mx-auto">
          <button
            onClick={onViewItinerary}
            disabled={selectedPlaces.length === 0}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-between transition-all ${
              selectedPlaces.length > 0
                ? 'bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white shadow-xl shadow-orange-500/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>
              View My 1-Day Itinerary ({selectedPlaces.length} {selectedPlaces.length === 1 ? 'stop' : 'stops'})
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
