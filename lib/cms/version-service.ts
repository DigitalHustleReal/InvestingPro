/**
 * Article Version Service
 * 
 * Handles article versioning and rollback operations
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface ArticleVersion {
    id: string;
    version_number: number;
    created_at: string;
    created_by?: string;
    created_by_name?: string;
    change_summary?: string;
    content_preview?: {
        title?: string;
        status?: string;
        updated_at?: string;
    };
}

export interface VersionHistory {
    versions: ArticleVersion[];
    total: number;
    has_more: boolean;
}

/**
 * Create a version snapshot of an article
 */
export async function createArticleVersion(
    articleId: string,
    changeSummary?: string
): Promise<string | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('create_article_version', {
            p_article_id: articleId,
            p_created_by: null, // Will use auth.uid() in function
            p_change_summary: changeSummary || null,
        });

        if (error) {
            logger.error('Failed to create article version', error as Error, { articleId });
            return null;
        }

        return data as string;
    } catch (error) {
        logger.error('Error creating article version', error as Error, { articleId });
        return null;
    }
}

/**
 * Restore article to a specific version
 */
export async function restoreArticleVersion(
    articleId: string,
    versionNumber: number
): Promise<{ success: boolean; newVersionId?: string; error?: string }> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('restore_article_from_version', {
            p_article_id: articleId,
            p_version_number: versionNumber,
        });

        if (error) {
            logger.error('Failed to restore article version', error as Error, {
                articleId,
                versionNumber,
            });
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: true,
            newVersionId: data as string,
        };
    } catch (error) {
        logger.error('Error restoring article version', error as Error, {
            articleId,
            versionNumber,
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get version history for an article
 */
export async function getArticleVersionHistory(
    articleId: string,
    limit: number = 50,
    offset: number = 0
): Promise<VersionHistory | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('get_article_version_history', {
            p_article_id: articleId,
            p_limit: limit,
            p_offset: offset,
        });

        if (error) {
            logger.error('Failed to get article version history', error as Error, { articleId });
            return null;
        }

        // Get total count
        const { count } = await supabase
            .from('article_versions')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId);

        return {
            versions: (data || []) as ArticleVersion[],
            total: count || 0,
            has_more: (count || 0) > offset + limit,
        };
    } catch (error) {
        logger.error('Error getting article version history', error as Error, { articleId });
        return null;
    }
}

/**
 * Get a specific version's content
 */
export async function getArticleVersionContent(
    articleId: string,
    versionNumber: number
): Promise<any | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase
            .from('article_versions')
            .select('content')
            .eq('article_id', articleId)
            .eq('version_number', versionNumber)
            .single();

        if (error || !data) {
            logger.error('Failed to get article version content', error as Error, {
                articleId,
                versionNumber,
            });
            return null;
        }

        return data.content;
    } catch (error) {
        logger.error('Error getting article version content', error as Error, {
            articleId,
            versionNumber,
        });
        return null;
    }
}
