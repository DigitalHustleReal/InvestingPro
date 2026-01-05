import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runFix() {
    console.log("🛠️  Applying DB Fix for 'active' column error...");
    
    const migrationPath = path.resolve('supabase/migrations/20260104_fix_active_column_trigger.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    const { error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
        console.error('❌ Failed to apply fix via exec_sql:', error.message);
        // Try 'sql' as parameter name instead of 'query'
        const { error: error2 } = await supabase.rpc('exec_sql', { sql });
        if (error2) {
            console.error('❌ Failed to apply fix via exec_sql (with "sql" param):', error2.message);
        } else {
            console.log('✅ Fix applied successfully (with "sql" param)!');
        }
    } else {
        console.log('✅ Fix applied successfully!');
    }
}

runFix().catch(console.error);
