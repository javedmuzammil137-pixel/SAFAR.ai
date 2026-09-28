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
  Sparkles,
  Check,
  Bike,
  Car,
  ChevronRight,
  TrendingDown,
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

  // Copy shareable link or summary
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
    <div className="pb-28 space-y-5 print:p-0 print:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between px-1 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
              Karachi Day Plan
            </span>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Your Day Itinerary
            </h1>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Share itinerary"
          >
            {copyFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportPDF}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Export / Print PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onSaveTrip}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isSaved
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Save to profile"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {copyFeedback && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-1 font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Itinerary text copied to clipboard!</span>
        </div>
      )}

      {/* Financial Status Card */}
      <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Financial Status
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5 tabular-nums">
              PKR {financial.grandTotal.toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500">Total Budget</div>
            <div className="text-sm font-bold text-slate-700 tabular-nums">
              PKR {preferences.budget.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Dynamic Split Bar */}
        <div className="space-y-1.5">
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

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Food (Rs. {financial.foodTotal})
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" /> Ride (Rs. {financial.transportTotal})
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> Tickets (Rs. {financial.ticketsTotal})
            </span>
          </div>
        </div>

        {/* Surplus or Over budget status */}
        <div
          className={`p-3 rounded-2xl flex items-center justify-between text-xs ${
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
          <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full font-bold">
            {financial.isOverBudget ? 'Adjust Plan' : 'Well Balanced'}
          </span>
        </div>
      </section>

      {/* Interactive Map Visual */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Route & Map Path</span>
          </h3>
          <span className="text-[11px] text-slate-500">{stops.length} Locations</span>
        </div>
        <KarachiMap
          stops={stops}
          onSelectStop={(s) => onSelectPlaceDetails(s.place)}
          className="h-56 w-full rounded-3xl"
        />
      </section>

      {/* Local Timing Advice (Karachi Traffic Avoidance) */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-amber-950">Shahrah-e-Faisal & Saddar Timing Advice</h4>
          <p className="text-amber-800 leading-relaxed">
            Traffic peaks heavily between 5:30 PM and 8:00 PM along Shahrah-e-Faisal and Metropole junction. Your stops are sequenced to hit old city museums first, moving south toward Clifton & Do Darya for sunset and dining.
          </p>
        </div>
      </div>

      {/* Vertical Connected Timeline of Stops */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Connected Timeline
          </h3>
          {onReorderOrOptimize && (
            <button
              onClick={onReorderOrOptimize}
              className="text-xs font-bold text-[#0D9488] flex items-center gap-1 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Route</span>
            </button>
          )}
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-teal-200">
          {stops.map((stop, index) => {
            const place = stop.place;

            return (
              <div key={place.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#0D9488] border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {index + 1}
                </div>

                {/* Stop Card */}
                <div
                  onClick={() => onSelectPlaceDetails(place)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:border-teal-400 transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0D9488]">
                        <Clock className="w-3 h-3" />
                        <span>{stop.arrival_time} – {stop.departure_time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{place.area}</span>
                        <span>·</span>
                        <span className="capitalize">{place.category}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Activity Cost</div>
                      <div className="text-xs font-extrabold text-slate-900 tabular-nums">
                        Rs. {place.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Highlights / Local Tip */}
                  {place.local_tips && place.local_tips[0] && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2">
                      💡 {place.local_tips[0]}
                    </p>
                  )}
                </div>

                {/* Transport to next stop indicator */}
                {index < stops.length - 1 && (
                  <div className="my-2 ml-2 pl-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 bg-teal-50/50 rounded-xl border border-teal-100/50">
                    <div className="flex items-center gap-2">
                      {preferences.transport_pref === 'bykea_rickshaw' ? (
                        <Bike className="w-3.5 h-3.5 text-[#0D9488]" />
                      ) : (
                        <Car className="w-3.5 h-3.5 text-[#0D9488]" />
                      )}
                      <span>
                        ~{stop.travel_time_mins} mins transit ({stop.transport_mode})
                      </span>
                    </div>
                    <span className="font-semibold text-slate-700 tabular-nums pr-2">
                      +Rs. {stop.transport_cost_to_next}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Budget Breakdown Chart Detail */}
      <BudgetBreakdownChart
        foodTotal={financial.foodTotal}
        ticketsTotal={financial.ticketsTotal}
        transportTotal={financial.transportTotal}
        remainingSurplus={financial.remainingSurplus}
        totalBudget={preferences.budget}
      />

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30 print:hidden">
        <div className="max-w-[440px] mx-auto flex items-center gap-3">
          <button
            onClick={onSaveTrip}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
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
