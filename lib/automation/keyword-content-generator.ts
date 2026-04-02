/**
 * Keyword Content Generator
 * 
 * Automatically generates content for discovered keywords.
 * Integrates keyword discovery with content generation pipeline.
 * 
 * WORKFLOW:
 * 1. Discover long-tail keywords
 * 2. Filter by opportunity score and difficulty
 * 3. Generate content for each keyword
 * 4. Auto-publish if quality gates pass
 */

import { discoverKeywordsForBothCategories, getTopKeywordsForGeneration, type DiscoveredKeyword } from '@/lib/seo/keyword-discovery';
import { runAutomationPipeline, PipelineConfig } from '@/lib/automation/content-pipeline';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

interface KeywordContentGenerationResult {
    keyword: string;
    category: 'credit-cards' | 'mutual-funds';
    success: boolean;
    article_id?: string;
    article_slug?: string;
    error?: string;
}

/**
 * Generate content for a single discovered keyword
 */
export async function generateContentForKeyword(
    keyword: DiscoveredKeyword
): Promise<KeywordContentGenerationResult> {
    logger.info(`Generating content for keyword: ${keyword.keyword}`, {
        category: keyword.category,
        difficulty: keyword.difficulty,
        opportunity_score: keyword.opportunity_score
    });

    try {
        const config: PipelineConfig = {
            topic: keyword.keyword,
            category: keyword.category,
            contentType: 'comparison', // Decision-focused
            targetKeyword: keyword.keyword,
            autoPublish: true,
            generateImages: true,
            minQualityScore: 70,
            maxPlagiarismPercentage: 5,
            minSEOScore: 80
        };

        const result = await runAutomationPipeline(config);

        if (result.success && result.article_id) {
            // Auto-integrate affiliates
            await autoIntegrateAffiliates(result.article_id, keyword.category);

            return {
                keyword: keyword.keyword,
                category: keyword.category,
                success: true,
                article_id: result.article_id,
                article_slug: result.article_slug
            };
        } else {
            return {
                keyword: keyword.keyword,
                category: keyword.category,
                success: false,
                error: result.errors?.join(', ') || 'Unknown error'
            };
        }
    } catch (error) {
        logger.error(`Failed to generate content for keyword: ${keyword.keyword}`, error as Error);
        return {
            keyword: keyword.keyword,
            category: keyword.category,
            success: false,
            error: (error as Error).message
        };
    }
}

/**
 * Auto-integrate affiliate products into article
 */
async function autoIntegrateAffiliates(
    articleId: string,
    category: 'credit-cards' | 'mutual-funds'
): Promise<void> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get top 3-5 affiliate products for this category
        const { data: products } = await supabase
            .from('affiliate_products')
            .select('id')
            .eq('category', category)
            .eq('is_active', true)
            .order('commission_rate', { ascending: false })
            .limit(5);

        if (products && products.length > 0) {
            const productIds = products.map(p => p.id);

            // Update article with affiliate products
            await supabase
                .from('articles')
                .update({
                    affiliate_products: productIds,
                    updated_at: new Date().toISOString()
                })
                .eq('id', articleId);

            logger.info(`Auto-integrated ${productIds.length} affiliate products into article ${articleId}`);
        }
    } catch (error) {
        logger.error('Failed to auto-integrate affiliates', error as Error);
        // Don't throw - affiliate integration is nice-to-have
    }
}

/**
 * Generate content for multiple keywords
 */
export async function generateContentForKeywords(
    keywords: DiscoveredKeyword[],
    maxConcurrent: number = 3
): Promise<KeywordContentGenerationResult[]> {
    logger.info(`Generating content for ${keywords.length} keywords`);

    const results: KeywordContentGenerationResult[] = [];
    const batches: DiscoveredKeyword[][] = [];

    // Create batches
    for (let i = 0; i < keywords.length; i += maxConcurrent) {
        batches.push(keywords.slice(i, i + maxConcurrent));
    }

    // Process batches sequentially
    for (const batch of batches) {
        const batchResults = await Promise.all(
            batch.map(keyword => generateContentForKeyword(keyword))
        );

        results.push(...batchResults);

        // Rate limiting between batches
        if (batches.indexOf(batch) < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    const successCount = results.filter(r => r.success).length;
    logger.info(`Content generation complete: ${successCount}/${keywords.length} successful`);

    return results;
}

/**
 * Discover and generate content for new keywords
 */
export async function discoverAndGenerateContent(
    category: 'credit-cards' | 'mutual-funds',
    keywordLimit: number = 5
): Promise<KeywordContentGenerationResult[]> {
    logger.info(`Discovering and generating content for ${category}`, { keywordLimit });

    // Discover keywords
    const keywords = await getTopKeywordsForGeneration(category, keywordLimit);

    if (keywords.length === 0) {
        logger.warn(`No keywords discovered for ${category}`);
        return [];
    }

    logger.info(`Discovered ${keywords.length} keywords, generating content...`);

    // Generate content
    const results = await generateContentForKeywords(keywords, 2); // 2 concurrent to avoid rate limits

    return results;
}

/**
 * Discover and generate content for both categories
 */
export async function discoverAndGenerateContentForBoth(
    keywordsPerCategory: number = 5
): Promise<{
    'credit-cards': KeywordContentGenerationResult[];
    'mutual-funds': KeywordContentGenerationResult[];
}> {
    logger.info('Starting keyword discovery and content generation for both categories');

    const [creditCards, mutualFunds] = await Promise.all([
        discoverAndGenerateContent('credit-cards', keywordsPerCategory),
        discoverAndGenerateContent('mutual-funds', keywordsPerCategory)
    ]);

    return {
        'credit-cards': creditCards,
        'mutual-funds': mutualFunds
    };
}
