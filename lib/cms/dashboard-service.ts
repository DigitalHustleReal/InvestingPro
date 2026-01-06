/**
 * Dashboard Service - Auto-sync without refresh
 * 
 * WordPress-style guarantees:
 * - Counts derived from same query as list
 * - Auto-revalidates after mutations
 * - No manual refresh required
 */

import { articleService, type ArticleData, type ArticleStatus } from './article-service';

export interface DashboardStats {
    total: number;
    draft: number;
    review: number;
    published: number;
    archived: number;
}

/**
 * Get dashboard statistics
 * Derived from same query as article list
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    const articles = await articleService.listArticles();
    
    return {
        total: articles.length,
        draft: articles.filter(a => a.status === 'draft').length,
        review: articles.filter(a => a.status === 'review').length,
        published: articles.filter(a => a.status === 'published').length,
        archived: articles.filter(a => a.status === 'archived').length,
    };
}

/**
 * Get articles by status
 */
export async function getArticlesByStatus(status: ArticleStatus): Promise<ArticleData[]> {
    const articles = await articleService.listArticles();
    return articles.filter(a => a.status === status);
}



