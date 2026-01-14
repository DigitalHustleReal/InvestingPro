-- Performance Optimization Indexes
-- Created: January 14, 2026
-- Purpose: Optimize frequently queried columns for better performance

-- Articles Table Indexes
-- Already exists: idx_articles_slug, idx_articles_category, idx_articles_status

-- Add composite index for common article queries (status + published_at)
CREATE INDEX IF NOT EXISTS idx_articles_status_published 
ON articles(status, published_at DESC NULLS LAST)
WHERE status = 'published';

-- Add index for category + status queries
CREATE INDEX IF NOT EXISTS idx_articles_category_status 
ON articles(category, status)
WHERE status = 'published';

-- Add index for search queries (title, excerpt)
CREATE INDEX IF NOT EXISTS idx_articles_title_search 
ON articles USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- Add index for author queries
CREATE INDEX IF NOT EXISTS idx_articles_author 
ON articles(author_id)
WHERE author_id IS NOT NULL;

-- Add index for submission status queries
CREATE INDEX IF NOT EXISTS idx_articles_submission_status 
ON articles(submission_status)
WHERE is_user_submission = true;

-- Products Tables Indexes

-- Credit Cards
CREATE INDEX IF NOT EXISTS idx_credit_cards_bank_type 
ON credit_cards(bank, type);

-- Mutual Funds
CREATE INDEX IF NOT EXISTS idx_mutual_funds_category_rating 
ON mutual_funds(category, rating DESC);

-- Loans
CREATE INDEX IF NOT EXISTS idx_loans_type_bank 
ON loans(type, bank_name);

-- Insurance
CREATE INDEX IF NOT EXISTS idx_insurance_type_provider 
ON insurance(type, provider_name);

-- Reviews Table Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_slug_rating 
ON reviews(product_slug, product_type, rating DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_user_product 
ON reviews(user_id, product_slug);

-- Workflow Tables Indexes (from Phase 3)
-- Already exists: idx_workflow_instances_state, idx_workflow_instances_workflow_id

-- Add composite index for workflow queries
CREATE INDEX IF NOT EXISTS idx_workflow_instances_state_created 
ON workflow_instances(state, created_at DESC)
WHERE state IN ('running', 'pending');

-- Add index for workflow execution history queries
CREATE INDEX IF NOT EXISTS idx_workflow_history_instance_step 
ON workflow_execution_history(workflow_instance_id, step_id);

-- State Transitions Indexes
CREATE INDEX IF NOT EXISTS idx_state_transitions_entity 
ON state_transitions(entity_type, entity_id, timestamp DESC);

-- Ad Placements (already optimized in schema)

-- Portfolio Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_user_asset_type 
ON portfolios(user_email, asset_type);

-- Performance Notes:
-- 1. These indexes will speed up common queries
-- 2. Monitor query performance after adding indexes
-- 3. Some indexes use partial indexes (WHERE clauses) for better performance
-- 4. GIN index on articles for full-text search
