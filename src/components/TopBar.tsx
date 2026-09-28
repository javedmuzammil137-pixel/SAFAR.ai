import React from 'react';
import { MapPin, User, LogIn } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onNavigateProfile: () => void;
  onHomeClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  onOpenAuth,
  onNavigateProfile,
  onHomeClick,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-[440px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onHomeClick}
          className="text-left font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5 focus-visible:outline-none"
        >
          <span className="text-[#0D9488]">Safar</span>
          <span className="text-[#F97316]">.ai</span>
        </button>

        {/* Zone 2: Karachi Location Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-50/80 border border-teal-100/60 rounded-full text-xs font-medium text-teal-800">
          <MapPin className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
          <span className="tracking-wide uppercase text-[10px] font-bold">Karachi Only</span>
        </div>

        {/* Zone 3: Primary Action / User */}
        <div>
          {currentUser ? (
            <button
              onClick={onNavigateProfile}
              className="w-8 h-8 rounded-full bg-teal-600 text-white font-semibold text-xs flex items-center justify-center hover:bg-teal-700 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-teal-500"
              title={currentUser.name}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-teal-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
