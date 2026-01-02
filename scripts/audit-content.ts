
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

/**
 * Heuristic-based SEO and Quality Scorer
 */
function calculateHeuristicScore(article: any) {
    let score = 100;

    // 1. Meta Description
    if (!article.seo_description) score -= 20;
    else if (article.seo_description.length < 120 || article.seo_description.length > 160) score -= 5;

    // 2. Tags
    if (!article.tags || article.tags.length < 3) score -= 10;

    // 3. Featured Image
    if (!article.featured_image) score -= 15;

    // 4. Freshness (Subtract 5 points for every month since last update)
    const lastUpdate = new Date(article.updated_at).getTime();
    const now = new Date().getTime();
    const monthsOld = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24 * 30));
    score -= Math.min(monthsOld * 5, 30);

    return Math.max(0, score);
}

async function auditArticles() {
    console.log("🧐 Starting Content Audit...");
    
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*');

    if (error) throw error;

    for (const article of articles) {
        process.stdout.write(`Analyzing: ${article.title.substring(0, 30)}... `);
        
        const seo_score = calculateHeuristicScore(article);
        
        // Update the article with the new scores
        const { error: updateError } = await supabase
            .from('articles')
            .update({
                seo_score,
                quality_score: seo_score, // Using SEO as proxy for now
                is_verified_quality: seo_score > 80
            })
            .eq('id', article.id);

        if (updateError) console.log("❌");
        else console.log(`✅ [Score: ${seo_score}]`);
    }

    console.log("🎉 Audit Complete.");
}

auditArticles();
