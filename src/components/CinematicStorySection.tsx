import React, { useEffect, useRef, useState } from 'react';
import type { WatchModel } from '../types/database';
import { WatchVisual } from './WatchVisual';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicStorySectionProps {
  watch: WatchModel | null;
  onExploreWatch: () => void;
}

export const CinematicStorySection: React.FC<CinematicStorySectionProps> = ({
  watch,
  onExploreWatch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const watchHolderRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!watch) return null;

  const steps = [
    {
      num: '01',
      title: 'THE DIAL',
      subtitle: 'Guilloché & Hand-Finished Indexes',
      body: 'Diamond-machined hour markers micro-welded to a vertically brushed ruthenium dial plate, capturing light with microscopic precision.',
      image: watch.images?.find((i) => i.image_type === 'front')?.image_url || watch.hero_image,
      tech: 'ANTI-REFLECTIVE SAPPHIRE · GRADE X1 LUMINOVA · 0.2MM INDICES',
    },
    {
      num: '02',
      title: 'THE CASE',
      subtitle: 'Aeronautical Metallurgy & Mirror Anglage',
      body: 'Forged under 400 tons of pressure, each contour is individually hand-polished with diamond paste to create razor-sharp transitions between brushed and specular surfaces.',
      image: watch.images?.find((i) => i.image_type === 'side')?.image_url || watch.hero_image,
      tech: `${watch.specs?.case_material?.toUpperCase() || 'GRADE 5 TITANIUM'} · 100M WATERPROOFNESS`,
    },
    {
      num: '03',
      title: 'THE MOVEMENT',
      subtitle: 'Calibre 900 Micro-Rotor Architecture',
      body: 'At just 3.8mm thick, the micro-rotor movement integrates a 22K solid gold oscillating mass, ensuring an unimpeded view of the hand-chamfered bridge architecture.',
      image: watch.movement_image,
      tech: `${watch.specs?.frequency || '28,800 VPH'} · ${watch.specs?.power_reserve || '72-HOUR AUTONOMOUS TORQUE'}`,
    },
    {
      num: '04',
      title: 'THE CRAFT',
      subtitle: 'The Métiers d’Art of Geneva',
      body: 'Every single bevelled edge is finished using gentian wood pegs and diamond compound by our master watchmakers. Over 180 hours of manual craftsmanship in every calibre.',
      image: watch.images?.find((i) => i.image_type === 'lifestyle')?.image_url || watch.images?.find((i) => i.image_type === 'dial')?.image_url || watch.hero_image,
      tech: 'HAND-DRAWN CÔTES DE GENÈVE · BLACK POLISHED SCREWS · ANGLAGE',
    },
    {
      num: '05',
      title: 'THE CALIBRE',
      subtitle: 'Chronometric Perfection',
      body: 'Certified chronometric precision of −2/+2 seconds per day. Regulated across six positions, surpassing the highest Swiss chronometer standards.',
      image: watch.images?.find((i) => i.image_type === 'back')?.image_url || watch.hero_image,
      tech: 'POINÇON DE GENÈVE SPECIFICATION · TWIN BARREL · FREESPRUNG',
    },
  ];

  useEffect(() => {
    const el = containerRef.current;
    const watchHolder = watchHolderRef.current;
    if (!el || !watchHolder) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 5-phase continuous scroll kinematics:
      // CENTER -> RIGHT -> CENTER -> LEFT -> FULLSCREEN FOCUS
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const step = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            setActiveStepIndex(step);
          },
        },
      });

      tl.to(watchHolder, {
        xPercent: 28,
        scale: 1.08,
        rotate: 3,
        duration: 1,
        ease: 'power1.inOut',
      })
      .to(watchHolder, {
        xPercent: 0,
        scale: 1.15,
        rotate: -2,
        duration: 1,
        ease: 'power1.inOut',
      })
      .to(watchHolder, {
        xPercent: -28,
        scale: 1.12,
        rotate: 3,
        duration: 1,
        ease: 'power1.inOut',
      })
      .to(watchHolder, {
        xPercent: 0,
        scale: 1.35,
        rotate: 0,
        duration: 1,
        ease: 'power1.inOut',
      });

    }, el);

    return () => ctx.revert();
  }, [watch.id]);

  const currentStep = steps[activeStepIndex];

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative w-full h-screen bg-[#070707] text-[#F4F1EA] flex items-center justify-center overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(18,18,18,0.85)_0%,_rgba(4,4,4,1)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Chapter Marker Header */}
      <div className="absolute top-10 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between border-b border-white/[0.08] pb-4 z-30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne">
            TIMEPIECE ANATOMY
          </span>
          <span className="text-white/20">/</span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-stone">
            {watch.name}
          </span>
        </div>

        {/* Dynamic Chapter Progress Tracker */}
        <div className="flex items-center gap-2 sm:gap-3">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className={`h-[2px] transition-all duration-500 ${
                idx === activeStepIndex
                  ? 'w-8 sm:w-12 bg-luxury-champagne'
                  : idx < activeStepIndex
                  ? 'w-4 sm:w-6 bg-white/40'
                  : 'w-4 sm:w-6 bg-white/10'
              }`}
            />
          ))}
          <span className="font-mono text-[11px] tracking-widest text-luxury-champagne ml-2">
            {currentStep.num} / 05
          </span>
        </div>
      </div>

      {/* Main Staged Stage */}
      <div className="relative w-full max-w-7xl h-full flex items-center justify-between px-6 sm:px-12 z-20 pointer-events-none">
        
        {/* Editorial Text Block */}
        <div
          className={`w-full max-w-md sm:max-w-lg transition-all duration-700 pointer-events-auto ${
            activeStepIndex === 1
              ? 'mr-auto text-left'
              : activeStepIndex === 3
              ? 'ml-auto text-right'
              : activeStepIndex === 4
              ? 'mx-auto text-center backdrop-blur-md bg-black/40 p-8 border border-white/[0.06] rounded-sm'
              : 'mr-auto text-left'
          }`}
        >
          <div className="inline-block px-2.5 py-1 mb-4 border border-luxury-champagne/30 bg-luxury-champagne/[0.05]">
            <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne">
              CHAPTER {currentStep.num}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-luxury-ivory leading-tight">
            {currentStep.title}
          </h2>

          <p className="font-serif italic text-lg sm:text-xl text-luxury-champagne/90 mt-2">
            {currentStep.subtitle}
          </p>

          <p className="text-luxury-stone text-sm sm:text-base leading-relaxed mt-4 font-sans font-light">
            {currentStep.body}
          </p>

          <div className="mt-6 pt-4 border-t border-white/[0.08]">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-luxury-stone/70 uppercase block">
              {currentStep.tech}
            </span>
          </div>

          {activeStepIndex === 4 && (
            <div className="mt-8">
              <button
                onClick={onExploreWatch}
                className="px-6 py-2.5 bg-luxury-champagne text-black font-mono text-[11px] tracking-[0.25em] hover:bg-white transition-colors"
                data-cursor="INSPECT"
              >
                OPEN TECHNICAL DOSSIER
              </button>
            </div>
          )}
        </div>

        {/* Central Moving Watch Photo Container with WatchVisual */}
        <div
          ref={watchHolderRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="relative w-[340px] sm:w-[480px] lg:w-[580px] aspect-[4/5] flex items-center justify-center">
            <WatchVisual
              image={currentStep.image}
              alt={`${watch.name} - ${currentStep.title}`}
              depth={1.4}
              intensity={1.0}
              lightSweep={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Technical Status Bar */}
      <div className="absolute bottom-8 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between text-luxury-stone/60 font-mono text-[9px] tracking-[0.25em] border-t border-white/[0.06] pt-4 z-30">
        <span>SWISS PRECISION KINEMATICS</span>
        <span className="hidden sm:inline">SCROLL TO ADVANCE CONTINUOUS ANATOMY</span>
        <span>ATELIER ORA GENÈVE</span>
      </div>
    </section>
  );
};
