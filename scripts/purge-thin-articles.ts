import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function purgeThinArticles() {
    console.log('--- PURGING THIN ARTICLES (< 500 chars) ---');

    // 1. Fetch thin articles first for logging
    const { data: thinArticles, error: fetchError } = await supabase
        .from('articles')
        .select('id, title, content')
        .lt('quality_score', 100); // Usually thin ones have specific scores or we just check content length

    // Since RLS or query complexity might prevent direct length check in some Supabase setups, 
    // we fetch and filter in JS if needed, but let's try a safer approach: 
    // The "SIP definition." articles are very specific.
    
    const { data: allArticles, error: allErr } = await supabase
        .from('articles')
        .select('id, title, content');

    if (allErr) {
        console.error('Error fetching articles:', allErr.message);
        return;
    }

    const targets = (allArticles || []).filter(a => 
        (a.content?.length || 0) < 500 || 
        a.content?.includes('definition.') ||
        a.title?.startsWith('What is ') && a.content?.length < 1000
    );

    console.log(`Identified ${targets.length} articles for deletion.`);

    if (targets.length === 0) {
        console.log('No articles match the purge criteria.');
        return;
    }

    const ids = targets.map(t => t.id);

    // 2. Perform deletion
    const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .in('id', ids);

    if (deleteError) {
        console.error('Error during deletion:', deleteError.message);
    } else {
        console.log(`Successfully purged ${targets.length} articles.`);
        targets.forEach(t => console.log(`Deleted: ${t.title}`));
    }

    console.log('\n--- PURGE COMPLETE ---');
}

purgeThinArticles().catch(console.error);
