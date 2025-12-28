import { MetadataRoute } from 'next';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/static';
import { NAVIGATION_CATEGORIES } from '@/lib/navigation/categories';
import { NAVIGATION_CONFIG } from '@/lib/navigation/config';

/**
 * Automated Sitemap Generation
 * 
 * Generates sitemap with all pages and internal links
 * Includes: pillar pages, subcategory pages, Category → Intent → Collection routes, calculators, glossary, articles
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in';
    const sitemap: MetadataRoute.Sitemap = [];

    try {
        // Static pages
        sitemap.push({
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        });

        // Pillar pages (from NAVIGATION_CATEGORIES)
        for (const category of NAVIGATION_CATEGORIES) {
            sitemap.push({
                url: `${baseUrl}/${category.slug}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            });

            // Subcategory pages
            for (const subcategory of category.subcategories) {
                sitemap.push({
                    url: `${baseUrl}/${category.slug}/${subcategory.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            }
        }

        // Category → Intent → Collection routes (from NAVIGATION_CONFIG)
        for (const category of NAVIGATION_CONFIG) {
            // Category level (already added above, but ensure it's there)
            sitemap.push({
                url: `${baseUrl}/${category.slug}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            });

            // Intent level pages
            for (const intent of category.intents) {
                sitemap.push({
                    url: `${baseUrl}/${category.slug}/${intent.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.85,
                });

                // Collection level pages
                for (const collection of intent.collections) {
                    sitemap.push({
                        url: `${baseUrl}${collection.href}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    });
                }
            }
        }

        // Calculator pages
        const calculators = [
            'sip', 'emi', 'fd', 'tax', 'retirement', 'ppf', 'nps',
            'lumpsum', 'swp', 'goal-planning', 'inflation-adjusted-returns', 'gst'
        ];
        for (const calc of calculators) {
            sitemap.push({
                url: `${baseUrl}/calculators/${calc}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        }

        // Glossary index
        sitemap.push({
            url: `${baseUrl}/glossary`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });

        // Fetch dynamic content from Supabase
        const supabase = createClient();

        // Glossary terms
        try {
            const { data: glossaryTerms } = await supabase
                .from('glossary_terms')
                .select('slug, updated_at')
                .eq('status', 'published')
                .limit(1000);

            if (glossaryTerms) {
                for (const term of glossaryTerms) {
                    sitemap.push({
                        url: `${baseUrl}/glossary/${term.slug}`,
                        lastModified: term.updated_at ? new Date(term.updated_at) : new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.7,
                    });
                }
            }
        } catch (error) {
            logger.error('Error fetching glossary terms for sitemap', error as Error);
        }

        // Articles/Explainer pages
        try {
            const { data: articles } = await supabase
                .from('articles')
                .select('slug, published_date, updated_at')
                .eq('status', 'published')
                .limit(5000);

            if (articles) {
                for (const article of articles) {
                    sitemap.push({
                        url: `${baseUrl}/article/${article.slug}`,
                        lastModified: article.updated_at 
                            ? new Date(article.updated_at) 
                            : article.published_date 
                                ? new Date(article.published_date) 
                                : new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.7,
                    });
                }
            }
        } catch (error) {
            logger.error('Error fetching articles for sitemap', error as Error);
        }

        // Product pages (if products table exists)
        try {
            const { data: products } = await supabase
                .from('products')
                .select('slug, product_type, updated_at')
                .eq('is_active', true)
                .limit(10000);

            if (products) {
                for (const product of products) {
                    sitemap.push({
                        url: `${baseUrl}/${product.product_type}/${product.slug}`,
                        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    });
                }
            }
        } catch (error) {
            logger.error('Error fetching products for sitemap', error as Error);
        }

        // Static utility pages
        const staticPages = [
            { path: '/blog', priority: 0.8, frequency: 'weekly' as const },
            { path: '/compare', priority: 0.8, frequency: 'weekly' as const },
            { path: '/methodology', priority: 0.7, frequency: 'monthly' as const },
            { path: '/editorial-policy', priority: 0.7, frequency: 'monthly' as const },
            { path: '/disclaimer', priority: 0.6, frequency: 'monthly' as const },
            { path: '/privacy', priority: 0.6, frequency: 'monthly' as const },
            { path: '/terms', priority: 0.6, frequency: 'monthly' as const },
        ];

        for (const page of staticPages) {
            sitemap.push({
                url: `${baseUrl}${page.path}`,
                lastModified: new Date(),
                changeFrequency: page.frequency,
                priority: page.priority,
            });
        }

    } catch (error) {
        logger.error('Error generating sitemap', error as Error);
    }

    return sitemap;
}
