import React, { useState } from 'react';
import type { Watch } from '../types/watch';
import { X, Plus, Check, RefreshCw, Sliders } from 'lucide-react';

interface WatchManagementModalProps {
  watches: Watch[];
  activeWatchId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectActiveWatch: (id: string) => void;
  onAddWatch: (newWatch: Watch) => void;
  onResetFactory: () => void;
}

export const WatchManagementModal: React.FC<WatchManagementModalProps> = ({
  watches,
  activeWatchId,
  isOpen,
  onClose,
  onSelectActiveWatch,
  onAddWatch,
  onResetFactory,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'add'>('switch');

  // Form state for creating a new custom timepiece
  const [formData, setFormData] = useState({
    name: 'ORA 05',
    subtitle: 'Chronographe Calendrier Perpétuel',
    collection: 'Master Chronometer',
    tagline: 'The pinnacle of astronomical time.',
    description: 'An extraordinary perpetual calendar chronograph combining moonphase indications, perpetual leap-year programming, and an open architecture Calibre 950 movement.',
    priceFormatted: '$42,000 USD',
    priceCHF: 'CHF 38,900',
    heroImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=2400&q=95',
    movementImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2400&q=95',
    frontImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=2400&q=95',
    sideImage: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=2400&q=95',
    backImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=2400&q=95',
    detailImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2400&q=95',
    caseMaterial: '18K White Gold with Hand-Satin Brushed Finish',
    diameter: '41.0 mm',
    thickness: '10.8 mm',
    movement: 'Manufacture Calibre 950 Perpetual Chronograph',
    powerReserve: '70 Hours',
    waterResistance: '50 Meters / 5 ATM',
  });

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ora-${Date.now()}`;
    const newWatch: Watch = {
      id: newId,
      name: formData.name,
      subtitle: formData.subtitle,
      collection: formData.collection,
      tagline: formData.tagline,
      description: formData.description,
      priceFormatted: formData.priceFormatted,
      priceCHF: formData.priceCHF,
      heroImage: formData.heroImage,
      movementImage: formData.movementImage,
      galleryImages: {
        front: formData.frontImage || formData.heroImage,
        side: formData.sideImage,
        back: formData.backImage,
        movement: formData.movementImage,
        detail: formData.detailImage,
        lifestyle: formData.heroImage,
      },
      specs: {
        reference: `REF. 950-${Math.floor(100 + Math.random() * 899)}`,
        caseMaterial: formData.caseMaterial,
        diameter: formData.diameter,
        thickness: formData.thickness,
        movement: formData.movement,
        frequency: '28,800 vph (4.0 Hz)',
        jewels: '35 Synthetic Rubies',
        powerReserve: formData.powerReserve,
        waterResistance: formData.waterResistance,
        crystal: 'Domed sapphire crystal with anti-reflective treatment',
        strap: 'Bespoke hand-sewn alligator strap',
        clasp: 'Folding clasp in matching precious metal',
        finishing: 'Hand-chamfered bridges with Geneva Seal specification',
      },
      chapterHighlights: [
        {
          number: '01',
          title: 'THE DIAL',
          subtitle: 'Perpetual Calendar Geometry',
          detail: 'Quad-register astronomical layout displaying day, date, month, and precision moonphase.',
        },
        {
          number: '02',
          title: 'THE CASE',
          subtitle: 'White Gold Architecture',
          detail: 'Fluted bezel and stepped lugs hand-finished with diamond paste.',
        },
        {
          number: '03',
          title: 'THE MOVEMENT',
          subtitle: 'Calibre 950 Mechanism',
          detail: 'Integrated column-wheel chronograph with mechanical memory.',
        },
        {
          number: '04',
          title: 'THE CRAFT',
          subtitle: 'Geneva Atelier Finitions',
          detail: 'Over 200 hours of manual decoration on untreated German silver.',
        },
        {
          number: '05',
          title: 'THE CALIBRE',
          subtitle: 'Astronomical Precision',
          detail: 'Deviation rate of 1 day every 122 years on moonphase complication.',
        },
      ],
    };

    onAddWatch(newWatch);
    setActiveTab('switch');
  };

  return (
    <div
      className="fixed inset-0 z-[9997] bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#090909] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-[#060606]">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-luxury-champagne" />
            <div>
              <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">
                ATELIER VAULT
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne block mt-0.5">
                CURATE REAL WATCH PHOTOGRAPHY & CATALOGUE
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="CLOSE"
            aria-label="Close management modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-white/[0.08] bg-[#070707] px-8">
          <button
            onClick={() => setActiveTab('switch')}
            className={`py-3.5 px-4 font-mono text-[10px] tracking-[0.2em] transition-all relative ${
              activeTab === 'switch'
                ? 'text-luxury-champagne'
                : 'text-luxury-stone hover:text-luxury-ivory'
            }`}
          >
            SELECT ACTIVE TIMEPIECE ({watches.length})
            {activeTab === 'switch' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-luxury-champagne" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3.5 px-4 font-mono text-[10px] tracking-[0.2em] transition-all relative ${
              activeTab === 'add'
                ? 'text-luxury-champagne'
                : 'text-luxury-stone hover:text-luxury-ivory'
            }`}
          >
            + ADD CUSTOM WATCH PHOTOGRAPHY
            {activeTab === 'add' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-luxury-champagne" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {activeTab === 'switch' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-serif italic text-base text-luxury-stone font-light">
                  Click any timepiece below to immediately set it as the primary hero showcase throughout the website.
                </p>

                <button
                  onClick={onResetFactory}
                  className="flex items-center gap-2 text-luxury-stone hover:text-luxury-champagne font-mono text-[9px] tracking-widest transition-colors"
                  title="Reset to original curated timepieces"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RESET TO FACTORY PRESETS</span>
                </button>
              </div>

              {/* Grid of Available Timepieces */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watches.map((w) => {
                  const isActive = w.id === activeWatchId;
                  return (
                    <div
                      key={w.id}
                      onClick={() => onSelectActiveWatch(w.id)}
                      className={`p-4 border rounded-sm cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                        isActive
                          ? 'border-luxury-champagne bg-luxury-champagne/[0.08] shadow-lg shadow-black'
                          : 'border-white/[0.08] bg-[#050505] hover:border-white/20'
                      }`}
                      data-cursor="SELECT"
                    >
                      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-black/60 p-1 rounded border border-white/[0.04]">
                        <img
                          src={w.heroImage}
                          alt={w.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[8px] tracking-widest text-luxury-champagne uppercase">
                            {w.collection}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 font-mono text-[8px] tracking-wider text-luxury-champagne">
                              <Check className="w-2.5 h-2.5" /> ACTIVE
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-xl font-light text-luxury-ivory truncate mt-0.5">
                          {w.name}
                        </h4>
                        <p className="font-serif italic text-xs text-luxury-stone truncate">
                          {w.subtitle}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.05] font-mono text-[9px] text-luxury-stone/70">
                          <span>{w.specs.diameter}</span>
                          <span className="text-luxury-bone">{w.priceFormatted}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Add Custom Watch Form */
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <p className="font-serif italic text-base text-luxury-stone font-light">
                Add your own high-resolution watch photography URLs. The new timepiece will instantly inherit all cinematic motion, hover interactions, anatomy storytelling, and catalogue specifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    MODEL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    SUBTITLE / COMPLICATION *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    HERO REAL WATCH PHOTOGRAPHY URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    MOVEMENT PHOTOGRAPHY URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.movementImage}
                    onChange={(e) => setFormData({ ...formData, movementImage: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    PROFILE / SIDE VIEW URL
                  </label>
                  <input
                    type="url"
                    value={formData.sideImage}
                    onChange={(e) => setFormData({ ...formData, sideImage: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    CASEBACK VIEW URL
                  </label>
                  <input
                    type="url"
                    value={formData.backImage}
                    onChange={(e) => setFormData({ ...formData, backImage: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    DETAIL / MACRO URL
                  </label>
                  <input
                    type="url"
                    value={formData.detailImage}
                    onChange={(e) => setFormData({ ...formData, detailImage: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-mono focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    CASE MATERIAL
                  </label>
                  <input
                    type="text"
                    value={formData.caseMaterial}
                    onChange={(e) => setFormData({ ...formData, caseMaterial: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    CASE DIAMETER
                  </label>
                  <input
                    type="text"
                    value={formData.diameter}
                    onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                    PRICE (USD)
                  </label>
                  <input
                    type="text"
                    value={formData.priceFormatted}
                    onChange={(e) => setFormData({ ...formData, priceFormatted: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1">
                  EDITORIAL HOROLOGICAL DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-3 py-2 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('switch')}
                  className="px-5 py-2.5 border border-white/[0.1] text-luxury-stone hover:text-white font-mono text-[10px] tracking-widest transition-colors"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors flex items-center gap-2 font-medium"
                  data-cursor="SAVE"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>PUBLISH TIMEPIECE TO MAISON</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
