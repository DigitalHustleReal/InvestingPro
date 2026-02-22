/**
 * SEO Optimization Automation
 * Automatically optimizes content for SEO based on keyword research and rankings
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { trackKeywordRanking, getRankingHistory } from '@/lib/seo/serp-tracker';
import { getKeywordsForContentGeneration } from '@/lib/seo/keyword-research';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface SEOOptimizationResult {
    articleId: string;
    optimizations: Array<{
        type: 'meta' | 'content' | 'internal_links' | 'headings' | 'keyword_density';
        recommendation: string;
        priority: 'high' | 'medium' | 'low';
        impact?: string;
    }>;
    scoreBefore: number;
    scoreAfter: number;
    applied: boolean;
}

/**
 * Analyze article for SEO improvements
 */
export async function analyzeArticleSEO(articleId: string): Promise<SEOOptimizationResult> {
    try {
        // Get article
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .single();

        if (error || !article) {
            throw new Error(`Article not found: ${articleId}`);
        }

        const optimizations: SEOOptimizationResult['optimizations'] = [];

        // 1. Check meta tags
        if (!article.seo_title || article.seo_title.length < 30 || article.seo_title.length > 60) {
            optimizations.push({
                type: 'meta',
                recommendation: `SEO title should be 30-60 characters. Current: ${article.seo_title?.length || 0} chars.`,
                priority: 'high',
                impact: 'Improves click-through rate from search results'
            });
        }

        if (!article.seo_description || article.seo_description.length < 120 || article.seo_description.length > 160) {
            optimizations.push({
                type: 'meta',
                recommendation: `SEO description should be 120-160 characters. Current: ${article.seo_description?.length || 0} chars.`,
                priority: 'high',
                impact: 'Improves click-through rate from search results'
            });
        }

        // 2. Check keyword usage
        if (article.title) {
            const primaryKeywords = await extractPrimaryKeywords(article.title);
            const keywordUsage = analyzeKeywordDensity(article.content || '', primaryKeywords[0]);
            
            if (keywordUsage.density < 1) {
                optimizations.push({
                    type: 'keyword_density',
                    recommendation: `Primary keyword "${primaryKeywords[0]}" appears only ${keywordUsage.count} times. Aim for 1-2% density.`,
                    priority: 'medium',
                    impact: 'Improves relevance to search queries'
                });
            }
        }

        // 3. Check headings structure
        const headingStructure = analyzeHeadings(article.content || '');
        if (!headingStructure.hasH2 || headingStructure.h2Count < 3) {
            optimizations.push({
                type: 'headings',
                recommendation: 'Add more H2 headings to structure content. Aim for 4-6 H2 headings per article.',
                priority: 'medium',
                impact: 'Improves readability and SEO structure'
            });
        }

        // 4. Check internal links
        const internalLinks = extractInternalLinks(article.content || '');
        if (internalLinks.length < 3) {
            optimizations.push({
                type: 'internal_links',
                recommendation: `Add more internal links. Current: ${internalLinks.length}. Aim for 3-5 internal links.`,
                priority: 'low',
                impact: 'Improves site structure and crawlability'
            });
        }

        // 5. Check content length
        const wordCount = (article.content || '').split(/\s+/).length;
        if (wordCount < 1000) {
            optimizations.push({
                type: 'content',
                recommendation: `Content is ${wordCount} words. Aim for 1500+ words for better rankings.`,
                priority: 'medium',
                impact: 'Longer content typically ranks better'
            });
        }

        // Calculate SEO score
        const scoreBefore = calculateSEOScore(article);
        const scoreAfter = scoreBefore + (optimizations.length * 5); // Rough estimate

        return {
            articleId,
            optimizations,
            scoreBefore,
            scoreAfter,
            applied: false
        };

    } catch (error) {
        logger.error('Error analyzing article SEO', error, { articleId });
        throw error;
    }
}

/**
 * Extract primary keywords from title
 */
function extractPrimaryKeywords(title: string): string[] {
    // Simple extraction - remove common words
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are'];
    const words = title.toLowerCase().split(/\s+/).filter(w => !commonWords.includes(w));
    return words.slice(0, 3); // Top 3 keywords
}

/**
 * Analyze keyword density
 */
function analyzeKeywordDensity(content: string, keyword: string): {
    count: number;
    density: number;
} {
    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    const matches = lowerContent.match(new RegExp(lowerKeyword, 'g'));
    const count = matches ? matches.length : 0;
    
    const wordCount = content.split(/\s+/).length;
    const density = wordCount > 0 ? (count / wordCount) * 100 : 0;

    return { count, density: Number(density.toFixed(2)) };
}

/**
 * Analyze headings structure
 */
function analyzeHeadings(content: string): {
    hasH1: boolean;
    hasH2: boolean;
    h2Count: number;
    h3Count: number;
} {
    const h1Matches = content.match(/<h1[^>]*>.*?<\/h1>/gi);
    const h2Matches = content.match(/<h2[^>]*>.*?<\/h2>/gi);
    const h3Matches = content.match(/<h3[^>]*>.*?<\/h3>/gi);

    return {
        hasH1: (h1Matches?.length || 0) > 0,
        hasH2: (h2Matches?.length || 0) > 0,
        h2Count: h2Matches?.length || 0,
        h3Count: h3Matches?.length || 0
    };
}

/**
 * Extract internal links from content
 */
function extractInternalLinks(content: string): string[] {
    const linkRegex = /href=["']([^"']+)["']/gi;
    const matches = content.matchAll(linkRegex);
    const links: string[] = [];
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://investingpro.in';

    for (const match of matches) {
        const href = match[1];
        if (href.startsWith('/') || href.includes(domain)) {
            links.push(href);
        }
    }

    return links;
}

/**
 * Calculate SEO score (0-100)
 */
function calculateSEOScore(article: any): number {
    let score = 0;

    // Meta tags (30 points)
    if (article.seo_title && article.seo_title.length >= 30 && article.seo_title.length <= 60) {
        score += 15;
    }
    if (article.seo_description && article.seo_description.length >= 120 && article.seo_description.length <= 160) {
        score += 15;
    }

    // Content length (20 points)
    const wordCount = (article.content || '').split(/\s+/).length;
    if (wordCount >= 1500) score += 20;
    else if (wordCount >= 1000) score += 15;
    else if (wordCount >= 500) score += 10;

    // Headings (15 points)
    const headings = analyzeHeadings(article.content || '');
    if (headings.h2Count >= 4) score += 15;
    else if (headings.h2Count >= 2) score += 10;
    else if (headings.hasH2) score += 5;

    // Internal links (15 points)
    const links = extractInternalLinks(article.content || '');
    if (links.length >= 3) score += 15;
    else if (links.length >= 1) score += 10;

    // Keyword usage (20 points)
    if (article.title) {
        const keywords = extractPrimaryKeywords(article.title);
        if (keywords.length > 0) {
            const usage = analyzeKeywordDensity(article.content || '', keywords[0]);
            if (usage.density >= 1 && usage.density <= 2) score += 20;
            else if (usage.count >= 3) score += 10;
        }
    }

    return Math.min(100, score);
}

/**
 * AI-Powered SEO Metadata Generation
 * 
 * Uses GPT-4o to generate optimized titles, descriptions, and keywords.
 */
export async function generateAISEOMetadata(
    title: string,
    content: string
): Promise<{
    seo_title: string;
    meta_description: string;
    primary_keyword: string;
    secondary_keywords: string[];
    search_intent: string;
}> {
    try {
        const { api } = await import('@/lib/api');
        const { extractJSON } = await import('@/lib/utils/json');

        const prompt = `You are an SEO expert for InvestingPro, a premium financial education platform in India.
        Generate optimized SEO metadata for the following article.

        ARTICLE TITLE: ${title}
        
        ARTICLE CONTENT:
        """
        ${content.substring(0, 5000)}
        """

        TASK:
        1. Generate a compelling SEO Title (50-60 chars) including the primary keyword.
        2. Generate a Meta Description (150-160 chars) that encourages clicks.
        3. Identify the Single Primary Keyword.
        4. Identify 3-5 Secondary Keywords.
        5. Identify Search Intent (informational, commercial, or transactional).

        FORMAT YOUR RESPONSE AS JSON:
        {
          "seo_title": "string",
          "meta_description": "string",
          "primary_keyword": "string",
          "secondary_keywords": ["string", "string"],
          "search_intent": "informational" | "commercial" | "transactional"
        }`;

        const result = await api.integrations.Core.InvokeLLM({
            prompt,
            operation: 'generate_seo_metadata',
            persona: 'arjun' // Use Arjun for helpful, clicking-inducing tone
        });

        const parsed = extractJSON(result.content);

        if (!parsed) {
            throw new Error('Failed to parse AI SEO response');
        }

        return {
            seo_title: parsed.seo_title || title,
            meta_description: parsed.meta_description || '',
            primary_keyword: parsed.primary_keyword || '',
            secondary_keywords: parsed.secondary_keywords || [],
            search_intent: parsed.search_intent || 'informational'
        };

    } catch (error) {
        logger.error('Error generating AI SEO metadata', error as Error);
        // Fallback to basic extraction
        const primary = extractPrimaryKeywords(title)[0];
        return {
            seo_title: title,
            meta_description: content.substring(0, 155),
            primary_keyword: primary,
            secondary_keywords: [],
            search_intent: 'informational'
        };
    }
}

/**
 * Auto-optimize article based on SEO analysis
 */
export async function autoOptimizeArticle(title: string, content: string): Promise<any> {
    // This is the entry point for the editor tools
    const aiMetadata = await generateAISEOMetadata(title, content);
    
    // We can also run the analysis to compare
    // But for the tool, we return the optimized data
    return aiMetadata;
}
