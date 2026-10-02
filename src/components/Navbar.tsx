import React, { useState, useEffect } from 'react';
import { Menu, Search, Heart, Sliders, Shield } from 'lucide-react';
import type { WatchModel } from '../types/database';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenManagement: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenFavorites: () => void;
  onOpenAcquisition: () => void;
  activeWatch: WatchModel | null;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenManagement,
  onOpenSearch,
  onOpenAuth,
  onOpenFavorites,
  onOpenAcquisition,
  activeWatch,
  favoritesCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 sm:py-4 bg-[#030303]/90 backdrop-blur-md border-b border-white/[0.06] shadow-2xl shadow-black/90'
          : 'py-5 sm:py-7 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-10 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group text-left"
            data-cursor="ORA"
          >
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-luxury-ivory font-light transition-colors group-hover:text-luxury-champagne">
              ORA
            </span>
            <span className="font-mono text-[9px] tracking-[0.35em] text-luxury-stone/80 ml-2.5 transition-colors group-hover:text-luxury-bone">
              GENÈVE
            </span>
          </button>

          {/* Active Model Live Badge */}
          {activeWatch && (
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-champagne animate-pulse-subtle" />
              <span className="font-mono text-[9px] tracking-wider text-luxury-stone">
                {activeWatch.name} · {activeWatch.availability}
              </span>
            </div>
          )}
        </div>

        {/* Center: Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <button
            onClick={() => scrollToSection('collection')}
            className="text-[11px] font-mono tracking-[0.22em] text-luxury-stone/80 hover:text-luxury-ivory transition-colors relative py-1 group"
            data-cursor="COLLECTION"
          >
            <span>COLLECTION</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-champagne transition-all duration-300 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('calibre')}
            className="text-[11px] font-mono tracking-[0.22em] text-luxury-stone/80 hover:text-luxury-ivory transition-colors relative py-1 group"
            data-cursor="CALIBRE"
          >
            <span>CALIBRE 900</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-champagne transition-all duration-300 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('craftsmanship')}
            className="text-[11px] font-mono tracking-[0.22em] text-luxury-stone/80 hover:text-luxury-ivory transition-colors relative py-1 group"
            data-cursor="CRAFT"
          >
            <span>CRAFTSMANSHIP</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-champagne transition-all duration-300 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('story')}
            className="text-[11px] font-mono tracking-[0.22em] text-luxury-stone/80 hover:text-luxury-ivory transition-colors relative py-1 group"
            data-cursor="KINEMATICS"
          >
            <span>ANATOMY</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-champagne transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        {/* Right: Actions (Search, Favorites, Admin Portal, Inquire) */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Live Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="SEARCH"
            title="Search collection (⌘K)"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Favorites Bookmark */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="FAVORITES"
            title="View saved timepieces"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-luxury-champagne text-black font-mono text-[8px] font-bold rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Admin Database Portal Trigger */}
          <button
            onClick={onOpenManagement}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border border-white/[0.08] hover:border-luxury-champagne/40 text-luxury-stone hover:text-luxury-ivory text-[9px] font-mono tracking-widest transition-all rounded-sm"
            data-cursor="PORTAL"
            title="Maison Atelier Database Controller"
          >
            <Sliders className="w-3 h-3 text-luxury-champagne" />
            <span className="hidden lg:inline">PORTAL</span>
          </button>

          {/* Client Auth */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:flex p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="CLIENT"
            title="Client Sign In"
          >
            <Shield className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Inquire CTA */}
          <button
            onClick={onOpenAcquisition}
            className="px-3.5 sm:px-4 py-1.5 border border-luxury-champagne/40 bg-luxury-champagne/[0.06] hover:bg-luxury-champagne hover:text-[#030303] text-luxury-champagne text-[10px] font-mono tracking-[0.2em] transition-all duration-300"
            data-cursor="INQUIRE"
          >
            ACQUIRE
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            aria-label="Open Navigation"
            data-cursor="MENU"
          >
            <Menu className="w-5 h-5 stroke-[1.4]" />
          </button>
        </div>
      </div>
    </header>
  );
};
