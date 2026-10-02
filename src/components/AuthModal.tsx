import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, Shield, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isSupabaseConfigured && supabase) {
      try {
        if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          setMessage('Confirmation email dispatched.');
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          setMessage('Authenticated with Atelier ORA.');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 800);
        }
      } catch (err: any) {
        setMessage(err.message || 'Authentication failed.');
      }
    } else {
      // Local simulated session
      localStorage.setItem('ora_client_session', JSON.stringify({ email, timestamp: Date.now() }));
      setMessage(`Authenticated as ${email}`);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      localStorage.setItem('ora_client_session', JSON.stringify({ email: 'client@google.com', timestamp: Date.now() }));
      setMessage('Authenticated with Google account');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9998] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#070707] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden animate-fadeIn p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-luxury-champagne" />
            <span className="font-serif text-lg tracking-[0.2em] text-luxury-ivory font-light">
              ATELIER CLIENT ACCESS
            </span>
          </div>

          <button onClick={onClose} className="p-1 text-luxury-stone hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="font-serif italic text-sm text-luxury-stone font-light mb-6">
          Sign in to curate private timepiece allocations and synchronise bespoke favorites across your devices.
        </p>

        {message && (
          <div className="p-3 mb-4 bg-white/[0.02] border border-luxury-champagne/30 text-luxury-champagne font-mono text-[10px] tracking-wider rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="font-mono text-[8px] tracking-widest text-luxury-stone uppercase block mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="client@domaine.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-white/[0.1] px-3.5 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
            />
          </div>

          <div>
            <label className="font-mono text-[8px] tracking-widest text-luxury-stone uppercase block mb-1">
              SECURITY KEY
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-white/[0.1] px-3.5 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <span>{loading ? 'AUTHENTICATING...' : mode === 'signin' ? 'AUTHENTICATE ACCESS' : 'CREATE CLIENT DOSSIER'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <span className="relative px-3 bg-[#070707] text-[8px] font-mono tracking-widest text-luxury-stone/50 uppercase">
            OR SINGLE SIGN-ON
          </span>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full py-2.5 border border-white/[0.1] hover:border-luxury-champagne/40 bg-white/[0.02] text-luxury-ivory font-mono text-[9px] tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <span>CONTINUE WITH GOOGLE SECURE ID</span>
        </button>

        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-[9px] font-mono tracking-wider text-luxury-stone hover:text-luxury-champagne"
          >
            {mode === 'signin' ? "Don't have a private dossier? Create one" : 'Already have client credentials? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
