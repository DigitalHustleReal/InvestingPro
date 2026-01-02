/**
 * 🔍 PLAGIARISM & UNIQUENESS CHECKER
 * 
 * Detects duplicate content and plagiarism:
 * - Internal duplicate detection (vs our own articles)
 * - Text similarity scoring
 * - Unique content percentage
 * - Common phrase detection
 * 
 * Future: Can integrate with Copyscape API for web-wide checking
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '../logger';

export interface PlagiarismResult {
    isUnique: boolean;
    uniquenessScore: number;    // 0-100%
    similarityScore: number;     // 0-100%
    duplicateContent: DuplicateMatch[];
    commonPhrases: CommonPhrase[];
    canPublish: boolean;
    recommendation: string;
}

export interface DuplicateMatch {
    articleId: string;
    articleTitle: string;
    similarity: number;
    matchedText: string;
}

export interface CommonPhrase {
    phrase: string;
    count: number;
    isGeneric: boolean;
}

// Get Supabase client (lazy)
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
    if (!supabaseClient) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('Supabase credentials not found');
        }
        supabaseClient = createClient(url, key);
    }
    return supabaseClient;
}

/**
 * Check content for plagiarism and uniqueness
 */
export async function checkPlagiarism(
    content: string,
    title: string,
    excludeArticleId?: string
): Promise<PlagiarismResult> {
    const duplicateContent: DuplicateMatch[] = [];
    const commonPhrases: CommonPhrase[] = [];

    try {
        // 1. Check against existing articles in database
        const supabase = getSupabaseClient();
        
        const { data: existingArticles, error } = await supabase
            .from('articles')
            .select('id, title, content, body_markdown')
            .neq('id', excludeArticleId || '')
            .limit(100); // Check against recent 100 articles

        if (error) {
            logger.error('Failed to fetch articles for plagiarism check', error);
        }

        if (existingArticles && existingArticles.length > 0) {
            // Check similarity with each article
            for (const article of existingArticles as any[]) {
                const articleContent = article.body_markdown || article.content || '';
                if (!articleContent) continue;

                const similarity = calculateTextSimilarity(content, articleContent);
                
                if (similarity > 15) { // >15% similarity is concerning
                    // Find the most similar section
                    const matchedText = findMostSimilarSection(content, articleContent);
                    
                    duplicateContent.push({
                        articleId: article.id,
                        articleTitle: article.title,
                        similarity,
                        matchedText
                    });
                }
            }
        }

    } catch (error) {
        logger.error('Plagiarism check failed', error as Error);
    }

    // 2. Detect common/generic phrases
    commonPhrases.push(...detectCommonPhrases(content));

    // 3. Calculate uniqueness score
    let uniquenessScore = 100;
    
    // Reduce score based on duplicates
    duplicateContent.forEach(dup => {
        uniquenessScore -= (dup.similarity * 0.5); // Each % similarity reduces score
    });
    
    // Reduce score for too many generic phrases
    const genericPhraseCount = commonPhrases.filter(p => p.isGeneric).length;
    if (genericPhraseCount > 10) {
        uniquenessScore -= (genericPhraseCount - 10) * 2;
    }

    uniquenessScore = Math.max(0, Math.min(100, uniquenessScore));

    // 4. Calculate similarity score (inverse of uniqueness)
    const similarityScore = 100 - uniquenessScore;

    // 5. Determine if can publish
    const isUnique = uniquenessScore >= 85; // At least 85% unique
    const canPublish = isUnique && duplicateContent.filter(d => d.similarity > 30).length === 0;

    // 6. Generate recommendation
    let recommendation = '';
    if (canPublish) {
        recommendation = '✅ Content is unique enough for publishing.';
    } else if (uniquenessScore < 85) {
        recommendation = `⚠️ Content uniqueness is ${uniquenessScore.toFixed(0)}%. Add more original content. Target: 85%+`;
    } else if (duplicateContent.some(d => d.similarity > 30)) {
        const highDup = duplicateContent.find(d => d.similarity > 30);
        recommendation = `❌ High similarity (${highDup?.similarity.toFixed(0)}%) with "${highDup?.articleTitle}". Rewrite duplicate sections.`;
    }

    return {
        isUnique,
        uniquenessScore,
        similarityScore,
        duplicateContent: duplicateContent.sort((a, b) => b.similarity - a.similarity),
        commonPhrases,
        canPublish,
        recommendation
    };
}

/**
 * Calculate text similarity using Jaccard similarity
 */
function calculateTextSimilarity(text1: string, text2: string): number {
    // Normalize texts
    const normalize = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3); // Ignore short words
    };

    const words1 = new Set(normalize(text1));
    const words2 = new Set(normalize(text2));

    if (words1.size === 0 || words2.size === 0) return 0;

    // Jaccard similarity
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return (intersection.size / union.size) * 100;
}

/**
 * Find the most similar section between two texts
 */
function findMostSimilarSection(text1: string, text2: string): string {
    const sentences1 = text1.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const sentences2 = text2.split(/[.!?]+/).filter(s => s.trim().length > 20);

    let maxSimilarity = 0;
    let mostSimilarSentence = '';

    sentences1.forEach(s1 => {
        sentences2.forEach(s2 => {
            const similarity = calculateTextSimilarity(s1, s2);
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                mostSimilarSentence = s1.trim().substring(0, 100) + '...';
            }
        });
    });

    return mostSimilarSentence || 'Multiple sections';
}

/**
 * Detect common/generic phrases
 */
function detectCommonPhrases(content: string): CommonPhrase[] {
    const genericPhrases = [
        { phrase: 'in conclusion', isGeneric: true },
        { phrase: 'to summarize', isGeneric: true },
        { phrase: 'in summary', isGeneric: true },
        { phrase: 'it is important to note', isGeneric: true },
        { phrase: 'it should be noted', isGeneric: true },
        { phrase: 'as mentioned earlier', isGeneric: true },
        { phrase: 'in other words', isGeneric: true },
        { phrase: 'for example', isGeneric: false },
        { phrase: 'such as', isGeneric: false },
        { phrase: 'according to', isGeneric: false }
    ];

    const found: CommonPhrase[] = [];
    const lowerContent = content.toLowerCase();

    genericPhrases.forEach(({ phrase, isGeneric }) => {
        const regex = new RegExp(phrase, 'gi');
        const matches = lowerContent.match(regex);
        if (matches && matches.length > 0) {
            found.push({
                phrase,
                count: matches.length,
                isGeneric
            });
        }
    });

    return found.filter(p => p.count > 0);
}

/**
 * Generate plagiarism report
 */
export function generatePlagiarismReport(result: PlagiarismResult): string {
    let report = '';
    
    report += `\n🔍 PLAGIARISM & UNIQUENESS REPORT\n`;
    report += `${'='.repeat(60)}\n\n`;
    
    report += `Uniqueness Score: ${result.uniquenessScore.toFixed(0)}%\n`;
    report += `Similarity Score: ${result.similarityScore.toFixed(0)}%\n`;
    report += `Status: ${result.isUnique ? '✅ UNIQUE' : '⚠️ NEEDS IMPROVEMENT'}\n`;
    report += `Can Publish: ${result.canPublish ? '✅ YES' : '❌ NO'}\n\n`;
    
    report += `${result.recommendation}\n`;
    
    if (result.duplicateContent.length > 0) {
        report += `\n⚠️  Duplicate Content Found (${result.duplicateContent.length} matches):\n`;
        result.duplicateContent.slice(0, 5).forEach((dup, i) => {
            report += `  ${i + 1}. "${dup.articleTitle}" (${dup.similarity.toFixed(0)}% similar)\n`;
            report += `     Match: "${dup.matchedText}"\n`;
        });
    } else {
        report += `\n✅ No duplicate content detected in database.\n`;
    }
    
    if (result.commonPhrases.length > 0) {
        const genericCount = result.commonPhrases.filter(p => p.isGeneric).length;
        if (genericCount > 5) {
            report += `\n⚠️  Common Generic Phrases (${genericCount}):\n`;
            result.commonPhrases
                .filter(p => p.isGeneric)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .forEach(p => {
                    report += `  - "${p.phrase}" (used ${p.count} ${p.count === 1 ? 'time' : 'times'})\n`;
                });
        }
    }
    
    report += `\n${'='.repeat(60)}\n`;
    
    return report;
}

/**
 * Quick uniqueness check (simplified)
 */
export function quickUniquenessCheck(content: string): number {
    // Simple uniqueness heuristic based on vocabulary diversity
    const words = content.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words.filter(w => w.length > 3));
    
    const vocabularyRichness = (uniqueWords.size / words.length) * 100;
    
    // Adjust for generic phrases
    const genericCount = detectCommonPhrases(content).filter(p => p.isGeneric).length;
    const genericPenalty = Math.min(15, genericCount * 1.5);
    
    return Math.max(0, Math.min(100, vocabularyRichness * 1.5 - genericPenalty));
}
