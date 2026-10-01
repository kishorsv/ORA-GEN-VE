import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface WatchMilestone {
  frame: number;
  progress: number;
  label: string;
  tag: string;
  description: string;
}

const TECHNICAL_MILESTONES: WatchMilestone[] = [
  {
    frame: 0,
    progress: 0.0,
    label: 'Frontal Silhouette',
    tag: 'DIAL',
    description: 'Concentric Geneva dial geometry and satin-brushed titanium bezel',
  },
  {
    frame: 36,
    progress: 0.15,
    label: 'Bezel Anglage & Glint',
    tag: 'METALLURGY',
    description: 'Hand-polished mirror chamfers reflecting directional light',
  },
  {
    frame: 72,
    progress: 0.30,
    label: '8.2mm Ultra-Thin Profile',
    tag: 'ARCHITECTURE',
    description: 'Sculptural Grade 5 titanium case and knurled crown assembly',
  },
  {
    frame: 112,
    progress: 0.47,
    label: '22K Gold Micro-Rotor',
    tag: 'KINEMATICS',
    description: 'Decentralized high-density mass charging 70h autonomous reserve',
  },
  {
    frame: 148,
    progress: 0.62,
    label: 'Hand-Cut Guilloché',
    tag: "MÉTIERS D'ART",
    description: '1924 manual rose-engine Clous de Paris hobnail matrix',
  },
  {
    frame: 184,
    progress: 0.77,
    label: '28,800 vph Escapement',
    tag: 'CHRONOMETRY',
    description: '4Hz Swiss lever escapement with anti-magnetic silicon hairspring',
  },
  {
    frame: 216,
    progress: 0.90,
    label: 'Geneva Seal Standards',
    tag: 'FINISHING',
    description: 'Black-polished steel and hand-beveled gentian wood anglage',
  },
  {
    frame: 239,
    progress: 1.0,
    label: 'Series 01 Allocation',
    tag: 'ACQUISITION',
    description: 'Numbered annual allocation of 100 bespoke manufactured pieces',
  },
];

interface NavigationProps {
  onOpenAcquisition: () => void;
  onOpenInspector: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  scrollProgress: number; // 0.0 to 1.0 across 240 frames
  currentFrame: number; // 0 to 239
  onScrubClick?: (progress: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenAcquisition,
  onOpenInspector,
  isAudioActive,
  onToggleAudio,
  scrollProgress,
  currentFrame,
  onScrubClick,
}) => {
  const [activeTooltipMilestone, setActiveTooltipMilestone] = useState<WatchMilestone | null>(null);
  const [hoverPositionPct, setHoverPositionPct] = useState<number | null>(null);

  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const progressPercent = (clampedProgress * 100).toFixed(1);

  // Identify currently reached milestone
  const currentMilestone = [...TECHNICAL_MILESTONES]
    .reverse()
    .find((m) => clampedProgress >= m.progress) || TECHNICAL_MILESTONES[0];

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onScrubClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onScrubClick(ratio);
  };

  const handleMilestoneClick = (e: React.MouseEvent, targetProg: number) => {
    e.stopPropagation();
    onScrubClick?.(targetProg);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#171817]/95 backdrop-blur-none border-b border-[#3c3b3a] transition-colors">
      {/* Slim Horizontal Progress Bar with Subtle Milestone Tick Marks */}
      <div
        onClick={handleBarClick}
        className="group relative w-full h-[3px] bg-[#222322] cursor-pointer select-none overflow-visible"
        title="Click anywhere to scrub across the 240-frame sequence"
      >
        {/* Active Horological Amber Progress Fill */}
        <div
          className="h-full bg-[#d4af37] transition-[width] duration-75 ease-out relative"
          style={{ width: `${clampedProgress * 100}%` }}
        >
          {/* Subtle Leading Glow Pip */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#f3d978] shadow-[0_0_8px_#d4af37] ring-1 ring-[#d4af37]" />
        </div>

        {/* Milestone Tick Marks Across the Progress Bar */}
        {TECHNICAL_MILESTONES.map((milestone) => {
          const isReached = clampedProgress >= milestone.progress;
          const isCurrent = currentMilestone.frame === milestone.frame;
          const leftPercent = milestone.progress * 100;

          return (
            <div
              key={milestone.frame}
              onClick={(e) => handleMilestoneClick(e, milestone.progress)}
              onMouseEnter={() => {
                setActiveTooltipMilestone(milestone);
                setHoverPositionPct(leftPercent);
              }}
              onMouseLeave={() => {
                setActiveTooltipMilestone(null);
                setHoverPositionPct(null);
              }}
              className="absolute top-0 -translate-x-1/2 w-3.5 h-4 flex flex-col items-center justify-start cursor-pointer group/tick z-20"
              style={{ left: `${leftPercent}%` }}
            >
              {/* Vertical Tick Line */}
              <div
                className={`w-[1px] transition-all duration-300 ${
                  isCurrent
                    ? 'h-3.5 bg-[#d4af37] shadow-[0_0_4px_#d4af37]'
                    : isReached
                    ? 'h-2.5 bg-[#d4af37]/80 group-hover/tick:bg-[#d4af37]'
                    : 'h-2 bg-[#424442] group-hover/tick:bg-[#8d8d89]'
                }`}
              />

              {/* Micro-pip at base of tick */}
              <div
                className={`w-1 h-1 rounded-full transition-all duration-300 -mt-0.5 ${
                  isCurrent
                    ? 'bg-[#d4af37] scale-125'
                    : isReached
                    ? 'bg-[#d4af37]/70'
                    : 'bg-[#3c3b3a] group-hover/tick:bg-[#8d8d89]'
                }`}
              />
            </div>
          );
        })}

        {/* Floating Milestone Telemetry Card Tooltip */}
        {activeTooltipMilestone && hoverPositionPct !== null && (
          <div
            className="absolute top-3.5 -translate-x-1/2 p-3 bg-[#141514] border border-[#3c3b3a] text-left pointer-events-none z-30 shadow-none min-w-[210px] max-w-[260px] animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${Math.max(12, Math.min(88, hoverPositionPct))}%`,
            }}
          >
            <div className="flex items-center justify-between text-[9px] font-mono text-[#6d6f6f] mb-1">
              <span className="text-[#d4af37] uppercase tracking-wider">
                {activeTooltipMilestone.tag}
              </span>
              <span>F{activeTooltipMilestone.frame.toString().padStart(3, '0')} · {Math.round(activeTooltipMilestone.progress * 100)}%</span>
            </div>
            <div className="text-xs font-semibold text-[#d8d8d4] font-display tracking-tight leading-tight">
              {activeTooltipMilestone.label}
            </div>
            <p className="text-[10px] text-[#8d8d89] leading-tight mt-1">
              {activeTooltipMilestone.description}
            </p>
            <div className="text-[9px] font-mono text-[#585a5a] mt-2 pt-1 border-t border-[#252625] flex justify-between">
              <span>CLICK TO SCRUB FRAME</span>
              <span className="text-[#d4af37]">→</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark + Active Technical Milestone Readout */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-lg md:text-xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display hover:text-white transition-colors"
          >
            ORA GENÈVE
          </a>

          {/* Active Milestone Feature Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 border border-[#3c3b3a] bg-[#141514] text-[10px] font-mono text-[#8d8d89] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
            <span className="text-[#d4af37] uppercase font-semibold">
              {currentMilestone.tag}:
            </span>
            <span className="text-[#d8d8d4] truncate max-w-[160px]">
              {currentMilestone.label}
            </span>
            <span className="text-[#585a5a]">·</span>
            <span className="text-[#6d6f6f] tabular-nums">
              F{currentFrame.toString().padStart(3, '0')}
            </span>
          </div>
        </div>

        {/* Zone 2: 4 text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#8d8d89]">
          <a
            href="#calibre"
            className="hover:text-[#d8d8d4] transition-colors"
          >
            Calibre 900
          </a>
          <a
            href="#guilloche"
            className="hover:text-[#d8d8d4] transition-colors"
          >
            Guilloché
          </a>
          <a
            href="#specifications"
            className="hover:text-[#d8d8d4] transition-colors"
          >
            Specifications
          </a>
          <button
            onClick={onOpenInspector}
            className="hover:text-[#d8d8d4] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
          >
            <span>Inspector</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleAudio}
            className="p-2 text-[#8d8d89] hover:text-[#d8d8d4] transition-colors cursor-pointer border border-transparent hover:border-[#3c3b3a]"
            title={isAudioActive ? 'Mute 28,800 vph Escapement Tick' : 'Listen to 28,800 vph Escapement Tick'}
            aria-label="Toggle Escapement Audio"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenAcquisition}
            className="px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] transition-colors cursor-pointer whitespace-nowrap"
          >
            Acquire
          </button>
        </div>
      </div>
    </header>
  );
};
