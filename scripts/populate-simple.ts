/**
 * Simplified Product Population
 * Works with basic products schema
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRODUCTS = [
    // Credit Cards
    { name: "HDFC Regalia Gold Credit Card", category: "credit_card", provider: "HDFC Bank", rating: 4.6 },
    { name: "SBI Card ELITE", category: "credit_card", provider: "SBI Cards", rating: 4.7 },
    { name: "Axis Magnus Credit Card", category: "credit_card", provider: "Axis Bank", rating: 4.8 },
    { name: "AMEX Platinum Travel", category: "credit_card", provider: "American Express", rating: 4.5 },
    { name: "ICICI Sapphiro Credit Card", category: "credit_card", provider: "ICICI Bank", rating: 4.4 },
    { name: "Amazon Pay ICICI Credit Card", category: "credit_card", provider: "ICICI Bank", rating: 4.6 },
    { name: "Flipkart Axis Bank Credit Card", category: "credit_card", provider: "Axis Bank", rating: 4.5 },
    { name: "HDFC MoneyBack+ Credit Card", category: "credit_card", provider: "HDFC Bank", rating: 4.3 },
    { name: "IndusInd Iconia Amex Card", category: "credit_card", provider: "IndusInd Bank", rating: 4.4 },
    { name: "Axis ACE Credit Card", category: "credit_card", provider: "Axis Bank", rating: 4.5 },
    
    // Loans
    { name: "SBI Home Loan", category: "loan", provider: "State Bank of India", rating: 4.5 },
    { name: "HDFC Home Loan", category: "loan", provider: "HDFC Bank", rating: 4.6 },
    { name: "ICICI Home Loan", category: "loan", provider: "ICICI Bank", rating: 4.4 },
    { name: "SBI Personal Loan", category: "loan", provider: "State Bank of India", rating: 4.3 },
    { name: "HDFC Personal Loan", category: "loan", provider: "HDFC Bank", rating: 4.4 },
    { name: "Bajaj Finserv Personal Loan", category: "loan", provider: "Bajaj Finserv", rating: 4.2 },
    { name: "SBI Car Loan", category: "loan", provider: "State Bank of India", rating: 4.4 },
    { name: "HDFC Car Loan", category: "loan", provider: "HDFC Bank", rating: 4.5 },
    { name: "HDFC Credila Education Loan", category: "loan", provider: "HDFC Credila", rating: 4.5 },
    { name: "Muthoot Gold Loan", category: "loan", provider: "Muthoot Finance", rating: 4.3 },
    
    // Insurance
    { name: "Star Health Comprehensive Insurance", category: "insurance", provider: "Star Health", rating: 4.5 },
    { name: "HDFC Ergo Health Insurance", category: "insurance", provider: "HDFC Ergo", rating: 4.4 },
    { name: "ICICI Lombard Health Insurance", category: "insurance", provider: "ICICI Lombard", rating: 4.3 },
    { name: "HDFC Life Click 2 Protect Term Plan", category: "insurance", provider: "HDFC Life", rating: 4.6 },
    { name: "LIC Jeevan Anand", category: "insurance", provider: "LIC", rating: 4.3 },
    { name: "SBI Life eShield Term Plan", category: "insurance", provider: "SBI Life", rating: 4.4 },
    { name: "Max Bupa Health Insurance", category: "insurance", provider: "Max Bupa", rating: 4.5 },
    { name: "HDFC Ergo Car Insurance", category: "insurance", provider: "HDFC Ergo", rating: 4.3 },
    
    // Mutual Funds
    { name: "HDFC Flexi Cap Fund", category: "mutual_fund", provider: "HDFC AMC", rating: 4.7 },
    { name: "ICICI Prudential Bluechip Fund", category: "mutual_fund", provider: "ICICI Prudential AMC", rating: 4.6 },
    { name: "SBI Small Cap Fund", category: "mutual_fund", provider: "SBI Mutual Fund", rating: 4.5 },
    { name: "Axis Bluechip Fund", category: "mutual_fund", provider: "Axis AMC", rating: 4.6 },
    { name: "Mirae Asset Large Cap Fund", category: "mutual_fund", provider: "Mirae Asset", rating: 4.7 },
    { name: "Parag Parikh Flexi Cap Fund", category: "mutual_fund", provider: "PPFAS AMC", rating: 4.8 },
    
    // Brokers
    { name: "Zerodha Kite", category: "broker", provider: "Zerodha", rating: 4.8 },
    { name: "Groww", category: "broker", provider: "Groww", rating: 4.6 },
    { name: "Upstox Pro", category: "broker", provider: "Upstox", rating: 4.5 },
    { name: "Angel One", category: "broker", provider: "Angel One", rating: 4.4 },
    { name: "5Paisa", category: "broker", provider: "5Paisa", rating: 4.3 },
    { name: "ICICI Direct", category: "broker", provider: "ICICI Securities", rating: 4.5 },
];

async function populate() {
    console.log('🚀 Populating products...\\n');
    
    let success = 0;
    
    for (const p of PRODUCTS) {
        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        process.stdout.write(`  ${p.name}... `);
        
        const { error } = await supabase.from('products').upsert({
            slug,
            name: p.name,
            category: p.category,
            provider_name: p.provider,
            description: `Premium ${p.category.replace('_', ' ')} offering from ${p.provider} with competitive rates and excellent service.`,
            rating: p.rating,
            features: {
                provider: p.provider,
                category: p.category
            },
            pros: ["Competitive rates", "Good service", "Trusted brand", "Easy process"],
            cons: ["Eligibility criteria apply", "Terms apply", "Subject to approval"],
            image_url: `https://via.placeholder.com/400x250/0f172a/10b981?text=${encodeURIComponent(p.provider)}`,
            is_active: true,
            trust_score: Math.floor(p.rating * 20)
        }, { onConflict: 'slug' });
        
        if (!error) {
            console.log('✅');
            success++;
        } else {
            console.log('❌');
        }
    }
    
    console.log(`\\n✨ Populated ${success} products!`);
}

populate().catch(console.error);
