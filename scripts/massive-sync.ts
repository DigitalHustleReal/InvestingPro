
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DATA = [
    // CREDIT CARDS
    {
        slug: 'hdfc-regalia-gold',
        name: 'HDFC Regalia Gold',
        category: 'credit_card',
        provider_name: 'HDFC Bank',
        description: 'The ultimate travel and lifestyle credit card with premium lounge access and reward points.',
        rating: 4.5,
        pros: ['Free lounge access', 'High reward rate on flights', 'Milestone benefits', 'Low forex markup'],
        cons: ['High annual fee', 'Points redemption fees', 'Strict eligibility'],
        features: { 'fee': '₹2500', 'rewards': '4 points per ₹150', 'lounge': 'Unlimited Domestic' },
        official_link: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'
    },
    {
        slug: 'sbi-card-elite',
        name: 'SBI Card ELITE',
        category: 'credit_card',
        provider_name: 'SBI Card',
        description: 'Luxury credit card offering movie tickets, lounge access, and milestone rewards.',
        rating: 4.3,
        pros: ['Free movie tickets every month', 'Welcome gift vouchers', 'Trident Privilege membership', 'Club Vistara membership'],
        cons: ['Very high annual fee', 'Reward rate is average', 'High interest rates'],
        features: { 'fee': '₹4999', 'rewards': '2 points per ₹100', 'lounge': '6 International/year' },
        official_link: 'https://www.sbicard.com/en/personal/credit-cards/lifestyle/sbi-card-elite.page'
    },
    {
        slug: 'axis-magnus',
        name: 'Axis Bank Magnus',
        category: 'credit_card',
        provider_name: 'Axis Bank',
        description: 'A legendary premium card for high spenders with exceptional mile transfer ratios.',
        rating: 4.6,
        pros: ['Unmatched mile transfer', 'Unlimited lounge access', 'Concierge services', 'Luxury hotel benefits'],
        cons: ['Recent devaluation', 'High spend requirement for fee waiver', 'Complex redemption'],
        features: { 'fee': '₹12500', 'rewards': '12 points per ₹200', 'lounge': 'Unlimited Int + Dom' },
        official_link: 'https://www.axisbank.com/retail/cards/credit-card/magnus-credit-card'
    },
    {
        slug: 'amazon-pay-icici',
        name: 'Amazon Pay ICICI',
        category: 'credit_card',
        provider_name: 'ICICI Bank',
        description: 'The best literal cashback card for Amazon Prime members with zero annual fees.',
        rating: 4.8,
        pros: ['Lifetime free card', '5% flat cashback on Amazon', 'No redemption capping', 'Simple as cash'],
        cons: ['Only for Amazon users', 'No lounge access', 'Average rewards elsewhere'],
        features: { 'fee': '₹0', 'rewards': '5% on Amazon', 'lounge': 'None' },
        official_link: 'https://www.amazon.in/cbcc/main'
    },
    {
        slug: 'sbi-cashback',
        name: 'SBI Cashback Card',
        category: 'credit_card',
        provider_name: 'SBI Card',
        description: 'Most powerful cashback card for online spends across any platform.',
        rating: 4.7,
        pros: ['5% cashback on online spends', 'No merchant restrictions', 'Simple monthly credit', 'Low fee'],
        cons: ['No lounge access', 'Low monthly capping', 'No rewards on rent/utility'],
        features: { 'fee': '₹999', 'rewards': '5% online', 'lounge': 'None' },
        official_link: 'https://www.sbicard.com/en/personal/credit-cards/cashback/cashback-sbi-card.page'
    },
    {
        slug: 'amex-platinum-travel',
        name: 'Amex Platinum Travel',
        category: 'credit_card',
        provider_name: 'American Express',
        description: 'Elite travel card known for huge milestone bonuses and premium service.',
        rating: 4.4,
        pros: ['Huge 40k bonus points', 'Taj gift stay vouchers', 'Best-in-class service', 'Safe card'],
        cons: ['Low acceptance at small shops', 'High annual fee', 'No lounge access outside milestones'],
        features: { 'fee': '₹5000', 'rewards': '1 point per ₹50', 'lounge': '8 Domestic/year' },
        official_link: 'https://www.americanexpress.com/in/credit-cards/platinum-travel-card/'
    },
    // BROKERS
    {
        slug: 'zerodha-kite',
        name: 'Zerodha Kite',
        category: 'broker',
        provider_name: 'Zerodha',
        description: 'India\'s largest and most trusted discount broker with a clean, powerful interface.',
        rating: 4.9,
        pros: ['Zero brokerage on delivery', 'Cleanest UI in India', 'Direct Mutual Funds', 'Huge community'],
        cons: ['Maintenance charges apply', 'No advisory services', 'Kite can go down during peak volume'],
        features: { 'delivery': '₹0', 'intraday': '₹20 or 0.03%', 'amc': '₹300/year' },
        official_link: 'https://zerodha.com/'
    },
    {
        slug: 'groww',
        name: 'Groww',
        category: 'broker',
        provider_name: 'Groww',
        description: 'Simplest investment platform for beginners to start with stocks and mutual funds.',
        rating: 4.7,
        pros: ['Zero account opening fee', 'Ultra-simple UI', 'Integrated paperless KYC', 'Fast support'],
        cons: ['Brokerage on delivery (low)', 'Limited advanced charting', 'Basic app for pro traders'],
        features: { 'delivery': '₹20 or 0.05%', 'intraday': '₹20', 'amc': '₹0' },
        official_link: 'https://groww.in/'
    },
    {
        slug: 'angel-one',
        name: 'Angel One',
        category: 'broker',
        provider_name: 'Angel One',
        description: 'Full-service features at discount prices with advanced trading tools.',
        rating: 4.5,
        pros: ['Professional trading tools', 'ARQ Prime advisory', 'Margin trade funding', 'Fast execution'],
        cons: ['App can be cluttered', 'High charges for advisory', 'Pushy notifications'],
        features: { 'delivery': '₹0', 'intraday': '₹20', 'amc': '₹0 for 1st year' },
        official_link: 'https://www.angelone.in/'
    },
    // LOANS
    {
        slug: 'hdfc-home-loan',
        name: 'HDFC Home Loan',
        category: 'loan',
        provider_name: 'HDFC Bank',
        description: 'Trusted home financing with competitive rates and fast processing.',
        rating: 4.4,
        pros: ['Nationwide presence', 'Flexible repayment', 'Digital processing', 'Low ROI'],
        cons: ['Processing fees apply', 'Strict documentation', 'Long approval time'],
        features: { 'roi': '8.50% onwards', 'tenure': 'Up to 30 years', 'processing': '0.50%' },
        official_link: 'https://www.hdfc.com/home-loans'
    },
    {
        slug: 'kreditbee-loan',
        name: 'KreditBee Personal Loan',
        category: 'loan',
        provider_name: 'KreditBee',
        description: 'Instant personal loans for young professionals with minimal documentation.',
        rating: 4.2,
        pros: ['10-min approval', 'No collateral', 'Low credit score accepted', 'Full digital'],
        cons: ['High interest rates', 'Short tenure', 'High processing fees'],
        features: { 'roi': '12%-29%', 'tenure': '3-24 months', 'max_amount': '₹5 Lakhs' },
        official_link: 'https://www.kreditbee.in/'
    },
    // INSURANCE
    {
        slug: 'hdfc-life-term',
        name: 'HDFC Life Click 2 Protect',
        category: 'insurance',
        provider_name: 'HDFC Life',
        description: 'One of India\'s most reliable term insurance plans with a high claim settlement ratio.',
        rating: 4.8,
        pros: ['High claim ratio (99%+)', 'Flexible cover options', 'Critical illness riders', 'Trusted brand'],
        cons: ['Higher premium than peers', 'Rigid medical checks', 'Slow digital portal'],
        features: { 'claim_ratio': '99.5%', 'max_age': '85 years', 'riders': 'Available' },
        official_link: 'https://www.hdfclife.com/'
    },
    {
        slug: 'niva-bupa-health',
        name: 'Niva Bupa ReAssure',
        category: 'insurance',
        provider_name: 'Niva Bupa',
        description: 'Modern health insurance with "reassure" benefit that refills your cover.',
        rating: 4.6,
        pros: ['Unlimited refill', 'No-claim bonus+', 'Cashless at 10k+ hospitals', 'Modern app'],
        cons: ['Capping on some rooms', 'Premium hikes on age', 'TPA delays'],
        features: { 'cashless': '10,000+', 'waiting_period': '2-4 years', 'refill': 'Unlimited' },
        official_link: 'https://www.nivabupa.com/'
    }
];

async function run() {
    console.log(`🚀 MASSIVE SYNC: POPULATING ${DATA.length} TOP-TIER PRODUCTS...`);
    
    for (const p of DATA) {
        console.log(`📡 Inserting: ${p.name}`);
        const { error } = await supabase.from('products').upsert({
            ...p,
            product_type: p.category, // Legacy
            provider: p.provider_name, // Legacy
            is_active: true,
            last_verified_at: new Date().toISOString(),
            verification_status: 'verified',
            trust_score: 98
        }, { onConflict: 'slug' });

        if (error) console.error(`   ❌ Failed: ${error.message}`);
        else console.log(`   ✅ Success: ${p.name}`);
    }
    console.log("\n✨ DATABASE IS NOW RICH WITH FINANCIAL PRODUCTS.");
}

run();
