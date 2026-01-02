
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

/**
 * Automatically Research and Create a Product
 */
async function researchProduct(name: string, category: string) {
    console.log(`🔍 Researching: ${name} (${category})...`);

    // 1. Simulate/Perform Web Search (Note: In a real env, we'd use search_web tool if possible, 
    // but here we can prompt the AI to use its internal knowledge or use an API if available)
    // For this demonstration, we'll use Gemini to synthesized known info and provide structure.
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
        Research the financial product: "${name}" in the category "${category}".
        Provide the following details in JSON format:
        - name: Official name
        - provider_name: Company name
        - description: 1-2 sentence overview
        - rating: estimated rating out of 5 (e.g. 4.5)
        - pros: array of 4 key advantages
        - cons: array of 3 key disadvantages
        - features: JSON object of key specs (e.g. for cards: joining_fee, rewards_multiplier; for brokers: account_opening_fee, maintenance_charges)
        - official_link: The official homepage link (best guess)
        
        Return ONLY valid JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) throw new Error("Could not parse AI response");
        
        const data = JSON.parse(jsonMatch[0]);
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // 2. Insert into DB
        const { data: inserted, error } = await supabase
            .from('products')
            .upsert({
                slug,
                name: data.name,
                category,
                provider_name: data.provider_name,
                description: data.description,
                rating: data.rating,
                pros: data.pros,
                cons: data.cons,
                features: data.features,
                official_link: data.official_link,
                image_url: `https://logo.clearbit.com/${new URL(data.official_link).hostname}`, // Pro tip: Auto-logos
                is_active: true
            })
            .select();

        if (error) throw error;
        console.log(`✅ Product Generated: ${data.name} [/${slug}]`);
        return inserted;

    } catch (err) {
        console.error(`❌ Failed to research ${name}:`, err);
    }
}

// Example usage: node scripts/product-researcher.ts "AMEX Platinum" "credit_card"
const productName = process.argv[2];
const category = process.argv[3];

if (productName && category) {
    researchProduct(productName, category);
} else {
    console.log("Usage: npx tsx scripts/product-researcher.ts \"Product Name\" \"category\"");
}
