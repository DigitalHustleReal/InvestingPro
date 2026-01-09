
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verify() {
    const { data: articles } = await supabase
        .from('articles')
        .select('title, content')
        .ilike('content', '%/api/out?link_id=%')
        .limit(5);

    if (articles && articles.length > 0) {
        console.log(`✅ Found ${articles.length} articles with injected links.`);
        articles.forEach(a => {
            console.log(`\nArticle: ${a.title}`);
            const match = a.content.match(/\[(.*?)\]\((.*?)\)/g);
            if (match) {
                console.log(`   Links found:`);
                match.forEach(m => {
                    if (m.includes('/api/out')) console.log(`   - ${m}`);
                });
            }
        });
    } else {
        console.log("❌ No articles found with injected links.");
    }
}

verify().catch(console.error);
