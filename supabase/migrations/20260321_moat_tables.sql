-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  INVESTINGPRO MOAT MIGRATION                                     ║
-- ║                                                                  ║
-- ║  Adds proprietary data tables that create competitive moat:      ║
-- ║  - User financial profiles + health scores                       ║
-- ║  - Behavioral event tracking                                     ║
-- ║  - Lead scoring signals                                          ║
-- ║  - Saved portfolios + watchlists                                 ║
-- ║  - Product rate history                                          ║
-- ║  - Multi-touch attribution journeys                              ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ─── 1. User Financial Profiles ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_financial_profiles (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Income
  annual_income         BIGINT,              -- ₹ per year
  monthly_expenses      BIGINT,              -- ₹ per month
  employment_type       TEXT CHECK (employment_type IN ('salaried','self_employed','business','freelance','student','retired')),
  age                   SMALLINT,

  -- Debt
  total_debt            BIGINT DEFAULT 0,
  monthly_emi           BIGINT DEFAULT 0,
  credit_score          SMALLINT,            -- CIBIL / Experian 300-900
  credit_cards_count    SMALLINT DEFAULT 0,
  credit_utilization    DECIMAL(5,2),        -- 0-100%

  -- Assets
  emergency_fund        BIGINT DEFAULT 0,
  total_savings         BIGINT DEFAULT 0,
  total_investments     BIGINT DEFAULT 0,
  monthly_investments   BIGINT DEFAULT 0,    -- regular SIP + investments/mo
  has_term_insurance    BOOLEAN DEFAULT false,
  has_health_insurance  BOOLEAN DEFAULT false,
  has_home              BOOLEAN DEFAULT false,

  -- Goals (stored as JSONB array of strings)
  goals                 JSONB DEFAULT '[]',
  goal_timeline_years   SMALLINT,
  goal_amount           BIGINT,

  -- Preferences
  risk_appetite         SMALLINT CHECK (risk_appetite BETWEEN 1 AND 10),
  dependents            SMALLINT DEFAULT 0,
  has_will              BOOLEAN DEFAULT false,

  -- Computed scores (updated async)
  health_score          SMALLINT,            -- 0-850
  health_score_band     TEXT,
  health_score_computed_at TIMESTAMPTZ,

  -- Metadata
  onboarding_complete   BOOLEAN DEFAULT false,
  onboarding_step       SMALLINT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Index for health score leaderboard / segmentation
CREATE INDEX IF NOT EXISTS idx_ufp_health_score ON user_financial_profiles(health_score DESC);
CREATE INDEX IF NOT EXISTS idx_ufp_user_id ON user_financial_profiles(user_id);

-- RLS
ALTER TABLE user_financial_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own financial profile"
  ON user_financial_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can read all"
  ON user_financial_profiles FOR SELECT USING (auth.role() = 'service_role');

-- ─── 2. Behavioral Events ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS behavioral_events (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id        TEXT NOT NULL,
  event_type        TEXT NOT NULL CHECK (event_type IN (
                      'product_view', 'comparison_viewed', 'affiliate_click',
                      'article_read', 'eligibility_check', 'calculator_used',
                      'apply_page_visited', 'saved_to_watchlist', 'email_opened',
                      'return_visit', 'search_query', 'deep_scroll'
                    )),
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  article_id        UUID,                   -- FK to articles
  category          TEXT,
  page_url          TEXT,
  referrer          TEXT,
  duration_seconds  INTEGER,
  scroll_depth_pct  SMALLINT,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_be_user_id ON behavioral_events(user_id);
CREATE INDEX IF NOT EXISTS idx_be_session_id ON behavioral_events(session_id);
CREATE INDEX IF NOT EXISTS idx_be_event_type ON behavioral_events(event_type);
CREATE INDEX IF NOT EXISTS idx_be_product_id ON behavioral_events(product_id);
CREATE INDEX IF NOT EXISTS idx_be_created_at ON behavioral_events(created_at DESC);

-- No user-readable access — analytics only via service role
ALTER TABLE behavioral_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON behavioral_events FOR ALL USING (auth.role() = 'service_role');
-- Allow insert for authenticated users (client-side tracking)
CREATE POLICY "Authenticated users can insert own events"
  ON behavioral_events FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ─── 3. Lead Scores ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lead_scores (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id        TEXT,
  score             SMALLINT NOT NULL,        -- 0-100
  segment           TEXT NOT NULL CHECK (segment IN ('high_intent','warm','engaged','browser','cold')),
  top_category      TEXT,
  category_scores   JSONB DEFAULT '{}',
  signals_triggered TEXT[] DEFAULT '{}',
  cta_intensity     TEXT CHECK (cta_intensity IN ('soft','medium','strong','urgent')),
  monetization_value TEXT CHECK (monetization_value IN ('standard','premium','high_value')),
  expires_at        TIMESTAMPTZ,
  computed_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_scores_user ON lead_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_score ON lead_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_lead_scores_segment ON lead_scores(segment);

ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON lead_scores FOR ALL USING (auth.role() = 'service_role');

-- ─── 4. Product Watchlists ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_watchlists (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id            UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  note                  TEXT,
  comparison_group_id   UUID,               -- group related products
  added_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON product_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_product ON product_watchlists(product_id);

ALTER TABLE product_watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own watchlist"
  ON product_watchlists FOR ALL USING (auth.uid() = user_id);

-- ─── 5. Saved Portfolios ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_portfolios (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name                    TEXT NOT NULL,
  description             TEXT,
  portfolio_items         JSONB NOT NULL DEFAULT '[]',
  total_monthly_investment BIGINT,
  risk_level              TEXT CHECK (risk_level IN ('conservative','moderate','aggressive')),
  goal                    TEXT,
  goal_amount             BIGINT,
  goal_timeline_years     SMALLINT,
  is_public               BOOLEAN DEFAULT false,
  share_token             TEXT UNIQUE,        -- for public sharing
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user ON saved_portfolios(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_share ON saved_portfolios(share_token) WHERE share_token IS NOT NULL;

ALTER TABLE saved_portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own portfolios" ON saved_portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public portfolios readable by all" ON saved_portfolios FOR SELECT USING (is_public = true);

-- ─── 6. Product Rate History ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_rates_history (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id        UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  rate_type         TEXT NOT NULL CHECK (rate_type IN (
                      'nav','interest_rate','fd_rate','reward_rate',
                      'annual_fee','expense_ratio','premium','repo_rate'
                    )),
  rate_value        DECIMAL(12, 4) NOT NULL,
  effective_date    DATE NOT NULL,
  source            TEXT NOT NULL DEFAULT 'manual',   -- 'amfi','rbi','manual','partner_api'
  is_verified       BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rates_product ON product_rates_history(product_id);
CREATE INDEX IF NOT EXISTS idx_rates_type ON product_rates_history(rate_type);
CREATE INDEX IF NOT EXISTS idx_rates_date ON product_rates_history(effective_date DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rates_unique ON product_rates_history(product_id, rate_type, effective_date);

-- Rate history is public (no personal data)
ALTER TABLE product_rates_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON product_rates_history FOR SELECT USING (true);
CREATE POLICY "Service write" ON product_rates_history FOR INSERT USING (auth.role() = 'service_role');
CREATE POLICY "Service update" ON product_rates_history FOR UPDATE USING (auth.role() = 'service_role');

-- ─── 7. User Journeys (Attribution) ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_journeys (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id          TEXT NOT NULL,
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  touchpoints         JSONB NOT NULL DEFAULT '[]',
  conversion          JSONB,                  -- ConversionEvent or null
  started_at          TIMESTAMPTZ,
  converted_at        TIMESTAMPTZ,
  days_to_conversion  DECIMAL(6, 2),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journeys_user ON user_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_session ON user_journeys(session_id);
CREATE INDEX IF NOT EXISTS idx_journeys_converted ON user_journeys(converted_at DESC) WHERE conversion IS NOT NULL;

ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON user_journeys FOR ALL USING (auth.role() = 'service_role');

-- ─── 8. Competitor Intelligence ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS competitor_products (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_name   TEXT NOT NULL,          -- 'bankbazaar','paisabazaar','nerdwallet_in'
  competitor_url    TEXT,
  product_name      TEXT NOT NULL,
  category          TEXT NOT NULL,
  key_rates         JSONB DEFAULT '{}',      -- {interest_rate, reward_rate, annual_fee, ...}
  features          JSONB DEFAULT '[]',
  last_scraped_at   TIMESTAMPTZ,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_name ON competitor_products(competitor_name);
CREATE INDEX IF NOT EXISTS idx_competitor_category ON competitor_products(category);

ALTER TABLE competitor_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON competitor_products FOR ALL USING (auth.role() = 'service_role');

-- ─── 9. Financial Health Score History ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS financial_health_history (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score       SMALLINT NOT NULL,
  band        TEXT NOT NULL,
  dimensions  JSONB NOT NULL DEFAULT '{}',    -- full dimension breakdown
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_history_user ON financial_health_history(user_id, computed_at DESC);

ALTER TABLE financial_health_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own history" ON financial_health_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can write" ON financial_health_history FOR INSERT USING (auth.role() = 'service_role');

-- ─── 10. Content Attribution Summary (materialized cache) ────────────────────

CREATE TABLE IF NOT EXISTS content_attribution_cache (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id                 TEXT NOT NULL,
  entity_name               TEXT,
  entity_type               TEXT NOT NULL,
  period_days               INTEGER NOT NULL DEFAULT 30,
  last_click_value          BIGINT DEFAULT 0,
  time_decay_value          BIGINT DEFAULT 0,
  position_based_value      BIGINT DEFAULT 0,
  total_attributed_value    BIGINT DEFAULT 0,
  conversion_assist_count   INTEGER DEFAULT 0,
  direct_conversion_count   INTEGER DEFAULT 0,
  avg_position_in_journey   DECIMAL(4,2),
  computed_at               TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_id, entity_type, period_days)
);

ALTER TABLE content_attribution_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read" ON content_attribution_cache FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON content_attribution_cache FOR INSERT USING (auth.role() = 'service_role');
CREATE POLICY "Service update" ON content_attribution_cache FOR UPDATE USING (auth.role() = 'service_role');

-- ─── Triggers: auto-update updated_at ────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_financial_profiles_updated_at
  BEFORE UPDATE ON user_financial_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_portfolios_updated_at
  BEFORE UPDATE ON saved_portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_products_updated_at
  BEFORE UPDATE ON competitor_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Views: Admin intelligence dashboard ─────────────────────────────────────

CREATE OR REPLACE VIEW lead_score_summary AS
SELECT
  segment,
  COUNT(*) as user_count,
  AVG(score) as avg_score,
  COUNT(*) FILTER (WHERE monetization_value = 'high_value') as high_value_leads,
  COUNT(*) FILTER (WHERE cta_intensity IN ('strong','urgent')) as urgent_cta_users
FROM lead_scores
WHERE expires_at > NOW()
GROUP BY segment
ORDER BY avg_score DESC;

CREATE OR REPLACE VIEW daily_rate_changes AS
SELECT
  prh.product_id,
  p.name as product_name,
  p.category,
  prh.rate_type,
  prh.rate_value as current_rate,
  LAG(prh.rate_value) OVER (
    PARTITION BY prh.product_id, prh.rate_type
    ORDER BY prh.effective_date
  ) as previous_rate,
  prh.effective_date,
  prh.source
FROM product_rates_history prh
JOIN products p ON p.id = prh.product_id
ORDER BY prh.effective_date DESC, ABS(prh.rate_value - LAG(prh.rate_value) OVER (
  PARTITION BY prh.product_id, prh.rate_type ORDER BY prh.effective_date
)) DESC NULLS LAST;
