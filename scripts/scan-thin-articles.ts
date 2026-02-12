import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkThinArticles() {
    console.log('--- SCANNING FOR THIN ARTICLES ---');

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error:', error.message);
        return;
    }

    const thin = (articles || []).filter(a => (a.content?.length || 0) < 500);
    console.log(`Found ${thin.length} thin articles (< 500 chars)`);

    thin.forEach(a => {
        console.log(`\nID: ${a.id}`);
        console.log(`Title: ${a.title}`);
        console.log(`Created: ${a.created_at}`);
        console.log(`Content: [[${a.content}]]`);
    });

    console.log('\n--- SCAN COMPLETE ---');
}

checkThinArticles().catch(console.error);
