import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PreloaderProps {
  progress: number; // 0 to 100
  loadedFrames: number;
  totalFrames: number;
  isReady: boolean;
  onEnter: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  progress,
  loadedFrames,
  totalFrames,
  isReady,
  onEnter,
}) => {
  return (
    <div
      onClick={onEnter}
      className={`fixed inset-0 z-50 bg-[#171817] flex flex-col justify-between p-8 md:p-14 transition-opacity duration-500 ${
        isReady ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs tracking-wider text-[#6d6f6f] uppercase font-mono">
        <div>Rolex Sky-Dweller · Geneva</div>
        <div>Scrolltide Framework · Reference 336934</div>
      </div>

      {/* Center Title and Status */}
      <div className="max-w-xl mx-auto w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
            Oyster Perpetual
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display">
            SKY-DWELLER
          </h1>
          <p className="text-xs md:text-sm text-[#8d8d89] tracking-widest uppercase">
            Mint Green Dial · 240-Frame Scrub Sequence
          </p>
        </div>

        {/* Real Progress Bar */}
        <div className="space-y-2 pt-4">
          <div className="w-full h-1 bg-[#222322] border border-[#3c3b3a] overflow-hidden">
            <div
              className="h-full bg-[#d4af37] transition-all duration-75 ease-out"
              style={{ width: `${Math.max(15, progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-[#6d6f6f] tabular-nums">
            <span>SYNCHRONIZING CANVAS ENGINE</span>
            <span>[{Math.max(1, loadedFrames).toString().padStart(3, '0')} / {totalFrames}] · {Math.round(Math.max(15, progress))}%</span>
          </div>
        </div>

        {/* Enter Atelier Fast Action */}
        <div className="pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnter();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#222322] hover:bg-[#d4af37] text-[#d8d8d4] hover:text-[#171817] border border-[#3c3b3a] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Enter Timepiece Experience</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Technical Status */}
      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-[#585a5a] font-mono gap-2 border-t border-[#3c3b3a] pt-4">
        <div>NATIVE CANVAS SCRUB ENGINE · ZERO DEPENDENCIES</div>
        <div className="tabular-nums">CALIBRE 9002 PERPETUAL CHRONOMETER</div>
      </div>
    </div>
  );
};
