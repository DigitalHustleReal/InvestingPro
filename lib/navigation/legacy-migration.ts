/**
 * Legacy Subcategory to Intent-Based Route Migration
 * 
 * Maps old flat subcategory routes to new Category → Intent → Collection structure
 */

import { NAVIGATION_CATEGORIES } from './categories';
import { NAVIGATION_CONFIG, EDITORIAL_INTENTS } from './config';

/**
 * Map legacy subcategory route to new intent-based route
 * Returns the new route path or null if no mapping exists
 */
export function mapLegacySubcategoryRoute(
    categorySlug: string,
    subcategorySlug: string
): string | null {
    // Find the category in NAVIGATION_CONFIG
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === categorySlug);
    if (!category) {
        return null;
    }

    // Find the "Best" intent (most common mapping for subcategories)
    const bestIntent = category.intents.find(int => int.slug === EDITORIAL_INTENTS.BEST);
    if (!bestIntent) {
        return null;
    }

    // Try to find a collection that matches the subcategory slug
    const matchingCollection = bestIntent.collections.find(col => {
        const hrefSegments = col.href.split('/').filter(Boolean);
        return hrefSegments[hrefSegments.length - 1] === subcategorySlug;
    });

    if (matchingCollection) {
        return matchingCollection.href;
    }

    // Fallback: map to the intent page
    return `/${categorySlug}/${EDITORIAL_INTENTS.BEST}`;
}

/**
 * Get all legacy subcategory routes that need redirects
 */
export function getLegacySubcategoryRedirects(): Array<{
    source: string;
    destination: string;
    permanent: boolean;
}> {
    const redirects: Array<{
        source: string;
        destination: string;
        permanent: boolean;
    }> = [];

    for (const category of NAVIGATION_CATEGORIES) {
        for (const subcategory of category.subcategories) {
            const newRoute = mapLegacySubcategoryRoute(category.slug, subcategory.slug);
            if (newRoute) {
                redirects.push({
                    source: `/${category.slug}/${subcategory.slug}`,
                    destination: newRoute,
                    permanent: true, // 301 redirect for SEO
                });
            }
        }
    }

    return redirects;
}

