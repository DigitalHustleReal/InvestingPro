-- Update RLS Policies to Use user_roles Table
-- Replaces JWT-based role checks with database role checks

-- ============================================
-- ARTICLES TABLE
-- ============================================

-- Drop existing policies that use JWT role checks
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;

-- Create new admin policy using user_roles table
CREATE POLICY "Admins can manage articles" 
ON articles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add editor policy for content management
DROP POLICY IF EXISTS "Editors can manage content" ON articles;
CREATE POLICY "Editors can manage content" 
ON articles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
);

-- ============================================
-- REVIEWS TABLE
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;

-- Create new admin policy
CREATE POLICY "Admins can manage reviews" 
ON reviews FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- CREDIT_CARDS TABLE
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can insert credit cards" ON credit_cards;

-- Create new admin policy
CREATE POLICY "Admins can manage credit cards" 
ON credit_cards FOR ALL 
USING (
    auth.role() = 'service_role' OR 
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- AD_PLACEMENTS TABLE
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can manage ads" ON ad_placements;

-- Create new admin policy
CREATE POLICY "Admins can manage ads" 
ON ad_placements FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- AI_COSTS TABLE
-- ============================================

-- Update admin policy for ai_costs (if exists)
DROP POLICY IF EXISTS "Admins can view all AI costs" ON ai_costs;
CREATE POLICY "Admins can view all AI costs" 
ON ai_costs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- MONTHLY_BUDGETS TABLE
-- ============================================

-- Update admin policy for monthly_budgets (if exists)
DROP POLICY IF EXISTS "Admins can view monthly budgets" ON monthly_budgets;
CREATE POLICY "Admins can view monthly budgets" 
ON monthly_budgets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- DAILY_BUDGETS TABLE
-- ============================================

-- Update admin policy for daily_budgets (if exists)
-- Note: Check actual table name and adjust if needed
-- DROP POLICY IF EXISTS "Admins can view daily budgets" ON daily_budgets;
-- CREATE POLICY "Admins can view daily budgets" 
-- ON daily_budgets FOR SELECT
-- USING (
--     EXISTS (
--         SELECT 1 FROM user_roles
--         WHERE user_id = auth.uid() AND role = 'admin'
--     )
-- );

-- ============================================
-- ADDITIONAL TABLES (if they exist)
-- ============================================

-- Downloadable Resources
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'downloadable_resources') THEN
        DROP POLICY IF EXISTS "Admins can manage downloadable resources" ON downloadable_resources;
        EXECUTE 'CREATE POLICY "Admins can manage downloadable resources" 
                 ON downloadable_resources FOR ALL 
                 USING (
                     EXISTS (
                         SELECT 1 FROM user_roles
                         WHERE user_id = auth.uid() AND role = ''admin''
                     )
                 )';
    END IF;
END $$;

-- A/B Tests
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ab_tests') THEN
        DROP POLICY IF EXISTS "Admins can manage ab_tests" ON ab_tests;
        EXECUTE 'CREATE POLICY "Admins can manage ab_tests" 
                 ON ab_tests FOR ALL 
                 USING (
                     EXISTS (
                         SELECT 1 FROM user_roles
                         WHERE user_id = auth.uid() AND role = ''admin''
                     )
                 )';
    END IF;
END $$;

-- Email Sequences
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_sequences') THEN
        DROP POLICY IF EXISTS "Admins can manage email sequences" ON email_sequences;
        EXECUTE 'CREATE POLICY "Admins can manage email sequences" 
                 ON email_sequences FOR ALL 
                 USING (
                     EXISTS (
                         SELECT 1 FROM user_roles
                         WHERE user_id = auth.uid() AND role = ''admin''
                     )
                 )';
    END IF;
END $$;

-- SERP Tracking
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'serp_tracking') THEN
        DROP POLICY IF EXISTS "Admins can manage serp_tracking" ON serp_tracking;
        EXECUTE 'CREATE POLICY "Admins can manage serp_tracking" 
                 ON serp_tracking FOR ALL 
                 USING (
                     EXISTS (
                         SELECT 1 FROM user_roles
                         WHERE user_id = auth.uid() AND role = ''admin''
                     )
                 )';
    END IF;
END $$;

-- Comments
COMMENT ON POLICY "Admins can manage articles" ON articles IS 'Admin full access using user_roles table';
COMMENT ON POLICY "Editors can manage content" ON articles IS 'Editor and admin content management access';
COMMENT ON POLICY "Admins can manage reviews" ON reviews IS 'Admin full access using user_roles table';
COMMENT ON POLICY "Admins can manage credit cards" ON credit_cards IS 'Admin and service role access using user_roles table';
COMMENT ON POLICY "Admins can manage ads" ON ad_placements IS 'Admin full access using user_roles table';
