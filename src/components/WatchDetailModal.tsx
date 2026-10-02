import React, { useState } from 'react';
import type { WatchModel } from '../types/database';
import { X, ArrowUpRight, ShieldCheck, Clock, Compass, Heart } from 'lucide-react';

interface WatchDetailModalProps {
  watch: WatchModel | null;
  isOpen: boolean;
  onClose: () => void;
  onAcquire: (watch: WatchModel) => void;
  isFavorite: boolean;
  onToggleFavorite: (watchId: string) => void;
}

export const WatchDetailModal: React.FC<WatchDetailModalProps> = ({
  watch,
  isOpen,
  onClose,
  onAcquire,
  isFavorite,
  onToggleFavorite,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!isOpen || !watch) return null;

  // Aggregate all gallery images
  const allImages: { url: string; label: string }[] = [];
  if (watch.images && watch.images.length > 0) {
    watch.images.forEach((img) => {
      allImages.push({ url: img.image_url, label: img.image_type });
    });
  } else {
    allImages.push({ url: watch.hero_image, label: 'hero' });
    allImages.push({ url: watch.movement_image, label: 'movement' });
  }

  const currentImage = allImages[activeImageIndex] || { url: watch.hero_image, label: 'hero' };

  const handleSelectThumbnail = (idx: number) => {
    if (idx === activeImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveImageIndex(idx);
      setIsTransitioning(false);
    }, 180);
  };

  const specsList = [
    { label: 'REFERENCE', value: watch.specs?.reference || 'REF. 900-GENEVA' },
    { label: 'CASE MATERIAL', value: watch.specs?.case_material || 'Grade 5 Titanium' },
    { label: 'DIAMETER', value: watch.specs?.diameter || '41.5 mm' },
    { label: 'THICKNESS', value: watch.specs?.thickness || '9.8 mm' },
    { label: 'MANUFACTURE CALIBRE', value: watch.specs?.movement || 'Calibre 900' },
    { label: 'FREQUENCY', value: watch.specs?.frequency || '28,800 vph (4.0 Hz)' },
    { label: 'JEWEL BEARINGS', value: watch.specs?.jewels || '33 Synthetic Rubies' },
    { label: 'POWER RESERVE', value: watch.specs?.power_reserve || '72 Hours' },
    { label: 'WATER RESISTANCE', value: watch.specs?.water_resistance || '100 Meters / 10 ATM' },
    { label: 'CRYSTAL', value: watch.specs?.crystal || 'Domed sapphire with anti-reflective coating' },
    { label: 'STRAP / BRACELET', value: watch.specs?.strap || 'Bespoke hand-sewn alligator' },
    { label: 'CLASP', value: watch.specs?.clasp || 'Titanium folding deployant' },
    { label: 'FINISHING', value: watch.specs?.finishing || 'Hand-chamfered Côtes de Genève' },
  ];

  const getAvailabilityBadge = (avail: WatchModel['availability']) => {
    switch (avail) {
      case 'AVAILABLE':
        return 'text-emerald-400/90 border-emerald-500/30 bg-emerald-950/20';
      case 'LIMITED AVAILABILITY':
        return 'text-luxury-champagne border-luxury-champagne/40 bg-luxury-champagne/[0.08]';
      case 'SOLD OUT':
        return 'text-rose-400/80 border-rose-500/30 bg-rose-950/20';
      case 'COMING SOON':
        return 'text-sky-300/80 border-sky-400/30 bg-sky-950/20';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9995] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-[#070707] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-white/[0.08] bg-[#050505]">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">
              ORA
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne">
              GENÈVE · DOSSIER HORLOGER
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(watch.id)}
              className={`p-2 rounded border transition-all ${
                isFavorite
                  ? 'border-luxury-champagne text-luxury-champagne bg-luxury-champagne/10'
                  : 'border-white/10 text-luxury-stone hover:text-white hover:border-white/20'
              }`}
              data-cursor="FAVORITE"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
              data-cursor="CLOSE"
              aria-label="Close detail modal"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Catalogue Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Advanced Smooth Transition Gallery */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#050505] border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-champagne uppercase">
                  {watch.collection}
                </span>

                {/* Conditional Availability Badge */}
                <span className={`px-2.5 py-0.5 border font-mono text-[9px] tracking-widest rounded-full uppercase ${getAvailabilityBadge(watch.availability)}`}>
                  {watch.availability}
                </span>
              </div>

              {/* Main Image Stage with cross-fade animation */}
              <div className="relative aspect-[4/3] flex items-center justify-center p-4 bg-[#080808] border border-white/[0.04] rounded-sm group overflow-hidden">
                <img
                  src={currentImage.url}
                  alt={`${watch.name} - ${currentImage.label}`}
                  className={`max-h-full max-w-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                    isTransitioning
                      ? 'opacity-0 scale-95 blur-sm'
                      : 'opacity-100 scale-100 blur-0 group-hover:scale-105'
                  }`}
                />
                <div className="light-sweep pointer-events-none" aria-hidden="true" />
                
                <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-widest text-luxury-stone/50 uppercase">
                  PERSPECTIVE: {currentImage.label}
                </span>
              </div>

              {/* Thumbnail Selector Bar */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => {
                  const isSelected = activeImageIndex === idx;
                  return (
                    <button
                      key={`${img.url}-${idx}`}
                      onClick={() => handleSelectThumbnail(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border p-1 rounded-sm transition-all flex items-center justify-center overflow-hidden ${
                        isSelected
                          ? 'border-luxury-champagne bg-luxury-champagne/[0.08]'
                          : 'border-white/[0.08] hover:border-white/20 bg-black/40'
                      }`}
                      data-cursor="VIEW"
                    >
                      <img src={img.url} alt={img.label} className="max-h-full max-w-full object-contain" />
                      <span className="absolute bottom-0.5 right-1 font-mono text-[6px] tracking-wider text-luxury-stone uppercase bg-black/80 px-1">
                        {img.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/[0.06] text-center font-mono text-[9px] tracking-wider text-luxury-stone/70">
              <div className="p-2 border border-white/[0.04] bg-white/[0.01]">
                <ShieldCheck className="w-3.5 h-3.5 mx-auto text-luxury-champagne mb-1" />
                <span>POINÇON DE GENÈVE</span>
              </div>
              <div className="p-2 border border-white/[0.04] bg-white/[0.01]">
                <Clock className="w-3.5 h-3.5 mx-auto text-luxury-champagne mb-1" />
                <span>5-YEAR WARRANTY</span>
              </div>
              <div className="p-2 border border-white/[0.04] bg-white/[0.01]">
                <Compass className="w-3.5 h-3.5 mx-auto text-luxury-champagne mb-1" />
                <span>CHRONOMETER COSC</span>
              </div>
            </div>
          </div>

          {/* Right Column: Catalogue Specifications & Acquisition */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#080808] space-y-8">
            <div>
              <div className="border-b border-white/[0.08] pb-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase block">
                  MANUFACTURE D’HORLOGERIE
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-luxury-ivory mt-1">
                  {watch.name}
                </h2>
                <p className="font-serif italic text-base sm:text-lg text-luxury-stone mt-1">
                  {watch.subtitle}
                </p>

                <div className="mt-4 flex items-baseline gap-4">
                  <span className="font-mono text-xl sm:text-2xl text-luxury-champagne font-light">
                    {watch.formattedPrice}
                  </span>
                  <span className="font-mono text-xs text-luxury-stone/60">
                    {watch.formattedPriceCHF}
                  </span>
                </div>
              </div>

              <div className="py-6 border-b border-white/[0.08]">
                <h4 className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone uppercase mb-3">
                  HISTOIRE & CONCEPTION
                </h4>
                <p className="text-luxury-stone/80 text-xs sm:text-sm font-sans font-light leading-relaxed">
                  {watch.description}
                </p>
              </div>

              {/* Complete Specifications Matrix */}
              <div className="py-6">
                <h4 className="font-mono text-[9px] tracking-[0.25em] text-luxury-champagne uppercase mb-4">
                  TECHNICAL SPECIFICATIONS MATRIX
                </h4>
                <dl className="space-y-3 font-mono text-[10px]">
                  {specsList.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2"
                    >
                      <dt className="text-luxury-stone/60 tracking-wider flex-shrink-0">
                        {spec.label}
                      </dt>
                      <dd className="text-luxury-ivory text-right font-sans font-light text-xs truncate">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onAcquire(watch);
                }}
                disabled={watch.availability === 'SOLD OUT'}
                className={`w-full py-3.5 font-mono text-[11px] tracking-[0.25em] transition-all flex items-center justify-center gap-2 group font-medium ${
                  watch.availability === 'SOLD OUT'
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-luxury-champagne text-black hover:bg-white'
                }`}
                data-cursor="INQUIRE"
              >
                <span>
                  {watch.availability === 'SOLD OUT'
                    ? 'PIECE ALLOCATED / SOLD OUT'
                    : watch.availability === 'COMING SOON'
                    ? 'JOIN ALLOCATION WAITLIST'
                    : 'REQUEST INFORMATION & ALLOCATION'}
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <p className="text-center font-mono text-[9px] tracking-wider text-luxury-stone/50">
                LIMITED PRODUCTION · COMPLIMENTARY GENEVA ATELIER DELIVERY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
