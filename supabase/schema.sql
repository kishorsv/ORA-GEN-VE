-- ==============================================================================
-- ORA GENÈVE — SUPABASE DATABASE SCHEMA & POLICIES
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. COLLECTIONS TABLE
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. WATCHES TABLE
create table if not exists public.watches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  collection_id uuid references public.collections(id) on delete set null,
  tagline text,
  subtitle text,
  description text not null,
  price numeric(12, 2) not null default 0,
  price_chf numeric(12, 2) not null default 0,
  currency text default 'USD',
  stock integer default 5,
  status text default 'available' check (status in ('available', 'limited', 'sold_out', 'coming_soon')),
  is_active boolean default true,
  hero_image text not null,
  movement_image text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. WATCH IMAGES TABLE
create table if not exists public.watch_images (
  id uuid primary key default uuid_generate_v4(),
  watch_id uuid references public.watches(id) on delete cascade not null,
  image_url text not null,
  image_type text not null check (image_type in ('hero', 'front', 'side', 'back', 'movement', 'dial', 'strap', 'lifestyle')),
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. WATCH SPECS TABLE
create table if not exists public.watch_specs (
  id uuid primary key default uuid_generate_v4(),
  watch_id uuid unique references public.watches(id) on delete cascade not null,
  reference text not null,
  case_material text not null,
  diameter text not null,
  thickness text not null,
  movement text not null,
  frequency text not null,
  jewels text not null,
  power_reserve text not null,
  water_resistance text not null,
  crystal text not null,
  strap text not null,
  clasp text not null,
  finishing text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. INQUIRIES TABLE
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  watch_id uuid references public.watches(id) on delete set null,
  watch_name text not null,
  reference_code text unique not null,
  client_name text not null,
  email text not null,
  phone text,
  location text default 'Geneva',
  bespoke_engraving text,
  message text,
  status text default 'pending' check (status in ('pending', 'contacted', 'allocated', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id text primary key default 'global_settings',
  hero_title text default 'ORA GENÈVE',
  hero_subtitle text default 'HAUTE HORLOGERIE SUISSE',
  hero_tagline text default 'PRECISION CRAFTED IN TIME',
  announcement_active boolean default true,
  announcement_text text default 'PRIVATE VIEWING BY APPOINTMENT — SALON GENÈVE · RUE DU RHÔNE 42',
  featured_watch_id uuid references public.watches(id) on delete set null,
  collections_visible boolean default true,
  contact_email text default 'concierge@ora-geneve.ch',
  contact_phone text default '+41 22 819 00 00',
  contact_address text default 'Rue du Rhône 42, 1204 Genève, Switzerland',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. FAVORITES TABLE
create table if not exists public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  watch_id uuid references public.watches(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, watch_id)
);

-- 9. ROW LEVEL SECURITY (RLS)
alter table public.collections enable row level security;
alter table public.watches enable row level security;
alter table public.watch_images enable row level security;
alter table public.watch_specs enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.favorites enable row level security;

-- Public READ policies
create policy "Allow public read of collections" on public.collections for select using (true);
create policy "Allow public read of active watches" on public.watches for select using (is_active = true or auth.role() = 'authenticated');
create policy "Allow public read of watch images" on public.watch_images for select using (true);
create policy "Allow public read of watch specs" on public.watch_specs for select using (true);
create policy "Allow public read of site settings" on public.site_settings for select using (true);

-- Public INSERT for inquiries
create policy "Allow public create inquiries" on public.inquiries for insert with check (true);

-- Authenticated (Admin) FULL ACCESS policies
create policy "Allow authenticated admin full access to collections" on public.collections for all using (auth.role() = 'authenticated');
create policy "Allow authenticated admin full access to watches" on public.watches for all using (auth.role() = 'authenticated');
create policy "Allow authenticated admin full access to watch images" on public.watch_images for all using (auth.role() = 'authenticated');
create policy "Allow authenticated admin full access to watch specs" on public.watch_specs for all using (auth.role() = 'authenticated');
create policy "Allow authenticated admin full access to inquiries" on public.inquiries for all using (auth.role() = 'authenticated');
create policy "Allow authenticated admin full access to site settings" on public.site_settings for all using (auth.role() = 'authenticated');

-- User Favorites Policies
create policy "Allow users to read their own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Allow users to insert their own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Allow users to delete their own favorites" on public.favorites for delete using (auth.uid() = user_id);

-- 10. REALTIME CONFIGURATION
alter publication supabase_realtime add table public.watches;
alter publication supabase_realtime add table public.inquiries;
alter publication supabase_realtime add table public.site_settings;
