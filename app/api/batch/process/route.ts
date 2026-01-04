/**
 * Batch Processing Worker
 * Picks a pending item and generates content for it
 * Can be triggered via Cron or Client-side loop
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { AutoFeaturedImageService } from '@/lib/media/auto-featured-image';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { batchId } = await request.json();

        // 1. Get next pending item
        let query = supabase
            .from('batch_items')
            .select('*, content_batches(config)')
            .eq('status', 'pending')
            .limit(1);
        
        // Optionally filter by specific batch
        if (batchId) {
            query = query.eq('batch_id', batchId);
        }

        const { data: items, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (!items || items.length === 0) {
            // Check if batch is complete
            if (batchId) {
                await supabase
                    .from('content_batches')
                    .update({ status: 'completed' })
                    .eq('id', batchId);
            }
            return NextResponse.json({ message: 'No pending items' });
        }

        const item = items[0];
        const config = item.content_batches.config || {};

        console.log(`⚙️ Processing item: ${item.keyword} (Batch: ${item.batch_id})`);

        // Mark as processing
        await supabase
            .from('batch_items')
            .update({ status: 'processing', updated_at: new Date().toISOString() })
            .eq('id', item.id);

        try {
            // --- GENERATION PIPELINE ---

            // 1. Generate Article Content
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert financial writer. Write a comprehensive, engaging, and SEO-optimized article about "${item.keyword}".
                        
                        Configuration:
                        - Tone: ${config.tone || 'Professional'}
                        - Length: ${config.length || 'check'} (around 1000-1500 words)
                        - Format: Markdown
                        
                        Structure:
                        - Safe, catchy Title (H1)
                        - Engaging Introduction
                        - Key Takeaways (bullet points)
                        - Detailed Sections (H2, H3)
                        - Conclusion
                        - FAQ Section
                        
                        Return JSON format: { "title": "string", "markdown": "string", "excerpt": "string", "seo_title": "string", "meta_desc": "string" }`
                    },
                    { role: 'user', content: `Write article for: ${item.keyword}` }
                ],
                temperature: 0.7
            });

            const contentRaw = completion.choices[0].message.content;
            let contentData;
            try {
                contentData = JSON.parse(contentRaw || '{}');
            } catch (e) {
                // Fallback if JSON fails (rare with GPT-4)
                console.error("JSON parse failed, assuming raw markdown");
                contentData = {
                    title: item.keyword, // Fallback title
                    markdown: contentRaw,
                    excerpt: 'Article about ' + item.keyword,
                    seo_title: item.keyword,
                    meta_desc: 'Read about ' + item.keyword
                };
            }

            // 2. Auto-Categorize & Tag (Simulated based on earlier logic, or use APIs)
            // For batch effiency, we'll do simple extraction here or re-use logic
            // (Skipping external api call loop to save latency, doing inline)
            
            // 3. Auto-Select Image
            let featuredImage = config.default_image || '';
            if (config.auto_image) {
                try {
                    const imgResult = await AutoFeaturedImageService.getFeaturedImage(contentData.title, {
                        keywords: [item.keyword, config.category],
                        preferAI: false
                    });
                    if (imgResult) featuredImage = imgResult.url;
                } catch (e) {
                    console.error('Image auto-select failed', e);
                }
            }

            // 4. Save Article
            const slug = contentData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const { data: article, error: saveError } = await supabase
                .from('articles')
                .insert({
                    title: contentData.title,
                    slug: `${slug}-${Date.now()}`, // Ensure unique
                    body_markdown: contentData.markdown,
                    excerpt: contentData.excerpt,
                    seo_title: contentData.seo_title,
                    seo_description: contentData.meta_desc,
                    category: config.category || 'investing-basics',
                    status: config.status || 'draft', // Draft or Published
                    featured_image: featuredImage,
                    // author_id: config.author_id, // skipping standard auth.users link
                    display_author_id: config.author_id, // Using new fictitious author link
                    tags: [item.keyword.toLowerCase().replace(/\s+/g, '-')]
                })
                .select()
                .single();

            if (saveError) throw saveError;

            // 5. Update Item Status
            await supabase
                .from('batch_items')
                .update({ 
                    status: 'completed', 
                    article_id: article.id,
                    generated_at: new Date().toISOString()
                })
                .eq('id', item.id);
            
            // Update Batch Counters
            await supabase.rpc('increment_batch_progress', { batch_row_id: item.batch_id });

            return NextResponse.json({ 
                success: true, 
                item: item.keyword, 
                articleId: article.id 
            });

        } catch (genError: any) {
            console.error('Generation failed:', genError);
            
            // Mark item as failed
            await supabase
                .from('batch_items')
                .update({ 
                    status: 'failed', 
                    error_message: genError.message 
                })
                .eq('id', item.id);

            // Update Batch Failed Counter (could make RPC for this too)
            
            return NextResponse.json({ success: false, error: genError.message }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Batch worker error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
