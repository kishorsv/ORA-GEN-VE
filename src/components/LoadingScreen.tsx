import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center p-6 select-none">
      <div className="text-center space-y-4">
        <div>
          <span className="font-serif text-3xl sm:text-4xl tracking-[0.3em] text-luxury-ivory font-light block">
            ORA
          </span>
          <span className="font-mono text-[9px] tracking-[0.45em] text-luxury-champagne block mt-1">
            GENÈVE
          </span>
        </div>

        {/* Thin Luxury Progress Line */}
        <div className="w-40 sm:w-56 h-[1.5px] bg-white/[0.08] relative overflow-hidden mx-auto mt-6">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-luxury-champagne animate-[lightSweep_1.4s_infinite_ease-in-out]" />
        </div>

        <span className="font-mono text-[8px] tracking-[0.3em] text-luxury-stone/50 block pt-2">
          SYNCHRONIZING ATELIER DATABASE
        </span>
      </div>
    </div>
  );
};
