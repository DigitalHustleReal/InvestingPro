import { logger } from '@/lib/logger';
/**
 * 🔍 PLAGIARISM CHECKER
 * 
 * Detects duplicate or highly similar content
 * Prevents publishing plagiarized or duplicated articles
 * 
 * Components:
 * - Similarity detection algorithm (cosine similarity)
 * - Check against own articles database
 * - Reject threshold: >15% similarity
 */

export interface PlagiarismResult {
  isPlagiarized: boolean;
  similarityScore: number;      // 0-100%
  matches: SimilarityMatch[];
  canPublish: boolean;           // true if similarity <= 15%
  warnings: string[];
}

export interface SimilarityMatch {
  articleId: string;
  articleTitle: string;
  similarity: number;            // 0-100%
  matchedSentences: string[];
}

/**
 * Calculate cosine similarity between two texts
 * Returns a value between 0 (completely different) and 1 (identical)
 */
function cosineSimilarity(text1: string, text2: string): number {
  // Tokenize and create word frequency vectors
  const words1 = tokenize(text1);
  const words2 = tokenize(text2);
  
  // Create vocabulary (all unique words)
  const vocabulary = new Set([...words1, ...words2]);
  
  // Create frequency vectors
  const vector1 = createVector(words1, vocabulary);
  const vector2 = createVector(words2, vocabulary);
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (const word of vocabulary) {
    const freq1 = vector1.get(word) || 0;
    const freq2 = vector2.get(word) || 0;
    
    dotProduct += freq1 * freq2;
    magnitude1 += freq1 * freq1;
    magnitude2 += freq2 * freq2;
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Tokenize text into words (lowercase, remove special chars)
 */
function tokenize(text: string): string[] {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  
  // Convert to lowercase and split into words
  const words = cleanText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2); // Ignore very short words
  
  return words;
}

/**
 * Create word frequency vector
 */
function createVector(words: string[], vocabulary: Set<string>): Map<string, number> {
  const vector = new Map<string, number>();
  
  for (const word of words) {
    if (vocabulary.has(word)) {
      vector.set(word, (vector.get(word) || 0) + 1);
    }
  }
  
  return vector;
}

/**
 * Calculate Jaccard similarity for sentence-level matching
 * Used to find specific matching sentences
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Find matching sentences between two texts
 */
function findMatchingSentences(text1: string, text2: string, threshold: number = 0.6): string[] {
  const sentences1 = text1.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const sentences2 = text2.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  const matches: string[] = [];
  
  for (const sent1 of sentences1) {
    const words1 = new Set(tokenize(sent1));
    
    for (const sent2 of sentences2) {
      const words2 = new Set(tokenize(sent2));
      const similarity = jaccardSimilarity(words1, words2);
      
      if (similarity >= threshold) {
        matches.push(sent1.trim());
        break; // Found a match for this sentence
      }
    }
  }
  
  return matches;
}

/**
 * Check content against database articles
 */
export async function checkPlagiarism(
  content: string,
  title: string,
  excludeArticleId?: string,
  supabaseClient?: any
): Promise<PlagiarismResult> {
  const warnings: string[] = [];
  const matches: SimilarityMatch[] = [];
  
  if (!supabaseClient) {
    warnings.push('Database client not provided. Only basic checks performed.');
    return {
      isPlagiarized: false,
      similarityScore: 0,
      matches: [],
      canPublish: true,
      warnings
    };
  }
  
  try {
    // Fetch all published articles from database (excluding current article if editing)
    const query = supabaseClient
      .from('articles')
      .select('id, title, content')
      .eq('status', 'published');
    
    if (excludeArticleId) {
      query.neq('id', excludeArticleId);
    }
    
    const { data: articles, error } = await query;
    
    if (error) {
      warnings.push(`Database error: ${error.message}`);
      return {
        isPlagiarized: false,
        similarityScore: 0,
        matches: [],
        canPublish: true,
        warnings
      };
    }
    
    if (!articles || articles.length === 0) {
      return {
        isPlagiarized: false,
        similarityScore: 0,
        matches: [],
        canPublish: true,
        warnings: ['No published articles to compare against.']
      };
    }
    
    // Check similarity against each existing article
    let maxSimilarity = 0;
    
    for (const article of articles) {
      const similarity = cosineSimilarity(content, article.content || '');
      const similarityPercent = Math.round(similarity * 100);
      
      if (similarityPercent > 10) { // Only track significant similarities
        const matchedSentences = findMatchingSentences(content, article.content || '', 0.7);
        
        matches.push({
          articleId: article.id,
          articleTitle: article.title,
          similarity: similarityPercent,
          matchedSentences: matchedSentences.slice(0, 3) // Top 3 matched sentences
        });
        
        maxSimilarity = Math.max(maxSimilarity, similarityPercent);
      }
    }
    
    // Sort matches by similarity (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);
    
    // Determine if plagiarized (>15% threshold)
    const isPlagiarized = maxSimilarity > 15;
    const canPublish = !isPlagiarized;
    
    if (isPlagiarized) {
      warnings.push(`Content is ${maxSimilarity}% similar to existing article: "${matches[0].articleTitle}"`);
      warnings.push('Similarity threshold exceeded (>15%). Content rejected.');
    } else if (maxSimilarity > 10) {
      warnings.push(`Minor similarity detected (${maxSimilarity}%). Consider reviewing for uniqueness.`);
    }
    
    return {
      isPlagiarized,
      similarityScore: maxSimilarity,
      matches: matches.slice(0, 5), // Top 5 matches
      canPublish,
      warnings
    };
    
  } catch (error: any) {
    warnings.push(`Error checking plagiarism: ${error.message}`);
    return {
      isPlagiarized: false,
      similarityScore: 0,
      matches: [],
      canPublish: true,
      warnings
    };
  }
}

/**
 * Quick similarity check between two texts (no database)
 */
export function checkSimilarity(text1: string, text2: string): {
  similarity: number;
  isPlagiarized: boolean;
  matchedSentences: string[];
} {
  const similarity = cosineSimilarity(text1, text2);
  const similarityPercent = Math.round(similarity * 100);
  const matchedSentences = findMatchingSentences(text1, text2, 0.7);
  
  return {
    similarity: similarityPercent,
    isPlagiarized: similarityPercent > 15,
    matchedSentences: matchedSentences.slice(0, 5)
  };
}

/**
 * Test the plagiarism checker
 */
export function testPlagiarismChecker() {
  logger.info('\n🔍 PLAGIARISM CHECKER TEST\n');
  logger.info('='.repeat(60));
  
  // Test 1: Identical content
  const text1 = "This is a test article about credit cards. Credit cards are very useful for managing finances.";
  const text2 = "This is a test article about credit cards. Credit cards are very useful for managing finances.";
  
  const result1 = checkSimilarity(text1, text2);
  logger.info('\n📝 Test 1: Identical Content');
  logger.info(`   Similarity: ${result1.similarity}%`);
  logger.info(`   Plagiarized: ${result1.isPlagiarized ? '❌ YES' : '✅ NO'}`);
  
  // Test 2: Different content
  const text3 = "Mutual funds are investment vehicles that pool money from multiple investors.";
  const text4 = "Pizza is a popular Italian dish made with dough, tomatoes, and cheese.";
  
  const result2 = checkSimilarity(text3, text4);
  logger.info('\n📝 Test 2: Different Content');
  logger.info(`   Similarity: ${result2.similarity}%`);
  logger.info(`   Plagiarized: ${result2.isPlagiarized ? '❌ YES' : '✅ NO'}`);
  
  // Test 3: Similar but different
  const text5 = "The best credit card for you depends on your spending habits and financial goals.";
  const text6 = "Choosing the right credit card requires understanding your spending patterns and objectives.";
  
  const result3 = checkSimilarity(text5, text6);
  logger.info('\n📝 Test 3: Similar but Different');
  logger.info(`   Similarity: ${result3.similarity}%`);
  logger.info(`   Plagiarized: ${result3.isPlagiarized ? '❌ YES' : '✅ NO'}`);
  
  logger.info('\n' + '='.repeat(60) + '\n');
  logger.info('✅ Plagiarism Checker Test Complete!\n');
}
