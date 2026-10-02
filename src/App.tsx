import React, { useState } from 'react';
import { useWatches } from './hooks/useWatches';
import { useSiteSettings } from './hooks/useSiteSettings';
import { useFavorites } from './hooks/useFavorites';
import { useLenis } from './hooks/useLenis';
import type { WatchModel } from './types/database';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { HeroSection } from './components/HeroSection';
import { CinematicStorySection } from './components/CinematicStorySection';
import { CollectionSection } from './components/CollectionSection';
import { CalibreMovementSection } from './components/CalibreMovementSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { WatchDetailModal } from './components/WatchDetailModal';
import { InquiryModal } from './components/InquiryModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { LiveSearchModal } from './components/LiveSearchModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AuthModal } from './components/AuthModal';
import { CustomCursor } from './components/CustomCursor';
import { GrainOverlay } from './components/GrainOverlay';
import { LoadingScreen } from './components/LoadingScreen';
import { ApiErrorState } from './components/ApiErrorState';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // 1. Initialize Lenis smooth scroll
  useLenis();

  // 2. Data hooks
  const {
    watches,
    loading: watchesLoading,
    error: watchesError,
    filters,
    setFilters,
    refetch: refetchWatches,
  } = useWatches();

  const {
    settings,
    updateSettings,
    refetch: refetchSettings,
  } = useSiteSettings();

  const {
    favoriteIds,
    favoritesCount,
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  // 3. UI State
  const [activeWatchId, setActiveWatchId] = useState<string>('w-ora-01');
  const [selectedWatchForDetail, setSelectedWatchForDetail] = useState<WatchModel | null>(null);

  // Modal open states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive active hero watch
  const activeWatch =
    watches.find((w) => w.id === activeWatchId) ||
    watches.find((w) => w.id === settings.featured_watch_id) ||
    watches[0] ||
    null;

  // Derive favorite watches list
  const favoriteWatches = watches.filter((w) => favoriteIds.includes(w.id));

  // Navigation helper
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenDetail = (watch: WatchModel) => {
    setSelectedWatchForDetail(watch);
    setIsDetailOpen(true);
  };

  const handleOpenInquiry = (watch?: WatchModel) => {
    if (watch) setSelectedWatchForDetail(watch);
    setIsInquiryOpen(true);
  };

  // Initial loading state
  if (watchesLoading && watches.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#F4F1EA] overflow-x-hidden selection:bg-luxury-champagne/20">
      {/* Luxury Custom Cursor (Desktop) */}
      <CustomCursor />

      {/* Atmospheric Film Grain & Studio Vignette */}
      <GrainOverlay />

      {/* 1. Dynamic Announcement Bar */}
      <AnnouncementBar
        active={settings.announcement_active}
        text={settings.announcement_text}
        onAction={() => handleOpenInquiry(activeWatch || undefined)}
      />

      {/* 2. Primary Navigation Bar */}
      <Navbar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenManagement={() => setIsAdminOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAcquisition={() => handleOpenInquiry(activeWatch || undefined)}
        activeWatch={activeWatch}
        favoritesCount={favoritesCount}
      />

      {/* 3. Fullscreen Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpenManagement={() => setIsAdminOpen(true)}
        onOpenAcquisition={() => handleOpenInquiry(activeWatch || undefined)}
      />

      {/* Error Boundary / Fallback View if database query fails */}
      {watchesError && watches.length === 0 ? (
        <div className="pt-32">
          <ApiErrorState message={watchesError} onRetry={refetchWatches} />
        </div>
      ) : (
        /* Main Experience Storytelling Sections */
        <main className="relative z-10 w-full overflow-x-hidden">
          {/* Hero Section */}
          <HeroSection
            watch={activeWatch}
            siteSettings={settings}
            onExplore={() => activeWatch && handleOpenDetail(activeWatch)}
            onDiscoverMovement={() => handleNavigate('calibre')}
          />

          {/* Continuous Scroll Anatomy Section */}
          <CinematicStorySection
            watch={activeWatch}
            onExploreWatch={() => activeWatch && handleOpenDetail(activeWatch)}
          />

          {/* The Collection Section (Editorial Layouts + Database Filters) */}
          <CollectionSection
            watches={watches}
            activeWatchId={activeWatch?.id || ''}
            onSelectWatch={(watch) => setActiveWatchId(watch.id)}
            onOpenDetail={handleOpenDetail}
            filters={filters}
            onFilterChange={setFilters}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />

          {/* Calibre 900 Mechanical Movement & Metrology Hotspots */}
          <CalibreMovementSection watch={activeWatch} />

          {/* Métiers d'Art & Geneva Atelier Craftsmanship */}
          <CraftsmanshipSection />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenAcquisition={() => handleOpenInquiry(activeWatch || undefined)}
        onOpenManagement={() => setIsAdminOpen(true)}
        siteSettings={settings}
      />

      {/* --- ALL REAL-TIME MODALS & DIALOGS --- */}

      {/* Watch Detail Catalogue Modal */}
      <WatchDetailModal
        watch={selectedWatchForDetail || activeWatch}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAcquire={(watch) => handleOpenInquiry(watch)}
        isFavorite={selectedWatchForDetail ? isFavorite(selectedWatchForDetail.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Real-Time Client Inquiry Modal */}
      <InquiryModal
        watch={selectedWatchForDetail || activeWatch}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />

      {/* Live Admin Database & Inventory Portal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        watches={watches}
        siteSettings={settings}
        onUpdateSiteSettings={updateSettings}
        onWatchUpdated={() => {
          refetchWatches();
          refetchSettings();
        }}
      />

      {/* Debounced Live Search Modal */}
      <LiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectWatch={(watch) => handleOpenDetail(watch)}
      />

      {/* Curated Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteWatches={favoriteWatches}
        onSelectWatch={handleOpenDetail}
        onRemoveFavorite={toggleFavorite}
      />

      {/* Supabase Client Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default App;
