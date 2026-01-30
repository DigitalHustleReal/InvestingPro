import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Use service role key to bypass RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runMigration() {
    console.log("🛠️  running schema migration...");
    
    // 1. Add tags column to products
    const sqlAddTags = `ALTER TABLE products ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];`;
    
    console.log("Adding tags column to products...");
    const { error: error1 } = await supabase.rpc('exec_sql', { sql: sqlAddTags });
    
    if (error1) {
        console.log("First attempt with 'sql' param failed:", error1.message);
        // Try 'query' param
        const { error: error2 } = await supabase.rpc('exec_sql', { query: sqlAddTags });
        if (error2) {
             // Try 'p_sql' param
            const { error: error3 } = await supabase.rpc('exec_sql', { p_sql: sqlAddTags });
             if (error3) {
                console.error("❌ Failed to run SQL via exec_sql RPC. You may need to run this manually in Supabase SQL Editor:");
                console.error(sqlAddTags);
             } else {
                 console.log("✅ tags column added (using p_sql param).");
             }
        } else {
            console.log("✅ tags column added (using query param).");
        }
    } else {
        console.log("✅ tags column added (using sql param).");
    }
    
    // 2. Check testimonials table
    console.log("\nChecking testimonials table...");
    const { data, error } = await supabase.from('testimonials').select('*').limit(1);
    
    if (error) {
        console.error("❌ Error accessing testimonials table:", error.message);
        if (error.message.includes('does not exist')) {
            console.error("The 'testimonials' table is missing!");
        }
    } else {
        console.log("✅ 'testimonials' table exists and is accessible. Rows found:", data.length);
    }
}

runMigration().catch(console.error);
