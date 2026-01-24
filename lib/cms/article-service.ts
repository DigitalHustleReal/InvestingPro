/**
 * Canonical Article Service - WordPress-style guarantees
 * 
 * SINGLE SOURCE OF TRUTH for all article operations.
 * All article creation, updates, and queries go through this service.
 * 
 * NOTE: This service uses server-only APIs (workflows, Supabase server client)
 * For client-side usage, use API routes that call this service
 */
import 'server-only'; // Mark as server-only module

import { createClient } from '@/lib/supabase/client';

// Removed global getSupabaseClient
import { normalizeArticleBody } from '@/lib/content/normalize';
import { htmlToMarkdown } from '@/lib/editor/markdown';
import { logger } from '@/lib/logger';
import { TaxonomyService } from './taxonomy-service';
import { injectAffiliateDisclosure } from '@/lib/compliance/affiliate-disclosure';
// Lazy import workflow hooks to avoid server/client boundary issues
// These are only used in specific methods, not at module level
import { invalidateArticleCache } from '@/lib/cache/cache-invalidation';
import { cacheService } from '@/lib/cache/cache-service';
import { cacheKeyGenerators, cacheStrategies } from '@/lib/cache/cache-strategies';

/**
 * Article Status Lifecycle (WordPress-style)
 * 
 * DRAFT → REVIEW (optional) → PUBLISHED → ARCHIVED
 * 
 * Rules:
 * - status is the ONLY lifecycle field
 * - Preview reads from the same article record
 * - No duplicated tables or temp states
 */
export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived';

/**
 * Article Content Contract
 * 
 * SINGLE SOURCE OF TRUTH:
 * - body_html: Normalized HTML (DERIVED from body_markdown)
 * - body_markdown: Markdown source (PRIMARY)
 * - content: Legacy fallback (deprecated)
 */
export interface ArticleContent {
    body_markdown: string;  // PRIMARY source of truth
    body_html: string;      // DERIVED - always generated from markdown
    content?: string;       // Legacy fallback
}

/**
 * Article Metadata
 */
export interface ArticleMetadata {
    title: string;
    slug: string;           // UNIQUE, NOT NULL, stable after first save
    excerpt?: string;
    category: string;
    tags?: string[];
    status?: ArticleStatus; // Optional status change request
    seo_title?: string;
    seo_description?: string;
    featured_image?: string;
    read_time?: number;
    language?: string;
    ai_generated?: boolean;
    ai_metadata?: any;
    structured_content?: any;
    // Review queue fields for creation/update
    is_user_submission?: boolean;
    submission_status?: 'pending' | 'approved' | 'rejected' | 'revision-requested';
}

/**
 * Full Article Data
 */
export interface ArticleData extends ArticleContent, ArticleMetadata {
    id?: string;
    status: ArticleStatus;
    published_at?: string;  // ISO timestamp - set ONLY on publish
    published_date?: string; // Date string (YYYY-MM-DD) - set ONLY on publish
    ai_generated?: boolean;
    author_id?: string;
    author_name?: string;
    author_avatar?: string;
    author_role?: string;
    views?: number;
    created_at?: string;
    updated_at?: string;
    // Review queue fields
    is_user_submission?: boolean;
    submission_status?: 'pending' | 'approved' | 'rejected' | 'revision-requested';
    rejection_reason?: string;
    // Pro Editorial Fields
    quality_score?: number;
    editorial_notes?: any;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    verified_by_expert?: boolean;
}

/**
 * Save Result
 */
export interface SaveResult {
    id: string;
    slug: string;
    status: ArticleStatus;
    title?: string;
}

/**
 * Canonical Article Service
 * 
 * WordPress-style guarantees:
 * - Atomic operations
 * - Slug always resolves after publish
 * - Single source of truth
 */
export class ArticleService {
    private static instance: ArticleService;
    
    private customClient: any = null;

    private constructor() {}
    
    static getInstance(): ArticleService {
        if (!ArticleService.instance) {
            ArticleService.instance = new ArticleService();
        }
        return ArticleService.instance;
    }

    /**
     * Create a new instance (for isolated use, e.g. Automation)
     */
    static create(client?: any): ArticleService {
        const service = new ArticleService();
        if (client) {
            service.setClient(client);
        }
        return service;
    }

    /**
     * Set a custom Supabase client (e.g., service role client)
     */
    setClient(client: any) {
        this.customClient = client;
        return this;
    }

    private getClient() {
        return this.customClient || createClient();
    }

    /**
     * Get article by ID (for editing/preview)
     * Works for ANY status
     * Cached for 5 minutes
     */
    async getById(id: string): Promise<ArticleData | null> {
        const cacheKey = cacheKeyGenerators.article.byId(id);
        const strategy = cacheStrategies.article;

        // Try cache first
        const cached = await cacheService.get<ArticleData>(cacheKey, 'article');
        if (cached) {
            return cached;
        }

        // Fetch from database
        const supabase = this.getClient();
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            logger.error('Failed to fetch article by ID', error);
            return null;
        }

        const article = this.normalizeArticle(data);
        
        // Cache the result
        if (article) {
            await cacheService.set(cacheKey, article, {
                ttl: strategy.ttl,
                tags: [...strategy.tags, cacheKeyGenerators.article.byId(id)],
            });
        }

        return article;
    }

    /**
     * Get article by slug (for public routes)
     * ONLY returns published articles
     * Cached for 5 minutes
     */
    async getBySlug(slug: string, previewToken?: string): Promise<ArticleData | null> {
        // Don't cache preview mode
        if (previewToken) {
            const supabase = this.getClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return null; // Preview requires auth
            }
            
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                logger.error('Failed to fetch article by slug', error);
                return null;
            }

            return this.normalizeArticle(data);
        }

        // Cache public articles
        const cacheKey = cacheKeyGenerators.article.bySlug(slug);
        const strategy = cacheStrategies.article;

        // Try cache first
        const cached = await cacheService.get<ArticleData>(cacheKey, 'article');
        if (cached) {
            return cached;
        }

        // Fetch from database
        const supabase = this.getClient();
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .not('published_at', 'is', null)
            .single();

        if (error) {
            logger.error('Failed to fetch article by slug', error);
            return null;
        }

        const article = this.normalizeArticle(data);
        
        // Cache the result
        if (article) {
            await cacheService.set(cacheKey, article, {
                ttl: strategy.ttl,
                tags: [...strategy.tags, cacheKeyGenerators.article.bySlug(slug)],
            });
        }

        return article;
    }

    /**
     * Save article (does NOT change status)
     * 
     * Atomic operation:
     * - Normalizes content
     * - Updates article
     * - Returns updated article
     */
    async saveArticle(
        id: string,
        content: ArticleContent,
        metadata: Partial<ArticleMetadata>
    ): Promise<SaveResult> {
        const supabase = this.getClient();

        // Normalize content (single source of truth)
        let normalizedHTML = content.body_html 
            ? normalizeArticleBody(content.body_html)
            : content.body_markdown 
                ? normalizeArticleBody(content.body_markdown)
                : content.content 
                    ? normalizeArticleBody(content.content)
                    : '';

        // Auto-inject affiliate disclosure if affiliate links detected
        try {
            const markdownBeforeDisclosure = normalizedHTML ? htmlToMarkdown(normalizedHTML) : (content.body_markdown || content.content || '');
            const markdownWithDisclosure = injectAffiliateDisclosure(markdownBeforeDisclosure, metadata.category);
            
            // If disclosure was injected, update HTML
            if (markdownWithDisclosure !== markdownBeforeDisclosure) {
                // Re-normalize HTML with disclosure
                const htmlWithDisclosure = markdownWithDisclosure ? normalizeArticleBody(markdownWithDisclosure) : normalizedHTML;
                normalizedHTML = htmlWithDisclosure;
                logger.info('Affiliate disclosure injected during save', { articleId: id, category: metadata.category });
            }
        } catch (disclosureError) {
            // Don't fail save if disclosure injection fails
            logger.warn('Failed to inject affiliate disclosure', disclosureError instanceof Error ? disclosureError : new Error(String(disclosureError)), { articleId: id });
        }

        const normalizedMarkdown = normalizedHTML ? htmlToMarkdown(normalizedHTML) : '';

        // Get existing article to preserve status
        const existing = await this.getById(id);
        if (!existing) {
            throw new Error('Article not found');
        }

        const previousStatus = existing.status;

        // Update article (preserve status)
        const updateData: any = {
            ...metadata,
            body_html: normalizedHTML,
            body_markdown: normalizedMarkdown,
            content: normalizedMarkdown || normalizedHTML || '', // Legacy
            updated_at: new Date().toISOString(),
            // DO NOT change status in save
            status: existing.status,
        };

        const { data, error } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            logger.error('Failed to save article', error);
            throw new Error(error.message || 'Failed to save article');
        }

        // Trigger state transition if status changed
        if (metadata.status && metadata.status !== previousStatus) {
            try {
                // Lazy import to avoid server/client boundary issues
                const { transitionArticleState } = await import('@/lib/workflows/hooks/article-workflow-hooks');
                await transitionArticleState(
                    id,
                    previousStatus,
                    metadata.status,
                    'update',
                    existing.author_id || undefined
                );
                logger.info('Article state transition triggered', { 
                    articleId: id, 
                    from: previousStatus, 
                    to: metadata.status 
                });
            } catch (workflowError) {
                // Don't fail save if workflow fails
                // Also catch server-only import errors gracefully
                if (workflowError instanceof Error && workflowError.message.includes('server-only')) {
                    logger.debug('State transition skipped (client context)');
                } else {
                    logger.error('Failed to trigger state transition', workflowError instanceof Error ? workflowError : new Error(String(workflowError)), { articleId: id });
                }
            }
        }

        // Create version snapshot (if content actually changed)
        // Note: Database trigger also creates versions, but we do it explicitly for control
        try {
            const { createArticleVersion } = await import('@/lib/cms/version-service');
            await createArticleVersion(id, 'Article updated');
        } catch (versionError) {
            // Don't fail save if versioning fails
            logger.warn('Failed to create article version', versionError instanceof Error ? versionError : new Error(String(versionError)), { articleId: id });
        }

        // Invalidate cache
        await invalidateArticleCache(id);

        return {
            id: data.id,
            slug: data.slug,
            status: data.status as ArticleStatus,
        };
    }

    /**
     * Publish article (atomic operation)
     * 
     * Rules:
     * - Sets status to 'published'
     * - Sets published_at to now()
     * - Sets published_date to today()
     * - Returns { id, slug } for routing
     */
    async publishArticle(
        id: string,
        content: ArticleContent,
        metadata: Partial<ArticleMetadata>
    ): Promise<SaveResult> {
        const supabase = this.getClient();

        // Normalize content
        const normalizedHTML = content.body_html 
            ? normalizeArticleBody(content.body_html)
            : content.body_markdown 
                ? normalizeArticleBody(content.body_markdown)
                : content.content 
                    ? normalizeArticleBody(content.content)
                    : '';

        const normalizedMarkdown = normalizedHTML ? htmlToMarkdown(normalizedHTML) : '';

        // Ensure slug exists and is valid
        if (!metadata.slug) {
            const existing = await this.getById(id);
            if (!existing || !existing.slug) {
                throw new Error('Article slug is required for publishing');
            }
            metadata.slug = existing.slug;
        }

        const now = new Date().toISOString();
        const today = now.split('T')[0];

        // Atomic publish operation
        const updateData: any = {
            ...metadata,
            body_html: normalizedHTML,
            body_markdown: normalizedMarkdown,
            content: normalizedMarkdown || normalizedHTML || '',
            status: 'published',
            published_at: now,      // CRITICAL: Set on publish
            published_date: today,  // CRITICAL: Set on publish
            updated_at: now,
        };

        const { data, error } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            logger.error('Failed to publish article', error);
            throw new Error(error.message || 'Failed to publish article');
        }

        // Create version snapshot on publish
        try {
            const { createArticleVersion } = await import('@/lib/cms/version-service');
            await createArticleVersion(id, 'Article published');
        } catch (versionError) {
            // Don't fail publish if versioning fails
            logger.warn('Failed to create article version on publish', versionError instanceof Error ? versionError : new Error(String(versionError)), { articleId: id });
        }

        // Auto-interlink article after publish (async, don't block)
        try {
            const { autoInterlinkArticle } = await import('@/lib/automation/auto-interlinking');
            autoInterlinkArticle(id, { maxLinks: 5, minRelevance: 0.3 }).catch(err => {
                logger.warn('Auto-interlinking failed after publish', err as Error, { articleId: id });
            });
        } catch (interlinkError) {
            // Don't fail publish if interlinking fails
            logger.warn('Auto-interlinking setup failed', interlinkError instanceof Error ? interlinkError : new Error(String(interlinkError)), { articleId: id });
        }

        // Invalidate cache
        await invalidateArticleCache(id);

        return {
            id: data.id,
            slug: data.slug,
            status: 'published' as ArticleStatus,
        };
    }

    /**
     * Create article
     * 
     * Always creates as 'draft'
     * Generates slug from title
     */
    async createArticle(
        content: ArticleContent,
        metadata: ArticleMetadata
    ): Promise<SaveResult> {
        const supabase = this.getClient();

        // Normalize content
        const normalizedHTML = content.body_html 
            ? normalizeArticleBody(content.body_html)
            : content.body_markdown 
                ? normalizeArticleBody(content.body_markdown)
                : content.content 
                    ? normalizeArticleBody(content.content)
                    : '';

        const normalizedMarkdown = normalizedHTML ? htmlToMarkdown(normalizedHTML) : '';

        // Generate slug if not provided
        let slug = metadata.slug || this.generateSlug(metadata.title);
        
        // Get current user for author
        const { data: { user } } = await supabase.auth.getUser();

        const articleData: any = {
            title: metadata.title,
            slug: slug,
            excerpt: metadata.excerpt || '',
            body_html: normalizedHTML,
            body_markdown: normalizedMarkdown,
            content: normalizedMarkdown || normalizedHTML || '',
            category: metadata.category || 'investing-basics',
            status: 'draft', // Always create as draft
            language: metadata.language || 'en',
            tags: metadata.tags || [],
            seo_title: metadata.seo_title || metadata.title,
            seo_description: metadata.seo_description || metadata.excerpt,
            read_time: metadata.read_time,
            featured_image: metadata.featured_image,
            author_id: user?.id || null,
            author_name: user?.user_metadata?.full_name || 'Admin',
            ai_generated: false, // Set explicitly for manual creation
        };

        // Try insert with retry for slug conflicts
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            const { data, error } = await supabase
                .from('articles')
                .insert([articleData])
                .select()
                .single();

            if (!error) {
                return {
                    id: data.id,
                    slug: data.slug,
                    status: data.status as ArticleStatus,
                    title: data.title,
                };
            }

            // Handle duplicate slug
            if (error.code === '23505' || error.message?.includes('duplicate key')) {
                if (attempts < maxAttempts - 1) {
                    const suffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
                    slug = `${this.generateSlug(metadata.title)}-${suffix}`;
                    articleData.slug = slug;
                    attempts++;
                    continue;
                }
            }

            logger.error('Failed to create article', error);
            throw new Error(error.message || 'Failed to create article');
        }

        throw new Error('Failed to create article after retries');
    }

    /**
     * List articles (for admin dashboard)
     * Returns ALL statuses
     */
    async listArticles(limit?: number): Promise<ArticleData[]> {
        const cacheKey = cacheKeyGenerators.article.list(`limit:${limit || 'all'}`);
        const strategy = cacheStrategies.articlesList;

        // Try cache first
        const cached = await cacheService.get<ArticleData[]>(cacheKey, 'articles');
        if (cached) {
            return cached;
        }

        const supabase = this.getClient();
        
        // First, try direct query (works for authenticated/admin users)
        let query = supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        let articles: ArticleData[] = [];

        if (error) {
            console.error('[ArticleService] Direct query error:', error.message);
            logger.error('Failed to list articles', error);
        } else if (data && data.length > 0) {
            console.log(`[ArticleService] Direct query returned ${data.length} articles`);
            articles = data.map((article: any) => this.normalizeArticle(article));
        } else {
            // FALLBACK: Use SECURITY DEFINER RPC to bypass RLS for public users
            const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_articles', { 
                result_limit: limit || 100 
            });
            
            if (!rpcError && rpcData) {
                // Handle SETOF json response - data is already an array of objects
                const rpcArticles = Array.isArray(rpcData) ? rpcData : [rpcData];
                if (rpcArticles.length > 0) {
                    articles = rpcArticles.map((item: any) => this.normalizeArticle(item));
                }
            } else if (rpcError) {
                logger.error('get_public_articles RPC failed', rpcError);
                
                // Secondary fallback: try list_published_articles
                const { data: altRpcData, error: altRpcError } = await supabase.rpc('list_published_articles', { 
                    result_limit: limit || 100 
                });
                
                if (!altRpcError && altRpcData && altRpcData.length > 0) {
                    articles = (altRpcData as any[]).map(item => this.normalizeArticle(item));
                }

                if (altRpcError) {
                    logger.error('All RPC fallbacks failed', altRpcError);
                }
            }
        }

        // Cache the result
        if (articles.length > 0) {
            await cacheService.set(cacheKey, articles, {
                ttl: strategy.ttl,
                tags: [...strategy.tags],
            });
        }

        return articles;
    }

    /**
     * List published articles (for public routes)
     */
    async listPublishedArticles(limit?: number): Promise<ArticleData[]> {
        const supabase = this.getClient();
        let query = supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .not('published_at', 'is', null)
            .order('published_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
            logger.error('Failed to list published articles', error);
            return [];
        }

        return (data || []).map((article: any) => this.normalizeArticle(article));
    }

    /**
     * Get articles with pagination and filtering (for public API)
     */
    async getArticles(options: {
        page?: number;
        limit?: number;
        category?: string;
        status?: string;
        search?: string;
    }): Promise<{
        articles: ArticleData[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const supabase = this.getClient();
        const page = options.page || 1;
        const limit = options.limit || 10;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('articles')
            .select('*', { count: 'exact' });

        // Filter by status
        if (options.status) {
            query = query.eq('status', options.status);
        }

        // Filter by category
        if (options.category) {
            query = query.eq('category', options.category);
        }

        // Search in title, excerpt, or content
        if (options.search) {
            query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,content.ilike.%${options.search}%`);
        }

        // Order by published date (most recent first)
        query = query.order('published_at', { ascending: false, nullsFirst: false });

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            logger.error('Failed to get articles', error);
            return {
                articles: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
            };
        }

        const articles = (data || []).map((article: any) => this.normalizeArticle(article));
        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            articles,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }

    /**
     * Delete article
     */
    async deleteArticle(id: string): Promise<void> {
        const supabase = this.getClient();
        
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            logger.error('Failed to delete article', error);
            throw new Error(error.message || 'Failed to delete article');
        }
    }

    /**
     * Generate slug from title
     */
    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Suggest taxonomy for an article based on its content
     */
    public suggestTaxonomy(title: string, content: string = '') {
        return TaxonomyService.categorizeContent(title, content);
    }

    /**
     * Normalize article data
     */
    private normalizeArticle(data: any): ArticleData {
        return {
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            body_markdown: data.body_markdown || data.content || '',
            body_html: data.body_html || '',
            content: data.content || data.body_markdown || '',
            category: data.category,
            tags: data.tags || [],
            status: data.status as ArticleStatus,
            published_at: data.published_at,
            published_date: data.published_date,
            seo_title: data.seo_title,
            seo_description: data.seo_description || data.meta_description,
            featured_image: data.featured_image,
            read_time: data.read_time,
            language: data.language || 'en',
            ai_generated: data.ai_generated || false,
            author_id: data.author_id,
            author_name: data.authors?.name || data.author_name || 'InvestingPro Team',
            author_avatar: data.authors?.avatar_url,
            author_role: data.authors?.role || 'Editor',
            views: data.views || 0,
            created_at: data.created_at,
            updated_at: data.updated_at,
            is_user_submission: data.is_user_submission,
            submission_status: data.submission_status,
            rejection_reason: data.rejection_reason,
            
            // Pro Editorial Fields
            quality_score: data.quality_score,
            editorial_notes: data.editorial_notes,
            difficulty_level: data.difficulty_level,
            verified_by_expert: data.verified_by_expert,
        };
    }
    
    /**
     * Update article with partial data
     * Used by CMS agents for status updates, quality score, etc.
     */
    async updateArticle(id: string, updates: Partial<{
        status: string;
        published_date: string;
        published_at: string;
        quality_score: number;
        featured_image: string;
        editorial_notes: string;
        scheduled_publish_at: string;
    }>): Promise<void> {
        const supabase = this.getClient();
        
        // Get existing article to track status change
        const existing = await this.getById(id);
        const previousStatus = existing?.status;

        const { error } = await supabase
            .from('articles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
        
        if (error) {
            logger.error('Failed to update article', error);
            throw new Error(error.message || 'Failed to update article');
        }
        
        // Trigger state transition if status changed
        if (updates.status && updates.status !== previousStatus) {
            try {
                // Lazy import to avoid server/client boundary issues
                const { transitionArticleState } = await import('@/lib/workflows/hooks/article-workflow-hooks');
                await transitionArticleState(
                    id,
                    previousStatus || 'draft',
                    updates.status,
                    'update',
                    existing?.author_id || undefined
                );
                logger.info('Article state transition triggered', { 
                    articleId: id, 
                    from: previousStatus, 
                    to: updates.status 
                });
            } catch (workflowError) {
                // Don't fail update if workflow fails
                // Also catch server-only import errors gracefully
                if (workflowError instanceof Error && workflowError.message.includes('server-only')) {
                    logger.debug('State transition skipped (client context)');
                } else {
                    logger.error('Failed to trigger state transition', workflowError instanceof Error ? workflowError : new Error(String(workflowError)), { articleId: id });
                }
            }
        }

        // Invalidate cache
        await invalidateArticleCache(id);
        
        logger.info('Article updated', { id, updates: Object.keys(updates) });
    }
}

// Export singleton instance
export const articleService = ArticleService.getInstance();

