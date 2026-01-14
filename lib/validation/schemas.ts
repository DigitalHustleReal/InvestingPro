/**
 * Zod Validation Schemas
 * Request validation for API endpoints
 */

import { z } from 'zod';

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

/**
 * Article query schema
 */
export const articleQuerySchema = paginationSchema.extend({
    category: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    sort: z.enum(['newest', 'oldest', 'popular']).default('newest').optional(),
});

/**
 * Article create schema
 */
export const articleCreateSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    content: z.string().min(100),
    category: z.string(),
    excerpt: z.string().max(300).optional(),
    tags: z.array(z.string()).optional(),
    featured_image: z.string().url().optional(),
    meta_title: z.string().max(60).optional(),
    meta_description: z.string().max(160).optional(),
});

/**
 * Article update schema
 */
export const articleUpdateSchema = articleCreateSchema.partial();

/**
 * Product query schema
 */
export const productQuerySchema = paginationSchema.extend({
    category: z.string().optional(),
    type: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['rating', 'popular', 'newest']).default('rating').optional(),
});

/**
 * CMS orchestrator execute schema
 */
export const orchestratorExecuteSchema = z.object({
    mode: z.enum(['fully-automated', 'semi-automated', 'manual']).default('fully-automated').optional(),
    goals: z.object({
        volume: z.number().int().min(1).max(100).default(10).optional(),
        quality: z.number().int().min(0).max(100).default(80).optional(),
        revenue: z.number().default(0).optional(),
        seo: z.boolean().default(true).optional(),
    }).optional(),
    constraints: z.record(z.any()).optional(),
});

/**
 * Search query schema
 */
export const searchQuerySchema = paginationSchema.extend({
    q: z.string().min(1).max(200).optional(),
    type: z.enum(['search', 'related', 'trending', 'suggestions']).default('search').optional(),
    category: z.string().optional(),
    sortBy: z.enum(['relevance', 'newest', 'popular']).default('relevance').optional(),
    articleId: z.string().uuid().optional(),
});

/**
 * Analytics track schema
 */
export const analyticsTrackSchema = z.object({
    event: z.string().min(1).max(100),
    properties: z.record(z.any()).optional(),
    timestamp: z.string().datetime().optional(),
});

/**
 * Newsletter subscribe schema
 */
export const newsletterSubscribeSchema = z.object({
    email: z.string().email(),
    name: z.string().max(100).optional(),
    interests: z.array(z.string()).optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly').optional(),
});

/**
 * Bookmark schema
 */
export const bookmarkSchema = z.object({
    articleId: z.string().uuid(),
    notes: z.string().max(500).optional(),
    action: z.enum(['progress', 'add']).optional(),
    progress: z.number().min(0).max(100).optional(),
    readTime: z.number().int().min(0).optional(),
});

/**
 * Affiliate track schema
 */
export const affiliateTrackSchema = z.object({
    productName: z.string().min(1).max(200),
    productSlug: z.string().max(200).optional(),
    category: z.string().max(100).optional(),
    sourcePage: z.string().min(1).max(500),
    sourceComponent: z.string().max(100).optional(),
    affiliateLink: z.string().url().optional(),
    sessionId: z.string().uuid().optional(),
});

/**
 * Article generation schema
 */
export const articleGenerateSchema = z.object({
    topic: z.string().min(1).max(200),
    category: z.string().max(100).optional(),
    targetKeywords: z.array(z.string()).optional(),
    targetAudience: z.string().max(100).optional(),
    contentLength: z.enum(['short', 'medium', 'long']).optional(),
    wordCount: z.number().int().min(500).max(5000).optional(),
    prompt: z.string().max(1000).optional(),
});

/**
 * Bulk generation schema
 */
export const bulkGenerateSchema = z.object({
    totalArticles: z.number().int().min(1).max(1000).default(10).optional(),
    batchSize: z.number().int().min(1).max(50).default(5).optional(),
    parallelBatches: z.number().int().min(1).max(5).default(2).optional(),
    qualityThreshold: z.number().int().min(0).max(100).default(80).optional(),
    categories: z.array(z.string()).optional(),
    delayBetweenBatches: z.number().int().min(1000).max(60000).default(5000).optional(),
    parallel: z.boolean().default(true).optional(),
});

/**
 * Title generation schema
 */
export const titleGenerateSchema = z.object({
    original_title: z.string().min(1).max(200),
    primary_keyword: z.string().min(1).max(100),
    count: z.number().int().min(1).max(50).default(10).optional(),
    article_id: z.string().uuid().optional(),
});

/**
 * Social generation schema
 */
export const socialGenerateSchema = z.object({
    articleId: z.string().uuid(),
});

/**
 * Trends query schema
 */
export const trendsQuerySchema = z.object({
    category: z.enum(['markets', 'personal-finance', 'technology']).default('markets').optional(),
});

/**
 * Validation helper
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}

/**
 * Safe validation (returns error instead of throwing)
 */
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
