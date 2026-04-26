-- =============================================
-- ALGORITHMIC RATING BACKFILL + MF QUALITY TRIAGE
-- Date: 2026-04-26
-- =============================================
-- Replaces placeholder rating=4.0 across loans (56 rows) and
-- mutual_funds (49 rows with real returns_3y) with real algorithmic
-- values per /methodology/loans v1.0 and /methodology/mutual-funds v1.0.
--
-- Quality triage on mutual_funds: 516 rows with no returns_3y data
-- marked is_active=false until AMFI re-ingest. Same for the 2,544
-- placeholder mutual_fund duplicates in the products table.

-- A. LOANS — algorithmic rating from interest_rate_min
UPDATE public.loans
SET rating = ROUND(
  GREATEST(3.5, LEAST(5.0,
    5.0 - GREATEST(0, LEAST(1.5, (interest_rate_min::numeric - 7.0) / 2.5))
    + CASE WHEN bank_name IN (
        'State Bank of India','SBI','HDFC Bank','ICICI Bank','Axis Bank',
        'Kotak Mahindra Bank','Bank of Baroda','Bank of India',
        'Bank of Maharashtra','Punjab National Bank','Punjab & Sind Bank',
        'Canara Bank','Union Bank of India','Indian Bank',
        'Federal Bank','IDFC FIRST Bank','IDFC First Bank','IndusInd Bank','RBL Bank',
        'YES Bank','Yes Bank'
      ) THEN 0.1 ELSE 0.0 END
  ))::numeric, 1)
WHERE interest_rate_min IS NOT NULL;

-- B. MUTUAL FUNDS — defensive add is_active column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='mutual_funds' AND column_name='is_active'
  ) THEN
    ALTER TABLE public.mutual_funds ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Mark inactive: no returns data = not launch-ready
UPDATE public.mutual_funds
SET is_active = FALSE
WHERE returns_3y IS NULL OR returns_3y::numeric = 0;

-- Algorithmic rating for the 49 with real returns_3y
UPDATE public.mutual_funds
SET rating = ROUND(GREATEST(3.0, LEAST(5.0,
  3.5 + GREATEST(0, LEAST(1.5, (returns_3y::numeric - 8.0) / 12.0))
))::numeric, 1)
WHERE is_active = TRUE AND returns_3y IS NOT NULL;

-- C. PRODUCTS — exclude 2,544 placeholder MF duplicates
UPDATE public.products
SET is_active = FALSE
WHERE category::text = 'mutual_fund'
  AND verification_status = 'pending'
  AND (rating = 4.0 OR rating IS NULL);
