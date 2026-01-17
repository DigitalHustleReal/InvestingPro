/**
 * Keyword Cannibalization Detector
 * 
 * Detects when multiple articles compete for the same keywords
 * - Identifies duplicate keyword targeting
 * - Suggests consolidation or keyword differentiation
 * - Analyzes ranking performance
 * - Recommends fixes
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface CannibalizationIssue {
    keyword: string;
    competingArticles: Array<{
        articleId: string;
        slug: string;
        title: string;
        primaryKeyword: string;
        secondaryKeywords: string[];
        status: string;
        views: number;
        publishedDate?: string;
    }>;
    severity: 'high' | 'medium' | 'low';
    recommendation: 'consolidate' | 'differentiate' | 'archive' | 'redirect';
    reason: string;
}

export interface CannibalizationReport {
    totalIssues: number;
    highSeverity: number;
    mediumSeverity: number;
    lowSeverity: number;
    issues: CannibalizationIssue[];
}

/**
 * Detect keyword cannibalization across all articles
 */
export async function detectCannibalization(options?: {
    minCompetitors?: number; // Minimum articles competing for same keyword
    checkPublishedOnly?: boolean;
}): Promise<CannibalizationReport> {
    const supabase = await createClient();
    const minCompetitors = options?.minCompetitors || 2;
    const checkPublishedOnly = options?.checkPublishedOnly !== false; // Default true

    try {
        // Build query for articles
        let query = supabase
            .from('articles')
            .select('id, slug, title, primary_keyword, secondary_keywords, status, views, published_date')
            .not('primary_keyword', 'is', null);

        if (checkPublishedOnly) {
            query = query.eq('status', 'published');
        }

        const { data: articles, error } = await query;

        if (error || !articles) {
            logger.error('Failed to fetch articles for cannibalization detection', error as Error);
            return {
                totalIssues: 0,
                highSeverity: 0,
                mediumSeverity: 0,
                lowSeverity: 0,
                issues: []
            };
        }

        // Group articles by primary keyword
        const keywordMap = new Map<string, typeof articles>();

        for (const article of articles) {
            const primaryKeyword = (article.primary_keyword || '').toLowerCase().trim();
            if (!primaryKeyword) continue;

            if (!keywordMap.has(primaryKeyword)) {
                keywordMap.set(primaryKeyword, []);
            }
            keywordMap.get(primaryKeyword)!.push(article);
        }

        // Find keywords with multiple articles (potential cannibalization)
        const issues: CannibalizationIssue[] = [];

        for (const [keyword, competingArticles] of keywordMap.entries()) {
            if (competingArticles.length < minCompetitors) continue;

            // Calculate severity
            let severity: 'high' | 'medium' | 'low' = 'low';
            if (competingArticles.length >= 4) {
                severity = 'high';
            } else if (competingArticles.length >= 3) {
                severity = 'medium';
            }

            // Check for exact title duplicates (very high severity)
            const titles = competingArticles.map(a => (a.title || '').toLowerCase());
            const duplicateTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
            if (duplicateTitles.length > 0) {
                severity = 'high';
            }

            // Determine recommendation
            let recommendation: 'consolidate' | 'differentiate' | 'archive' | 'redirect' = 'differentiate';
            let reason = `${competingArticles.length} articles targeting the same primary keyword "${keyword}"`;

            // If 4+ articles, recommend consolidation
            if (competingArticles.length >= 4) {
                recommendation = 'consolidate';
                reason = `Too many articles (${competingArticles.length}) competing for "${keyword}". Consider consolidating into one comprehensive article.`;
            }

            // If duplicate titles, recommend archiving one
            if (duplicateTitles.length > 0) {
                recommendation = 'archive';
                reason = `Duplicate titles detected. Archive the less-performing article.`;
            }

            // If articles have similar keywords, recommend differentiation
            const allSecondaryKeywords = competingArticles
                .flatMap(a => (a.secondary_keywords || []) as string[])
                .map(k => k.toLowerCase());

            const commonSecondaryKeywords = allSecondaryKeywords.filter((k, i) =>
                allSecondaryKeywords.indexOf(k) !== i
            );

            if (commonSecondaryKeywords.length > 0 && competingArticles.length === 2) {
                recommendation = 'differentiate';
                reason = `Articles share secondary keywords. Differentiate by focusing on unique aspects.`;
            }

            issues.push({
                keyword,
                competingArticles: competingArticles.map(a => ({
                    articleId: a.id,
                    slug: a.slug || '',
                    title: a.title || '',
                    primaryKeyword: a.primary_keyword || '',
                    secondaryKeywords: (a.secondary_keywords || []) as string[],
                    status: a.status || 'draft',
                    views: a.views || 0,
                    publishedDate: a.published_date
                })),
                severity,
                recommendation,
                reason
            });
        }

        // Sort by severity (high first)
        issues.sort((a, b) => {
            const severityOrder = { high: 3, medium: 2, low: 1 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });

        const highSeverity = issues.filter(i => i.severity === 'high').length;
        const mediumSeverity = issues.filter(i => i.severity === 'medium').length;
        const lowSeverity = issues.filter(i => i.severity === 'low').length;

        return {
            totalIssues: issues.length,
            highSeverity,
            mediumSeverity,
            lowSeverity,
            issues
        };
    } catch (error) {
        logger.error('Error detecting cannibalization', error as Error);
        return {
            totalIssues: 0,
            highSeverity: 0,
            mediumSeverity: 0,
            lowSeverity: 0,
            issues: []
        };
    }
}

/**
 * Check for cannibalization for a specific article
 */
export async function checkArticleCannibalization(
    articleId: string
): Promise<{
    hasIssue: boolean;
    issues: CannibalizationIssue[];
}> {
    try {
        const supabase = await createClient();

        // Get article
        const { data: article, error } = await supabase
            .from('articles')
            .select('id, slug, title, primary_keyword, secondary_keywords, status')
            .eq('id', articleId)
            .single();

        if (error || !article) {
            logger.error('Failed to fetch article for cannibalization check', error as Error);
            return { hasIssue: false, issues: [] };
        }

        const primaryKeyword = (article.primary_keyword || '').toLowerCase().trim();
        if (!primaryKeyword) {
            return { hasIssue: false, issues: [] };
        }

        // Find competing articles
        const { data: competingArticles, error: competingError } = await supabase
            .from('articles')
            .select('id, slug, title, primary_keyword, secondary_keywords, status, views, published_date')
            .eq('primary_keyword', article.primary_keyword)
            .eq('status', 'published')
            .neq('id', articleId);

        if (competingError || !competingArticles || competingArticles.length === 0) {
            return { hasIssue: false, issues: [] };
        }

        // Create issue
        const issue: CannibalizationIssue = {
            keyword: primaryKeyword,
            competingArticles: competingArticles.map(a => ({
                articleId: a.id,
                slug: a.slug || '',
                title: a.title || '',
                primaryKeyword: a.primary_keyword || '',
                secondaryKeywords: (a.secondary_keywords || []) as string[],
                status: a.status || 'draft',
                views: a.views || 0,
                publishedDate: a.published_date
            })),
            severity: competingArticles.length >= 3 ? 'high' : 'medium',
            recommendation: competingArticles.length >= 3 ? 'consolidate' : 'differentiate',
            reason: `${competingArticles.length} other published articles target the same keyword "${primaryKeyword}"`
        };

        return {
            hasIssue: true,
            issues: [issue]
        };
    } catch (error) {
        logger.error('Error checking article cannibalization', error as Error);
        return { hasIssue: false, issues: [] };
    }
}

/**
 * Get recommendations to fix cannibalization
 */
export function getCannibalizationRecommendations(issue: CannibalizationIssue): string[] {
    const recommendations: string[] = [];

    switch (issue.recommendation) {
        case 'consolidate':
            // Find best performing article
            const bestArticle = issue.competingArticles.reduce((best, current) =>
                (current.views || 0) > (best.views || 0) ? current : best
            );

            recommendations.push(`Consolidate into: "${bestArticle.title}" (${bestArticle.views} views)`);
            recommendations.push('Merge content from other articles into the best-performing one');
            recommendations.push('Add 301 redirects from other articles to the consolidated article');
            recommendations.push('Update secondary keywords on consolidated article');
            break;

        case 'differentiate':
            recommendations.push('Focus each article on a unique aspect of the keyword');
            recommendations.push('Update secondary keywords to be more specific');
            recommendations.push('Consider long-tail keyword variations');
            recommendations.push('Add unique content sections to each article');
            break;

        case 'archive':
            const lowestPerformer = issue.competingArticles.reduce((lowest, current) =>
                (current.views || 0) < (lowest.views || 0) ? current : lowest
            );

            recommendations.push(`Archive: "${lowestPerformer.title}" (${lowestPerformer.views} views)`);
            recommendations.push('Redirect archived article to the better-performing one');
            recommendations.push('Preserve content by merging useful sections into main article');
            break;

        case 'redirect':
            recommendations.push('Redirect one article to the other');
            recommendations.push('Update canonical tags');
            recommendations.push('Preserve link equity through redirects');
            break;
    }

    return recommendations;
}
