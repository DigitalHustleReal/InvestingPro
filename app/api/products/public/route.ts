import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { productQuerySchema } from '@/lib/validation/schemas';
import { productService } from '@/lib/services';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/products/public', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(undefined, productQuerySchema)(
        async (request: NextRequest, _body: unknown, queryParams: any) => {
            try {
                // Query parameters are already validated by middleware
                const result = await productService.getProducts({
                    page: queryParams?.page || 1,
                    limit: queryParams?.limit || 20,
                    category: queryParams?.category || '',
                    search: queryParams?.search || '',
                    featured: queryParams?.featured === 'true' || queryParams?.featured === true
                });

                return NextResponse.json(result);
            } catch (error: any) {
                logger.error('Products API error', error instanceof Error ? error : new Error(String(error)));
                throw error; // Let API wrapper handle error response
            }
        }
    )
);
