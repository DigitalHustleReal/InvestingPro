import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyRLS() {
    console.log('Verifying RLS policies for "articles"...');
    // Using correct column names for pg_policies in newer Postgres/Supabase
    const { data, error } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT policyname, cmd, roles, qual::text, with_check::text FROM pg_policies WHERE tablename = 'articles'"
    });

    if (error) {
        console.error('Final verification aborted due to error:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

verifyRLS();
