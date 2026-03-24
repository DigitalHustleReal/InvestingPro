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

        // IFSC lookup tool
        sitemap.push({
            url: `${baseUrl}/ifsc`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        });

        // Newsletter landing page
        sitemap.push({
            url: `${baseUrl}/newsletter`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });

        // Free Tools Hub — Engineering as Marketing
        sitemap.push({
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        });

        // Gold Rate — hub + 50 city pages
        sitemap.push({
            url: `${baseUrl}/gold-rate`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.85,
        });
        const { GOLD_RATE_CITIES } = await import('@/lib/data/gold-rate');
        for (const city of GOLD_RATE_CITIES) {
            sitemap.push({
                url: `${baseUrl}/gold-rate/${city.slug}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            });
        }

        // Bank Holidays — hub + 25 state pages
        sitemap.push({
            url: `${baseUrl}/bank-holidays`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        });
        const { STATES } = await import('@/lib/data/bank-holidays');
        for (const state of STATES) {
            sitemap.push({
                url: `${baseUrl}/bank-holidays/${state.slug}`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.75,
            });
        }

        // RBI Rates Dashboard
        sitemap.push({
            url: `${baseUrl}/rbi-rates`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
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

        // Calculator pages — all 23 tools
        const calculators = [
            'sip', 'emi', 'fd', 'tax', 'retirement', 'ppf', 'nps',
            'lumpsum', 'swp', 'goal-planning', 'inflation-adjusted-returns', 'gst',
            'compound-interest', 'simple-interest', 'rd', 'mis', 'kvp', 'nsc',
            'scss', 'ssy', 'portfolio-rebalancing', 'home-loan-vs-sip',
            'financial-health-score',
        ];
        // Calculators hub page
        sitemap.push({
            url: `${baseUrl}/calculators`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        });
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

        // Fetch dynamic content from Supabase (using static client for sitemap generation)
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
                        url: `${baseUrl}/articles/${article.slug}`,
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

        // Versus Comparison Pages (Programmatic SEO)
        try {
            const { data: versusPages } = await supabase
                .from('versus_pages')
                .select('slug, updated_at')
                .limit(10000);

            if (versusPages) {
                for (const page of versusPages) {
                    sitemap.push({
                        url: `${baseUrl}/compare/${page.slug}`,
                        lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.8,
                    });
                }
            }
        } catch (error) {
            logger.error('Error fetching versus pages for sitemap', error as Error);
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
            { path: '/pricing', priority: 0.8, frequency: 'monthly' as const },
            { path: '/guides', priority: 0.8, frequency: 'weekly' as const },
            { path: '/glossary', priority: 0.8, frequency: 'weekly' as const },
            { path: '/about', priority: 0.7, frequency: 'monthly' as const },
            { path: '/methodology', priority: 0.7, frequency: 'monthly' as const },
            { path: '/editorial-policy', priority: 0.7, frequency: 'monthly' as const },
            { path: '/how-we-make-money', priority: 0.7, frequency: 'monthly' as const },
            { path: '/contact-us', priority: 0.6, frequency: 'monthly' as const },
            { path: '/disclaimer', priority: 0.6, frequency: 'monthly' as const },
            { path: '/privacy-policy', priority: 0.6, frequency: 'monthly' as const },
            { path: '/terms-of-service', priority: 0.6, frequency: 'monthly' as const },
            { path: '/affiliate-disclosure', priority: 0.6, frequency: 'monthly' as const },
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
