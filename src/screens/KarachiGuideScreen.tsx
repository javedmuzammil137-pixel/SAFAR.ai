import React, { useState } from 'react';
import { BookOpen, Compass, Bike, Utensils, Shield, Sun, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export const KarachiGuideScreen: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    transit: true,
    areas: true,
    food: true,
    safety: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider">
          Insider Knowledge
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">The Karachi City Guide</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Practical advice on navigating Karachi transit, culinary traditions, and coastal weather.
        </p>
      </div>

      {/* Hero Tip Card */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>The Golden Rule of Karachi</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
          "The City That Truly Comes Alive After Sunset"
        </h3>
        <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-2xl">
          Morning traffic is relatively light before 10:00 AM. Afternoons get warm, but after 5:30 PM, the Arabian Sea breeze sweeps across the coastline. Famous food streets stay vibrant until 2:00 AM–4:00 AM.
        </p>
      </div>

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transit 101 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('transit')}
            className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <span className="block">Transit 101: Auto Rickshaw vs Careem vs Bykea</span>
                <span className="text-[11px] text-slate-400 font-normal">How to get around without getting stuck</span>
              </div>
            </div>
            {openSections.transit ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.transit && (
            <div className="p-5 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <div className="space-y-1">
                <strong className="text-slate-900 block">1. Auto Rickshaw (Chingchi / Three-Wheeler)</strong>
                <p>Negotiate fare before boarding. A typical 4–6km trip costs Rs. 200–350. Ideal for weaving through Saddar and Burns Road traffic.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">2. Bykea (Motorbike Ride Hail)</strong>
                <p>Fastest and most affordable option for solo explorers (Rs. 120–250). Helmets provided. Perfect for crossing Shahrah-e-Faisal during 6:00 PM rush hour.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">3. Careem / Yango (AC Car)</strong>
                <p>Best for families, couples, or long trips down to Do Darya / Phase 8. Cost ranges from Rs. 400 to Rs. 1,200 depending on peak surge.</p>
              </div>
            </div>
          )}
        </div>

        {/* Karachi Area Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('areas')}
            className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block">Key Neighborhood Hubs</span>
                <span className="text-[11px] text-slate-400 font-normal">Saddar, Clifton, and DHA breakdown</span>
              </div>
            </div>
            {openSections.areas ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.areas && (
            <div className="p-5 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <div className="space-y-1">
                <strong className="text-slate-900 block">Saddar & Civil Lines (Old City)</strong>
                <p>Colonial Victorian architecture, Empress Market, Frere Hall, National Museum, and legendary Burns Road street food.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">Clifton (Midtown Coastline)</strong>
                <p>Mohatta Palace, Sea View Beach, Boat Basin paratha strips, peaceful art cafes, and upscale bakeries.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">DHA (Defence Housing Authority)</strong>
                <p>Wide avenues, Chai Wala dhabas, Masjid-e-Tooba, and the Do Darya seaside restaurant boardwalk in Phase 8.</p>
              </div>
            </div>
          )}
        </div>

        {/* Street Food Etiquette */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('food')}
            className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="block">Food & Chai Culture</span>
                <span className="text-[11px] text-slate-400 font-normal">Ordering like a local in Karachi</span>
              </div>
            </div>
            {openSections.food ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.food && (
            <div className="p-5 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <p>• <strong>Bottled Mineral Water:</strong> Always drink sealed bottled water when dining roadside or at open-air food streets.</p>
              <p>• <strong>Burns Road Timing:</strong> The street is pedestrianized and reaches peak atmosphere after 7:30 PM. Waheed Kebab fry and Delhi Rabri House are essential.</p>
              <p>• <strong>Doodh Patti vs Karak Chai:</strong> "Doodh Patti" is brewed with 100% milk and no added water; "Karak" has extra crushed cardamom and a rich amber brew.</p>
            </div>
          )}
        </div>

        {/* Safety & Bargaining */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('safety')}
            className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="block">Street Smarts & Cash Readiness</span>
                <span className="text-[11px] text-slate-400 font-normal">Payment modes and market manners</span>
              </div>
            </div>
            {openSections.safety ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.safety && (
            <div className="p-5 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <p>• <strong>Carry Cash:</strong> While Clifton and DHA upscale cafes accept Visa/Mastercard, street food vendors, rickshaws, and Zainab Market shops operate exclusively in Pakistani Rupee cash.</p>
              <p>• <strong>Bazaar Etiquette:</strong> In congested bazaars like Empress Market and Tariq Road, keep your belongings in secure front pockets.</p>
              <p>• <strong>Bargaining:</strong> In Zainab Market or roadside antique stalls, negotiate respectfully, starting at 50–60% of the initial quote.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
