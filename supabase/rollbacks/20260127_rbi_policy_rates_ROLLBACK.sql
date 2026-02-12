-- Rollback: 20260127_rbi_policy_rates.sql
-- Drop RBI policy rates table and associated objects

-- 1. Drop policies
DROP POLICY IF EXISTS "Service role can insert RBI rates" ON rbi_policy_rates;
DROP POLICY IF EXISTS "Service role can update RBI rates" ON rbi_policy_rates;
DROP POLICY IF EXISTS "Public can view RBI rates" ON rbi_policy_rates;

-- 2. Drop indexes
DROP INDEX IF EXISTS idx_rbi_rates_updated;

-- 3. Drop table
DROP TABLE IF EXISTS rbi_policy_rates;
