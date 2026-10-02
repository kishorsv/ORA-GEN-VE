import React from 'react';
import type { Watch } from '../types/watch';
import { ArrowUpRight } from 'lucide-react';

interface CollectionSectionProps {
  watches: Watch[];
  activeWatchId: string;
  onSelectWatch: (watch: Watch) => void;
  onOpenDetail: (watch: Watch) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  watches,
  activeWatchId,
  onSelectWatch,
  onOpenDetail,
}) => {
  return (
    <section
      id="collection"
      className="relative w-full bg-[#080808] text-[#F5F2EA] py-32 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      {/* Background Ambience */}
      <div 
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-luxury-champagne/[0.02] blur-[160px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Section Header: Editorial & Minimal */}
      <div className="max-w-7xl mx-auto border-b border-white/[0.08] pb-12 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-[1px] bg-luxury-champagne" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase">
              HOROLOGICAL LINEAGE
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-luxury-ivory">
            THE COLLECTION
          </h2>
        </div>

        <div className="text-left md:text-right max-w-sm">
          <p className="font-serif italic text-xl sm:text-2xl text-luxury-stone font-light">
            Time, refined.
          </p>
          <p className="font-sans text-xs text-luxury-stone/60 font-light mt-2 leading-relaxed">
            Asymmetrical compositions of Grade 5 titanium, 18-carat rose gold, and hand-finished guilloché calibres.
          </p>
        </div>
      </div>

      {/* Editorial Asymmetrical Layout */}
      <div className="max-w-7xl mx-auto flex flex-col gap-24 sm:gap-36">
        
        {/* Watch 01: Large Dominant Editorial Hero Composition */}
        {watches[0] && (
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center group">
            <div className="lg:col-span-7 relative overflow-hidden bg-[#0D0D0D] border border-white/[0.06] p-8 sm:p-14 group-hover:border-luxury-champagne/30 transition-all duration-700">
              <div className="absolute top-6 left-6 font-mono text-[10px] tracking-widest text-luxury-stone/50">
                TIMEPIECE NO. 01 / HAUTE HORLOGERIE
              </div>
              <div 
                className="relative aspect-[4/3] flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watches[0])}
                data-cursor="EXAMINE"
              >
                <img
                  src={watches[0].heroImage}
                  alt={watches[0].name}
                  className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pl-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-champagne uppercase block">
                  {watches[0].collection} · {watches[0].specs.reference}
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-light text-luxury-ivory mt-2">
                  {watches[0].name}
                </h3>
                <p className="font-serif italic text-lg text-luxury-stone mt-1">
                  {watches[0].subtitle}
                </p>
              </div>

              <p className="text-luxury-stone/80 text-sm leading-relaxed font-light font-sans">
                {watches[0].description}
              </p>

              {/* Technical Spec Matrix Chips */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/[0.06] font-mono text-[10px] tracking-wider text-luxury-stone">
                <div>
                  <span className="text-white/40 block">CASE</span>
                  <span className="text-luxury-ivory">{watches[0].specs.diameter} · {watches[0].specs.caseMaterial.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-white/40 block">CALIBRE</span>
                  <span className="text-luxury-ivory">{watches[0].specs.movement.split(' ')[1] || 'Calibre 900'}</span>
                </div>
                <div>
                  <span className="text-white/40 block">POWER RESERVE</span>
                  <span className="text-luxury-ivory">{watches[0].specs.powerReserve.split(' ')[0]} {watches[0].specs.powerReserve.split(' ')[1]}</span>
                </div>
                <div>
                  <span className="text-white/40 block">VALUATION</span>
                  <span className="text-luxury-champagne font-semibold">{watches[0].priceFormatted}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenDetail(watches[0])}
                  className="px-6 py-2.5 bg-luxury-champagne/10 border border-luxury-champagne/30 text-luxury-champagne hover:bg-luxury-champagne hover:text-black font-mono text-[10px] tracking-[0.25em] transition-all flex items-center gap-2"
                  data-cursor="DOSSIER"
                >
                  <span>EXPLORE TIMEPIECE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectWatch(watches[0])}
                  className={`px-4 py-2.5 border font-mono text-[10px] tracking-widest transition-all ${
                    activeWatchId === watches[0].id
                      ? 'border-luxury-champagne text-luxury-champagne'
                      : 'border-white/[0.08] text-luxury-stone hover:text-white hover:border-white/20'
                  }`}
                  data-cursor="SET HERO"
                >
                  {activeWatchId === watches[0].id ? 'ACTIVE HERO' : 'SELECT AS HERO'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Watch 02: Offset Editorial Layout (Inverted columns) */}
        {watches[1] && (
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center group">
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center space-y-6 lg:pr-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-champagne uppercase block">
                  {watches[1].collection} · {watches[1].specs.reference}
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-light text-luxury-ivory mt-2">
                  {watches[1].name}
                </h3>
                <p className="font-serif italic text-lg text-luxury-stone mt-1">
                  {watches[1].subtitle}
                </p>
              </div>

              <p className="text-luxury-stone/80 text-sm leading-relaxed font-light font-sans">
                {watches[1].description}
              </p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/[0.06] font-mono text-[10px] tracking-wider text-luxury-stone">
                <div>
                  <span className="text-white/40 block">CASE</span>
                  <span className="text-luxury-ivory">{watches[1].specs.diameter} · 18K Rose Gold</span>
                </div>
                <div>
                  <span className="text-white/40 block">CALIBRE</span>
                  <span className="text-luxury-ivory">Calibre 910 Monopusher</span>
                </div>
                <div>
                  <span className="text-white/40 block">AUTONOMY</span>
                  <span className="text-luxury-ivory">{watches[1].specs.powerReserve}</span>
                </div>
                <div>
                  <span className="text-white/40 block">VALUATION</span>
                  <span className="text-luxury-champagne font-semibold">{watches[1].priceFormatted}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenDetail(watches[1])}
                  className="px-6 py-2.5 bg-luxury-champagne/10 border border-luxury-champagne/30 text-luxury-champagne hover:bg-luxury-champagne hover:text-black font-mono text-[10px] tracking-[0.25em] transition-all flex items-center gap-2"
                  data-cursor="DOSSIER"
                >
                  <span>EXPLORE TIMEPIECE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectWatch(watches[1])}
                  className={`px-4 py-2.5 border font-mono text-[10px] tracking-widest transition-all ${
                    activeWatchId === watches[1].id
                      ? 'border-luxury-champagne text-luxury-champagne'
                      : 'border-white/[0.08] text-luxury-stone hover:text-white hover:border-white/20'
                  }`}
                  data-cursor="SET HERO"
                >
                  {activeWatchId === watches[1].id ? 'ACTIVE HERO' : 'SELECT AS HERO'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 relative overflow-hidden bg-[#0D0D0D] border border-white/[0.06] p-8 sm:p-14 group-hover:border-luxury-champagne/30 transition-all duration-700">
              <div className="absolute top-6 right-6 font-mono text-[10px] tracking-widest text-luxury-stone/50">
                TIMEPIECE NO. 02 / MONOPUSHER
              </div>
              <div 
                className="relative aspect-[4/3] flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watches[1])}
                data-cursor="EXAMINE"
              >
                <img
                  src={watches[1].heroImage}
                  alt={watches[1].name}
                  className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Watch 03 & 04: Editorial Asymmetric Dual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {watches[2] && (
            <div className="group relative bg-[#0D0D0D] border border-white/[0.06] p-8 sm:p-12 hover:border-luxury-champagne/30 transition-all duration-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-luxury-stone/50 mb-6">
                  <span>TIMEPIECE NO. 03</span>
                  <span className="text-luxury-champagne">{watches[2].specs.reference}</span>
                </div>
                <h3 className="font-serif text-3xl font-light text-luxury-ivory">{watches[2].name}</h3>
                <p className="font-serif italic text-base text-luxury-stone">{watches[2].subtitle}</p>
              </div>

              <div 
                className="relative aspect-square my-8 flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watches[2])}
                data-cursor="EXAMINE"
              >
                <img
                  src={watches[2].heroImage}
                  alt={watches[2].name}
                  className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
                <span className="font-mono text-sm text-luxury-champagne">{watches[2].priceFormatted}</span>
                <button
                  onClick={() => onOpenDetail(watches[2])}
                  className="text-luxury-stone hover:text-luxury-ivory font-mono text-[10px] tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-all"
                  data-cursor="DOSSIER"
                >
                  <span>EXPLORE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {watches[3] && (
            <div className="group relative bg-[#0D0D0D] border border-white/[0.06] p-8 sm:p-12 hover:border-luxury-champagne/30 transition-all duration-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-luxury-stone/50 mb-6">
                  <span>TIMEPIECE NO. 04</span>
                  <span className="text-luxury-champagne">{watches[3].specs.reference}</span>
                </div>
                <h3 className="font-serif text-3xl font-light text-luxury-ivory">{watches[3].name}</h3>
                <p className="font-serif italic text-base text-luxury-stone">{watches[3].subtitle}</p>
              </div>

              <div 
                className="relative aspect-square my-8 flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watches[3])}
                data-cursor="EXAMINE"
              >
                <img
                  src={watches[3].heroImage}
                  alt={watches[3].name}
                  className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
                <span className="font-mono text-sm text-luxury-champagne">{watches[3].priceFormatted}</span>
                <button
                  onClick={() => onOpenDetail(watches[3])}
                  className="text-luxury-stone hover:text-luxury-ivory font-mono text-[10px] tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-all"
                  data-cursor="DOSSIER"
                >
                  <span>EXPLORE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
