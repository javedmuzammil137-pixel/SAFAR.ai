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
    <div className="pb-24 md:pb-12 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#0D9488] uppercase tracking-wider">
          Account & Database
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">Explorer Profile & Architecture</h1>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0D9488] to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'K'}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentUser?.name || 'Guest Traveler'}
              </h2>
              <p className="text-xs text-slate-500">
                {currentUser?.email || 'Browsing in local mode'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              className="py-2.5 px-5 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Sign In / Create Account
            </button>
          ) : (
            <button
              onClick={onSignOut}
              className="py-2 px-4 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Nav Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onNavigateSaved}
          className="p-5 bg-white border border-slate-200/80 rounded-3xl text-left hover:border-teal-400 shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">My Saved Itineraries</div>
              <div className="text-xs text-slate-400 mt-0.5">Access previously generated plans</div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
            {savedTripsCount}
          </span>
        </button>

        <button
          onClick={() => setShowSqlModal(true)}
          className="p-5 bg-white border border-slate-200/80 rounded-3xl text-left hover:border-indigo-400 shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Supabase SQL Blueprint</div>
              <div className="text-xs text-slate-400 mt-0.5">View Postgres database schema</div>
            </div>
          </div>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            View SQL
          </span>
        </button>
      </div>

      {/* Backend & Supabase Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#0D9488]" />
            <h3 className="text-sm font-bold text-slate-900">Database & Sync Architecture</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-teal-500'
              }`}
            />
            <span className="text-slate-700">
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Fallback Active'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {isSupabaseConfigured
            ? 'Trips and places are actively synchronized with your Supabase cloud project.'
            : 'Running on local browser persistence with real Postgres table structures. To connect to your Supabase project, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
        </p>
      </div>

      {/* SQL Blueprint Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Supabase Postgres SQL Schema</h3>
                <p className="text-xs text-slate-500">Run this directly in your Supabase SQL Editor</p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <pre className="my-4 p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono overflow-auto flex-1 leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </pre>

            <button
              onClick={copySql}
              className="w-full py-3 bg-[#0D9488] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-sm"
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
