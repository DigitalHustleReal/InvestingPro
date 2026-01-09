
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// TYPES
export interface ProductData {
    name: string;
    slug: string;
    category: 'broker' | 'app' | 'bank' | 'card' | 'loan';
    description: string;
    rating: number; // 1-5
    features: string[];
    pricing: string;
    pros: string[];
    cons: string[];
    cta_text: string;
    cta_url: string; // Placeholder
    icon_url: string; // Placeholder
}

/**
 * Generates structured product data using AI knowledge base
 */
export async function generateProductData(productName: string): Promise<ProductData> {
    console.log(`🤖 Researching Product: "${productName}"...`);

    const prompt = `
    ROLE: You are a financial product analyst in India.
    TASK: Provide structured data for the financial product: "${productName}".
    
    REQUIREMENTS:
    - Accurate pricing/fee structure (e.g., "₹20/order" or "Zero fees").
    - 4-5 Key Features (short, benefit-driven).
    - 3 Pros and 2 Cons (Honest analysis).
    - Category: Choose from ['broker', 'app', 'bank', 'card', 'loan'].
    - Rating: Estimate based on market popularity (4.0 - 5.0).
    - Description: 15-20 words summary.

    OUTPUT JSON:
    {
      "name": "${productName}",
      "category": "broker",
      "description": "...",
      "rating": 4.5,
      "features": ["Feature 1", ...],
      "pricing": "...",
      "pros": ["..."],
      "cons": ["..."],
      "cta_text": "Open Account" or "Apply Now" or "Download"
    }
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3 // Strict for facts
    });

    const data = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Add computed fields
    return {
        ...data,
        slug: slugify(data.name, { lower: true, strict: true }),
        cta_url: `https://google.com/search?q=${encodeURIComponent(data.name)}`, // Fallback
        icon_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0D9488&color=fff&size=128` // Fallback primary color
    };
}
