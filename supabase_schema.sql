-- ==============================================================================
-- THE PODI FACTORY - SUPABASE DATABASE SETUP & SEED SCRIPT
-- Copy and run this entire script in your Supabase SQL Editor (supabase.com -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create PODIS table
create table if not exists public.podis (
  id text primary key,
  name text not null,
  telugu_name text,
  tagline text,
  description text,
  price numeric not null,
  original_price numeric,
  weights jsonb not null default '[]'::jsonb,
  spiciness int default 2,
  image text not null,
  category text not null,
  ingredients text[] default '{}',
  health_benefits text[] default '{}',
  serving_suggestions text[] default '{}',
  in_stock boolean default true,
  badge text,
  is_featured boolean default false,
  display_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create STORE_SETTINGS table
create table if not exists public.store_settings (
  id text primary key default 'main',
  store_name text not null default 'The Podi Factory',
  tagline text default 'Hand-pounded. Sun-dried. Andhra''s soul.',
  whatsapp_number text not null default '+919876543210',
  instagram_handle text default 'thepodifactory',
  email text default 'orders@thepodifactory.com',
  phone text default '+91 98765 43210',
  address text default 'Artisanal Batch Kitchen, Guntur & Hyderabad, India',
  announcement text default '🌿 Small-batch fresh harvest podis now shipping across India! Free delivery on orders over ₹799',
  upi_id text default 'thepodifactory@okaxis',
  currency_symbol text default '₹',
  theme_config jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS)
alter table public.podis enable row level security;
alter table public.store_settings enable row level security;

-- 4. Create Security Policies: Public Read for Catalog, Authenticated Write for Logged-in Admin
drop policy if exists "Public podis are viewable by everyone" on public.podis;
create policy "Public podis are viewable by everyone" on public.podis
  for select using (true);

drop policy if exists "Enable insert for podis" on public.podis;
create policy "Enable insert for podis" on public.podis
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update for podis" on public.podis;
create policy "Enable update for podis" on public.podis
  for update using (auth.role() = 'authenticated');

drop policy if exists "Enable delete for podis" on public.podis;
create policy "Enable delete for podis" on public.podis
  for delete using (auth.role() = 'authenticated');

drop policy if exists "Public store settings are viewable by everyone" on public.store_settings;
create policy "Public store settings are viewable by everyone" on public.store_settings
  for select using (true);

drop policy if exists "Enable insert/update for store settings" on public.store_settings;
create policy "Enable insert/update for store settings" on public.store_settings
  for all using (auth.role() = 'authenticated');

-- 5. Enable Realtime Publications for instant cross-device updates
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.podis;
alter publication supabase_realtime add table public.store_settings;

-- 6. Create Storage Bucket for Podi Images (if storage extension is available)
insert into storage.buckets (id, name, public)
values ('podi-images', 'podi-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access for podi-images bucket" on storage.objects;
create policy "Public Access for podi-images bucket" on storage.objects
  for select using (bucket_id = 'podi-images');

drop policy if exists "Public Upload for podi-images bucket" on storage.objects;
create policy "Public Upload for podi-images bucket" on storage.objects
  for insert with check (bucket_id = 'podi-images');

drop policy if exists "Public Update for podi-images bucket" on storage.objects;
create policy "Public Update for podi-images bucket" on storage.objects
  for update using (bucket_id = 'podi-images');

-- 7. Seed Initial Podis Data
insert into public.podis (id, name, telugu_name, tagline, description, price, original_price, weights, spiciness, image, category, ingredients, health_benefits, serving_suggestions, in_stock, badge, is_featured, display_order)
values
  (
    'munagaku-karam',
    'Munagaku Karam',
    'మునగాకు కారం (Moringa Podi)',
    'Drumstick leaves with bold spices',
    'Our crown jewel. Hand-picked organic drumstick (Moringa) leaves sun-dried to lock in vital iron and antioxidants, slow-roasted with Guntur red chillies, garlic cloves, cumin, and roasted chana dal in stone mortar.',
    299,
    349,
    '[{"label":"100g Pouch","grams":100,"price":160},{"label":"200g Jar","grams":200,"price":299},{"label":"500g Value Pack","grams":500,"price":680}]'::jsonb,
    2,
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    'leafy',
    array['Sun-dried Moringa Leaves', 'Guntur Red Chillies', 'Roasted Chana Dal', 'Urad Dal', 'Garlic', 'Cumin Seeds', 'Rock Salt', 'Hing (Asafoetida)'],
    array['Rich in Iron & Calcium', 'Boosts natural immunity & stamina', 'Supports healthy digestion & metabolism'],
    array['Hot steamed rice with a dollop of pure A2 Desi Ghee', 'Drizzled on crispy Ghee Podi Dosa', 'Sprinkled over hot fluffy Idlis'],
    true,
    'Bestseller',
    true,
    1
  ),
  (
    'karivepaku-karam',
    'Karivepaku Karam',
    'కరివేపాకు కారం (Curry Leaf Podi)',
    'Aromatic tender curry leaves & roasted lentils',
    'Fresh country curry leaves washed, sun-dehydrated, and stone-pounded with coriander seeds, black peppercorns, roasted lentils, and tamarind for an unmistakable earthy aroma and vibrant flavor punch.',
    279,
    320,
    '[{"label":"100g Pouch","grams":100,"price":150},{"label":"200g Jar","grams":200,"price":279},{"label":"500g Value Pack","grams":500,"price":640}]'::jsonb,
    2,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    'leafy',
    array['Farm-fresh Curry Leaves', 'Byadgi & Guntur Chillies', 'Toor Dal', 'Chana Dal', 'Coriander Seeds', 'Cumin', 'Tamarind', 'Hing'],
    array['Renowned for hair vitality & scalp health', 'Packed with Vitamin A and Beta-carotene', 'Aids cholesterol management'],
    array['Mix with piping hot rice and melted butter or ghee', 'Pair with curd rice for soothing digestif', 'Dust over fried potatoes or roasted paneer'],
    true,
    'Artisanal',
    true,
    2
  ),
  (
    'kandi-podi',
    'Kandi Podi (Gun Powder)',
    'కంది పొడి (Paruppu Podi)',
    'Classic roasted toor dal & fiery Guntur chillies',
    'The definitive soul of every Andhra kitchen. High-grade country Toor dal slow roasted on low flame with cumin, black pepper, and whole red chillies, pounded to a coarse golden texture.',
    249,
    280,
    '[{"label":"100g Pouch","grams":100,"price":130},{"label":"200g Jar","grams":200,"price":249},{"label":"500g Value Pack","grams":500,"price":580}]'::jsonb,
    2,
    'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    'lentils',
    array['Roasted Toor Dal', 'Roasted Chana Dal', 'Red Chillies', 'Cumin', 'Black Peppercorns', 'Rock Salt', 'Hing'],
    array['High plant-based protein', 'Easy on the gut with cumin and pepper', 'Zero artificial additives or preservatives'],
    array['The quintessential first bite of Andhra Bhojanam with hot rice & ghee', 'Classic Podi Idli tossing with sesame oil', 'Coating for Uttapam'],
    true,
    'Classic Favorite',
    true,
    3
  ),
  (
    'nalla-karam',
    'Nalla Karam',
    'నల్ల కారం (Traditional Black Podi)',
    'Dark roasted spices, whole garlic & tamarind',
    'A deep, complex, smoky spiced powder roasted until dark maroon-black. Made with unpeeled roasted garlic pods, whole dried red chillies, coriander seeds, and tangy country tamarind.',
    289,
    330,
    '[{"label":"100g Pouch","grams":100,"price":155},{"label":"200g Jar","grams":200,"price":289},{"label":"500g Value Pack","grams":500,"price":660}]'::jsonb,
    3,
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    'traditional',
    array['Whole Dried Red Chillies', 'Unpeeled Mountain Garlic', 'Coriander Seeds', 'Cumin Seeds', 'Country Tamarind', 'Rock Salt'],
    array['Garlic allicin benefits cardiovascular health', 'Warm pungent spices clear sinus & cold', 'Boosts salivary enzymes and appetite'],
    array['Hot Dibba Rotti (Thick Andhra Dosa)', 'Steamed Rice with Ghee', 'Pesarattu (Green Gram Dosa)'],
    true,
    'Fiery Soul',
    true,
    4
  ),
  (
    'vellulli-karam',
    'Vellulli Karam',
    'వెల్లుల్లి కారం (Stone-ground Garlic Podi)',
    'Pungent mountain garlic & sun-kissed red chillies',
    'Crushed garlic cloves pounded raw and gently tempered with sun-dried red chillies and cumin. Intense, heartwarming aroma that awakens the palate in a single spoonful.',
    269,
    300,
    '[{"label":"100g Pouch","grams":100,"price":145},{"label":"200g Jar","grams":200,"price":269},{"label":"500g Value Pack","grams":500,"price":620}]'::jsonb,
    3,
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    'traditional',
    array['Fresh Desi Garlic', 'Sun-dried Guntur Chillies', 'Cumin', 'Rock Salt', 'Pressed Groundnut Oil droplet'],
    array['Natural anti-bacterial and immunity booster', 'Supports blood pressure balance', 'Comfort food during monsoon & winter'],
    array['Ghee Roast Dosa', 'Mixed with hot rice & raw onion', 'Seasoning on roasted cashews and peanuts'],
    true,
    'Must Try',
    false,
    5
  ),
  (
    'kakarakaya-karam',
    'Kakarakaya Karam',
    'కాకరకాయ కారం (Crispy Bittergourd Podi)',
    'Crispy sun-dried bittergourd with tangy spiced magic',
    'Thinly sliced bittergourd sun-dried till crisp and pounded with roasted lentils, jaggery hint, and spices. Turns bitter gourd into an irresistible culinary masterpiece even kids adore.',
    299,
    350,
    '[{"label":"100g Pouch","grams":100,"price":165},{"label":"200g Jar","grams":200,"price":299},{"label":"500g Value Pack","grams":500,"price":690}]'::jsonb,
    2,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    'traditional',
    array['Sun-dried Bittergourd slices', 'Chana Dal', 'Urad Dal', 'Red Chillies', 'Organic Jaggery pinch', 'Garlic', 'Tamarind'],
    array['Supports healthy blood sugar balance', 'Purifies blood and detoxifies', 'No bitter aftertaste due to secret blend'],
    array['Hot rice with ghee', 'Side accompaniment with Sambar & Rasam rice'],
    true,
    'Superfood',
    false,
    6
  ),
  (
    'palli-karam',
    'Palli Karam (Peanut Podi)',
    'పల్లీ కారం (Nutty Roasted Peanut Podi)',
    'Stone-roasted groundnuts with cumin & garlic',
    'Country groundnuts dry-roasted in mud pots, lightly crushed and blended with red chillies, garlic, and cumin. Rich, nutty, crunchy, and packed with wholesome goodness.',
    249,
    290,
    '[{"label":"100g Pouch","grams":100,"price":135},{"label":"200g Jar","grams":200,"price":249},{"label":"500g Value Pack","grams":500,"price":570}]'::jsonb,
    1,
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    'lentils',
    array['Dry Roasted Peanuts', 'Whole Red Chillies', 'Garlic', 'Cumin Seeds', 'Pink Rock Salt'],
    array['Rich in heart-healthy fats & protein', 'Great energy snack booster', 'Kid-friendly mild spice profile'],
    array['Warm Chapati roll with ghee & podi', 'Sprinkled over warm Upma or Poha', 'Hot Idlis'],
    true,
    'Nutty & Rich',
    false,
    7
  ),
  (
    'andhra-heritage-trio-box',
    'Andhra Heritage Trio Box',
    'ఆంధ్ర హెరిటేజ్ బాక్స్ (Gift Box)',
    'Munagaku Karam + Karivepaku Karam + Kandi Podi (200g each)',
    'Our top 3 flagship podis packed in a beautiful artisanal gift box with a handcrafted wooden spoon and recipe pairing booklet. The ultimate gift of authentic Andhra flavors.',
    799,
    899,
    '[{"label":"3 x 200g Jars Set","grams":600,"price":799},{"label":"3 x 500g Family Pack","grams":1500,"price":1850}]'::jsonb,
    2,
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    'combos',
    array['Contains 1 jar of Munagaku Karam, 1 jar of Karivepaku Karam, 1 jar of Kandi Podi'],
    array['Complete spectrum of vitamins, iron, and proteins', 'Zero artificial colors, zero chemical preservatives'],
    array['Ideal gift for food lovers, NRI families, and festive occasions'],
    true,
    'Best Value',
    true,
    8
  )
on conflict (id) do nothing;

-- 8. Seed Initial Store Settings
insert into public.store_settings (id, store_name, tagline, whatsapp_number, instagram_handle, email, phone, address, announcement, upi_id, currency_symbol)
values (
  'main',
  'The Podi Factory',
  'Hand-pounded. Sun-dried. Andhra''s soul.',
  '+919876543210',
  'thepodifactory',
  'orders@thepodifactory.com',
  '+91 98765 43210',
  'Artisanal Batch Kitchen, Guntur & Hyderabad, India',
  '🌿 Small-batch fresh harvest podis now shipping across India! Free delivery on orders over ₹799',
  'thepodifactory@okaxis',
  '₹'
)
on conflict (id) do nothing;
