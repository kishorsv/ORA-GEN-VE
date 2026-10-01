import React from 'react';

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
      className={`fixed inset-0 z-50 bg-[#171817] flex flex-col justify-between p-8 md:p-14 transition-opacity duration-700 pointer-events-auto ${
        isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs tracking-wider text-[#6d6f6f] uppercase font-mono">
        <div>Atelier ORA · Geneva</div>
        <div>Scrolltide Framework · Calibre 900</div>
      </div>

      {/* Center Title and Status */}
      <div className="max-w-xl mx-auto w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display">
            ORA GENÈVE
          </h1>
          <p className="text-xs md:text-sm text-[#8d8d89] tracking-widest uppercase">
            Haute Horlogerie · Canvas Sequence Engine
          </p>
        </div>

        {/* Real Progress Bar */}
        <div className="space-y-2 pt-4">
          <div className="w-full h-1 bg-[#222322] border border-[#3c3b3a] overflow-hidden">
            <div
              className="h-full bg-[#d4af37] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-[#6d6f6f] tabular-nums">
            <span>DECODING BITMAP FRAMES</span>
            <span>[{loadedFrames.toString().padStart(3, '0')} / {totalFrames}] · {Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Status */}
      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-[#585a5a] font-mono gap-2 border-t border-[#3c3b3a] pt-4">
        <div>NATIVE CANVAS SCRUB ENGINE · ZERO DEPENDENCIES</div>
        <div className="tabular-nums">BUFFER: {(loadedFrames * 0.42).toFixed(1)} MB / 100.8 MB ALLOCATED</div>
      </div>
    </div>
  );
};
