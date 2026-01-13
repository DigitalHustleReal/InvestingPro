
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkPrompts() {
    console.log('🔍 Checking prompts table...');
    const { data, error } = await supabase
        .from('prompts')
        .select('*');

    if (error) {
        console.error('❌ Error fetching prompts:', error.message);
    } else {
        console.log(`✅ Prompts table exists. Found ${data.length} prompts.`);
        data.forEach(p => console.log(`   - ${p.name} (${p.slug})`));
    }
}

checkPrompts();
