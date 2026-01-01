/**
 * Deterministic Internal Linking Engine
 * 
 * Automatically generates internal links based on strict rules.
 * No manual linking required.
 */

import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { NAVIGATION_CATEGORIES } from '@/lib/navigation/categories';

export interface InternalLink {
    text: string;
    url: string;
    type: 'pillar' | 'calculator' | 'explainer' | 'glossary' | 'subcategory';
    priority: number; // 1-10, higher = more important
}

export interface LinkingContext {
    contentType: 'glossary' | 'calculator' | 'explainer' | 'pillar' | 'subcategory';
    category?: string;
    slug?: string;
    relatedTerms?: string[];
    relatedCalculators?: string[];
}

/**
 * Deterministic Linking Rules
 */
const LINKING_RULES = {
    glossary: {
        pillar: { count: 1, priority: 10 },
        calculator: { count: 2, priority: 8 },
        explainer: { count: 0, priority: 0 },
    },
    calculator: {
        explainer: { count: 3, priority: 9 },
        glossary: { count: 2, priority: 7 },
        pillar: { count: 0, priority: 0 },
    },
    explainer: {
        glossary: { count: 3, priority: 8 },
        calculator: { count: 1, priority: 6 },
        pillar: { count: 1, priority: 7 },
    },
    pillar: {
        subcategory: { count: 4, priority: 9 },
        calculator: { count: 2, priority: 7 },
        explainer: { count: 2, priority: 8 },
        glossary: { count: 1, priority: 6 },
    },
    subcategory: {
        pillar: { count: 1, priority: 10 },
        calculator: { count: 2, priority: 8 },
        explainer: { count: 1, priority: 7 },
        glossary: { count: 1, priority: 6 },
    },
};

/**
 * Generate internal links for a page
 */
export async function generateInternalLinks(context: LinkingContext): Promise<InternalLink[]> {
    const links: InternalLink[] = [];
    
    // Validate context
    if (!context || !context.contentType) {
        return links;
    }
    
    const rules = LINKING_RULES[context.contentType];
    if (!rules) {
        return links;
    }

    try {
        // Generate pillar links
        if ('pillar' in rules && rules.pillar && rules.pillar.count > 0) {
            const pillarLinks = await generatePillarLinks(context, rules.pillar.count);
            links.push(...pillarLinks);
        }

        // Generate calculator links
        if ('calculator' in rules && rules.calculator && rules.calculator.count > 0) {
            const calculatorLinks = await generateCalculatorLinks(context, rules.calculator.count);
            links.push(...calculatorLinks);
        }

        // Generate explainer links
        if ('explainer' in rules && rules.explainer && rules.explainer.count > 0) {
            const explainerLinks = await generateExplainerLinks(context, rules.explainer.count);
            links.push(...explainerLinks);
        }

        // Generate glossary links
        if ('glossary' in rules && rules.glossary && rules.glossary.count > 0) {
            const glossaryLinks = await generateGlossaryLinks(context, rules.glossary.count);
            links.push(...glossaryLinks);
        }

        // Generate subcategory links
        if ('subcategory' in rules && rules.subcategory && rules.subcategory.count > 0) {
            const subcategoryLinks = await generateSubcategoryLinks(context, rules.subcategory.count);
            links.push(...subcategoryLinks);
        }

        // Sort by priority (highest first)
        return links.sort((a, b) => b.priority - a.priority);

    } catch (error) {
        logger.error('Error generating internal links', error as Error, { context });
        return [];
    }
}

/**
 * Generate pillar page links
 */
async function generatePillarLinks(context: LinkingContext, count: number): Promise<InternalLink[]> {
    const links: InternalLink[] = [];

    // If category is known, link to that pillar
    if (context.category) {
        const category = NAVIGATION_CATEGORIES.find(c => c.slug === context.category);
        if (category) {
            links.push({
                text: `${category.name} Guide`,
                url: `/${category.slug}`,
                type: 'pillar',
                priority: 10,
            });
        }
    }

    // If we need more links, add related categories
    if (links.length < count && context.category) {
        const relatedCategories = getRelatedCategories(context.category);
        for (const cat of relatedCategories.slice(0, count - links.length)) {
            links.push({
                text: `${cat.name} Guide`,
                url: `/${cat.slug}`,
                type: 'pillar',
                priority: 8,
            });
        }
    }

    return links.slice(0, count);
}

/**
 * Generate calculator links
 */
async function generateCalculatorLinks(context: LinkingContext, count: number): Promise<InternalLink[]> {
    const links: InternalLink[] = [];

    // Map category to relevant calculators
    const calculatorMap: Record<string, string[]> = {
        'credit-cards': ['emi', 'tax'],
        'loans': ['emi', 'tax', 'retirement'],
        'banking': ['fd', 'tax', 'retirement'],
        'investing': ['sip', 'lumpsum', 'retirement', 'tax'],
        'insurance': ['tax', 'retirement'],
        'small-business': ['emi', 'tax'],
    };

    // Get calculators for this category
    const calculators = calculatorMap[context.category || 'investing'] || ['sip', 'emi', 'tax'];
    
    // If specific calculators are mentioned, prioritize them
    if (context.relatedCalculators && context.relatedCalculators.length > 0) {
        for (const calc of context.relatedCalculators.slice(0, count)) {
            links.push({
                text: `${calc.charAt(0).toUpperCase() + calc.slice(1)} Calculator`,
                url: `/calculators/${calc}`,
                type: 'calculator',
                priority: 9,
            });
        }
    }

    // Fill remaining slots
    for (const calc of calculators) {
        if (links.length >= count) break;
        if (!links.find(l => l.url.includes(calc))) {
            links.push({
                text: `${calc.charAt(0).toUpperCase() + calc.slice(1)} Calculator`,
                url: `/calculators/${calc}`,
                type: 'calculator',
                priority: 8,
            });
        }
    }

    return links.slice(0, count);
}

/**
 * Generate explainer article links
 */
async function generateExplainerLinks(context: LinkingContext, count: number): Promise<InternalLink[]> {
    const links: InternalLink[] = [];

    try {
        // Fetch explainer articles from the same category
        const articles = await api.entities.Article.filter({
            category: context.category || 'investing-basics',
            status: 'published',
        });

        // Sort by relevance (views, recency)
        const sorted = articles
            .filter((a: any) => a.slug !== context.slug) // Exclude current page
            .sort((a: any, b: any) => {
                const scoreA = (a.views || 0) + (new Date(a.published_date || a.created_at).getTime() / 1000000);
                const scoreB = (b.views || 0) + (new Date(b.published_date || b.created_at).getTime() / 1000000);
                return scoreB - scoreA;
            });

        for (const article of sorted.slice(0, count)) {
            links.push({
                text: article.title,
                url: `/article/${article.slug}`,
                type: 'explainer',
                priority: 8,
            });
        }

    } catch (error) {
        logger.error('Error fetching explainer articles', error as Error);
    }

    return links.slice(0, count);
}

/**
 * Generate glossary term links
 */
async function generateGlossaryLinks(context: LinkingContext, count: number): Promise<InternalLink[]> {
    const links: InternalLink[] = [];

    // Early return if glossary_terms table doesn't exist or is not accessible
    // This prevents error spam when the table hasn't been set up yet
    try {
        // Quick check: try to fetch one term to see if table exists
        const testQuery = await api.entities.Glossary.list(undefined, 1);
        if (!testQuery || testQuery.length === 0) {
            // Table might not exist or be empty - return empty links silently
            return links;
        }
    } catch (error) {
        // Table doesn't exist or RLS is blocking - return empty links silently
        return links;
    }

    try {
        // If specific terms are mentioned, use them
        if (context.relatedTerms && context.relatedTerms.length > 0) {
            for (const term of context.relatedTerms.slice(0, count)) {
                try {
                    const glossaryTerm = await api.entities.Glossary.getBySlug(term);
                    if (glossaryTerm) {
                        links.push({
                            text: glossaryTerm.term,
                            url: `/glossary/${glossaryTerm.slug}`,
                            type: 'glossary',
                            priority: 9,
                        });
                    }
                } catch (error) {
                    // Skip this term if it fails
                    continue;
                }
            }
        }

        // Fill remaining slots with category-relevant terms
        if (links.length < count) {
            try {
                const terms = await api.entities.Glossary.getByCategory(context.category || 'Investing');
                const filtered = terms
                    .filter((t: any) => !context.relatedTerms?.includes(t.slug))
                    .slice(0, count - links.length);

                for (const term of filtered) {
                    links.push({
                        text: term.term,
                        url: `/glossary/${term.slug}`,
                        type: 'glossary',
                        priority: 7,
                    });
                }
            } catch (error) {
                // Silently fail - glossary terms are optional
            }
        }

    } catch (error) {
        // Silently handle glossary fetch errors - don't spam logs
        // Glossary terms are optional for internal linking
    }

    return links.slice(0, count);
}

/**
 * Generate subcategory links
 */
async function generateSubcategoryLinks(context: LinkingContext, count: number): Promise<InternalLink[]> {
    const links: InternalLink[] = [];

    if (context.category) {
        const category = NAVIGATION_CATEGORIES.find(c => c.slug === context.category);
        if (category) {
            for (const subcat of category.subcategories.slice(0, count)) {
                links.push({
                    text: subcat.name,
                    url: `/${category.slug}/${subcat.slug}`,
                    type: 'subcategory',
                    priority: 9,
                });
            }
        }
    }

    return links;
}

/**
 * Get related categories
 */
function getRelatedCategories(categorySlug: string): typeof NAVIGATION_CATEGORIES {
    // Return categories that are semantically related
    const relatedMap: Record<string, string[]> = {
        'credit-cards': ['loans', 'banking'],
        'loans': ['credit-cards', 'banking'],
        'banking': ['loans', 'investing'],
        'investing': ['banking', 'insurance'],
        'insurance': ['investing', 'banking'],
        'small-business': ['loans', 'banking'],
    };

    const related = relatedMap[categorySlug] || [];
    return NAVIGATION_CATEGORIES.filter(c => related.includes(c.slug));
}

/**
 * Map glossary category to navigation category
 */
export function mapGlossaryCategoryToNavCategory(glossaryCategory: string): string {
    const mapping: Record<string, string> = {
        'Investing': 'investing',
        'Loans': 'loans',
        'Banking': 'banking',
        'Insurance': 'insurance',
        'Taxation': 'investing',
        'General': 'investing',
    };
    return mapping[glossaryCategory] || 'investing';
}

