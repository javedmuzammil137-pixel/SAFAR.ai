import React from 'react';
import { ArrowRight, Compass, ShieldCheck, MapPin, Navigation, TrendingUp, DollarSign, Clock, Sparkles } from 'lucide-react';
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
    <div className="pb-24 md:pb-12 space-y-8 lg:space-y-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-[0_15px_35px_-8px_rgba(0,0,0,0.12)] bg-slate-900">
        <div className="relative h-72 sm:h-80 md:h-96 lg:h-[420px] w-full">
          <img
            src={KARACHI_HERO_IMAGE}
            alt="Karachi Clifton Beach & Arabian Sea Coastline"
            className="w-full h-full object-cover object-center brightness-[0.82]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span>City-Specific Itinerary Planner</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-3">
              Explore Karachi Your Way, On Your Budget
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200 mb-6 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
              Realistic PKR budget modeling, intelligent area clustering to bypass Shahrah-e-Faisal traffic, and handpicked local destinations.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onStartPlanning}
                className="py-3.5 px-6 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Plan My Karachi Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSurpriseMe}
                className="py-3.5 px-5 bg-white/15 hover:bg-white/20 active:scale-[0.98] text-white font-semibold text-sm rounded-xl backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Surprise Me Run (Rs. 1,500)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Bar for Mobile & Desktop */}
      <section className="bg-gradient-to-r from-teal-50/90 via-white to-orange-50/90 border border-teal-200/70 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-teal-300 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Old Karachi & Burns Road Express</span>
              <span className="text-[11px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                Rs. 1,500 Budget
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              1-Click optimized heritage and food trail through Saddar, Frere Hall, and Burns Road.
            </p>
          </div>
        </div>

        <button
          onClick={onSurpriseMe}
          className="self-end sm:self-center px-4 py-2 bg-white hover:bg-teal-50 text-[#0D9488] font-bold text-xs rounded-xl border border-teal-200 hover:border-teal-300 shadow-sm flex items-center gap-1.5 transition-all whitespace-nowrap"
        >
          <span>Run Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Budget Tiers Selection Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Choose Your Budget Tier</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select a spending tier calibrated to real Pakistani Rupee expenses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {/* Low Tier */}
          <div
            onClick={() => onSelectBudgetTier(1800)}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500 text-left transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">
                  Street & Heritage
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Tier 1</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1 tabular-nums">
                &lt; Rs. 2,000
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Historic bazaars, colonial landmarks, Karachi street food, and Sea View evening breeze.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0D9488] group-hover:translate-x-0.5 transition-transform">
              <span>View low-cost plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Balanced Tier */}
          <div
            onClick={() => onSelectBudgetTier(5000)}
            className="p-5 rounded-2xl bg-teal-50/70 border-2 border-[#0D9488] text-left transition-all shadow-[0_6px_25px_-5px_rgba(13,148,136,0.12)] cursor-pointer group relative flex flex-col justify-between"
          >
            <span className="absolute -top-3 right-4 bg-[#0D9488] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Most Popular
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                  Balanced Explorer
                </span>
                <span className="text-[11px] text-teal-600 font-semibold">Tier 2</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1 tabular-nums">
                Rs. 2k–6k
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mohatta Palace, curated art cafes, Boat Basin dining, and Careem AC rides across town.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between text-xs font-bold text-[#0D9488] group-hover:translate-x-0.5 transition-transform">
              <span>View balanced plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Luxury Tier */}
          <div
            onClick={() => onSelectBudgetTier(12000)}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-500 text-left transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                  Coastal Luxury
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Tier 3</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1 tabular-nums">
                Rs. 10,000+
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Do Darya waterfront dining decks, Kolachi seafood, high-tea buffets, and private boat cruises.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#F97316] group-hover:translate-x-0.5 transition-transform">
              <span>View luxury plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending in Karachi Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F97316]" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Trending in Karachi</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Handpicked landmarks, culinary institutions, and seaside hotspots
            </p>
          </div>
          <button
            onClick={onStartPlanning}
            className="text-xs font-bold text-[#0D9488] hover:underline hidden sm:block"
          >
            Explore all {KARACHI_PLACES.length} spots
          </button>
        </div>

        {/* Mobile Horizontal Carousel */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 sm:hidden snap-x">
          {trendingPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="w-64 shrink-0 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] cursor-pointer snap-start hover:border-teal-300 transition-all"
            >
              <div className="relative h-32 w-full bg-slate-100">
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  ★ {place.rating}
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {place.area}
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="text-xs font-bold text-slate-900 truncate mb-1">
                  {place.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">{place.category}</span>
                  <span className="font-bold text-[#0D9488]">
                    {place.entry_cost === 0 ? 'Free Entry' : `Rs. ${place.entry_cost}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet and Desktop Responsive Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {trendingPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    ★ {place.rating}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm">
                    {place.area}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0D9488] transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {place.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 capitalize">{place.category}</span>
                <span className="font-bold text-[#0D9488]">
                  {place.entry_cost === 0 ? 'Free Entry' : `Rs. ${place.entry_cost}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04)] space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Engineered for Karachi Realities
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built to navigate the distinct logistical characteristics of Pakistan's economic hub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Traffic-Aware Clustering</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Stops are grouped by geographical hubs (Clifton, Saddar, DHA) to prevent back-and-forth commuting across peak-hour gridlocks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Actual Local Costing</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Calculates accurate Bykea, Rickshaw, and Careem fares alongside street food portions and official museum ticket prices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Optimal Visiting Windows</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sequences morning heritage visits, afternoon galleries and covered bazaars, sunset beaches, and late-night food streets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
