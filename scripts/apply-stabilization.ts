import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function applyMigration() {
    console.log('--- APPLYING STABILIZATION MIGRATION (RETRY) ---');

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260211_admin_stabilization.sql');
    
    try {
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        // Split into statements because exec_sql_query might not handle multiple statements well if they are complex (though usually it does)
        // Actually, let's try the whole block first.
        
        console.log(`Applying SQL length: ${sql.length}`);

        // Try exec_sql_query directly as it is the permanent one I created
        const { error } = await supabase.rpc('exec_sql_query', { sql_query: sql });

        if (error) {
            console.error('Migration failed:', error);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            console.error('Error hint:', error.hint);
            
            // Try exec_sql as backup
            console.log('Retrying with exec_sql...');
            const { error: error2 } = await supabase.rpc('exec_sql', { sql_string: sql });
            if (error2) {
                 console.error('Fallback failed:', error2.message);
                 process.exit(1);
            }
        }

        console.log('✅ Migration applied successfully.');
        
        // Sanity Check
        const { data, error: checkError } = await supabase.rpc('get_revenue_dashboard_metrics');
        if (checkError) {
            console.error('RPC check failed:', checkError);
            process.exit(1);
        } else {
            console.log('RPC check successful.');
            console.log(JSON.stringify(data, null, 2).substring(0, 500));
        }

    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

applyMigration();
