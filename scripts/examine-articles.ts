import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllArticles() {
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, status, created_at')
        .order('created_at', { ascending: false });
    
    console.log(JSON.stringify(articles, null, 2));
}

listAllArticles().catch(console.error);
