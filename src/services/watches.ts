import { supabase, isSupabaseConfigured, subscribeToLocalTable, broadcastLocalTableChange } from '../lib/supabase';
import type { DbWatch, WatchModel, WatchAvailability, WatchFilters, DbWatchImage, DbWatchSpecs } from '../types/database';
import { SEED_WATCHES } from '../data/seedData';

const LOCAL_STORAGE_WATCHES_KEY = 'ora_watches_db_v2';

export function computeAvailability(watch: DbWatch): WatchAvailability {
  if (watch.status === 'coming_soon') {
    return 'COMING SOON';
  }
  if (watch.stock === 0 || watch.status === 'sold_out') {
    return 'SOLD OUT';
  }
  if (watch.stock > 0 && watch.stock <= 5) {
    return 'LIMITED AVAILABILITY';
  }
  return 'AVAILABLE';
}

export function formatWatchModel(watch: DbWatch): WatchModel {
  return {
    ...watch,
    availability: computeAvailability(watch),
    formattedPrice: `$${watch.price.toLocaleString('en-US')} ${watch.currency}`,
    formattedPriceCHF: `CHF ${watch.price_chf.toLocaleString('en-US')}`,
  };
}

function getLocalWatches(): DbWatch[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WATCHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading local watches store', err);
  }
  localStorage.setItem(LOCAL_STORAGE_WATCHES_KEY, JSON.stringify(SEED_WATCHES));
  return SEED_WATCHES;
}

function saveLocalWatches(watches: DbWatch[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_WATCHES_KEY, JSON.stringify(watches));
  } catch (err) {
    console.error('Error saving local watches store', err);
  }
}

export async function fetchWatches(filters?: WatchFilters, includeInactive = false): Promise<WatchModel[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('watches')
        .select(`
          *,
          images:watch_images(*),
          specs:watch_specs(*)
        `);

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      if (filters?.collection) {
        query = query.eq('collection_id', filters.collection);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        return applyClientFilters(data.map(formatWatchModel), filters);
      }
    } catch (err) {
      console.warn('Supabase fetchWatches query failed, falling back to local database:', err);
    }
  }

  // Resilient Local Engine
  const local = getLocalWatches();
  const visible = includeInactive ? local : local.filter((w) => w.is_active);
  const models = visible.map(formatWatchModel);
  return applyClientFilters(models, filters);
}

function applyClientFilters(models: WatchModel[], filters?: WatchFilters): WatchModel[] {
  if (!filters) return models;

  return models.filter((w) => {
    // Collection Filter
    if (filters.collection && filters.collection !== 'all') {
      const matchCol = w.collection_id === filters.collection || w.collection?.toLowerCase().includes(filters.collection.toLowerCase());
      if (!matchCol) return false;
    }

    // Movement Filter
    if (filters.movement && filters.movement !== 'all') {
      const movementText = (w.specs?.movement || '').toLowerCase();
      if (!movementText.includes(filters.movement.toLowerCase())) return false;
    }

    // Case Material Filter
    if (filters.caseMaterial && filters.caseMaterial !== 'all') {
      const materialText = (w.specs?.case_material || '').toLowerCase();
      if (!materialText.includes(filters.caseMaterial.toLowerCase())) return false;
    }

    // Availability Filter
    if (filters.availability && filters.availability !== 'all') {
      if (w.availability !== filters.availability) return false;
    }

    // Live Search Filter (debounced from UI)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = w.name.toLowerCase().includes(q);
      const matchSub = (w.subtitle || '').toLowerCase().includes(q);
      const matchCol = (w.collection || '').toLowerCase().includes(q);
      const matchMovement = (w.specs?.movement || '').toLowerCase().includes(q);
      const matchMat = (w.specs?.case_material || '').toLowerCase().includes(q);
      const matchRef = (w.specs?.reference || '').toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchCol && !matchMovement && !matchMat && !matchRef) {
        return false;
      }
    }

    return true;
  });
}

export async function fetchWatchBySlug(slug: string): Promise<WatchModel | null> {
  const all = await fetchWatches(undefined, true);
  const found = all.find((w) => w.slug === slug || w.id === slug);
  return found || null;
}

export async function updateWatchStock(id: string, newStock: number): Promise<WatchModel | null> {
  const stock = Math.max(0, newStock);
  const status = stock === 0 ? 'sold_out' : stock <= 5 ? 'limited' : 'available';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('watches')
        .update({ stock, status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return formatWatchModel(data);
      }
    } catch (err) {
      console.warn('Supabase updateWatchStock error, saving locally:', err);
    }
  }

  const local = getLocalWatches();
  const index = local.findIndex((w) => w.id === id);
  if (index !== -1) {
    local[index] = {
      ...local[index],
      stock,
      status,
      updated_at: new Date().toISOString(),
    };
    saveLocalWatches(local);
    const updated = formatWatchModel(local[index]);
    broadcastLocalTableChange('watches', 'UPDATE', updated);
    return updated;
  }
  return null;
}

export async function createWatch(
  watchData: Omit<DbWatch, 'id' | 'created_at' | 'updated_at'>,
  images?: Omit<DbWatchImage, 'id' | 'watch_id' | 'created_at'>[],
  specs?: Omit<DbWatchSpecs, 'id' | 'watch_id' | 'created_at'>
): Promise<WatchModel> {
  const newId = `w-ora-${Date.now()}`;
  const now = new Date().toISOString();

  const formattedImages: DbWatchImage[] = (images || []).map((img, idx) => ({
    id: `img-${Date.now()}-${idx}`,
    watch_id: newId,
    image_url: img.image_url,
    image_type: img.image_type,
    sort_order: img.sort_order ?? idx,
  }));

  const formattedSpecs: DbWatchSpecs = specs
    ? {
        ...specs,
        id: `spec-${Date.now()}`,
        watch_id: newId,
      }
    : {
        id: `spec-${Date.now()}`,
        watch_id: newId,
        reference: `REF. 900-${Math.floor(100 + Math.random() * 899)}`,
        case_material: 'Grade 5 Titanium',
        diameter: '41.0 mm',
        thickness: '9.8 mm',
        movement: 'Manufacture Calibre 900 Automatic',
        frequency: '28,800 vph (4.0 Hz)',
        jewels: '33 Synthetic Rubies',
        power_reserve: '72 Hours',
        water_resistance: '100 Meters / 10 ATM',
        crystal: 'Domed sapphire crystal',
        strap: 'Swiss calfskin leather',
        clasp: 'Titanium deployant buckle',
        finishing: 'Hand-drawn Côtes de Genève',
      };

  const newWatch: DbWatch = {
    ...watchData,
    id: newId,
    created_at: now,
    updated_at: now,
    images: formattedImages,
    specs: formattedSpecs,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('watches').insert(newWatch);
    } catch (err) {
      console.warn('Supabase createWatch insert error:', err);
    }
  }

  const local = getLocalWatches();
  local.unshift(newWatch);
  saveLocalWatches(local);

  const model = formatWatchModel(newWatch);
  broadcastLocalTableChange('watches', 'INSERT', model);
  return model;
}

export async function updateWatch(id: string, updates: Partial<DbWatch>): Promise<WatchModel | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('watches')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return formatWatchModel(data);
    } catch (err) {
      console.warn('Supabase updateWatch error, updating locally:', err);
    }
  }

  const local = getLocalWatches();
  const index = local.findIndex((w) => w.id === id);
  if (index !== -1) {
    local[index] = {
      ...local[index],
      ...updates,
      updated_at: now,
    };
    saveLocalWatches(local);
    const updated = formatWatchModel(local[index]);
    broadcastLocalTableChange('watches', 'UPDATE', updated);
    return updated;
  }
  return null;
}

export async function deleteWatch(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('watches').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  const local = getLocalWatches();
  const filtered = local.filter((w) => w.id !== id);
  saveLocalWatches(filtered);
  broadcastLocalTableChange('watches', 'DELETE', { id });
  return true;
}

export function subscribeToWatches(callback: () => void) {
  if (isSupabaseConfigured && supabase) {
    const channel = supabase
      .channel('watches_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'watches' }, () => {
        callback();
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }

  return subscribeToLocalTable('watches', () => {
    callback();
  });
}
