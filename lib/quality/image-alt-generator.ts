/**
 * 🖼️ IMAGE ALT TEXT GENERATOR
 * 
 * Generates SEO-optimized alt text for images:
 * - Descriptive (what the image shows)
 * - Contextual (fits article content)
 * - Keyword-aware
 * - Accessibility-friendly
 * - 125 characters or less (SEO best practice)
 */

import { logger } from '../logger';

export interface ImageAltText {
    altText: string;
    title: string;
    caption?: string;
    length: number;
    isOptimal: boolean;
}

/**
 * Generate alt text for featured image
 */
export function generateImageAltText(
    articleTitle: string,
    articleTopic: string,
    keywordcontext?: string
): ImageAltText {
    // Extract key terms from title
    const cleanTitle = articleTitle
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Build descriptive alt text
    let altText = '';
    
    // Determine image type based on topic
    const lowerTopic = articleTopic.toLowerCase();
    
    if (lowerTopic.includes('calculator') || lowerTopic.includes('calculation')) {
        altText = `Financial calculator interface showing ${extractKeyPhrase(cleanTitle)}`;
    } else if (lowerTopic.includes('chart') || lowerTopic.includes('graph') || lowerTopic.includes('returns')) {
        altText = `Investment growth chart illustrating ${extractKeyPhrase(cleanTitle)}`;
    } else if (lowerTopic.includes('comparison') || lowerTopic.includes('vs')) {
        altText = `Comparison table showing ${extractKeyPhrase(cleanTitle)}`;
    } else if (lowerTopic.includes('guide') || lowerTopic.includes('how to')) {
        altText = `Step-by-step guide visual for ${extractKeyPhrase(cleanTitle)}`;
    } else if (lowerTopic.includes('best') || lowerTopic.includes('top')) {
        altText = `Infographic displaying ${extractKeyPhrase(cleanTitle)}`;
    } else if (lowerTopic.includes('mutual fund') || lowerTopic.includes('sip')) {
        altText = `Mutual fund investment concept representing ${extractKeyPhrase(cleanTitle)}`;
    } else if (lowerTopic.includes('tax') || lowerTopic.includes('saving')) {
        altText = `Tax saving strategy illustration for ${extractKeyPhrase(cleanTitle)}`;
    } else {
        altText = `Financial concept visualization for ${extractKeyPhrase(cleanTitle)}`;
    }

    // Ensure length is optimal (<= 125 chars for SEO)
    if (altText.length > 125) {
        altText = altText.substring(0, 122) + '...';
    }

    // Generate title attribute (slightly different from alt)
    const title = `${extractKeyPhrase(cleanTitle)} - InvestingPro India`;

    // Optional caption for display
    const caption = `Visual guide to ${extractKeyPhrase(cleanTitle)}`;

    return {
        altText,
        title,
        caption,
        length: altText.length,
        isOptimal: altText.length >= 50 && altText.length <= 125
    };
}

/**
 * Extract key phrase from title (remove filler words)
 */
function extractKeyPhrase(title: string): string {
    const fillerWords = [
        'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'about', 'as', 'into', 'through', 'after',
        'complete', 'guide', 'ultimate', '2026', '2025', '-'
    ];

    const words = title
        .toLowerCase()
        .split(/\s+/)
        .filter(word => {
            const cleanWord = word.replace(/[^a-z]/g, '');
            return cleanWord.length > 2 && !fillerWords.includes(cleanWord);
        });

    // Take first 6-8 meaningful words
    const keyPhrase = words.slice(0, 8).join(' ');
    
    // Capitalize first letter
    return keyPhrase.charAt(0).toUpperCase() + keyPhrase.slice(1);
}

/**
 * Generate alt text for inline images
 */
export function generateInlineImageAltText(
    context: string,
    imageType: 'chart' | 'table' | 'infographic' | 'screenshot' | 'diagram' | 'icon'
): string {
    const contextPhrase = extractKeyPhrase(context).toLowerCase();
    
    const templates: Record<typeof imageType, string> = {
        chart: `Chart showing ${contextPhrase}`,
        table: `Data table comparing ${contextPhrase}`,
        infographic: `Infographic explaining ${contextPhrase}`,
        screenshot: `Screenshot demonstrating ${contextPhrase}`,
        diagram: `Diagram illustrating ${contextPhrase}`,
        icon: `Icon representing ${contextPhrase}`
    };

    return templates[imageType] || `Visual element for ${contextPhrase}`;
}

/**
 * Validate alt text quality
 */
export function validateAltText(altText: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
} {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check length
    if (altText.length < 20) {
        issues.push('Alt text too short (< 20 characters)');
        suggestions.push('Add more descriptive details about the image');
    }
    
    if (altText.length > 125) {
        issues.push('Alt text too long (> 125 characters)');
        suggestions.push('Shorten to 125 characters or less for SEO');
    }

    // Check for generic phrases
    const genericPhrases = ['image of', 'picture of', 'photo of', 'graphic of', 'image showing'];
    const hasGeneric = genericPhrases.some(phrase => altText.toLowerCase().includes(phrase));
    
    if (hasGeneric) {
        issues.push('Contains generic phrases');
        suggestions.push('Remove "image of" / "picture of" - be direct and descriptive');
    }

    // Check if descriptive
    const wordCount = altText.split(/\s+/).length;
    if (wordCount < 4) {
        issues.push('Not descriptive enough');
        suggestions.push('Add more context about what the image shows');
    }

    // Check for keywords (should have at least one meaningful word)
    const meaningfulWords = altText.match(/\b[a-z]{4,}\b/gi) || [];
    if (meaningfulWords.length < 3) {
        issues.push('Lacks meaningful keywords');
        suggestions.push('Include specific terms relevant to the content');
    }

    return {
        isValid: issues.length === 0,
        issues,
        suggestions
    };
}

/**
 * Generate batch alt texts for multiple images
 */
export function generateBatchAltTexts(
    articleTitle: string,
    imageCount: number,
    articleTopic: string
): ImageAltText[] {
    const altTexts: ImageAltText[] = [];

    // Featured image (first)
    altTexts.push(generateImageAltText(articleTitle, articleTopic));

    // Additional images (if any)
    for (let i = 1; i < imageCount; i++) {
        const variation = i % 4;
        let context = '';
        
        switch (variation) {
            case 0:
                context = `Chart ${i} for ${articleTopic}`;
                break;
            case 1:
                context = `Comparison table ${i} in ${articleTopic}`;
                break;
            case 2:
                context = `Step ${i} illustration for ${articleTopic}`;
                break;
            case 3:
                context = `Example ${i} demonstrating ${articleTopic}`;
                break;
        }

        const altText = generateInlineImageAltText(context, ['chart', 'table', 'infographic', 'diagram'][variation] as any);
        
        altTexts.push({
            altText,
            title: `${articleTopic} - Visual ${i}`,
            length: altText.length,
            isOptimal: altText.length >= 50 && altText.length <= 125
        });
    }

    return altTexts;
}
