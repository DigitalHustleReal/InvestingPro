/**
 * Bookmark Repository
 * Abstracts database access for bookmarks
 */
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface BookmarkRepository {
    findByUserId(userId: string): Promise<any[]>;
    create(userId: string, articleId: string): Promise<any>;
    delete(userId: string, articleId: string): Promise<void>;
    exists(userId: string, articleId: string): Promise<boolean>;
}

export class SupabaseBookmarkRepository implements BookmarkRepository {
    private async getClient(): Promise<SupabaseClient> {
        return await createClient();
    }

    async findByUserId(userId: string): Promise<any[]> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select(`
                    *,
                    articles (
                        id,
                        title,
                        slug,
                        excerpt,
                        featured_image,
                        published_at
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            logger.error('Bookmark repository findByUserId error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async create(userId: string, articleId: string): Promise<any> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .insert({
                    user_id: userId,
                    article_id: articleId
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Bookmark repository create error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async delete(userId: string, articleId: string): Promise<void> {
        const supabase = await this.getClient();

        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', userId)
                .eq('article_id', articleId);

            if (error) {
                throw error;
            }
        } catch (error) {
            logger.error('Bookmark repository delete error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async exists(userId: string, articleId: string): Promise<boolean> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', userId)
                .eq('article_id', articleId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return false; // Not found
                }
                throw error;
            }

            return !!data;
        } catch (error) {
            logger.error('Bookmark repository exists error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}
