import React from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, MapPin, Navigation, TrendingUp, DollarSign } from 'lucide-react';
import { KARACHI_HERO_IMAGE, KARACHI_PLACES } from '../data/karachiPlaces';
import { Place } from '../types';

interface HomeScreenProps {
  onStartPlanning: () => void;
  onSelectBudgetTier: (budget: number) => void;
  onSelectPlace: (place: Place) => void;
  onSurpriseMe: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartPlanning,
  onSelectBudgetTier,
  onSelectPlace,
  onSurpriseMe,
}) => {
  const trendingPlaces = KARACHI_PLACES.slice(0, 5);

  return (
    <div className="pb-24 space-y-6">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-[0_15px_30px_-8px_rgba(0,0,0,0.12)] bg-slate-900 mx-1">
        <div className="relative h-64 w-full">
          <img
            src={KARACHI_HERO_IMAGE}
            alt="Karachi Clifton Beach & Skyline Sunset"
            className="w-full h-full object-cover object-center brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 mb-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Smart Karachi Day Planner</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight mb-2 text-balance">
              Explore Karachi Your Way, On Your Budget
            </h1>
            <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
              Curated day plans scoped exclusively to Karachi. Real PKR fares, area clustering, and authentic local spots.
            </p>

            <button
              onClick={onStartPlanning}
              className="w-full py-3.5 px-5 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Plan My Trip</span>
              <span aria-hidden="true">🚀</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Action: Surprise Me Run */}
      <div className="px-1">
        <button
          onClick={onSurpriseMe}
          className="w-full bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200/70 p-3.5 rounded-2xl flex items-center justify-between text-left group hover:border-teal-300 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-bold text-base shadow-sm">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900 flex items-center gap-1.5">
                <span>Surprise Me Run</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">
                  Rs. 1,500
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                1-Click instant Old Karachi & Burns Road day out
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#0D9488] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Budget Tiers Selection */}
      <section className="space-y-3 px-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Choose Your Budget Tier</h2>
          <span className="text-xs font-semibold text-slate-500">Realistic PKR</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Low Tier */}
          <button
            onClick={() => onSelectBudgetTier(1800)}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500 text-left transition-all shadow-[0_4px_15px_-3px_rgba(0,0,0,0.04)] group"
          >
            <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wide mb-1">
              Low Budget
            </div>
            <div className="text-sm font-bold text-slate-900 mb-0.5">
              &lt; Rs. 2k
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug">
              Bazaars, Street Food, Frere Hall & Beach
            </p>
          </button>

          {/* Balanced Tier */}
          <button
            onClick={() => onSelectBudgetTier(5000)}
            className="p-3 rounded-2xl bg-teal-50/70 border border-teal-300 text-left transition-all shadow-[0_4px_15px_-3px_rgba(0,0,0,0.06)] relative group"
          >
            <span className="absolute -top-2 right-2 bg-[#0D9488] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              Popular
            </span>
            <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wide mb-1">
              Balanced
            </div>
            <div className="text-sm font-bold text-slate-900 mb-0.5">
              Rs. 2k–6k
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-2 leading-snug">
              Museums, cafes, Careem AC & dining
            </p>
          </button>

          {/* Luxury Tier */}
          <button
            onClick={() => onSelectBudgetTier(12000)}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-500 text-left transition-all shadow-[0_4px_15px_-3px_rgba(0,0,0,0.04)] group"
          >
            <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wide mb-1">
              Luxury
            </div>
            <div className="text-sm font-bold text-slate-900 mb-0.5">
              Rs. 10k+
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug">
              Do Darya decks, Kolachi, Churna diving
            </p>
          </button>
        </div>
      </section>

      {/* Trending in Karachi Horizontal Scroll */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#F97316]" />
            <h2 className="text-base font-bold text-slate-900">Trending in Karachi</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Popular hubs</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1 snap-x">
          {trendingPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="w-56 shrink-0 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_6px_20px_-4px_rgba(0,0,0,0.07)] cursor-pointer snap-start hover:border-teal-300 transition-all"
            >
              <div className="relative h-28 w-full bg-slate-100">
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  ★ {place.rating}
                </div>
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {place.area}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold text-slate-900 truncate mb-1">
                  {place.name}
                </h3>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 capitalize">{place.category}</span>
                  <span className="font-bold text-[#0D9488]">
                    {place.entry_cost === 0 ? 'Free Entry' : `Rs. ${place.entry_cost}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Karachi Smart Engine Highlights */}
      <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] mx-1 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Engineered for Karachi Realities</h3>
        
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Area-Clustered Routing</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Minimizes cross-city travel and avoids peak bottleneck delays along Shahrah-e-Faisal and Saddar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Realistic Local Cost Engine</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Calculates accurate Bykea, Rickshaw, and Careem fares alongside street food and entry ticket expenses.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Authentic Curated Dataset</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Every spot vetted for actual Karachi timings, parking safety, and verified food recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
