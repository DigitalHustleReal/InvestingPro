/**
 * Auto Internal Linking API
 * Analyzes content and suggests relevant internal links based on other articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { content, articleId } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content required' }, { status: 400 });
        }

        // 1. Fetch potential link targets (published articles)
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, title, slug, primary_keyword')
            .eq('status', 'published')
            .neq('id', articleId || ''); // Exclude current article

        if (error) throw error;

        // 2. Find matches in content
        const suggestions = [];
        const contentLower = content.toLowerCase();

        for (const article of articles) {
            if (!article.title) continue;

            // Check if title or keyword appears in content
            const titleMatch = contentLower.includes(article.title.toLowerCase());
            const keywordMatch = article.primary_keyword && contentLower.includes(article.primary_keyword.toLowerCase());

            if (titleMatch || keywordMatch) {
                suggestions.push({
                    article_id: article.id,
                    title: article.title,
                    slug: article.slug,
                    match_type: titleMatch ? 'title' : 'keyword',
                    text_to_link: titleMatch ? article.title : article.primary_keyword
                });
            }
        }

        // 3. Limit suggestions to top relevant ones
        return NextResponse.json({
            success: true,
            suggestions: suggestions.slice(0, 10),
            count: suggestions.length
        });

    } catch (error: any) {
        console.error('Internal linking error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
