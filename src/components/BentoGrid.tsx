import React, { useState, useEffect, useRef } from 'react';
import { Compass, ShieldCheck, Zap, Layers, Sparkles, Sliders, Activity, Info } from 'lucide-react';

interface BentoGridProps {
  onOpenInspector: () => void;
  onOpenAcquisition: () => void;
}

interface GranularMetric {
  label: string;
  value: string;
  unit?: string;
  detail: string;
}

const CARD_METRICS: Record<string, { title: string; subsystem: string; metrics: GranularMetric[] }> = {
  card1: {
    title: 'SAROS & RING COMMAND ARCHITECTURE',
    subsystem: 'CALIBRE 9002 EPICYCLIC GEARING',
    metrics: [
      {
        label: 'Planetary Differential',
        value: '1 : 1.033',
        unit: 'ratio',
        detail: 'Epicyclic wheel gearing for 30/31-day discernment',
      },
      {
        label: 'Kinematic Components',
        value: '4 wheels / 2 trains',
        detail: 'Patented low-friction wheel train without levers',
      },
      {
        label: 'Ring Command Detents',
        value: '3 distinct positions',
        detail: '60° angular phase: Month, Local Date, Reference 24H',
      },
      {
        label: 'Annual Adjustment',
        value: '1 cycle / 365 days',
        detail: 'Single annual intervention required on March 1st',
      },
    ],
  },
  card2: {
    title: 'OFF-CENTRE 24-HOUR DISC METRICS',
    subsystem: 'DUAL TIME INVERSION MECHANICS',
    metrics: [
      {
        label: 'Pinion Module Pitch',
        value: '0.12 mm',
        unit: 'pitch',
        detail: 'High-precision micro-module involute tooth geometry',
      },
      {
        label: 'Sub-Dial Center Offset',
        value: '3.85 mm',
        unit: 'south',
        detail: 'Decentralized geometric balance relative to stem axis',
      },
      {
        label: 'Pointer Alignment Tolerance',
        value: '±0.015 mm',
        detail: 'Red inverted triangle optical registration precision',
      },
      {
        label: 'Jumping Hour Quickset',
        value: '1-hour increments',
        detail: 'Independent star wheel jump without stopping seconds',
      },
    ],
  },
  card3: {
    title: 'WHITE ROLESOR METALLURGICAL SPECS',
    subsystem: 'CASE ARCHITECTURE & HERMETIC SEAL',
    metrics: [
      {
        label: 'Fluted Bezel Facets',
        value: '60 radial flutes',
        detail: '6.00° angular spacing with mirror-polished ridges',
      },
      {
        label: '18ct White Gold Purity',
        value: '750‰ Au / 125‰ Pd',
        detail: 'Corrosion-proof palladium-stabilized white alloy',
      },
      {
        label: 'Oystersteel PREN Rating',
        value: '≥ 35 PREN',
        detail: 'Superaustenitic 904L grade pitting resistance',
      },
      {
        label: 'Static Hermetic Depth',
        value: '10 bar / 100 meters',
        detail: 'Twinlock double-gasket screw-down compression system',
      },
    ],
  },
  card4: {
    title: 'CALIBRE 9002 CHRONOMETRIC SPECS',
    subsystem: 'SUPERLATIVE PERPETUAL KINEMATICS',
    metrics: [
      {
        label: 'Chronergy Efficiency Gain',
        value: '+15%',
        detail: 'Nickel-phosphorus escapement kinetic optimization',
      },
      {
        label: 'Magnetic Field Immunity',
        value: '> 1,000 Gauss',
        detail: 'Paramagnetic blue Parachrom hairspring & anchor',
      },
      {
        label: 'Shock Acceleration Buffer',
        value: '5,000 Gs',
        detail: 'Paraflex elastomer shock-absorption spring clips',
      },
      {
        label: 'Cased Daily Tolerance',
        value: '−2 / +2 sec/day',
        detail: 'Strict Superlative Chronometer post-casing precision',
      },
    ],
  },
};

export const BentoGrid: React.FC<BentoGridProps> = ({
  onOpenInspector,
  onOpenAcquisition,
}) => {
  const [activeTab, setActiveTab] = useState<'movement' | 'case' | 'complications'>('movement');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Smooth Native Parallax Calculation
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animId: number;
    let targetOffset = 0;
    let currentOffset = 0;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      if (rect.bottom >= 0 && rect.top <= windowH) {
        const centerY = rect.top + rect.height / 2 - windowH / 2;
        targetOffset = Math.max(-600, Math.min(600, centerY));
      }
    };

    const loop = () => {
      currentOffset += (targetOffset - currentOffset) * 0.12;
      if (Math.abs(targetOffset - currentOffset) > 0.1) {
        setParallaxOffset(Math.round(currentOffset * 10) / 10);
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  // Parallax Multipliers
  const kickerY = prefersReducedMotion ? 0 : Math.max(-10, Math.min(10, parallaxOffset * 0.025));
  const headlineY = prefersReducedMotion ? 0 : Math.max(-18, Math.min(18, parallaxOffset * 0.055));
  const bodyY = prefersReducedMotion ? 0 : Math.max(-8, Math.min(8, parallaxOffset * 0.018));
  const diagramY = prefersReducedMotion ? 0 : Math.max(-14, Math.min(14, parallaxOffset * -0.035));
  const metricY = prefersReducedMotion ? 0 : Math.max(-12, Math.min(12, parallaxOffset * 0.04));

  // Render Granular Metrics Tooltip
  const renderGranularTooltip = (cardId: string) => {
    const data = CARD_METRICS[cardId];
    if (!data) return null;
    const isHovered = hoveredCard === cardId;

    return (
      <div
        className={`absolute inset-x-4 bottom-4 md:bottom-6 z-30 transition-all duration-300 pointer-events-none ${
          isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="bg-[#121312]/95 border border-[#d4af37]/60 shadow-[0_12px_32px_rgba(0,0,0,0.9),0_0_15px_rgba(212,175,55,0.12)] p-4 md:p-5 backdrop-blur-none text-left space-y-3">
          <div className="flex items-center justify-between border-b border-[#2d2e2d] pb-2 text-[10px] font-mono">
            <span className="text-[#d4af37] flex items-center gap-1.5 font-semibold tracking-wider uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>{data.title}</span>
            </span>
            <span className="text-[#8d8d89] hidden sm:inline">{data.subsystem}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
            {data.metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col py-1 border-b border-[#222422]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[#8d8d89] text-[11px] truncate">{m.label}</span>
                  <span className="text-[#d8d8d4] font-semibold text-right whitespace-nowrap">
                    {m.value}
                  </span>
                </div>
                <div className="text-[9.5px] text-[#6d6f6f] truncate mt-0.5">{m.detail}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#585a5a] pt-1">
            <span>SUPERLATIVE CHRONOMETER ATELIER METRICS</span>
            <span className="text-[#d4af37]">GENEVA TOLERANCE ±0.015MM</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#171817] text-[#d8d8d4] py-24 px-6 md:px-12 border-t border-[#3c3b3a] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header with Parallax Depth Layers */}
        <div className="space-y-4 max-w-2xl relative">
          <div
            style={{ transform: `translate3d(0, ${kickerY}px, 0)` }}
            className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono transition-transform ease-out will-change-transform flex items-center gap-2"
          >
            <span>Haute Horlogerie · Reference 336934 Dossier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60 animate-amber-pulse" />
          </div>

          <h2
            style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
            className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display transition-transform ease-out will-change-transform"
          >
            THE ARCHITECTURE OF GLOBAL TIME
          </h2>

          <p
            style={{ transform: `translate3d(0, ${bodyY}px, 0)` }}
            className="text-sm md:text-base text-[#8d8d89] leading-relaxed transition-transform ease-out will-change-transform"
          >
            Engineered for international travelers. Hover over any specification module to expand granular micromechanical metrics and telemetry.
          </p>
        </div>

        {/* Asymmetric Bento Grid with Interactive Hover Expansion & Metric Tooltips */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Large Featured Card (8 cols) — Saros Annual Calendar & Ring Command */}
          <div
            id="calibre"
            onMouseEnter={() => setHoveredCard('card1')}
            onMouseLeave={() => setHoveredCard(null)}
            className="md:col-span-8 hairline-border bg-[#191a19] p-8 md:p-12 flex flex-col justify-between group transition-all duration-300 ease-out hover:scale-[1.012] hover:-translate-y-1 hover:border-[#d4af37]/80 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.08)] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div
                style={{ transform: `translate3d(0, ${kickerY}px, 0)` }}
                className="flex items-center justify-between text-xs font-mono text-[#6d6f6f] transition-transform ease-out will-change-transform"
              >
                <span>01. MECHANICAL GENIUS</span>
                {/* Granular Metrics Indicator Badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-[#3c3b3a] group-hover:border-[#d4af37] text-[10px] text-[#8d8d89] group-hover:text-[#d4af37] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
                  <span>GRANULAR METRICS</span>
                </div>
              </div>

              <h3
                style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
                className="text-2xl md:text-4xl font-semibold text-[#d8d8d4] font-display transition-transform ease-out will-change-transform"
              >
                PATENTED SAROS MECHANISM & RING COMMAND
              </h3>

              <p
                style={{ transform: `translate3d(0, ${bodyY}px, 0)` }}
                className="text-sm text-[#8d8d89] leading-relaxed max-w-xl transition-transform ease-out will-change-transform"
              >
                Named after the astronomical cycle of solar and lunar eclipses, the Saros mechanism requires only four gear wheels and two gear ratios to automatically distinguish between 30-day and 31-day months. Only one adjustment is required each year: on the 1st of March. The rotatable Ring Command fluted bezel links the external bezel directly to the movement to select calendar, local time, or reference time functions.
              </p>
            </div>

            {/* Inset Mechanical Blueprint Diagram */}
            <div
              style={{ transform: `translate3d(0, ${diagramY}px, 0)` }}
              className="my-8 py-6 hairline-border bg-[#141514] flex items-center justify-center overflow-hidden transition-transform ease-out will-change-transform group-hover:border-[#585a5a]"
            >
              <svg
                viewBox="0 0 500 240"
                className="w-full max-w-md h-auto text-[#6d6f6f] select-none"
                fill="none"
              >
                {/* Dial outer boundary */}
                <circle cx="250" cy="120" r="105" stroke="#3c3b3a" strokeWidth="1.5" />
                <circle cx="250" cy="120" r="95" stroke="#1d4233" strokeWidth="6" />

                {/* 12 Month Apertures */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * Math.PI) / 6;
                  const x = 250 + Math.cos(angle) * 88;
                  const y = 120 + Math.sin(angle) * 88;
                  const isAugust = i === 4;
                  return (
                    <rect
                      key={i}
                      x={x - 2.5}
                      y={y - 4}
                      width="5"
                      height="8"
                      fill={isAugust ? '#d92534' : '#141514'}
                      stroke={isAugust ? '#ff4d5a' : '#3c3b3a'}
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Off-centre 24-Hour Disc */}
                <circle cx="250" cy="132" r="50" fill="#e8ecea" stroke="#8d8d89" strokeWidth="1.5" />
                <circle cx="250" cy="132" r="34" fill="#1c4233" stroke="#8d8d89" strokeWidth="1" />

                {/* Red Inverted Pointer */}
                <polygon points="250,90 244,82 256,82" fill="#d92534" stroke="#ffffff" strokeWidth="0.8" />

                {/* Technical Callout Lines */}
                <line x1="250" y1="82" x2="330" y2="45" stroke="#585a5a" strokeWidth="0.75" />
                <text x="335" y="49" fill="#d4af37" fontSize="10" fontFamily="JetBrains Mono">
                  FIXED RED REFERENCE TRIANGLE
                </text>

                <line x1="312" y1="182" x2="370" y2="182" stroke="#585a5a" strokeWidth="0.75" />
                <text x="375" y="186" fill="#d92534" fontSize="10" fontFamily="JetBrains Mono">
                  AUGUST MONTH APERTURE
                </text>
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#3c3b3a] text-xs font-mono text-[#8d8d89]">
              <div className="flex items-center gap-4">
                <span>ANNUAL ADJUSTMENTS: 1 PER YEAR</span>
                <span>·</span>
                <span>SYSTEM: RING COMMAND 3-POSITION</span>
              </div>
              <button
                onClick={onOpenInspector}
                className="text-[#d4af37] hover:text-[#e4bf47] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Examine Complications</span>
                <span>→</span>
              </button>
            </div>

            {/* Granular Watchmaking Metrics Tooltip */}
            {renderGranularTooltip('card1')}
          </div>

          {/* Card 2: Medium Card (4 cols) — Off-Centre 24-Hour Disc */}
          <div
            id="guilloche"
            onMouseEnter={() => setHoveredCard('card2')}
            onMouseLeave={() => setHoveredCard(null)}
            className="md:col-span-4 hairline-border bg-[#191a19] p-8 flex flex-col justify-between group transition-all duration-300 ease-out hover:scale-[1.015] hover:-translate-y-1 hover:border-[#d4af37]/80 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.08)] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div
                style={{ transform: `translate3d(0, ${kickerY}px, 0)` }}
                className="flex items-center justify-between text-xs font-mono text-[#6d6f6f] transition-transform ease-out will-change-transform"
              >
                <span>02. TRAVEL HOROLOGY</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-[#3c3b3a] group-hover:border-[#d4af37] text-[10px] text-[#8d8d89] group-hover:text-[#d4af37] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
                  <span>METRICS</span>
                </div>
              </div>

              <h3
                style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
                className="text-xl md:text-2xl font-semibold text-[#d8d8d4] font-display transition-transform ease-out will-change-transform"
              >
                OFF-CENTRE 24H DISC
              </h3>

              <p
                style={{ transform: `translate3d(0, ${bodyY}px, 0)` }}
                className="text-xs md:text-sm text-[#8d8d89] leading-relaxed transition-transform ease-out will-change-transform"
              >
                The traveler reads reference home time via the rotating off-centre disc, while local time is read through traditional center hands jumping instantaneously by hour increments without interrupting the seconds.
              </p>
            </div>

            {/* 24h Disc Circular Geometry Diagram with Inset Parallax */}
            <div
              style={{ transform: `translate3d(0, ${diagramY}px, 0)` }}
              className="my-6 py-6 hairline-border bg-[#141514] flex items-center justify-center transition-transform ease-out will-change-transform group-hover:border-[#585a5a]"
            >
              <div className="relative w-32 h-32 rounded-full border border-[#3c3b3a] flex items-center justify-center bg-[#191a19]">
                <div className="w-24 h-24 rounded-full border border-[#585a5a] flex items-center justify-center bg-[#e8ecea]">
                  <div className="w-14 h-14 rounded-full bg-[#1c4233] border border-[#8d8d89] flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-white">24H</span>
                  </div>
                </div>
                <div className="absolute top-1 text-[#d92534] text-xs font-mono">▲</div>
              </div>
            </div>

            <div className="text-xs font-mono text-[#6d6f6f] pt-4 border-t border-[#3c3b3a]">
              INDICATION: 24-HOUR CONTINUOUS INVERSION
            </div>

            {/* Granular Watchmaking Metrics Tooltip */}
            {renderGranularTooltip('card2')}
          </div>

          {/* Card 3: Medium Card (4 cols) — 42mm White Rolesor & Fluted Bezel */}
          <div
            onMouseEnter={() => setHoveredCard('card3')}
            onMouseLeave={() => setHoveredCard(null)}
            className="md:col-span-4 hairline-border bg-[#191a19] p-8 flex flex-col justify-between group transition-all duration-300 ease-out hover:scale-[1.015] hover:-translate-y-1 hover:border-[#d4af37]/80 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.08)] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div
                style={{ transform: `translate3d(0, ${kickerY}px, 0)` }}
                className="flex items-center justify-between text-xs font-mono text-[#6d6f6f] transition-transform ease-out will-change-transform"
              >
                <span>03. METALLURGY</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-[#3c3b3a] group-hover:border-[#d4af37] text-[10px] text-[#8d8d89] group-hover:text-[#d4af37] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
                  <span>METRICS</span>
                </div>
              </div>

              <h3
                style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
                className="text-xl md:text-2xl font-semibold text-[#d8d8d4] font-display transition-transform ease-out will-change-transform"
              >
                OYSTERSTEEL & WHITE GOLD
              </h3>

              <p
                style={{ transform: `translate3d(0, ${bodyY}px, 0)` }}
                className="text-xs md:text-sm text-[#8d8d89] leading-relaxed transition-transform ease-out will-change-transform"
              >
                A harmonious marriage of two noble metals: the extreme corrosion resistance of Oystersteel paired with the unmistakable luster of an 18ct white gold fluted Ring Command bezel.
              </p>
            </div>

            <div
              style={{ transform: `translate3d(0, ${metricY}px, 0)` }}
              className="my-6 space-y-3 font-mono text-xs text-[#8d8d89] transition-transform ease-out will-change-transform"
            >
              <div className="flex justify-between py-1.5 border-b border-[#2d2e2d]">
                <span>CASE DIAMETER</span>
                <span className="text-[#d8d8d4] tabular-nums">42.0 MM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2d2e2d]">
                <span>BEZEL</span>
                <span className="text-[#d8d8d4]">18CT WHITE GOLD FLUTED</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2d2e2d]">
                <span>BRACELET</span>
                <span className="text-[#d8d8d4]">OYSTER 3-PIECE SOLID</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>WATERPROOFNESS</span>
                <span className="text-[#d8d8d4] tabular-nums">100 METERS (330 FT)</span>
              </div>
            </div>

            <div className="text-xs font-mono text-[#6d6f6f] pt-4 border-t border-[#3c3b3a]">
              WINDING CROWN: TWINLOCK DOUBLE WATERPROOF
            </div>

            {/* Granular Watchmaking Metrics Tooltip */}
            {renderGranularTooltip('card3')}
          </div>

          {/* Card 4: Wide Card (8 cols) — Calibre 9002 Movement */}
          <div
            onMouseEnter={() => setHoveredCard('card4')}
            onMouseLeave={() => setHoveredCard(null)}
            className="md:col-span-8 hairline-border bg-[#191a19] p-8 md:p-12 flex flex-col justify-between group transition-all duration-300 ease-out hover:scale-[1.012] hover:-translate-y-1 hover:border-[#d4af37]/80 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(212,175,55,0.08)] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div
                style={{ transform: `translate3d(0, ${kickerY}px, 0)` }}
                className="flex items-center justify-between text-xs font-mono text-[#6d6f6f] transition-transform ease-out will-change-transform"
              >
                <span>04. PERPETUAL KINEMATICS</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-[#3c3b3a] group-hover:border-[#d4af37] text-[10px] text-[#8d8d89] group-hover:text-[#d4af37] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
                  <span>GRANULAR METRICS</span>
                </div>
              </div>

              <h3
                style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
                className="text-2xl md:text-3xl font-semibold text-[#d8d8d4] font-display transition-transform ease-out will-change-transform"
              >
                72-HOUR AUTONOMY & CHRONERGY ESCAPEMENT
              </h3>

              <p
                style={{ transform: `translate3d(0, ${bodyY}px, 0)` }}
                className="text-sm text-[#8d8d89] leading-relaxed max-w-xl transition-transform ease-out will-change-transform"
              >
                Entirely developed and manufactured in Geneva, Calibre 9002 features the patented Chronergy escapement made of nickel-phosphorus, making it insensitive to magnetic fields. Fitted with a blue Parachrom hairspring and high-performance Paraflex shock absorbers for peerless chronometric stability.
              </p>
            </div>

            {/* Metric Counters with Lifted Parallax Layer */}
            <div
              style={{ transform: `translate3d(0, ${metricY}px, 0)` }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 pt-4 border-t border-[#3c3b3a] transition-transform ease-out will-change-transform"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">POWER RESERVE</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">72 HRS</div>
                <div className="text-[11px] text-[#8d8d89]">Perpetual rotor</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">PRECISION</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">±2 SEC</div>
                <div className="text-[11px] text-[#8d8d89]">After casing</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">FREQUENCY</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">28,800</div>
                <div className="text-[11px] text-[#8d8d89]">Vibrations/hour (4Hz)</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">WARRANTY</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">5 YRS</div>
                <div className="text-[11px] text-[#8d8d89]">Green seal certified</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#3c3b3a] text-xs font-mono text-[#6d6f6f]">
              <span>OSCILLATOR: BLUE PARACHROM HAIRSPRING</span>
              <span className="text-[#d4af37]">SUPERLATIVE CHRONOMETER</span>
            </div>

            {/* Granular Watchmaking Metrics Tooltip */}
            {renderGranularTooltip('card4')}
          </div>
        </div>

        {/* Minimalist Data Matrix / Technical Specifications Table */}
        <div id="specifications" className="space-y-6 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#3c3b3a]">
            <div>
              <div
                style={{ transform: `translate3d(0, ${kickerY}px, 0)` }}
                className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono transition-transform ease-out will-change-transform"
              >
                Technical Matrix
              </div>
              <h3
                style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
                className="text-2xl md:text-3xl font-semibold text-[#d8d8d4] font-display transition-transform ease-out will-change-transform"
              >
                ROLEX SKY-DWELLER SPECIFICATIONS
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('movement')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'movement'
                    ? 'bg-[#3c3b3a] text-[#d8d8d4]'
                    : 'text-[#8d8d89] hover:text-[#d8d8d4]'
                }`}
              >
                Movement
              </button>
              <button
                onClick={() => setActiveTab('case')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'case'
                    ? 'bg-[#3c3b3a] text-[#d8d8d4]'
                    : 'text-[#8d8d89] hover:text-[#d8d8d4]'
                }`}
              >
                Case & Bezel
              </button>
              <button
                onClick={() => setActiveTab('complications')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'complications'
                    ? 'bg-[#3c3b3a] text-[#d8d8d4]'
                    : 'text-[#8d8d89] hover:text-[#d8d8d4]'
                }`}
              >
                Complications
              </button>
            </div>
          </div>

          <div className="hairline-border bg-[#191a19] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#3c3b3a] text-[#6d6f6f] uppercase bg-[#141514]">
                <tr>
                  <th className="py-3.5 px-6">Specification Parameter</th>
                  <th className="py-3.5 px-6">Metric Value</th>
                  <th className="py-3.5 px-6 hidden sm:table-cell">Technical Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2b2a] text-[#8d8d89]">
                {activeTab === 'movement' && (
                  <>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Movement Designation</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Rolex Calibre 9002</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Manufacture perpetual self-winding</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Precision Rating</td>
                      <td className="py-3.5 px-6 text-[#d4af37]">−2/+2 sec/day</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Superlative Chronometer after casing</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Oscillator & Hairspring</td>
                      <td className="py-3.5 px-6 tabular-nums">28,800 vph (4.0 Hz)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Paramagnetic blue Parachrom hairspring</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Autonomous Power Reserve</td>
                      <td className="py-3.5 px-6 tabular-nums">Approximately 72 Hours</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">High-capacity mainspring barrel</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Shock Absorption</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Paraflex shock absorbers</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">High-efficiency balance protection</td>
                    </tr>
                  </>
                )}

                {activeTab === 'case' && (
                  <>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Case Diameter</td>
                      <td className="py-3.5 px-6 tabular-nums">42.0 mm</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Oyster architecture monobloc case</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Material Composition</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">White Rolesor (Oystersteel & 18ct White Gold)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Rolex proprietary metallurgy</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Bezel Architecture</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Fluted, Bidirectional Ring Command</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Direct mechanical link to movement</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Crystal & Lens</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Scratch-resistant Sapphire + Cyclops</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">2.5x date magnification with AR coating</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Water Resistance</td>
                      <td className="py-3.5 px-6 tabular-nums">100 Meters / 330 Feet</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Twinlock screw-down winding crown</td>
                    </tr>
                  </>
                )}

                {activeTab === 'complications' && (
                  <>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Dual Time Zone</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Off-Centre 24-Hour Rotating Disc</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Fixed red reference triangle indicator</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Annual Calendar System</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Saros Instantaneous Mechanism</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Automatically distinguishes 30/31 days</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Month Indication</td>
                      <td className="py-3.5 px-6 text-[#d92534]">12 Discreet Apertures (August Red)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Positioned on outer hour index ring</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Luminescence Display</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Chromalight Long-Lasting Blue Glow</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">High-legibility hour markers & hands</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
