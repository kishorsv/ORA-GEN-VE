import { supabase, isSupabaseConfigured, subscribeToLocalTable, broadcastLocalTableChange } from '../lib/supabase';
import type { DbInquiry } from '../types/database';
import { SEED_INQUIRIES } from '../data/seedData';

const LOCAL_INQUIRIES_KEY = 'ora_inquiries_db_v2';

function getLocalInquiries(): DbInquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading local inquiries', err);
  }
  localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(SEED_INQUIRIES));
  return SEED_INQUIRIES;
}

function saveLocalInquiries(inquiries: DbInquiry[]) {
  try {
    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Error saving local inquiries', err);
  }
}

export async function createInquiry(data: Omit<DbInquiry, 'id' | 'reference_code' | 'created_at' | 'status'>): Promise<DbInquiry> {
  const id = `inq-${Date.now()}`;
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const refCode = `ORA-ALLOC-${randomSuffix}`;
  const now = new Date().toISOString();

  const newInquiry: DbInquiry = {
    ...data,
    id,
    reference_code: refCode,
    status: 'pending',
    created_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbData, error } = await supabase.from('inquiries').insert(newInquiry).select().single();
      if (!error && dbData) return dbData;
    } catch (err) {
      console.warn('Supabase createInquiry error, saving locally:', err);
    }
  }

  const local = getLocalInquiries();
  local.unshift(newInquiry);
  saveLocalInquiries(local);
  broadcastLocalTableChange('inquiries', 'INSERT', newInquiry);
  return newInquiry;
}

export async function fetchInquiries(): Promise<DbInquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetchInquiries error, using local fallback:', err);
    }
  }

  return getLocalInquiries();
}

export async function updateInquiryStatus(id: string, status: DbInquiry['status']): Promise<DbInquiry | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('inquiries').update({ status }).eq('id', id).select().single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase updateInquiryStatus error, saving locally:', err);
    }
  }

  const local = getLocalInquiries();
  const index = local.findIndex((i) => i.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], status };
    saveLocalInquiries(local);
    broadcastLocalTableChange('inquiries', 'UPDATE', local[index]);
    return local[index];
  }
  return null;
}

export function subscribeToInquiries(callback: () => void) {
  if (isSupabaseConfigured && supabase) {
    const channel = supabase
      .channel('inquiries_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        callback();
      })
      .subscribe();
    return () => {
      supabase?.removeChannel(channel);
    };
  }

  return subscribeToLocalTable('inquiries', () => {
    callback();
  });
}
