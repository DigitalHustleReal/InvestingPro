import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { articleQuerySchema } from '@/lib/validation/schemas';
import { articleService } from '@/lib/services';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/articles/public', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(undefined, articleQuerySchema)(
        async (request: NextRequest, _body: unknown, queryParams: any) => {
            try {
                // Query parameters are already validated by middleware
                const result = await articleService.getArticles({
                    page: queryParams?.page || 1,
                    limit: queryParams?.limit || 10,
                    category: queryParams?.category || '',
                    status: 'published'
                });

                return NextResponse.json(result);
            } catch (error: any) {
                logger.error('Articles API error', error instanceof Error ? error : new Error(String(error)));
                throw error; // Let API wrapper handle error response
            }
        }
    )
);
