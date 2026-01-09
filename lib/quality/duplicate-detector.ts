/**
 * 🚫 DUPLICATE ARTICLE DETECTOR
 * 
 * Prevents generating multiple articles on the same topic/keywords.
 * Uses intelligent matching: keyword overlap, semantic similarity, title matching.
 * 
 * Example:
 * - "What is SIP?" exists → Block "SIP Complete Guide" (too similar)
 * - "What is SIP?" exists → Allow "Best SIP Mutual Funds" (different angle)
 */

import { createClient } from '@/lib/supabase/client';
import { GOOGLE_DUPLICATE_STANDARDS } from './google-standards';

export interface DuplicateCheckResult {
    has_duplicate: boolean;
    similar_articles: SimilarArticle[];
    recommendation: 'BLOCK' | 'WARN' | 'PROCEED';
    reason: string;
    keyword_overlap: number;
    title_similarity: number;
}

interface SimilarArticle {
    id: string;
    title: string;
    slug: string;
    keywords: string[];
    category: string;
    overlap_percentage: number;
    similarity_score: number;
}

/**
 * Check for duplicate articles before generation
 */
export async function checkForDuplicates(
    title: string,
    keywords: string[],
    category: string
): Promise<DuplicateCheckResult> {
    const supabase = createClient();
    
    // Normalize keywords (lowercase, remove variations)
    const normalizedKeywords = normalizeKeywords(keywords);
    
    // Get all articles in same category
    const { data: existingArticles } = await supabase
        .from('articles')
        .select('id, title, slug, tags, category, seo_keywords')
        .eq('category', category)
        .neq('status', 'archived');
    
    if (!existingArticles || existingArticles.length === 0) {
        return {
            has_duplicate: false,
            similar_articles: [],
            recommendation: 'PROCEED',
            reason: 'No existing articles in this category',
            keyword_overlap: 0,
            title_similarity: 0
        };
    }
    
    const similarArticles: SimilarArticle[] = [];
    let maxKeywordOverlap = 0;
    let maxTitleSimilarity = 0;
    
    for (const article of existingArticles) {
        // Extract keywords from existing article
        const existingKeywords = extractKeywords(article);
        
        // Calculate keyword overlap
        const overlap = calculateKeywordOverlap(normalizedKeywords, existingKeywords);
        
        // Calculate title similarity
        const titleSim = calculateTitleSimilarity(title, article.title);
        
        // Track max values
        maxKeywordOverlap = Math.max(maxKeywordOverlap, overlap);
        maxTitleSimilarity = Math.max(maxTitleSimilarity, titleSim);
        
        // If significantly similar, add to list
        if (overlap > 40 || titleSim > 0.60) {
            similarArticles.push({
                id: article.id,
                title: article.title,
                slug: article.slug,
                keywords: existingKeywords,
                category: article.category,
                overlap_percentage: overlap,
                similarity_score: titleSim
            });
        }
    }
    
    // Sort by similarity (highest first)
    similarArticles.sort((a, b) => 
        (b.overlap_percentage + b.similarity_score * 100) - 
        (a.overlap_percentage + a.similarity_score * 100)
    );
    
    // Determine recommendation
    let recommendation: 'BLOCK' | 'WARN' | 'PROCEED';
    let reason: string;
    let has_duplicate = false;
    
    if (maxKeywordOverlap >= GOOGLE_DUPLICATE_STANDARDS.BLOCK_KEYWORD_OVERLAP) {
        recommendation = 'BLOCK';
        reason = `Article with ${maxKeywordOverlap.toFixed(0)}% keyword overlap already exists: "${similarArticles[0]?.title}"`;
        has_duplicate = true;
    } else if (maxTitleSimilarity >= GOOGLE_DUPLICATE_STANDARDS.BLOCK_TITLE_SIMILARITY) {
        recommendation = 'BLOCK';
        reason = `Very similar title already exists: "${similarArticles[0]?.title}"`;
        has_duplicate = true;
    } else if (maxKeywordOverlap >= GOOGLE_DUPLICATE_STANDARDS.WARN_KEYWORD_OVERLAP || 
               maxTitleSimilarity >= GOOGLE_DUPLICATE_STANDARDS.WARN_TITLE_SIMILARITY) {
        recommendation = 'WARN';
        reason = `Similar article exists but may offer different angle: "${similarArticles[0]?.title}"`;
        has_duplicate = false; // Allow but warn
    } else {
        recommendation = 'PROCEED';
        reason = 'Content sufficiently unique from existing articles';
        has_duplicate = false;
    }
    
    return {
        has_duplicate,
        similar_articles: similarArticles.slice(0, 5), // Top 5
        recommendation,
        reason,
        keyword_overlap: maxKeywordOverlap,
        title_similarity: maxTitleSimilarity
    };
}

/**
 * Normalize keywords for comparison
 */
function normalizeKeywords(keywords: string[]): string[] {
    return keywords.map(k => {
        let normalized = k.toLowerCase().trim();
        
        // Remove year variations
        normalized = normalized.replace(/202[0-9]/g, '');
        
        // Remove common words
        normalized = normalized.replace(/\b(guide|complete|ultimate|best|top|how to|what is|in india)\b/gi, '');
        
        // Remove extra spaces
        normalized = normalized.trim().replace(/\s+/g, ' ');
        
        return normalized;
    }).filter(k => k.length > 2); // Filter out very short keywords
}

/**
 * Extract keywords from existing article
 */
function extractKeywords(article: any): string[] {
    const keywords: string[] = [];
    
    // From tags
    if (article.tags &&Array.isArray(article.tags)) {
        keywords.push(...article.tags);
    }
    
    // From SEO keywords
    if (article.seo_keywords) {
        if (typeof article.seo_keywords === 'string') {
            keywords.push(...article.seo_keywords.split(',').map((k: string) => k.trim()));
        } else if (Array.isArray(article.seo_keywords)) {
            keywords.push(...article.seo_keywords);
        }
    }
    
    // From title (extract meaningful words)
    if (article.title) {
        const titleWords = article.title
            .toLowerCase()
           .split(/\W+/)
            .filter((w: string) => w.length > 3 && !['what', 'how', 'why', 'when', 'where', 'best', 'guide', 'ultimate', 'complete'].includes(w));
        keywords.push(...titleWords);
    }
    
    return normalizeKeywords(keywords);
}

/**
 * Calculate keyword overlap percentage
 */
function calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;
    
    const set1 = new Set(keywords1.map(k => k.toLowerCase()));
    const set2 = new Set(keywords2.map(k => k.toLowerCase()));
    
    // Count matches
    let matches = 0;
    for (const keyword of set1) {
        if (set2.has(keyword)) {
            matches++;
        }
    }
    
    // Calculate overlap as % of smaller set
    const minSize = Math.min(set1.size, set2.size);
    return (matches / minSize) * 100;
}

/**
 * Calculate title similarity (Jaccard + fuzzy matching)
 */
function calculateTitleSimilarity(title1: string, title2: string): number {
    // Normalize titles
    const norm1 = title1.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const norm2 = title2.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    // Split into words
    const words1 = norm1.split(/\s+/).filter(w => w.length > 2);
    const words2 = norm2.split(/\s+/).filter(w => w.length > 2);
    
    // Jaccard similarity
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const jaccard = intersection.size / union.size;
    
    // Check for exact substring matches
    const substringMatch = norm1.includes(norm2) || norm2.includes(norm1) ? 0.3 : 0;
    
    return Math.min(1, jaccard + substringMatch);
}

/**
 * Suggest differentiation strategies
 */
export function suggestDifferentiation(
    proposedTitle: string,
    similarArticle: SimilarArticle
): string[] {
    const suggestions: string[] = [];
    
    if (proposedTitle.toLowerCase().includes('guide') && similarArticle.title.toLowerCase().includes('guide')) {
        suggestions.push('Change angle: Use "Strategies" or "Tips" instead of "Guide"');
    }
    
    if (!proposedTitle.toLowerCase().includes('202')) {
        suggestions.push('Add year: "2026" or "2027" to differentiate');
    }
    
    if (!proposedTitle.toLowerCase().includes('beginner') && !proposedTitle.toLowerCase().includes('advanced')) {
        suggestions.push('Add skill level: "Beginners" or "Advanced"');
    }
    
    if (!proposedTitle.toLowerCase().includes('how') && !proposedTitle.toLowerCase().includes('what') && !proposedTitle.toLowerCase().includes('why')) {
        suggestions.push('Change type: "How to", "What is", or "Why" article');
    }
    
    suggestions.push('Consider covering a specific subset: e.g., "Small Cap SIPs" vs generic "SIPs"');
    suggestions.push('Target different audience: "For Students", "For Retirees", etc.');
    
    return suggestions;
}
