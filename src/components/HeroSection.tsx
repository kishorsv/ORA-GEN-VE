import React, { useEffect, useRef } from 'react';
import type { WatchModel, DbSiteSettings } from '../types/database';
import { WatchVisual } from './WatchVisual';
import { ArrowDown, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  watch: WatchModel | null;
  siteSettings: DbSiteSettings;
  onExplore: () => void;
  onDiscoverMovement: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  watch,
  siteSettings,
  onExplore,
  onDiscoverMovement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ambientLightRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const watchHolderRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const techDetailsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([ambientLightRef.current, logoRef.current, watchHolderRef.current, typographyRef.current, techDetailsRef.current, scrollIndicatorRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // Precise cinematic sequence:
      // 1. Black Screen -> 2. Ambient light -> 3. Logo appears -> 4. Watch reveals -> 5. Typography reveals -> 6. Tech details -> 7. Scroll indicator
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial setup
      gsap.set(ambientLightRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(logoRef.current, { opacity: 0, y: -20 });
      gsap.set(watchHolderRef.current, { opacity: 0, scale: 0.9, y: 30, filter: 'blur(8px) brightness(0.4)' });
      gsap.set(typographyRef.current, { opacity: 0, y: 30 });
      gsap.set(techDetailsRef.current, { opacity: 0, y: 20 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      tl.to(ambientLightRef.current, {
        opacity: 0.7,
        scale: 1,
        duration: 1.6,
      })
      .to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
      }, '-=1.0')
      .to(watchHolderRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px) brightness(1)',
        duration: 2.2,
        ease: 'power2.out',
      }, '-=0.8')
      .to(typographyRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
      }, '-=1.2')
      .to(techDetailsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0,
      }, '-=0.8')
      .to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 0.8,
      }, '-=0.4');

    }, containerRef);

    return () => ctx.revert();
  }, [watch?.id]);

  const scrollToAnatomy = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!watch) return null;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#030303] flex flex-col justify-between pt-28 sm:pt-36 pb-10 sm:pb-12 px-6 sm:px-12 overflow-hidden selection:bg-luxury-champagne/20"
    >
      {/* 2. Ambient Studio Light */}
      <div
        ref={ambientLightRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] max-w-[95vw] max-h-[95vw] rounded-full bg-gradient-to-b from-[#181816] via-[#0C0C0B] to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 3. Top Identity Bar / Logo */}
      <div
        ref={logoRef}
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-4 z-20"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase">
            {watch.collection}
          </span>
          <span className="text-white/20">/</span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-stone/80 uppercase">
            {watch.specs?.reference || 'GENEVA'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-[10px] tracking-[0.25em] text-luxury-stone/70">
          <span>GENEVA MANUFACTURE</span>
          <span>·</span>
          <span>{watch.specs?.power_reserve || '72H AUTONOMY'}</span>
          <span>·</span>
          <span className="text-luxury-champagne">{watch.availability}</span>
        </div>
      </div>

      {/* Main Composition: Real Watch Centerpiece & Editorial Typography */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center my-6 sm:my-10">
        
        {/* Background Watermark Depth */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0">
          <span className="font-serif text-[clamp(4.5rem,16vw,15rem)] leading-[0.85] font-light tracking-[0.1em] text-white/[0.035] uppercase text-center">
            {siteSettings.hero_title.replace('ORA ', '') || 'GENÈVE'}
          </span>
          <span className="font-mono text-[9px] sm:text-xs tracking-[0.45em] text-luxury-champagne/40 uppercase mt-3">
            {siteSettings.hero_subtitle}
          </span>
        </div>

        {/* 4. Real Watch Photography Centerpiece */}
        <div
          ref={watchHolderRef}
          className="relative z-10 w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[560px] aspect-[4/5] flex items-center justify-center"
        >
          <WatchVisual
            image={watch.hero_image}
            alt={`${watch.name} - ${watch.subtitle}`}
            depth={1.2}
            intensity={1.1}
            enableTilt={true}
            lightSweep={true}
            onClick={onExplore}
            dataCursor="EXAMINE"
            priority={true}
            className="w-full h-full"
          />
        </div>

        {/* 5. Minimal Editorial Typography */}
        <div ref={typographyRef} className="relative z-20 text-center mt-3 sm:mt-6 max-w-xl">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide text-luxury-ivory">
            {watch.name}
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-luxury-stone/90 mt-1">
            {watch.tagline || siteSettings.hero_tagline}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={onExplore}
              className="group relative px-6 py-2.5 sm:px-8 sm:py-3 border border-luxury-champagne/40 bg-luxury-champagne/[0.04] hover:bg-luxury-champagne text-luxury-champagne hover:text-[#030303] transition-all duration-300 font-mono text-[11px] tracking-[0.25em] flex items-center gap-3"
              data-cursor="DOSSIER"
            >
              <span>EXPLORE TIMEPIECE</span>
              <span className="w-4 h-[1px] bg-luxury-champagne group-hover:bg-[#030303] transition-colors" />
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

      {/* 6. Technical Details & 7. Scroll Indicator */}
      <div
        ref={techDetailsRef}
        className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-6 border-t border-white/[0.05] z-20"
      >
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60 block">DIAMETER</span>
          <span className="font-serif text-lg sm:text-xl text-luxury-bone mt-0.5 block">{watch.specs?.diameter || '41.5 mm'}</span>
        </div>
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60 block">METALLURGY</span>
          <span className="font-serif text-lg sm:text-xl text-luxury-bone mt-0.5 block truncate">
            {watch.specs?.case_material ? watch.specs.case_material.split(' ')[0] + ' ' + (watch.specs.case_material.split(' ')[1] || '') : 'Titanium'}
          </span>
        </div>
        <div>
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/60 block">MANUFACTURE</span>
          <span className="font-serif text-lg sm:text-xl text-luxury-bone mt-0.5 block truncate">
            {watch.specs?.movement ? watch.specs.movement.split(' ')[1] || 'Calibre 900' : 'Calibre 900'}
          </span>
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
