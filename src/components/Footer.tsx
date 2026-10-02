import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

interface FooterProps {
  onOpenAcquisition: () => void;
  onOpenManagement: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAcquisition,
  onOpenManagement,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="maison" className="relative w-full bg-[#030303] text-[#F5F2EA] pt-32 pb-16 px-6 sm:px-12 lg:px-20 border-t border-white/[0.08] overflow-hidden">
      {/* Background Ambience */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-luxury-champagne/[0.02] blur-[180px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24 border-b border-white/[0.06]">
          
          {/* Brand Vision Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] text-luxury-ivory font-light">
                ORA
              </span>
              <span className="font-mono text-xs tracking-[0.4em] text-luxury-champagne ml-3">
                GENÈVE
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-stone/60 block mt-2">
                MANUFACTURE DE HAUTE HORLOGERIE · FONDÉE EN SUISSE
              </span>
            </div>

            <p className="text-luxury-stone/80 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-sm">
              Dedicated to the relentless pursuit of chronometric purity, artisanal hand-anglage, and independent Swiss mechanical engineering.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAcquisition}
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-luxury-champagne/10 border border-luxury-champagne/40 text-luxury-champagne hover:bg-luxury-champagne hover:text-black font-mono text-[10px] tracking-[0.25em] transition-all"
                data-cursor="INQUIRE"
              >
                <span>COMMISSION A TIMEPIECE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Maison Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase block">
              NAVIGATION
            </span>
            <ul className="space-y-3 font-mono text-xs tracking-widest text-luxury-stone/80">
              <li>
                <button
                  onClick={() => scrollTo('collection')}
                  className="hover:text-luxury-ivory transition-colors"
                >
                  THE COLLECTION
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('calibre')}
                  className="hover:text-luxury-ivory transition-colors"
                >
                  CALIBRE 900
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('craftsmanship')}
                  className="hover:text-luxury-ivory transition-colors"
                >
                  CRAFTSMANSHIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('story')}
                  className="hover:text-luxury-ivory transition-colors"
                >
                  ANATOMY OF TIME
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenManagement}
                  className="hover:text-luxury-champagne transition-colors"
                >
                  ATELIER VAULT & CURATION
                </button>
              </li>
            </ul>
          </div>

          {/* Gazette / Private Concierge Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase block">
              LA GAZETTE HORLOGÈRE
            </span>
            <p className="text-luxury-stone/70 text-xs font-sans font-light leading-relaxed">
              Privileged dispatches on numbered piece allocations, atelier private views, and new calibre revelations.
            </p>

            {subscribed ? (
              <div className="p-3 bg-white/[0.02] border border-luxury-champagne/40 text-luxury-champagne font-mono text-[10px] tracking-widest flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>INVITATION PRIVÉE CONFIRMÉE</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="votre.email@domaine.ch"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#070707] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-white/10 hover:bg-luxury-champagne hover:text-black text-luxury-ivory font-mono text-[10px] tracking-widest transition-all"
                  data-cursor="JOIN"
                >
                  JOIN
                </button>
              </form>
            )}

            <div className="pt-2 text-luxury-stone/50 font-mono text-[9px] tracking-widest">
              STRICTLY LIMITED SUBSCRIPTION · MAXIMUM 1 DISPATCH MONTHLY
            </div>
          </div>
        </div>

        {/* Large Watermark Typography in negative space */}
        <div className="py-16 text-center select-none pointer-events-none opacity-[0.035]">
          <span className="font-serif text-[clamp(3.5rem,14vw,12rem)] tracking-[0.2em] font-light text-white block uppercase leading-none">
            ORA GENÈVE
          </span>
        </div>

        {/* Bottom Legal / Atelier Coordinates */}
        <div className="pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60">
          <div>
            <span>© {new Date().getFullYear()} ORA GENÈVE SA · RUE DU RHÔNE 42, 1204 GENÈVE</span>
          </div>

          <div className="flex items-center gap-6">
            <span>SWISS HAUTE HORLOGERIE</span>
            <span>·</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
