import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificArticle() {
    console.log('--- CHECKING SPECIFIC THIN ARTICLE ---');

    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('title', 'What is SIP?')
        .limit(1)
        .single();
    
    if (error) {
        console.error('Error fetching article:', error.message);
        return;
    }

    if (!article) {
        console.log('Article not found.');
    } else {
        console.log(`ID: ${article.id}`);
        console.log(`Title: ${article.title}`);
        console.log(`Content: [[${article.content}]]`);
        console.log(`Raw Content Length: ${article.content?.length}`);
        console.log(`AI Metadata: ${JSON.stringify(article.ai_metadata, null, 2)}`);
    }

    console.log('\n--- SCAN COMPLETE ---');
}

checkSpecificArticle().catch(console.error);
