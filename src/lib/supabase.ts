import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize live Supabase client, falling back to local resilient engine:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;

// Realtime Event Emitter for Local and Remote Sync
type RealtimeCallback = (payload: any) => void;
const subscribers: Map<string, Set<RealtimeCallback>> = new Map();

export function subscribeToLocalTable(table: string, callback: RealtimeCallback) {
  if (!subscribers.has(table)) {
    subscribers.set(table, new Set());
  }
  subscribers.get(table)!.add(callback);

  return () => {
    subscribers.get(table)?.delete(callback);
  };
}

export function broadcastLocalTableChange(table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRecord: any, oldRecord?: any) {
  const tableSubscribers = subscribers.get(table);
  if (tableSubscribers) {
    tableSubscribers.forEach((cb) => cb({ eventType, new: newRecord, old: oldRecord }));
  }
}
