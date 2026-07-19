-- Table des vendeurs (en plus du compte auth Supabase de base)
create table sellers (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  stripe_connect_account_id text,          -- compte Stripe Connect du vendeur
  stripe_customer_id text,                 -- pour son abonnement d'hébergement
  stripe_subscription_id text,
  subscription_status text default 'inactive', -- active / inactive / past_due
  created_at timestamptz default now()
);

-- Table des ebooks
create table ebooks (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers(id) on delete cascade,
  title text not null,
  description text,
  price_cents integer not null,            -- prix en centimes
  cover_url text,
  file_path text not null,                 -- chemin dans le bucket 'ebooks'
  published boolean default true,
  created_at timestamptz default now()
);

-- Table des achats
create table purchases (
  id uuid primary key default gen_random_uuid(),
  ebook_id uuid references ebooks(id),
  buyer_email text not null,
  stripe_checkout_session_id text unique,
  status text default 'pending',           -- pending / paid
  created_at timestamptz default now()
);

-- RLS (row level security) de base
alter table sellers enable row level security;
alter table ebooks enable row level security;
alter table purchases enable row level security;

-- Un vendeur ne voit/modifie que sa propre ligne
create policy "sellers view own" on sellers
  for select using (auth.uid() = id);
create policy "sellers update own" on sellers
  for update using (auth.uid() = id);

-- Les ebooks publiés sont visibles par tout le monde
create policy "ebooks public read" on ebooks
  for select using (published = true);
create policy "sellers manage own ebooks" on ebooks
  for all using (auth.uid() = seller_id);
