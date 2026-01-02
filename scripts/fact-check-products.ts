
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function factCheckProducts() {
    console.log("🧐 Fact-Checking Financial Products...");
    
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) throw error;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const product of products) {
        console.log(`\n🔍 Checking: ${product.name}...`);
        
        const prompt = `
            Task: Verify current financial specifications for "${product.name}" (${product.provider_name}).
            Current Database Features: ${JSON.stringify(product.features)}
            
            Compare these specifications against the latest known market values for early 2026.
            Focus on: joining fees, annual fees, interest rates, and core benefits.
            
            Provide a response in JSON format:
            - status: "verified" (no change) or "discrepancy" (needs update)
            - updated_features: (the complete features object with latest data)
            - notes: (Brief explanation of what changed or "All data confirmed")
            - trust_score: (1-100 indicating your confidence in this data)
            
            Return ONLY valid JSON.
        `;

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().trim();
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const checkResult = JSON.parse(jsonMatch[0]);
                
                const updateData: any = {
                    last_verified_at: new Date().toISOString(),
                    verification_status: checkResult.status,
                    verification_notes: checkResult.notes,
                    trust_score: checkResult.trust_score
                };

                if (checkResult.status === "discrepancy") {
                    console.log(`⚠️ DISCREPANCY for ${product.name}: ${checkResult.notes}`);
                    updateData.features = checkResult.updated_features;
                    updateData.updated_at = new Date().toISOString();
                } else {
                    console.log(`✅ ${product.name} verified.`);
                }

                await supabase.from('products').update(updateData).eq('id', product.id);
            }
        } catch (err) {
            console.error(`❌ Error checking ${product.name}:`, err);
        }
    }
}

factCheckProducts();
