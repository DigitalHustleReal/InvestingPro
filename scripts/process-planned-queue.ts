
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: Supabase credentials missing');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function processQueue() {
    // Debug: Check Key
    const key = SUPABASE_SERVICE_KEY;
    const isService = key && typeof key === 'string' && (key.includes('ey...service_role') || key.length > 200); // Service keys are long
    console.log(`🔑 Key Prefix: ${key?.substring(0, 10)}... | Length: ${key?.length}`);
    console.log(`   Is Service Role? ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}`);


    try {
        // 1. Fetch NEXT item needing generation (draft with no content)
        const { data: items, error: fetchError} = await supabase
            .from('articles')
            .select('id, title, status, keywords, category_id')
            .eq('status', 'draft')
            .is('content', null)
            // .ilike('title', '%Plots%') // FORCE: Prioritize this specific article
            .limit(1);

        if (fetchError) {
            throw fetchError;
        }

        if (!items || items.length === 0) {
            console.log('💤 Queue is empty. No articles to generate.');
            
            // Debug: Check total count again to be sane
            const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true });
            console.log(`(Total articles in DB: ${count})`);
            
            process.exit(0);
        }

        const item = items[0];
        console.log(`🚀 Processing: "${item.title}" (${item.id})`);

        // 2. SEO Title Optimization (if needed)
        let optimizedTitle = item.title;
        const needsSEOOptimization = !item.title.match(/\d{4}|best|top|how to|guide|vs|comparison/i);
        
        if (needsSEOOptimization) {
            console.log('   🎯 Generating SEO-optimized title...');
            const { api } = await import('../lib/api');
            
            try {
                const titleResponse = await api.integrations.Core.InvokeLLM({
                    prompt: `Generate an SEO-optimized article title for the topic: "${item.title}"
                    
Requirements:
- Include current year (2026)
- Add power words (Best, Top, Ultimate, Complete, etc.)
- Keep under 60 characters
- Make it click-worthy and search-friendly
- Return ONLY the title, nothing else`,
                    systemPrompt: "You are an SEO expert specializing in financial content titles.",
                    operation: 'analysis'
                });
                
                optimizedTitle = titleResponse.content?.trim() || item.title;
                console.log(`   ✨ SEO Title: "${optimizedTitle}"`);
            } catch (e) {
                console.warn('   ⚠️  SEO title generation failed, using original');
            }
        }

        // 3. Import Generator (Dynamic for env vars)
        const { generateArticleContent } = await import('../lib/workers/articleGenerator');
        const { scoreArticleQuality } = await import('../lib/content/quality-scorer');
        
        // 4. Generate Content
        const keywords = item.keywords || [];
        
        console.log('   Generating content (this takes 60-90s)...');
        const generated = await generateArticleContent({
             topic: optimizedTitle, // Use SEO-optimized title
             category: 'investing-basics', // Fallback, assume item would have category logic if joined. 
             // Note: ideally we should join category table, but for now we rely on simple string or default.
             // If item.category_id exists, we might want to fetch category slug/name. 
             // But articleGenerator detects category from topic often. 
             // Let's pass item.category if we had it, but we only have category_id usually.
             targetKeywords: keywords,
             contentLength: 'comprehensive',
             // wordCount: implicit (SERP)
        });

        console.log('   ✅ Generation Complete!');
        console.log(`      Word Count: ${generated.word_count}`);
        console.log(`      Quality Score: ${generated.quality_score}/100`);

        // 5. Save to DB
        // We update the existing record
        const updateData = {
            title: optimizedTitle, // Update with SEO-optimized title
            slug: optimizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            content: generated.body_html,
            status: 'draft',
            featured_image: generated.featured_image,
            meta_title: generated.seo_title,
            meta_description: generated.meta_description,
            keywords: generated.keywords,
            read_time: generated.read_time,
            updated_at: new Date().toISOString(),
            quality_score: generated.quality_score,
            ai_metadata: generated.ai_metadata
        };

        const { error: updateError } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', item.id);

        if (updateError) throw updateError;

        console.log(`✨ Success! Updated article "${item.title}" to status 'draft'.`);

    } catch (error: any) {
        console.error('❌ Factory Error:', error.message);
        process.exit(1);
    }
}

processQueue();
