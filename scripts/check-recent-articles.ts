import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentArticles() {
    console.log('--- CHECKING RECENT ARTICLES ---');

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, status, created_at, content, quality_score')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (error) {
        console.error('Error fetching articles:', error.message);
        return;
    }

    if (!articles || articles.length === 0) {
        console.log('No articles found.');
    } else {
        console.log(`Found ${articles.length} recent articles:`);
        articles.forEach(article => {
            const contentLen = article.content?.length || 0;
            console.log(`\nTitle: ${article.title}`);
            console.log(`Status: ${article.status}`);
            console.log(`Created At: ${article.created_at}`);
            console.log(`Content Length: ${contentLen} chars`);
            console.log(`Quality Score: ${article.quality_score}`);
            if (contentLen < 500) {
                console.log(`[WARNING] Very thin content!`);
            }
        });
    }

    console.log('\n--- SCAN COMPLETE ---');
}

checkRecentArticles().catch(console.error);
