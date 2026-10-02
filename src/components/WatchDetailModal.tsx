import React, { useState } from 'react';
import type { Watch } from '../types/watch';
import { X, ArrowUpRight, ShieldCheck, Clock, Compass } from 'lucide-react';

interface WatchDetailModalProps {
  watch: Watch;
  isOpen: boolean;
  onClose: () => void;
  onAcquire: (watch: Watch) => void;
}

export const WatchDetailModal: React.FC<WatchDetailModalProps> = ({
  watch,
  isOpen,
  onClose,
  onAcquire,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'side' | 'back' | 'movement' | 'detail'>('front');

  if (!isOpen) return null;

  const currentImage = watch.galleryImages[activeView] || watch.heroImage;

  const specsList = [
    { label: 'REFERENCE', value: watch.specs.reference },
    { label: 'CASE MATERIAL', value: watch.specs.caseMaterial },
    { label: 'DIAMETER', value: watch.specs.diameter },
    { label: 'THICKNESS', value: watch.specs.thickness },
    { label: 'MANUFACTURE CALIBRE', value: watch.specs.movement },
    { label: 'OSCILLATION FREQUENCY', value: watch.specs.frequency },
    { label: 'JEWEL BEARINGS', value: watch.specs.jewels },
    { label: 'POWER AUTONOMY', value: watch.specs.powerReserve },
    { label: 'WATER RESISTANCE', value: watch.specs.waterResistance },
    { label: 'CRYSTAL', value: watch.specs.crystal },
    { label: 'STRAP / BRACELET', value: watch.specs.strap },
    { label: 'CLASP MECHANISM', value: watch.specs.clasp },
    { label: 'DECORATIVE FINISHING', value: watch.specs.finishing },
  ];

  return (
    <div 
      className="fixed inset-0 z-[9995] bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl bg-[#090909] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-[#060606]">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">ORA</span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne">GENÈVE · DOSSIER HORLOGER</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="CLOSE"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Main Catalogue Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Gallery & Large Watch Photography Showcase */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#080808] border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-champagne uppercase">
                  {watch.collection}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-luxury-stone/60">
                  {watch.specs.reference}
                </span>
              </div>

              {/* Main Image View */}
              <div className="relative aspect-[4/3] flex items-center justify-center p-4 bg-[#050505] border border-white/[0.04] rounded-sm group overflow-hidden">
                <img
                  src={currentImage}
                  alt={`${watch.name} - ${activeView} view`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] transition-all duration-500 group-hover:scale-105"
                />
                <div className="light-sweep pointer-events-none" aria-hidden="true" />
              </div>

              {/* Gallery View Thumbnails / Angle Selectors */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {(['front', 'side', 'back', 'movement', 'detail'] as const).map((angle) => {
                  const img = watch.galleryImages[angle] || watch.heroImage;
                  const isSelected = activeView === angle;
                  return (
                    <button
                      key={angle}
                      onClick={() => setActiveView(angle)}
                      className={`relative aspect-square border p-1 rounded-sm transition-all duration-300 flex items-center justify-center overflow-hidden ${
                        isSelected
                          ? 'border-luxury-champagne bg-luxury-champagne/[0.08]'
                          : 'border-white/[0.08] hover:border-white/20 bg-black/40'
                      }`}
                      data-cursor="VIEW"
                    >
                      <img src={img} alt={angle} className="max-h-full max-w-full object-contain" />
                      <span className="absolute bottom-1 right-1 font-mono text-[7px] tracking-wider text-luxury-stone/80 uppercase bg-black/80 px-1">
                        {angle}
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

          {/* Right: Detailed Dossier & Acquisition Action */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#0A0A0A] space-y-8">
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
                    {watch.priceFormatted}
                  </span>
                  <span className="font-mono text-xs text-luxury-stone/60">
                    {watch.priceCHF}
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
                    <div key={spec.label} className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2">
                      <dt className="text-luxury-stone/60 tracking-wider flex-shrink-0">{spec.label}</dt>
                      <dd className="text-luxury-ivory text-right font-sans font-light text-xs truncate">{spec.value}</dd>
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
                className="w-full py-3.5 bg-luxury-champagne text-black font-mono text-[11px] tracking-[0.25em] hover:bg-white transition-all flex items-center justify-center gap-2 group font-medium"
                data-cursor="INQUIRE"
              >
                <span>REQUEST BESPOKE ALLOCATION</span>
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
