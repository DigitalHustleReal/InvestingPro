
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category?: string;
    featured_image?: string;
    published_at?: string;
    read_time?: number;
    views?: number;
    author_name?: string;
    content?: string;
    tags?: string[];
    status?: ArticleStatus;
    created_at?: string;
    updated_at?: string;
};

export type ArticleListResult = {
    articles: Article[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export class ArticleService {
    
    // Fetch articles for public display
    async getPublicArticles(limit: number = 6, offset: number = 0, category?: string): Promise<Article[]> {
        const supabase = createClient();
        
        let query = supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });
            
        if (category) {
            query = query.eq('category', category);
        }
            
        const { data, error } = await query.range(offset, offset + limit - 1);
        
        if (error) {
            logger.error('Error fetching articles:', error);
            return [];
        }
        
        return data || [];
    }

    async getArticleBySlug(slug: string): Promise<Article | null> {
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();
            
        if (error) return null;
        return data;
    }

    // For the homepage widget
    async getLatestInsights(limit: number = 4): Promise<Article[]> {
        return this.getPublicArticles(limit);
    }
}

export const articleService = new ArticleService();
