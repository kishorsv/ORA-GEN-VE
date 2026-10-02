import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type StorageBucket = 'watch-images' | 'movement-images' | 'craftsmanship-images' | 'site-assets';

export async function uploadImageFile(file: File, bucket: StorageBucket = 'watch-images'): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, creating local object URL:', err);
    }
  }

  // Fallback to FileReader Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  });
}
