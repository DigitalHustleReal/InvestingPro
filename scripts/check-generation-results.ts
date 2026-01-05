import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkDb() {
    console.log('--- DB Check ---');
    const { count: gCount } = await supabase.from('glossary_terms').select('*', { count: 'exact', head: true });
    const { count: aCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
    console.log('Glossary Count:', gCount);
    console.log('Blog Count:', aCount);

    console.log('\n--- Author/Reviewer Check ---');
    const { data: terms } = await supabase.from('glossary_terms').select('term, author_id, editor_id, show_author, show_reviewer').order('created_at', { ascending: false }).limit(1);
    console.log('Glossary Term:', terms?.[0]);

    const { data: posts } = await supabase.from('blog_posts').select('title, content_type, author_id, editor_id, show_author, show_reviewer').order('published_at', { ascending: false }).limit(2);
    console.log('Blog Posts:', JSON.stringify(posts, null, 2));
}

checkDb();
