
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { api } from '../lib/api';
import { normalizeArticleBody } from '../lib/content/normalize';
import * as cheerio from 'cheerio';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function optimizeSEO() {
    console.log('🚀 Starting SEO Optimization Script...');

    // Fetch articles with missing SEO data
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, content, seo_description, tags, category')
        .or('seo_description.is.null,seo_description.eq."",tags.is.null');

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    console.log(`🔍 Found ${articles.length} articles needing SEO optimization.`);

    for (const article of articles) {
        console.log(`\nProcessing: ${article.title}`);
        
        try {
            // 1. Generate SEO Data if missing
            if (!article.seo_description || !article.tags || article.tags.length === 0) {
                console.log('   🤖 Generating Metadata with AI...');
                
                // Truncate content for AI context to save tokens/cost
                const contentSnippet = article.content ? article.content.substring(0, 3000) : article.title;
                const prompt = `
                Act as an SEO Expert. 
                Analyze this article content and return a JSON object with:
                {
                    "seo_title": "Optimized Title (50-60 chars) - Compelling & Keyword Rich",
                    "seo_description": "Meta description (150-160 chars) - High CTR, summarizes value",
                    "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"]
                }

                TITLE: ${article.title}
                CATEGORY: ${article.category}
                CONTENT SNIPPET:
                ${contentSnippet}
                `;

                const aiResult = await api.integrations.Core.InvokeLLM({
                    prompt: prompt,
                    operation: 'optimize_seo',
                    contextData: { title: article.title }
                });

                let parsed = { seo_title: article.title, seo_description: '', tags: [] as string[] };
                try {
                     const clean = aiResult.content.replace(/```json/g, '').replace(/```/g, '').trim();
                     parsed = JSON.parse(clean);
                } catch (e) {
                    console.error('   ❌ Failed to parse AI JSON', e);
                    continue; // Skip update if AI fails
                }

                // Update DB
                const { error: updateError } = await supabase
                    .from('articles')
                    .update({
                        seo_title: parsed.seo_title || article.title,
                        seo_description: parsed.seo_description,
                        tags: parsed.tags,
                        // Ensure we also update legacy fields if they exist
                        meta_title: parsed.seo_title,
                        meta_description: parsed.seo_description
                    })
                    .eq('id', article.id);

                if (updateError) console.error('   ❌ Database Update Failed:', updateError.message);
                else console.log('   ✅ SEO Metadata Updated!');
            } else {
                console.log('   ✅ Metadata already exists. Skipping generation.');
            }

            // 2. Internal Linking Check (Mock/Simple)
            // (Complex implementation requires vector search or full scan - skipping for valid constraint)

        } catch (e) {
            console.error(`   ❌ Failed to optimize ${article.title}:`, e);
        }
    }

    console.log('\n✨ SEO Optimization Complete!');
}

optimizeSEO().catch(console.error);
