import React, { useState, useEffect } from 'react';
import { User, Database, Bookmark, LogOut, Code, Copy, Check, ShieldCheck, MapPin, Activity, RefreshCw, Server } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL, dbService } from '../lib/supabase';
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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    provider: 'supabase' | 'local';
    latencyMs?: number;
    placesCount?: number;
    error?: string;
  } | null>(null);

  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  useEffect(() => {
    // Initial health check
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await dbService.testConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({
        connected: false,
        provider: isSupabaseConfigured ? 'supabase' : 'local',
        error: e?.message || 'Check failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedPlaces = async () => {
    setSeedStatus('Seeding database...');
    try {
      await dbService.seedPlacesIfEmpty();
      const res = await dbService.testConnection();
      setTestResult(res);
      setSeedStatus('All 22 Karachi places synced!');
      setTimeout(() => setSeedStatus(null), 3000);
    } catch (e: any) {
      setSeedStatus('Seed error: ' + e?.message);
    }
  };

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
          Account & Backend
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">Explorer Profile & Database Architecture</h1>
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
                {currentUser?.email || 'Browsing in guest mode'}
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
              <div className="text-xs text-slate-400 mt-0.5">PostgreSQL schemas & RLS rules</div>
            </div>
          </div>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            View SQL
          </span>
        </button>
      </div>

      {/* Backend & Supabase Live Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#0D9488]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supabase Database & Auth Engine</h3>
              <p className="text-xs text-slate-500">PostgreSQL persistence, Auth, and trip tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#0D9488]' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Live Diagnostics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Provider Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  testResult?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="font-bold text-slate-800">
                {isSupabaseConfigured ? 'Supabase Cloud' : 'Local Postgres Emulation'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Response Latency</span>
            <div className="font-bold text-slate-800 mt-1">
              {testResult?.latencyMs ? `${testResult.latencyMs} ms` : 'Instant (Local)'}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Places Database</span>
            <div className="font-bold text-[#0D9488] mt-1">
              {testResult?.placesCount ?? 22} Verified Locations
            </div>
          </div>
        </div>

        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-950">Active Schema Tables:</span>
            {isSupabaseConfigured && (
              <button
                onClick={handleSeedPlaces}
                className="text-xs font-bold text-[#0D9488] hover:underline"
              >
                Sync All Karachi Places to Supabase
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="bg-white px-2.5 py-1 rounded-md font-mono text-slate-700 border border-teal-200/70">
              public.places
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md font-mono text-slate-700 border border-teal-200/70">
              public.trips
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md font-mono text-slate-700 border border-teal-200/70">
              public.trip_places
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md font-mono text-slate-700 border border-teal-200/70">
              public.saved_trips
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md font-mono text-slate-700 border border-teal-200/70">
              public.users
            </span>
          </div>

          {seedStatus && (
            <div className="text-xs font-semibold text-[#0D9488] pt-1">
              {seedStatus}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {isSupabaseConfigured
            ? 'Your application is connected to live Supabase backend services. Trips, auth, and places are synchronized with your PostgreSQL database.'
            : 'To connect this applet to your live Supabase cloud project, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment, and execute the SQL Blueprint in your Supabase SQL Editor.'}
        </p>
      </div>

      {/* SQL Blueprint Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Supabase Postgres SQL Schema</h3>
                <p className="text-xs text-slate-500">Run this directly in your Supabase Project SQL Editor</p>
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
              className="w-full py-3 bg-[#0D9488] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
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
