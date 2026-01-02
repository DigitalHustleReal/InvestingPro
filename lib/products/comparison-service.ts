
import { productService, Product } from './product-service';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function getComparisonVerdict(p1: Product, p2: Product): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        As a financial expert, provide a concise 300-word verdict comparing two products.
        
        Product 1: ${p1.name} (${p1.provider_name})
        Features: ${JSON.stringify(p1.features)}
        Pros: ${p1.pros.join(', ')}
        
        Product 2: ${p2.name} (${p2.provider_name})
        Features: ${JSON.stringify(p2.features)}
        Pros: ${p2.pros.join(', ')}
        
        Instructions:
        1. Compare them side-by-side.
        2. Identify the clear winner for specific user types (e.g., "Best for Travel", "Best for Beginners").
        3. Be unbiased and professional.
        4. Use HTML formatting like <strong> and <ul> if needed.
        
        Verdict:
    `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Verdict Error:", error);
        return "Comparison verdict currently unavailable.";
    }
}
