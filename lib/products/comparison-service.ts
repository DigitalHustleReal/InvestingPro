
import { productService, Product } from './product-service';
import { logger } from '@/lib/logger';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/client';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const supabase = createClient();

export async function getComparisonVerdict(p1: Product, p2: Product): Promise<string> {
    // 1. Generate Cache Key (Alphabetical order ensures A-vs-B same as B-vs-A)
    const sortedSlugs = [p1.slug, p2.slug].sort();
    const slugKey = `${sortedSlugs[0]}:${sortedSlugs[1]}`;

    // 2. Check Cache
    try {
        const { data: cached } = await supabase
            .from('comparison_cache')
            .select('verdict_content')
            .eq('slug_key', slugKey)
            .single();

        if (cached) {
            logger.info(`⚡ Serving cached verdict for ${slugKey}`);
            return cached.verdict_content;
        }
    } catch (e) {
        logger.warn('Cache lookup failed, falling back to live generation:', e);
    }

    // 3. Generate Fresh Verdict
    logger.info(`🤖 Generating fresh verdict for ${slugKey}...`);
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
        const verdict = result.response.text();

        // 4. Save to Cache
        const { error } = await supabase
            .from('comparison_cache')
            .upsert({
                slug_key: slugKey,
                p1_slug: p1.slug,
                p2_slug: p2.slug,
                verdict_content: verdict,
                provider: 'gemini'
            });
            
        if (error) logger.error('Failed to cache verdict:', error);

        return verdict;
    } catch (error) {
        logger.error("AI Verdict Error:", error);
        return "Comparison verdict currently unavailable. Please check back later.";
    }
}
