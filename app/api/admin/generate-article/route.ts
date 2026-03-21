import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { generateArticle } from '@/lib/ai/article-writer';
import { requireAdminApi } from '@/lib/auth/require-admin-api';

export async function POST(req: Request) {
    try {
        // 1. Auth Check — requires authenticated admin role
        const { error } = await requireAdminApi();
        if (error) return error;

        // 2. Parse Request
        const body = await req.json();
        const { topic, keywords, tone } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        // 3. Generate Content
        const articleData = await generateArticle({
            topic,
            keywords: keywords || [],
            tone
        });

        return NextResponse.json(articleData);

    } catch (error) {
        logger.error('Generation API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate article', details: error instanceof Error ? error.message : 'Unknown error' }, 
            { status: 500 }
        );
    }
}
