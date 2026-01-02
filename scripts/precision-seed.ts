
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PERFECT_DATA = [
    { slug: 'hdfc-regalia-gold', name: 'HDFC Regalia Gold', type: 'credit_card', prov: 'HDFC Bank' },
    { slug: 'sbi-card-elite', name: 'SBI Card ELITE', type: 'credit_card', prov: 'SBI Card' },
    { slug: 'axis-magnus-card', name: 'Axis Bank Magnus', type: 'credit_card', prov: 'Axis Bank' },
    { slug: 'amazon-pay-icici', name: 'Amazon Pay ICICI Card', type: 'credit_card', prov: 'ICICI Bank' },
    { slug: 'zerodha-kite-app', name: 'Zerodha Kite', type: 'stock', prov: 'Zerodha' },
    { slug: 'groww-stocks-app', name: 'Groww Stocks', type: 'stock', prov: 'Groww' },
    { slug: 'hdfc-home-loan-2026', name: 'HDFC Home Loan', type: 'personal_loan', prov: 'HDFC Bank' },
    { slug: 'sbi-home-loan-2026', name: 'SBI Home Loan', type: 'personal_loan', prov: 'SBI' },
    { slug: 'hdfc-life-term-insurance', name: 'HDFC Life Term Insurance', type: 'insurance', prov: 'HDFC Life' },
    { slug: 'niva-bupa-health-plan', name: 'Niva Bupa Health Insurance', type: 'insurance', prov: 'Niva Bupa' },
    { slug: 'parag-parikh-flexi-fund', name: 'Parag Parikh Flexi Cap', type: 'mutual_fund', prov: 'PPFAS MF' },
    { slug: 'quant-small-cap-fund', name: 'Quant Small Cap Fund', type: 'mutual_fund', prov: 'Quant MF' }
];

async function run() {
    console.log("🎯 Final Precision Seed...");
    for (const p of PERFECT_DATA) {
        // We use ONLY the columns we are 100% sure the API sees and passes constraints
        const { error } = await supabase.from('products').upsert({
            slug: p.slug,
            name: p.name,
            product_type: p.type,
            provider: p.prov,
            is_active: true
        }, { onConflict: 'slug' });
        
        if (error) console.log(`❌ ${p.name}: ${error.message}`);
        else console.log(`✅ ${p.name}`);
    }
    console.log("✨ Done.");
}
run();
