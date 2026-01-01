import { createServiceClient } from '@/lib/supabase/service';
import { generateArticleContent } from './articleGenerator';
import { articleService } from '@/lib/cms/article-service';
import { logger } from '@/lib/logger';

/**
 * Process a single pipeline run
 * 
 * DESIGN:
 * - Fetches oldest pending run
 * - Updates status to 'running'
 * - Executes logic based on type
 * - Updates status to 'completed' or 'failed'
 */
export async function processLatestPipelineRun() {
    const supabase = createServiceClient();
    
    // Fetch one pending run (FIFO)
    const { data: runs, error } = await supabase
        .from('pipeline_runs')
        .select('*')
        .in('status', ['pending', 'triggered'])
        .order('triggered_at', { ascending: true })
        .limit(1);

    if (error) {
        logger.error('Failed to fetch pipeline runs', error);
        return { processed: 0, error: error.message };
    }

    if (!runs || runs.length === 0) {
        return { processed: 0, message: 'No pending runs' };
    }

    const run = runs[0];
    logger.info(`Processing pipeline run ${run.id} (${run.pipeline_type})`);

    // Ensure article service uses the service client to bypass RLS
    articleService.setClient(supabase);

    try {
        // Mark as running
        await supabase.from('pipeline_runs').update({ 
            status: 'running', 
            started_at: new Date().toISOString() 
        }).eq('id', run.id);

        let result: any = {};

        // Dispatch based on type
        if (run.pipeline_type === 'generate_article') {
            const params = run.params || {};
            
            // Execute generation
            const contentConfig = {
                topic: params.topic,
                category: params.category,
                targetKeywords: params.targetKeywords,
                targetAudience: params.targetAudience,
                contentLength: params.contentLength,
                wordCount: params.wordCount,
                prompt: params.prompt
            };
            
            const generated = await generateArticleContent(contentConfig);
            
            // Create article in DB
            const article = await articleService.createArticle(
                {
                    body_markdown: generated.body_markdown,
                    body_html: generated.body_html,
                    content: generated.body_markdown
                },
                {
                    title: generated.title,
                    slug: generated.slug,
                    excerpt: generated.excerpt,
                    featured_image: generated.featured_image,
                    category: generated.category || 'investing-basics',
                     tags: generated.tags || [],
                     seo_title: generated.seo_title,
                     seo_description: generated.meta_description,
                    read_time: generated.read_time,
                    ai_generated: true,
                    ai_metadata: generated.ai_metadata,
                    structured_content: generated.structured_content,
                    is_user_submission: false,
                    submission_status: 'pending' // Enforce strict review workflow
                }
            );

            result = { 
                article_id: article.id, 
                slug: article.slug,
                title: article.title 
            };
        } 
        else if (run.pipeline_type === 'scrape_and_generate') {
             // 1. Scrape trends
             const { trendsService } = await import('@/lib/trends/TrendsService');
             const trends = await trendsService.getTrendingTopics('markets');
             
             if (!trends || trends.length === 0) {
                 throw new Error('No trends found to generate content from');
             }

             // 2. Pick top trend (keyword)
             const topTrend = trends[0];
             logger.info(`Automating content for trend: ${topTrend.keyword}`);

             // 3. Generate article
             const generated = await generateArticleContent({
                 topic: topTrend.keyword,
                 category: topTrend.category,
                 prompt: `Write a comprehensive news update and analysis about ${topTrend.keyword}. Include key takeaways and market impact.`
             });

             // 4. Create article
             // Ensure category matches database check constraint: 
             // ('mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics')
             const allowedCategories = ['mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics'];
             let category = (generated.category || 'investing-basics').toLowerCase().trim().replace(/\s+/g, '-');
             
             // Extra safety: map common variants
             if (category.includes('investing')) category = 'investing-basics';
             if (category.includes('stock')) category = 'stocks';
             if (category.includes('fund')) category = 'mutual-funds';
             if (category.includes('card')) category = 'credit-cards';
             if (category.includes('loan')) category = 'loans';
             if (category.includes('tax')) category = 'tax-planning';

             if (!allowedCategories.includes(category)) {
                 category = 'investing-basics';
             }

             const article = await articleService.createArticle(
                {
                    body_markdown: generated.body_markdown,
                    body_html: generated.body_html,
                    content: generated.body_markdown
                },
                {
                    title: generated.title,
                    slug: generated.slug,
                    excerpt: generated.excerpt,
                    featured_image: generated.featured_image,
                    category: category,
                    tags: [...(generated.tags || []), 'automation', 'trends'],
                    ai_generated: true,
                    submission_status: 'pending'
                }
            );

            result = {
                processed_trend: topTrend.keyword,
                article_id: article.id,
                slug: article.slug
            };
        }
        else if (run.pipeline_type.startsWith('scraper_')) {
            // Updated: Use Native TypeScript Scrapers (Vercel Compatible)
            const { productScraper } = await import('@/lib/scraper/ts/product-scraper');
            
            logger.info(`Executing TS scraper: ${run.pipeline_type}`);
            let outputLog = [];

            if (run.pipeline_type === 'scraper_products' || run.pipeline_type === 'scraper_credit_cards') {
                // Hardcoded fallback list if no params provided
                // ideally this comes from DB "sources" table
                const urls = run.params?.urls || [
                     'https://www.bankbazaar.com/credit-card/hdfc-regalia-gold-credit-card.html',
                     'https://www.bankbazaar.com/credit-card/sbi-cashback-credit-card.html'
                ];

                for (const url of urls) {
                    try {
                        const data = await productScraper.scrapeCreditCard(url);
                        if (data) {
                            await productScraper.updateProduct(data, 'credit_card');
                            outputLog.push(`Updated ${data.name}`);
                        } else {
                            outputLog.push(`Failed to scrape ${url}`);
                        }
                    } catch (err: any) {
                        outputLog.push(`Error on ${url}: ${err.message}`);
                    }
                }
            } 
            else if (run.pipeline_type === 'scraper_mutual_funds') {
                 // Example ISIN list
                 const isins = run.params?.isins || ['INF209K01VA7', 'INF846K01164'];
                 for (const isin of isins) {
                     const data = await productScraper.scrapeAMFINAV(isin);
                     if (data) {
                         // Need name/provider to be passed or looked up, AMFI scrape is limited
                         await productScraper.updateProduct({ ...data, name: `Fund ${isin}`, provider: 'Unknown' }, 'mutual_fund');
                         outputLog.push(`Updated NAV for ${isin}`);
                     }
                 }
            }
            else {
                throw new Error(`Unknown scraper type: ${run.pipeline_type}`);
            }

            result = {
                success: true,
                log: outputLog,
                count: outputLog.length
            };
        }
        else {
            throw new Error(`Unknown pipeline type: ${run.pipeline_type}`);
        }

        // Mark completed
        await supabase.from('pipeline_runs').update({ 
            status: 'completed', 
            completed_at: new Date().toISOString(),
            result,
            error_message: null
        }).eq('id', run.id);

        logger.info(`Pipeline run ${run.id} completed successfully`);
        return { processed: 1, runId: run.id, status: 'completed', result };

    } catch (error: any) {
        logger.error(`Pipeline run ${run.id} failed`, error instanceof Error ? error : new Error(String(error)));
        
        await supabase.from('pipeline_runs').update({ 
            status: 'failed', 
            error_message: error.message,
            error_stack: error.stack
        }).eq('id', run.id);
        
        return { processed: 1, runId: run.id, status: 'failed', error: error.message };
    }
}
