import React, { useEffect, useRef, useState } from 'react';
import { FrameSequenceManager } from '../utils/canvasRenderer';
import { ArrowDown, ChevronDown } from 'lucide-react';

interface ScrollScrubberProps {
  frameManager: FrameSequenceManager;
  onOpenAcquisition: () => void;
  onProgressChange?: (progress: number, frameIndex: number) => void;
}

interface ChapterMark {
  id: string;
  label: string;
  frameStart: number;
  frameEnd: number;
  progress: number;
}

const CHAPTERS: ChapterMark[] = [
  { id: 'ch1', label: '01 · SILHOUETTE', frameStart: 0, frameEnd: 59, progress: 0.08 },
  { id: 'ch2', label: '02 · PROFILE 8.2MM', frameStart: 60, frameEnd: 119, progress: 0.33 },
  { id: 'ch3', label: '03 · GUILLOCHÉ', frameStart: 120, frameEnd: 179, progress: 0.61 },
  { id: 'ch4', label: '04 · ACQUIRE', frameStart: 180, frameEnd: 239, progress: 0.88 },
];

export const ScrollScrubber: React.FC<ScrollScrubberProps> = ({
  frameManager,
  onOpenAcquisition,
  onProgressChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isScrubbingDirectly, setIsScrubbingDirectly] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Programmatic smooth scroll to chapter progress
  const scrollToProgress = (targetProg: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScrollY = containerTop + targetProg * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  // Native Canvas Scroll Engine (requestAnimationFrame)
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI while preventing iOS Safari >288MB memory limit
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Cap internal canvas buffer
      const targetWidth = Math.min(Math.round(width * dpr), 1920);
      const targetHeight = Math.min(Math.round(height * dpr), 1080);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        lastDrawnFrameRef.current = -1;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Scroll Scrubbing Loop
    let targetProgress = 0;
    let smoothedProgress = 0;

    const render = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;

        if (totalScrollable > 0) {
          const rawProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
          targetProgress = rawProgress;
        }

        // Slight lerp for cinematic fluidity (damping)
        smoothedProgress += (targetProgress - smoothedProgress) * 0.18;
        if (Math.abs(targetProgress - smoothedProgress) < 0.0001) {
          smoothedProgress = targetProgress;
        }

        const totalFrames = frameManager.getFrameCount();
        if (totalFrames > 0) {
          const frameIndex = Math.min(
            totalFrames - 1,
            Math.max(0, Math.floor(smoothedProgress * totalFrames))
          );

          if (frameIndex !== lastDrawnFrameRef.current) {
            const frameBitmap = frameManager.getFrame(frameIndex);
            if (frameBitmap) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // Maintain aspect ratio cover / contain
              const cw = canvas.width;
              const ch = canvas.height;
              const fw = frameBitmap.width;
              const fh = frameBitmap.height;

              const scale = Math.max(cw / fw, ch / fh);
              const drawW = fw * scale;
              const drawH = fh * scale;
              const dx = (cw - drawW) / 2;
              const dy = (ch - drawH) / 2;

              ctx.drawImage(frameBitmap, dx, dy, drawW, drawH);
              lastDrawnFrameRef.current = frameIndex;
              setCurrentFrameIndex(frameIndex);
              setCurrentProgress(smoothedProgress);
              onProgressChange?.(smoothedProgress, frameIndex);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      // Explicit iOS Safari memory release
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [frameManager, prefersReducedMotion]);

  // Handle direct click/drag on frame scrubber ruler
  const handleScrubberInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const ruler = e.currentTarget;
    const rect = ruler.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    scrollToProgress(ratio);
  };

  // Reduced motion accessible fallback view
  if (prefersReducedMotion) {
    return (
      <div className="pt-24 px-6 max-w-5xl mx-auto space-y-24 py-16">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display">
            ENGINEERED IN GENEVA
          </h1>
          <p className="text-[#8d8d89] max-w-xl mx-auto text-sm leading-relaxed">
            The definitive architectural timepiece. Featuring the Calibre 900 micro-rotor mechanism, hand-turned guilloché, and Grade 5 titanium monocoque.
          </p>
        </section>

        <section className="hairline-border p-8 bg-[#171817] space-y-4">
          <div className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">Chapter 01 · Kinematics</div>
          <h2 className="text-2xl font-semibold text-[#d8d8d4]">The Calibre 900 Micro-Rotor</h2>
          <p className="text-sm text-[#8d8d89] leading-relaxed">
            Decentralized 22K gold oscillating mass maintaining an ultra-thin 8.2mm profile while delivering 70 hours of chronometric autonomy at 28,800 vibrations per hour.
          </p>
        </section>

        <section className="hairline-border p-8 bg-[#171817] space-y-4">
          <div className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">Chapter 02 · Métiers d'Art</div>
          <h2 className="text-2xl font-semibold text-[#d8d8d4]">Hand-Turned Guilloché</h2>
          <p className="text-sm text-[#8d8d89] leading-relaxed">
            Geometric Clous de Paris pattern cut directly onto sterling silver using historical rose engine lathes dating to 1924.
          </p>
        </section>

        <div className="text-center pt-8">
          <button
            onClick={onOpenAcquisition}
            className="px-8 py-3.5 text-xs font-semibold tracking-widest uppercase bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] transition-colors"
          >
            Acquire Timepiece · $18,400 USD
          </button>
        </div>
      </div>
    );
  }

  // Chapter Opacity Calculations based on currentProgress (0.0 -> 1.0)
  const ch1Opacity = Math.max(0, Math.min(1, 1 - currentProgress / 0.15));
  const ch1TranslateY = (currentProgress / 0.15) * -30;

  let ch2Opacity = 0;
  if (currentProgress >= 0.20 && currentProgress <= 0.46) {
    if (currentProgress < 0.28) {
      ch2Opacity = (currentProgress - 0.20) / 0.08;
    } else if (currentProgress > 0.38) {
      ch2Opacity = 1 - (currentProgress - 0.38) / 0.08;
    } else {
      ch2Opacity = 1;
    }
  }

  let ch3Opacity = 0;
  if (currentProgress >= 0.48 && currentProgress <= 0.74) {
    if (currentProgress < 0.55) {
      ch3Opacity = (currentProgress - 0.48) / 0.07;
    } else if (currentProgress > 0.67) {
      ch3Opacity = 1 - (currentProgress - 0.67) / 0.07;
    } else {
      ch3Opacity = 1;
    }
  }

  let ch4Opacity = 0;
  if (currentProgress >= 0.76) {
    ch4Opacity = Math.min(1, (currentProgress - 0.76) / 0.12);
  }

  // Determine current active chapter index
  const activeChapterIndex = currentProgress < 0.2
    ? 0
    : currentProgress < 0.46
    ? 1
    : currentProgress < 0.75
    ? 2
    : 3;

  return (
    <div ref={containerRef} className="relative w-full h-[750vh]">
      {/* Sticky Canvas Viewport (100vh) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#171817] flex items-center justify-center">
        {/* Native Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Cinematic Vignette / Hairline Frame */}
        <div className="absolute inset-0 pointer-events-none border border-[#3c3b3a]/40" />

        {/* Overlaid UI Chapter 1 (0% - 15%): Centered Monolith */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none transition-transform will-change-transform"
          style={{
            opacity: ch1Opacity,
            transform: `translateY(${ch1TranslateY}px)`,
          }}
        >
          <div className="text-xs uppercase tracking-[0.25em] text-[#8d8d89] font-mono mb-4">
            Horological Architecture · Series 01
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display max-w-4xl text-balance">
            ENGINEERED IN GENEVA
          </h1>
          <p className="mt-4 text-xs md:text-sm text-[#8d8d89] max-w-md tracking-wider uppercase font-mono">
            Calibre 900 · 240 Native Canvas Frames
          </p>

          {/* Subtle Pulsating Scroll Guide Indicator */}
          <div className="absolute bottom-14 flex flex-col items-center gap-3 text-xs font-mono text-[#8d8d89] pointer-events-auto">
            {/* Minimalist Watch Crown / Scroll Pill with Gliding Amber Bead */}
            <div className="relative w-6 h-10 rounded-full border border-[#585a5a] flex items-start justify-center pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-scroll-glide" />
              {/* Outer soft halo pulse */}
              <span className="absolute inset-0 rounded-full border border-[#d4af37]/30 animate-halo-expand pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 tracking-widest uppercase text-[11px]">
              <span className="text-[#d8d8d4]">Scroll to scrub 240 frames</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
            </div>

            <ChevronDown className="w-4 h-4 text-[#d4af37] animate-bounce" />
          </div>
        </div>

        {/* Overlaid UI Chapter 2 (20% - 40%): Left-aligned Profile */}
        <div
          className="absolute left-6 md:left-20 top-1/2 -translate-y-1/2 max-w-md pointer-events-none transition-opacity duration-300"
          style={{ opacity: ch2Opacity }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono mb-2">
            Chapter 01 · Kinetic Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display leading-[0.95]">
            THE CALIBRE 900. MICRO-ROTOR PRECISION.
          </h2>
          <p className="mt-4 text-sm text-[#8d8d89] leading-relaxed max-w-sm">
            8.2mm architectural profile machined from solid Grade 5 titanium. Engineered with a decentralized 22k gold mass that silently charges 70 hours of chronometric autonomy.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-[#6d6f6f]">
            <span>THICKNESS: 8.2MM</span>
            <span>·</span>
            <span>MASS: 22K AU</span>
          </div>
        </div>

        {/* Overlaid UI Chapter 3 (45% - 70%): Right-aligned Macro Guilloché */}
        <div
          className="absolute right-6 md:right-20 top-1/2 -translate-y-1/2 max-w-md text-right pointer-events-none transition-opacity duration-300"
          style={{ opacity: ch3Opacity }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono mb-2">
            Chapter 02 · Métiers d'Art
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display leading-[0.95]">
            GUILLOCHÉ. CUT BY HAND. NO SHORTCUTS.
          </h2>
          <p className="mt-4 text-sm text-[#8d8d89] leading-relaxed max-w-sm ml-auto">
            Each solid sterling silver dial requires 14 hours of continuous hand-cranked turning on a 1924 manual rose-engine lathe. A microscopic hobnail matrix engineered to capture light with absolute restraint.
          </p>
          <div className="mt-4 flex items-center justify-end gap-4 text-xs font-mono text-[#6d6f6f]">
            <span>LATHE: 1924 ROSE-ENGINE</span>
            <span>·</span>
            <span>TOLERANCE: ±0.005MM</span>
          </div>
        </div>

        {/* Overlaid UI Chapter 4 (75% - 100%): Centered Final Presentation with CTA */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between p-8 md:p-14 pointer-events-none transition-opacity duration-300"
          style={{ opacity: ch4Opacity }}
        >
          {/* Top subtle marker */}
          <div className="pt-20 text-xs font-mono tracking-widest text-[#8d8d89] uppercase">
            Atelier Ora Genève · Allocation Series 2026
          </div>

          {/* Bottom Acquisition Action */}
          <div className="w-full max-w-md text-center space-y-4 pb-14 pointer-events-auto">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#d4af37] tracking-widest uppercase">
                Series 01 · 100 Numbered Pieces
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#d8d8d4] font-display">
                ORA CALIBRE 900 TITANIUM
              </h3>
              <div className="text-sm font-mono text-[#6d6f6f] tabular-nums">
                $18,400 USD · CHF 16,800
              </div>
            </div>

            <button
              onClick={onOpenAcquisition}
              className="w-full py-4 px-8 text-xs font-semibold tracking-widest uppercase bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] transition-colors cursor-pointer shadow-none"
            >
              Acquire Timepiece
            </button>
            <p className="text-[11px] text-[#585a5a] font-mono">
              Complimentary armored Swiss courier delivery & 5-year manufacture warranty.
            </p>
          </div>
        </div>

        {/* Vertical Chapter Rail & Pulsating Indicators (Right Edge) */}
        <aside
          aria-label="Frame sequence progress"
          className="hidden sm:flex absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex-col items-end gap-6 z-20 select-none"
        >
          {/* Connecting vertical hairline track */}
          <div className="relative flex flex-col items-end gap-6">
            <div className="absolute right-[5px] top-1.5 bottom-1.5 w-[1px] bg-[#3c3b3a] -z-10" />

            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapterIndex === idx;
              const isPast = currentProgress >= ch.progress;

              return (
                <button
                  key={ch.id}
                  onClick={() => scrollToProgress(ch.progress)}
                  className="group flex items-center gap-3 cursor-pointer py-1 text-right focus:outline-none"
                  title={`Jump to ${ch.label}`}
                >
                  {/* Chapter Label (Fades in slightly on hover or active) */}
                  <span
                    className={`text-[10px] font-mono tracking-widest transition-all duration-300 ${
                      isActive
                        ? 'text-[#d4af37] font-semibold translate-x-0 opacity-100'
                        : 'text-[#6d6f6f] group-hover:text-[#d8d8d4] opacity-70 group-hover:opacity-100'
                    }`}
                  >
                    {ch.label}
                  </span>

                  {/* Pulsating Indicator Node */}
                  <div className="relative flex items-center justify-center w-3 h-3">
                    {/* Concentric pulsing halo when active */}
                    {isActive && (
                      <span className="absolute w-5 h-5 rounded-full border border-[#d4af37]/60 animate-halo-expand pointer-events-none" />
                    )}

                    {/* Node Core Pip */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                        isActive
                          ? 'bg-[#d4af37] border-[#d4af37] animate-amber-pulse scale-110'
                          : isPast
                          ? 'bg-[#585a5a] border-[#585a5a]'
                          : 'bg-[#171817] border-[#3c3b3a] group-hover:border-[#8d8d89]'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Micro Frame Telemetry */}
          <div className="text-[10px] font-mono text-[#6d6f6f] tabular-nums pt-1 border-t border-[#3c3b3a]">
            FRAME <span className="text-[#d8d8d4] font-medium">{currentFrameIndex.toString().padStart(3, '0')}</span> / 239
          </div>
        </aside>

        {/* Bottom Interactive Frame Scrubber Ruler with Pulsating Head */}
        <div className="absolute bottom-4 left-6 right-6 md:left-12 md:right-12 z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pointer-events-auto">
          {/* Telemetry info */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-[#6d6f6f]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-amber-pulse" />
              <span className="text-[#d8d8d4] uppercase tracking-wider">Canvas Scrub</span>
            </div>
            <span>·</span>
            <span>FRAME {currentFrameIndex.toString().padStart(3, '0')} / 239</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">PROGRESS {(currentProgress * 100).toFixed(1)}%</span>
          </div>

          {/* Horizontal Interactive Timeline Ruler */}
          <div
            onClick={handleScrubberInteraction}
            className="group relative h-6 w-full max-w-sm flex items-center cursor-pointer"
            title="Click or drag to scrub frames"
          >
            {/* Background hairline ruler */}
            <div className="w-full h-[1px] bg-[#3c3b3a] group-hover:bg-[#585a5a] transition-colors" />

            {/* Chapter milestone ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-[1px] h-2 bg-[#585a5a]"
                style={{ left: `${pct * 100}%` }}
              />
            ))}

            {/* Active scrubbed fill bar */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-[#d4af37] transition-all duration-75"
              style={{ width: `${currentProgress * 100}%` }}
            />

            {/* Subtle Pulsating Playhead Pip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -ml-2 flex items-center justify-center transition-all duration-75"
              style={{ left: `${currentProgress * 100}%` }}
            >
              {/* Outer breathing aura */}
              <span className="absolute w-4 h-4 rounded-full bg-[#d4af37]/20 animate-halo-expand pointer-events-none" />
              {/* Center amber pip */}
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] ring-2 ring-[#171817] shadow-none animate-amber-pulse" />
            </div>
          </div>

          {/* Micro Scroll Hint when in middle of sequence */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[#8d8d89]">
            <span className="tracking-wider uppercase">Scrub or Wheel</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#d4af37] animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
};
