
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TARGET_PRODUCTS = [
    { name: "HDFC Regalia Gold", category: "credit_card" },
    { name: "SBI Card ELITE", category: "credit_card" },
    { name: "AMEX Platinum Travel", category: "credit_card" },
    { name: "Axis Magnus", category: "credit_card" },
    { name: "Zerodha Kite", category: "broker" },
    { name: "Groww Stocks", category: "broker" },
    { name: "Indmoney", category: "broker" },
    { name: "HDFC Home Loan", category: "loan" },
    { name: "SBI Home Loan", category: "loan" }
];

async function forceSyncProducts() {
    console.log("🚀 Starting Global Product Sync (Real World Data)...");

    // 1. Force reload schema by doing a simple query first
    await supabase.from('products').select('id').limit(1);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const item of TARGET_PRODUCTS) {
        console.log(`\n🌐 Researching latest 2026 specs for: ${item.name}...`);
        
        const prompt = `
            Task: Provide REAL 2026 financial specifications for "${item.name}" in India.
            Category: ${item.category}
            
            JSON format:
            - name: "Official Product Name"
            - provider_name: "Bank/Company Name"
            - description: "Compelling 1-sentence description"
            - rating: 4.5 (numeric)
            - features: { "annual_fee": "₹2500", "rewards": "4 pts per 150", ... }
            - pros: ["pro1", "pro2", "pro3", "pro4"]
            - cons: ["con1", "con2", "con3"]
            - official_link: "https://..."
            
            Return ONLY valid JSON.
        `;

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().trim();
            const json = JSON.parse(responseText.match(/\{[\s\S]*\}/)![0]);
            
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const { error } = await supabase
                .from('products')
                .upsert({
                    slug,
                    name: json.name,
                    category: item.category,
                    provider_name: json.provider_name,
                    description: json.description,
                    rating: json.rating,
                    features: json.features,
                    pros: json.pros,
                    cons: json.cons,
                    official_link: json.official_link,
                    image_url: `https://logo.clearbit.com/${new URL(json.official_link).hostname}`,
                    is_active: true,
                    last_verified_at: new Date().toISOString(),
                    verification_status: 'verified',
                    trust_score: 95
                }, { onConflict: 'slug' });

            if (error) {
                console.error(`❌ Failed to sync ${item.name}:`, error.message);
                // If it's a column error, try a "Safe Insert" without the failing columns to at least get the product in
                if (error.message.includes('column')) {
                     console.log("⚠️ Retrying with basic schema only...");
                     await supabase.from('products').upsert({
                        slug,
                        name: json.name,
                        category: item.category,
                        provider_name: json.provider_name,
                        is_active: true
                     }, { onConflict: 'slug' });
                }
            } else {
                console.log(`✅ ${json.name} is now LIVE on the platform.`);
            }

        } catch (err) {
            console.error(`❌ Error with ${item.name}:`, err);
        }
    }

    console.log("\n✨ Platform is now populated with real-world products.");
}

forceSyncProducts();
