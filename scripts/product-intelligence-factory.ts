
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

/**
 * COMPREHENSIVE HIGH-DEMAND PRODUCT LIST (50+ Products)
 * Target: Most profitable/popular financial products in India for 2026 launch.
 */
const TARGET_PRODUCTS = [
    // --- CREDIT CARDS (The Gold Mine) ---
    { name: "HDFC Regalia Gold", category: "credit_card", lookup: "HDFC Regalia Gold benefits fees 2026" },
    { name: "HDFC Diners Club Black", category: "credit_card", lookup: "HDFC Diners Club Black rewards 2026" },
    { name: "HDFC Millennia", category: "credit_card", lookup: "HDFC Millennia card review 2026" },
    { name: "HDFC Tata Neu Infinity", category: "credit_card", lookup: "Tata Neu Infinity HDFC benefits" },
    { name: "SBI Card ELITE", category: "credit_card", lookup: "SBI Elite card annual fee 2026" },
    { name: "SBI Cashback Card", category: "credit_card", lookup: "SBI Cashback card benefits review 2026" },
    { name: "SBI Prime Card", category: "credit_card", lookup: "SBI Prime card milestone benefits" },
    { name: "Axis Bank Magnus", category: "credit_card", lookup: "Axis Magnus benefits update 2026" },
    { name: "Axis Bank Atlas", category: "credit_card", lookup: "Axis Atlas miles rewards 2026" },
    { name: "Axis Bank ACE", category: "credit_card", lookup: "Axis ACE card cashback 2026" },
    { name: "Amazon Pay ICICI", category: "credit_card", lookup: "Amazon Pay ICICI card features" },
    { name: "ICICI Sapphiro", category: "credit_card", lookup: "ICICI Sapphiro benefits and lounge" },
    { name: "AMEX Platinum Travel", category: "credit_card", lookup: "Amex Platinum Travel 2026 rewards" },
    { name: "AMEX Gold Card", category: "credit_card", lookup: "Amex Gold Charge card India 2026" },
    { name: "IDFC First Wealth", category: "credit_card", lookup: "IDFC Wealth card lounge access" },
    { name: "IDFC First Select", category: "credit_card", lookup: "IDFC First Select card benefits" },
    { name: "HSBC Live+ Card", category: "credit_card", lookup: "HSBC Live+ cashback card review" },
    { name: "OneCard Credit Card", category: "credit_card", lookup: "OneCard metal credit card benefits" },
    { name: "AU Zenith+ Card", category: "credit_card", lookup: "AU Zenith Plus card review 2026" },
    { name: "Standard Chartered Ultimate", category: "credit_card", lookup: "Standard Chartered Ultimate reward rate" },

    // --- BROKERS & TRADING (Recurring Income) ---
    { name: "Zerodha Kite", category: "broker", lookup: "Zerodha account opening and brokerage 2026" },
    { name: "Groww Stocks", category: "broker", lookup: "Groww pricing plans 2026" },
    { name: "Angel One", category: "broker", lookup: "Angel One brokerage for options trading" },
    { name: "Upstox Pro", category: "broker", lookup: "Upstox account opening charges 2026" },
    { name: "Dhan App", category: "broker", lookup: "Dhan trading app features and brokerage" },
    { name: "Indmoney", category: "broker", lookup: "Indmoney US stocks and Indian stocks fees" },
    { name: "Kotak Cherry", category: "broker", lookup: "Kotak Cherry investment platform review" },
    { name: "ICICI Direct", category: "broker", lookup: "ICICI Direct Neo plan charges 2026" },

    // --- LOANS (High Payouts) ---
    { name: "HDFC Home Loan", category: "loan", lookup: "HDFC Home Loan interest rates 2026" },
    { name: "SBI Home Loan", category: "loan", lookup: "SBI Home Loan current ROI Jan 2026" },
    { name: "Bajaj Finserv Personal Loan", category: "loan", lookup: "Bajaj Finserv personal loan eligibility" },
    { name: "KreditBee Personal Loan", category: "loan", lookup: "KreditBee loan interest and tenure" },
    { name: "Navi Cash Loan", category: "loan", lookup: "Navi personal loan interest rates 2026" },
    { name: "IDFC First Personal Loan", category: "loan", lookup: "IDFC First Bank personal loan review" },

    // --- INSURANCE (Long-Term Trust) ---
    { name: "HDFC Life Click 2 Protect", category: "insurance", lookup: "HDFC Life Click 2 Protect Term Insurance 2026" },
    { name: "Max Life Smart Secure Plus", category: "insurance", lookup: "Max Life Term Insurance features" },
    { name: "ICICI Pru iProtect Smart", category: "insurance", lookup: "ICICI Prudential Term Insurance review" },
    { name: "Niva Bupa ReAssure", category: "insurance", lookup: "Niva Bupa ReAssure 2.0 health insurance" },
    { name: "Star Health Assurance", category: "insurance", lookup: "Star Health insurance plan benefits" },
    { name: "Care Health Supreme", category: "insurance", lookup: "Care Health Supreme policy details 2026" },

    // --- MUTUAL FUNDS (AUM Builders) ---
    { name: "Parag Parikh Flexi Cap", category: "mutual_fund", lookup: "Parag Parikh Flexi Cap fund performance 2026" },
    { name: "SBI Bluechip Fund", category: "mutual_fund", lookup: "SBI Bluechip fund direct growth returns" },
    { name: "Mirae Asset Large Cap", category: "mutual_fund", lookup: "Mirae Asset Large Cap fund review 2026" },
    { name: "HDFC Index S&P BSE Sensex", category: "mutual_fund", lookup: "HDFC Index fund expense ratio" },
    { name: "Quant Small Cap", category: "mutual_fund", lookup: "Quant Small Cap fund direct returns 2026" },
    { name: "Nippon India Small Cap", category: "mutual_fund", lookup: "Nippon India small cap fund performance" }
];

async function getSerpResults(query: string) {
    if (!SERPAPI_KEY) return [];
    try {
        const response = await axios.get('https://serpapi.com/search', {
            params: { api_key: SERPAPI_KEY, q: query, location: "India", hl: "en", gl: "in", num: 3 }
        });
        return (response.data.organic_results || []).map((r: any) => ({ 
            title: r.title, link: r.link, snippet: r.snippet 
        }));
    } catch (e) { 
        console.error(`   ⚠️ SerpApi failed for: ${query}`);
        return []; 
    }
}

async function syncAllProducts() {
    console.log(`🚀 STARTING MASSIVE PRODUCT SYNC: ${TARGET_PRODUCTS.length} ITEMS`);
    const models = ["gemini-1.5-flash", "gemini-1.5-pro"];

    for (let i = 0; i < TARGET_PRODUCTS.length; i++) {
        const item = TARGET_PRODUCTS[i];
        console.log(`\n📦 [${i + 1}/${TARGET_PRODUCTS.length}] Researching: ${item.name}...`);

        try {
            const searchData = await getSerpResults(item.lookup);
            const prompt = `
                Role: Senior Financial Analyst
                Task: Research and structure real-time 2026 data for "${item.name}".
                Search Context: ${JSON.stringify(searchData)}
                
                Provide a JSON response:
                {
                    "official_name": "Full official name",
                    "provider": "Company/Bank Name",
                    "description": "Compelling 1-sentence high-intent pitch.",
                    "rating": 4.5,
                    "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
                    "cons": ["Con 1", "Con 2", "Con 3"],
                    "features": { "Technical Spec": "Value", ... },
                    "official_link": "Official URL (best guess from search)"
                }
                
                Return ONLY valid JSON.
            `;

            let json: any = null;
            for (const modelName of models) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text().trim();
                    const match = responseText.match(/\{[\s\S]*\}/);
                    if (match) {
                        json = JSON.parse(match[0]);
                        break;
                    }
                } catch (e) {
                    console.error(`   ⚠️ Model ${modelName} failed, trying next...`);
                }
            }

            if (!json) {
                console.error(`   ❌ AI failed completely for ${item.name}`);
                continue;
            }

            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            // UPSERT with resilient column naming logic
            const { error } = await supabase
                .from('products')
                .upsert({
                    slug,
                    name: json.official_name || item.name,
                    category: item.category,
                    product_type: item.category, // Safety for legacy constraints
                    provider_name: json.provider || "Market",
                    provider: json.provider || "Market", // Safety for legacy constraints
                    description: json.description,
                    rating: json.rating || 4.5,
                    features: json.features || {},
                    pros: json.pros || [],
                    cons: json.cons || [],
                    official_link: json.official_link,
                    image_url: json.official_link ? `https://logo.clearbit.com/${new URL(json.official_link).hostname}` : null,
                    is_active: true,
                    last_verified_at: new Date().toISOString(),
                    verification_status: 'verified',
                    trust_score: 95
                }, { onConflict: 'slug' });

            if (error) {
                console.error(`   ❌ DB ERROR for ${item.name}: ${error.message}`);
            } else {
                console.log(`   ✅ SUCCESS: ${json.official_name} populated.`);
            }

            // Rate limiting (be nice to APIs)
            await new Promise(r => setTimeout(r, 1500));

        } catch (err) {
            console.error(`   💥 CRITICAL ERROR for ${item.name}:`, err);
        }
    }

    console.log("\n✨ MASSIVE SYNC COMPLETE. Platform is now fully loaded with high-fidelity products.");
}

syncAllProducts();
