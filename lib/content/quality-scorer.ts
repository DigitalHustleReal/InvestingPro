/**
 * Content Quality Scorer
 * Analyzes and scores article quality (0-100)
 */

export interface QualityScore {
    overall: number;           // 0-100
    depth: number;            // Content depth (0-100)
    structure: number;        // Heading hierarchy (0-100)
    completeness: number;     // All sections covered (0-100)
    readability: number;      // Flesch-Kincaid (0-100)
    seo: number;             // SEO optimization (0-100)
    details: {
        wordCount: number;
        headingCount: number;
        paragraphCount: number;
        listCount: number;
        tableCount: number;
        imageCount: number;
        keywordDensity: number;
        avgSentenceLength: number;
        avgParagraphLength: number;
    };
    issues: string[];
    suggestions: string[];
}

export interface ArticleContent {
    title: string;
    content: string;
    excerpt?: string;
    keywords?: string[];
    meta_title?: string;
    meta_description?: string;
    featured_image?: string;
}

/**
 * Score article quality
 */
export function scoreArticleQuality(article: ArticleContent): QualityScore {
    const details = analyzeContent(article.content);
    
    // Calculate individual scores
    const depth = scoreDepth(details);
    const structure = scoreStructure(details);
    const completeness = scoreCompleteness(article, details);
    const readability = scoreReadability(details);
    const seo = scoreSEO(article, details);
    
    // Calculate overall score (weighted average)
    const overall = Math.round(
        depth * 0.25 +
        structure * 0.20 +
        completeness * 0.20 +
        readability * 0.20 +
        seo * 0.15
    );
    
    // Generate issues and suggestions
    const { issues, suggestions } = generateFeedback(article, details, {
        depth, structure, completeness, readability, seo
    });
    
    return {
        overall,
        depth,
        structure,
        completeness,
        readability,
        seo,
        details,
        issues,
        suggestions
    };
}

/**
 * Analyze content metrics
 */
function analyzeContent(content: string) {
    const text = stripHTML(content);
    
    // Count elements
    const words = countWords(text);
    const sentences = countSentences(text);
    const paragraphs = content.split(/<\/p>/gi).length - 1;
    const headings = {
        h1: (content.match(/<h1/gi) || []).length,
        h2: (content.match(/<h2/gi) || []).length,
        h3: (content.match(/<h3/gi) || []).length,
        h4: (content.match(/<h4/gi) || []).length,
    };
    const lists = (content.match(/<ul|<ol/gi) || []).length;
    const tables = (content.match(/<table/gi) || []).length;
    const images = (content.match(/<img/gi) || []).length;
    
    return {
        wordCount: words,
        sentenceCount: sentences,
        paragraphCount: paragraphs,
        headingCount: headings.h2 + headings.h3 + headings.h4,
        h2Count: headings.h2,
        h3Count: headings.h3,
        listCount: lists,
        tableCount: tables,
        imageCount: images,
        avgSentenceLength: sentences > 0 ? words / sentences : 0,
        avgParagraphLength: paragraphs > 0 ? words / paragraphs : 0,
        keywordDensity: 0 // Will be calculated in scoreSEO
    };
}

/**
 * Score content depth (word count, detail level)
 */
function scoreDepth(details: ReturnType<typeof analyzeContent>): number {
    let score = 0;
    
    // Word count scoring
    if (details.wordCount >= 2000) score += 40;
    else if (details.wordCount >= 1500) score += 30;
    else if (details.wordCount >= 1000) score += 20;
    else if (details.wordCount >= 500) score += 10;
    
    // Lists and tables (show detail)
    if (details.listCount >= 3) score += 20;
    else if (details.listCount >= 2) score += 15;
    else if (details.listCount >= 1) score += 10;
    
    if (details.tableCount >= 2) score += 20;
    else if (details.tableCount >= 1) score += 15;
    
    // Paragraph depth
    if (details.paragraphCount >= 15) score += 20;
    else if (details.paragraphCount >= 10) score += 15;
    else if (details.paragraphCount >= 5) score += 10;
    
    return Math.min(100, score);
}

/**
 * Score content structure (headings, organization)
 */
function scoreStructure(details: ReturnType<typeof analyzeContent>): number {
    let score = 0;
    
    // H2 headings (main sections)
    if (details.h2Count >= 5) score += 40;
    else if (details.h2Count >= 4) score += 35;
    else if (details.h2Count >= 3) score += 25;
    else if (details.h2Count >= 2) score += 15;
    else score += 5;
    
    // H3 headings (subsections)
    if (details.h3Count >= 8) score += 30;
    else if (details.h3Count >= 5) score += 25;
    else if (details.h3Count >= 3) score += 15;
    else if (details.h3Count >= 1) score += 10;
    
    // Proper hierarchy
    if (details.h2Count > 0 && details.h3Count > 0) score += 15;
    
    // Lists for readability
    if (details.listCount >= 2) score += 15;
    else if (details.listCount >= 1) score += 10;
    
    return Math.min(100, score);
}

/**
 * Score completeness (all required elements present)
 */
function scoreCompleteness(article: ArticleContent, details: ReturnType<typeof analyzeContent>): number {
    let score = 0;
    
    // Required elements
    if (article.title && article.title.length >= 10) score += 15;
    if (article.excerpt && article.excerpt.length >= 50) score += 15;
    if (article.meta_title && article.meta_title.length >= 30) score += 15;
    if (article.meta_description && article.meta_description.length >= 100) score += 15;
    if (article.keywords && article.keywords.length >= 5) score += 10;
    if (article.featured_image) score += 10;
    
    // Content elements
    if (details.headingCount >= 5) score += 10;
    if (details.paragraphCount >= 10) score += 10;
    
    return Math.min(100, score);
}

/**
 * Score readability (Flesch-Kincaid)
 */
function scoreReadability(details: ReturnType<typeof analyzeContent>): number {
    const { avgSentenceLength, avgParagraphLength } = details;
    
    let score = 100;
    
    // Sentence length (target: 15-20 words)
    if (avgSentenceLength > 25) score -= 20;
    else if (avgSentenceLength > 20) score -= 10;
    else if (avgSentenceLength < 10) score -= 10;
    
    // Paragraph length (target: 50-150 words)
    if (avgParagraphLength > 200) score -= 20;
    else if (avgParagraphLength > 150) score -= 10;
    else if (avgParagraphLength < 30) score -= 10;
    
    return Math.max(0, score);
}

/**
 * Score SEO optimization
 */
function scoreSEO(article: ArticleContent, details: ReturnType<typeof analyzeContent>): number {
    let score = 0;
    
    // Title optimization
    if (article.title && article.title.length >= 30 && article.title.length <= 60) score += 20;
    else if (article.title && article.title.length >= 20) score += 10;
    
    // Meta description
    if (article.meta_description && article.meta_description.length >= 120 && article.meta_description.length <= 160) score += 20;
    else if (article.meta_description && article.meta_description.length >= 80) score += 10;
    
    // Keywords present
    if (article.keywords && article.keywords.length >= 8) score += 20;
    else if (article.keywords && article.keywords.length >= 5) score += 15;
    else if (article.keywords && article.keywords.length >= 3) score += 10;
    
    // Keyword in title
    if (article.keywords && article.keywords.length > 0) {
        const titleLower = article.title.toLowerCase();
        const keywordInTitle = article.keywords.some(k => titleLower.includes(k.toLowerCase()));
        if (keywordInTitle) score += 20;
    }
    
    // Content length for SEO
    if (details.wordCount >= 1500) score += 20;
    else if (details.wordCount >= 1000) score += 10;
    
    return Math.min(100, score);
}

/**
 * Generate feedback
 */
function generateFeedback(
    article: ArticleContent,
    details: ReturnType<typeof analyzeContent>,
    scores: { depth: number; structure: number; completeness: number; readability: number; seo: number }
) {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Depth issues
    if (details.wordCount < 1000) {
        issues.push('Content is too short (< 1000 words)');
        suggestions.push(`Add ${1000 - details.wordCount} more words for better depth`);
    }
    
    // Structure issues
    if (details.h2Count < 3) {
        issues.push('Not enough main sections (H2 headings)');
        suggestions.push('Add at least 3-5 H2 headings for better structure');
    }
    
    // Completeness issues
    if (!article.featured_image) {
        issues.push('Missing featured image');
        suggestions.push('Add a featured image for better engagement');
    }
    
    if (!article.excerpt || article.excerpt.length < 50) {
        issues.push('Excerpt is too short or missing');
        suggestions.push('Write a compelling 100-150 character excerpt');
    }
    
    // Readability issues
    if (details.avgSentenceLength > 25) {
        issues.push('Sentences are too long');
        suggestions.push('Break long sentences into shorter ones (aim for 15-20 words)');
    }
    
    // SEO issues
    if (!article.keywords || article.keywords.length < 5) {
        issues.push('Not enough keywords');
        suggestions.push('Add at least 5-8 relevant keywords');
    }
    
    return { issues, suggestions };
}

/**
 * Helper: Strip HTML tags
 */
function stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Helper: Count words
 */
function countWords(text: string): number {
    return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Helper: Count sentences
 */
function countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
}
