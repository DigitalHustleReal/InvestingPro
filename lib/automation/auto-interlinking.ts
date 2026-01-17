/**
 * Auto-Interlinking Service
 * 
 * Automatically finds and inserts internal links to related articles
 * - Finds related articles by keywords, category, tags
 * - Inserts links contextually within content
 * - Updates existing links
 * - Tracks link performance
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface InternalLink {
    text: string; // Anchor text
    url: string; // Article slug
    articleId: string;
    position?: number; // Character position in content
    context?: string; // Surrounding text for context
}

export interface InterlinkingResult {
    linksAdded: number;
    linksUpdated: number;
    linksRemoved: number;
    relatedArticles: string[]; // Article IDs
    suggestions: InternalLink[];
}

/**
 * Find related articles for a given article
 */
export async function findRelatedArticles(
    articleId: string,
    options?: {
        maxResults?: number;
        minRelevance?: number;
        category?: string;
        tags?: string[];
        keywords?: string[];
    }
): Promise<Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    tags: string[];
    relevanceScore: number;
}>> {
    const supabase = await createClient();
    const maxResults = options?.maxResults || 10;
    const minRelevance = options?.minRelevance || 0.3;

    // Get current article
    const { data: currentArticle, error: fetchError } = await supabase
        .from('articles')
        .select('id, title, category, tags, primary_keyword, secondary_keywords, content')
        .eq('id', articleId)
        .single();

    if (fetchError || !currentArticle) {
        logger.error('Failed to fetch article for interlinking', fetchError as Error, { articleId });
        return [];
    }

    // Build query for related articles
    let query = supabase
        .from('articles')
        .select('id, slug, title, category, tags, primary_keyword, secondary_keywords')
        .eq('status', 'published')
        .neq('id', articleId); // Exclude current article

    // Filter by category if provided
    if (options?.category || currentArticle.category) {
        query = query.eq('category', options?.category || currentArticle.category);
    }

    const { data: candidates, error: candidatesError } = await query;

    if (candidatesError || !candidates) {
        logger.error('Failed to fetch related articles', candidatesError as Error);
        return [];
    }

    // Calculate relevance scores
    const related = candidates.map(candidate => {
        let score = 0;

        // Category match: +0.4
        if (candidate.category === currentArticle.category) {
            score += 0.4;
        }

        // Tag overlap: +0.1 per matching tag
        const currentTags = currentArticle.tags || [];
        const candidateTags = candidate.tags || [];
        const commonTags = currentTags.filter(tag => candidateTags.includes(tag));
        score += commonTags.length * 0.1;

        // Keyword match: +0.2 per matching keyword
        const currentKeywords = [
            currentArticle.primary_keyword,
            ...(currentArticle.secondary_keywords || [])
        ].filter(Boolean) as string[];

        const candidateKeywords = [
            candidate.primary_keyword,
            ...(candidate.secondary_keywords || [])
        ].filter(Boolean) as string[];

        const commonKeywords = currentKeywords.filter(kw =>
            candidateKeywords.some(ckw => 
                ckw.toLowerCase().includes(kw.toLowerCase()) || 
                kw.toLowerCase().includes(ckw.toLowerCase())
            )
        );
        score += commonKeywords.length * 0.2;

        // Title similarity: +0.1 if words match
        const currentTitleWords = (currentArticle.title || '').toLowerCase().split(/\s+/);
        const candidateTitleWords = (candidate.title || '').toLowerCase().split(/\s+/);
        const commonWords = currentTitleWords.filter(word =>
            word.length > 3 && candidateTitleWords.includes(word)
        );
        score += commonWords.length * 0.05;

        return {
            id: candidate.id,
            slug: candidate.slug,
            title: candidate.title,
            category: candidate.category,
            tags: candidate.tags,
            relevanceScore: Math.min(score, 1.0) // Cap at 1.0
        };
    });

    // Sort by relevance and filter by minimum score
    return related
        .filter(r => r.relevanceScore >= minRelevance)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);
}

/**
 * Find link opportunities in article content
 */
export async function findLinkOpportunities(
    articleId: string,
    content: string,
    relatedArticles: Array<{ id: string; slug: string; title: string; category: string; keywords?: string[] }>
): Promise<InternalLink[]> {
    const opportunities: InternalLink[] = [];

    if (!content || relatedArticles.length === 0) {
        return opportunities;
    }

    // Extract keywords from each related article
    for (const article of relatedArticles) {
        const keywords = [
            article.title,
            ...(article.keywords || [])
        ].filter(Boolean) as string[];

        // Find keyword mentions in content
        for (const keyword of keywords) {
            if (!keyword || keyword.length < 3) continue;

            // Find all occurrences of keyword (case-insensitive)
            const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            const matches = Array.from(content.matchAll(regex));

            for (const match of matches) {
                if (!match.index) continue;

                // Check if already linked (simple check for existing <a> tags)
                const beforeMatch = content.substring(Math.max(0, match.index - 50), match.index);
                const afterMatch = content.substring(match.index, Math.min(content.length, match.index + keyword.length + 50));

                // Skip if already inside a link tag
                if (beforeMatch.includes('<a ') && !beforeMatch.includes('</a>')) {
                    continue;
                }

                // Get context (surrounding text)
                const contextStart = Math.max(0, match.index - 30);
                const contextEnd = Math.min(content.length, match.index + keyword.length + 30);
                const context = content.substring(contextStart, contextEnd);

                opportunities.push({
                    text: keyword,
                    url: `/articles/${article.slug}`,
                    articleId: article.id,
                    position: match.index,
                    context: context
                });
            }
        }
    }

    // Remove duplicates (same position)
    const uniqueOpportunities = opportunities.filter((opp, index, self) =>
        index === self.findIndex(o => o.position === opp.position && o.articleId === opp.articleId)
    );

    // Sort by position
    return uniqueOpportunities.sort((a, b) => (a.position || 0) - (b.position || 0));
}

/**
 * Insert links into content
 */
export function insertLinksIntoContent(
    content: string,
    links: InternalLink[],
    options?: {
        maxLinksPerArticle?: number;
        minDistanceBetweenLinks?: number;
    }
): { newContent: string; linksInserted: number } {
    const maxLinksPerArticle = options?.maxLinksPerArticle || 5;
    const minDistance = options?.minDistanceBetweenLinks || 200; // characters

    let newContent = content;
    let linksInserted = 0;
    const insertedPositions: number[] = [];

    // Sort links by position (ascending)
    const sortedLinks = [...links].sort((a, b) => (a.position || 0) - (b.position || 0));

    // Track links per article
    const linkCounts = new Map<string, number>();

    for (const link of sortedLinks) {
        if (!link.position) continue;

        // Check max links per article
        const count = linkCounts.get(link.articleId) || 0;
        if (count >= maxLinksPerArticle) continue;

        // Check minimum distance from previous links
        const tooClose = insertedPositions.some(pos =>
            Math.abs(pos - link.position!) < minDistance
        );
        if (tooClose) continue;

        // Insert link
        const before = newContent.substring(0, link.position);
        const match = newContent.substring(link.position);
        const keywordMatch = match.match(new RegExp(`\\b${link.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));

        if (keywordMatch && keywordMatch.index !== undefined) {
            const keywordStart = link.position + (keywordMatch.index || 0);
            const keywordEnd = keywordStart + link.text.length;

            // Wrap keyword in link
            const linkHtml = `<a href="${link.url}" class="internal-link" data-article-id="${link.articleId}">${link.text}</a>`;
            newContent = newContent.substring(0, keywordStart) +
                        linkHtml +
                        newContent.substring(keywordEnd);

            linksInserted++;
            insertedPositions.push(keywordStart);
            linkCounts.set(link.articleId, count + 1);

            // Update positions for remaining links (account for inserted HTML)
            const offset = linkHtml.length - link.text.length;
            for (let i = sortedLinks.indexOf(link) + 1; i < sortedLinks.length; i++) {
                if (sortedLinks[i].position && sortedLinks[i].position! > keywordStart) {
                    sortedLinks[i].position! += offset;
                }
            }
        }
    }

    return { newContent, linksInserted };
}

/**
 * Auto-interlink an article
 */
export async function autoInterlinkArticle(
    articleId: string,
    options?: {
        maxLinks?: number;
        minRelevance?: number;
        dryRun?: boolean; // If true, don't update the article
    }
): Promise<InterlinkingResult> {
    const supabase = await createClient();
    const dryRun = options?.dryRun || false;

    try {
        // Get article content
        const { data: article, error: fetchError } = await supabase
            .from('articles')
            .select('id, title, content, body_html, body_markdown, category, tags, primary_keyword, secondary_keywords')
            .eq('id', articleId)
            .single();

        if (fetchError || !article) {
            throw new Error('Article not found');
        }

        // Use HTML content if available, otherwise markdown
        const content = article.body_html || article.body_markdown || article.content || '';

        // Find related articles
        const relatedArticles = await findRelatedArticles(articleId, {
            maxResults: 20,
            minRelevance: options?.minRelevance || 0.3,
            category: article.category,
            tags: article.tags || [],
            keywords: [
                article.primary_keyword,
                ...(article.secondary_keywords || [])
            ].filter(Boolean) as string[]
        });

        if (relatedArticles.length === 0) {
            logger.info('No related articles found for interlinking', { articleId });
            return {
                linksAdded: 0,
                linksUpdated: 0,
                linksRemoved: 0,
                relatedArticles: [],
                suggestions: []
            };
        }

        // Find link opportunities
        const opportunities = await findLinkOpportunities(
            articleId,
            content,
            relatedArticles.map(r => ({
                id: r.id,
                slug: r.slug,
                title: r.title,
                category: r.category,
                keywords: [r.title] // Use title as keyword
            }))
        );

        // Limit opportunities
        const maxLinks = options?.maxLinks || 5;
        const selectedOpportunities = opportunities.slice(0, maxLinks);

        // Generate suggestions
        const suggestions: InternalLink[] = selectedOpportunities.map(opp => ({
            text: opp.text,
            url: opp.url,
            articleId: opp.articleId,
            context: opp.context
        }));

        if (dryRun) {
            return {
                linksAdded: selectedOpportunities.length,
                linksUpdated: 0,
                linksRemoved: 0,
                relatedArticles: relatedArticles.map(r => r.id),
                suggestions
            };
        }

        // Insert links into content
        const { newContent, linksInserted } = insertLinksIntoContent(
            content,
            selectedOpportunities,
            {
                maxLinksPerArticle: 3,
                minDistanceBetweenLinks: 200
            }
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
            throw updateError;
        }

        logger.info('Article auto-interlinked successfully', {
            articleId,
            linksInserted,
            relatedArticles: relatedArticles.length
        });

        return {
            linksAdded: linksInserted,
            linksUpdated: 0,
            linksRemoved: 0,
            relatedArticles: relatedArticles.map(r => r.id),
            suggestions
        };
    } catch (error) {
        logger.error('Error auto-interlinking article', error as Error, { articleId });
        throw error;
    }
}

/**
 * Batch interlink multiple articles
 */
export async function batchInterlinkArticles(
    articleIds: string[],
    options?: {
        maxLinks?: number;
        minRelevance?: number;
    }
): Promise<{
    totalProcessed: number;
    totalLinksAdded: number;
    errors: Array<{ articleId: string; error: string }>;
}> {
    const results = {
        totalProcessed: 0,
        totalLinksAdded: 0,
        errors: [] as Array<{ articleId: string; error: string }>
    };

    for (const articleId of articleIds) {
        try {
            const result = await autoInterlinkArticle(articleId, options);
            results.totalProcessed++;
            results.totalLinksAdded += result.linksAdded;
        } catch (error) {
            results.errors.push({
                articleId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    return results;
}
