-- =============================================
-- FIX COMMISSION COLUMN NAME MISMATCH
-- Purpose: Ensure affiliate_clicks table uses commission_earned (not commission_amount)
-- Date: January 23, 2026
-- =============================================

-- Fix column name: commission_amount → commission_earned
DO $$
BEGIN
    -- Check if column exists with wrong name and rename it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_clicks' 
        AND column_name = 'commission_amount'
    ) THEN
        -- Rename column to match code expectations
        ALTER TABLE public.affiliate_clicks 
        RENAME COLUMN commission_amount TO commission_earned;
        
        RAISE NOTICE 'Column renamed from commission_amount to commission_earned';
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_clicks' 
        AND column_name = 'commission_earned'
    ) THEN
        RAISE NOTICE 'Column commission_earned already exists, no action needed';
    ELSE
        -- Add column if it doesn't exist at all
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN commission_earned NUMERIC DEFAULT 0;
        
        RAISE NOTICE 'Column commission_earned added';
    END IF;
END $$;

-- Ensure converted column exists (boolean, not conversion_status)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_clicks' 
        AND column_name = 'converted'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN converted BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'Column converted added';
    END IF;
END $$;

-- Ensure conversion_date column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_clicks' 
        AND column_name = 'conversion_date'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN conversion_date TIMESTAMPTZ;
        
        RAISE NOTICE 'Column conversion_date added';
    END IF;
END $$;

-- Ensure product_type column exists (needed for revenue dashboard by category)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_clicks' 
        AND column_name = 'product_type'
    ) THEN
        ALTER TABLE public.affiliate_clicks 
        ADD COLUMN product_type TEXT;
        
        RAISE NOTICE 'Column product_type added';
    END IF;
END $$;

-- Create index on commission_earned for faster revenue queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_commission 
ON public.affiliate_clicks(commission_earned) 
WHERE commission_earned > 0;

-- Create index on converted for faster conversion queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted 
ON public.affiliate_clicks(converted) 
WHERE converted = TRUE;

-- Create index on product_type for category-based revenue queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_type 
ON public.affiliate_clicks(product_type) 
WHERE product_type IS NOT NULL;

-- =============================================
-- VERIFICATION QUERY
-- Run this after migration to verify columns exist
-- =============================================
-- SELECT 
--     column_name, 
--     data_type,
--     is_nullable,
--     column_default
-- FROM information_schema.columns 
-- WHERE table_schema = 'public'
-- AND table_name = 'affiliate_clicks' 
-- AND column_name IN ('commission_earned', 'converted', 'conversion_date', 'product_type')
-- ORDER BY column_name;
