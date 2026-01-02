
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resilientSeed() {
    console.log("🛡️ Starting Resilient Seed...");
    
    const products = [
        { slug: 'hdfc-regalia', name: 'HDFC Regalia Gold', type: 'credit_card', provider: 'HDFC Bank' },
        { slug: 'zerodha', name: 'Zerodha Kite', type: 'stock', provider: 'Zerodha' }
    ];

    for (const p of products) {
        // Try multiple column name combinations to bypass schema cache issues
        const payload: any = { slug: p.slug, name: p.name };
        
        // Try 'category' then 'product_type'
        payload.category = p.type;
        payload.product_type = p.type;
        
        // Try 'provider_name' then 'provider'
        payload.provider_name = p.provider;
        payload.provider = p.provider;

        console.log(`📡 Trying ${p.name}...`);
        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'slug' });
        
        if (error) {
            console.log(`   ⚠️ Failed with full payload: ${error.message}. Retrying minimal...`);
            // Minimal attempt
            await supabase.from('products').upsert({ slug: p.slug, name: p.name, product_type: p.type, provider: p.provider }, { onConflict: 'slug' });
        } else {
            console.log(`   ✅ Success: ${p.name}`);
        }
    }
}

resilientSeed();
