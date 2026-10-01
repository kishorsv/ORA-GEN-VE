import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

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
  const [isHoveringBar, setIsHoveringBar] = useState(false);
  const [hoverPct, setHoverPct] = useState(0);

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onScrubClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onScrubClick(ratio);
  };

  const handleBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverPct(Math.round(ratio * 100));
  };

  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const progressPercent = (clampedProgress * 100).toFixed(1);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#171817]/95 backdrop-blur-none border-b border-[#3c3b3a] transition-colors">
      {/* Slim Horizontal Progress Bar Tracking 240-Frame Canvas Sequence */}
      <div
        onClick={handleBarClick}
        onMouseMove={handleBarMouseMove}
        onMouseEnter={() => setIsHoveringBar(true)}
        onMouseLeave={() => setIsHoveringBar(false)}
        className="group relative w-full h-[2.5px] bg-[#222322] cursor-pointer select-none overflow-visible"
        title="240-Frame Canvas Sequence Progress"
      >
        {/* Discrete Milestone Ticks */}
        <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-[#3c3b3a] z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-[#3c3b3a] z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-[#3c3b3a] z-10 pointer-events-none" />

        {/* Active Horological Amber Progress Fill */}
        <div
          className="h-full bg-[#d4af37] transition-[width] duration-75 ease-out relative"
          style={{ width: `${clampedProgress * 100}%` }}
        >
          {/* Subtle Leading Glow Pip */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#f3d978] shadow-[0_0_6px_#d4af37] ring-1 ring-[#d4af37]" />
        </div>

        {/* Hover Frame Tooltip */}
        {isHoveringBar && (
          <div
            className="absolute top-2 -translate-x-1/2 px-2 py-0.5 bg-[#141514] border border-[#3c3b3a] text-[10px] font-mono text-[#d8d8d4] pointer-events-none whitespace-nowrap shadow-none"
            style={{ left: `${hoverPct}%` }}
          >
            FRAME {Math.floor((hoverPct / 100) * 239).toString().padStart(3, '0')} · {hoverPct}%
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with micro frame tracker */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-lg md:text-xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display hover:text-white transition-colors"
          >
            ORA GENÈVE
          </a>

          {/* Micro Frame Telemetry Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 border border-[#3c3b3a] text-[10px] font-mono text-[#6d6f6f] tabular-nums select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>F{currentFrame.toString().padStart(3, '0')}</span>
            <span>·</span>
            <span>{progressPercent}%</span>
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
