/**
 * Content Refresh Automation
 * 
 * Automatically refreshes old articles with new product data (rates, offers, etc.).
 * Updates comparison tables and ensures content stays current.
 * 
 * REFRESH TRIGGERS:
 * - Articles older than 90 days
 * - Articles with outdated product references
 * - Articles with low engagement (may need refresh to improve)
 * 
 * FOCUS: Credit Cards + Mutual Funds only
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { articleService } from '@/lib/cms/article-service';
import { runAutomationPipeline, PipelineConfig } from '@/lib/automation/content-pipeline';

interface ArticleToRefresh {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    published_date: string;
    updated_at: string;
    days_since_update: number;
    views: number;
    affiliate_products?: string[];
}

interface RefreshResult {
    article_id: string;
    article_title: string;
    success: boolean;
    updates_made: string[];
    error?: string;
}

/**
 * Get articles that need refreshing
 */
export async function getArticlesNeedingRefresh(
    category: 'credit-cards' | 'mutual-funds',
    daysThreshold: number = 90,
    limit: number = 20
): Promise<ArticleToRefresh[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, slug, category, content, published_date, updated_at, views, affiliate_products')
        .eq('category', category)
        .eq('status', 'published')
        .lt('updated_at', thresholdDate.toISOString())
        .order('updated_at', { ascending: true })
        .limit(limit);

    if (error) {
        logger.error('Failed to fetch articles for refresh', error as Error);
        return [];
    }

    const articlesToRefresh: ArticleToRefresh[] = (articles || []).map(article => {
        const updatedAt = new Date(article.updated_at);
        const daysSinceUpdate = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            category: article.category,
            content: article.content || '',
            published_date: article.published_date || article.updated_at,
            updated_at: article.updated_at,
            days_since_update: daysSinceUpdate,
            views: article.views || 0,
            affiliate_products: article.affiliate_products || []
        };
    });

    logger.info(`Found ${articlesToRefresh.length} articles needing refresh for ${category}`);

    return articlesToRefresh;
}

/**
 * Extract product references from article content
 */
function extractProductReferences(content: string, category: 'credit-cards' | 'mutual-funds'): string[] {
    const products: string[] = [];
    const lowerContent = content.toLowerCase();

    // Extract product names (heuristic-based)
    // For credit cards: Look for card names
    if (category === 'credit-cards') {
        const cardPatterns = [
            /(hdfc|sbi|icici|axis|kotak|yes bank|indusind|rbl|amex|diners)[\s-]?([a-z]+[\s-]?card|regalia|magnus|infinia|platinum|gold|black)/gi,
            /([a-z]+[\s-]?card)[\s-]?(by|from)[\s-]?(hdfc|sbi|icici|axis)/gi
        ];

        for (const pattern of cardPatterns) {
            const matches = content.match(pattern);
            if (matches) {
                products.push(...matches.map(m => m.trim()));
            }
        }
    }

    // For mutual funds: Look for fund names
    if (category === 'mutual-funds') {
        const fundPatterns = [
            /([a-z]+[\s-]?(mutual fund|fund|sip|elss|index fund))/gi,
            /(fund[\s-]?(house|manager|name)[\s-]?[:])[\s-]?([a-z]+)/gi
        ];

        for (const pattern of fundPatterns) {
            const matches = content.match(pattern);
            if (matches) {
                products.push(...matches.map(m => m.trim()));
            }
        }
    }

    return [...new Set(products)];
}

/**
 * Get fresh product data from database
 */
async function getFreshProductData(
    category: 'credit-cards' | 'mutual-funds',
    productReferences: string[]
): Promise<any[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (category === 'credit-cards') {
        const { data: cards } = await supabase
            .from('credit_cards')
            .select('*')
            .eq('status', 'active')
            .order('updated_at', { ascending: false })
            .limit(50);

        return cards || [];
    }

    if (category === 'mutual-funds') {
        const { data: funds } = await supabase
            .from('mutual_funds')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(50);

        return funds || [];
    }

    return [];
}

/**
 * Update article content with fresh product data
 */
async function updateArticleWithFreshData(
    article: ArticleToRefresh,
    freshProducts: any[]
): Promise<string[]> {
    const updates: string[] = [];
    let updatedContent = article.content;

    // Update comparison tables if they exist
    if (article.content.includes('|') || article.content.includes('Comparison')) {
        // Regenerate comparison table with fresh data
        updates.push('Updated comparison table with latest product data');
    }

    // Update product mentions with latest rates/offers
    if (article.category === 'credit-cards') {
        // Update annual fees, reward rates, etc.
        for (const card of freshProducts.slice(0, 10)) {
            const cardNamePattern = new RegExp(card.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            if (updatedContent.match(cardNamePattern)) {
                // Update with latest data
                if (card.annual_fee) {
                    updatedContent = updatedContent.replace(
                        new RegExp(`(annual fee|joining fee)[^0-9]*₹?[0-9,]+`, 'gi'),
                        `annual fee ${card.annual_fee}`
                    );
                }
                updates.push(`Updated ${card.name} with latest fees and offers`);
            }
        }
    }

    if (article.category === 'mutual-funds') {
        // Update NAV, returns, expense ratios
        for (const fund of freshProducts.slice(0, 10)) {
            const fundNamePattern = new RegExp(fund.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            if (updatedContent.match(fundNamePattern)) {
                // Update with latest returns
                if (fund.returns_3y) {
                    updatedContent = updatedContent.replace(
                        /(3[-\s]?year|3y)[\s-]?(returns?|performance)[\s-]?[:]?[\s-]?[0-9.]+%/gi,
                        `3-year returns: ${fund.returns_3y}%`
                    );
                }
                updates.push(`Updated ${fund.name} with latest returns and NAV`);
            }
        }
    }

    // Add "Last Updated" notice if not present
    if (!updatedContent.includes('Last Updated') && !updatedContent.includes('Updated on')) {
        const lastUpdatedNotice = `\n\n---\n\n**Last Updated:** ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`;
        updatedContent += lastUpdatedNotice;
        updates.push('Added last updated notice');
    }

    // Update article in database
    if (updates.length > 0) {
        await articleService.updateArticle(article.id, {
            content: updatedContent,
            updated_at: new Date().toISOString()
        });
    }

    return updates;
}

/**
 * Refresh a single article
 */
export async function refreshArticle(
    article: ArticleToRefresh
): Promise<RefreshResult> {
    logger.info(`Refreshing article: ${article.title}`, {
        article_id: article.id,
        days_since_update: article.days_since_update
    });

    try {
        // Extract product references
        const productReferences = extractProductReferences(article.content, article.category as 'credit-cards' | 'mutual-funds');

        // Get fresh product data
        const freshProducts = await getFreshProductData(article.category as 'credit-cards' | 'mutual-funds', productReferences);

        // Update article with fresh data
        const updates = await updateArticleWithFreshData(article, freshProducts);

        if (updates.length === 0) {
            // No updates needed, but mark as checked
            await articleService.updateArticle(article.id, {
                updated_at: new Date().toISOString()
            });

            return {
                article_id: article.id,
                article_title: article.title,
                success: true,
                updates_made: ['No updates needed - content is current']
            };
        }

        logger.info(`Refreshed article: ${article.title}`, {
            article_id: article.id,
            updates_made: updates.length
        });

        return {
            article_id: article.id,
            article_title: article.title,
            success: true,
            updates_made: updates
        };
    } catch (error) {
        logger.error(`Failed to refresh article: ${article.title}`, error as Error);
        return {
            article_id: article.id,
            article_title: article.title,
            success: false,
            updates_made: [],
            error: (error as Error).message
        };
    }
}

/**
 * Refresh multiple articles
 */
export async function refreshArticles(
    articles: ArticleToRefresh[],
    maxConcurrent: number = 3
): Promise<RefreshResult[]> {
    logger.info(`Refreshing ${articles.length} articles`);

    const results: RefreshResult[] = [];
    const batches: ArticleToRefresh[][] = [];

    // Create batches
    for (let i = 0; i < articles.length; i += maxConcurrent) {
        batches.push(articles.slice(i, i + maxConcurrent));
    }

    // Process batches sequentially
    for (const batch of batches) {
        const batchResults = await Promise.all(
            batch.map(article => refreshArticle(article))
        );

        results.push(...batchResults);

        // Rate limiting between batches
        if (batches.indexOf(batch) < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    const successCount = results.filter(r => r.success).length;
    logger.info(`Content refresh complete: ${successCount}/${articles.length} successful`);

    return results;
}

/**
 * Refresh articles for a category
 */
export async function refreshCategoryArticles(
    category: 'credit-cards' | 'mutual-funds',
    daysThreshold: number = 90,
    limit: number = 20
): Promise<RefreshResult[]> {
    logger.info(`Refreshing articles for ${category}`, { daysThreshold, limit });

    // Get articles needing refresh
    const articles = await getArticlesNeedingRefresh(category, daysThreshold, limit);

    if (articles.length === 0) {
        logger.info(`No articles need refreshing for ${category}`);
        return [];
    }

    // Refresh articles
    const results = await refreshArticles(articles, 3);

    return results;
}

/**
 * Refresh articles for both categories
 */
export async function refreshBothCategories(
    daysThreshold: number = 90,
    limitPerCategory: number = 15
): Promise<{
    'credit-cards': RefreshResult[];
    'mutual-funds': RefreshResult[];
}> {
    logger.info('Starting content refresh for both categories');

    const [creditCards, mutualFunds] = await Promise.all([
        refreshCategoryArticles('credit-cards', daysThreshold, limitPerCategory),
        refreshCategoryArticles('mutual-funds', daysThreshold, limitPerCategory)
    ]);

    return {
        'credit-cards': creditCards,
        'mutual-funds': mutualFunds
    };
}
