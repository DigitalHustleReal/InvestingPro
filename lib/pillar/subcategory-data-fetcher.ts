/**
 * Subcategory Page Data Fetcher
 * Fetches all data needed for subcategory pillar pages
 */

import { createClient } from '@/lib/supabase/server';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/navigation/categories';
import { logger } from '@/lib/logger';

export interface SubcategoryPageData {
    category: {
        name: string;
        slug: string;
        description: string;
    };
    subcategory: {
        name: string;
        slug: string;
        description: string;
        keywords: string[];
    };
    guide?: {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        author: {
            name: string;
            avatar_url?: string;
        };
    };
    products: Array<{
        id: string;
        name: string;
        slug: string;
        image_url?: string;
        rating?: number;
        features?: string[];
        affiliate_url?: string;
    }>;
    articles: Array<{
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        category: string;
        published_at: string;
        author: {
            name: string;
        };
    }>;
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    productComparison: {
        totalProducts: number;
        topProducts: Array<any>; // Using any for simplicity now, should be strict later
        comparisonPoints: string[];
    };
}

export async function fetchSubcategoryPageData(
    categorySlug: string,
    subcategorySlug: string
): Promise<SubcategoryPageData | null> {
    try {
        // Get category and subcategory metadata
        const category = getCategoryBySlug(categorySlug);
        const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);

        if (!category || !subcategory) {
            logger.warn('Category or subcategory not found', {
                categorySlug,
                subcategorySlug,
            });
            return null;
        }

        // Map category slug to DB value (plural to singular)
        const dbCategoryMap: Record<string, string> = {
            'credit-cards': 'credit_card',
            'loans': 'loan',
            'insurance': 'insurance', // insurance is weirdly same? Check seeds. Yes 'insurance'.
            'banking': 'banking',
            'investing': 'investing'
        };
        const dbCategory = dbCategoryMap[categorySlug] || categorySlug;

        // Fetch products for this subcategory
        const { data: productsData } = await supabase
            .from('products')
            .select(`
                id,
                name,
                slug,
                image_url,
                rating,
                features,
                provider_name,
                official_link,
                verification_status,
                verification_notes,
                affiliate_url
            `)
            .eq('category', dbCategory)
            .contains('tags', [subcategorySlug])
            .eq('status', 'active')
            .order('rating', { ascending: false })
            .limit(12);

        const products = productsData || [];

        // Construct Product Comparison Data
        const productComparison = {
            totalProducts: products.length,
            topProducts: products.slice(0, 3).map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                provider: p.provider_name || 'Partner',
                rating: p.rating || 4.5,
                features: p.features || [],
                verification_status: p.verification_status,
                verification_notes: p.verification_notes
            })),
            comparisonPoints: [
                'Interest Rates & Fees',
                'Eligibility Criteria',
                'Application Process',
                'Customer Reviews'
            ]
        };

        return {
            category: {
                name: category.name,
                slug: category.slug,
                description: category.description,
            },
            subcategory: {
                name: subcategory.name,
                slug: subcategory.slug,
                description: subcategory.description,
                keywords: subcategory.keywords,
            },
            guide: guideData ? {
                title: guideData.title,
                slug: guideData.slug,
                excerpt: guideData.excerpt || '',
                content: guideData.content || '',
                author: {
                    name: guideData.author?.name || 'InvestingPro Team',
                    avatar_url: guideData.author?.avatar_url,
                },
            } : undefined,
            products: products.map(p => ({
               ...p,
               features: p.features || []
            })),
            productComparison, // Add to return
            articles: articlesData?.map(article => ({
                ...article,
                author: {
                    name: article.author?.name || 'InvestingPro Team',
                },
            })) || [],
            faqs: faqsData || [],
        };
    } catch (error) {
        logger.error('Failed to fetch subcategory page data', error as Error, {
            categorySlug,
            subcategorySlug,
        });
        return null;
    }
}
