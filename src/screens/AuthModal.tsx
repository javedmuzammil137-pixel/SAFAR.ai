import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import { dbService } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please provide your name.');
          setLoading(false);
          return;
        }
        const { user, error: authError } = await dbService.signUp(email, password, name);
        if (authError) {
          setError(authError);
        } else if (user) {
          onSuccess(user);
          onClose();
        }
      } else {
        const { user, error: authError } = await dbService.signIn(email, password);
        if (authError) {
          setError(authError);
        } else if (user) {
          onSuccess(user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const { user } = await dbService.signIn('explorer@karachi.pk', 'demo123456');
    if (user) {
      onSuccess(user);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider">
              Supabase Auth
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {isSignUp ? 'Join Safar.ai Karachi' : 'Welcome Back'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ali Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Karachi Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Login */}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-900 font-bold text-xs rounded-xl border border-orange-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
          <span>One-Click Karachi Demo Login</span>
        </button>

        {/* Toggle sign in / sign up */}
        <div className="text-center pt-2 text-xs text-slate-500">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-bold text-[#0D9488] hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to Safar.ai?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-bold text-[#0D9488] hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
