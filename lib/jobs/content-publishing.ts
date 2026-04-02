/**
 * Content Publishing Background Job
 * 
 * Daily job that publishes 10 articles/day in Credit Cards + Mutual Funds
 * Focus: Decision-focused content only ("Best card for X" not "What is credit card?")
 * Auto-affiliate integration
 * Auto-publishing workflow
 */

import { inngest } from '@/lib/inngest/client';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import { runAutomationPipeline } from '@/lib/automation/content-pipeline';
import { PipelineConfig } from '@/lib/automation/content-pipeline';

// Decision-focused topics for Credit Cards
const CREDIT_CARD_TOPICS = [
    "Best credit card for online shopping in India 2026",
    "Best credit card for fuel expenses in India",
    "Best credit card for travel rewards India 2026",
    "Best credit card for dining and restaurants",
    "Best lifetime free credit cards India 2026",
    "Best credit card for cashback India 2026",
    "Best credit card for students India",
    "Best credit card for salaried employees",
    "Best credit card for business expenses",
    "Best credit card for international travel",
    "Best credit card for groceries and supermarkets",
    "Best credit card for movie tickets and entertainment",
    "Best credit card for EMI payments",
    "Best credit card for high spenders",
    "Best credit card for low income earners"
];

// Decision-focused topics for Mutual Funds
const MUTUAL_FUND_TOPICS = [
    "Best mutual funds for retirement planning India 2026",
    "Best mutual funds for tax saving ELSS 2026",
    "Best mutual funds for SIP investment India 2026",
    "Best mutual funds for long term wealth creation",
    "Best mutual funds for aggressive investors India",
    "Best mutual funds for conservative investors",
    "Best mutual funds for 5 year investment",
    "Best mutual funds for 10 year investment",
    "Best mutual funds for children education planning",
    "Best mutual funds for house down payment",
    "Best mutual funds for emergency fund",
    "Best mutual funds for monthly income",
    "Best index funds India 2026",
    "Best large cap mutual funds India 2026",
    "Best mid cap mutual funds India 2026"
];

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
        throw new Error('Supabase credentials not found');
    }
    
    return createClient(url, key);
}

/**
 * Get topics that haven't been published yet
 */
async function getUnpublishedTopics(category: 'credit-cards' | 'mutual-funds', limit: number = 5): Promise<string[]> {
    const supabase = getSupabaseClient();
    
    const topics = category === 'credit-cards' ? CREDIT_CARD_TOPICS : MUTUAL_FUND_TOPICS;
    
    // Get all published article titles
    const { data: publishedArticles } = await supabase
        .from('articles')
        .select('title')
        .eq('category', category)
        .eq('status', 'published');
    
    const publishedTitles = new Set((publishedArticles || []).map(a => a.title.toLowerCase()));
    
    // Filter out already published topics
    const unpublishedTopics = topics.filter(topic => {
        const topicLower = topic.toLowerCase();
        return !Array.from(publishedTitles).some(title => title.includes(topicLower) || topicLower.includes(title));
    });
    
    return unpublishedTopics.slice(0, limit);
}

/**
 * Auto-integrate affiliate products into article
 */
async function autoIntegrateAffiliates(articleId: string, category: 'credit-cards' | 'mutual-funds'): Promise<void> {
    const supabase = getSupabaseClient();
    
    try {
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
        // Don't throw - affiliate integration is nice-to-have, not critical
    }
}

/**
 * Daily Content Publishing Job
 * Publishes 10 articles/day (5 Credit Cards + 5 Mutual Funds)
 */
export const contentPublishingJob = inngest.createFunction(
    {
        id: 'content-publishing',
        name: 'Daily Content Publishing Job',
        description: 'Publishes 10 decision-focused articles/day in Credit Cards + Mutual Funds'
    },
    { cron: '0 6 * * *' }, // Daily at 6 AM
    async ({ step }: any) => {
        const results = {
            creditCards: { success: 0, failed: 0, errors: [] as string[] },
            mutualFunds: { success: 0, failed: 0, errors: [] as string[] }
        };

        // Step 1: Generate 5 Credit Card articles
        await step.run('generate-credit-card-articles', async () => {
            logger.info('Starting Credit Card article generation (5 articles)');
            
            const topics = await getUnpublishedTopics('credit-cards', 5);
            
            if (topics.length === 0) {
                logger.warn('No unpublished Credit Card topics found');
                return;
            }
            
            for (const topic of topics) {
                try {
                    const config: PipelineConfig = {
                        topic,
                        category: 'credit-cards',
                        contentType: 'comparison', // Decision-focused
                        autoPublish: true, // Auto-publish after generation
                        generateImages: true,
                        minQualityScore: 70,
                        maxPlagiarismPercentage: 5,
                        minSEOScore: 80
                    };
                    
                    const result = await runAutomationPipeline(config);
                    
                    if (result.success && result.article_id) {
                        // Auto-integrate affiliates
                        await autoIntegrateAffiliates(result.article_id, 'credit-cards');
                        results.creditCards.success++;
                        logger.info(`Published Credit Card article: ${topic} (ID: ${result.article_id}, Slug: ${result.article_slug})`);
                    } else {
                        results.creditCards.failed++;
                        const errorMsg = result.errors && result.errors.length > 0 
                            ? result.errors.join(', ') 
                            : 'Unknown error';
                        results.creditCards.errors.push(`${topic}: ${errorMsg}`);
                    }
                } catch (error) {
                    results.creditCards.failed++;
                    results.creditCards.errors.push(`${topic}: ${(error as Error).message}`);
                    logger.error(`Failed to generate Credit Card article: ${topic}`, error as Error);
                }
            }
        });

        // Step 2: Generate 5 Mutual Fund articles
        await step.run('generate-mutual-fund-articles', async () => {
            logger.info('Starting Mutual Fund article generation (5 articles)');
            
            const topics = await getUnpublishedTopics('mutual-funds', 5);
            
            if (topics.length === 0) {
                logger.warn('No unpublished Mutual Fund topics found');
                return;
            }
            
            for (const topic of topics) {
                try {
                    const config: PipelineConfig = {
                        topic,
                        category: 'mutual-funds',
                        contentType: 'comparison', // Decision-focused
                        autoPublish: true, // Auto-publish after generation
                        generateImages: true,
                        minQualityScore: 70,
                        maxPlagiarismPercentage: 5,
                        minSEOScore: 80
                    };
                    
                    const result = await runAutomationPipeline(config);
                    
                    if (result.success && result.article_id) {
                        // Auto-integrate affiliates
                        await autoIntegrateAffiliates(result.article_id, 'mutual-funds');
                        results.mutualFunds.success++;
                        logger.info(`Published Mutual Fund article: ${topic} (ID: ${result.article_id}, Slug: ${result.article_slug})`);
                    } else {
                        results.mutualFunds.failed++;
                        const errorMsg = result.errors && result.errors.length > 0 
                            ? result.errors.join(', ') 
                            : 'Unknown error';
                        results.mutualFunds.errors.push(`${topic}: ${errorMsg}`);
                    }
                } catch (error) {
                    results.mutualFunds.failed++;
                    results.mutualFunds.errors.push(`${topic}: ${(error as Error).message}`);
                    logger.error(`Failed to generate Mutual Fund article: ${topic}`, error as Error);
                }
            }
        });

        // Step 3: Log summary
        await step.run('log-summary', async () => {
            const totalSuccess = results.creditCards.success + results.mutualFunds.success;
            const totalFailed = results.creditCards.failed + results.mutualFunds.failed;
            
            logger.info('Content Publishing Job Summary', {
                creditCards: {
                    success: results.creditCards.success,
                    failed: results.creditCards.failed
                },
                mutualFunds: {
                    success: results.mutualFunds.success,
                    failed: results.mutualFunds.failed
                },
                total: {
                    success: totalSuccess,
                    failed: totalFailed
                },
                errors: [...results.creditCards.errors, ...results.mutualFunds.errors]
            });
            
            if (totalSuccess < 10) {
                logger.warn(`Only ${totalSuccess}/10 articles published today. Target: 10/day`);
            }
        });

        return results;
    }
);
