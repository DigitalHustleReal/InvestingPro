-- Create IPOs Table
create table public.ipos (
  id uuid not null default gen_random_uuid (),
  symbol text not null,
  name text not null,
  open_date timestamp with time zone null,
  close_date timestamp with time zone null,
  listing_date timestamp with time zone null,
  price_band_low numeric null,
  price_band_high numeric null,
  lot_size integer null,
  issue_size numeric null, -- in Crores
  status text not null default 'upcoming', -- upcoming, open, closed, listed
  gmp numeric null, -- Grey Market Premium
  gmp_updated_at timestamp with time zone null,
  subscription_rate numeric null, -- Overall subscription (e.g. 15.5x)
  logo_url text null,
  drhp_link text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null default now(),
  constraint ipos_pkey primary key (id),
  constraint ipos_symbol_key unique (symbol)
);

-- Create Brokers Table (for Affiliate Links)
create table public.brokers (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  name text not null,
  logo_url text null,
  rating numeric null,
  review_count integer default 0,
  min_brokerage numeric default 0,
  features jsonb null, -- e.g. ["Free API", "Zero AMC"]
  pros text[] null,
  cons text[] null,
  affiliate_link text null,
  is_active boolean default true,
  created_at timestamp with time zone not null default now(),
  constraint brokers_pkey primary key (id),
  constraint brokers_slug_key unique (slug)
);

-- Rates table already exists in 20260125000000_create_rates_table.sql
-- Skipping re-creation to avoid 42P07 error.

-- Enable RLS
alter table public.ipos enable row level security;
alter table public.brokers enable row level security;
-- alter table public.rates enable row level security; -- Already done

-- Policies (Public Read, Admin Write)
create policy "Enable read access for all users" on public.ipos as permissive for select to public using (true);
create policy "Enable read access for all users" on public.brokers as permissive for select to public using (true);
-- create policy "Enable read access for all users" on public.rates as permissive for select to public using (true); -- Already done

-- Realtime
alter publication supabase_realtime add table public.ipos;
-- alter publication supabase_realtime add table public.rates; -- Already done
