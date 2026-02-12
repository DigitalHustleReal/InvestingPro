
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
    console.log('--- CHECKING blog_posts SCHEMA ---');
    const { data, error } = await supabase.from('blog_posts').select('*').limit(1);
    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('No data found in blog_posts');
    }

    console.log('\n--- CHECKING articles SCHEMA ---');
    const { data: data2, error: error2 } = await supabase.from('articles').select('*').limit(1);
    if (error2) {
        console.error('Error:', error2.message);
    } else if (data2 && data2.length > 0) {
        console.log('Columns:', Object.keys(data2[0]));
    } else {
        console.log('No data found in articles');
    }
}

checkSchema().catch(console.error);
