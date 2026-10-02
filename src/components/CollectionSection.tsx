import React from 'react';
import type { WatchModel, WatchFilters } from '../types/database';
import { WatchVisual } from './WatchVisual';
import { ArrowUpRight, Heart } from 'lucide-react';

interface CollectionSectionProps {
  watches: WatchModel[];
  activeWatchId: string;
  onSelectWatch: (watch: WatchModel) => void;
  onOpenDetail: (watch: WatchModel) => void;
  filters: WatchFilters;
  onFilterChange: (filters: WatchFilters) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  watches,
  activeWatchId,
  onSelectWatch,
  onOpenDetail,
  filters,
  onFilterChange,
  isFavorite,
  onToggleFavorite,
}) => {
  const getAvailabilityBadge = (avail: WatchModel['availability']) => {
    switch (avail) {
      case 'AVAILABLE':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      case 'LIMITED AVAILABILITY':
        return 'text-luxury-champagne border-luxury-champagne/40 bg-luxury-champagne/[0.08]';
      case 'SOLD OUT':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
      case 'COMING SOON':
        return 'text-sky-300 border-sky-400/30 bg-sky-950/20';
    }
  };

  return (
    <section
      id="collection"
      className="relative w-full bg-[#070707] text-[#F4F1EA] py-32 px-6 sm:px-12 lg:px-16 overflow-hidden"
    >
      {/* Background Ambience */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-luxury-champagne/[0.02] blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto border-b border-white/[0.08] pb-12 mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
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

      {/* Live Editorial Filter Bar */}
      <div className="max-w-7xl mx-auto mb-16 p-4 sm:p-5 bg-[#050505] border border-white/[0.06] rounded-sm flex flex-wrap items-center justify-between gap-4">
        {/* Collections Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[9px] tracking-wider text-luxury-stone/60 uppercase mr-1">
            COLLECTION:
          </span>
          {[
            { label: 'ALL LINEAGES', value: 'all' },
            { label: 'MASTER CHRONOMETER', value: 'Master Chronometer' },
            { label: 'GRAND COMPLICATION', value: 'Grand Complication' },
            { label: 'AVANT-GARDE SKELETON', value: 'Avant-Garde Skeleton' },
            { label: 'MÉTIERS D’ART', value: 'Métiers d’Art' },
          ].map((c) => {
            const isSelected = (!filters.collection && c.value === 'all') || filters.collection === c.value;
            return (
              <button
                key={c.value}
                onClick={() => onFilterChange({ ...filters, collection: c.value === 'all' ? undefined : c.value })}
                className={`px-3 py-1 font-mono text-[9px] tracking-wider rounded-sm transition-all ${
                  isSelected
                    ? 'bg-luxury-champagne text-black font-semibold'
                    : 'bg-white/[0.02] text-luxury-stone hover:text-white border border-white/[0.06]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns (Availability & Material) */}
        <div className="flex items-center gap-3">
          <select
            value={filters.availability || 'all'}
            onChange={(e) => onFilterChange({ ...filters, availability: e.target.value === 'all' ? undefined : e.target.value })}
            className="bg-[#090909] border border-white/[0.08] text-luxury-ivory font-mono text-[10px] px-2.5 py-1.5 rounded uppercase focus:border-luxury-champagne focus:outline-none"
          >
            <option value="all">ALL AVAILABILITY</option>
            <option value="AVAILABLE">AVAILABLE ONLY</option>
            <option value="LIMITED AVAILABILITY">LIMITED ONLY</option>
            <option value="SOLD OUT">SOLD OUT</option>
          </select>

          <span className="font-mono text-[10px] text-luxury-stone/60">
            {watches.length} PIECES
          </span>
        </div>
      </div>

      {/* Editorial Asymmetrical Layout */}
      <div className="max-w-7xl mx-auto flex flex-col gap-24 sm:gap-36">
        
        {/* Watch 01: Large Dominant Editorial Hero Composition */}
        {watches[0] && (
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center group">
            <div className="lg:col-span-7 relative overflow-hidden bg-[#0A0A0A] border border-white/[0.06] p-8 sm:p-14 group-hover:border-luxury-champagne/30 transition-all duration-700">
              <div className="absolute top-6 left-6 font-mono text-[10px] tracking-widest text-luxury-stone/50">
                TIMEPIECE NO. 01 / {(watches[0].collection || 'GENEVA').toUpperCase()}
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => onToggleFavorite(watches[0].id)}
                className={`absolute top-6 right-6 p-2 rounded border transition-all z-20 ${
                  isFavorite(watches[0].id)
                    ? 'border-luxury-champagne text-luxury-champagne bg-luxury-champagne/10'
                    : 'border-white/10 text-luxury-stone hover:text-white'
                }`}
                data-cursor="FAVORITE"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite(watches[0].id) ? 'fill-current' : ''}`} />
              </button>

              <div
                className="relative aspect-[4/3] flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watches[0])}
                data-cursor="EXAMINE"
              >
                <WatchVisual
                  image={watches[0].hero_image}
                  alt={watches[0].name}
                  depth={1.1}
                  intensity={1}
                  lightSweep={true}
                  className="max-h-[90%] max-w-[90%] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pl-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-champagne uppercase block">
                    {watches[0].collection} · {watches[0].specs?.reference}
                  </span>
                  <span className={`px-2 py-0.5 border font-mono text-[8px] tracking-widest rounded-full uppercase ${getAvailabilityBadge(watches[0].availability)}`}>
                    {watches[0].availability}
                  </span>
                </div>

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
                  <span className="text-luxury-ivory">
                    {watches[0].specs?.diameter} · {watches[0].specs?.case_material ? watches[0].specs.case_material.split(' ')[0] : ''}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">CALIBRE</span>
                  <span className="text-luxury-ivory">{watches[0].specs?.movement ? watches[0].specs.movement.split(' ')[1] : 'Calibre 900'}</span>
                </div>
                <div>
                  <span className="text-white/40 block">POWER RESERVE</span>
                  <span className="text-luxury-ivory">{watches[0].specs?.power_reserve}</span>
                </div>
                <div>
                  <span className="text-white/40 block">VALUATION</span>
                  <span className="text-luxury-champagne font-semibold">{watches[0].formattedPrice}</span>
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

        {/* Watch 02: Offset Editorial Layout */}
        {watches[1] && (
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center group">
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center space-y-6 lg:pr-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-champagne uppercase block">
                    {watches[1].collection} · {watches[1].specs?.reference}
                  </span>
                  <span className={`px-2 py-0.5 border font-mono text-[8px] tracking-widest rounded-full uppercase ${getAvailabilityBadge(watches[1].availability)}`}>
                    {watches[1].availability}
                  </span>
                </div>

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
                  <span className="text-luxury-ivory">{watches[1].specs?.diameter} · 18K Rose Gold</span>
                </div>
                <div>
                  <span className="text-white/40 block">CALIBRE</span>
                  <span className="text-luxury-ivory">{watches[1].specs?.movement ? watches[1].specs.movement.split(' ')[1] : 'Calibre 910'}</span>
                </div>
                <div>
                  <span className="text-white/40 block">AUTONOMY</span>
                  <span className="text-luxury-ivory">{watches[1].specs?.power_reserve}</span>
                </div>
                <div>
                  <span className="text-white/40 block">VALUATION</span>
                  <span className="text-luxury-champagne font-semibold">{watches[1].formattedPrice}</span>
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

            <div className="lg:col-span-7 order-1 lg:order-2 relative overflow-hidden bg-[#0A0A0A] border border-white/[0.06] p-8 sm:p-14 group-hover:border-luxury-champagne/30 transition-all duration-700">
              <div className="absolute top-6 right-6 font-mono text-[10px] tracking-widest text-luxury-stone/50">
                TIMEPIECE NO. 02 / {(watches[1].collection || 'GENEVA').toUpperCase()}
              </div>

              <button
                onClick={() => onToggleFavorite(watches[1].id)}
                className={`absolute top-6 left-6 p-2 rounded border transition-all z-20 ${
                  isFavorite(watches[1].id)
                    ? 'border-luxury-champagne text-luxury-champagne bg-luxury-champagne/10'
                    : 'border-white/10 text-luxury-stone hover:text-white'
                }`}
                data-cursor="FAVORITE"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite(watches[1].id) ? 'fill-current' : ''}`} />
              </button>

              <div
                className="relative aspect-[4/3] flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watches[1])}
                data-cursor="EXAMINE"
              >
                <WatchVisual
                  image={watches[1].hero_image}
                  alt={watches[1].name}
                  depth={1.1}
                  intensity={1}
                  lightSweep={true}
                  className="max-h-[90%] max-w-[90%] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        )}

        {/* Watch 03 & 04+: Asymmetric Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {watches.slice(2).map((watch, idx) => (
            <div
              key={watch.id}
              className="group relative bg-[#0A0A0A] border border-white/[0.06] p-8 sm:p-12 hover:border-luxury-champagne/30 transition-all duration-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-luxury-stone/50 mb-6">
                  <div className="flex items-center gap-2">
                    <span>TIMEPIECE NO. 0{idx + 3}</span>
                    <span className={`px-2 py-0.5 border text-[7px] tracking-wider rounded-full uppercase ${getAvailabilityBadge(watch.availability)}`}>
                      {watch.availability}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleFavorite(watch.id)}
                    className={`p-1.5 rounded border transition-all ${
                      isFavorite(watch.id)
                        ? 'border-luxury-champagne text-luxury-champagne bg-luxury-champagne/10'
                        : 'border-white/10 text-luxury-stone hover:text-white'
                    }`}
                    data-cursor="FAVORITE"
                  >
                    <Heart className={`w-3 h-3 ${isFavorite(watch.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="font-serif text-3xl font-light text-luxury-ivory">{watch.name}</h3>
                <p className="font-serif italic text-base text-luxury-stone">{watch.subtitle}</p>
              </div>

              <div
                className="relative aspect-square my-8 flex items-center justify-center cursor-pointer"
                onClick={() => onOpenDetail(watch)}
                data-cursor="EXAMINE"
              >
                <WatchVisual
                  image={watch.hero_image}
                  alt={watch.name}
                  depth={1.0}
                  intensity={0.9}
                  lightSweep={true}
                  className="max-h-[88%] max-w-[88%] group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
                <span className="font-mono text-sm text-luxury-champagne">{watch.formattedPrice}</span>
                <button
                  onClick={() => onOpenDetail(watch)}
                  className="text-luxury-stone hover:text-luxury-ivory font-mono text-[10px] tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-all"
                  data-cursor="DOSSIER"
                >
                  <span>EXPLORE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
