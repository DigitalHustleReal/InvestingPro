
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyFix() {
  console.log('Applying Admin RLS Fix...');

  // 1. Update get_admin_dashboard_stats to SECURITY DEFINER
  const updateRpcSql = `
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
  `;

  console.log('1. Updating get_admin_dashboard_stats...');
  let { error } = await supabase.rpc('exec_sql', { sql_string: updateRpcSql });
  if (error) {
    console.error('Failed to update RPC:', error);
    // Don't exit, try next steps
  } else {
    console.log('✅ RPC updated.');
  }

  // 2. Fix Articles RLS
  const fixArticlesRls = `
    ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Published articles are public" ON articles;
    CREATE POLICY "Published articles are public" ON articles
        FOR SELECT TO public
        USING (status = 'published');

    DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
    CREATE POLICY "Admins can view all articles" ON articles
        FOR SELECT TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
            )
        );
  `;
  
  // Split statements for safety as exec_sql might not handle multiple statements in one go depending on implementation
  // But usually EXECUTE string works for multiple statements in PG. Let's try one by one if strict.
  // Actually run-migrations.ts failed splitting. Let's try sending the block. 
  // If it fails, I'll split.
  console.log('2. Fixing Articles RLS...');
  ({ error } = await supabase.rpc('exec_sql', { sql_string: fixArticlesRls }));
  if (error) {
    console.error('Failed to fix Articles RLS:', error);
    
    // Fallback: Split by statement
    console.log('Retrying Articles RLS statement by statement...');
    const statements = fixArticlesRls.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql_string: stmt });
        if (stmtError) console.error(`Failed statement: ${stmt.substring(0, 50)}...`, stmtError);
    }
  } else {
    console.log('✅ Articles RLS fixed.');
  }

  // 3. Fix Reviews RLS
  const fixReviewsRls = `
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
    CREATE POLICY "Admins can view all reviews" ON reviews
        FOR SELECT TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
            )
        );
  `;

  console.log('3. Fixing Reviews RLS...');
  ({ error } = await supabase.rpc('exec_sql', { sql_string: fixReviewsRls }));
  if (error) {
      console.error('Failed to fix Reviews RLS:', error);
      // Fallback split
      const statements = fixReviewsRls.split(';').filter(s => s.trim().length > 0);
      for (const stmt of statements) {
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql_string: stmt });
          if (stmtError) console.error(`Failed statement: ${stmt.substring(0, 50)}...`, stmtError);
      }
  } else {
      console.log('✅ Reviews RLS fixed.');
  }
}

applyFix();
