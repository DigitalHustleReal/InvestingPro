
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DUMMY_PRODUCTS = [
    // Mutual Funds
    {
        name: 'HDFC Flexi Cap Fund',
        slug: 'hdfc-flexi-cap-fund',
        category: 'mutual_fund',
        provider_name: 'HDFC Mutual Fund',
        description: 'Open-ended dynamic equity scheme investing across large cap, mid cap, small cap stocks.',
        image_url: 'https://via.placeholder.com/400x250/0f172a/10b981?text=HDFC+Flexi+Cap',
        rating: 4.8,
        features: { expense_ratio: '1.65%', exit_load: '1%', aum: '₹35,000 Cr' },
        pros: ['Consistent returns', 'Experienced fund manager'],
        cons: ['High expense ratio'],
        is_active: true,
        verification_status: 'verified',
        trust_score: 95
    },
    // Loans
    {
        name: 'SBI Persona Loan',
        slug: 'sbi-personal-loan',
        category: 'loan',
        provider_name: 'State Bank of India',
        description: 'Low interest personal loans for salary account holders.',
        image_url: 'https://via.placeholder.com/400x250/0f172a/3b82f6?text=SBI+Loan',
        rating: 4.5,
        features: { interest_rate: '11.00%', processing_fee: '1%', tenure: '1-5 Years' },
        pros: ['Low interest rates', 'Quick processing for SBI customers'],
        cons: ['Strict documentation'],
        is_active: true,
        verification_status: 'verified',
        trust_score: 92
    },
    // Insurance
    {
        name: 'HDFC Ergo Optima Restore',
        slug: 'hdfc-ergo-optima-restore',
        category: 'insurance',
        provider_name: 'HDFC Ergo',
        description: 'Comprehensive health insurance plan with restore benefit.',
        image_url: 'https://via.placeholder.com/400x250/0f172a/ef4444?text=HDFC+Insurance',
        rating: 4.7,
        features: { cover: '₹5L - ₹50L', cashless_hospitals: '12000+', restore_benefit: '100%' },
        pros: ['Automatic restoration of sum insured', 'No claim bonus'],
        cons: ['Premiums can be higher'],
        is_active: true,
        verification_status: 'verified',
        trust_score: 94
    },
    // Brokers
    {
        name: 'Zerodha Kite',
        slug: 'zerodha-kite',
        category: 'broker',
        provider_name: 'Zerodha',
        description: 'India\'s largest stock broker offered completely online.',
        image_url: 'https://via.placeholder.com/400x250/0f172a/f59e0b?text=Zerodha',
        rating: 4.9,
        features: { equity_delivery: '₹0', intraday: '₹20', account_opening: '₹200' },
        pros: ['Zero brokerage on delivery', 'Robust platform'],
        cons: ['No advisory service'],
        is_active: true,
        verification_status: 'verified',
        trust_score: 98
    }
];

async function seed() {
    console.log('🌱 Seeding Dummy Products...');
    
    for (const p of DUMMY_PRODUCTS) {
        const { error } = await supabase
            .from('products')
            .upsert(p, { onConflict: 'slug' });
            
        if (error) console.error(`❌ Failed to seed ${p.name}:`, error.message);
        else console.log(`✅ Seeded: ${p.name}`);
    }
    console.log('✨ Seeding Complete!');
}

seed().catch(console.error);
