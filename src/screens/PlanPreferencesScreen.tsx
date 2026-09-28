import React from 'react';
import { Sparkles, Utensils, Waves, Landmark, ShoppingBag, Compass, Coffee, Users, Car, Bike, Shield } from 'lucide-react';
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

  const travelerGroups: { id: TravelerGroup; label: string; emoji: string }[] = [
    { id: 'solo', label: 'Solo', emoji: '🎒' },
    { id: 'friends', label: 'Friends', emoji: '👥' },
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'couple', label: 'Couple', emoji: '✨' },
  ];

  const transportOptions: { id: TransportPreference; label: string; desc: string; icon: any }[] = [
    { id: 'bykea_rickshaw', label: 'Bykea / Rickshaw', desc: 'Beats traffic, cheap & breezy', icon: Bike },
    { id: 'careem_ac', label: 'Careem / AC Ride', desc: 'Chilled AC comfort', icon: Car },
    { id: 'personal_car', label: 'Personal Vehicle', desc: 'Your own wheels & fuel', icon: Shield },
  ];

  // Dynamic estimate bar proportions based on transport & budget
  const estTransportPct = preferences.transport_pref === 'bykea_rickshaw' ? 20 : preferences.transport_pref === 'careem_ac' ? 35 : 25;
  const estFoodPct = 50;
  const estTicketsPct = 100 - estTransportPct - estFoodPct;

  return (
    <div className="pb-32 space-y-6">
      {/* Header & Step Indicator */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
            Step 1 of 2
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Budget & Preferences</h1>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Interactive Budget Slider */}
      <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900">Total Budget (PKR)</label>
          <div className="text-right">
            <span className="text-xl font-extrabold text-[#0D9488] tabular-nums">
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
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>PKR 500</span>
            <span>PKR 10,000</span>
            <span>PKR 25,000+</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {budgetPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleBudgetChange(preset)}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                preferences.budget === preset
                  ? 'bg-[#0D9488] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              Rs. {preset >= 1000 ? `${preset / 1000}k` : preset}
            </button>
          ))}
        </div>

        {/* Dynamic Live Cost Breakdown Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Estimated Allocation</span>
            <span>Based on choices</span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
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

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" /> Food ({estFoodPct}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" /> Transport ({estTransportPct}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> Tickets ({estTicketsPct}%)
            </span>
          </div>
        </div>
      </section>

      {/* Duration Selector */}
      <section className="space-y-2 px-1">
        <label className="text-sm font-bold text-slate-900 block">Trip Duration</label>
        <div className="grid grid-cols-4 gap-2">
          {durationOptions.map((opt) => {
            const isSelected = preferences.duration_type === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChangePreferences({ ...preferences, duration_type: opt.id })}
                className={`p-2.5 rounded-2xl text-center transition-all ${
                  isSelected
                    ? 'bg-teal-50 border-2 border-[#0D9488] text-teal-900 font-bold shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{opt.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Multi-select Interests */}
      <section className="space-y-2 px-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900">Interests & Vibe</label>
          <span className="text-[11px] text-slate-400">Select multiple</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = preferences.interests.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleInterest(cat.id)}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition-all ${
                  isSelected
                    ? 'bg-teal-50 border-2 border-[#0D9488] text-teal-900 font-bold shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Traveler Group */}
      <section className="space-y-2 px-1">
        <label className="text-sm font-bold text-slate-900 block">Who is traveling?</label>
        <div className="grid grid-cols-4 gap-2">
          {travelerGroups.map((grp) => {
            const isSelected = preferences.traveler_group === grp.id;
            return (
              <button
                key={grp.id}
                onClick={() => onChangePreferences({ ...preferences, traveler_group: grp.id })}
                className={`py-3 px-2 rounded-2xl text-center transition-all ${
                  isSelected
                    ? 'bg-orange-50 border-2 border-[#F97316] text-orange-950 font-bold shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-lg mb-1">{grp.emoji}</div>
                <div className="text-xs font-bold">{grp.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Transport Preference */}
      <section className="space-y-2 px-1">
        <label className="text-sm font-bold text-slate-900 block">Transport Mode in Karachi</label>
        <div className="space-y-2">
          {transportOptions.map((item) => {
            const Icon = item.icon;
            const isSelected = preferences.transport_pref === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangePreferences({ ...preferences, transport_pref: item.id })}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-teal-50/80 border-2 border-[#0D9488] shadow-sm'
                    : 'bg-white border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0D9488] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#0D9488] bg-[#0D9488]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <div className="max-w-[440px] mx-auto">
          <button
            onClick={onGenerate}
            className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Generate Recommendations</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
