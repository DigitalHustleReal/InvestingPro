-- Rollback: 20260128000000_missing_cms_tables.sql
-- Drop tables created for Pipeline Runs, Versus Pages, and Cache

-- 1. Drop policies (optional if tables are dropped, but good practice)
DROP POLICY IF EXISTS "Service update pipeline" ON public.pipeline_runs;
DROP POLICY IF EXISTS "Service insert pipeline" ON public.pipeline_runs;
DROP POLICY IF EXISTS "Public read cache" ON public.comparison_cache;
DROP POLICY IF EXISTS "Public read mutual funds" ON public.mutual_funds;
DROP POLICY IF EXISTS "Public read credit cards" ON public.credit_cards;
DROP POLICY IF EXISTS "Public read versus pages" ON public.versus_pages;

-- 2. Drop tables
DROP TABLE IF EXISTS public.mutual_funds;
DROP TABLE IF EXISTS public.credit_cards;
DROP TABLE IF EXISTS public.comparison_cache;
DROP TABLE IF EXISTS public.versus_pages;
DROP TABLE IF EXISTS public.pipeline_runs;
