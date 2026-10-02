/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FrameSequenceManager, HorologyAudioSynth } from './utils/canvasRenderer';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { ScrollScrubber } from './components/ScrollScrubber';
import { BentoGrid } from './components/BentoGrid';
import { WatchInspector } from './components/WatchInspector';
import { AcquisitionDrawer } from './components/AcquisitionDrawer';
import { ImageReplaceModal } from './components/ImageReplaceModal';
import { TotalScrollProgressBar } from './components/TotalScrollProgressBar';
import { Footer } from './components/Footer';

export default function App() {
  const frameManager = useMemo(() => new FrameSequenceManager(240), []);
  const audioSynthRef = useRef<HorologyAudioSynth | null>(null);

  const [preloadProgress, setPreloadProgress] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isAcquisitionOpen, setIsAcquisitionOpen] = useState(false);
  const [isImageReplaceOpen, setIsImageReplaceOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [canvasProgress, setCanvasProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customWatchImage, setCustomWatchImage] = useState<HTMLImageElement | null>(null);

  // Initialize and preload 240 frames
  useEffect(() => {
    let mounted = true;
    audioSynthRef.current = new HorologyAudioSynth();

    const startPreload = async () => {
      try {
        await frameManager.preloadAll((loaded, total) => {
          if (mounted) {
            setLoadedFrames(loaded);
            setPreloadProgress((loaded / total) * 100);
          }
        });

        if (mounted) {
          // Brief settle delay to show 100% completion
          setTimeout(() => {
            setIsReady(true);
          }, 350);
        }
      } catch (err) {
        console.error('Frame preloading error:', err);
        if (mounted) setIsReady(true);
      }
    };

    startPreload();

    return () => {
      mounted = false;
      frameManager.destroy();
      if (audioSynthRef.current) {
        audioSynthRef.current.destroy();
      }
    };
  }, [frameManager]);

  const handleToggleAudio = () => {
    if (audioSynthRef.current) {
      const active = audioSynthRef.current.toggleMute();
      setIsAudioActive(active);
    }
  };

  const handleApplyCustomImage = async (img: HTMLImageElement | null) => {
    await frameManager.setCustomImage(img);
    setCustomWatchImage(img);
  };

  const handleScrubClick = (targetProg: number) => {
    // Locate spacer container
    const spacer = document.querySelector('div[class*="h-[750vh]"]') as HTMLElement;
    if (spacer) {
      const rect = spacer.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      const targetScrollY = containerTop + targetProg * totalScrollable;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#171817] text-[#d8d8d4] font-body selection:bg-[#d4af37] selection:text-[#171817]">
      {/* Real-Progress Preloader */}
      <Preloader
        progress={preloadProgress}
        loadedFrames={loadedFrames}
        totalFrames={240}
        isReady={isReady}
        onEnter={() => setIsReady(true)}
      />

      {/* Subtle Fixed-Position Total Page Scroll Progress Bar (#d4af37) */}
      <TotalScrollProgressBar />

      {/* Top Bar Contract (3 Zones) with Sequence Progress Scrubber */}
      <Navigation
        onOpenAcquisition={() => setIsAcquisitionOpen(true)}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenImageReplace={() => setIsImageReplaceOpen(true)}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        scrollProgress={canvasProgress}
        currentFrame={currentFrame}
        onScrubClick={handleScrubClick}
      />

      {/* Main Content Area */}
      <main className="relative">
        {/* Scroll-Scrubbed Canvas Hero (800vh spacer) */}
        <ScrollScrubber
          frameManager={frameManager}
          onOpenAcquisition={() => setIsAcquisitionOpen(true)}
          onProgressChange={(prog, frame) => {
            setCanvasProgress(prog);
            setCurrentFrame(frame);
          }}
        />

        {/* Asymmetric Bento Grid & Technical Matrix */}
        <BentoGrid
          onOpenInspector={() => setIsInspectorOpen(true)}
          onOpenAcquisition={() => setIsAcquisitionOpen(true)}
        />
      </main>

      {/* Interactive Timepiece Inspector Modal */}
      <WatchInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        onOpenAcquisition={() => {
          setIsInspectorOpen(false);
          setIsAcquisitionOpen(true);
        }}
      />

      {/* Bespoke Acquisition Drawer */}
      <AcquisitionDrawer
        isOpen={isAcquisitionOpen}
        onClose={() => setIsAcquisitionOpen(false)}
      />

      {/* Custom Timepiece Image Replacement Modal */}
      <ImageReplaceModal
        isOpen={isImageReplaceOpen}
        onClose={() => setIsImageReplaceOpen(false)}
        onApplyImage={handleApplyCustomImage}
        currentImage={customWatchImage}
      />

      {/* Footer Hold-up */}
      <Footer />
    </div>
  );
}
