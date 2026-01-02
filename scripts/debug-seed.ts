
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
    console.log("🌱 Power Seeding...");
    
    const { data, error } = await supabase
        .from('products')
        .insert([
            { slug: 'hdfc-regalia-gold', name: 'HDFC Regalia Gold', category: 'credit_card', provider_name: 'HDFC Bank' },
            { slug: 'sbi-card-elite', name: 'SBI Card ELITE', category: 'credit_card', provider_name: 'SBI Card' },
            { slug: 'zerodha-kite', name: 'Zerodha Kite', category: 'broker', provider_name: 'Zerodha' }
        ]);

    console.log('Result:', data);
    if (error) console.error('CRITICAL ERROR:', JSON.stringify(error, null, 2));
    else console.log('✅ INSERT SUCCESSFUL');
}

seed();
