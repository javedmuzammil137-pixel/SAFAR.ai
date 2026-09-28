import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Printer,
  Compass,
  Clock,
  MapPin,
  AlertTriangle,
  Check,
  Bike,
  Car,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { BudgetBreakdownChart } from '../components/BudgetBreakdownChart';
import { KarachiMap } from '../components/KarachiMap';
import { computeTripBudgetBreakdown } from '../lib/recommendationEngine';
import { ItineraryStop, TripPreferences, Place } from '../types';

interface ItineraryScreenProps {
  stops: ItineraryStop[];
  preferences: TripPreferences;
  onBack: () => void;
  onSaveTrip: () => void;
  isSaved?: boolean;
  onSelectPlaceDetails: (place: Place) => void;
  onReorderOrOptimize?: () => void;
}

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  stops,
  preferences,
  onBack,
  onSaveTrip,
  isSaved = false,
  onSelectPlaceDetails,
  onReorderOrOptimize,
}) => {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const financial = computeTripBudgetBreakdown(stops, preferences.budget);

  // Copy shareable summary
  const handleShare = async () => {
    const summaryText = `🌴 My Karachi Day Itinerary with Safar.ai:\n` +
      stops.map((s, idx) => `${idx + 1}. ${s.place.name} (${s.arrival_time}) - Rs. ${s.cost}`).join('\n') +
      `\n💰 Total: Rs. ${financial.grandTotal.toLocaleString()} (Budget: Rs. ${preferences.budget.toLocaleString()})`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(summaryText);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  // PDF Export / Print Flow
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="pb-32 md:pb-12 space-y-6 print:p-0 print:pb-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider">
              Karachi Day Plan
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Your Day Itinerary & Transit Route
            </h1>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Share itinerary"
          >
            {copyFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copyFeedback ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Export / Print PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            onClick={onSaveTrip}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isSaved
                ? 'bg-teal-700 text-white'
                : 'bg-[#F97316] text-white hover:bg-[#ea580c]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Saved in Supabase' : 'Save Trip'}</span>
          </button>
        </div>
      </div>

      {/* Share Toast Notification */}
      {copyFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Itinerary text copied to clipboard successfully!</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timeline & Route Stops */}
        <div className="lg:col-span-7 space-y-6">
          {/* Local Timing Advice (Karachi Traffic Avoidance) */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-amber-950 text-sm">Traffic Optimization Notice</h4>
              <p className="text-amber-800 leading-relaxed">
                Stops are sequenced chronologically to bypass peak congestion (5:30 PM – 8:00 PM) across Shahrah-e-Faisal and Metropole. Morning heritage stops lead directly to afternoon covered markets, followed by coastal sunset dining at Clifton and Do Darya.
              </p>
            </div>
          </div>

          {/* Connected Timeline of Stops */}
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Connected Stops Timeline ({stops.length} destinations)
              </h3>
              {onReorderOrOptimize && (
                <button
                  onClick={onReorderOrOptimize}
                  className="text-xs font-bold text-[#0D9488] hover:underline"
                >
                  Optimize Route
                </button>
              )}
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-teal-200">
              {stops.map((stop, index) => {
                const place = stop.place;

                return (
                  <div key={place.id} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#0D9488] border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                      {index + 1}
                    </div>

                    {/* Stop Card */}
                    <div
                      onClick={() => onSelectPlaceDetails(place)}
                      className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-teal-400 transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{stop.arrival_time} – {stop.departure_time}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {place.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{place.area}</span>
                            <span>·</span>
                            <span className="capitalize">{place.category}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-medium">Activity Spend</div>
                          <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                            Rs. {place.cost.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Insider Karachi Tip */}
                      {place.local_tips && place.local_tips[0] && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                          💡 <strong className="text-slate-700">Tip:</strong> {place.local_tips[0]}
                        </p>
                      )}
                    </div>

                    {/* Transit Leg Indicator */}
                    {index < stops.length - 1 && (
                      <div className="my-2.5 ml-2 pl-4 py-2 flex items-center justify-between text-xs text-slate-600 bg-teal-50/70 rounded-xl border border-teal-100">
                        <div className="flex items-center gap-2">
                          {preferences.transport_pref === 'bykea_rickshaw' ? (
                            <Bike className="w-4 h-4 text-[#0D9488]" />
                          ) : (
                            <Car className="w-4 h-4 text-[#0D9488]" />
                          )}
                          <span>
                            ~{stop.travel_time_mins} mins travel ({stop.transport_mode})
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 tabular-nums pr-2">
                          +Rs. {stop.transport_cost_to_next}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Financial Status, Chart & Leaflet Map (Desktop Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {/* Financial Status Card */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Financial Status
                </div>
                <div className="text-2xl font-black text-slate-900 mt-0.5 tabular-nums">
                  PKR {financial.grandTotal.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-medium text-slate-500">Total Budget</div>
                <div className="text-base font-bold text-slate-700 tabular-nums">
                  PKR {preferences.budget.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Dynamic Split Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${financial.pctFood}%` }}
                  className="bg-[#F97316] h-full"
                  title="Food"
                />
                <div
                  style={{ width: `${financial.pctTransport}%` }}
                  className="bg-[#0D9488] h-full"
                  title="Transport"
                />
                <div
                  style={{ width: `${financial.pctTickets}%` }}
                  className="bg-[#6366F1] h-full"
                  title="Tickets"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Food (Rs. {financial.foodTotal})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#0D9488]" /> Rides (Rs. {financial.transportTotal})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> Tickets (Rs. {financial.ticketsTotal})
                </span>
              </div>
            </div>

            {/* Surplus or Over-budget Status */}
            <div
              className={`p-3.5 rounded-2xl flex items-center justify-between text-xs ${
                financial.isOverBudget
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  {financial.isOverBudget
                    ? `Exceeds budget by PKR ${(financial.grandTotal - preferences.budget).toLocaleString()}`
                    : `Surplus saved: PKR ${financial.remainingSurplus.toLocaleString()}`}
                </span>
              </div>
              <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full font-bold">
                {financial.isOverBudget ? 'Exceeded' : 'Balanced'}
              </span>
            </div>
          </section>

          {/* Interactive Leaflet Karachi Map */}
          <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0D9488]" />
                <span>Karachi Transit Path</span>
              </h3>
              <span className="text-xs text-slate-500">{stops.length} stops mapped</span>
            </div>

            <KarachiMap
              stops={stops}
              onSelectStop={(s) => onSelectPlaceDetails(s.place)}
              className="h-64 sm:h-72 w-full rounded-2xl"
            />
          </section>

          {/* Chart.js Breakdown Doughnut */}
          <BudgetBreakdownChart
            foodTotal={financial.foodTotal}
            ticketsTotal={financial.ticketsTotal}
            transportTotal={financial.transportTotal}
            remainingSurplus={financial.remainingSurplus}
            totalBudget={preferences.budget}
          />
        </div>
      </div>

      {/* Sticky Bottom Action for Mobile ONLY */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30 print:hidden">
        <div className="max-w-md mx-auto">
          <button
            onClick={onSaveTrip}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white shadow-xl shadow-orange-500/25'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Trip Saved in Supabase' : 'Save Itinerary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
