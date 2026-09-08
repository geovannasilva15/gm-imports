create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  brand text not null,
  category text not null default 'body-splash',
  collection text,
  description text,
  short_description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  volume text,
  stock integer not null default 0,
  sku text unique,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  family text,
  top_notes jsonb not null default '[]'::jsonb,
  heart_notes jsonb not null default '[]'::jsonb,
  base_notes jsonb not null default '[]'::jsonb,
  sweetness integer default 0 check (sweetness between 0 and 100),
  intensity integer default 0 check (intensity between 0 and 100),
  freshness integer default 0 check (freshness between 0 and 100),
  vibe jsonb not null default '[]'::jsonb,
  occasions jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  rating numeric(2,1) default 0,
  is_featured boolean default false,
  is_new boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_method text,
  payment_reference text,
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

create table if not exists favorites (
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);

alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table favorites enable row level security;

create policy "Public can read active products" on products for select using (is_active = true);
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can read own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can read own favorites" on favorites for select using (auth.uid() = user_id);
create policy "Users can manage own favorites" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
