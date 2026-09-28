import React from 'react';
import { MapPin, User, LogIn, Compass, Calendar, Bookmark, BookOpen, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { TabType } from './BottomNav';

interface TopBarProps {
  currentUser: UserProfile | null;
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenAuth: () => void;
  onNavigateProfile: () => void;
  onStartPlanning: () => void;
  selectedPlacesCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  currentTab,
  onChangeTab,
  onOpenAuth,
  onNavigateProfile,
  onStartPlanning,
  selectedPlacesCount,
}) => {
  const navLinks = [
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    { id: 'plan' as TabType, label: 'Plan Trip', icon: Sparkles, badge: selectedPlacesCount },
    { id: 'saved' as TabType, label: 'Saved Trips', icon: Bookmark },
    { id: 'guide' as TabType, label: 'Karachi Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Zone: Brand Logo & City Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => onChangeTab('explore')}
            className="text-left font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5 focus-visible:outline-none"
          >
            <span className="text-[#0D9488]">Safar</span>
            <span className="text-[#F97316]">.ai</span>
          </button>

          {/* Understated Location Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 hover:bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
            <span className="font-semibold text-slate-800">Karachi, PK</span>
          </div>
        </div>

        {/* Center Zone: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => onChangeTab(link.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-teal-50 text-[#0D9488] font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0D9488]' : 'text-slate-400'}`} />
                <span>{link.label}</span>
                {Boolean(link.badge && link.badge > 0) && (
                  <span className="bg-[#F97316] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0D9488] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Primary Actions & User Auth */}
        <div className="flex items-center gap-3">
          {/* Quick Plan CTA on Desktop */}
          <button
            onClick={onStartPlanning}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <span>Plan Itinerary</span>
          </button>

          {/* User Profile / Login */}
          {currentUser ? (
            <button
              onClick={onNavigateProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl hover:bg-slate-100 transition-colors border border-transparent sm:border-slate-200"
              title={currentUser.name}
            >
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-[100px] truncate">
                {currentUser.name || 'Account'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
