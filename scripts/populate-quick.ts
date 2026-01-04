/**
 * Quick Product Population (No AI Required)
 * Uses realistic mock data instead of AI generation
 * Run this to quickly populate the database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Sample products with realistic data
const PRODUCTS = [
    // Credit Cards
    { name: "HDFC Regalia Gold", category: "credit_card", provider: "HDFC Bank", fee: "₹2,500", reward: "4 pts/₹150", rating: 4.6 },
    { name: "SBI Card ELITE", category: "credit_card", provider: "SBI Cards", fee: "₹4,999", reward: "5 pts/₹150", rating: 4.7 },
    { name: "Axis Magnus", category: "credit_card", provider: "Axis Bank", fee: "₹10,000", reward: "12 pts/₹200", rating: 4.8 },
    { name: "AMEX Platinum Travel", category: "credit_card", provider: "American Express", fee: "₹3,500", reward: "1000 MR pts", rating: 4.5 },
    { name: "ICICI Sapphiro", category: "credit_card", provider: "ICICI Bank", fee: "₹3,500", reward: "3.5 pts/₹100", rating: 4.4 },
    { name: "Amazon Pay ICICI", category: "credit_card", provider: "ICICI Bank", fee: "Nil", reward: "5% cashback", rating: 4.6 },
    { name: "Flipkart Axis", category: "credit_card", provider: "Axis Bank", fee: "₹500", reward: "4% cashback", rating: 4.5 },
    { name: "HDFC MoneyBack+", category: "credit_card", provider: "HDFC Bank", fee: "₹500", reward: "10X rewards", rating: 4.3 },
    
    // Loans
    {name: "SBI Home Loan", category: "loan", provider: "SBI", fee: "0.5% processing", reward: "8.50% p.a.", rating: 4.5 },
    { name: "HDFC Home Loan", category: "loan", provider: "HDFC Bank", fee: "0.5% processing", reward: "8.60% p.a.", rating: 4.6 },
    { name: "ICICI Home Loan", category: "loan", provider: "ICICI Bank", fee: "0.5% processing", reward: "8.75% p.a.", rating: 4.4 },
    { name: "SBI Personal Loan", category: "loan", provider: "SBI", fee: "1% processing", reward: "10.50% p.a.", rating: 4.3 },
    { name: "HDFC Personal Loan", category: "loan", provider: "HDFC Bank", fee: "Up to 2%", reward: "10.75% p.a.", rating: 4.4 },
    
    // Insurance
    { name: "Star Health Comprehensive", category: "insurance", provider: "Star Health", fee: "₹15,000/year", reward: "₹10L coverage", rating: 4.5 },
    { name: "HDFC Ergo Health", category: "insurance", provider: "HDFC Ergo", fee: "₹12,000/year", reward: "₹5L coverage", rating: 4.4 },
    { name: "HDFC Life Click 2 Protect", category: "insurance", provider: "HDFC Life", fee: "₹10,000/year", reward: "₹1Cr coverage", rating: 4.6 },
    { name: "LIC Jeevan Anand", category: "insurance", provider: "LIC", fee: "₹25,000/year", reward: "₹25L maturity", rating: 4.3 },
    
    // Mutual Funds
    { name: "HDFC Flexi Cap Fund", category: "mutual_fund", provider: "HDFC AMC", fee: "1.75% expense", reward: "18% CAGR", rating: 4.7 },
    { name: "ICICI Pru Bluechip Fund", category: "mutual_fund", provider: "ICICI Prudential", fee: "1.9% expense", reward: "16% CAGR", rating: 4.6 },
    { name: "SBI Small Cap Fund", category: "mutual_fund", provider: "SBI Mutual Fund", fee: "1.5% expense", reward: "22% CAGR", rating: 4.5 },
    { name: "Axis Bluechip Fund", category: "mutual_fund", provider: "Axis AMC", fee: "1.65% expense", reward: "17% CAGR", rating: 4.6 },
    
    // Brokers  
    { name: "Zerodha Kite", category: "broker", provider: "Zerodha", fee: "₹0 equity", reward: "₹20 F&O", rating: 4.8 },
    { name: "Groww Stocks", category: "broker", provider: "Groww", fee: "₹0 equity", reward: "₹20 F&O", rating: 4.6 },
    { name: "Upstox Pro", category: "broker", provider: "Upstox", fee: "₹0 equity", reward: "₹20 F&O", rating: 4.5 },
    { name: "Angel One", category: "broker", provider: "Angel One", fee: "₹0 equity", reward: "₹20 F&O", rating: 4.4 },
];

async function populateQuick() {
    console.log('🚀 Quick population starting...\\n');
    
    let success = 0;
    let failed = 0;
    
    for (const product of PRODUCTS) {
        const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        process.stdout.write(`  ${product.name}... `);
        
        const { error } = await supabase.from('products').upsert({
            slug,
            name: product.name,
            category: product.category,
            provider_name: product.provider,
            description: `Premium ${product.category.replace('_', ' ')} from ${product.provider}`,
            rating: product.rating,
            features: {
                fee: product.fee,
                reward: product.reward
            },
            pros: [
                "Widely accepted",
                "Good customer service",
                "Competitive rates",
                "Easy application process"
            ],
            cons: [
                "Income requirements may apply",
                "Terms and conditions apply",
                "Subject to approval"
            ],
            affiliate_link: `https://example.com/${slug}`,
            image_url: `https://via.placeholder.com/400x250/0f172a/10b981?text=${encodeURIComponent(product.provider)}`,
            is_active: true,
            last_verified_at: new Date().toISOString(),
            verification_status: 'verified',
            trust_score: Math.floor(Math.random() * 10) + 85
        }, { onConflict: 'slug' });
        
        if (error) {
            console.log('❌', error.message);
            failed++;
        } else {
            console.log('✅');
            success++;
        }
    }
    
    console.log(`\\n✨ Done!`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
}

populateQuick().catch(console.error);
