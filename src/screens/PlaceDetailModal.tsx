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

  // Find nearby places in the same area
  const nearbyPlaces = KARACHI_PLACES.filter(
    (p) => p.id !== place.id && (p.area === place.area || Math.abs(p.lat - place.lat) < 0.05)
  ).slice(0, 3);

  const openGoogleMapsDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&destination_place_id=${encodeURIComponent(place.name + ' Karachi')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Header with Close Button */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="bg-[#0D9488] text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {place.area}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rating}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto no-scrollbar flex-1 p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Image & Quick Stats */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative h-56 md:h-64 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold leading-tight">{place.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span className="truncate">{place.address}</span>
                  </div>
                </div>
              </div>

              {/* 4-Stat Metric Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Ticket / Entry</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block tabular-nums">
                    {place.entry_cost === 0 ? 'Free Entry' : `Rs. ${place.entry_cost}`}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Typical Stay</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {place.duration_hours} Hours
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Best Timing</span>
                  <span className="text-xs font-bold text-[#0D9488] mt-0.5 block">
                    {place.best_time_window}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Budget Category</span>
                  <span className="text-xs font-bold text-orange-600 mt-0.5 block capitalize">
                    {place.budget_tier} Tier
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions, Matrix & Tips */}
            <div className="md:col-span-7 space-y-5">
              {/* About */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  About This Destination
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Itemized Cost Matrix */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Itemized Cost Matrix (PKR)</span>
                  <span className="text-[10px] text-slate-400">Average per person</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Entry / Admission Fee</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {place.entry_cost === 0 ? 'Free' : `Rs. ${place.entry_cost.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Food & Refreshments</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      Rs. {place.food_cost.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Local Rickshaw/Ride Transit Allowance</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      ~ Rs. 250
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                    <span>Expected Total Spend</span>
                    <span className="text-[#0D9488] tabular-nums">
                      Rs. {(place.cost + 250).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Local Karachi Tips */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Karachi Insider Tips</span>
                </h4>
                <div className="space-y-2">
                  {place.local_tips.map((tip, idx) => (
                    <div key={idx} className="text-xs text-slate-600 bg-orange-50/60 p-3 rounded-xl border border-orange-100 flex items-start gap-2.5">
                      <span className="text-[#F97316] font-bold">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby in Cluster */}
              {nearbyPlaces.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">
                    Also in {place.area} Cluster:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {nearbyPlaces.map((np) => (
                      <button
                        key={np.id}
                        onClick={() => onSelectOtherPlace(np)}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 text-left transition-all"
                      >
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">{np.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Rs. {np.cost}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={openGoogleMapsDirections}
            className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#0D9488]" />
            <span>Open Directions</span>
          </button>

          <button
            onClick={() => onTogglePlan(place)}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSelected
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-[#F97316] hover:bg-[#ea580c] text-white shadow-lg shadow-orange-500/25'
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
