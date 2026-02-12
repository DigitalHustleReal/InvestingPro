import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkMediaRLS() {
    console.log('--- CHECKING MEDIA TABLE RLS ---');

    // Query pg_policies for media table
    const { data: results, error } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT polname, polcmd, polroles, polqual::text, polwithcheck::text FROM pg_policies WHERE tablename = 'media'"
    });

    if (error) {
        console.error('Query failed:', error);
    } else {
        console.log('Media Table Policies:');
        console.log(JSON.stringify(results, null, 2));
    }

    console.log('\n--- SCAN COMPLETE ---');
}

checkMediaRLS().catch(console.error);
