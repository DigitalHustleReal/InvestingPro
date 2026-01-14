/**
 * Article Service
 * Business logic for articles
 */
import { SupabaseArticleRepository, type ArticleRepository, type ArticleQuery } from './article.repository';
import { CachedArticleRepository } from './article.repository.cached';
import { logger } from '@/lib/logger';

export interface ArticleService {
    getArticles(query: ArticleQuery): Promise<{
        articles: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getArticleById(id: string): Promise<any | null>;
    getArticleBySlug(slug: string): Promise<any | null>;
}

export class ArticleServiceImpl implements ArticleService {
    private repository: ArticleRepository;

    constructor(repository?: ArticleRepository) {
        // Use cached repository by default for better performance
        // Can be overridden for testing or special cases
        this.repository = repository || new CachedArticleRepository();
    }

    async getArticles(query: ArticleQuery): Promise<{
        articles: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;

            const { data, count } = await this.repository.findMany({
                ...query,
                status: query.status || 'published' // Default to published for public API
            });

            return {
                articles: data,
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            logger.error('Article service getArticles error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getArticleById(id: string): Promise<any | null> {
        try {
            return await this.repository.findById(id);
        } catch (error) {
            logger.error('Article service getArticleById error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getArticleBySlug(slug: string): Promise<any | null> {
        try {
            return await this.repository.findBySlug(slug);
        } catch (error) {
            logger.error('Article service getArticleBySlug error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const articleService = new ArticleServiceImpl();
