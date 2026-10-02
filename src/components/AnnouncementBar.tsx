import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface AnnouncementBarProps {
  active: boolean;
  text: string;
  onAction?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  active,
  text,
  onAction,
}) => {
  if (!active || !text) return null;

  return (
    <div className="relative w-full bg-[#050505] border-b border-white/[0.06] py-2 px-4 z-40 text-center flex items-center justify-center gap-3">
      <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne uppercase font-medium">
        ORA GENÈVE
      </span>
      <span className="text-white/20 text-xs hidden sm:inline">·</span>
      <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-stone/90 uppercase">
        {text}
      </span>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1 font-mono text-[8px] tracking-widest text-luxury-champagne hover:text-white transition-colors ml-2"
          data-cursor="CLICK"
        >
          <span>RSVP</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
};
