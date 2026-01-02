/**
 * Taxonomy Service
 * 
 * Automates content categorization and product cross-linking
 */

import { NAVIGATION_CATEGORIES, Category, Subcategory } from '@/lib/navigation/categories';

export interface TaxonomyMatch {
    categorySlug: string;
    subcategorySlug?: string;
    confidence: number;
}

export const TaxonomyService = {
    /**
     * Categorize text content (e.g., article title/excerpt)
     */
    categorizeContent(title: string, content: string = ''): TaxonomyMatch[] {
        const matches: Array<TaxonomyMatch & { score: number }> = [];
        const fullText = (title + ' ' + content).toLowerCase();

        for (const category of NAVIGATION_CATEGORIES) {
            let catScore = 0;
            
            // Check category keywords
            for (const keyword of category.keywords) {
                if (fullText.includes(keyword.toLowerCase())) {
                    catScore += 2; // Exact keyword match is weighted
                }
            }

            // Check subcategory keywords
            for (const sub of category.subcategories) {
                let subScore = 0;
                for (const keyword of sub.keywords) {
                    if (fullText.includes(keyword.toLowerCase())) {
                        subScore += 3; // Subcategory matches are more specific
                    }
                }

                if (subScore > 0) {
                    matches.push({
                        categorySlug: category.slug,
                        subcategorySlug: sub.slug,
                        score: catScore + subScore,
                        confidence: 0 // Will calculate below
                    });
                }
            }

            // Also allow matching just the category
            if (catScore > 0) {
                matches.push({
                    categorySlug: category.slug,
                    score: catScore,
                    confidence: 0
                });
            }
        }

        // Sort by score and normalize confidence
        const sorted = matches.sort((a, b) => b.score - a.score);
        if (sorted.length === 0) return [];

        const maxScore = sorted[0].score;
        return sorted.map(m => ({
            categorySlug: m.categorySlug,
            subcategorySlug: m.subcategorySlug,
            confidence: Math.round((m.score / maxScore) * 100)
        })).slice(0, 3); // Return top 3 suggested matches
    },

    /**
     * Map a product type to navigation slugs
     */
    mapProductToNavigation(productType: string): { category: string; subcategory?: string } {
        const mapping: Record<string, { category: string; subcategory?: string }> = {
            'credit_card': { category: 'credit-cards' },
            'mutual_fund': { category: 'investing', subcategory: 'mutual-funds' },
            'personal_loan': { category: 'loans', subcategory: 'personal' },
            'loan': { category: 'loans' },
            'fd': { category: 'banking', subcategory: 'fixed-deposits' },
            'insurance': { category: 'insurance' },
            'stock': { category: 'investing', subcategory: 'stocks' },
        };

        return mapping[productType] || { category: 'tools' };
    }
};
