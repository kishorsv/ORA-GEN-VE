import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141514] text-[#8d8d89] border-t border-[#3c3b3a] pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Top Tier: Private Client Dispatch & Atelier Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#2a2b2a]">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
              Geneva Manufacture Register
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#d8d8d4] font-display">
              ATELIER ORA GENÈVE
            </h3>
            <p className="text-sm text-[#8d8d89] max-w-md leading-relaxed">
              Rue du Rhône 42, 1204 Genève, Switzerland. Independent chronometry dedicated to the purity of mechanical motion and the preservation of manual rose-engine guilloché.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#d8d8d4] font-mono">
              Private Client Dispatch
            </div>
            <p className="text-xs text-[#6d6f6f] leading-relaxed">
              Receive confidential notices regarding annual allocation releases, technical whitepapers, and private salon appointments in Geneva.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter client email address..."
                className="flex-1 bg-[#191a19] border border-[#3c3b3a] focus:border-[#d4af37] px-4 py-2.5 text-xs text-[#d8d8d4] outline-none font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#252625] border-t border-r border-b border-[#3c3b3a] text-xs font-mono text-[#d8d8d4] hover:bg-[#3c3b3a] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap"
              >
                {isSubscribed ? <Check className="w-4 h-4 text-[#d4af37]" /> : 'Dispatch'}
              </button>
            </form>
          </div>
        </div>

        {/* 4 Minimalist Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
          <div className="space-y-3">
            <div className="text-[#d8d8d4] uppercase tracking-wider font-semibold">Atelier</div>
            <ul className="space-y-2 text-[#6d6f6f]">
              <li><a href="#calibre" className="hover:text-[#d8d8d4] transition-colors">Manufacture History</a></li>
              <li><a href="#guilloche" className="hover:text-[#d8d8d4] transition-colors">Rose-Engine Lathe</a></li>
              <li><a href="#specifications" className="hover:text-[#d8d8d4] transition-colors">Haute Horlogerie Criteria</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Geneva Salon Visits</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[#d8d8d4] uppercase tracking-wider font-semibold">Chronometry</div>
            <ul className="space-y-2 text-[#6d6f6f]">
              <li><a href="#calibre" className="hover:text-[#d8d8d4] transition-colors">Calibre 900 Micro-Rotor</a></li>
              <li><a href="#specifications" className="hover:text-[#d8d8d4] transition-colors">Silicon Variable Inertia</a></li>
              <li><a href="#specifications" className="hover:text-[#d8d8d4] transition-colors">28,800 vph Escapement</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Testing Observatories</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[#d8d8d4] uppercase tracking-wider font-semibold">Concierge</div>
            <ul className="space-y-2 text-[#6d6f6f]">
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Bespoke Allocation</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Armored Swiss Delivery</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">5-Year Manufacture Care</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Provenance Ledger</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[#d8d8d4] uppercase tracking-wider font-semibold">Governance</div>
            <ul className="space-y-2 text-[#6d6f6f]">
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Conflict-Free Metallurgy</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Responsible Jewellery Council</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Swiss Law Standards</a></li>
              <li><a href="#" className="hover:text-[#d8d8d4] transition-colors">Privacy Protocol</a></li>
            </ul>
          </div>
        </div>

        {/* Closing Trademark Base */}
        <div className="pt-12 border-t border-[#2a2b2a] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#585a5a]">
          <div>
            © {new Date().getFullYear()} ATELIER ORA GENÈVE SA. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>GENEVA REGISTER CHE-410.348.47</span>
            <span>·</span>
            <span>SWISS MADE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
