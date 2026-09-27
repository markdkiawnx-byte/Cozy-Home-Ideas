-- Cozy Home Ideas database
create extension if not exists pgcrypto;

create table if not exists public.site_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null default '🏡',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  group_name text not null,
  style text not null default 'Cozy',
  budget text not null default '$$',
  time_text text not null default '1 Day',
  rating numeric(2,1) not null default 4.8,
  image_url text not null,
  description text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.site_groups (name, icon, sort_order) values
('Bedrooms','🛏️',1),('Living Rooms','🛋️',2),('Kitchens','🍳',3),('Bathrooms','🛁',4),
('Small Spaces','📏',5),('DIY Makeovers','🔨',6),('Home Office','💻',7),('Outdoor','🌿',8)
on conflict (name) do nothing;

insert into public.posts (title, group_name, style, budget, time_text, rating, image_url, description, tags)
select * from (values
('Warm Minimalist Bedroom','Bedrooms','Minimalist','$$','1 Weekend',4.9,'https://images.unsplash.com/photo-1540932239986-30128078f3ea?auto=format&fit=crop&w=900&q=85','A calm bedroom built around warm neutrals, natural wood, soft lighting and layered bedding.',ARRAY['bedroom','minimalist','cozy']),
('Cozy Reading Corner','Living Rooms','Cozy','$','1 Day',4.8,'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85','Turn an unused corner into a relaxing reading nook with a chair, lamp and soft textures.',ARRAY['living room','cozy','reading']),
('Small Living Room Makeover','Small Spaces','Modern','$$$','2 Weeks',4.7,'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85','Smart furniture placement and multifunctional pieces make a compact living room feel open.',ARRAY['small space','living room','modern']),
('Boho Guest Bedroom','Bedrooms','Boho','$$','1 Weekend',4.8,'https://images.unsplash.com/photo-1552858725-2758b5fb1286?auto=format&fit=crop&w=900&q=85','Rattan textures, earthy colors and relaxed layers create a welcoming guest room.',ARRAY['bedroom','boho']),
('Spa-Like Bathroom Upgrade','Bathrooms','Minimalist','$','1 Day',4.6,'https://images.unsplash.com/photo-1507652313519-d4e9174296bb?auto=format&fit=crop&w=900&q=85','Simple decor swaps and natural materials turn an everyday bathroom into a calming retreat.',ARRAY['bathroom','spa','makeover']),
('Earthy Modern Kitchen','Kitchens','Modern','$$$','3 Weeks',4.9,'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85','Warm hardware, earthy tones and open shelving refresh a hardworking kitchen.',ARRAY['kitchen','modern','makeover']),
('Tiny Home Office Nook','Home Office','Scandinavian','$','1 Day',4.7,'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85','A compact, bright workspace with practical storage and a clean visual footprint.',ARRAY['office','small space','work']),
('Soft Neutral Entryway','Small Spaces','Farmhouse','$$','1 Weekend',4.6,'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85','Make your first impression count with a simple console, baskets, mirror and greenery.',ARRAY['entryway','neutral','decor'])
) as v(title,group_name,style,budget,time_text,rating,image_url,description,tags)
where not exists (select 1 from public.posts);
