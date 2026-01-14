/**
 * Comprehensive API Validation Schemas
 * 
 * Zod schemas for all API endpoints
 * Provides type-safe request/response validation
 */

import { z } from 'zod';

// ============================================
// Common Schemas
// ============================================

export const uuidSchema = z.string().uuid();
export const slugSchema = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/);
export const emailSchema = z.string().email();
export const urlSchema = z.string().url();

// ============================================
// Article Schemas
// ============================================

export const articleCategorySchema = z.enum([
    'mutual-funds',
    'stocks',
    'insurance',
    'loans',
    'credit-cards',
    'tax-planning',
    'retirement',
    'investing-basics',
]);

export const articleStatusSchema = z.enum(['draft', 'published', 'archived']);

export const articleSubmissionStatusSchema = z.enum([
    'pending',
    'approved',
    'rejected',
    'revision-requested',
]);

export const createArticleSchema = z.object({
    title: z.string().min(10).max(200),
    slug: slugSchema.optional(),
    content: z.string().min(500),
    excerpt: z.string().max(500).optional(),
    category: articleCategorySchema,
    tags: z.array(z.string()).max(20).optional(),
    featured_image: urlSchema.optional(),
    meta_title: z.string().max(60).optional(),
    meta_description: z.string().max(160).optional(),
    author_name: z.string().max(100).optional(),
    author_email: emailSchema.optional(),
    language: z.enum(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu']).default('en').optional(),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
    id: uuidSchema.optional(),
    status: articleStatusSchema.optional(),
    submission_status: articleSubmissionStatusSchema.optional(),
});

export const articleQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    category: articleCategorySchema.optional(),
    status: articleStatusSchema.optional(),
    search: z.string().max(200).optional(),
    sort: z.enum(['newest', 'oldest', 'popular', 'views']).default('newest').optional(),
    author_id: uuidSchema.optional(),
});

export const articleParamsSchema = z.object({
    id: uuidSchema,
});

export const articleSlugParamsSchema = z.object({
    slug: slugSchema,
});

// ============================================
// Product Schemas
// ============================================

export const productTypeSchema = z.enum([
    'mutual-fund',
    'credit-card',
    'loan',
    'insurance',
    'stock-broker',
    'demat-account',
    'banking',
]);

export const createProductSchema = z.object({
    name: z.string().min(1).max(200),
    company: z.string().min(1).max(100),
    type: productTypeSchema,
    description: z.string().max(2000).optional(),
    affiliate_link: urlSchema,
    commission_rate: z.number().min(0).max(100).optional(),
    commission_type: z.enum(['percentage', 'fixed', 'cpa']).default('cpa').optional(),
    rating: z.number().min(0).max(5).optional(),
    features: z.array(z.string()).max(50).optional(),
    pricing: z.record(z.any()).optional(),
    image_url: urlSchema.optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
    id: uuidSchema.optional(),
    status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export const productQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    type: productTypeSchema.optional(),
    category: z.string().optional(),
    search: z.string().max(200).optional(),
    sort: z.enum(['rating', 'popular', 'newest', 'clicks']).default('rating').optional(),
    min_rating: z.coerce.number().min(0).max(5).optional(),
});

export const productParamsSchema = z.object({
    id: uuidSchema,
});

// ============================================
// Review Schemas
// ============================================

export const createReviewSchema = z.object({
    product_id: uuidSchema,
    user_name: z.string().min(1).max(100),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(200).optional(),
    review_text: z.string().min(10).max(2000),
    pros: z.array(z.string()).max(20).optional(),
    cons: z.array(z.string()).max(20).optional(),
    verified_purchase: z.boolean().default(false).optional(),
});

export const updateReviewSchema = z.object({
    id: uuidSchema,
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().max(200).optional(),
    review_text: z.string().min(10).max(2000).optional(),
    pros: z.array(z.string()).max(20).optional(),
    cons: z.array(z.string()).max(20).optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const reviewQuerySchema = z.object({
    product_id: uuidSchema.optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    min_rating: z.coerce.number().int().min(1).max(5).optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    sort: z.enum(['newest', 'oldest', 'rating', 'helpful']).default('newest').optional(),
});

export const reviewParamsSchema = z.object({
    id: uuidSchema,
});

// ============================================
// Portfolio Schemas
// ============================================

export const assetTypeSchema = z.enum(['mutual-fund', 'stock', 'etf', 'bond']);

export const assetCategorySchema = z.enum(['equity', 'debt', 'hybrid', 'gold', 'international']);

export const createPortfolioSchema = z.object({
    asset_type: assetTypeSchema,
    asset_name: z.string().min(1).max(200),
    asset_category: assetCategorySchema,
    quantity: z.number().positive(),
    purchase_price: z.number().min(0),
    current_price: z.number().min(0).optional(),
    purchase_date: z.string().date().optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial().extend({
    id: uuidSchema.optional(),
});

export const portfolioQuerySchema = z.object({
    asset_type: assetTypeSchema.optional(),
    asset_category: assetCategorySchema.optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

export const portfolioParamsSchema = z.object({
    id: uuidSchema,
});

// ============================================
// Workflow Schemas
// ============================================

export const workflowStatusSchema = z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']);

export const createWorkflowSchema = z.object({
    workflow_id: z.string().min(1).max(100),
    workflow_version: z.string().max(50).optional(),
    context: z.record(z.any()).optional(),
});

export const updateWorkflowSchema = z.object({
    id: uuidSchema,
    state: workflowStatusSchema.optional(),
    context: z.record(z.any()).optional(),
    error: z.string().max(1000).optional(),
});

export const workflowQuerySchema = z.object({
    workflow_id: z.string().optional(),
    state: workflowStatusSchema.optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    sort: z.enum(['newest', 'oldest', 'state']).default('newest').optional(),
});

export const workflowParamsSchema = z.object({
    id: uuidSchema,
});

// ============================================
// AI Generation Schemas
// ============================================

export const generateArticleSchema = z.object({
    topic: z.string().min(1).max(200),
    category: articleCategorySchema.optional(),
    target_keywords: z.array(z.string()).max(20).optional(),
    target_audience: z.string().max(100).optional(),
    content_length: z.enum(['short', 'medium', 'long']).optional(),
    word_count: z.number().int().min(500).max(5000).optional(),
    prompt: z.string().max(1000).optional(),
});

export const bulkGenerateSchema = z.object({
    total_articles: z.number().int().min(1).max(1000).default(10).optional(),
    batch_size: z.number().int().min(1).max(50).default(5).optional(),
    parallel_batches: z.number().int().min(1).max(5).default(2).optional(),
    quality_threshold: z.number().int().min(0).max(100).default(80).optional(),
    categories: z.array(articleCategorySchema).optional(),
    delay_between_batches: z.number().int().min(1000).max(60000).default(5000).optional(),
});

export const generateTitleSchema = z.object({
    original_title: z.string().min(1).max(200),
    primary_keyword: z.string().min(1).max(100),
    count: z.number().int().min(1).max(50).default(10).optional(),
    article_id: uuidSchema.optional(),
});

// ============================================
// Analytics Schemas
// ============================================

export const trackEventSchema = z.object({
    event: z.string().min(1).max(100),
    properties: z.record(z.any()).optional(),
    timestamp: z.string().datetime().optional(),
    user_id: uuidSchema.optional(),
    session_id: z.string().max(200).optional(),
});

export const affiliateClickSchema = z.object({
    product_id: uuidSchema,
    product_type: productTypeSchema.optional(),
    article_id: uuidSchema.optional(),
    user_ip: z.string().max(50).optional(),
    user_agent: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
});

// ============================================
// Search Schemas
// ============================================

export const searchQuerySchema = z.object({
    q: z.string().min(1).max(200),
    type: z.enum(['articles', 'products', 'all']).default('all').optional(),
    category: articleCategorySchema.or(productTypeSchema).optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    sort: z.enum(['relevance', 'newest', 'popular']).default('relevance').optional(),
});

// ============================================
// Newsletter Schemas
// ============================================

export const newsletterSubscribeSchema = z.object({
    email: emailSchema,
    name: z.string().max(100).optional(),
    interests: z.array(z.string()).max(10).optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly').optional(),
});

// ============================================
// Admin Schemas
// ============================================

export const adminSettingsSchema = z.object({
    key: z.string().min(1).max(100),
    value: z.any(),
    description: z.string().max(500).optional(),
});

export const adminAutomationConfigSchema = z.object({
    enabled: z.boolean().optional(),
    mode: z.enum(['fully-automated', 'semi-automated', 'manual']).optional(),
    goals: z.object({
        volume: z.number().int().min(1).max(100).optional(),
        quality: z.number().int().min(0).max(100).optional(),
        revenue: z.number().min(0).optional(),
        seo: z.boolean().optional(),
    }).optional(),
    constraints: z.record(z.any()).optional(),
});

// ============================================
// Export Type Helpers
// ============================================

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleQuery = z.infer<typeof articleQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
export type PortfolioQuery = z.infer<typeof portfolioQuerySchema>;
export type GenerateArticleInput = z.infer<typeof generateArticleSchema>;
export type BulkGenerateInput = z.infer<typeof bulkGenerateSchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
