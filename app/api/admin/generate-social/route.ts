import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { generateSocialPosts } from '@/lib/ai/social/post-generator';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Admin role verification
        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (adminRole?.role !== 'admin') {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }
        }

        const body = await req.json();
        const { articleId, title, content, sourceUrl } = body;

        if (!articleId || !title || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: articleId, title, content' },
                { status: 400 }
            );
        }

        // Generate social posts
        logger.info(`Generating social posts for article ${articleId}`);
        const posts = await generateSocialPosts(title, content, sourceUrl);

        // For preview mode (unsaved articles), skip DB update
        if (articleId === 'preview') {
            return NextResponse.json({
                success: true,
                posts: {
                    twitter: posts.twitter_thread,
                    linkedin: posts.linkedin_post,
                    instagram: posts.instagram_caption,
                    generated_at: posts.generated_at
                }
            });
        }

        // Update article's ai_metadata with new social posts
        const { data: article, error: fetchError } = await supabase
            .from('articles')
            .select('ai_metadata')
            .eq('id', articleId)
            .single();

        if (fetchError) {
            logger.error('Failed to fetch article', fetchError);
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        const existingMetadata = article?.ai_metadata || {};
        const updatedMetadata = {
            ...existingMetadata,
            distribution: {
                twitter: posts.twitter_thread,
                linkedin: posts.linkedin_post,
                instagram: posts.instagram_caption,
                generated_at: posts.generated_at
            }
        };

        const { error: updateError } = await supabase
            .from('articles')
            .update({ ai_metadata: updatedMetadata })
            .eq('id', articleId);

        if (updateError) {
            logger.error('Failed to update article metadata', updateError);
            return NextResponse.json({ error: 'Failed to save posts' }, { status: 500 });
        }

        logger.info(`Social posts saved for article ${articleId}`);
        return NextResponse.json({
            success: true,
            posts: {
                twitter: posts.twitter_thread,
                linkedin: posts.linkedin_post,
                instagram: posts.instagram_caption,
                generated_at: posts.generated_at
            }
        });

    } catch (error) {
        logger.error('Social post generation failed', error as Error);
        return NextResponse.json(
            { error: 'Failed to generate social posts' },
            { status: 500 }
        );
    }
}
