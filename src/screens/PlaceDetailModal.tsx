import React from 'react';
import { X, Star, Clock, MapPin, DollarSign, Check, Plus, ExternalLink, Lightbulb, Compass } from 'lucide-react';
import { KARACHI_PLACES } from '../data/karachiPlaces';
import { Place } from '../types';

interface PlaceDetailModalProps {
  place: Place | null;
  isSelected: boolean;
  onClose: () => void;
  onTogglePlan: (place: Place) => void;
  onSelectOtherPlace: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  isSelected,
  onClose,
  onTogglePlan,
  onSelectOtherPlace,
}) => {
  if (!place) return null;

  // Find nearby places in the same area or closest coordinates
  const nearbyPlaces = KARACHI_PLACES.filter(
    (p) => p.id !== place.id && (p.area === place.area || Math.abs(p.lat - place.lat) < 0.05)
  ).slice(0, 3);

  const openGoogleMapsDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&destination_place_id=${encodeURIComponent(place.name + ' Karachi')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-y-auto no-scrollbar shadow-2xl flex flex-col">
        {/* Hero Image Section */}
        <div className="relative h-60 w-full shrink-0 bg-slate-900">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title & Overlay Tags */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#0D9488] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {place.area}
              </span>
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold text-amber-300">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>{place.rating}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {place.name}
            </h2>
            <div className="flex items-center gap-1 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
              <span className="truncate">{place.address}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 text-slate-800 flex-1">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Entry</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block tabular-nums">
                {place.entry_cost === 0 ? 'Free' : `Rs.${place.entry_cost}`}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {place.duration_hours} hrs
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Best Time</span>
              <span className="text-xs font-bold text-[#0D9488] mt-0.5 block">
                {place.best_time_window}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Tier</span>
              <span className="text-xs font-bold text-orange-600 mt-0.5 block capitalize">
                {place.budget_tier}
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About This Spot</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Itemized Cost Matrix Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Itemized Cost Matrix (PKR)</span>
              <span className="text-[10px] text-slate-500 font-normal">Per person average</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Entry / Ticket Fee</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {place.entry_cost === 0 ? 'Free' : `Rs. ${place.entry_cost.toLocaleString()}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Food & Chai</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  Rs. {place.food_cost.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Local Transit Allowance</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  ~ Rs. 250
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Total Expected Stop Spend</span>
                <span className="text-[#0D9488] tabular-nums">
                  Rs. {(place.cost + 250).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Local Tips Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Karachi Insider Tips</span>
            </h3>
            <ul className="space-y-1.5">
              {place.local_tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/60">
                  <span className="text-[#F97316] font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nearby Cluster */}
          {nearbyPlaces.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">
                Nearby in {place.area} Cluster
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {nearbyPlaces.map((np) => (
                  <button
                    key={np.id}
                    onClick={() => onSelectOtherPlace(np)}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-teal-400 text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-slate-900 line-clamp-1">{np.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Rs. {np.cost}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Sticky inside Modal */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 shrink-0">
          <button
            onClick={openGoogleMapsDirections}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4 text-[#0D9488]" />
            <span>Directions</span>
          </button>

          <button
            onClick={() => onTogglePlan(place)}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
              isSelected
                ? 'bg-teal-700 text-white shadow-teal-700/20'
                : 'bg-[#F97316] hover:bg-[#ea580c] text-white shadow-orange-500/25'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                <span>Remove from Day Plan</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Day Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
