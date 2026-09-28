import React from 'react';
import { Bookmark, Calendar, ArrowRight, Trash2, MapPin, Sparkles } from 'lucide-react';
import { Trip } from '../types';

interface SavedTripsScreenProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onPlanNew: () => void;
}

export const SavedTripsScreen: React.FC<SavedTripsScreenProps> = ({
  trips,
  onSelectTrip,
  onDeleteTrip,
  onPlanNew,
}) => {
  return (
    <div className="pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
            Supabase Saved Plans
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">My Saved Karachi Trips</h1>
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center space-y-4 shadow-sm mx-1">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Saved Trips Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              When you generate a Karachi itinerary and save it, your plan will be saved in your database here.
            </p>
          </div>
          <button
            onClick={onPlanNew}
            className="py-3 px-6 bg-[#F97316] text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#ea580c] transition-colors"
          >
            Create Your First Trip 🚀
          </button>
        </div>
      ) : (
        <div className="space-y-3 px-1">
          {trips.map((trip) => {
            const stopCount = trip.stops?.length || 0;
            const areas = Array.from(new Set(trip.stops?.map((s) => s.place.area) || [])).slice(0, 3);
            const dateStr = trip.created_at
              ? new Date(trip.created_at).toLocaleDateString('en-PK', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently created';

            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] hover:border-teal-400 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      <Calendar className="w-3 h-3 text-[#0D9488]" />
                      <span>{dateStr}</span>
                      <span>·</span>
                      <span className="capitalize">{trip.duration_type.replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {trip.title || 'Karachi Day Outing'}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Key metadata */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>{areas.join(', ') || 'Karachi Central'}</span>
                  </div>

                  <div className="font-bold text-[#0D9488] tabular-nums">
                    PKR {trip.budget.toLocaleString()}
                  </div>
                </div>

                {/* Open Button */}
                <button
                  onClick={() => onSelectTrip(trip)}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-100"
                >
                  <span>Open Full Itinerary ({stopCount} stops)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
