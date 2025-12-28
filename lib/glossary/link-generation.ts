/**
 * Auto-generate Internal Links for Glossary Terms
 */

import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface InternalLink {
    text: string;
    url: string;
    link_type: 'calculator' | 'guide' | 'glossary' | 'pillar';
    context: string;
}

/**
 * Generate internal links for a glossary term
 */
export async function generateInternalLinks(
    term: string,
    category: string,
    related_calculators?: string[],
    related_guides?: string[],
    related_terms?: string[]
): Promise<InternalLink[]> {
    const links: InternalLink[] = [];

    try {
        // Add calculator links
        if (related_calculators && related_calculators.length > 0) {
            for (const calcSlug of related_calculators) {
                links.push({
                    text: `${term} Calculator`,
                    url: `/calculators/${calcSlug}`,
                    link_type: 'calculator',
                    context: 'related_calculators',
                });
            }
        }

        // Add guide/article links
        if (related_guides && related_guides.length > 0) {
            for (const guideSlug of related_guides) {
                // Try to get article title for better anchor text
                try {
                    const articles = await api.entities.Article.filter({ slug: guideSlug });
                    if (articles.length > 0) {
                        const title = articles[0].title;
                        // Extract key phrase (first 3-4 words)
                        const anchorText = title.split(' ').slice(0, 4).join(' ');
                        links.push({
                            text: anchorText,
                            url: `/article/${guideSlug}`,
                            link_type: 'guide',
                            context: 'related_guides',
                        });
                    } else {
                        links.push({
                            text: `Guide to ${term}`,
                            url: `/guides/${guideSlug}`,
                            link_type: 'guide',
                            context: 'related_guides',
                        });
                    }
                } catch (error) {
                    logger.warn('Error fetching guide for link', { guideSlug });
                    links.push({
                        text: `Guide to ${term}`,
                        url: `/guides/${guideSlug}`,
                        link_type: 'guide',
                        context: 'related_guides',
                    });
                }
            }
        }

        // Add related glossary term links
        if (related_terms && related_terms.length > 0) {
            for (const relatedTerm of related_terms) {
                links.push({
                    text: relatedTerm,
                    url: `/glossary/${relatedTerm.toLowerCase().replace(/\s+/g, '-')}`,
                    link_type: 'glossary',
                    context: 'related_terms',
                });
            }
        }

        // Add category/pillar page link
        const categoryMap: Record<string, string> = {
            'investing': '/investing',
            'mutual-funds': '/mutual-funds',
            'stocks': '/stocks',
            'credit-cards': '/credit-cards',
            'loans': '/loans',
            'insurance': '/insurance',
            'tax': '/calculators/tax',
            'retirement': '/calculators/retirement',
            'banking': '/banking',
        };

        if (categoryMap[category]) {
            links.push({
                text: `${category.charAt(0).toUpperCase() + category.slice(1)} Guide`,
                url: categoryMap[category],
                link_type: 'pillar',
                context: 'category',
            });
        }

    } catch (error) {
        logger.error('Error generating internal links', error as Error, { term });
    }

    return links;
}

/**
 * Validate internal links
 */
export function validateInternalLinks(links: InternalLink[]): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Check for forbidden anchor text
    const forbidden = ['click here', 'read more', 'learn more', 'here', 'this'];
    for (const link of links) {
        const lowerText = link.text.toLowerCase();
        for (const forbiddenText of forbidden) {
            if (lowerText.includes(forbiddenText)) {
                errors.push(`Forbidden anchor text: "${link.text}"`);
            }
        }

        // Check word count (max 5 words)
        const wordCount = link.text.split(/\s+/).length;
        if (wordCount > 5) {
            errors.push(`Anchor text too long: "${link.text}" (${wordCount} words, max 5)`);
        }

        // Check URL format
        if (!link.url.startsWith('/') && !link.url.startsWith('http')) {
            errors.push(`Invalid URL format: ${link.url}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

