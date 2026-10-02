import React, { useEffect, useRef, useState } from 'react';
import type { Watch } from '../types/watch';
import { ArrowDown, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  watch: Watch;
  onExplore: () => void;
  onDiscoverMovement: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  watch,
  onExplore,
  onDiscoverMovement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const watchImgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const techSpecsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Cinematic entrance animation sequence using GSAP
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Initial states
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(watchImgRef.current, {
        scale: 0.88,
        opacity: 0,
        filter: 'brightness(0.3) blur(8px)',
        y: 40,
      });
      gsap.set([headlineRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set([techSpecsRef.current, scrollIndicatorRef.current], {
        opacity: 0,
        y: 20,
      });

      // 2. Timeline execution
      tl.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        delay: 0.2,
      })
      .to(watchImgRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'brightness(1) blur(0px)',
        duration: 2.2,
        ease: 'power2.out',
      }, '-=1.0')
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
      }, '-=1.4')
      .to([techSpecsRef.current, scrollIndicatorRef.current], {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2,
      }, '-=0.8');

    }, containerRef);

    return () => ctx.revert();
  }, [watch.id]);

  // Subtle interactive parallax tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToAnatomy = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full bg-[#050505] flex flex-col justify-between pt-24 sm:pt-32 pb-10 sm:pb-12 px-6 sm:px-12 overflow-hidden selection:bg-luxury-champagne/20"
      style={{ perspective: '1200px' }}
    >
      {/* Background Soft Studio Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] max-w-[90vw] max-h-[90vw] rounded-full bg-gradient-to-b from-[#181816] via-[#0D0D0C] to-transparent opacity-60 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Top Editorial Sub-bar */}
      <div 
        ref={subtitleRef}
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-4 z-20"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase">
            {watch.collection}
          </span>
          <span className="text-luxury-stone/30">/</span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-stone/80 uppercase">
            {watch.specs.reference}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-[10px] tracking-[0.25em] text-luxury-stone/70">
          <span>GENEVA MANUFACTURE</span>
          <span>·</span>
          <span>72H AUTONOMY</span>
          <span>·</span>
          <span>GRADE 5 TITANIUM</span>
        </div>
      </div>

      {/* Main Composition: Editorial Title Behind / Around Real Watch */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center my-6 sm:my-10">
        
        {/* Giant Editorial Typography (Watermark Depth) */}
        <div 
          ref={headlineRef}
          className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0"
        >
          <span 
            className="font-serif text-[clamp(4.5rem,15vw,14rem)] leading-[0.85] font-light tracking-[0.1em] text-white/[0.04] uppercase text-center"
          >
            GENÈVE
          </span>
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.45em] text-luxury-champagne/40 uppercase mt-2 sm:mt-4">
            HAUTE HORLOGERIE SUISSE
          </span>
        </div>

        {/* Real Luxury Watch Photograph (Hero Centerpiece) */}
        <div 
          className="relative z-10 w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[560px] aspect-[4/5] flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: 'preserve-3d',
          }}
          data-cursor="EXAMINE"
          onClick={onExplore}
        >
          {/* Subtle Studio Radial Shadow underneath watch */}
          <div 
            className="absolute bottom-6 w-[70%] h-8 rounded-full bg-black/90 blur-xl pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="relative group w-full h-full flex items-center justify-center">
            {/* Real Watch Image */}
            <img
              ref={watchImgRef}
              src={watch.heroImage}
              alt={`${watch.name} ${watch.subtitle} - Swiss Luxury Watch`}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] transition-all duration-700 group-hover:scale-[1.03] select-none"
              loading="eager"
            />

            {/* Subtle Light Reflection Sweep across sapphire crystal */}
            <div className="light-sweep rounded-full overflow-hidden" aria-hidden="true" />

            {/* Subtle floating interactive ring on hover */}
            <div className="absolute inset-0 rounded-full border border-luxury-champagne/0 group-hover:border-luxury-champagne/20 transition-all duration-700 scale-95 group-hover:scale-100 pointer-events-none" />
          </div>
        </div>

        {/* Minimal Editorial Caption */}
        <div className="relative z-20 text-center mt-3 sm:mt-6 max-w-xl">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-luxury-ivory">
            {watch.name}
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-luxury-stone/90 mt-1">
            {watch.tagline}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={onExplore}
              className="group relative px-6 py-2.5 sm:px-8 sm:py-3 border border-luxury-champagne/40 bg-luxury-champagne/[0.04] hover:bg-luxury-champagne text-luxury-champagne hover:text-[#050505] transition-all duration-300 font-mono text-[11px] tracking-[0.25em] flex items-center gap-3"
              data-cursor="DOSSIER"
            >
              <span>EXPLORE TIMEPIECE</span>
              <span className="w-4 h-[1px] bg-luxury-champagne group-hover:bg-[#050505] transition-colors" />
            </button>

            <button
              onClick={onDiscoverMovement}
              className="px-5 py-2.5 sm:px-6 sm:py-3 text-luxury-stone hover:text-luxury-ivory transition-colors font-mono text-[11px] tracking-[0.2em] flex items-center gap-2 border border-white/[0.06] hover:border-white/[0.15]"
              data-cursor="CALIBRE"
            >
              <Sparkles className="w-3 h-3 text-luxury-champagne/70" />
              <span>CALIBRE 900</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Technical Grid & Scroll Indicator */}
      <div 
        ref={techSpecsRef}
        className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-6 border-t border-white/[0.05] z-20"
      >
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60 block">DIAMETER</span>
          <span className="font-serif text-lg sm:text-xl text-luxury-bone mt-0.5 block">{watch.specs.diameter}</span>
        </div>
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60 block">MATERIAL</span>
          <span className="font-serif text-lg sm:text-xl text-luxury-bone mt-0.5 block truncate">{watch.specs.caseMaterial.split(' ')[0]} {watch.specs.caseMaterial.split(' ')[1] || ''}</span>
        </div>
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60 block">MOVEMENT</span>
          <span className="font-serif text-lg sm:text-xl text-luxury-bone mt-0.5 block truncate">Calibre 900</span>
        </div>
        <div className="flex items-center justify-end">
          <div 
            ref={scrollIndicatorRef}
            onClick={scrollToAnatomy}
            className="flex items-center gap-3 cursor-pointer group"
            data-cursor="SCROLL"
          >
            <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/80 group-hover:text-luxury-champagne transition-colors">
              DISCOVER ANATOMY
            </span>
            <div className="w-7 h-7 rounded-full border border-white/[0.1] group-hover:border-luxury-champagne/40 flex items-center justify-center transition-colors">
              <ArrowDown className="w-3.5 h-3.5 text-luxury-champagne group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
