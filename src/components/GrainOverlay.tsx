import React from 'react';

export const GrainOverlay: React.FC = () => {
  return (
    <>
      {/* Subtle Analog Film Grain */}
      <div className="film-grain" aria-hidden="true" />
      
      {/* Cinematic Studio Falloff Vignette */}
      <div className="vignette-overlay" aria-hidden="true" />

      {/* Subtle Ambient Radial Light (simulating Geneva atelier soft studio strobe) */}
      <div 
        className="fixed top-[-20vh] left-[20vw] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-20 blur-[140px] bg-gradient-to-br from-luxury-champagne/10 via-transparent to-transparent -z-10"
        aria-hidden="true"
      />
    </>
  );
};
