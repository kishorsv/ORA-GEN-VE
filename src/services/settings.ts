import { supabase, isSupabaseConfigured, subscribeToLocalTable, broadcastLocalTableChange } from '../lib/supabase';
import type { DbSiteSettings } from '../types/database';
import { SEED_SITE_SETTINGS } from '../data/seedData';

const LOCAL_SETTINGS_KEY = 'ora_site_settings_v2';

function getLocalSettings(): DbSiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.hero_title) return parsed;
    }
  } catch (err) {
    console.warn('Error reading local site settings', err);
  }
  localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(SEED_SITE_SETTINGS));
  return SEED_SITE_SETTINGS;
}

function saveLocalSettings(settings: DbSiteSettings) {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving local settings', err);
  }
}

export async function fetchSiteSettings(): Promise<DbSiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global_settings').single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetchSiteSettings error, using local fallback:', err);
    }
  }

  return getLocalSettings();
}

export async function updateSiteSettings(updates: Partial<DbSiteSettings>): Promise<DbSiteSettings> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ ...updates, updated_at: now })
        .eq('id', 'global_settings')
        .select()
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase updateSiteSettings error, updating locally:', err);
    }
  }

  const current = getLocalSettings();
  const merged: DbSiteSettings = {
    ...current,
    ...updates,
    updated_at: now,
  };
  saveLocalSettings(merged);
  broadcastLocalTableChange('site_settings', 'UPDATE', merged);
  return merged;
}

export function subscribeToSiteSettings(callback: (settings: DbSiteSettings) => void) {
  if (isSupabaseConfigured && supabase) {
    const channel = supabase
      .channel('site_settings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, async () => {
        const updated = await fetchSiteSettings();
        callback(updated);
      })
      .subscribe();
    return () => {
      supabase?.removeChannel(channel);
    };
  }

  return subscribeToLocalTable('site_settings', (payload) => {
    if (payload.new) callback(payload.new);
  });
}
