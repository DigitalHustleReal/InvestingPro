import { revalidatePath, revalidateTag } from 'next/cache';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Revalidation API Route
 * 
 * Used to revalidate Next.js cache after article publish/update
 * 
 * POST /api/revalidate
 * Body: { paths: string[] }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paths } = body;

        if (!paths || !Array.isArray(paths)) {
            return NextResponse.json(
                { error: 'paths must be an array' },
                { status: 400 }
            );
        }

        // Revalidate each path
        paths.forEach((path: string) => {
            revalidatePath(path);
        });

        // Also revalidate common tags
        revalidateTag('articles', 'default');
        revalidateTag('article-list', 'default');

        return NextResponse.json({
            revalidated: true,
            paths,
            now: Date.now(),
        });
    } catch (error) {
        logger.error('Revalidation error:', error);
        return NextResponse.json(
            { error: 'Failed to revalidate', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}



