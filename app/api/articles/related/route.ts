/**
 * Related Articles API
 * 
 * Returns smart article recommendations based on relevance scoring.
 */

import { NextResponse } from 'next/server';
import { getRelatedArticles, getRelatedByCategory, getTrendingArticles } from '@/lib/cms/related-articles';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const articleId = searchParams.get('articleId');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '5');
        const type = searchParams.get('type') || 'related'; // related, category, trending

        let articles;

        if (type === 'trending') {
            articles = await getTrendingArticles(limit);
        } else if (type === 'category' && category) {
            articles = await getRelatedByCategory(category, articleId ? [articleId] : [], limit);
        } else if (articleId) {
            articles = await getRelatedArticles(articleId, { limit });
        } else if (category) {
            articles = await getRelatedByCategory(category, [], limit);
        } else {
            return NextResponse.json(
                { success: false, error: 'articleId or category required' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            articles,
            count: articles.length
        });
    } catch (error) {
        console.error('Related articles error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get related articles' },
            { status: 500 }
        );
    }
}
