/**
 * Broken Link Checker and Repair Service
 * 
 * Detects and repairs broken links:
 * - Detects broken internal links
 * - Detects broken external links
 * - Auto-repairs internal links (slug changes, redirects)
 * - Reports broken external links
 * - Link health monitoring
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface LinkInfo {
    url: string;
    anchorText: string;
    type: 'internal' | 'external';
    articleId: string;
    position?: number; // Character position in content
}

export interface BrokenLink {
    link: LinkInfo;
    statusCode?: number;
    error: string;
    lastChecked: string;
    severity: 'critical' | 'warning';
    canRepair: boolean;
    repairSuggestion?: string;
}

export interface LinkHealthReport {
    totalLinks: number;
    brokenLinks: number;
    internalBroken: number;
    externalBroken: number;
    repaired: number;
    needsManualReview: number;
    brokenLinksList: BrokenLink[];
}

/**
 * Extract all links from article content
 */
export function extractLinks(content: string, articleId: string): LinkInfo[] {
    const links: LinkInfo[] = [];

    if (!content) return links;

    // Extract links from HTML (<a href="...">text</a>)
    const htmlLinkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
    let match;

    while ((match = htmlLinkRegex.exec(content)) !== null) {
        const url = match[1];
        const anchorText = match[2] || url;
        const position = match.index;

        if (url) {
            links.push({
                url,
                anchorText: anchorText.trim(),
                type: url.startsWith('/') || url.startsWith(process.env.NEXT_PUBLIC_SITE_URL || '') ? 'internal' : 'external',
                articleId,
                position
            });
        }
    }

    // Extract links from Markdown ([text](url))
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    while ((match = markdownLinkRegex.exec(content)) !== null) {
        const anchorText = match[1];
        const url = match[2];
        const position = match.index;

        if (url && !url.startsWith('#') && !url.startsWith('mailto:')) {
            links.push({
                url,
                anchorText: anchorText.trim(),
                type: url.startsWith('/') ? 'internal' : 'external',
                articleId,
                position
            });
        }
    }

    return links;
}

/**
 * Check if internal link is valid (article exists)
 */
async function checkInternalLink(url: string): Promise<{ valid: boolean; error?: string; redirect?: string }> {
    const supabase = await createClient();

    try {
        // Extract slug from URL (e.g., "/articles/my-slug" -> "my-slug")
        const slugMatch = url.match(/\/(?:articles|blog|post)\/([^/?]+)/);
        const slug = slugMatch ? slugMatch[1] : url.replace(/^\//, '').split('/').pop();

        if (!slug) {
            return { valid: false, error: 'Invalid URL format' };
        }

        // Check if article exists
        const { data: article, error } = await supabase
            .from('articles')
            .select('id, slug, status')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error || !article) {
            // Try to find similar slug (typo fix)
            const { data: similarArticles } = await supabase
                .from('articles')
                .select('slug')
                .eq('status', 'published')
                .ilike('slug', `%${slug}%`)
                .limit(1);

            if (similarArticles && similarArticles.length > 0) {
                return {
                    valid: false,
                    error: 'Article not found',
                    redirect: `/articles/${similarArticles[0].slug}`
                };
            }

            return { valid: false, error: 'Article not found' };
        }

        return { valid: true };
    } catch (error) {
        logger.error('Error checking internal link', error as Error, { url });
        return { valid: false, error: 'Check failed' };
    }
}

/**
 * Check if external link is accessible
 */
async function checkExternalLink(url: string): Promise<{ valid: boolean; statusCode?: number; error?: string }> {
    try {
        // Skip mailto, tel, and anchor links
        if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
            return { valid: true };
        }

        // Make HEAD request to check link
        const response = await fetch(url, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Mozilla/5.0 (InvestingPro Link Checker)'
            },
            signal: AbortSignal.timeout(5000), // 5 second timeout
            redirect: 'follow'
        });

        const statusCode = response.status;

        // 2xx and 3xx are considered valid
        if (statusCode >= 200 && statusCode < 400) {
            return { valid: true, statusCode };
        }

        return {
            valid: false,
            statusCode,
            error: `HTTP ${statusCode}`
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Network errors, timeouts, etc.
        return {
            valid: false,
            error: errorMessage.includes('timeout') ? 'Timeout' : errorMessage
        };
    }
}

/**
 * Check all links in an article
 */
export async function checkArticleLinks(articleId: string): Promise<BrokenLink[]> {
    const supabase = await createClient();
    const brokenLinks: BrokenLink[] = [];

    try {
        // Get article content
        const { data: article, error } = await supabase
            .from('articles')
            .select('id, content, body_html, body_markdown')
            .eq('id', articleId)
            .single();

        if (error || !article) {
            logger.error('Failed to fetch article for link checking', error as Error, { articleId });
            return brokenLinks;
        }

        // Use HTML content if available, otherwise markdown
        const content = article.body_html || article.body_markdown || article.content || '';

        // Extract all links
        const links = extractLinks(content, articleId);

        // Check each link
        for (const link of links) {
            let isValid = false;
            let statusCode: number | undefined;
            let error: string | undefined;
            let redirect: string | undefined;

            if (link.type === 'internal') {
                const result = await checkInternalLink(link.url);
                isValid = result.valid;
                error = result.error;
                redirect = result.redirect;
            } else {
                const result = await checkExternalLink(link.url);
                isValid = result.valid;
                statusCode = result.statusCode;
                error = result.error;
            }

            if (!isValid) {
                brokenLinks.push({
                    link,
                    statusCode,
                    error: error || 'Unknown error',
                    lastChecked: new Date().toISOString(),
                    severity: link.type === 'internal' ? 'critical' : 'warning',
                    canRepair: link.type === 'internal' && !!redirect,
                    repairSuggestion: redirect ? `Redirect to: ${redirect}` : undefined
                });
            }

            // Rate limiting: 100ms between external link checks
            if (link.type === 'external') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return brokenLinks;
    } catch (error) {
        logger.error('Error checking article links', error as Error, { articleId });
        return brokenLinks;
    }
}

/**
 * Repair broken internal link
 */
export async function repairInternalLink(
    articleId: string,
    oldUrl: string,
    newUrl: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    try {
        // Get article content
        const { data: article, error: fetchError } = await supabase
            .from('articles')
            .select('id, content, body_html, body_markdown')
            .eq('id', articleId)
            .single();

        if (fetchError || !article) {
            return { success: false, error: 'Article not found' };
        }

        const content = article.body_html || article.body_markdown || article.content || '';

        // Replace old URL with new URL
        let newContent = content.replace(
            new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            newUrl
        );

        // Update article content
        const updateData: any = {};
        if (article.body_html) {
            updateData.body_html = newContent;
        } else if (article.body_markdown) {
            updateData.body_markdown = newContent;
        } else {
            updateData.content = newContent;
        }

        const { error: updateError } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', articleId);

        if (updateError) {
            return { success: false, error: updateError.message };
        }

        logger.info('Internal link repaired', { articleId, oldUrl, newUrl });
        return { success: true };
    } catch (error) {
        logger.error('Error repairing internal link', error as Error, { articleId, oldUrl, newUrl });
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Auto-repair all broken internal links in an article
 */
export async function autoRepairArticleLinks(articleId: string): Promise<{
    repaired: number;
    failed: number;
    errors: Array<{ url: string; error: string }>;
}> {
    const results = {
        repaired: 0,
        failed: 0,
        errors: [] as Array<{ url: string; error: string }>
    };

    try {
        const brokenLinks = await checkArticleLinks(articleId);

        // Only repair internal links with repair suggestions
        const repairableLinks = brokenLinks.filter(
            link => link.canRepair && link.repairSuggestion
        );

        for (const brokenLink of repairableLinks) {
            const redirectMatch = brokenLink.repairSuggestion?.match(/Redirect to: (.+)/);
            const newUrl = redirectMatch ? redirectMatch[1] : undefined;

            if (newUrl) {
                const repairResult = await repairInternalLink(
                    articleId,
                    brokenLink.link.url,
                    newUrl
                );

                if (repairResult.success) {
                    results.repaired++;
                } else {
                    results.failed++;
                    results.errors.push({
                        url: brokenLink.link.url,
                        error: repairResult.error || 'Unknown error'
                    });
                }
            }
        }

        logger.info('Auto-repair completed', { articleId, ...results });
        return results;
    } catch (error) {
        logger.error('Error auto-repairing article links', error as Error, { articleId });
        return results;
    }
}

/**
 * Check all published articles for broken links
 */
export async function checkAllArticlesLinks(options?: {
    limit?: number;
    articleIds?: string[];
}): Promise<LinkHealthReport> {
    const supabase = await createClient();
    const limit = options?.limit || 100;

    try {
        // Get published articles
        let query = supabase
            .from('articles')
            .select('id')
            .eq('status', 'published')
            .limit(limit);

        if (options?.articleIds) {
            query = query.in('id', options.articleIds);
        }

        const { data: articles, error } = await query;

        if (error || !articles) {
            logger.error('Failed to fetch articles for link checking', error as Error);
            return {
                totalLinks: 0,
                brokenLinks: 0,
                internalBroken: 0,
                externalBroken: 0,
                repaired: 0,
                needsManualReview: 0,
                brokenLinksList: []
            };
        }

        const allBrokenLinks: BrokenLink[] = [];
        let totalLinks = 0;

        // Check links in each article
        for (const article of articles) {
            const brokenLinks = await checkArticleLinks(article.id);
            allBrokenLinks.push(...brokenLinks);
            totalLinks += extractLinks(
                (article as any).content || '',
                article.id
            ).length;

            // Rate limiting: 1 second between articles
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const internalBroken = allBrokenLinks.filter(l => l.link.type === 'internal').length;
        const externalBroken = allBrokenLinks.filter(l => l.link.type === 'external').length;
        const needsManualReview = allBrokenLinks.filter(l => !l.canRepair).length;

        return {
            totalLinks,
            brokenLinks: allBrokenLinks.length,
            internalBroken,
            externalBroken,
            repaired: 0, // Will be updated after repair
            needsManualReview,
            brokenLinksList: allBrokenLinks
        };
    } catch (error) {
        logger.error('Error checking all article links', error as Error);
        return {
            totalLinks: 0,
            brokenLinks: 0,
            internalBroken: 0,
            externalBroken: 0,
            repaired: 0,
            needsManualReview: 0,
            brokenLinksList: []
        };
    }
}

/**
 * Batch repair broken internal links across all articles
 */
export async function batchRepairBrokenLinks(articleIds?: string[]): Promise<{
    totalRepaired: number;
    totalFailed: number;
    articlesRepaired: number;
    errors: Array<{ articleId: string; error: string }>;
}> {
    const results = {
        totalRepaired: 0,
        totalFailed: 0,
        articlesRepaired: 0,
        errors: [] as Array<{ articleId: string; error: string }>
    };

    try {
        const supabase = await createClient();

        // Get articles with broken links
        let query = supabase
            .from('articles')
            .select('id')
            .eq('status', 'published');

        if (articleIds) {
            query = query.in('id', articleIds);
        }

        const { data: articles } = await query;

        if (!articles) return results;

        // Repair links in each article
        for (const article of articles) {
            const repairResult = await autoRepairArticleLinks(article.id);

            results.totalRepaired += repairResult.repaired;
            results.totalFailed += repairResult.failed;

            if (repairResult.repaired > 0) {
                results.articlesRepaired++;
            }

            if (repairResult.errors.length > 0) {
                results.errors.push(...repairResult.errors.map(e => ({
                    articleId: article.id,
                    error: e.error
                })));
            }
        }

        return results;
    } catch (error) {
        logger.error('Error batch repairing links', error as Error);
        return results;
    }
}
