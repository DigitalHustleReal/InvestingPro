
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkResourcesForVideos() {
    console.log('--- CHECKING ARTICLES FOR VIDEOS ---');
    const { data: articles, error: artError } = await supabase
        .from('articles')
        .select('id, title, body_html')
        .or('body_html.ilike.%<video%,body_html.ilike.%<iframe%');

    if (artError) {
        console.error('Error fetching articles:', artError.message);
    } else if (articles) {
        console.log(`Found ${articles.length} articles with potential video content.`);
        articles.forEach(a => {
            console.log(`- ${a.title} (ID: ${a.id})`);
        });
    }

    console.log('\n--- CHECKING PRODUCTS FOR VIDEOS ---');
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, description');

    if (prodError) {
        console.error('Error fetching products:', prodError.message);
    } else if (products) {
        const withVideos = products.filter(p => 
            (p.description && (p.description.includes('<video') || p.description.includes('<iframe')))
        );
        console.log(`Found ${withVideos.length} products with potential video content.`);
        withVideos.forEach(v => console.log(`- ${v.name}`));
    }

    console.log('\n--- SCAN COMPLETE ---');
}

checkResourcesForVideos().catch(console.error);
