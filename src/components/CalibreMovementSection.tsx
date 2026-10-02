import React, { useState, useEffect, useRef } from 'react';
import type { WatchModel } from '../types/database';
import { ShieldCheck, Cpu, Gauge, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CalibreMovementSectionProps {
  watch: WatchModel | null;
}

interface ComponentPin {
  id: string;
  name: string;
  category: string;
  top: string;
  left: string;
  description: string;
  specification: string;
  lineDirection: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const MOVEMENT_PINS: ComponentPin[] = [
  {
    id: 'balance',
    name: 'GLUCYDUR BALANCE WHEEL',
    category: 'OSCILLATOR',
    top: '38%',
    left: '68%',
    description: 'Free-sprung variable inertia balance with 4 gold regulating micro-screws and paramagnetic hairspring.',
    specification: '28,800 VPH (4.0 Hz) · BREGUET OVERCOIL',
    lineDirection: 'top-right',
  },
  {
    id: 'rotor',
    name: '22K GOLD MICRO-ROTOR',
    category: 'WINDING KINEMATICS',
    top: '28%',
    left: '32%',
    description: 'High-density 22-carat yellow gold oscillating weight mounted on ceramic ball bearings with bidirectional winding efficiency.',
    specification: 'SOLID 22K AU · DUAL-DIRECTION CHARGE',
    lineDirection: 'top-left',
  },
  {
    id: 'bridges',
    name: 'HAND-CHAMFERED BRIDGES',
    category: 'MÉTIERS D’ART',
    top: '52%',
    left: '42%',
    description: 'Untreated German silver bridges decorated with classic Côtes de Genève stripes and hand-beveled specular anglage.',
    specification: '1.2MM GENEVA WAVES · HAND MIRROR POLISH',
    lineDirection: 'bottom-left',
  },
  {
    id: 'jewels',
    name: '33 SYNTHETIC RUBIES',
    category: 'FRICTION REDUCTION',
    top: '64%',
    left: '60%',
    description: 'Olive-drilled corundum ruby jewels set into diamond-machined chatons, reducing frictional drag across the gear train.',
    specification: '33 CORUNDUM JEWELS · OIL SINK RETENTION',
    lineDirection: 'bottom-right',
  },
  {
    id: 'escapement',
    name: 'SWISS LEVER ESCAPEMENT',
    category: 'CHRONOMETRY',
    top: '46%',
    left: '74%',
    description: 'Silicon escape wheel and anchor pallet fork delivering frictionless energy transfer with zero magnetic susceptibility.',
    specification: 'PARAMAGNETIC MONOCRYSTALLINE SILICON',
    lineDirection: 'top-right',
  },
  {
    id: 'reserve',
    name: 'SERIES TWIN BARRELS',
    category: 'ENERGY AUTONOMY',
    top: '72%',
    left: '30%',
    description: 'Dual fast-rotating mainspring barrels linked in series, ensuring linear isochronous torque release for 72 continuous hours.',
    specification: '72-HOUR AUTONOMOUS CHRONOMETRY',
    lineDirection: 'bottom-left',
  },
];

export const CalibreMovementSection: React.FC<CalibreMovementSectionProps> = ({ watch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [activePin, setActivePin] = useState<ComponentPin>(MOVEMENT_PINS[0]);

  const movementImage = watch?.movement_image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2400&q=95';

  useEffect(() => {
    const el = containerRef.current;
    const img = imageRef.current;
    if (!el || !img) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Smooth movement parallax and slow scale on scroll
      gsap.fromTo(
        img,
        { scale: 1.0, y: -20, filter: 'brightness(0.7)' },
        {
          scale: 1.15,
          y: 40,
          filter: 'brightness(1.05)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [movementImage]);

  return (
    <section
      id="calibre"
      ref={containerRef}
      className="relative w-full bg-[#030303] text-[#F4F1EA] py-32 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background radial atmosphere */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(25,25,23,0.6)_0%,_rgba(3,3,3,1)_80%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Editorial Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-12 mb-16 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-luxury-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-luxury-champagne uppercase">
              MANUFACTURE CALIBRE 900
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-luxury-ivory">
            THE MECHANICAL HEART
          </h2>
        </div>

        <div className="max-w-md text-left md:text-right">
          <p className="font-serif italic text-xl sm:text-2xl text-luxury-stone font-light">
            Micro-rotor kinematics.
          </p>
          <p className="font-sans text-xs text-luxury-stone/70 mt-2 font-light leading-relaxed">
            Real high-resolution macro photography of the Calibre 900 architecture. Interactive callout points reveal the meticulous hand-chamfering and chronometric balance.
          </p>
        </div>
      </div>

      {/* Main Interactive Movement Stage */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Real Movement Photography with Interactive Hotspots */}
        <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] bg-[#0A0A0A] border border-white/[0.08] rounded-sm overflow-hidden group shadow-2xl shadow-black">
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <img
              ref={imageRef}
              src={movementImage}
              alt="Calibre 900 Mechanical Movement - High Resolution Swiss Macro Photography"
              className="w-full h-full object-cover transition-all duration-700 select-none"
              loading="lazy"
            />

            {/* Subtle Vignette & Light Sweep Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
            <div className="light-sweep pointer-events-none" aria-hidden="true" />
            <div className="film-grain" aria-hidden="true" />

            {/* Interactive Component Callout Pins */}
            {MOVEMENT_PINS.map((pin) => {
              const isSelected = activePin.id === pin.id;
              return (
                <div
                  key={pin.id}
                  style={{ top: pin.top, left: pin.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                >
                  <button
                    onClick={() => setActivePin(pin)}
                    onMouseEnter={() => setActivePin(pin)}
                    className="relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9"
                    data-cursor="PIN"
                    aria-label={`Inspect ${pin.name}`}
                  >
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        isSelected ? 'bg-luxury-champagne/40' : 'bg-white/20'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 items-center justify-center border transition-all duration-300 ${
                        isSelected
                          ? 'border-luxury-champagne bg-luxury-champagne text-black scale-110'
                          : 'border-white/60 bg-black/80 text-white hover:border-luxury-champagne hover:scale-105'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    </span>
                  </button>

                  <div
                    className={`hidden sm:block absolute whitespace-nowrap pointer-events-none transition-all duration-300 ${
                      pin.lineDirection.includes('right') ? 'left-8 top-1' : 'right-8 top-1 text-right'
                    } ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-1'}`}
                  >
                    <span className="px-2 py-0.5 bg-black/85 backdrop-blur-md border border-white/10 font-mono text-[9px] tracking-widest text-luxury-ivory uppercase">
                      {pin.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-luxury-stone/60 font-mono text-[9px] tracking-widest pointer-events-none">
            <span>CALIBRE 900 · GENEVA MANUFACTURE</span>
            <span className="hidden sm:inline">SELECT ANY PIN TO EXAMINE HOROLOGY</span>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-8 bg-[#070707] border border-white/[0.08] p-8 sm:p-10 rounded-sm">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne">
                COMPONENT INSPECTION
              </span>
              <span className="font-mono text-[10px] tracking-widest text-luxury-stone/50">
                0{MOVEMENT_PINS.findIndex((p) => p.id === activePin.id) + 1} / 06
              </span>
            </div>

            <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/70 block uppercase">
              {activePin.category}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-ivory mt-2">
              {activePin.name}
            </h3>

            <p className="text-luxury-stone text-sm font-sans font-light leading-relaxed mt-4">
              {activePin.description}
            </p>

            <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.06] rounded-sm">
              <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-stone/60 uppercase block mb-1">
                TOLERANCE & METROLOGY
              </span>
              <span className="font-mono text-[10px] tracking-wider text-luxury-champagne font-medium">
                {activePin.specification}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h4 className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/80 uppercase">
              MANUFACTURE METRICS
            </h4>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="flex items-start gap-2.5">
                <Gauge className="w-3.5 h-3.5 text-luxury-champagne mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-mono text-[9px] text-white/50 block">RATE FREQUENCY</span>
                  <span className="font-mono text-[11px] text-luxury-bone">28,800 VPH</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="w-3.5 h-3.5 text-luxury-champagne mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-mono text-[9px] text-white/50 block">POWER RESERVE</span>
                  <span className="font-mono text-[11px] text-luxury-bone">
                    {watch?.specs?.power_reserve || '72 HOURS'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-luxury-champagne mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-mono text-[9px] text-white/50 block">CHRONOMETRIC RATE</span>
                  <span className="font-mono text-[11px] text-luxury-bone">−2 / +2 SEC/DAY</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Cpu className="w-3.5 h-3.5 text-luxury-champagne mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-mono text-[9px] text-white/50 block">JEWEL BEARING</span>
                  <span className="font-mono text-[11px] text-luxury-bone">
                    {watch?.specs?.jewels || '33 RUBIES'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
