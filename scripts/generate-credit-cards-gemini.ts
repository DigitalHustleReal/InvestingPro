
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TARGET_CARDS = [
    "HDFC Regalia Gold",
    "HDFC Infinia Metal",
    "SBI Card ELITE",
    "SBI Cashback Card",
    "Axis Magnus",
    "Axis Atlas",
    "ICICI Sapphiro",
    "American Express Platinum Travel",
    "Standard Chartered Ultimate",
    "IDFC FIRST Wealth"
];

async function generateCards() {
    console.log("🚀 Starting AI Credit Card Generation...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const cardName of TARGET_CARDS) {
        console.log(`\n💳 Generating specs for: ${cardName}...`);
        
        const prompt = `
            Task: Provide REAL 2026 specifications for the credit card "${cardName}" in India.
            
            Return JSON matching this specific schema for the 'credit_cards' table:
            {
                "name": "${cardName}",
                "bank": "Bank Name",
                "slug": "${cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}",
                "description": "Short 1-sentence sales pitch",
                "rating": 4.8 (numeric, be realistic),
                "annual_fee": 2500 (number only),
                "joining_fee": 2500 (number only),
                "rewards": ["5X points on travel", "1% cashback offline"],
                "lounge_access": "12 domestic, 6 international per year",
                "pros": ["Benefit 1", "Benefit 2", "Benefit 3"],
                "cons": ["Drawback 1", "Drawback 2"],
                "apply_link": "https://www.bank.com/apply",
                "image_url": "https://placehold.co/600x400?text=${cardName.replace(/ /g, '+')}",
                "type": "Premium" (e.g. Premium, Cashback, Travel)
            }
            Return ONLY valid JSON.
        `;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const cardData = JSON.parse(jsonText);

            // Insert into credit_cards table
            const { error } = await supabase
                .from('credit_cards')
                .upsert(cardData, { onConflict: 'slug' });

            if (error) {
                console.error(`❌ Failed to insert ${cardName}:`, error.message);
            } else {
                console.log(`✅ ${cardName} saved successfully.`);
            }

        } catch (err: any) {
            console.error(`❌ Error processing ${cardName}:`, err.message);
        }
    }

    console.log("\n✨ Done. Please refresh the App.");
}

generateCards();
