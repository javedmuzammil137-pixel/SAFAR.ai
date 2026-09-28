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
    <div className="pb-32 md:pb-12 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider">
              Step 2 of 2
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Recommended Karachi Stops
            </h1>
          </div>
        </div>

        {/* Desktop View Itinerary CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            {selectedPlaces.length} of {recommendations.length} stops selected
          </span>
          <button
            onClick={onViewItinerary}
            disabled={selectedPlaces.length === 0}
            className={`py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              selectedPlaces.length > 0
                ? 'bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>View 1-Day Itinerary ({selectedPlaces.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Budget Progress Tracker Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-500">Planned Stops Spend vs Total Budget</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
              <span className={isOverBudget ? 'text-rose-600' : 'text-[#0D9488]'}>
                PKR {totalPlannedSpend.toLocaleString()}
              </span>
              <span className="text-slate-400 font-normal"> / PKR {preferences.budget.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-xs sm:text-right">
            {isOverBudget ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full font-semibold border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Over budget by Rs. {Math.abs(remainingBudget).toLocaleString()}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold border border-emerald-200">
                <span>Surplus left: <strong>Rs. {remainingBudget.toLocaleString()}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${spendPct}%` }}
            className={`h-full transition-all duration-300 ${
              isOverBudget ? 'bg-rose-500' : spendPct > 80 ? 'bg-amber-500' : 'bg-[#0D9488]'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{spendPct}% allocated</span>
          <span>Tip: Add or remove stops below to balance your budget</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Recommendations ({recommendations.length})
        </button>

        <button
          onClick={() => setFilter('free')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'free'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Free Entry
        </button>

        <button
          onClick={() => setFilter('under500')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'under500'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Under Rs. 500
        </button>

        <button
          onClick={() => setFilter('food')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'food'
              ? 'bg-[#0D9488] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Must-Try Food
        </button>
      </div>

      {/* Recommendations Cards Grid (Responsive 1/2/3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaces.map((place) => {
          const isSelected = selectedPlaces.some((p) => p.id === place.id);

          return (
            <div
              key={place.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isSelected ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Image & Header */}
                <div
                  onClick={() => onSelectPlaceDetails(place)}
                  className="relative h-44 w-full bg-slate-100 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {place.best_time_window}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm">
                    {place.area}
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-4 sm:p-5">
                  <div
                    onClick={() => onSelectPlaceDetails(place)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0D9488] transition-colors line-clamp-1">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>
                  </div>

                  {place.scoreReasons && place.scoreReasons[0] && (
                    <div className="mt-3 text-[11px] text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-lg font-medium inline-block line-clamp-1">
                      {place.scoreReasons[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Add/Remove Action Row */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Est. Stop Spend</div>
                  <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                    Rs. {place.cost.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPlaceDetails(place)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onTogglePlace(place)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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
          );
        })}
      </div>

      {/* Sticky Bottom Bar on Mobile ONLY */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <div className="max-w-md mx-auto">
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
              View 1-Day Itinerary ({selectedPlaces.length} {selectedPlaces.length === 1 ? 'stop' : 'stops'})
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
