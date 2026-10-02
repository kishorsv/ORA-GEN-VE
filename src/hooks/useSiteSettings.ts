import { useState, useEffect, useCallback } from 'react';
import type { DbSiteSettings } from '../types/database';
import { fetchSiteSettings, updateSiteSettings, subscribeToSiteSettings } from '../services/settings';
import { SEED_SITE_SETTINGS } from '../data/seedData';

export function useSiteSettings() {
  const [settings, setSettings] = useState<DbSiteSettings>(SEED_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    const unsubscribe = subscribeToSiteSettings((newSettings) => {
      setSettings(newSettings);
    });
    return () => unsubscribe();
  }, [loadSettings]);

  const update = async (updates: Partial<DbSiteSettings>) => {
    const updated = await updateSiteSettings(updates);
    setSettings(updated);
    return updated;
  };

  return {
    settings,
    loading,
    updateSettings: update,
    refetch: loadSettings,
  };
}
