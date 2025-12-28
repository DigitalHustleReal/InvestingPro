/**
 * SEO Metadata Rules
 * 
 * Strict rules for SEO metadata generation
 */

import { SEOMetadata, ContentType } from './schemas';

export interface SEORules {
    title: {
        max_length: number;
        min_length: number;
        must_include_keyword: boolean;
        format: string; // Format pattern as string
    };
    description: {
        max_length: number;
        min_length: number;
        must_include_keyword: boolean;
        must_include_cta: boolean;
    };
    keywords: {
        max_count: number;
        min_count: number;
        primary_first: boolean;
    };
    h1: {
        max_length: number;
        must_match_title_intent: boolean;
    };
}

export const SEO_RULES: Record<ContentType, SEORules> = {
    pillar_page: {
        title: {
            max_length: 60,
            min_length: 30,
            must_include_keyword: true,
            format: 'primary_keyword | secondary_info | brand',
        },
        description: {
            max_length: 160,
            min_length: 120,
            must_include_keyword: true,
            must_include_cta: true,
        },
        keywords: {
            max_count: 10,
            min_count: 5,
            primary_first: true,
        },
        h1: {
            max_length: 60,
            must_match_title_intent: true,
        },
    },
    subcategory_page: {
        title: {
            max_length: 60,
            min_length: 30,
            must_include_keyword: true,
            format: 'primary_keyword | secondary_info | brand',
        },
        description: {
            max_length: 160,
            min_length: 120,
            must_include_keyword: true,
            must_include_cta: true,
        },
        keywords: {
            max_count: 8,
            min_count: 3,
            primary_first: true,
        },
        h1: {
            max_length: 60,
            must_match_title_intent: true,
        },
    },
    explainer_article: {
        title: {
            max_length: 60,
            min_length: 30,
            must_include_keyword: true,
            format: 'How/What/Why | primary_keyword | Works/Guide',
        },
        description: {
            max_length: 160,
            min_length: 120,
            must_include_keyword: true,
            must_include_cta: false,
        },
        keywords: {
            max_count: 6,
            min_count: 3,
            primary_first: true,
        },
        h1: {
            max_length: 60,
            must_match_title_intent: true,
        },
    },
    glossary_page: {
        title: {
            max_length: 60,
            min_length: 20,
            must_include_keyword: true,
            format: 'term | Definition/Meaning | brand',
        },
        description: {
            max_length: 160,
            min_length: 100,
            must_include_keyword: true,
            must_include_cta: false,
        },
        keywords: {
            max_count: 5,
            min_count: 2,
            primary_first: true,
        },
        h1: {
            max_length: 60,
            must_match_title_intent: true,
        },
    },
    calculator_explainer: {
        title: {
            max_length: 60,
            min_length: 30,
            must_include_keyword: true,
            format: 'Calculator Name | Calculate/Estimate | brand',
        },
        description: {
            max_length: 160,
            min_length: 120,
            must_include_keyword: true,
            must_include_cta: true,
        },
        keywords: {
            max_count: 6,
            min_count: 3,
            primary_first: true,
        },
        h1: {
            max_length: 60,
            must_match_title_intent: true,
        },
    },
};

/**
 * Generate SEO title
 */
export function generateSEOTitle(
    primaryKeyword: string,
    secondaryInfo: string,
    contentType: ContentType,
    brand: string = 'InvestingPro'
): string {
    const rules = SEO_RULES[contentType];
    let title = '';

    switch (contentType) {
        case 'pillar_page':
        case 'subcategory_page':
            title = `${primaryKeyword} | ${secondaryInfo} | ${brand}`;
            break;
        case 'explainer_article':
            title = `How ${primaryKeyword} Works | Complete Guide | ${brand}`;
            break;
        case 'glossary_page':
            title = `${primaryKeyword} - Definition, Meaning & Examples | ${brand}`;
            break;
        case 'calculator_explainer':
            title = `${primaryKeyword} Calculator | Calculate Online | ${brand}`;
            break;
    }

    // Truncate if too long
    if (title.length > rules.title.max_length) {
        title = title.substring(0, rules.title.max_length - 3) + '...';
    }

    return title;
}

/**
 * Generate SEO description
 */
export function generateSEODescription(
    primaryKeyword: string,
    summary: string,
    contentType: ContentType,
    includeCTA: boolean = true
): string {
    const rules = SEO_RULES[contentType];
    let description = summary;

    // Ensure keyword is included
    if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        description = `${primaryKeyword}: ${description}`;
    }

    // Add CTA if required
    if (includeCTA && rules.description.must_include_cta) {
        const cta = contentType === 'calculator_explainer' 
            ? ' Calculate now for free.'
            : ' Learn more and compare options.';
        description = description + cta;
    }

    // Truncate if too long
    if (description.length > rules.description.max_length) {
        description = description.substring(0, rules.description.max_length - 3) + '...';
    }

    return description;
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(
    contentType: ContentType,
    content: any
): Record<string, any> {
    const baseUrl = 'https://investingpro.in';

    switch (contentType) {
        case 'pillar_page':
            return {
                '@context': 'https://schema.org',
                '@type': 'FinancialProduct',
                name: content.seo.title,
                description: content.seo.description,
                url: `${baseUrl}/${content.category}`,
                provider: {
                    '@type': 'Organization',
                    name: 'InvestingPro',
                },
            };
        case 'explainer_article':
            return {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: content.seo.title,
                description: content.seo.description,
                url: `${baseUrl}/guides/${content.topic}`,
                author: {
                    '@type': 'Organization',
                    name: 'InvestingPro',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'InvestingPro',
                },
            };
        case 'glossary_page':
            return {
                '@context': 'https://schema.org',
                '@type': 'DefinedTerm',
                name: content.term,
                description: content.seo.description,
                url: `${baseUrl}/glossary/${content.term.toLowerCase()}`,
            };
        case 'calculator_explainer':
            return {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: content.seo.title,
                description: content.seo.description,
                url: `${baseUrl}/calculators/${content.calculator_type}`,
                applicationCategory: 'FinanceApplication',
            };
        default:
            return {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: content.seo.title,
                description: content.seo.description,
            };
    }
}

/**
 * Validate SEO metadata
 */
export function validateSEO(seo: SEOMetadata, contentType: ContentType, primaryKeyword: string): {
    valid: boolean;
    errors: string[];
} {
    const rules = SEO_RULES[contentType];
    const errors: string[] = [];

    // Title validation
    if (seo.title.length > rules.title.max_length) {
        errors.push(`Title exceeds ${rules.title.max_length} characters`);
    }
    if (seo.title.length < rules.title.min_length) {
        errors.push(`Title below ${rules.title.min_length} characters`);
    }
    if (rules.title.must_include_keyword && !seo.title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        errors.push(`Title must include primary keyword: ${primaryKeyword}`);
    }

    // Description validation
    if (seo.description.length > rules.description.max_length) {
        errors.push(`Description exceeds ${rules.description.max_length} characters`);
    }
    if (seo.description.length < rules.description.min_length) {
        errors.push(`Description below ${rules.description.min_length} characters`);
    }
    if (rules.description.must_include_keyword && !seo.description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        errors.push(`Description must include primary keyword: ${primaryKeyword}`);
    }

    // Keywords validation
    if (seo.keywords.length > rules.keywords.max_count) {
        errors.push(`Too many keywords (max ${rules.keywords.max_count})`);
    }
    if (seo.keywords.length < rules.keywords.min_count) {
        errors.push(`Too few keywords (min ${rules.keywords.min_count})`);
    }
    if (rules.keywords.primary_first && seo.keywords[0] !== primaryKeyword) {
        errors.push('Primary keyword must be first in keywords array');
    }

    // H1 validation
    if (seo.h1.length > rules.h1.max_length) {
        errors.push(`H1 exceeds ${rules.h1.max_length} characters`);
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

