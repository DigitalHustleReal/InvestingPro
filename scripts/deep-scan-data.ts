import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepScan() {
    console.log('--- DEEP SCAN START ---');

    // Scan Articles for Lorem Ipsum
    const { data: artContent } = await supabase
        .from('articles')
        .select('id, title, excerpt, content')
        .or('content.ilike.%lorem ipsum%,excerpt.ilike.%lorem ipsum%,content.ilike.%dummy content%');
    
    console.log(`\n[Articles w/ Placeholder] Found ${artContent?.length || 0}:`);
    artContent?.forEach(a => console.log(`- ${a.title}`));

    // Scan Cards for non-real fees or descriptions
    const { data: cardContent } = await supabase
        .from('credit_cards')
        .select('id, name, description, joining_fee')
        .or('description.ilike.%lorem ipsum%,description.ilike.%test description%');
    
    console.log(`\n[Cards w/ Placeholder] Found ${cardContent?.length || 0}:`);
    cardContent?.forEach(c => console.log(`- ${c.name}`));

    // Scan Reviews for test patterns
    const { data: revContent } = await supabase
        .from('reviews')
        .select('id, content')
        .or('content.ilike.%test%,content.ilike.%dummy%,content.ilike.%lorem%');

    console.log(`\n[Reviews w/ Placeholder] Found ${revContent?.length || 0}:`);
    revContent?.forEach(r => console.log(`- ${r.content.substring(0, 50)}`));

    console.log('\n--- DEEP SCAN COMPLETE ---');
}

deepScan().catch(console.error);
