import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRLS() {
    console.log('Fetching RLS policies for "articles" table...');
    const { data, error } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT polname, polcmd, polroles, polqual::text, polwithcheck::text FROM pg_policies WHERE tablename = 'articles'"
    });

    if (error) {
        console.error('Error fetching policies:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
    fs.writeFileSync('rls_policies_dump.json', JSON.stringify(data, null, 2));
}

checkRLS();
