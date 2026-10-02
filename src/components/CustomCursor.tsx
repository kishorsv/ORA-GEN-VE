import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Check what is hovered
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, [data-cursor], [role="button"], input, select');
        if (interactive) {
          setIsHovered(true);
          const customText = interactive.getAttribute('data-cursor');
          setCursorText(customText || '');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Smooth interpolation for the outer ring (lerp factor: 0.15)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
      {/* Central Precision Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovered ? 'cursor-hover' : ''}`}
        style={{ willChange: 'transform' }}
      />
      {/* Outer Interpolated Ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring flex items-center justify-center ${isHovered ? 'cursor-hover' : ''}`}
        style={{ willChange: 'transform' }}
      >
        {cursorText && (
          <span className="text-[8px] font-mono tracking-widest text-luxury-champagne uppercase opacity-90 select-none animate-fadeIn">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
