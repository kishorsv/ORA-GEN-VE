import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavigationProps {
  onOpenAcquisition: () => void;
  onOpenInspector: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenAcquisition,
  onOpenInspector,
  isAudioActive,
  onToggleAudio,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#171817]/95 backdrop-blur-none border-b border-[#3c3b3a] transition-colors">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg md:text-xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display hover:text-white transition-colors"
        >
          ORA GENÈVE
        </a>

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
