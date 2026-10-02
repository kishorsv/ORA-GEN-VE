export type WatchAvailability = 'AVAILABLE' | 'LIMITED AVAILABILITY' | 'SOLD OUT' | 'COMING SOON';

export type WatchStatus = 'available' | 'limited' | 'sold_out' | 'coming_soon';

export type ImageType = 'hero' | 'front' | 'side' | 'back' | 'movement' | 'dial' | 'strap' | 'lifestyle';

export interface DbWatchImage {
  id: string;
  watch_id: string;
  image_url: string;
  image_type: ImageType;
  sort_order: number;
}

export interface DbWatchSpecs {
  id: string;
  watch_id: string;
  reference: string;
  case_material: string;
  diameter: string;
  thickness: string;
  movement: string;
  frequency: string;
  jewels: string;
  power_reserve: string;
  water_resistance: string;
  crystal: string;
  strap: string;
  clasp: string;
  finishing: string;
}

export interface DbCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
}

export interface DbWatch {
  id: string;
  name: string;
  slug: string;
  collection_id?: string;
  collection?: string;
  tagline?: string;
  subtitle?: string;
  description: string;
  price: number;
  price_chf: number;
  currency: string;
  stock: number;
  status: WatchStatus;
  is_active: boolean;
  hero_image: string;
  movement_image: string;
  created_at: string;
  updated_at: string;
  images?: DbWatchImage[];
  specs?: DbWatchSpecs;
}

export interface WatchModel extends DbWatch {
  availability: WatchAvailability;
  formattedPrice: string;
  formattedPriceCHF: string;
}

export interface DbInquiry {
  id: string;
  watch_id?: string;
  watch_name: string;
  reference_code: string;
  client_name: string;
  email: string;
  phone?: string;
  location: string;
  bespoke_engraving?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'allocated' | 'archived';
  created_at: string;
}

export interface DbSiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  announcement_active: boolean;
  announcement_text: string;
  featured_watch_id?: string;
  collections_visible: boolean;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  updated_at: string;
}

export interface WatchFilters {
  collection?: string;
  movement?: string;
  caseMaterial?: string;
  availability?: string;
  searchQuery?: string;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'newest';
}
