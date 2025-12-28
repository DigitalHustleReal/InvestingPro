import { NextRequest, NextResponse } from 'next/server';
import { contentRepurposingService } from '@/lib/social-media/ContentRepurposingService';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Repurpose article content for social media
 * POST /api/content/repurpose
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { article_id, platform, template_id } = body;

        if (!article_id || !platform) {
            return NextResponse.json(
                { success: false, error: 'article_id and platform are required' },
                { status: 400 }
            );
        }

        // Get article content
        const supabase = await createClient();
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('id, title, content, excerpt')
            .eq('id', article_id)
            .single();

        if (articleError || !article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            );
        }

        const content = article.content || article.excerpt || '';
        if (!content.trim()) {
            return NextResponse.json(
                { success: false, error: 'Article has no content to repurpose' },
                { status: 400 }
            );
        }

        // Repurpose content
        const repurposedContent = await contentRepurposingService.repurposeContent({
            article_id,
            article_content: content,
            article_title: article.title || '',
            platform: platform as 'twitter' | 'linkedin' | 'facebook' | 'instagram',
            template_id
        });

        return NextResponse.json({
            success: true,
            content: repurposedContent
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to repurpose content';
        logger.error('Error repurposing content', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

