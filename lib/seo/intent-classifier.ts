/**
 * Intent Classification System
 * 
 * Classifies articles by user search intent:
 * - Informational: "What is...", "How to..."
 * - Navigational: "Best...", "Top..."
 * - Transactional: "Buy...", "Apply..."
 * - Commercial: "Review...", "vs", "Compare..."
 */

export type UserIntent = 
  | 'informational'  // Learning, understanding
  | 'navigational'   // Finding specific content
  | 'transactional'  // Ready to take action
  | 'commercial';    // Researching before purchase

export interface IntentClassification {
  intent: UserIntent;
  confidence: number; // 0-100
  keywords: string[];
}

/**
 * Classify user intent based on title and content
 */
export function classifyIntent(title: string, content: string = ''): IntentClassification {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  const combined = `${titleLower} ${contentLower}`;
  
  // Transactional patterns (highest priority)
  const transactionalPatterns = [
    /\b(buy|purchase|order|apply|get|download|signup|register|subscribe)\b/,
    /\b(apply for|sign up|get started)\b/,
  ];
  
  for (const pattern of transactionalPatterns) {
    if (titleLower.match(pattern)) {
      return {
        intent: 'transactional',
        confidence: 90,
        keywords: extractKeywords(title, pattern),
      };
    }
  }
  
  // Commercial patterns
  const commercialPatterns = [
    /\b(review|reviews|vs|versus|compare|comparison|best|top|alternatives)\b/,
    /\b(pros and cons|advantages|disadvantages)\b/,
    /\b(\d+\s+best|top\s+\d+)\b/,
  ];
  
  for (const pattern of commercialPatterns) {
    if (titleLower.match(pattern)) {
      return {
        intent: 'commercial',
        confidence: 85,
        keywords: extractKeywords(title, pattern),
      };
    }
  }
  
  // Navigational patterns
  const navigationalPatterns = [
    /\b(best|top|list|guide|ultimate|complete)\b/,
    /\b(how to choose|how to find|how to select)\b/,
  ];
  
  for (const pattern of navigationalPatterns) {
    if (titleLower.match(pattern)) {
      return {
        intent: 'navigational',
        confidence: 80,
        keywords: extractKeywords(title, pattern),
      };
    }
  }
  
  // Informational patterns (default)
  const informationalPatterns = [
    /\b(what is|what are|how to|how does|why|when|where)\b/,
    /\b(guide|tutorial|learn|understand|explained)\b/,
    /\b(definition|meaning|introduction)\b/,
  ];
  
  for (const pattern of informationalPatterns) {
    if (titleLower.match(pattern)) {
      return {
        intent: 'informational',
        confidence: 75,
        keywords: extractKeywords(title, pattern),
      };
    }
  }
  
  // Default to informational with low confidence
  return {
    intent: 'informational',
    confidence: 50,
    keywords: [],
  };
}

/**
 * Extract target keywords from title
 */
export function extractTargetKeywords(title: string, content: string = ''): string[] {
  const keywords: string[] = [];
  
  // Extract from title
  const titleWords = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Common stop words to exclude
  const stopWords = new Set([
    'what', 'how', 'when', 'where', 'why', 'which', 'who',
    'best', 'top', 'guide', 'review', 'this', 'that', 'these', 'those',
    'with', 'from', 'into', 'about', 'after', 'before',
  ]);
  
  // Filter out stop words
  const filtered = titleWords.filter(word => !stopWords.has(word));
  
  // Add 2-3 word phrases
  for (let i = 0; i < filtered.length - 1; i++) {
    keywords.push(`${filtered[i]} ${filtered[i + 1]}`);
  }
  
  // Add individual keywords
  keywords.push(...filtered.slice(0, 5));
  
  return [...new Set(keywords)].slice(0, 10); // Unique, max 10
}

/**
 * Calculate keyword density
 */
export function calculateKeywordDensity(content: string, keywords: string[]): Record<string, number> {
  const contentLower = content.toLowerCase();
  const wordCount = content.split(/\s+/).length;
  
  const density: Record<string, number> = {};
  
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = contentLower.match(regex);
    const count = matches ? matches.length : 0;
    density[keyword] = wordCount > 0 ? (count / wordCount) * 100 : 0;
  }
  
  return density;
}

/**
 * Helper: Extract keywords matching a pattern
 */
function extractKeywords(text: string, pattern: RegExp): string[] {
  const matches = text.match(pattern);
  return matches ? matches.slice(0, 3) : [];
}

/**
 * Get intent-specific optimization suggestions
 */
export function getIntentOptimizationSuggestions(intent: UserIntent): string[] {
  switch (intent) {
    case 'informational':
      return [
        'Add clear definitions and explanations',
        'Include step-by-step guides',
        'Use FAQ sections',
        'Add visual aids (diagrams, infographics)',
      ];
    
    case 'navigational':
      return [
        'Create comparison tables',
        'Add "Best for" categories',
        'Include quick navigation links',
        'Use clear headings and sections',
      ];
    
    case 'transactional':
      return [
        'Add clear CTAs (Apply Now, Get Started)',
        'Include pricing information',
        'Add trust signals (reviews, ratings)',
        'Simplify the conversion path',
      ];
    
    case 'commercial':
      return [
        'Add detailed product comparisons',
        'Include pros and cons',
        'Add affiliate links strategically',
        'Include expert recommendations',
      ];
  }
}
