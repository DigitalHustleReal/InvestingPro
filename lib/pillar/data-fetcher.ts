/**
 * Data Fetcher for Pillar and Subcategory Pages
 * 
 * Fetches all required data from Supabase for dynamic page generation
 */

import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { Category, Subcategory } from '@/lib/navigation/categories';

export interface PillarPageData {
    category: Category;
    whatItIs: string; // AI-generated or from database
    whoItIsFor: string; // AI-generated or from database
    productComparison: {
        totalProducts: number;
        topProducts: any[]; // Top 6 products
        comparisonPoints: string[]; // Key comparison points
    };
    relatedCalculators: Array<{
        name: string;
        slug: string;
        description: string;
    }>;
    latestGuides: Array<{
        title: string;
        slug: string;
        excerpt?: string;
        published_date?: string;
    }>;
    glossaryHighlights: Array<{
        term: string;
        slug: string;
        definition: string;
    }>;
}

export interface SubcategoryPageData {
    category: Category;
    subcategory: Subcategory;
    whatItIs: string;
    whoItIsFor: string;
    productComparison: {
        totalProducts: number;
        topProducts: any[];
        comparisonPoints: string[];
    };
    relatedCalculators: Array<{
        name: string;
        slug: string;
    }>;
    relatedGlossary: Array<{
        term: string;
        slug: string;
    }>;
}

/**
 * Fetch data for pillar page
 */
export async function fetchPillarPageData(categorySlug: string): Promise<PillarPageData | null> {
    try {
        // Get category config
        const { getCategoryBySlug } = await import('@/lib/navigation/categories');
        const category = getCategoryBySlug(categorySlug);
        
        if (!category) {
            logger.warn('Category not found', { categorySlug });
            return null;
        }

        // Fetch products for this category
        const productType = mapCategoryToProductType(categorySlug);
        const products = await fetchProductsForCategory(productType);
        
        // Fetch related calculators
        const calculators = await fetchRelatedCalculators(categorySlug);
        
        // Fetch latest guides/articles
        const guides = await fetchLatestGuides(categorySlug);
        
        // Fetch glossary highlights
        const glossary = await fetchGlossaryHighlights(categorySlug);

        // Generate "What it is" and "Who it's for" (can be AI-generated or from DB)
        const whatItIs = await generateWhatItIs(category);
        const whoItIsFor = await generateWhoItIsFor(category);

        return {
            category,
            whatItIs,
            whoItIsFor,
            productComparison: {
                totalProducts: products.length,
                topProducts: products.slice(0, 6),
                comparisonPoints: extractComparisonPoints(products),
            },
            relatedCalculators: calculators,
            latestGuides: guides,
            glossaryHighlights: glossary,
        };

    } catch (error) {
        logger.error('Error fetching pillar page data', error as Error, { categorySlug });
        return null;
    }
}

/**
 * Fetch data for subcategory page
 */
export async function fetchSubcategoryPageData(
    categorySlug: string,
    subcategorySlug: string
): Promise<SubcategoryPageData | null> {
    try {
        const { getCategoryBySlug, getSubcategoryBySlug } = await import('@/lib/navigation/categories');
        const category = getCategoryBySlug(categorySlug);
        const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
        
        if (!category || !subcategory) {
            logger.warn('Category or subcategory not found', { categorySlug, subcategorySlug });
            return null;
        }

        // Fetch products for this subcategory
        const productType = mapCategoryToProductType(categorySlug);
        const products = await fetchProductsForSubcategory(productType, subcategorySlug);
        
        // Fetch related calculators
        const calculators = await fetchRelatedCalculators(categorySlug, subcategorySlug);
        
        // Fetch related glossary terms
        const glossary = await fetchGlossaryForSubcategory(categorySlug, subcategorySlug);

        // Generate content
        const whatItIs = await generateWhatItIs(category, subcategory);
        const whoItIsFor = await generateWhoItIsFor(category, subcategory);

        return {
            category,
            subcategory,
            whatItIs,
            whoItIsFor,
            productComparison: {
                totalProducts: products.length,
                topProducts: products.slice(0, 6),
                comparisonPoints: extractComparisonPoints(products),
            },
            relatedCalculators: calculators,
            relatedGlossary: glossary,
        };

    } catch (error) {
        logger.error('Error fetching subcategory page data', error as Error, { categorySlug, subcategorySlug });
        return null;
    }
}

/**
 * Map category slug to product type
 */
function mapCategoryToProductType(categorySlug: string): string {
    const mapping: Record<string, string> = {
        'credit-cards': 'credit_card',
        'loans': 'personal_loan',
        'banking': 'fd',
        'investing': 'mutual_fund',
        'insurance': 'insurance',
        'small-business': 'business_loan',
    };
    return mapping[categorySlug] || 'product';
}

/**
 * Fetch products for category
 */
async function fetchProductsForCategory(productType: string): Promise<any[]> {
    try {
        // Use static client for static generation (no cookies)
        const { createClient } = await import('@/lib/supabase/static');
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('product_type', productType)
            .eq('is_active', true)
            .limit(20);
        
        if (error || !data) return [];
        return data;
    } catch (error) {
        logger.error('Error fetching products', error as Error);
        return [];
    }
}

/**
 * Fetch products for subcategory
 */
async function fetchProductsForSubcategory(productType: string, subcategorySlug: string): Promise<any[]> {
    try {
        // Use static client for static generation (no cookies)
        const { createClient } = await import('@/lib/supabase/static');
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('product_type', productType)
            .eq('is_active', true)
            .limit(20);
        
        if (error || !data) return [];
        
        // Filter by subcategory if metadata contains it
        return data.filter((p: any) => {
            const metadata = p.metadata || {};
            return metadata.subcategory === subcategorySlug || 
                   metadata.tags?.includes(subcategorySlug);
        });
    } catch (error) {
        logger.error('Error fetching subcategory products', error as Error);
        return [];
    }
}

/**
 * Fetch related calculators
 */
async function fetchRelatedCalculators(categorySlug: string, subcategorySlug?: string): Promise<Array<{name: string; slug: string; description: string}>> {
    const calculatorMap: Record<string, string[]> = {
        'credit-cards': ['emi', 'tax'],
        'loans': ['emi', 'tax'],
        'banking': ['fd', 'tax'],
        'investing': ['sip', 'lumpsum', 'tax', 'retirement'],
        'insurance': ['tax'],
        'small-business': ['emi', 'tax'],
    };

    const calculatorSlugs = calculatorMap[categorySlug] || [];
    
    return calculatorSlugs.map(slug => ({
        name: slug.charAt(0).toUpperCase() + slug.slice(1) + ' Calculator',
        slug,
        description: `Calculate ${slug} for ${categorySlug}`,
    }));
}

/**
 * Fetch latest guides/articles
 */
async function fetchLatestGuides(categorySlug: string): Promise<Array<{title: string; slug: string; excerpt?: string; published_date?: string}>> {
    try {
        const articles = await api.entities.Article.filter({
            category: categorySlug,
            status: 'published',
        });
        
        return articles
            .slice(0, 6)
            .map((article: any) => ({
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                published_date: article.published_date || article.created_at,
            }));
    } catch (error) {
        logger.error('Error fetching guides', error as Error);
        return [];
    }
}

/**
 * Fetch glossary highlights
 */
async function fetchGlossaryHighlights(categorySlug: string): Promise<Array<{term: string; slug: string; definition: string}>> {
    try {
        const terms = await api.entities.Glossary.getByCategory(categorySlug);
        
        return terms
            .slice(0, 6)
            .map((term: any) => ({
                term: term.term,
                slug: term.slug,
                definition: term.definition?.substring(0, 100) || '',
            }));
    } catch (error) {
        logger.error('Error fetching glossary', error as Error);
        return [];
    }
}

/**
 * Fetch glossary for subcategory
 */
async function fetchGlossaryForSubcategory(categorySlug: string, subcategorySlug: string): Promise<Array<{term: string; slug: string}>> {
    try {
        const terms = await api.entities.Glossary.getByCategory(categorySlug);
        
        // Filter by subcategory if term metadata contains it
        return terms
            .filter((term: any) => {
                // Could filter by term metadata or related terms
                return true; // For now, return all category terms
            })
            .slice(0, 5)
            .map((term: any) => ({
                term: term.term,
                slug: term.slug,
            }));
    } catch (error) {
        logger.error('Error fetching subcategory glossary', error as Error);
        return [];
    }
}

/**
 * Generate "What it is" content
 */
async function generateWhatItIs(category: Category, subcategory?: Subcategory): Promise<string> {
    // This could be AI-generated or fetched from database
    // For now, return a template-based description
    if (subcategory) {
        return `${subcategory.name} are financial products that ${subcategory.description.toLowerCase()}. This subcategory falls under ${category.name} and offers various options for Indian consumers.`;
    }
    return `${category.name} are financial products that ${category.description.toLowerCase()}. These products help Indian consumers manage their finances, save money, and achieve their financial goals.`;
}

/**
 * Generate "Who it's for" content
 */
async function generateWhoItIsFor(category: Category, subcategory?: Subcategory): Promise<string> {
    // This could be AI-generated or fetched from database
    if (subcategory) {
        return `${subcategory.name} are ideal for individuals who ${subcategory.description.toLowerCase()}. These products are suitable for various financial needs and goals.`;
    }
    return `${category.name} are suitable for individuals looking to ${category.description.toLowerCase()}. These products cater to different financial needs, from saving and investing to borrowing and protection.`;
}

/**
 * Extract comparison points from products
 */
function extractComparisonPoints(products: any[]): string[] {
    if (products.length === 0) return [];
    
    // Extract common comparison points based on product type
    const points = new Set<string>();
    
    // Common points for all products
    points.add('Interest rates and fees');
    points.add('Eligibility criteria');
    points.add('Features and benefits');
    
    // Type-specific points
    if (products[0]?.product_type === 'credit_card') {
        points.add('Rewards and cashback');
        points.add('Annual fees');
    } else if (products[0]?.product_type === 'mutual_fund') {
        points.add('Returns and performance');
        points.add('Expense ratios');
    } else if (products[0]?.product_type === 'personal_loan') {
        points.add('Interest rates');
        points.add('Processing fees');
    }
    
    return Array.from(points).slice(0, 5);
}

