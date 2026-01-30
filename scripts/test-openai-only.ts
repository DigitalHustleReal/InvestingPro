/**
 * Generate ONE test article using OpenAI ONLY
 * Logs output to openai_test_log.txt
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Logger helper
function log(msg: string) {
    console.log(msg);
    fs.appendFileSync('openai_test_log.txt', msg + '\n');
}

async function generateWithOpenAI() {
    // Clear log file
    fs.writeFileSync('openai_test_log.txt', '');
    
    log('====================================================');
    log('🧪 TEST: OpenAI-only article generation');
    log('====================================================\n');

    try {
        const OpenAI = (await import('openai')).default;
        const { createClient } = await import('@supabase/supabase-js');
        const slugify = (await import('slugify')).default;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const topic = `Best Credit Cards for Online Shopping in India 2026 - Test ${Date.now()}`;
        log(`🎯 Topic: "${topic}"`);
        log('⏳ Generating with OpenAI (gpt-4o-mini)...\n');

        const systemPrompt = `You are an expert Indian finance writer. Write comprehensive, SEO-optimized articles.`;
        
        const userPrompt = `Write a comprehensive guide about: "${topic}"

Return ONLY valid JSON:
{
  "title": "Best Credit Cards for Online Shopping in India (2026 Guide)",
  "seo_title": "Best Credit Cards for Online Shopping India 2026 - Top Picks",
  "seo_description": "Discover the best credit cards for online shopping in India for 2026. Compare rewards, cashback, and benefits to find the perfect card for your needs.",
  "content": "<h1>Best Credit Cards for Online Shopping in India (2026 Guide)</h1><p>Online shopping has become an integral part of our daily lives...</p><h2>Top Picks</h2><p>Here are the best cards...</p>",
  "tags": ["credit cards", "online shopping", "india", "rewards"]
}

Requirements:
- 1200+ words of content (keep it slightly shorter for faster test)
- Include at least 3 H2 sections
- Use tables for comparisons
- Focus on Indian market
- Include pros/cons
- Make it actionable`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const rawContent = response.choices[0]?.message?.content || '';
        log(`✅ OpenAI returned ${rawContent.length} characters`);

        // Parse JSON
        let parsed;
        try {
            // Try to extract JSON from the response
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found');
            }
        } catch (e) {
            log('⚠️ Could not parse as JSON, using raw content');
            parsed = {
                title: topic,
                seo_title: topic.substring(0, 60),
                seo_description: `Complete guide to ${topic.toLowerCase()}`,
                content: rawContent,
                tags: ['credit cards', 'shopping', 'india']
            };
        }

        const wordCount = parsed.content?.split(/\s+/).filter(Boolean).length || 0;
        log(`📏 Word count: ${wordCount} words`);

        // Save to database
        const slug = slugify(parsed.title || topic, { lower: true, strict: true }) + '-' + Date.now();
        
        const { data: article, error } = await supabase
            .from('articles')
            .insert({
                title: parsed.title || topic,
                slug: slug,
                body_html: parsed.content,
                content: parsed.content,
                excerpt: parsed.seo_description,
                meta_title: parsed.seo_title,
                meta_description: parsed.seo_description,
                seo_title: parsed.seo_title,
                seo_description: parsed.seo_description,
                keywords: parsed.tags || [],
                status: 'published', // Force published for test
                quality_score: 100,
                category: 'credit-cards',
                subcategory: 'shopping',
                is_pillar: false,
                is_evergreen: true,
                published_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            log(`❌ Database error: ${error.message}`);
            return;
        }

        log('\n====================================================');
        log('✅ SUCCESS! Article generated and saved');
        log('====================================================');
        
        const url = `http://localhost:3000/articles/${article.slug}`;
        log(`📝 Title: ${article.title}`);
        log(`🔗 Slug: ${article.slug}`);
        log(`🌐 URL: ${url}`);
        log(`📂 File: check openai_test_log.txt for details`);

    } catch (error: any) {
        log('\n====================================================');
        log('❌ FAILED');
        log('====================================================');
        log(`Error: ${error.message}`);
    }
}

generateWithOpenAI();
