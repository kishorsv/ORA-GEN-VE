import React, { useEffect, useRef, useState } from 'react';
import { FrameSequenceManager } from '../utils/canvasRenderer';
import { ArrowDown } from 'lucide-react';

interface ScrollScrubberProps {
  frameManager: FrameSequenceManager;
  onOpenAcquisition: () => void;
}

export const ScrollScrubber: React.FC<ScrollScrubberProps> = ({
  frameManager,
  onOpenAcquisition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

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
        // Invalidate last drawn frame to force redraw
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
  // Chapter 1: 0.00 to 0.18
  const ch1Opacity = Math.max(0, Math.min(1, 1 - currentProgress / 0.15));
  const ch1TranslateY = (currentProgress / 0.15) * -30;

  // Chapter 2: 0.22 to 0.44
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

  // Chapter 3: 0.48 to 0.72
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

  // Chapter 4: 0.76 to 1.00
  let ch4Opacity = 0;
  if (currentProgress >= 0.76) {
    ch4Opacity = Math.min(1, (currentProgress - 0.76) / 0.12);
  }

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

          <div className="absolute bottom-12 flex flex-col items-center gap-2 text-xs font-mono text-[#6d6f6f]">
            <span className="tracking-widest uppercase">Scroll to scrub assembly</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#d4af37]" />
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
          <div className="w-full max-w-md text-center space-y-4 pb-6 pointer-events-auto">
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

        {/* Bottom Scroll Telemetry HUD (Micro-Indicator) */}
        <div className="absolute bottom-6 left-6 md:left-12 flex items-center gap-4 text-[10px] font-mono text-[#585a5a] pointer-events-none select-none">
          <span>SCRUB FRAME: {currentFrameIndex.toString().padStart(3, '0')} / 239</span>
          <span>·</span>
          <span>CHOP: {(currentProgress * 100).toFixed(1)}%</span>
          <span>·</span>
          <span>FPS: 60 NATIVE</span>
        </div>
      </div>
    </div>
  );
};
