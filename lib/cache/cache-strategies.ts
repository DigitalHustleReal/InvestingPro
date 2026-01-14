/**
 * Cache Strategies
 * 
 * Defines TTL strategies for different content types
 * Based on update frequency and importance
 */

export interface CacheStrategy {
    ttl: number; // Time to live in seconds
    tags: string[]; // Cache tags for invalidation
    staleWhileRevalidate?: number; // Optional: serve stale while revalidating
}

/**
 * Cache TTL strategies for different content types
 */
export const cacheStrategies = {
    // Articles: 5 minutes (frequently updated)
    article: {
        ttl: 5 * 60, // 5 minutes
        tags: ['articles'],
    } as CacheStrategy,

    // Article lists: 5 minutes
    articlesList: {
        ttl: 5 * 60, // 5 minutes
        tags: ['articles'],
    } as CacheStrategy,

    // Products: 10 minutes (less frequently updated)
    product: {
        ttl: 10 * 60, // 10 minutes
        tags: ['products'],
    } as CacheStrategy,

    // Product lists: 10 minutes
    productsList: {
        ttl: 10 * 60, // 10 minutes
        tags: ['products'],
    } as CacheStrategy,

    // SEO metadata: 1 hour (rarely changes)
    seoMetadata: {
        ttl: 60 * 60, // 1 hour
        tags: ['seo'],
    } as CacheStrategy,

    // Keyword research: 1 day (expensive to compute)
    keywordResearch: {
        ttl: 24 * 60 * 60, // 1 day
        tags: ['keywords'],
    } as CacheStrategy,

    // Search results: 5 minutes
    searchResults: {
        ttl: 5 * 60, // 5 minutes
        tags: ['search'],
    } as CacheStrategy,

    // Analytics: 1 minute (real-time data)
    analytics: {
        ttl: 60, // 1 minute
        tags: ['analytics'],
    } as CacheStrategy,

    // API responses: 5 minutes
    apiResponse: {
        ttl: 5 * 60, // 5 minutes
        tags: ['api'],
    } as CacheStrategy,

    // Workflow status: 30 seconds (frequently updated)
    workflowStatus: {
        ttl: 30, // 30 seconds
        tags: ['workflows'],
    } as CacheStrategy,

    // User data: 10 minutes
    userData: {
        ttl: 10 * 60, // 10 minutes
        tags: ['users'],
    } as CacheStrategy,
} as const;

/**
 * Get cache strategy for content type
 */
export function getCacheStrategy(type: keyof typeof cacheStrategies): CacheStrategy {
    return cacheStrategies[type];
}

/**
 * Generate cache key with namespace
 */
export function generateCacheKey(namespace: string, ...parts: (string | number)[]): string {
    const keyParts = parts
        .map(p => String(p).replace(/:/g, '_'))
        .filter(p => p.length > 0);
    return `${namespace}:${keyParts.join(':')}`;
}

/**
 * Cache key generators with strategies
 */
export const cacheKeyGenerators = {
    article: {
        byId: (id: string) => generateCacheKey('article', id),
        bySlug: (slug: string) => generateCacheKey('article', 'slug', slug),
        list: (query: string) => generateCacheKey('articles', 'list', query),
        category: (category: string, page: number) => 
            generateCacheKey('articles', 'category', category, page),
    },
    product: {
        byId: (type: string, id: string) => generateCacheKey('product', type, id),
        list: (type: string, query: string) => generateCacheKey('products', type, query),
        category: (type: string, category: string) => 
            generateCacheKey('products', type, 'category', category),
    },
    search: {
        query: (query: string, filters?: string) => 
            generateCacheKey('search', query, filters || ''),
    },
    seo: {
        metadata: (path: string) => generateCacheKey('seo', path),
        sitemap: () => generateCacheKey('seo', 'sitemap'),
    },
    keywords: {
        research: (query: string) => generateCacheKey('keywords', 'research', query),
        suggestions: (query: string) => generateCacheKey('keywords', 'suggestions', query),
    },
    analytics: {
        stats: (period: string) => generateCacheKey('analytics', 'stats', period),
        productStats: (productId: string) => generateCacheKey('analytics', 'product', productId),
    },
} as const;
