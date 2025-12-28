/**
 * Internal Linking Rules
 * 
 * Strict rules for internal linking across content types
 */

import { InternalLink, ContentType } from './schemas';

export interface LinkingRule {
    from_type: ContentType;
    to_types: ContentType[];
    min_links: number;
    max_links: number;
    anchor_text_pattern?: string;
    context_requirements?: string[];
}

/**
 * Linking rules matrix
 */
export const LINKING_RULES: Record<ContentType, LinkingRule> = {
    pillar_page: {
        from_type: 'pillar_page',
        to_types: ['subcategory_page', 'explainer_article', 'glossary_page', 'calculator_explainer'],
        min_links: 8,
        max_links: 15,
        context_requirements: [
            'Must link to at least 2 subcategory pages',
            'Must link to at least 2 explainer articles',
            'Must link to at least 1 glossary term',
        ],
    },
    subcategory_page: {
        from_type: 'subcategory_page',
        to_types: ['pillar_page', 'explainer_article', 'glossary_page'],
        min_links: 5,
        max_links: 10,
        context_requirements: [
            'Must link back to parent pillar page',
            'Must link to at least 1 explainer article',
        ],
    },
    explainer_article: {
        from_type: 'explainer_article',
        to_types: ['pillar_page', 'glossary_page', 'subcategory_page'],
        min_links: 4,
        max_links: 8,
        context_requirements: [
            'Must link to related pillar page',
            'Must link to at least 2 glossary terms',
        ],
    },
    glossary_page: {
        from_type: 'glossary_page',
        to_types: ['explainer_article', 'pillar_page', 'calculator_explainer'],
        min_links: 3,
        max_links: 6,
        context_requirements: [
            'Must link to at least 1 explainer article',
            'Must link to related pillar page',
        ],
    },
    calculator_explainer: {
        from_type: 'calculator_explainer',
        to_types: ['explainer_article', 'glossary_page'],
        min_links: 3,
        max_links: 6,
        context_requirements: [
            'Must link to related explainer articles',
            'Must link to relevant glossary terms',
        ],
    },
};

/**
 * Forbidden anchor text patterns
 */
export const FORBIDDEN_ANCHOR_TEXTS = [
    'click here',
    'read more',
    'learn more',
    'here',
    'this',
    'link',
    'page',
    'article',
    'website',
];

/**
 * Required anchor text patterns by link type
 */
export const REQUIRED_ANCHOR_PATTERNS: Record<string, string[]> = {
    pillar: ['best', 'top', 'guide to', 'complete guide'],
    subcategory: ['types of', 'variants of', 'options for'],
    explainer: ['how', 'what is', 'understanding'],
    glossary: ['definition of', 'meaning of', 'what is'],
    calculator: ['calculate', 'compute', 'estimate'],
};

/**
 * Validate anchor text
 */
export function validateAnchorText(
    anchorText: string,
    linkType: InternalLink['link_type']
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check forbidden patterns
    const lowerAnchor = anchorText.toLowerCase();
    for (const forbidden of FORBIDDEN_ANCHOR_TEXTS) {
        if (lowerAnchor.includes(forbidden)) {
            errors.push(`Anchor text contains forbidden phrase: "${forbidden}"`);
        }
    }

    // Check word count (max 5 words)
    const wordCount = anchorText.split(/\s+/).length;
    if (wordCount > 5) {
        errors.push(`Anchor text exceeds 5 words (${wordCount})`);
    }

    // Check minimum length
    if (anchorText.length < 3) {
        errors.push('Anchor text too short (minimum 3 characters)');
    }

    // Check maximum length
    if (anchorText.length > 60) {
        errors.push('Anchor text too long (maximum 60 characters)');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Generate suggested anchor text
 */
export function suggestAnchorText(
    targetTitle: string,
    linkType: InternalLink['link_type'],
    context?: string
): string {
    // Extract key phrase from title (first 3-4 words)
    const words = targetTitle.split(/\s+/).slice(0, 4);
    let anchor = words.join(' ');

    // Add context if provided
    if (context) {
        const contextWords = context.split(/\s+/).slice(0, 2);
        anchor = `${contextWords.join(' ')} ${anchor}`;
    }

    // Ensure it's not too long
    if (anchor.length > 60) {
        anchor = anchor.substring(0, 57) + '...';
    }

    return anchor;
}

/**
 * Get linking requirements for content type
 */
export function getLinkingRequirements(contentType: ContentType): LinkingRule {
    return LINKING_RULES[contentType];
}

