
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function restore() {
    console.log('🚀 Starting Database Functions Restoration...');

    const functions = [
        {
            name: 'check_daily_budget',
            sql: `
CREATE OR REPLACE FUNCTION check_daily_budget()
RETURNS TABLE (
    can_generate BOOLEAN,
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
        INSERT INTO daily_budgets (budget_date) VALUES (CURRENT_DATE)
        ON CONFLICT (budget_date) DO NOTHING
        RETURNING * INTO v_budget;
    END IF;
    
    RETURN QUERY SELECT
        NOT COALESCE(v_budget.is_paused, FALSE) AND
        COALESCE(v_budget.tokens_used, 0) < COALESCE(v_budget.max_tokens, 1000000) AND
        COALESCE(v_budget.images_used, 0) < COALESCE(v_budget.max_images, 100) AND
        COALESCE(v_budget.cost_spent_usd, 0) < COALESCE(v_budget.max_cost_usd, 50.00),
        GREATEST(0, COALESCE(v_budget.max_tokens, 1000000) - COALESCE(v_budget.tokens_used, 0)),
        GREATEST(0, COALESCE(v_budget.max_images, 100) - COALESCE(v_budget.images_used, 0)),
        GREATEST(0, COALESCE(v_budget.max_cost_usd, 50.00) - COALESCE(v_budget.cost_spent_usd, 0)),
        COALESCE(v_budget.is_paused, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
            `
        },
        {
            name: 'get_admin_dashboard_stats',
            sql: `
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_articles', (SELECT COUNT(*) FROM articles),
        'published_articles', (SELECT COUNT(*) FROM articles WHERE status = 'published'),
        'draft_articles', (SELECT COUNT(*) FROM articles WHERE status = 'draft'),
        'total_views', (SELECT COALESCE(SUM(views), 0) FROM articles),
        'articles_this_month', (SELECT COUNT(*) FROM articles WHERE created_at >= date_trunc('month', CURRENT_DATE)),
        'ai_generated_articles', (SELECT COUNT(*) FROM articles WHERE is_ai_generated = true OR ai_generated = true),
        'recent_activity', (
            SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
            FROM (
                SELECT 
                    id,
                    title,
                    status,
                    created_at,
                    updated_at
                FROM articles
                ORDER BY updated_at DESC
                LIMIT 5
            ) t
        ),
        'category_stats', (
            SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
            FROM (
                SELECT 
                    COALESCE(category, 'uncategorized') as category,
                    COUNT(*) as count
                FROM articles
                GROUP BY category
                ORDER BY count DESC
                LIMIT 10
            ) t
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
            `
        }
    ];

    for (const fn of functions) {
        console.log("Restoring function: " + fn.name + "...");
        const { error } = await supabase.rpc('exec_sql', { sql_string: fn.sql });
        if (error) {
            console.error("❌ Failed to restore " + fn.name + ":", error.message);
        } else {
            console.log("✅ Restored " + fn.name + " successfully.");
        }
    }

    console.log('✨ Restoration Complete.');
}

restore().catch(console.error);
