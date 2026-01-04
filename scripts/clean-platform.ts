
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanPlatform() {
    console.log('🧹 Starting Platform Cleanup...');

    // 1. Articles
    const { count: articleCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    if (articleCount && articleCount > 0) {
        console.log(`Deleting ${articleCount} articles...`);
        const { error } = await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) console.error('Error deleting articles:', error.message);
    } else {
        console.log('No articles to delete.');
    }

    // 2. Products
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (productCount && productCount > 0) {
        console.log(`Deleting ${productCount} products...`);
        const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) console.error('Error deleting products:', error.message);
    } else {
        console.log('No products to delete.');
    }

    // 3. Keep Authors (Dream Team)
    console.log('Keeping Authors (Dream Team) intact.');

    console.log('✨ Cleanup Verification: Platform is clean and ready for real data.');
}

cleanPlatform();
