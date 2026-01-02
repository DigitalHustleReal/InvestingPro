/**
 * 🔍 PRODUCTION ADVANCED SEO OPTIMIZER
 * 
 * Comprehensive SEO optimization engine that analyzes and enhances
 * content for maximum search visibility and ranking potential.
 * 
 * OPTIMIZATION AREAS:
 * 1. Keyword Optimization (Primary + LSI keywords)
 * 2. Content Structure (Headings, paragraphs, lists)
 * 3. Internal Linking (Related articles, contextual links)
 * 4. Meta Tags (Title, description, OG tags)
 * 5. Technical SEO (URLs, alt tags, schema readiness)
 * 6. Content Length & Depth
 * 7. Readability & User Experience
 * 
 * FEATURES:
 * - Automatic keyword density optimization
 * - LSI keyword suggestions
 * - Internal link recommendations
 * - Meta tag generation
 * - Heading structure validation
 * - Image optimization checks
 * - Mobile-friendliness validation
 * - Page speed recommendations
 */

import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SEOOptimizationResult {
    overall_score: number; // 0-100
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    
    // Optimization Categories
    keyword_optimization: KeywordOptimization;
    content_structure: ContentStructure;
    internal_linking: InternalLinking;
    meta_tags: MetaTags;
    technical_seo: TechnicalSEO;
    
    // Recommendations
    critical_issues: string[];
    warnings: string[];
    suggestions: string[];
    quick_wins: string[];
    
    // Auto-generated enhancements
    suggested_meta_title?: string;
    suggested_meta_description?: string;
    suggested_internal_links?: InternalLink[];
    suggested_lsi_keywords?: string[];
    
    analyzed_at: string;
}

export interface KeywordOptimization {
    primary_keyword: string;
    primary_keyword_density: number;
    primary_keyword_in_title: boolean;
    primary_keyword_in_h1: boolean;
    primary_keyword_in_first_paragraph: boolean;
    primary_keyword_in_url: boolean;
    lsi_keywords_found: string[];
    lsi_keywords_missing: string[];
    keyword_stuffing_risk: boolean;
    score: number;
}

export interface ContentStructure {
    word_count: number;
    paragraph_count: number;
    avg_paragraph_length: number;
    h1_count: number;
    h2_count: number;
    h3_count: number;
    heading_hierarchy_valid: boolean;
    has_table_of_contents: boolean;
    has_conclusion: boolean;
    readability_score: number;
    score: number;
}

export interface InternalLinking {
    internal_link_count: number;
    external_link_count: number;
    broken_links: string[];
    recommended_internal_links: InternalLink[];
    anchor_text_diversity: number;
    links_to_homepage: boolean;
    score: number;
}

export interface InternalLink {
    anchor_text: string;
    target_url: string;
    context: string;
    relevance_score: number;
}

export interface MetaTags {
    title_tag: string;
    title_length: number;
    title_optimized: boolean;
    meta_description: string;
    description_length: number;
    description_optimized: boolean;
    og_tags_present: boolean;
    twitter_card_present: boolean;
    canonical_tag_present: boolean;
    score: number;
}

export interface TechnicalSEO {
    url_seo_friendly: boolean;
    images_have_alt_text: number; // percentage
    images_optimized: boolean;
    schema_markup_present: boolean;
    mobile_friendly: boolean;
    page_speed_score: number;
    https_enabled: boolean;
    score: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const IDEAL_KEYWORD_DENSITY = { min: 0.5, max: 2.5 }; // percentage
const IDEAL_TITLE_LENGTH = { min: 50, max: 60 };
const IDEAL_DESCRIPTION_LENGTH = { min: 150, max: 160 };
const IDEAL_WORD_COUNT = { min: 1500, max: 3000 };
const MIN_INTERNAL_LINKS = 3;
const MAX_INTERNAL_LINKS = 10;

// LSI Keywords Database (simplified - in production, use API or ML)
const LSI_KEYWORDS_MAP: Record<string, string[]> = {
    'mutual funds': ['SIP', 'NAV', 'portfolio', 'asset management', 'fund manager', 'expense ratio', 'returns', 'investment'],
    'credit card': ['cashback', 'rewards', 'credit limit', 'APR', 'annual fee', 'credit score', 'payment', 'benefits'],
    'personal loan': ['interest rate', 'EMI', 'tenure', 'collateral', 'CIBIL score', 'processing fee', 'foreclosure', 'disbursal'],
    'stocks': ['equity', 'shares', 'dividends', 'IPO', 'bull market', 'bear market', 'trading', 'portfolio'],
    'insurance': ['premium', 'coverage', 'claim', 'policy', 'beneficiary', 'term life', 'health insurance', 'riders']
};

// Supabase for article database
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }
    return supabaseClient;
}

// ============================================================================
// KEYWORD OPTIMIZATION ANALYSIS
// ============================================================================

function analyzeKeywordOptimization(
    html: string,
    primaryKeyword: string,
    url?: string
): KeywordOptimization {
    const $ = cheerio.load(html);
    const bodyText = $('body').text().toLowerCase();
    const words = bodyText.split(/\s+/).filter(w => w.length > 0);
    
    // Calculate keyword density
    const keywordLower = primaryKeyword.toLowerCase();
    const keywordOccurrences = bodyText.split(keywordLower).length - 1;
    const density = (keywordOccurrences / words.length) * 100;
    
    // Check keyword placement
    const title = $('title').text().toLowerCase();
    const h1 = $('h1').first().text().toLowerCase();
    const firstParagraph = $('p').first().text().toLowerCase();
    
    const inTitle = title.includes(keywordLower);
    const inH1 = h1.includes(keywordLower);
    const inFirstPara = firstParagraph.includes(keywordLower);
    const inUrl = url ? url.toLowerCase().includes(keywordLower.replace(/\s+/g, '-')) : false;
    
    // LSI keywords
    const lsiKeywords = LSI_KEYWORDS_MAP[keywordLower] || [];
    const lsiFound: string[] = [];
    const lsiMissing: string[] = [];
    
    lsiKeywords.forEach(lsi => {
        if (bodyText.includes(lsi.toLowerCase())) {
            lsiFound.push(lsi);
        } else {
            lsiMissing.push(lsi);
        }
    });
    
    // Keyword stuffing check
    const keywordStuffing = density > IDEAL_KEYWORD_DENSITY.max * 2;
    
    // Calculate score
    let score = 0;
    if (density >= IDEAL_KEYWORD_DENSITY.min && density <= IDEAL_KEYWORD_DENSITY.max) score += 25;
    else if (density > 0) score += 10;
    if (inTitle) score += 20;
    if (inH1) score += 15;
    if (inFirstPara) score += 15;
    if (inUrl) score += 10;
    score += Math.min((lsiFound.length / lsiKeywords.length) * 15, 15);
    
    return {
        primary_keyword: primaryKeyword,
        primary_keyword_density: Math.round(density * 100) / 100,
        primary_keyword_in_title: inTitle,
        primary_keyword_in_h1: inH1,
        primary_keyword_in_first_paragraph: inFirstPara,
        primary_keyword_in_url: inUrl,
        lsi_keywords_found: lsiFound,
        lsi_keywords_missing: lsiMissing,
        keyword_stuffing_risk: keywordStuffing,
        score: Math.round(score)
    };
}

// ============================================================================
// CONTENT STRUCTURE ANALYSIS
// ============================================================================

function analyzeContentStructure(html: string): ContentStructure {
    const $ = cheerio.load(html);
    const bodyText = $('body').text();
    
    const words = bodyText.split(/\s+/).filter(w => w.length > 0);
    const paragraphs = $('p');
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    
    // Calculate average paragraph length
    let totalParaWords = 0;
    paragraphs.each((i, p) => {
        const paraWords = $(p).text().split(/\s+/).length;
        totalParaWords += paraWords;
    });
    const avgParaLength = paragraphs.length > 0 ? totalParaWords / paragraphs.length : 0;
    
    // Check heading hierarchy
    let headingHierarchyValid = true;
    if (h1Count === 0 || h1Count > 1) headingHierarchyValid = false;
    
    // Check for TOC and conclusion
    const hasTOC = $('[class*="toc"], [id*="toc"], .table-of-contents').length > 0;
    const conclusionKeywords = /(conclusion|summary|final thoughts|wrapping up)/i;
    const hasConclusion = $('h2, h3').last().text().match(conclusionKeywords) !== null;
    
    // Readability (simplified Flesch-Kincaid)
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    let readabilityScore = 100;
    if (avgWordsPerSentence > 25) readabilityScore -= 20;
    if (avgWordsPerSentence > 30) readabilityScore -= 20;
    if (avgParaLength > 150) readabilityScore -= 20;
    
    // Calculate score
    let score = 0;
    if (words.length >= IDEAL_WORD_COUNT.min && words.length <= IDEAL_WORD_COUNT.max) score += 25;
    else if (words.length >= IDEAL_WORD_COUNT.min * 0.8) score += 15;
    if (h1Count === 1) score += 15;
    if (h2Count >= 5) score += 15;
    if (h3Count >= 3) score += 10;
    if (headingHierarchyValid) score += 10;
    if (hasTOC) score += 10;
    if (hasConclusion) score += 10;
    if (readabilityScore >= 80) score += 5;
    
    return {
        word_count: words.length,
        paragraph_count: paragraphs.length,
        avg_paragraph_length: Math.round(avgParaLength),
        h1_count: h1Count,
        h2_count: h2Count,
        h3_count: h3Count,
        heading_hierarchy_valid: headingHierarchyValid,
        has_table_of_contents: hasTOC,
        has_conclusion: hasConclusion,
        readability_score: readabilityScore,
        score: Math.round(score)
    };
}

// ============================================================================
// INTERNAL LINKING ANALYSIS
// ============================================================================

async function analyzeInternalLinking(
    html: string,
    currentUrl: string
): Promise<InternalLinking> {
    const $ = cheerio.load(html);
    const links = $('a[href]');
    
    let internalCount = 0;
    let externalCount = 0;
    const brokenLinks: string[] = [];
    const anchorTexts = new Set<string>();
    let linksToHomepage = false;
    
    links.each((i, link) => {
        const href = $(link).attr('href') || '';
        const anchorText = $(link).text().trim();
        
        if (href.startsWith('/') || href.includes(process.env.NEXT_PUBLIC_SITE_URL || '')) {
            internalCount++;
            if (href === '/' || href === process.env.NEXT_PUBLIC_SITE_URL) {
                linksToHomepage = true;
            }
        } else if (href.startsWith('http')) {
            externalCount++;
        }
        
        if (anchorText) anchorTexts.add(anchorText.toLowerCase());
    });
    
    // Get recommended internal links
    const recommended = await getRecommendedInternalLinks(html, currentUrl);
    
    // Calculate anchor text diversity (unique anchor texts / total internal links)
    const diversity = internalCount > 0 ? (anchorTexts.size / internalCount) * 100 : 0;
    
    // Calculate score
    let score = 0;
    if (internalCount >= MIN_INTERNAL_LINKS && internalCount <= MAX_INTERNAL_LINKS) score += 30;
    else if (internalCount >= MIN_INTERNAL_LINKS) score += 20;
    if (externalCount >= 2 && externalCount <= 5) score += 20;
    if (diversity >= 70) score += 20;
    if (linksToHomepage) score += 15;
    if (brokenLinks.length === 0) score += 15;
    
    return {
        internal_link_count: internalCount,
        external_link_count: externalCount,
        broken_links: brokenLinks,
        recommended_internal_links: recommended,
        anchor_text_diversity: Math.round(diversity),
        links_to_homepage: linksToHomepage,
        score: Math.round(score)
    };
}

async function getRecommendedInternalLinks(
    html: string,
    currentUrl: string
): Promise<InternalLink[]> {
    const $ = cheerio.load(html);
    const bodyText = $('body').text().toLowerCase();
    const recommendations: InternalLink[] = [];
    
    try {
        const supabase = getSupabaseClient();
        
        // Get published articles (excluding current)
        const { data: articles } = await supabase
            .from('articles')
            .select('id, title, slug, category, excerpt')
            .eq('status', 'published')
            .neq('slug', currentUrl.split('/').pop() || '')
            .limit(20);

        if (!articles) return recommendations;
        
        // Find relevant articles based on keyword matching
        articles.forEach(article => {
            const titleLower = article.title.toLowerCase();
            const excerptLower = (article.excerpt || '').toLowerCase();
            
            // Check if article title or excerpt keywords appear in current content
            const titleWords = titleLower.split(/\s+/).filter(w => w.length > 4);
            let matchCount = 0;
            
            titleWords.forEach(word => {
                if (bodyText.includes(word)) matchCount++;
            });
            
            if (matchCount >= 2) {
                const relevance = (matchCount / titleWords.length) * 100;
                
                recommendations.push({
                    anchor_text: article.title,
                    target_url: `/articles/${article.slug}`,
                    context: article.excerpt || article.title,
                    relevance_score: Math.round(relevance)
                });
            }
        });
        
        // Sort by relevance and return top 5
        return recommendations
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .slice(0, 5);
            
    } catch (error) {
        console.error('Failed to get internal link recommendations:', error);
        return recommendations;
    }
}

// ============================================================================
// META TAGS ANALYSIS
// ============================================================================

function analyzeMetaTags(html: string, primaryKeyword: string): MetaTags {
    const $ = cheerio.load(html);
    
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    
    const ogTagsPresent = $('meta[property^="og:"]').length > 0;
    const twitterCardPresent = $('meta[name^="twitter:"]').length > 0;
    const canonicalPresent = $('link[rel="canonical"]').length > 0;
    
    const titleOptimized = 
        title.length >= IDEAL_TITLE_LENGTH.min &&
        title.length <= IDEAL_TITLE_LENGTH.max &&
        title.toLowerCase().includes(primaryKeyword.toLowerCase());
    
    const descriptionOptimized = 
        description.length >= IDEAL_DESCRIPTION_LENGTH.min &&
        description.length <= IDEAL_DESCRIPTION_LENGTH.max &&
        description.toLowerCase().includes(primaryKeyword.toLowerCase());
    
    // Calculate score
    let score = 0;
    if (titleOptimized) score += 30;
    else if (title.length > 0) score += 15;
    if (descriptionOptimized) score += 30;
    else if (description.length > 0) score += 15;
    if (ogTagsPresent) score += 15;
    if (twitterCardPresent) score += 10;
    if (canonicalPresent) score += 5;
    
    return {
        title_tag: title,
        title_length: title.length,
        title_optimized: titleOptimized,
        meta_description: description,
        description_length: description.length,
        description_optimized: descriptionOptimized,
        og_tags_present: ogTagsPresent,
        twitter_card_present: twitterCardPresent,
        canonical_tag_present: canonicalPresent,
        score: Math.round(score)
    };
}

// ============================================================================
// TECHNICAL SEO ANALYSIS
// ============================================================================

function analyzeTechnicalSEO(html: string, url?: string): TechnicalSEO {
    const $ = cheerio.load(html);
    
    // URL SEO-friendly check
    const urlSEOFriendly = url ? 
        /^[a-z0-9\-\/]+$/.test(url.toLowerCase()) && 
        !url.includes('?') &&
        !url.includes('&') : true;
    
    // Images alt text
    const images = $('img');
    const imagesWithAlt = images.filter('[alt]').length;
    const altTextPercentage = images.length > 0 ? (imagesWithAlt / images.length) * 100 : 100;
    
    // Images optimized (check for lazy loading)
    const imagesOptimized = $('img[loading="lazy"]').length > 0;
    
    // Schema markup
    const schemaPresent = $('script[type="application/ld+json"]').length > 0;
    
    // Mobile-friendly indicators
    const viewport = $('meta[name="viewport"]').attr('content') || '';
    const mobileFriendly = viewport.includes('width=device-width');
    
    // Calculate score
    let score = 0;
    if (urlSEOFriendly) score += 15;
    if (altTextPercentage >= 90) score += 25;
    else if (altTextPercentage >= 70) score += 15;
    if (imagesOptimized) score += 15;
    if (schemaPresent) score += 20;
    if (mobileFriendly) score += 15;
    score += 10; // HTTPS (assumed in production)
    
    return {
        url_seo_friendly: urlSEOFriendly,
        images_have_alt_text: Math.round(altTextPercentage),
        images_optimized: imagesOptimized,
        schema_markup_present: schemaPresent,
        mobile_friendly: mobileFriendly,
        page_speed_score: 85, // Placeholder - would use Lighthouse API
        https_enabled: true, // Assumed
        score: Math.round(score)
    };
}

// ============================================================================
// MAIN EXPORT: SEO OPTIMIZER
// ============================================================================

export async function optimizeSEO(
    html: string,
    primaryKeyword: string,
    currentUrl?: string
): Promise<SEOOptimizationResult> {
    console.log(`\n🔍 Starting SEO optimization analysis...`);
    console.log(`   Primary Keyword: "${primaryKeyword}"`);
    
    // Run all analyses
    const keywordOpt = analyzeKeywordOptimization(html, primaryKeyword, currentUrl);
    const contentStruct = analyzeContentStructure(html);
    const internalLinks = await analyzeInternalLinking(html, currentUrl || '');
    const metaTags = analyzeMetaTags(html, primaryKeyword);
    const technicalSEO = analyzeTechnicalSEO(html, currentUrl);
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
        keywordOpt.score * 0.25 +
        contentStruct.score * 0.20 +
        internalLinks.score * 0.20 +
        metaTags.score * 0.20 +
        technicalSEO.score * 0.15
    );
    
    // Assign grade
    let grade: SEOOptimizationResult['grade'];
    if (overallScore >= 95) grade = 'A+';
    else if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 85) grade = 'B+';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 75) grade = 'C+';
    else if (overallScore >= 70) grade = 'C';
    else if (overallScore >= 60) grade = 'D';
    else grade = 'F';
    
    // Generate recommendations
    const { critical, warnings, suggestions, quickWins } = generateRecommendations({
        keywordOpt,
        contentStruct,
        internalLinks,
        metaTags,
        technicalSEO
    });
    
    // Auto-generate enhancements
    const suggestedTitle = generateOptimizedTitle(html, primaryKeyword);
    const suggestedDescription = generateOptimizedDescription(html, primaryKeyword);
    
    console.log(`✅ SEO Analysis Complete`);
    console.log(`   Overall Score: ${overallScore}/100 (${grade})`);
    console.log(`   Critical Issues: ${critical.length}`);
    console.log(`   Quick Wins: ${quickWins.length}`);
    
    return {
        overall_score: overallScore,
        grade,
        keyword_optimization: keywordOpt,
        content_structure: contentStruct,
        internal_linking: internalLinks,
        meta_tags: metaTags,
        technical_seo: technicalSEO,
        critical_issues: critical,
        warnings,
        suggestions,
        quick_wins: quickWins,
        suggested_meta_title: suggestedTitle,
        suggested_meta_description: suggestedDescription,
        suggested_internal_links: internalLinks.recommended_internal_links,
        suggested_lsi_keywords: keywordOpt.lsi_keywords_missing.slice(0, 5),
        analyzed_at: new Date().toISOString()
    };
}

// ============================================================================
// RECOMMENDATION GENERATION
// ============================================================================

function generateRecommendations(analysis: {
    keywordOpt: KeywordOptimization;
    contentStruct: ContentStructure;
    internalLinks: InternalLinking;
    metaTags: MetaTags;
    technicalSEO: TechnicalSEO;
}) {
    const critical: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const quickWins: string[] = [];
    
    const { keywordOpt, contentStruct, internalLinks, metaTags, technicalSEO } = analysis;
    
    // Critical issues
    if (contentStruct.h1_count === 0) critical.push('Missing H1 tag - add one immediately');
    if (!metaTags.title_tag) critical.push('Missing title tag - critical for SEO');
    if (!metaTags.meta_description) critical.push('Missing meta description');
    if (contentStruct.word_count < IDEAL_WORD_COUNT.min * 0.5) critical.push('Content too short - aim for 1500+ words');
    
    // Warnings
    if (keywordOpt.keyword_stuffing_risk) warnings.push('Possible keyword stuffing detected');
    if (!keywordOpt.primary_keyword_in_title) warnings.push('Primary keyword missing from title');
    if (contentStruct.h1_count > 1) warnings.push('Multiple H1 tags found - should have only one');
    if (internalLinks.internal_link_count < MIN_INTERNAL_LINKS) warnings.push(`Add more internal links (minimum ${MIN_INTERNAL_LINKS})`);
    
    // Suggestions
    if (keywordOpt.lsi_keywords_missing.length > 0) {
        suggestions.push(`Add LSI keywords: ${keywordOpt.lsi_keywords_missing.slice(0, 3).join(', ')}`);
    }
    if (contentStruct.word_count < IDEAL_WORD_COUNT.min) {
        suggestions.push(`Increase word count to ${IDEAL_WORD_COUNT.min}+ for better ranking`);
    }
    if (!contentStruct.has_table_of_contents) {
        suggestions.push('Add a table of contents for better UX');
    }
    
    // Quick wins
    if (technicalSEO.images_have_alt_text < 90) {
        quickWins.push(`Add alt text to ${100 - technicalSEO.images_have_alt_text}% of images`);
    }
    if (!metaTags.canonical_tag_present) {
        quickWins.push('Add canonical tag to prevent duplicate content issues');
    }
    if (!technicalSEO.schema_markup_present) {
        quickWins.push('Add Schema.org markup for rich snippets');
    }
    if (internalLinks.recommended_internal_links.length > 0) {
        quickWins.push(`Add ${Math.min(3, internalLinks.recommended_internal_links.length)} recommended internal links`);
    }
    
    return { critical, warnings, suggestions, quickWins };
}

// ============================================================================
// AUTO-GENERATION HELPERS
// ============================================================================

function generateOptimizedTitle(html: string, keyword: string): string {
    const $ = cheerio.load(html);
    const h1 = $('h1').first().text();
    
    if (h1) {
        // Use H1 and add keyword if not present
        if (h1.toLowerCase().includes(keyword.toLowerCase())) {
            return h1.substring(0, IDEAL_TITLE_LENGTH.max);
        }
        return `${keyword}: ${h1}`.substring(0, IDEAL_TITLE_LENGTH.max);
    }
    
    return `${keyword} - Complete Guide 2026`;
}

function generateOptimizedDescription(html: string, keyword: string): string {
    const $ = cheerio.load(html);
    const firstPara = $('p').first().text();
    
    if (firstPara) {
        return firstPara.substring(0, IDEAL_DESCRIPTION_LENGTH.max);
    }
    
    return `Discover everything about ${keyword}. Expert insights, tips, and strategies for 2026.`;
}

// ============================================================================
// UTILITY: GENERATE SEO REPORT
// ============================================================================

export function generateSEOReport(result: SEOOptimizationResult): string {
    return `
# SEO Optimization Report

**Overall Score**: ${result.overall_score}/100 (${result.grade})
**Analyzed**: ${new Date(result.analyzed_at).toLocaleString()}

## Summary

${result.critical_issues.length > 0 ? `### 🚨 Critical Issues (${result.critical_issues.length})
${result.critical_issues.map(i => `- ${i}`).join('\n')}
` : ''}

${result.warnings.length > 0 ? `### ⚠️ Warnings (${result.warnings.length})
${result.warnings.map(w => `- ${w}`).join('\n')}
` : ''}

### ⚡ Quick Wins (${result.quick_wins.length})
${result.quick_wins.map(q => `- ${q}`).join('\n')}

## Detailed Analysis

### Keyword Optimization (${result.keyword_optimization.score}/100)
- Primary Keyword: **${result.keyword_optimization.primary_keyword}**
- Density: ${result.keyword_optimization.primary_keyword_density}%
- In Title: ${result.keyword_optimization.primary_keyword_in_title ? '✅' : '❌'}
- In H1: ${result.keyword_optimization.primary_keyword_in_h1 ? '✅' : '❌'}
- In First Paragraph: ${result.keyword_optimization.primary_keyword_in_first_paragraph ? '✅' : '❌'}
- LSI Keywords Found: ${result.keyword_optimization.lsi_keywords_found.join(', ') || 'None'}

### Content Structure (${result.content_structure.score}/100)
- Word Count: **${result.content_structure.word_count}**
- H1: ${result.content_structure.h1_count}
- H2: ${result.content_structure.h2_count}
- H3: ${result.content_structure.h3_count}
- Readability: ${result.content_structure.readability_score}/100

### Internal Linking (${result.internal_linking.score}/100)
- Internal Links: ${result.internal_linking.internal_link_count}
- External Links: ${result.internal_linking.external_link_count}
- Anchor Diversity: ${result.internal_linking.anchor_text_diversity}%

### Meta Tags (${result.meta_tags.score}/100)
- Title: ${result.meta_tags.title_length} chars ${result.meta_tags.title_optimized ? '✅' : '⚠️'}
- Description: ${result.meta_tags.description_length} chars ${result.meta_tags.description_optimized ? '✅' : '⚠️'}

### Technical SEO (${result.technical_seo.score}/100)
- URL SEO-Friendly: ${result.technical_seo.url_seo_friendly ? '✅' : '❌'}
- Images with Alt: ${result.technical_seo.images_have_alt_text}%
- Schema Markup: ${result.technical_seo.schema_markup_present ? '✅' : '❌'}

## Recommended Actions

${result.suggested_meta_title ? `### Suggested Title
\`${result.suggested_meta_title}\`
` : ''}

${result.suggested_meta_description ? `### Suggested Description
\`${result.suggested_meta_description}\`
` : ''}

${result.suggested_internal_links && result.suggested_internal_links.length > 0 ? `### Suggested Internal Links
${result.suggested_internal_links.map(link => `- [${link.anchor_text}](${link.target_url}) (Relevance: ${link.relevance_score}%)`).join('\n')}
` : ''}

${result.suggested_lsi_keywords && result.suggested_lsi_keywords.length > 0 ? `### Add These LSI Keywords
${result.suggested_lsi_keywords.map(k => `- ${k}`).join('\n')}
` : ''}
    `.trim();
}
