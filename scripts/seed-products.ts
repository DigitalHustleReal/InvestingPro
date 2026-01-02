
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS = [
    // Credit Cards
    {
        name: 'HDFC Regalia Gold',
        slug: 'hdfc-regalia-gold',
        category: 'credit_card',
        provider_name: 'HDFC Bank',
        description: 'Premium travel and lifestyle credit card with extensive lounge access.',
        image_url: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/c6f7b1b3-4043-4670-82af-5f6c8d626388/Regalia_Gold_Credit_Card_264x167.png',
        rating: 4.5,
        features: {
            annual_fee: '₹2,500',
            reward_rate: '4%',
            lounge_access: '12 Domestic + 6 International',
            forex_markup: '2%'
        },
        pros: ['Low Forex Markup', 'Excellent Lounge Access', 'Milestone Benefits'],
        cons: ['High Annual Fee waiver threshold', 'No Golf lessons']
    },
    {
        name: 'SBI Card Elite',
        slug: 'sbi-card-elite',
        category: 'credit_card',
        provider_name: 'SBI Card',
        description: 'All-rounder premium card with movie tickets and shopping rewards.',
        image_url: 'https://www.sbicard.com/sbi-card-en/assets/media/images/personal/credit-cards/lifestyle/sbi-card-elite/card-face-elite.png',
        rating: 4.2,
        features: {
            annual_fee: '₹4,999',
            reward_rate: '2.5%',
            lounge_access: '2 Domestic/Quarter + 6 Int/Year',
            forex_markup: '1.99%'
        },
        pros: ['Free Movie Tickets', 'Low Forex Markup', 'Welcome Gift'],
        cons: ['Reward redemption fee', 'High Annual Fee']
    },
    {
        name: 'Axis Magnus',
        slug: 'axis-magnus',
        category: 'credit_card',
        provider_name: 'Axis Bank',
        description: 'super-premium card for high spenders with unlimited lounge access.',
        image_url: 'https://www.axisbank.com/images/default-source/revamp-new/cards/credit-cards/desktop/magnus-credit-card.png',
        rating: 4.8,
        features: {
            annual_fee: '₹12,500',
            reward_rate: '6%',
            lounge_access: 'Unlimited Domestic & International',
            forex_markup: '2%'
        },
        pros: ['Unlimited Lounge Access', '25K Monthly Milestone', 'Airport Concierge'],
        cons: ['Very High Fee', 'Devalued recently']
    },
    {
        name: 'ICICI Sapphiro',
        slug: 'icici-sapphiro',
        category: 'credit_card',
        provider_name: 'ICICI Bank',
        description: 'Premium lifestyle card with BOGO movie offers and golf privileges.',
        image_url: 'https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/personal-banking/cards/credit-cards/sapphiro-credit-card-new.png',
        rating: 4.0,
        features: {
            annual_fee: '₹6,500',
            reward_rate: '2%',
            lounge_access: '4 Domestic/Quarter + 2 Int/Year',
            forex_markup: '3.5%'
        },
        pros: ['BOGO Movie Tickets', 'Golf Rounds', 'Dreamfolks Membership'],
        cons: ['High Forex Markup', 'Lower Reward Rate']
    },

    // Brokers
    {
        name: 'Zerodha Kite',
        slug: 'zerodha',
        category: 'broker',
        provider_name: 'Zerodha',
        description: 'India\'s #1 Discount Broker with robust technology.',
        image_url: 'https://zerodha.com/static/images/logo.svg',
        rating: 4.9,
        features: {
            delivery_brokerage: '₹0',
            intraday_brokerage: '₹20',
            amc: '₹300',
            account_opening: '₹200'
        },
        pros: ['Clean Interface', 'Huge Community', 'Reliable API'],
        cons: ['No Advisory', 'Account Opening Fee', 'Occasional Glitches']
    },
    {
        name: 'Groww',
        slug: 'groww',
        category: 'broker',
        provider_name: 'Groww',
        description: 'Simple and easy-to-use investment app for beginners.',
        image_url: 'https://groww.in/groww-logo-270.png',
        rating: 4.6,
        features: {
            delivery_brokerage: '₹20',
            intraday_brokerage: '₹20',
            amc: '₹0',
            account_opening: '₹0'
        },
        pros: ['Free AMC', 'Beginner Friendly', 'Mutual Funds Integration'],
        cons: ['Higher Delivery Charges', 'Basic Charts']
    }
];

async function seed() {
    console.log('🌱 Seeding Products...');
    
    // Upsert products based on slug
    for (const p of PRODUCTS) {
        const { error } = await supabase
            .from('products')
            .upsert(p, { onConflict: 'slug' });
            
        if (error) console.error(`❌ Failed to seed ${p.name}:`, error.message);
        else console.log(`✅ Seeded: ${p.name}`);
    }
    console.log('✨ Seeding Complete!');
}

seed().catch(console.error);
