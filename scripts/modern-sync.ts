
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DATA = [
    { slug: 'hdfc-regalia-gold', name: 'HDFC Regalia Gold', cat: 'credit_card', prov: 'HDFC Bank' },
    { slug: 'sbi-card-elite', name: 'SBI Card ELITE', cat: 'credit_card', prov: 'SBI Card' },
    { slug: 'axis-magnus', name: 'Axis Bank Magnus', cat: 'credit_card', prov: 'Axis Bank' },
    { slug: 'amazon-pay-icici', name: 'Amazon Pay ICICI Card', cat: 'credit_card', prov: 'ICICI Bank' },
    { slug: 'sbi-cashback', name: 'SBI Cashback Card', cat: 'credit_card', prov: 'SBI Card' },
    { slug: 'amex-plat-travel', name: 'Amex Platinum Travel', cat: 'credit_card', prov: 'American Express' },
    { slug: 'zerodha-kite', name: 'Zerodha Kite', cat: 'broker', prov: 'Zerodha' },
    { slug: 'groww-stocks', name: 'Groww Stocks', cat: 'broker', prov: 'Groww' },
    { slug: 'angel-one', name: 'Angel One', cat: 'broker', prov: 'Angel One' },
    { slug: 'upstox-pro', name: 'Upstox Pro', cat: 'broker', prov: 'Upstox' },
    { slug: 'hdfc-home-loan', name: 'HDFC Home Loan', cat: 'loan', prov: 'HDFC Bank' },
    { slug: 'sbi-home-loan', name: 'SBI Home Loan', cat: 'loan', prov: 'SBI' },
    { slug: 'lic-housing-loan', name: 'LIC Housing Finance', cat: 'loan', prov: 'LIC' },
    { slug: 'kreditbee-instant', name: 'KreditBee Instant Loan', cat: 'loan', prov: 'KreditBee' },
    { slug: 'hdfc-life-protect', name: 'HDFC Life Click 2 Protect', cat: 'insurance', prov: 'HDFC Life' },
    { slug: 'niva-bupa-reassure', name: 'Niva Bupa ReAssure', cat: 'insurance', prov: 'Niva Bupa' },
    { slug: 'care-health-supreme', name: 'Care Health Supreme', cat: 'insurance', prov: 'Care Health' },
    { slug: 'parag-parikh-flexi', name: 'Parag Parikh Flexi Cap', cat: 'mutual_fund', prov: 'PPFAS MF' },
    { slug: 'quant-small-cap', name: 'Quant Small Cap Fund', cat: 'mutual_fund', prov: 'Quant MF' },
    { slug: 'sbi-bluechip-fund', name: 'SBI Bluechip Fund', cat: 'mutual_fund', prov: 'SBI MF' }
];

async function run() {
    console.log("🚀 MODERN TOTAL SYNC...");
    for (const p of DATA) {
        const { error } = await supabase.from('products').upsert({
            slug: p.slug,
            name: p.name,
            category: p.cat,
            provider_name: p.prov,
            is_active: true
        }, { onConflict: 'slug' });
        
        if (error) console.log(`❌ ${p.name}: ${error.message}`);
        else console.log(`✅ ${p.name}`);
    }
    console.log("✨ ALL MONEY PRODUCTS ARE NOW LIVE.");
}
run();
