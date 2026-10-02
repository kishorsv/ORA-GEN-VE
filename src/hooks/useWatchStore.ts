import { useState, useEffect, useCallback } from 'react';
import type { Watch } from '../types/watch';
import { INITIAL_WATCHES } from '../data/watches';

const STORAGE_KEY = 'ora_geneve_watches_v1';
const ACTIVE_WATCH_KEY = 'ora_geneve_active_watch_id';

export function useWatchStore() {
  const [watches, setWatches] = useState<Watch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_WATCHES;
  });

  const [activeWatchId, setActiveWatchId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_WATCH_KEY);
      if (savedId && INITIAL_WATCHES.some(w => w.id === savedId)) {
        return savedId;
      }
    } catch {
      // ignore
    }
    return 'ora-01';
  });

  const [selectedWatchForDetail, setSelectedWatchForDetail] = useState<Watch | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAcquisitionOpen, setIsAcquisitionOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watches));
    } catch (e) {
      console.warn('Could not persist watches', e);
    }
  }, [watches]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_WATCH_KEY, activeWatchId);
    } catch (e) {
      console.warn('Could not persist active watch', e);
    }
  }, [activeWatchId]);

  const activeWatch = watches.find(w => w.id === activeWatchId) || watches[0] || INITIAL_WATCHES[0];

  const openDetail = useCallback((watch: Watch) => {
    setSelectedWatchForDetail(watch);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const openAcquisition = useCallback((watch?: Watch) => {
    if (watch) setSelectedWatchForDetail(watch);
    setIsAcquisitionOpen(true);
  }, []);

  const closeAcquisition = useCallback(() => {
    setIsAcquisitionOpen(false);
  }, []);

  const openManagement = useCallback(() => {
    setIsManagementOpen(true);
  }, []);

  const closeManagement = useCallback(() => {
    setIsManagementOpen(false);
  }, []);

  const addCustomWatch = useCallback((newWatch: Watch) => {
    setWatches(prev => [newWatch, ...prev]);
    setActiveWatchId(newWatch.id);
  }, []);

  const resetToFactoryWatches = useCallback(() => {
    setWatches(INITIAL_WATCHES);
    setActiveWatchId('ora-01');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_WATCH_KEY);
  }, []);

  return {
    watches,
    activeWatch,
    activeWatchId,
    setActiveWatchId,
    selectedWatchForDetail: selectedWatchForDetail || activeWatch,
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
    resetToFactoryWatches
  };
}
