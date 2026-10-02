import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface WatchVisualProps {
  image: string;
  alt?: string;
  depth?: number | string;
  position?: 'center' | 'left' | 'right' | 'offset';
  intensity?: number;
  enableTilt?: boolean;
  lightSweep?: boolean;
  scale?: number;
  rotate?: number;
  brightness?: number;
  blur?: number;
  clipPath?: string;
  className?: string;
  onClick?: () => void;
  dataCursor?: string;
  priority?: boolean;
}

export const WatchVisual: React.FC<WatchVisualProps> = ({
  image,
  alt = 'ORA Genève Luxury Timepiece',
  depth = 1,
  position = 'center',
  intensity = 1,
  enableTilt = false,
  lightSweep = true,
  scale = 1,
  rotate = 0,
  brightness = 1,
  blur = 0,
  clipPath,
  className = '',
  onClick,
  dataCursor = 'EXAMINE',
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const numericDepth = typeof depth === 'string' ? parseFloat(depth) || 1 : depth;

  useEffect(() => {
    const el = containerRef.current;
    const img = imgRef.current;
    if (!el || !img) return;

    // Prefers-reduced-motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Continuous smooth scroll parallax
      const yDelta = 45 * numericDepth * intensity;
      const scaleDelta = 0.06 * intensity;

      gsap.fromTo(
        img,
        {
          y: -yDelta * 0.4,
          scale: scale * 0.98,
        },
        {
          y: yDelta,
          scale: scale * (1 + scaleDelta),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [numericDepth, intensity, scale]);

  // Interactive 3D mouse tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: x * 7 * intensity,
      y: y * -7 * intensity,
    });
  };

  const handleMouseLeave = () => {
    if (enableTilt) setTilt({ x: 0, y: 0 });
  };

  const positionClasses = {
    center: 'mx-auto',
    left: 'mr-auto',
    right: 'ml-auto',
    offset: 'translate-x-4 lg:translate-x-8',
  }[position];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor={dataCursor}
      className={`relative flex items-center justify-center select-none ${positionClasses} ${className}`}
      style={{
        perspective: enableTilt ? '1200px' : undefined,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {/* Studio Shadow underneath watch */}
      <div
        className="absolute bottom-4 w-[75%] h-8 rounded-full bg-black/90 blur-xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Photographic Layer */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          transform: enableTilt
            ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) rotateZ(${rotate}deg)`
            : `rotateZ(${rotate}deg)`,
          transformStyle: 'preserve-3d',
          clipPath: clipPath,
        }}
      >
        <img
          ref={imgRef}
          src={image}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`max-h-full max-w-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-all duration-700 ${
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
          }`}
          style={{
            filter: `brightness(${brightness}) ${blur > 0 ? `blur(${blur}px)` : ''} drop-shadow(0 25px 45px rgba(0,0,0,0.95))`,
            willChange: 'transform, opacity',
          }}
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Studio Lighting Sweep */}
        {lightSweep && (
          <div className="light-sweep rounded-full overflow-hidden" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};
