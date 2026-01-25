/**
 * Related Articles Service
 * 
 * Smart article recommendations based on:
 * - Same category
 * - Shared tags
 * - Similar content (keyword overlap)
 * - Same author
 * - Recency
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface RelatedArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category: string;
    tags?: string[];
    featured_image?: string;
    published_date?: string;
    read_time?: number;
    author_name?: string;
    relevanceScore: number;
    matchReason: string[];
}

export interface RelatedArticleOptions {
    limit?: number;
    excludeIds?: string[];
    prioritizeCategory?: boolean;
    prioritizeTags?: boolean;
    prioritizeRecency?: boolean;
    minRelevanceScore?: number;
}

/**
 * Get related articles for a given article
 */
export async function getRelatedArticles(
    articleId: string,
    options: RelatedArticleOptions = {}
): Promise<RelatedArticle[]> {
    const {
        limit = 5,
        excludeIds = [],
        prioritizeCategory = true,
        prioritizeTags = true,
        prioritizeRecency = true,
        minRelevanceScore = 0.2
    } = options;

    const supabase = createClient();

    // First, get the source article
    const { data: sourceArticle, error: sourceError } = await supabase
        .from('articles')
        .select('id, title, slug, category, tags, author_id, primary_keyword, secondary_keywords')
        .eq('id', articleId)
        .single();

    if (sourceError || !sourceArticle) {
        logger.error('Failed to fetch source article for related', sourceError);
        return [];
    }

    // Get all published articles (excluding source and any excluded)
    const allExcluded = [articleId, ...excludeIds];
    
    const { data: candidates, error: candidatesError } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, tags, featured_image, published_date, read_time, author_name, author_id, primary_keyword, secondary_keywords')
        .eq('status', 'published')
        .not('id', 'in', `(${allExcluded.map(id => `"${id}"`).join(',')})`)
        .order('published_date', { ascending: false })
        .limit(100); // Get a pool to score

    if (candidatesError || !candidates) {
        logger.error('Failed to fetch candidate articles', candidatesError);
        return [];
    }

    // Score each candidate
    const scoredArticles: RelatedArticle[] = candidates.map(candidate => {
        let score = 0;
        const matchReasons: string[] = [];

        // Category match (highest weight)
        if (prioritizeCategory && candidate.category === sourceArticle.category) {
            score += 0.4;
            matchReasons.push('Same category');
        }

        // Tag overlap
        if (prioritizeTags && sourceArticle.tags && candidate.tags) {
            const sourceTags = new Set(sourceArticle.tags.map((t: string) => t.toLowerCase()));
            const candidateTags = candidate.tags.map((t: string) => t.toLowerCase());
            const overlap = candidateTags.filter((t: string) => sourceTags.has(t));
            
            if (overlap.length > 0) {
                const tagScore = Math.min(0.3, overlap.length * 0.1);
                score += tagScore;
                matchReasons.push(`${overlap.length} shared tag${overlap.length > 1 ? 's' : ''}`);
            }
        }

        // Keyword overlap
        const sourceKeywords = new Set([
            sourceArticle.primary_keyword,
            ...(sourceArticle.secondary_keywords || [])
        ].filter(Boolean).map((k: string) => k.toLowerCase()));

        const candidateKeywords = [
            candidate.primary_keyword,
            ...(candidate.secondary_keywords || [])
        ].filter(Boolean).map((k: string) => k.toLowerCase());

        const keywordOverlap = candidateKeywords.filter((k: string) => sourceKeywords.has(k));
        if (keywordOverlap.length > 0) {
            score += Math.min(0.2, keywordOverlap.length * 0.1);
            matchReasons.push('Related keywords');
        }

        // Same author (slight bonus)
        if (candidate.author_id && candidate.author_id === sourceArticle.author_id) {
            score += 0.1;
            matchReasons.push('Same author');
        }

        // Recency bonus (articles from last 30 days)
        if (prioritizeRecency && candidate.published_date) {
            const publishDate = new Date(candidate.published_date);
            const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
            
            if (daysSincePublish <= 7) {
                score += 0.1;
                matchReasons.push('Recently published');
            } else if (daysSincePublish <= 30) {
                score += 0.05;
            }
        }

        return {
            id: candidate.id,
            title: candidate.title,
            slug: candidate.slug,
            excerpt: candidate.excerpt,
            category: candidate.category,
            tags: candidate.tags,
            featured_image: candidate.featured_image,
            published_date: candidate.published_date,
            read_time: candidate.read_time,
            author_name: candidate.author_name,
            relevanceScore: score,
            matchReason: matchReasons
        };
    });

    // Filter by minimum score and sort
    return scoredArticles
        .filter(a => a.relevanceScore >= minRelevanceScore)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
}

/**
 * Get related articles by category (simpler version)
 */
export async function getRelatedByCategory(
    category: string,
    excludeIds: string[] = [],
    limit: number = 5
): Promise<RelatedArticle[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, tags, featured_image, published_date, read_time, author_name')
        .eq('status', 'published')
        .eq('category', category)
        .not('id', 'in', `(${excludeIds.map(id => `"${id}"`).join(',') || '""'})`)
        .order('published_date', { ascending: false })
        .limit(limit);

    if (error) {
        logger.error('Failed to get related by category', error);
        return [];
    }

    return (data || []).map(article => ({
        ...article,
        relevanceScore: 1,
        matchReason: ['Same category']
    }));
}

/**
 * Get trending articles (most viewed in last 7 days)
 */
export async function getTrendingArticles(limit: number = 5): Promise<RelatedArticle[]> {
    const supabase = createClient();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, tags, featured_image, published_date, read_time, author_name, views')
        .eq('status', 'published')
        .gte('published_date', sevenDaysAgo.toISOString())
        .order('views', { ascending: false })
        .limit(limit);

    if (error) {
        logger.error('Failed to get trending articles', error);
        return [];
    }

    return (data || []).map(article => ({
        ...article,
        relevanceScore: 1,
        matchReason: ['Trending']
    }));
}

/**
 * Get articles by tag
 */
export async function getArticlesByTag(
    tag: string,
    excludeIds: string[] = [],
    limit: number = 10
): Promise<RelatedArticle[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, tags, featured_image, published_date, read_time, author_name')
        .eq('status', 'published')
        .contains('tags', [tag])
        .not('id', 'in', `(${excludeIds.map(id => `"${id}"`).join(',') || '""'})`)
        .order('published_date', { ascending: false })
        .limit(limit);

    if (error) {
        logger.error('Failed to get articles by tag', error);
        return [];
    }

    return (data || []).map(article => ({
        ...article,
        relevanceScore: 1,
        matchReason: [`Tagged: ${tag}`]
    }));
}

/**
 * Get next/previous articles in category (for navigation)
 */
export async function getAdjacentArticles(
    articleId: string,
    category: string,
    publishedDate: string
): Promise<{ prev: RelatedArticle | null; next: RelatedArticle | null }> {
    const supabase = createClient();

    // Get previous (older)
    const { data: prevData } = await supabase
        .from('articles')
        .select('id, title, slug, category, featured_image')
        .eq('status', 'published')
        .eq('category', category)
        .lt('published_date', publishedDate)
        .order('published_date', { ascending: false })
        .limit(1)
        .single();

    // Get next (newer)
    const { data: nextData } = await supabase
        .from('articles')
        .select('id, title, slug, category, featured_image')
        .eq('status', 'published')
        .eq('category', category)
        .gt('published_date', publishedDate)
        .order('published_date', { ascending: true })
        .limit(1)
        .single();

    return {
        prev: prevData ? { ...prevData, relevanceScore: 1, matchReason: ['Previous in category'] } : null,
        next: nextData ? { ...nextData, relevanceScore: 1, matchReason: ['Next in category'] } : null
    };
}
