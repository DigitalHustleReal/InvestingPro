
import { createClient } from '@supabase/supabase-js';
import { GhostScraper } from '@/lib/scraper/ghost_scraper';
import { generateArticle } from '@/lib/ai/article-writer';
import { ArticleService } from '@/lib/cms/article-service';
import { WebExtractor } from '@/lib/scraper/web-extractor';
import { generateSocialPosts } from '@/lib/ai/social/post-generator';
import { logger } from '@/lib/logger';
import { logAICost, calculateCostFromTokens } from '@/lib/ai/cost-tracker';

export class ContentPipeline {
    static async run() {
        // 1. Init Admin Client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase URL or Service Role Key missing'); 
        }

        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Use isolated service instance with Admin privileges
        const articleService = ArticleService.create(adminClient);

        // 2. Scan Trends
        logger.info('Pipeline: Scanning Trends...');
        const trends = await GhostScraper.scanTrends();
        
        if (trends.length === 0) {
            logger.info('Pipeline: No trends found');
            return { status: 'skipped', reason: 'no_trends' };
        }
        
        // Pick top trend
        const bestTrend = trends[0];
        logger.info(`Pipeline: Selected trend "${bestTrend.topic}" from ${bestTrend.source}`);

        // 3. Grounding: Extract Source Content
        let sourceContent: string | undefined;
        if (bestTrend.url) {
             logger.info(`Pipeline: Extracting grounding context from ${bestTrend.url}...`);
             const extracted = await WebExtractor.extractContent(bestTrend.url);
             if (extracted) {
                 sourceContent = extracted;
                 logger.info('Pipeline: Grounding context acquired.');
             } else {
                 logger.warn('Pipeline: Failed to extract context, proceeding without grounding.');
             }
        }

        // 4. Generate Content
        logger.info('Pipeline: Generating Article...');
        const articleContent = await generateArticle({
            topic: bestTrend.topic,
            keywords: [bestTrend.topic, bestTrend.source || 'news', 'finance'],
            tone: 'news',
            sourceContent,
            sourceUrl: bestTrend.url
        });

        // 5. Generate Social Distribution Assets
        logger.info('Pipeline: Generating Social Assets...');
        const socialPosts = await generateSocialPosts(
            articleContent.title, 
            articleContent.content,
            bestTrend.url
        );

        // Merge Metadata
        const enrichedMetadata = {
            ...articleContent.ai_metadata,
            distribution: {
                twitter: socialPosts.twitter_thread,
                linkedin: socialPosts.linkedin_post,
                instagram: socialPosts.instagram_caption,
                generated_at: socialPosts.generated_at
            },
            grounding: {
                source_url: bestTrend.url,
                has_context: !!sourceContent
            }
        };

        // 6. Save to CMS
         const slug = articleContent.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

        try {
            const result = await articleService.createArticle(
                 { body_markdown: articleContent.content, body_html: '' },
                 {
                     title: articleContent.title,
                     slug, 
                     excerpt: articleContent.excerpt,
                     category: 'market-news',
                     tags: articleContent.tags,
                     seo_title: articleContent.seo_title,
                     seo_description: articleContent.seo_description,
                     ai_generated: true,
                     ai_metadata: enrichedMetadata
                 }
            );
            
            // Log AI cost after article creation (now we have articleId)
            if (articleContent.usage && articleContent.provider && articleContent.model) {
                const inputTokens = articleContent.usage.input_tokens || 0;
                const outputTokens = articleContent.usage.output_tokens || 0;
                const cost = calculateCostFromTokens(
                    articleContent.provider, 
                    articleContent.model, 
                    inputTokens, 
                    outputTokens
                );
                
                // Log cost asynchronously (don't block pipeline)
                logAICost({
                    article_id: result.id,
                    provider: articleContent.provider,
                    model: articleContent.model,
                    operation: 'generate',
                    input_tokens: inputTokens,
                    output_tokens: outputTokens,
                    cost_usd: cost,
                    metadata: {
                        topic: bestTrend.topic,
                        source: bestTrend.source,
                        operation_type: 'pipeline_generate'
                    }
                }).catch((error) => {
                    logger.warn('Failed to log AI cost after article creation', error as Error, { 
                        articleId: result.id, 
                        provider: articleContent.provider 
                    });
                });
            }
            
            logger.info(`Pipeline: Article created: ${result.id} (${result.title})`);
            return { status: 'success', articleId: result.id, slug: result.slug, trend: bestTrend };

        } catch (error) {
            logger.error('Pipeline: Failed to save article', error as Error);
            throw error;
        }
    }
}
