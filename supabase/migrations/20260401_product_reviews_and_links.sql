-- Product reviews table (scraped from social media + manual)
CREATE TABLE IF NOT EXISTS product_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid REFERENCES products(id) ON DELETE CASCADE,
  source        text NOT NULL DEFAULT 'manual',  -- 'twitter' | 'reddit' | 'google_play' | 'manual'
  author        text,
  rating        integer CHECK (rating >= 1 AND rating <= 5),
  content       text,
  sentiment     text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  themes        text[] DEFAULT '{}',
  source_url    text,
  is_verified   boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_sentiment ON product_reviews(sentiment);

-- Category interlinking table
CREATE TABLE IF NOT EXISTS category_links (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type     text NOT NULL,    -- 'product' | 'article' | 'glossary' | 'calculator'
  source_id       text NOT NULL,    -- slug or id
  target_type     text NOT NULL,
  target_id       text NOT NULL,
  link_type       text DEFAULT 'related',  -- 'related' | 'mentioned' | 'recommended' | 'see_also'
  relevance_score decimal(3,2) DEFAULT 0.5,
  is_auto         boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_category_links_source ON category_links(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_category_links_target ON category_links(target_type, target_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_category_links_unique ON category_links(source_type, source_id, target_type, target_id);

-- Category to calculator mapping
CREATE TABLE IF NOT EXISTS category_calculator_map (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type    text NOT NULL,
  calculator_slug text NOT NULL,
  relevance       integer DEFAULT 1,  -- 1=primary, 2=secondary
  UNIQUE(product_type, calculator_slug)
);

-- Seed calculator mappings
INSERT INTO category_calculator_map (product_type, calculator_slug, relevance) VALUES
  ('credit_card', 'emi', 1),
  ('credit_card', 'compound-interest', 2),
  ('loan', 'emi', 1),
  ('loan', 'home-loan-vs-sip', 2),
  ('loan', 'simple-interest', 2),
  ('mutual_fund', 'sip', 1),
  ('mutual_fund', 'lumpsum', 1),
  ('mutual_fund', 'goal-planning', 2),
  ('mutual_fund', 'swp', 2),
  ('mutual_fund', 'inflation-adjusted-returns', 2),
  ('fixed_deposit', 'fd', 1),
  ('fixed_deposit', 'rd', 2),
  ('fixed_deposit', 'compound-interest', 2),
  ('insurance', 'tax', 2),
  ('insurance', 'retirement', 2),
  ('ppf_nps', 'ppf', 1),
  ('ppf_nps', 'nps', 1),
  ('ppf_nps', 'retirement', 2),
  ('ppf_nps', 'tax', 2),
  ('demat_account', 'sip', 2),
  ('demat_account', 'lumpsum', 2)
ON CONFLICT DO NOTHING;

-- Email subscribers (for inline product alerts, not popups)
CREATE TABLE IF NOT EXISTS email_subscribers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  product_id    uuid REFERENCES products(id) ON DELETE SET NULL,
  product_type  text,
  alert_type    text DEFAULT 'rate_change',  -- 'rate_change' | 'new_offer' | 'price_drop'
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(email, product_id, alert_type)
);

-- Ensure products table has all needed columns
DO $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'investingpro_score') THEN
    ALTER TABLE products ADD COLUMN investingpro_score decimal(4,1);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'score_breakdown') THEN
    ALTER TABLE products ADD COLUMN score_breakdown jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description') THEN
    ALTER TABLE products ADD COLUMN short_description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'provider_logo') THEN
    ALTER TABLE products ADD COLUMN provider_logo text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'user_rating') THEN
    ALTER TABLE products ADD COLUMN user_rating decimal(3,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
    ALTER TABLE products ADD COLUMN review_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sentiment_score') THEN
    ALTER TABLE products ADD COLUMN sentiment_score decimal(3,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'data_source') THEN
    ALTER TABLE products ADD COLUMN data_source text DEFAULT 'manual';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'last_data_refresh') THEN
    ALTER TABLE products ADD COLUMN last_data_refresh timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'apply_url') THEN
    ALTER TABLE products ADD COLUMN apply_url text;
  END IF;
END $$;
