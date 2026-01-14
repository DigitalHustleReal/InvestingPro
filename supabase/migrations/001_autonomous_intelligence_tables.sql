-- Migration: Add Autonomous Intelligence Tables
-- Version: 001
-- Description: Tables for engagement tracking, approval queue, and automation settings

-- ============================================
-- ENGAGEMENT TRACKING TABLES
-- ============================================

-- Engagement metrics per session
CREATE TABLE IF NOT EXISTS engagement_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  
  -- Time-based metrics
  time_on_page INTEGER, -- seconds
  scroll_depth DECIMAL(5,2), -- percentage (0-100)
  reading_progress DECIMAL(5,2), -- percentage (0-100)
  
  -- Interaction metrics
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  
  -- Conversion metrics
  calculator_used BOOLEAN DEFAULT FALSE,
  affiliate_link_clicked BOOLEAN DEFAULT FALSE,
  product_compared BOOLEAN DEFAULT FALSE,
  
  -- Quality signals
  bounced BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  engaged BOOLEAN DEFAULT FALSE,
  
  -- A/B testing
  variant TEXT, -- 'control' or 'test'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Aggregated article performance
CREATE TABLE IF NOT EXISTS article_performance (
  article_id UUID PRIMARY KEY,
  
  -- Averages
  avg_time_on_page DECIMAL(10,2),
  avg_scroll_depth DECIMAL(5,2),
  avg_reading_progress DECIMAL(5,2),
  
  -- Rates
  bounce_rate DECIMAL(5,4),
  completion_rate DECIMAL(5,4),
  engagement_rate DECIMAL(5,4),
  conversion_rate DECIMAL(5,4),
  
  -- Totals
  total_views INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  total_bookmarks INTEGER DEFAULT 0,
  
  -- Quality score (0-1)
  quality_score DECIMAL(5,4),
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AUTOMATION & APPROVAL TABLES
-- ============================================

-- Automation settings
CREATE TABLE IF NOT EXISTS automation_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Approval queue
CREATE TABLE IF NOT EXISTS approval_queue (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'content_creation', 'content_update', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'modified'
  
  title TEXT NOT NULL,
  description TEXT,
  reason TEXT,
  
  data JSONB NOT NULL,
  metadata JSONB,
  
  ai_confidence DECIMAL(5,4),
  quality_score DECIMAL(5,4),
  
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by TEXT,
  review_notes TEXT
);

-- A/B tests
CREATE TABLE IF NOT EXISTS ab_tests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  article_id UUID NOT NULL,
  
  control_variant JSONB,
  test_variant JSONB,
  
  traffic_split DECIMAL(3,2) DEFAULT 0.5,
  min_sample_size INTEGER DEFAULT 1000,
  confidence_level DECIMAL(3,2) DEFAULT 0.95,
  
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'winner_promoted'
  winner TEXT, -- 'control', 'test'
  winner_confidence DECIMAL(5,4),
  
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- AI prompt improvements (learned patterns)
CREATE TABLE IF NOT EXISTS ai_prompt_improvements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  improvements JSONB NOT NULL,
  confidence DECIMAL(5,4),
  learned_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Engagement metrics indexes
CREATE INDEX IF NOT EXISTS idx_engagement_article_id ON engagement_metrics(article_id);
CREATE INDEX IF NOT EXISTS idx_engagement_user_id ON engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_session_id ON engagement_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_engagement_created_at ON engagement_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_engagement_variant ON engagement_metrics(variant);

-- Approval queue indexes
CREATE INDEX IF NOT EXISTS idx_approval_queue_status ON approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_queue_type ON approval_queue(type);
CREATE INDEX IF NOT EXISTS idx_approval_queue_priority ON approval_queue(priority);
CREATE INDEX IF NOT EXISTS idx_approval_queue_created_at ON approval_queue(created_at);

-- A/B tests indexes
CREATE INDEX IF NOT EXISTS idx_ab_tests_article_id ON ab_tests(article_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);

-- ============================================
-- EXISTING TABLE INDEXES (PERFORMANCE)
-- ============================================

-- Articles table
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Credit cards table
CREATE INDEX IF NOT EXISTS idx_credit_cards_issuer ON credit_cards(issuer);
CREATE INDEX IF NOT EXISTS idx_credit_cards_card_type ON credit_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_credit_cards_rating ON credit_cards(rating);

-- Mutual funds table
CREATE INDEX IF NOT EXISTS idx_mutual_funds_category ON mutual_funds(category);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_fund_house ON mutual_funds(fund_house);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_risk_level ON mutual_funds(risk_level);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_rating ON mutual_funds(rating);

-- Brokers table
CREATE INDEX IF NOT EXISTS idx_brokers_type ON brokers(type);
CREATE INDEX IF NOT EXISTS idx_brokers_rating ON brokers(rating);

-- Insurance table
CREATE INDEX IF NOT EXISTS idx_insurance_type ON insurance(type);
CREATE INDEX IF NOT EXISTS idx_insurance_provider ON insurance(provider);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on new tables
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

-- Engagement metrics: Anyone can insert, only authenticated users can view their own
CREATE POLICY "Anyone can insert engagement metrics"
  ON engagement_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own engagement metrics"
  ON engagement_metrics FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Article performance: Public read, admin write
CREATE POLICY "Anyone can view article performance"
  ON article_performance FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update article performance"
  ON article_performance FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Approval queue: Admin only
CREATE POLICY "Only admins can access approval queue"
  ON approval_queue FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- A/B tests: Admin only
CREATE POLICY "Only admins can access A/B tests"
  ON ab_tests FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Automation settings: Admin only
CREATE POLICY "Only admins can access automation settings"
  ON automation_settings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update article_performance when engagement_metrics changes
CREATE OR REPLACE FUNCTION update_article_performance()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called by the engagement tracker service
  -- Just a placeholder for future optimization
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default automation settings
INSERT INTO automation_settings (id, settings)
VALUES ('default', '{
  "autoCreateContent": true,
  "autoCreateThreshold": 0.7,
  "requireApprovalForTopics": ["tax", "legal", "investment advice"],
  "autoUpdateContent": true,
  "autoUpdateThreshold": 0.4,
  "requireApprovalForUpdates": true,
  "autoSyncData": true,
  "autoPublishDataChanges": false,
  "autoImproveContent": true,
  "autoImproveThreshold": 0.5,
  "autoPromoteWinners": false,
  "requireApprovalForPromotion": true,
  "autoPublish": false,
  "requireEditorialReview": true,
  "notifyOnAutoCreation": true,
  "notifyOnAutoUpdate": true,
  "notifyOnAutoImprovement": true,
  "maxAutoCreationsPerDay": 10,
  "maxAutoUpdatesPerDay": 20
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Add migration record
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  description TEXT,
  executed_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO migrations (version, description)
VALUES ('001', 'Add autonomous intelligence tables and indexes')
ON CONFLICT (version) DO NOTHING;
