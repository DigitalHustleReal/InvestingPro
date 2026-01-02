/**
 * 📊 PRODUCTION CONTENT QUALITY SCORER
 * 
 * Analyzes content quality across multiple dimensions and provides
 * a comprehensive quality score with actionable recommendations.
 * 
 * SCORING DIMENSIONS:
 * 1. Readability (20%) - Flesch-Kincaid, sentence structure
 * 2. SEO Optimization (25%) - Keywords, meta, headings
 * 3. Content Depth (25%) - Word count, sections, examples
 * 4. Engagement (15%) - Questions, CTAs, formatting
 * 5. E-E-A-T (15%) - Expertise, Authority, Trustworthiness
 * 
 * TOTAL SCORE: 0-100 (weighted average)
 */

import * as cheerio from 'cheerio';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface QualityScore {
    total_score: number; // 0-100
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    
    // Dimension Scores
    readability_score: number;
    seo_score: number;
    depth_score: number;
    engagement_score: number;
    eeat_score: number;
    
    // Detailed Analysis
    readability: ReadabilityAnalysis;
    seo: SEOAnalysis;
    depth: DepthAnalysis;
    engagement: EngagementAnalysis;
    eeat: EEATAnalysis;
    
    // Recommendations
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    
    // Metadata
    analyzed_at: string;
}

interface ReadabilityAnalysis {
    flesch_kincaid_score: number;
    avg_sentence_length: number;
    avg_word_length: number;
    reading_level: string;
    passive_voice_percentage: number;
    score: number;
}

interface SEOAnalysis {
    keyword_density: number;
    has_h1: boolean;
    h2_count: number;
    h3_count: number;
    heading_keyword_usage: number;
    meta_title_length: number;
    meta_description_length: number;
    internal_links: number;
    external_links: number;
    image_count: number;
    image_alt_coverage: number;
    score: number;
}

interface DepthAnalysis {
    word_count: number;
    paragraph_count: number;
    list_count: number;
    table_count: number;
    blockquote_count: number;
    example_count: number; // estimated
    section_count: number;
    score: number;
}

interface EngagementAnalysis {
    question_count: number;
    cta_count: number;
    bullet_point_count: number;
    bold_count: number;
    italic_count: number;
    has_toc: boolean;
    has_faq: boolean;
    score: number;
}

interface EEATAnalysis {
    author_mentioned: boolean;
    credentials_shown: boolean;
    sources_cited: number;
    data_points: number;
    expert_quotes: number;
    publish_date_shown: boolean;
    last_updated_shown: boolean;
    score: number;
}

// ============================================================================
// READABILITY ANALYSIS
// ============================================================================

function analyzeReadability(text: string, html: string): ReadabilityAnalysis {
    // Remove HTML tags for pure text analysis
    const $ = cheerio.load(html);
    const plainText = $('body').text();
    
    // Split into sentences
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length || 1;
    
    // Split into words
    const words = plainText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length || 1;
    
    // Split into syllables (simplified)
    const syllables = words.reduce((count, word) => {
        return count + countSyllables(word);
    }, 0);
    
    // Flesch-Kincaid Reading Ease
    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllables / wordCount;
    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    
    // Average word length
    const totalChars = words.join('').length;
    const avgWordLength = totalChars / wordCount;
    
    // Passive voice detection (simplified)
    const passiveCount = (plainText.match(/\b(was|were|been|being|is|are)\s+\w+ed\b/gi) || []).length;
    const passivePercentage = (passiveCount / sentenceCount) * 100;
    
    // Reading level
    let readingLevel = 'Unknown';
    if (fleschScore >= 90) readingLevel = '5th Grade (Very Easy)';
    else if (fleschScore >= 80) readingLevel = '6th Grade (Easy)';
    else if (fleschScore >= 70) readingLevel = '7th Grade (Fairly Easy)';
    else if (fleschScore >= 60) readingLevel = '8-9th Grade (Standard)';
    else if (fleschScore >= 50) readingLevel = '10-12th Grade (Fairly Difficult)';
    else if (fleschScore >= 30) readingLevel = 'College (Difficult)';
    else readingLevel = 'College Graduate (Very Difficult)';
    
    // Score (out of 100)
    let score = 0;
    score += Math.min((fleschScore / 60) * 40, 40); // 40 points for readability 60+
    score += Math.min((1 - Math.abs(avgWordsPerSentence - 20) / 20) * 30, 30); // 30 points for ideal sentence length
    score += Math.min((100 - passivePercentage) / 100 * 30, 30); // 30 points for active voice
    
    return {
        flesch_kincaid_score: Math.round(fleschScore),
        avg_sentence_length: Math.round(avgWordsPerSentence * 10) / 10,
        avg_word_length: Math.round(avgWordLength * 10) / 10,
        reading_level: readingLevel,
        passive_voice_percentage: Math.round(passivePercentage),
        score: Math.min(Math.round(score), 100)
    };
}

function countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

// ============================================================================
// SEO ANALYSIS
// ============================================================================

function analyzeSEO(html: string, keyword?: string): SEOAnalysis {
    const $ = cheerio.load(html);
    
    // Keyword density (if keyword provided)
    let keywordDensity = 0;
    let headingKeywordUsage = 0;
    
    if (keyword) {
        const text = $('body').text().toLowerCase();
        const words = text.split(/\s+/).length;
        const keywordCount = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        keywordDensity = (keywordCount / words) * 100;
        
        // Check heading keyword usage
        const headings = $('h1, h2, h3').text().toLowerCase();
        headingKeywordUsage = (headings.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    }
    
    // Heading structure
    const hasH1 = $('h1').length > 0;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    
    // Meta tags
    const metaTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Links
    const internalLinks = $('a[href^="/"], a[href*="' + (process.env.NEXT_PUBLIC_SITE_URL || '') + '"]').length;
    const externalLinks = $('a[href^="http"]').not('[href*="' + (process.env.NEXT_PUBLIC_SITE_URL || '') + '"]').length;
    
    // Images
    const images = $('img');
    const imageCount = images.length;
    const imagesWithAlt = images.filter('[alt]').length;
    const imageAltCoverage = imageCount > 0 ? (imagesWithAlt / imageCount) * 100 : 0;
    
    // Score (out of 100)
    let score = 0;
    score += hasH1 ? 15 : 0;
    score += Math.min(h2Count / 5 * 15, 15); // Up to 5 H2s
    score += Math.min(h3Count / 8 * 10, 10); // Up to 8 H3s
    score += (metaTitle.length >= 50 && metaTitle.length <= 60) ? 15 : 5;
    score += (metaDescription.length >= 150 && metaDescription.length <= 160) ? 15 : 5;
    score += Math.min(internalLinks / 5 * 10, 10);
    score += Math.min(externalLinks / 3 * 10, 10);
    score += (imageAltCoverage >= 80) ? 10 : (imageAltCoverage / 80 * 10);
    
    if (keyword) {
        score += (keywordDensity >= 0.5 && keywordDensity <= 2.5) ? 10 : 0;
        score += Math.min(headingKeywordUsage / 3 * 10, 10);
    }
    
    return {
        keyword_density: Math.round(keywordDensity * 100) / 100,
        has_h1: hasH1,
        h2_count: h2Count,
        h3_count: h3Count,
        heading_keyword_usage: headingKeywordUsage,
        meta_title_length: metaTitle.length,
        meta_description_length: metaDescription.length,
        internal_links: internalLinks,
        external_links: externalLinks,
        image_count: imageCount,
        image_alt_coverage: Math.round(imageAltCoverage),
        score: Math.min(Math.round(score), 100)
    };
}

// ============================================================================
// DEPTH ANALYSIS
// ============================================================================

function analyzeDepth(html: string): DepthAnalysis {
    const $ = cheerio.load(html);
    
    const text = $('body').text();
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    const paragraphCount = $('p').length;
    const listCount = $('ul, ol').length;
    const tableCount = $('table').length;
    const blockquoteCount = $('blockquote').length;
    
    // Estimate examples (look for "example", "for instance", "such as")
    const examplePatterns = /(example|for instance|such as|for example|e\.g\.|consider)/gi;
    const exampleCount = (text.match(examplePatterns) || []).length;
    
    // Count sections (H2s as section markers)
    const sectionCount = $('h2').length;
    
    // Score (out of 100)
    let score = 0;
    score += Math.min(wordCount / 1500 * 30, 30); // 30 points for 1500+ words
    score += Math.min(paragraphCount / 15 * 15, 15); // 15 points for 15+ paragraphs
    score += Math.min(listCount / 3 * 10, 10); // 10 points for 3+ lists
    score += Math.min(tableCount / 2 * 10, 10); // 10 points for 2+ tables
    score += Math.min(exampleCount / 5 * 15, 15); // 15 points for 5+ examples
    score += Math.min(sectionCount / 6 * 20, 20); // 20 points for 6+ sections
    
    return {
        word_count: wordCount,
        paragraph_count: paragraphCount,
        list_count: listCount,
        table_count: tableCount,
        blockquote_count: blockquoteCount,
        example_count: exampleCount,
        section_count: sectionCount,
        score: Math.min(Math.round(score), 100)
    };
}

// ============================================================================
// ENGAGEMENT ANALYSIS
// ============================================================================

function analyzeEngagement(html: string): EngagementAnalysis {
    const $ = cheerio.load(html);
    const text = $('body').text();
    
    // Count questions
    const questionCount = (text.match(/\?/g) || []).length;
    
    // Count CTAs (common CTA phrases)
    const ctaPatterns = /(click here|learn more|get started|sign up|subscribe|download|try now|contact us|apply now)/gi;
    const ctaCount = (text.match(ctaPatterns) || []).length + $('button, .cta, .btn').length;
    
    // Formatting elements
    const bulletPointCount = $('li').length;
    const boldCount = $('strong, b').length;
    const italicCount = $('em, i').length;
    
    // Special sections
    const hasToc = $('[class*="toc"], [id*="toc"], .table-of-contents').length > 0;
    const hasFaq = $('[class*="faq"], [id*="faq"]').length > 0 || /frequently asked questions/i.test(text);
    
    // Score (out of 100)
    let score = 0;
    score += Math.min(questionCount / 5 * 20, 20); // 20 points for 5+ questions
    score += Math.min(ctaCount / 3 * 20, 20); // 20 points for 3+ CTAs
    score += Math.min(bulletPointCount / 10 * 20, 20); // 20 points for 10+ bullets
    score += Math.min((boldCount + italicCount) / 15 * 20, 20); // 20 points for formatting
    score += hasToc ? 10 : 0;
    score += hasFaq ? 10 : 0;
    
    return {
        question_count: questionCount,
        cta_count: ctaCount,
        bullet_point_count: bulletPointCount,
        bold_count: boldCount,
        italic_count: italicCount,
        has_toc: hasToc,
        has_faq: hasFaq,
        score: Math.min(Math.round(score), 100)
    };
}

// ============================================================================
// E-E-A-T ANALYSIS
// ============================================================================

function analyzeEEAT(html: string): EEATAnalysis {
    const $ = cheerio.load(html);
    const text = $('body').text().toLowerCase();
    
    // Author signals
    const authorMentioned = /author|written by|by\s+[A-Z]/i.test(html) || $('.author, .byline').length > 0;
    
    // Credentials
    const credentials = /(certified|sebi registered|chartered|mba|cfa|experience|expert|advisor)/gi;
    const credentialsShown = (text.match(credentials) || []).length > 0;
    
    // Sources cited
    const sourcePatterns = /(source:|according to|study by|research shows|data from)/gi;
    const sourcesCited = (text.match(sourcePatterns) || []).length + $('cite, .source').length;
    
    // Data points (numbers, percentages, statistics)
    const dataPoints = (text.match(/\d+(\.\d+)?[%₹]?/g) || []).length;
    
    // Expert quotes
    const quoteCount = $('blockquote').length;
    
    // Dates
    const publishDateShown = /published|updated|last modified/i.test(text) || $('[class*="date"], time').length > 0;
    const lastUpdatedShown = /updated|last modified/i.test(text);
    
    // Score (out of 100)
    let score = 0;
    score += authorMentioned ? 15 : 0;
    score += credentialsShown ? 20 : 0;
    score += Math.min(sourcesCited / 3 * 20, 20);
    score += Math.min(dataPoints / 10 * 20, 20);
    score += Math.min(quoteCount / 2 * 15, 15);
    score += publishDateShown ? 5 : 0;
    score += lastUpdatedShown ? 5 : 0;
    
    return {
        author_mentioned: authorMentioned,
        credentials_shown: credentialsShown,
        sources_cited: sourcesCited,
        data_points: dataPoints,
        expert_quotes: quoteCount,
        publish_date_shown: publishDateShown,
        last_updated_shown: lastUpdatedShown,
        score: Math.min(Math.round(score), 100)
    };
}

// ============================================================================
// MAIN EXPORT: QUALITY ANALYZER
// ============================================================================

export async function analyzeContentQuality(
    html: string,
    keyword?: string
): Promise<QualityScore> {
    const $ = cheerio.load(html);
    const text = $('body').text();
    
    // Perform all analyses
    const readability = analyzeReadability(text, html);
    const seo = analyzeSEO(html, keyword);
    const depth = analyzeDepth(html);
    const engagement = analyzeEngagement(html);
    const eeat = analyzeEEAT(html);
    
    // Calculate weighted total score
    const totalScore = Math.round(
        readability.score * 0.20 +
        seo.score * 0.25 +
        depth.score * 0.25 +
        engagement.score * 0.15 +
        eeat.score * 0.15
    );
    
    // Assign grade
    let grade: QualityScore['grade'];
    if (totalScore >= 97) grade = 'A+';
    else if (totalScore >= 93) grade = 'A';
    else if (totalScore >= 87) grade = 'B+';
    else if (totalScore >= 83) grade = 'B';
    else if (totalScore >= 77) grade = 'C+';
    else if (totalScore >= 70) grade = 'C';
    else if (totalScore >= 60) grade = 'D';
    else grade = 'F';
    
    // Generate recommendations
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];
    
    if (readability.score >= 80) strengths.push('Excellent readability');
    else if (readability.score < 60) {
        weaknesses.push('Poor readability');
        recommendations.push('Simplify sentence structure and use shorter words');
    }
    
    if (seo.score >= 80) strengths.push('Well-optimized for SEO');
    else if (seo.score < 60) {
        weaknesses.push('Needs SEO improvement');
        recommendations.push('Add more headings, improve meta tags, and optimize keyword usage');
    }
    
    if (depth.score >= 80) strengths.push('Comprehensive and in-depth');
    else if (depth.score < 60) {
        weaknesses.push('Lacks depth');
        recommendations.push('Add more examples, tables, and detailed sections');
    }
    
    if (engagement.score >= 80) strengths.push('Highly engaging');
    else if (engagement.score < 60) {
        weaknesses.push('Low engagement');
        recommendations.push('Add more questions, CTAs, and interactive elements');
    }
    
    if (eeat.score >= 80) strengths.push('Strong authority signals');
    else if (eeat.score < 60) {
        weaknesses.push('Weak E-E-A-T signals');
        recommendations.push('Add author bio, credentials, sources, and data points');
    }
    
    return {
        total_score: totalScore,
        grade,
        readability_score: readability.score,
        seo_score: seo.score,
        depth_score: depth.score,
        engagement_score: engagement.score,
        eeat_score: eeat.score,
        readability,
        seo,
        depth,
        engagement,
        eeat,
        strengths,
        weaknesses,
        recommendations,
        analyzed_at: new Date().toISOString()
    };
}

// ============================================================================
// UTILITY: GENERATE QUALITY REPORT
// ============================================================================

export function generateQualityReport(score: QualityScore): string {
    return `
# Content Quality Report

**Overall Score**: ${score.total_score}/100 (${score.grade})
**Analyzed**: ${new Date(score.analyzed_at).toLocaleString()}

## Score Breakdown

- **Readability**: ${score.readability_score}/100
- **SEO**: ${score.seo_score}/100
- **Depth**: ${score.depth_score}/100
- **Engagement**: ${score.engagement_score}/100
- **E-E-A-T**: ${score.eeat_score}/100

## Strengths

${score.strengths.map(s => `- ✅ ${s}`).join('\n')}

## Weaknesses

${score.weaknesses.map(w => `- ⚠️ ${w}`).join('\n')}

## Recommendations

${score.recommendations.map(r => `- 💡 ${r}`).join('\n')}

## Detailed Analysis

### Readability
- Flesch-Kincaid Score: ${score.readability.flesch_kincaid_score}
- Reading Level: ${score.readability.reading_level}
- Avg Sentence Length: ${score.readability.avg_sentence_length} words
- Passive Voice: ${score.readability.passive_voice_percentage}%

### SEO
- H2 Count: ${score.seo.h2_count}
- H3 Count: ${score.seo.h3_count}
- Meta Title Length: ${score.seo.meta_title_length} chars
- Meta Description Length: ${score.seo.meta_description_length} chars
- Images: ${score.seo.image_count} (${score.seo.image_alt_coverage}% with alt)

### Depth
- Word Count: ${score.depth.word_count}
- Sections: ${score.depth.section_count}
- Lists: ${score.depth.list_count}
- Tables: ${score.depth.table_count}
- Examples: ${score.depth.example_count}

### Engagement
- Questions: ${score.engagement.question_count}
- CTAs: ${score.engagement.cta_count}
- Bullet Points: ${score.engagement.bullet_point_count}
- Has TOC: ${score.engagement.has_toc ? 'Yes' : 'No'}
- Has FAQ: ${score.engagement.has_faq ? 'Yes' : 'No'}

### E-E-A-T
- Author Mentioned: ${score.eeat.author_mentioned ? 'Yes' : 'No'}
- Credentials Shown: ${score.eeat.credentials_shown ? 'Yes' : 'No'}
- Sources Cited: ${score.eeat.sources_cited}
- Data Points: ${score.eeat.data_points}
- Expert Quotes: ${score.eeat.expert_quotes}
    `.trim();
}
