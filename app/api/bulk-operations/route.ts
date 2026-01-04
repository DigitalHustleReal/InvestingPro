/**
 * Bulk Operations API
 * Perform operations on multiple articles at once
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { action, articleIds, data = {} } = await request.json();

        if (!action || !articleIds || !Array.isArray(articleIds)) {
            return NextResponse.json({ 
                error: 'Invalid request. Need action and articleIds array' 
            }, { status: 400 });
        }

        if (articleIds.length === 0) {
            return NextResponse.json({ 
                error: 'No articles selected' 
            }, { status: 400 });
        }

        console.log(`🔄 Bulk ${action} on ${articleIds.length} articles`);

        let result;

        switch (action) {
            case 'publish':
                result = await bulkPublish(articleIds);
                break;
            
            case 'unpublish':
                result = await bulkUnpublish(articleIds);
                break;
            
            case 'archive':
                result = await bulkArchive(articleIds);
                break;
            
            case 'delete':
                result = await bulkDelete(articleIds);
                break;
            
            case 'update-category':
                result = await bulkUpdateCategory(articleIds, data.category);
                break;
            
            case 'add-tags':
                result = await bulkAddTags(articleIds, data.tags);
                break;
            
            case 'update-author':
                result = await bulkUpdateAuthor(articleIds, data.authorId);
                break;
            
            default:
                return NextResponse.json({ 
                    error: `Unknown action: ${action}` 
                }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            action,
            count: result.count,
            message: `${result.count} articles ${action}ed successfully`
        });

    } catch (error: any) {
        console.error('Bulk operation error:', error);
        return NextResponse.json({
            error: error.message || 'Bulk operation failed'
        }, { status: 500 });
    }
}

async function bulkPublish(articleIds: string[]) {
    const { data, error } = await supabase
        .from('articles')
        .update({ 
            status: 'published',
            published_at: new Date().toISOString()
        })
        .in('id', articleIds)
        .select();

    if (error) throw error;
    return { count: data?.length || 0 };
}

async function bulkUnpublish(articleIds: string[]) {
    const { data, error } = await supabase
        .from('articles')
        .update({ 
            status: 'draft',
            published_at: null
        })
        .in('id', articleIds)
        .select();

    if (error) throw error;
    return { count: data?.length || 0 };
}

async function bulkArchive(articleIds: string[]) {
    const { data, error } = await supabase
        .from('articles')
        .update({ status: 'archived' })
        .in('id', articleIds)
        .select();

    if (error) throw error;
    return { count: data?.length || 0 };
}

async function bulkDelete(articleIds: string[]) {
    const { data, error } = await supabase
        .from('articles')
        .delete()
        .in('id', articleIds)
        .select();

    if (error) throw error;
    return { count: data?.length || 0 };
}

async function bulkUpdateCategory(articleIds: string[], category: string) {
    if (!category) throw new Error('Category required');

    const { data, error } = await supabase
        .from('articles')
        .update({ category })
        .in('id', articleIds)
        .select();

    if (error) throw error;
    return { count: data?.length || 0 };
}

async function bulkAddTags(articleIds: string[], newTags: string[]) {
    if (!newTags || newTags.length === 0) {
        throw new Error('Tags required');
    }

    // Get current articles to merge tags
    const { data: articles, error: fetchError } = await supabase
        .from('articles')
        .select('id, tags')
        .in('id', articleIds);

    if (fetchError) throw fetchError;

    // Update each article with merged tags
    const updates = articles?.map(article => ({
        id: article.id,
        tags: [...new Set([...(article.tags || []), ...newTags])]
    })) || [];

    let count = 0;
    for (const update of updates) {
        const { error } = await supabase
            .from('articles')
            .update({ tags: update.tags })
            .eq('id', update.id);

        if (!error) count++;
    }

    return { count };
}

async function bulkUpdateAuthor(articleIds: string[], authorId: string) {
    if (!authorId) throw new Error('Author ID required');

    const { data, error } = await supabase
        .from('articles')
        .update({ author_id: authorId })
        .in('id', articleIds)
        .select();

    if (error) throw error;
    return { count: data?.length || 0 };
}
