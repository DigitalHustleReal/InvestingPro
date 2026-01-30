/**
 * Check latest articles in database
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function checkArticles() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, status, quality_score, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (error) {
        console.log('Error:', error.message);
    } else {
        console.log('\n=== Latest 5 Articles ===\n');
        data.forEach(a => {
            console.log(`[${a.status?.toUpperCase()}] ${a.title}`);
            console.log(`   Slug: ${a.slug}`);
            console.log(`   Score: ${a.quality_score}`);
            console.log(`   URL: http://localhost:3000/articles/${a.slug}`);
            console.log(`   Created: ${new Date(a.created_at).toLocaleString()}`);
            console.log('');
        });
    }
}

checkArticles();
