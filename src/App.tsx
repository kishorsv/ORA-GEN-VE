import React, { useState } from 'react';
import { useWatchStore } from './hooks/useWatchStore';
import { useLenis } from './hooks/useLenis';
import { CustomCursor } from './components/CustomCursor';
import { GrainOverlay } from './components/GrainOverlay';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { HeroSection } from './components/HeroSection';
import { CinematicStorySection } from './components/CinematicStorySection';
import { CollectionSection } from './components/CollectionSection';
import { CalibreMovementSection } from './components/CalibreMovementSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { WatchDetailModal } from './components/WatchDetailModal';
import { AcquisitionModal } from './components/AcquisitionModal';
import { WatchManagementModal } from './components/WatchManagementModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll
  useLenis();

  // Watch state store
  const {
    watches,
    activeWatch,
    activeWatchId,
    setActiveWatchId,
    selectedWatchForDetail,
    isDetailOpen,
    openDetail,
    closeDetail,
    isAcquisitionOpen,
    openAcquisition,
    closeAcquisition,
    isManagementOpen,
    openManagement,
    closeManagement,
    addCustomWatch,
    resetToFactoryWatches,
  } = useWatchStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectActiveWatch = (id: string) => {
    setActiveWatchId(id);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F5F2EA] overflow-x-hidden selection:bg-luxury-champagne/20">
      {/* Custom Luxury Cursor for Desktop */}
      <CustomCursor />

      {/* Atmospheric Film Grain and Vignette */}
      <GrainOverlay />

      {/* Navigation Bar */}
      <Navbar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenManagement={openManagement}
        onOpenAcquisition={() => openAcquisition(activeWatch)}
        activeModelName={activeWatch.name}
      />

      {/* Fullscreen Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        onOpenManagement={openManagement}
        onOpenAcquisition={() => openAcquisition(activeWatch)}
      />

      {/* Main Experience Flow */}
      <main className="relative z-10 w-full overflow-x-hidden">
        {/* 1. Cinematic Hero Section */}
        <HeroSection
          watch={activeWatch}
          onExplore={() => openDetail(activeWatch)}
          onDiscoverMovement={() => handleNavigate('calibre')}
        />

        {/* 2. Scroll-Driven Watch Anatomy (Center -> Right -> Center -> Left -> Fullscreen) */}
        <CinematicStorySection
          watch={activeWatch}
          onExploreWatch={() => openDetail(activeWatch)}
        />

        {/* 3. The Collection (Asymmetrical editorial layouts) */}
        <CollectionSection
          watches={watches}
          activeWatchId={activeWatchId}
          onSelectWatch={(watch) => setActiveWatchId(watch.id)}
          onOpenDetail={openDetail}
        />

        {/* 4. Calibre 900 Mechanical Movement & Metrology */}
        <CalibreMovementSection
          watch={activeWatch}
        />

        {/* 5. The Art of Craft (Métiers d'Art & Atelier) */}
        <CraftsmanshipSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAcquisition={() => openAcquisition(activeWatch)}
        onOpenManagement={openManagement}
      />

      {/* Modals & Drawers */}
      {/* 1. Watch Detail Modal */}
      <WatchDetailModal
        watch={selectedWatchForDetail}
        isOpen={isDetailOpen}
        onClose={closeDetail}
        onAcquire={(watch) => openAcquisition(watch)}
      />

      {/* 2. Acquisition Concierge Modal */}
      <AcquisitionModal
        watch={selectedWatchForDetail}
        isOpen={isAcquisitionOpen}
        onClose={closeAcquisition}
      />

      {/* 3. Atelier Vault & Watch Photography Manager */}
      <WatchManagementModal
        watches={watches}
        activeWatchId={activeWatchId}
        isOpen={isManagementOpen}
        onClose={closeManagement}
        onSelectActiveWatch={handleSelectActiveWatch}
        onAddWatch={addCustomWatch}
        onResetFactory={resetToFactoryWatches}
      />
    </div>
  );
};

export default App;
