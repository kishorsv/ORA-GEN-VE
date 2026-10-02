import React, { useState, useEffect } from 'react';

export const TotalScrollProgressBar: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useEffect(() => {
    let animId: number;

    const calculateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable > 0) {
        const pct = Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100));
        setScrollPercentage(pct);
      } else {
        setScrollPercentage(0);
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(calculateScroll);
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[2.5px] z-50 pointer-events-none select-none overflow-visible"
      role="progressbar"
      aria-label="Total page scroll progress"
      aria-valuenow={Math.round(scrollPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Hairline background track */}
      <div className="absolute inset-0 bg-[#222322]/80 backdrop-blur-none" />

      {/* Horological Amber (#d4af37) Active Scroll Fill */}
      <div
        className="h-full bg-[#d4af37] transition-[width] duration-75 ease-out relative"
        style={{
          width: `${scrollPercentage}%`,
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.7), 0 0 2px #d4af37',
        }}
      >
        {/* Subtle luminous micro-pip at the leading edge */}
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#fced96] shadow-[0_0_8px_#d4af37]"
          style={{ opacity: scrollPercentage > 0.5 ? 1 : 0 }}
        />
      </div>
    </div>
  );
};
