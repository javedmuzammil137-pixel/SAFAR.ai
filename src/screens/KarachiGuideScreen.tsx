import React, { useState } from 'react';
import { BookOpen, Compass, Bike, Utensils, Shield, Sun, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export const KarachiGuideScreen: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('transit');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="pb-24 space-y-5">
      {/* Header */}
      <div className="px-1">
        <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
          Insider Knowledge
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">The Karachi Local Guide</h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Practical advice from lifelong Karachiites on navigating transit, food streets, and coastal weather.
        </p>
      </div>

      {/* Quick Karachi Vibe Card */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-5 shadow-lg mx-1 space-y-2">
        <div className="flex items-center gap-1.5 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>The Golden Rule of Karachi</span>
        </div>
        <h3 className="text-base font-bold text-white leading-snug">
          "The City that Wakes Up after Sunset"
        </h3>
        <p className="text-xs text-teal-100/90 leading-relaxed">
          Morning traffic is light before 10:00 AM. Afternoons get warm, but after 5:30 PM, the Arabian Sea breeze sweeps across the city. Food streets stay bustling until 2:00 AM–4:00 AM!
        </p>
      </div>

      {/* Accordion Guide Sections */}
      <div className="space-y-3 px-1">
        {/* Transit 101 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('transit')}
            className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <span>Transit 101: Rickshaw vs Careem vs Bykea</span>
            </div>
            {openSection === 'transit' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'transit' && (
            <div className="p-4 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <div className="space-y-1">
                <strong className="text-slate-900 block">1. Auto Rickshaw (Chingchi / Meter-less)</strong>
                <p>Negotiate before boarding. A typical 4–6km trip costs Rs. 200–350. Unmatched for weaving through Saddar and Burns Road traffic.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">2. Bykea (Motorbike Ride Hail)</strong>
                <p>Fastest and cheapest option for solo explorers (Rs. 120–250). Helmets provided. Perfect for rush hour along Shahrah-e-Faisal.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">3. Careem / Yango (AC Car)</strong>
                <p>Best for families, couples, or long trips down to Do Darya / Phase 8. Cost ranges from Rs. 400 to Rs. 1,200 depending on peak surge.</p>
              </div>
            </div>
          )}
        </div>

        {/* Karachi Area Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('areas')}
            className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Key Neighborhood Clusters</span>
            </div>
            {openSection === 'areas' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'areas' && (
            <div className="p-4 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <div className="space-y-1">
                <strong className="text-slate-900 block">Saddar & Civil Lines (Old City)</strong>
                <p>Colonial Victorian architecture, Empress Market, Frere Hall, National Museum, and legendary Burns Road street food.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">Clifton (Midtown Coast)</strong>
                <p>Mohatta Palace, Sea View Beach, Boat Basin paratha strips, art galleries, and peaceful cafes like Koel.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 block">DHA (Defence Housing Authority)</strong>
                <p>Wide avenues, Chai Wala dhabas, Masjid-e-Tooba, and the Do Darya seaside restaurant boardwalk in Phase 8.</p>
              </div>
            </div>
          )}
        </div>

        {/* Street Food Etiquette */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('food')}
            className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span>Food & Chai Etiquette</span>
            </div>
            {openSection === 'food' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'food' && (
            <div className="p-4 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <p>• <strong>Bottled Water:</strong> Always drink sealed bottled mineral water (Nestle / Aquafina) when eating roadside.</p>
              <p>• <strong>Burns Road Timing:</strong> The street is pedestrianized and comes alive after 7:30 PM. Waheed Kebab fry and Fresco Jalebi are musts.</p>
              <p>• <strong>Doodh Patti vs Karak:</strong> "Doodh Patti" is pure milk boiled with tea leaves; "Karak" has extra cardamom and strong brew.</p>
            </div>
          )}
        </div>

        {/* Safety & Bargaining */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('safety')}
            className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-900"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span>Street Smarts & Bargaining</span>
            </div>
            {openSection === 'safety' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'safety' && (
            <div className="p-4 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
              <p>• <strong>Cash is Essential:</strong> While Clifton and DHA malls accept Visa/Mastercard, street food vendors, rickshaws, and Zainab Market vendors only accept Pakistani rupee cash.</p>
              <p>• <strong>Phone Etiquette:</strong> In congested bazaars like Empress Market and Tariq Road, avoid keeping phones in loose back pockets.</p>
              <p>• <strong>Bargaining:</strong> In Zainab Market or roadside stalls, politely start at 50–60% of the quoted price and settle amicably in the middle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
