import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkFunction() {
    console.log('Checking get_admin_dashboard_stats definition...');
    const { data, error } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT proname, prosecdef FROM pg_proc WHERE proname = 'get_admin_dashboard_stats'"
    });

    if (error) {
        console.error('Error checking function:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

checkFunction();
