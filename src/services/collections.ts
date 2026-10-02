import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbCollection } from '../types/database';
import { SEED_COLLECTIONS } from '../data/seedData';

const LOCAL_COLLECTIONS_KEY = 'ora_collections_db_v2';

export async function fetchCollections(): Promise<DbCollection[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('collections').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetchCollections error, using local fallback:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_COLLECTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading local collections', err);
  }
  localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(SEED_COLLECTIONS));
  return SEED_COLLECTIONS;
}
