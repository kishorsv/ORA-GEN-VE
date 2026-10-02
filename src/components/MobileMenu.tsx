import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenManagement: () => void;
  onOpenAcquisition: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenManagement,
  onOpenAcquisition,
}) => {
  if (!isOpen) return null;

  const links = [
    { label: 'COLLECTION', id: 'collection', sub: 'Horological Creations' },
    { label: 'CALIBRE 900', id: 'calibre', sub: 'Manufacture Movement' },
    { label: 'CRAFTSMANSHIP', id: 'craftsmanship', sub: 'Métiers d’Art Atelier' },
    { label: 'MAISON', id: 'maison', sub: 'Geneva Heritage' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-[#050505]/98 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-12 animate-fadeIn transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-luxury-border pb-6">
        <div>
          <span className="font-serif text-2xl tracking-[0.2em] text-luxury-ivory font-light">ORA</span>
          <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne ml-3">GENÈVE</span>
        </div>
        <button
          onClick={onClose}
          className="p-3 text-luxury-stone hover:text-luxury-ivory transition-colors"
          aria-label="Close navigation"
          data-cursor="CLOSE"
        >
          <X className="w-6 h-6 stroke-[1.2]" />
        </button>
      </div>

      {/* Main Links */}
      <nav className="flex flex-col gap-8 my-auto py-6">
        {links.map((link, idx) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.id)}
            className="group text-left flex items-baseline justify-between transition-transform duration-300 hover:translate-x-3"
            data-cursor="EXPLORE"
          >
            <div>
              <span className="font-mono text-[10px] tracking-widest text-luxury-champagne/60 mr-4">0{idx + 1}</span>
              <span className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-luxury-ivory group-hover:text-luxury-champagne transition-colors">
                {link.label}
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-luxury-stone/60 hidden sm:inline">
              {link.sub}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions & Info */}
      <div className="border-t border-luxury-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              onClose();
              onOpenAcquisition();
            }}
            className="px-5 py-2.5 bg-luxury-champagne/10 border border-luxury-champagne/30 text-luxury-champagne text-[11px] font-mono tracking-widest hover:bg-luxury-champagne hover:text-black transition-all flex items-center gap-2"
            data-cursor="INQUIRE"
          >
            <span>ACQUIRE TIMEPIECE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenManagement();
            }}
            className="px-4 py-2.5 border border-luxury-border text-luxury-stone hover:text-luxury-ivory text-[11px] font-mono tracking-widest transition-colors"
            data-cursor="CURATE"
          >
            ATELIER VAULT
          </button>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] tracking-widest text-luxury-stone/60">
            RUE DU RHÔNE 42 · 1204 GENÈVE
          </p>
          <p className="font-mono text-[9px] tracking-widest text-luxury-champagne/70 mt-1">
            MANUFACTURE D’HORLOGERIE SUISSE
          </p>
        </div>
      </div>
    </div>
  );
};
