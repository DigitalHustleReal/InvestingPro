
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
    console.log("🔍 Checking Featured Images...");
    const { data: articles } = await supabase
        .from('articles')
        .select('title, featured_image, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
        
    articles?.forEach(a => console.log(`- ${a.title}: ${a.featured_image ? 'Checking URL...' : 'MISSING'} (${a.featured_image?.substring(0, 30)}...)`));
}

main();
