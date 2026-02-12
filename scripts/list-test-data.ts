import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTestData() {
    console.log('--- SCANNING FOR TEST DATA ---');

    // 1. Articles
    const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug')
        .or('title.ilike.%test%,slug.ilike.%test%,title.ilike.%dummy%,slug.ilike.%dummy%');
    
    console.log(`\n[Articles] Found ${articles?.length || 0} items:`);
    articles?.forEach(a => console.log(`- ${a.title} (${a.slug})`));

    // 2. Credit Cards
    const { data: cards } = await supabase
        .from('credit_cards')
        .select('id, name, bank')
        .or('name.ilike.%test%,bank.ilike.%test%,name.ilike.%dummy%,bank.ilike.%dummy%');
    
    console.log(`\n[Credit Cards] Found ${cards?.length || 0} items:`);
    cards?.forEach(c => console.log(`- ${c.name} [Bank: ${c.bank}]`));

    // 3. Mutual Funds
    const { data: funds } = await supabase
        .from('mutual_funds')
        .select('id, name, fund_house')
        .or('name.ilike.%test%,fund_house.ilike.%test%,name.ilike.%dummy%,fund_house.ilike.%dummy%');
    
    console.log(`\n[Mutual Funds] Found ${funds?.length || 0} items:`);
    funds?.forEach(f => console.log(`- ${f.name} [AMC: ${f.fund_house}]`));

    // 4. Reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select('id, content, user_name')
        .or('content.ilike.%test%,content.ilike.%dummy%,content.ilike.%lorem%');
        
    console.log(`\n[Reviews] Found ${reviews?.length || 0} items:`);
    reviews?.forEach(r => console.log(`- "${r.content.substring(0, 50)}..." by ${r.user_name}`));

    // 5. Leads
    const { data: leads } = await supabase
        .from('leads')
        .select('id, email, first_name')
        .or('email.ilike.%test%,email.ilike.%example.com%');

    console.log(`\n[Leads] Found ${leads?.length || 0} items:`);
    leads?.forEach(l => console.log(`- ${l.email} (${l.first_name})`));

    console.log('\n--- SCAN COMPLETE ---');
}

listTestData().catch(console.error);
