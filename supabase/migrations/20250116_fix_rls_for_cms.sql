-- ============================================================================
-- FIX RLS POLICIES FOR CMS OPERATIONS
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Drop existing functions first (required due to signature change)
DROP FUNCTION IF EXISTS check_daily_budget();
DROP FUNCTION IF EXISTS record_content_cost(UUID, INTEGER, NUMERIC, TEXT, TEXT, INTEGER, NUMERIC);

-- 2. Recreate check_daily_budget function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION check_daily_budget()
RETURNS TABLE (
    has_budget BOOLEAN,
    tokens_remaining INTEGER,
    images_remaining INTEGER,
    cost_remaining NUMERIC,
    is_paused BOOLEAN
) AS $$
DECLARE
    v_budget RECORD;
BEGIN
    SELECT * INTO v_budget
    FROM daily_budgets
    WHERE budget_date = CURRENT_DATE
    LIMIT 1;
    
    IF NOT FOUND THEN
        -- Create default budget for today
        INSERT INTO daily_budgets (budget_date) VALUES (CURRENT_DATE)
        ON CONFLICT (budget_date) DO NOTHING
        RETURNING * INTO v_budget;
        
        -- Re-fetch if insert didn't return (conflict case)
        IF v_budget IS NULL THEN
            SELECT * INTO v_budget
            FROM daily_budgets
            WHERE budget_date = CURRENT_DATE
            LIMIT 1;
        END IF;
    END IF;
    
    -- Return defaults if still not found
    IF v_budget IS NULL THEN
        RETURN QUERY SELECT
            TRUE,
            1000000,
            100,
            50.00::NUMERIC,
            FALSE;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT
        NOT v_budget.is_paused AND
        v_budget.tokens_used < v_budget.max_tokens AND
        v_budget.images_used < v_budget.max_images AND
        v_budget.cost_spent_usd < v_budget.max_cost_usd,
        GREATEST(0, v_budget.max_tokens - v_budget.tokens_used),
        GREATEST(0, v_budget.max_images - v_budget.images_used),
        GREATEST(0, v_budget.max_cost_usd - v_budget.cost_spent_usd),
        v_budget.is_paused;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate record_content_cost with SECURITY DEFINER
CREATE OR REPLACE FUNCTION record_content_cost(
    p_article_id UUID,
    p_tokens INTEGER,
    p_cost NUMERIC,
    p_provider TEXT,
    p_model TEXT,
    p_images INTEGER DEFAULT 0,
    p_image_cost NUMERIC DEFAULT 0
)
RETURNS void AS $$
DECLARE
    v_total_cost NUMERIC;
BEGIN
    v_total_cost := p_cost + p_image_cost;
    
    INSERT INTO content_costs (
        article_id,
        ai_tokens_used,
        ai_cost,
        ai_provider,
        ai_model,
        images_generated,
        image_cost,
        total_cost
    ) VALUES (
        p_article_id,
        p_tokens,
        p_cost,
        p_provider,
        p_model,
        p_images,
        p_image_cost,
        v_total_cost
    )
    ON CONFLICT DO NOTHING;
    
    -- Update daily budget
    UPDATE daily_budgets
    SET 
        tokens_used = tokens_used + p_tokens,
        images_used = images_used + p_images,
        cost_spent_usd = cost_spent_usd + v_total_cost,
        updated_at = NOW()
    WHERE budget_date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add permissive policies for daily_budgets (allow API to read/write)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can manage daily budgets" ON daily_budgets;
DROP POLICY IF EXISTS "Admins can view daily budgets" ON daily_budgets;

-- Create new permissive policies
CREATE POLICY "Allow read daily budgets" 
ON daily_budgets FOR SELECT 
USING (true);

CREATE POLICY "Allow insert daily budgets" 
ON daily_budgets FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update daily budgets" 
ON daily_budgets FOR UPDATE 
USING (true);

-- 5. Initialize today's budget if not exists
INSERT INTO daily_budgets (budget_date, max_tokens, max_images, max_cost_usd)
VALUES (CURRENT_DATE, 1000000, 100, 50.00)
ON CONFLICT (budget_date) DO NOTHING;

-- 6. Verify the fix
SELECT 'RLS Fix Applied Successfully' as status;
SELECT * FROM daily_budgets WHERE budget_date = CURRENT_DATE;
