
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditContent() {
    console.log('📊 CONTENT AUDIT REPORT');
    console.log('=======================');

    const { data: articles, error } = await supabase
        .from('articles')
        .select(`
            id, 
            title, 
            slug, 
            status, 
            quality_score, 
            author_id,
            author_name,
            created_at
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.table(articles.map(a => ({
        Title: a.title.substring(0, 30) + '...',
        Status: a.status,
        Score: a.quality_score,
        Author: a.author_name,
        Created: new Date(a.created_at).toLocaleTimeString()
    })));

    // Summary Stats
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const avgScore = articles.reduce((acc, curr) => acc + (curr.quality_score || 0), 0) / total;

    console.log('\n📈 SUMMARY:');
    console.log(`Total Articles: ${total}`);
    console.log(`Published: ${published} 🟢`);
    console.log(`Drafts: ${drafts} 🟡`);
    console.log(`Avg Quality: ${avgScore.toFixed(1)}/100`);
}

auditContent();
