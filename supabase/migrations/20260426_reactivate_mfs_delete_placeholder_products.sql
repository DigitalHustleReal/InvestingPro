-- =============================================
-- RE-ACTIVATE all real MFs + delete placeholder products
-- Date: 2026-04-26 (correction to earlier inactive-marking)
-- =============================================
-- All 565 rows in mutual_funds have real NAV from AMFI + real
-- regulator IDs (amfi_code/scheme_code/isin) — they're real funds.
-- Earlier migration marked 516 inactive because they lacked returns
-- history; that's wrong (excluding new funds from listings is a
-- product mistake). We re-activate all 565 and let UI render
-- "New / Track record building" when no returns data exists.

-- A. Re-activate every MF
UPDATE public.mutual_funds SET is_active = TRUE WHERE is_active = FALSE;

-- B. Re-rate (3Y full algorithmic / 1Y conservative cap / null for new)
UPDATE public.mutual_funds
SET rating = ROUND(GREATEST(3.0, LEAST(5.0,
  3.5 + GREATEST(0, LEAST(1.5, (returns_3y::numeric - 8.0) / 12.0))
))::numeric, 1)
WHERE returns_3y IS NOT NULL AND returns_3y::numeric > 0;

UPDATE public.mutual_funds
SET rating = ROUND(GREATEST(3.0, LEAST(4.5,
  3.0 + GREATEST(0, LEAST(1.5, (returns_1y::numeric - 8.0) / 14.0))
))::numeric, 1)
WHERE (returns_3y IS NULL OR returns_3y::numeric = 0)
  AND returns_1y IS NOT NULL AND returns_1y::numeric > 0;

UPDATE public.mutual_funds
SET rating = NULL
WHERE (returns_3y IS NULL OR returns_3y::numeric = 0)
  AND (returns_1y IS NULL OR returns_1y::numeric = 0);

-- C. Delete 2,544 placeholder MF duplicates from products table
DELETE FROM public.products
WHERE category::text = 'mutual_fund'
  AND verification_status = 'pending'
  AND (rating = 4.0 OR rating IS NULL)
  AND (official_link IS NULL OR official_link = '');
