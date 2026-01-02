
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRODUCTS = [
    { slug: 'hdfc-regalia-gold', name: 'HDFC Regalia Gold', cat: 'credit_card', prov: 'HDFC Bank' },
    { slug: 'sbi-card-elite', name: 'SBI Card ELITE', cat: 'credit_card', prov: 'SBI Card' },
    { slug: 'axis-magnus', name: 'Axis Bank Magnus', cat: 'credit_card', prov: 'Axis Bank' },
    { slug: 'amazon-pay-icici', name: 'Amazon Pay ICICI', cat: 'credit_card', prov: 'ICICI Bank' },
    { slug: 'sbi-cashback', name: 'SBI Cashback Card', cat: 'credit_card', prov: 'SBI Card' },
    { slug: 'amex-plat-travel', name: 'Amex Platinum Travel', cat: 'credit_card', prov: 'American Express' },
    { slug: 'zerodha-kite', name: 'Zerodha Kite', cat: 'broker', prov: 'Zerodha' },
    { slug: 'groww-stocks', name: 'Groww Stocks', cat: 'broker', prov: 'Groww' },
    { slug: 'angel-one', name: 'Angel One', cat: 'broker', prov: 'Angel One' },
    { slug: 'hdfc-home-loan', name: 'HDFC Home Loan', cat: 'loan', prov: 'HDFC Bank' },
    { slug: 'sbi-home-loan', name: 'SBI Home Loan', cat: 'loan', prov: 'SBI' },
    { slug: 'kreditbee-personal', name: 'KreditBee Personal', cat: 'loan', prov: 'KreditBee' },
    { slug: 'hdfc-life-term', name: 'HDFC Life Term', cat: 'insurance', prov: 'HDFC Life' },
    { slug: 'niva-bupa-health', name: 'Niva Bupa Health', cat: 'insurance', prov: 'Niva Bupa' },
    { slug: 'quant-small-cap', name: 'Quant Small Cap', cat: 'mutual_fund', prov: 'Quant MF' },
    { slug: 'parag-parikh-flexi', name: 'Parag Parikh Flexi', cat: 'mutual_fund', prov: 'PPFAS MF' }
];

async function run() {
    console.log("🛠️ Running Forced Minimal Sync...");
    for (const p of PRODUCTS) {
        const payload: any = { 
            slug: p.slug, 
            name: p.name,
            category: p.cat,
            product_type: p.cat,
            provider_name: p.prov,
            provider: p.prov,
            is_active: true
        };
        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'slug' });
        if (error) console.log(`❌ Fail ${p.name}: ${error.message}`);
        else console.log(`✅ OK ${p.name}`);
    }
}
run();
