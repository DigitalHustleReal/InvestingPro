
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { api } from '@/lib/api';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MONEY_PRODUCTS = [
    { slug: 'hdfc-regalia-gold', name: 'HDFC Regalia Gold', category: 'credit_card', provider: 'HDFC Bank' },
    { slug: 'sbi-card-elite', name: 'SBI Card ELITE', category: 'credit_card', provider: 'SBI Card' },
    { slug: 'axis-magnus', name: 'Axis Bank Magnus', category: 'credit_card', provider: 'Axis Bank' },
    { slug: 'zerodha-kite', name: 'Zerodha Kite', category: 'stock', provider: 'Zerodha' },
    { slug: 'groww-stocks', name: 'Groww Stocks', category: 'stock', provider: 'Groww' },
    { slug: 'kreditbee-loan', name: 'KreditBee Loan', category: 'personal_loan', provider: 'KreditBee' }
];

async function sync() {
    console.log("💰 SECURING MONEY PRODUCTS...");
    
    for (const item of MONEY_PRODUCTS) {
        console.log(`📡 Syncing ${item.name}...`);
        
        // Use standard columns first
        const payload: any = {
            slug: item.slug,
            name: item.name,
            category: item.category,
            provider_name: item.provider,
            is_active: true
        };

        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'slug' });
        
        if (error) console.error(`   ❌ Failed: ${error.message}`);
        else console.log(`   ✅ Synced: ${item.name}`);
    }
    console.log("🚀 Monetization Loop Ready.");
}

sync();
