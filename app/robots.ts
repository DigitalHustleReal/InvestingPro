import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 *
 * AI Crawler Strategy:
 * - ALLOW: AI search/answer tools (ChatGPT-User, PerplexityBot, Googlebot-Extended-Search)
 *   → These cite sources in responses = brand visibility + referral traffic
 * - BLOCK: AI training crawlers (GPTBot, Google-Extended, Bytespider, CCBot)
 *   → These scrape content to train models without attribution or traffic return
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in';

    return {
        rules: [
            // Default: all crawlers allowed on public pages
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/private/',
                    '/preview/',
                    '/embed/',
                    '/component-showcase/',
                ],
            },
            // Googlebot — full access to public content
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/'],
            },
            // --- AI SEARCH TOOLS (ALLOW — cite us in answers) ---
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
            },
            // --- AI TRAINING CRAWLERS (BLOCK — protect content value) ---
            {
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'Google-Extended',
                disallow: ['/'],
            },
            {
                userAgent: 'Bytespider',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            },
            {
                userAgent: 'anthropic-ai',
                disallow: ['/'],
            },
            {
                userAgent: 'ClaudeBot',
                disallow: ['/'],
            },
            {
                userAgent: 'omgili',
                disallow: ['/'],
            },
            {
                userAgent: 'FacebookBot',
                disallow: ['/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
