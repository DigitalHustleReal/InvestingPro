
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MONEY_PRODUCTS = [
    { name: "HDFC Regalia Gold", category: "credit_card", provider: "HDFC Bank", slug: "hdfc-regalia-gold" },
    { name: "SBI Card ELITE", category: "credit_card", provider: "SBI Card", slug: "sbi-card-elite" },
    { name: "Axis Bank Magnus", category: "credit_card", provider: "Axis Bank", slug: "axis-magnus" },
    { name: "Zerodha Kite", category: "stock", provider: "Zerodha", slug: "zerodha-kite" }, // Map to 'stock'
    { name: "Groww Stocks", category: "stock", provider: "Groww", slug: "groww-stocks" }, // Map to 'stock'
    { name: "KreditBee", category: "personal_loan", provider: "KreditBee", slug: "kreditbee-personal-loan" } // Map to 'personal_loan'
];

async function seed() {
    console.log("🌱 Seeding with Legacy Constraint Compatibility...");
    
    for (const item of MONEY_PRODUCTS) {
        console.log(`📡 Upserting: ${item.name}`);
        
        const { error } = await supabase
            .from('products')
            .upsert({
                slug: item.slug,
                name: item.name,
                category: item.category, // Matches legacy constraint
                provider_name: item.provider,
                description: `Premium ${item.category.replace('_', ' ')} for 2026.`,
                rating: 4.7,
                is_active: true,
                verification_status: 'verified',
                trust_score: 95
            }, { onConflict: 'slug' });

        if (error) console.error(`❌ FAILED ${item.name}:`, error.message);
        else console.log(`✅ SUCCESS ${item.name}`);
    }
}

seed();
