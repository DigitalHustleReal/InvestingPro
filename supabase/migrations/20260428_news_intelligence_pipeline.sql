-- News Intelligence Pipeline: 3 new tables
-- Run in Supabase SQL editor

-- ── 1. news_sources ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_sources (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  type             text NOT NULL CHECK (type IN ('rss', 'price_poll', 'scrape')),
  url              text NOT NULL,
  category_tags    text[] NOT NULL DEFAULT '{}',
  base_importance  integer NOT NULL DEFAULT 5 CHECK (base_importance BETWEEN 1 AND 10),
  poll_interval_m  integer NOT NULL DEFAULT 15,
  active           boolean NOT NULL DEFAULT true,
  last_polled_at   timestamptz,
  last_item_hash   text,
  error_count      integer NOT NULL DEFAULT 0,
  last_error       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_sources_active ON news_sources(active, type, last_polled_at);

-- ── 2. news_events ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id        uuid REFERENCES news_sources(id) ON DELETE SET NULL,
  source_name      text NOT NULL,
  source_url       text NOT NULL,
  headline         text NOT NULL,
  summary          text,
  raw_content      text,
  category         text NOT NULL,
  importance_score numeric(4,1) NOT NULL DEFAULT 5,
  item_url         text,

  -- Spike signals
  trends_spike     boolean NOT NULL DEFAULT false,
  gsc_spike        boolean NOT NULL DEFAULT false,
  internal_spike   boolean NOT NULL DEFAULT false,
  spike_count      integer GENERATED ALWAYS AS (
                     trends_spike::int + gsc_spike::int + internal_spike::int
                   ) STORED,
  serp_credit_used boolean NOT NULL DEFAULT false,
  serp_context     jsonb,

  -- Pipeline state
  status           text NOT NULL DEFAULT 'detected'
                   CHECK (status IN (
                     'detected','screening','analyzing',
                     'writing','editing','publishing','published','skipped'
                   )),
  skip_reason      text,
  retry_count      integer NOT NULL DEFAULT 0,
  article_id       uuid REFERENCES articles(id) ON DELETE SET NULL,

  -- Timing
  detected_at      timestamptz NOT NULL DEFAULT now(),
  screening_at     timestamptz,
  analysis_at      timestamptz,
  writing_at       timestamptz,
  editing_at       timestamptz,
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_events_status ON news_events(status, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_events_category ON news_events(category, importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_news_events_article ON news_events(article_id) WHERE article_id IS NOT NULL;

-- Duplicate guard: same source + same headline within same UTC day
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_events_dedup
  ON news_events(source_id, md5(headline), date_trunc('day', detected_at));

-- ── 3. serp_credit_ledger ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS serp_credit_ledger (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date         date NOT NULL DEFAULT current_date UNIQUE,
  daily_budget integer NOT NULL DEFAULT 10,
  news_used    integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budget_not_exceeded CHECK (news_used <= daily_budget)
);

-- ── Helper functions ───────────────────────────────────────────────────────

-- Increment source error count, auto-disable after 5 consecutive errors
CREATE OR REPLACE FUNCTION increment_source_error(source_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE news_sources
  SET
    error_count = error_count + 1,
    active = CASE WHEN error_count + 1 >= 5 THEN false ELSE active END,
    updated_at = now()
  WHERE id = source_id;
END;
$$;

-- Atomically consume one SERP credit (returns true if successful)
CREATE OR REPLACE FUNCTION consume_serp_credit(target_date date)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  updated_rows int;
BEGIN
  -- Ensure row exists first
  INSERT INTO serp_credit_ledger (date) VALUES (target_date) ON CONFLICT (date) DO NOTHING;

  UPDATE serp_credit_ledger
  SET news_used = news_used + 1, updated_at = now()
  WHERE date = target_date AND news_used < daily_budget;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$;

-- ── Seed sources (14 sources covering all personal finance verticals) ───────
INSERT INTO news_sources (name, type, url, category_tags, base_importance, poll_interval_m) VALUES
-- Government / Regulatory (highest importance)
('PIB Finance Ministry', 'rss', 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
  ARRAY['budget','tax_change','da_announcement','pay_commission','pension','epfo'], 8, 15),
('PIB Labour Ministry', 'rss', 'https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1&Regid=3',
  ARRAY['epf','esic','gratuity','employment','da_announcement'], 7, 15),
('RBI Press Releases', 'rss', 'https://www.rbi.org.in/scripts/RSS.aspx',
  ARRAY['repo_rate','banking','monetary_policy','nbfc','forex'], 9, 15),
('SEBI Circulars', 'rss', 'https://www.sebi.gov.in/sebi_data/rss/sebi_latest_news.xml',
  ARRAY['mutual_fund','securities','ipo','demat','markets'], 8, 15),
('IRDAI News', 'rss', 'https://irdai.gov.in/web/guest/-/important-circulars',
  ARRAY['insurance','health_insurance','term_insurance'], 7, 30),
-- Financial news (medium importance)
('Economic Times Markets', 'rss', 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  ARRAY['general_finance','markets','banking'], 6, 15),
('NDTV Profit', 'rss', 'https://feeds.feedburner.com/ndtvprofit-latest',
  ARRAY['general_finance','markets','banking'], 5, 15),
('Moneycontrol Economy', 'rss', 'https://www.moneycontrol.com/rss/economy.xml',
  ARRAY['general_finance','tax_change','banking'], 5, 15),
('Livemint Money', 'rss', 'https://www.livemint.com/rss/money',
  ARRAY['general_finance','markets','mutual_fund'], 5, 15),
('Business Standard Economy', 'rss', 'https://www.business-standard.com/rss/economy-policy-10205.rss',
  ARRAY['general_finance','banking','monetary_policy'], 5, 15),
-- Price polls (commodity prices)
('NSE Indices', 'price_poll', 'https://www.nseindia.com/api/allIndices',
  ARRAY['markets','nifty','sensex'], 5, 30),
('USD/INR Exchange Rate', 'price_poll', 'https://open.er-api.com/v6/latest/USD',
  ARRAY['forex','general_finance'], 4, 60),
-- Additional coverage
('PIB Commerce Ministry', 'rss', 'https://pib.gov.in/RssMain.aspx?ModId=13&Lang=1&Regid=3',
  ARRAY['gold','silver','import_duty','trade'], 6, 30),
('Finance Ministry Twitter/Press', 'rss', 'https://pib.gov.in/RssMain.aspx?ModId=2&Lang=1&Regid=3',
  ARRAY['budget','tax_change','general_finance'], 7, 15)
ON CONFLICT DO NOTHING;
