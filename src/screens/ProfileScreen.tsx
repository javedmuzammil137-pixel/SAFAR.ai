import React, { useState } from 'react';
import { User, Database, Bookmark, LogOut, Code, Copy, Check, ShieldCheck, MapPin } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  currentUser: UserProfile | null;
  savedTripsCount: number;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onNavigateSaved: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  savedTripsCount,
  onOpenAuth,
  onSignOut,
  onNavigateSaved,
}) => {
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySql = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pb-24 space-y-5">
      {/* Header */}
      <div className="px-1">
        <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider">
          Account & Backend
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">Explorer Profile</h1>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] mx-1 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D9488] to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-md">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'K'}
          </div>

          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              {currentUser?.name || 'Guest Traveler'}
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser?.email || 'Browsing in Karachi guest mode'}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold mt-1">
              <MapPin className="w-3 h-3 text-[#0D9488]" />
              <span>Karachi, Pakistan</span>
            </div>
          </div>
        </div>

        {!currentUser ? (
          <button
            onClick={onOpenAuth}
            className="w-full py-3 px-4 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Sign In / Create Account
          </button>
        ) : (
          <button
            onClick={onSignOut}
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors border border-slate-200/60 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Quick Nav Rows */}
      <div className="bg-white rounded-3xl p-2 border border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] mx-1 space-y-1">
        <button
          onClick={onNavigateSaved}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">My Saved Itineraries</div>
              <div className="text-[11px] text-slate-400">View or re-run past plans</div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2 py-0.5 rounded-full">
            {savedTripsCount}
          </span>
        </button>

        <button
          onClick={() => setShowSqlModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Supabase SQL Blueprint</div>
              <div className="text-[11px] text-slate-400">View Postgres table schemas</div>
            </div>
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
            Schema
          </span>
        </button>
      </div>

      {/* Backend & Supabase Status Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mx-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0D9488]" />
            <h3 className="text-xs font-bold text-slate-900">Backend & Persistence</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-teal-500'
              }`}
            />
            <span className="text-slate-700">
              {isSupabaseConfigured ? 'Supabase Connected' : 'Offline / Local Postgres Mode'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          {isSupabaseConfigured
            ? 'Trips and places are actively synced with your Supabase cloud project.'
            : 'Running on local browser persistence with real Postgres table structures. To connect to your Supabase project, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
        </p>
      </div>

      {/* SQL Blueprint Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Supabase Postgres SQL</h3>
                <p className="text-[11px] text-slate-500">Run in your Supabase SQL Editor</p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <pre className="my-3 p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-auto flex-1 leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </pre>

            <button
              onClick={copySql}
              className="w-full py-2.5 bg-[#0D9488] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
