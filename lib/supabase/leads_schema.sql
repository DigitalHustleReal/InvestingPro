-- LOANS TABLE
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Personal', 'Home', 'Car'
  interest_rate_min NUMERIC,
  interest_rate_max NUMERIC,
  processing_fee TEXT,
  min_tenure INTEGER, -- in months
  max_tenure INTEGER, -- in months
  features JSONB DEFAULT '{}'::jsonb,
  apply_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSURANCE TABLE
CREATE TABLE IF NOT EXISTS insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Term', 'Health'
  cover_amount TEXT, -- e.g. "1 Cr"
  min_premium NUMERIC, -- annual/monthly normalized? Let's say Annual for Term
  claim_settlement_ratio NUMERIC, -- e.g. 99.2
  features JSONB DEFAULT '{}'::jsonb,
  apply_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (read-only public)
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Loans" ON loans FOR SELECT USING (true);

ALTER TABLE insurance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Insurance" ON insurance FOR SELECT USING (true);
