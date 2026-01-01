
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface Bookmark {
    id: string;
    user_id: string;
    article_id: string;
    article?: {
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        category: string;
        featured_image?: string;
        published_at: string;
    };
    notes?: string;
    created_at: string;
}

export interface ReadingProgress {
    id: string;
    user_id: string;
    article_id: string;
    progress: number; // 0-100
    read_time: number; // seconds
    completed_at?: string;
    last_read_at: string;
}

class BookmarkService {
    private supabase = createClient();

    /**
     * Add an article to bookmarks
     */
    async addBookmark(userId: string, articleId: string, notes?: string): Promise<boolean> {
        try {
            // Check if already bookmarked
            const { data: existing } = await this.supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', userId)
                .eq('article_id', articleId)
                .single();

            if (existing) {
                return true; // Already bookmarked
            }

            const { error } = await this.supabase
                .from('bookmarks')
                .insert({
                    user_id: userId,
                    article_id: articleId,
                    notes
                });

            if (error) throw error;
            return true;

        } catch (error) {
            logger.error('Failed to add bookmark', error as Error);
            return false;
        }
    }

    /**
     * Remove a bookmark
     */
    async removeBookmark(userId: string, articleId: string): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', userId)
                .eq('article_id', articleId);

            if (error) throw error;
            return true;

        } catch (error) {
            logger.error('Failed to remove bookmark', error as Error);
            return false;
        }
    }

    /**
     * Check if article is bookmarked
     */
    async isBookmarked(userId: string, articleId: string): Promise<boolean> {
        try {
            const { data } = await this.supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', userId)
                .eq('article_id', articleId)
                .single();

            return !!data;

        } catch {
            return false;
        }
    }

    /**
     * Get user's bookmarks
     */
    async getUserBookmarks(userId: string, limit: number = 20): Promise<Bookmark[]> {
        try {
            const { data, error } = await this.supabase
                .from('bookmarks')
                .select(`
                    id, user_id, article_id, notes, created_at,
                    article:articles(id, title, slug, excerpt, category, featured_image, published_at)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];

        } catch (error) {
            logger.error('Failed to get bookmarks', error as Error);
            return [];
        }
    }

    /**
     * Update reading progress
     */
    async updateProgress(userId: string, articleId: string, progress: number, readTime: number): Promise<boolean> {
        try {
            const completed = progress >= 90;
            
            const { data: existing } = await this.supabase
                .from('reading_progress')
                .select('id, read_time')
                .eq('user_id', userId)
                .eq('article_id', articleId)
                .single();

            if (existing) {
                await this.supabase
                    .from('reading_progress')
                    .update({
                        progress,
                        read_time: existing.read_time + readTime,
                        last_read_at: new Date().toISOString(),
                        ...(completed && !existing.completed_at ? { completed_at: new Date().toISOString() } : {})
                    })
                    .eq('id', existing.id);
            } else {
                await this.supabase
                    .from('reading_progress')
                    .insert({
                        user_id: userId,
                        article_id: articleId,
                        progress,
                        read_time: readTime,
                        last_read_at: new Date().toISOString(),
                        ...(completed ? { completed_at: new Date().toISOString() } : {})
                    });
            }

            return true;

        } catch (error) {
            logger.error('Failed to update reading progress', error as Error);
            return false;
        }
    }

    /**
     * Get reading progress for an article
     */
    async getProgress(userId: string, articleId: string): Promise<ReadingProgress | null> {
        try {
            const { data, error } = await this.supabase
                .from('reading_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('article_id', articleId)
                .single();

            if (error) return null;
            return data;

        } catch {
            return null;
        }
    }

    /**
     * Get user's reading history
     */
    async getReadingHistory(userId: string, limit: number = 10): Promise<ReadingProgress[]> {
        try {
            const { data, error } = await this.supabase
                .from('reading_progress')
                .select(`
                    *,
                    article:articles(id, title, slug, excerpt, category, featured_image)
                `)
                .eq('user_id', userId)
                .order('last_read_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];

        } catch (error) {
            logger.error('Failed to get reading history', error as Error);
            return [];
        }
    }

    /**
     * Get user reading stats
     */
    async getReadingStats(userId: string): Promise<{
        totalArticles: number;
        completedArticles: number;
        totalReadTime: number;
        bookmarkCount: number;
    }> {
        try {
            const [progressResult, bookmarkResult] = await Promise.all([
                this.supabase
                    .from('reading_progress')
                    .select('progress, read_time, completed_at')
                    .eq('user_id', userId),
                this.supabase
                    .from('bookmarks')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', userId)
            ]);

            const progress = progressResult.data || [];
            
            return {
                totalArticles: progress.length,
                completedArticles: progress.filter(p => p.completed_at).length,
                totalReadTime: progress.reduce((sum, p) => sum + (p.read_time || 0), 0),
                bookmarkCount: bookmarkResult.count || 0
            };

        } catch (error) {
            logger.error('Failed to get reading stats', error as Error);
            return { totalArticles: 0, completedArticles: 0, totalReadTime: 0, bookmarkCount: 0 };
        }
    }
}

export const bookmarkService = new BookmarkService();
