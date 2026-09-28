import React from 'react';
import { ArrowRight, Utensils, Waves, Landmark, ShoppingBag, Compass, Coffee, Users, Car, Bike, Shield, Sparkles, Check } from 'lucide-react';
import { DurationType, PlaceCategory, TransportPreference, TravelerGroup, TripPreferences } from '../types';

interface PlanPreferencesScreenProps {
  preferences: TripPreferences;
  onChangePreferences: (prefs: TripPreferences) => void;
  onGenerate: () => void;
  onBack?: () => void;
}

export const PlanPreferencesScreen: React.FC<PlanPreferencesScreenProps> = ({
  preferences,
  onChangePreferences,
  onGenerate,
  onBack,
}) => {
  const budgetPresets = [1500, 3500, 7000, 15000];

  const handleBudgetChange = (value: number) => {
    onChangePreferences({ ...preferences, budget: value });
  };

  const toggleInterest = (category: PlaceCategory) => {
    const current = [...preferences.interests];
    const exists = current.includes(category);
    const updated = exists
      ? current.filter((c) => c !== category)
      : [...current, category];
    
    // Ensure at least one interest is active
    if (updated.length > 0) {
      onChangePreferences({ ...preferences, interests: updated });
    }
  };

  const categories: { id: PlaceCategory; label: string; icon: any }[] = [
    { id: 'food', label: 'Food & Chai', icon: Utensils },
    { id: 'beach', label: 'Seaside & Beach', icon: Waves },
    { id: 'heritage', label: 'Heritage & History', icon: Landmark },
    { id: 'bazaars', label: 'Bazaars & Souks', icon: ShoppingBag },
    { id: 'cafes', label: 'Art Cafes & Dhabas', icon: Coffee },
    { id: 'adventure', label: 'Adventure & Marine', icon: Compass },
  ];

  const durationOptions: { id: DurationType; label: string; sub: string }[] = [
    { id: 'half_day', label: 'Half Day', sub: '3-4 hrs' },
    { id: 'full_day', label: 'Full Day', sub: '7-9 hrs' },
    { id: 'weekend', label: 'Weekend', sub: '2 Days' },
    { id: 'three_days', label: '3+ Days', sub: 'Deep Dive' },
  ];

  const travelerGroups: { id: TravelerGroup; label: string; desc: string }[] = [
    { id: 'solo', label: 'Solo Explorer', desc: 'Fast, flexible' },
    { id: 'friends', label: 'Friends Group', desc: 'Social & lively' },
    { id: 'family', label: 'Family', desc: 'Comfort & easy pacing' },
    { id: 'couple', label: 'Couple', desc: 'Atmospheric & relaxed' },
  ];

  const transportOptions: { id: TransportPreference; label: string; desc: string; icon: any }[] = [
    { id: 'bykea_rickshaw', label: 'Bykea / Auto Rickshaw', desc: 'Bypasses traffic congestion, budget-friendly and authentic', icon: Bike },
    { id: 'careem_ac', label: 'Careem / AC Ride', desc: 'Air-conditioned comfort across long stretches', icon: Car },
    { id: 'personal_car', label: 'Personal Vehicle', desc: 'Your own vehicle with parking and fuel budget', icon: Shield },
  ];

  // Dynamic estimate bar proportions based on transport & budget
  const estTransportPct = preferences.transport_pref === 'bykea_rickshaw' ? 20 : preferences.transport_pref === 'careem_ac' ? 35 : 25;
  const estFoodPct = 50;
  const estTicketsPct = 100 - estTransportPct - estFoodPct;

  const estFoodPkr = Math.round((preferences.budget * estFoodPct) / 100);
  const estTransportPkr = Math.round((preferences.budget * estTransportPct) / 100);
  const estTicketsPkr = preferences.budget - estFoodPkr - estTransportPkr;

  return (
    <div className="pb-32 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider">
            Step 1 of 2
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Configure Your Budget & Trip Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify your parameters to generate a custom-clustered Karachi itinerary.
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            Cancel
          </button>
        )}
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Budget Slider */}
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-900">Total Budget (PKR)</label>
                <p className="text-xs text-slate-400 mt-0.5">Adjust to see live breakdown</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#0D9488] tabular-nums">
                  PKR {preferences.budget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={500}
                max={25000}
                step={250}
                value={preferences.budget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0D9488]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>PKR 500</span>
                <span>PKR 5,000</span>
                <span>PKR 15,000</span>
                <span>PKR 25,000+</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {budgetPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleBudgetChange(preset)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    preferences.budget === preset
                      ? 'bg-[#0D9488] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  Rs. {preset >= 1000 ? `${preset / 1000}k` : preset}
                </button>
              ))}
            </div>
          </section>

          {/* Duration Selector */}
          <section className="space-y-3">
            <label className="text-sm font-bold text-slate-900 block">Trip Duration</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {durationOptions.map((opt) => {
                const isSelected = preferences.duration_type === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onChangePreferences({ ...preferences, duration_type: opt.id })}
                    className={`p-3.5 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-2 border-[#0D9488] text-teal-900 font-bold shadow-sm'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Multi-select Interests */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900">Interests & Activities</label>
              <span className="text-xs text-slate-400">Select multiple</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = preferences.interests.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleInterest(cat.id)}
                    className={`p-3.5 rounded-2xl flex items-center gap-3 text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-2 border-[#0D9488] text-teal-900 font-bold shadow-sm'
                        : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Traveler Group */}
          <section className="space-y-3">
            <label className="text-sm font-bold text-slate-900 block">Traveler Group</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {travelerGroups.map((grp) => {
                const isSelected = preferences.traveler_group === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => onChangePreferences({ ...preferences, traveler_group: grp.id })}
                    className={`p-3.5 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-2 border-[#F97316] text-orange-950 font-bold shadow-sm'
                        : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{grp.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{grp.desc}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Transport Preference */}
          <section className="space-y-3">
            <label className="text-sm font-bold text-slate-900 block">Transport Mode in Karachi</label>
            <div className="space-y-3">
              {transportOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = preferences.transport_pref === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChangePreferences({ ...preferences, transport_pref: item.id })}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50/80 border-2 border-[#0D9488] shadow-sm'
                        : 'bg-white border border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0D9488] bg-[#0D9488]' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Live Plan Summary & CTA (Desktop Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Trip Overview</h3>
              <span className="text-xs font-semibold text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded-full">
                Karachi Day Model
              </span>
            </div>

            {/* Dynamic Live Cost Breakdown Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Estimated Cost Distribution</span>
                <span className="font-bold text-slate-800">PKR {preferences.budget.toLocaleString()}</span>
              </div>

              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${estFoodPct}%` }}
                  className="bg-[#F97316] h-full"
                  title="Food & Chai"
                />
                <div
                  style={{ width: `${estTransportPct}%` }}
                  className="bg-[#0D9488] h-full"
                  title="Transport"
                />
                <div
                  style={{ width: `${estTicketsPct}%` }}
                  className="bg-[#6366F1] h-full"
                  title="Tickets & Entries"
                />
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                    Food & Chai ({estFoodPct}%)
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ~ Rs. {estFoodPkr.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
                    Local Transit ({estTransportPct}%)
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ~ Rs. {estTransportPkr.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                    Tickets & Activities ({estTicketsPct}%)
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ~ Rs. {estTicketsPkr.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Choices Summary Tags */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {preferences.duration_type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Traveler:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {preferences.traveler_group}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Interests:</span>
                <span className="font-semibold text-slate-800 capitalize truncate max-w-[180px]">
                  {preferences.interests.join(', ')}
                </span>
              </div>
            </div>

            {/* Desktop CTA Button */}
            <button
              onClick={onGenerate}
              className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Generate Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile ONLY */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <div className="max-w-md mx-auto">
          <button
            onClick={onGenerate}
            className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Generate Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
