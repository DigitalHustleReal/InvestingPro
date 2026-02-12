import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function checkReviewsRLS() {
    console.log('Checking RLS policies for "reviews" table...');
    const { data, error } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT policyname FROM pg_policies WHERE tablename = 'reviews'"
    });
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}
checkReviewsRLS();
