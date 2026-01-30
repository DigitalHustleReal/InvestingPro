
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function auditDraftArticle() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase credentials');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching one draft article...');

    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching article:', error);
        return;
    }

    if (!article) {
        console.log('No draft articles found.');
        return;
    }

    console.log('\n=== ARTICLE AUDIT ===');
    console.log(`Title: ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Status: ${article.status}`);
    console.log(`Quality Score: ${article.quality_score}`);
    console.log(`Word Count: ${article.word_count || 'N/A'}`);
    
    console.log('\n--- Quality Issues ---');
    if (article.quality_issues) {
        console.log(JSON.stringify(article.quality_issues, null, 2));
    } else {
        console.log('No quality issues logged.');
    }

    console.log('\n--- Content Snippet (First 500 chars) ---');
    console.log(article.content.substring(0, 500) + '...');
    
    console.log('\n--- Metadata ---');
    console.log('Description:', article.description);
    console.log('Keywords:', article.keywords);
}

auditDraftArticle().catch(console.error);
