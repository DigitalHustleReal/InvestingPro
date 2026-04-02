/**
 * Request Validation Middleware
 * Validates request body/query using Zod schemas
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { logger } from '@/lib/logger';

/**
 * Validate request body
 */
export async function validateBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { success: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn('Request validation failed', { errors: error.issues });
            return {
                success: false,
                response: NextResponse.json(
                    {
                        success: false,
                        error: 'Validation failed',
                        details: error.issues,
                    },
                    { status: 400 }
                ),
            };
        }
        throw error;
    }
}

/**
 * Validate request query parameters
 */
export function validateQuery<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
    try {
        const url = new URL(request.url);
        const query: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
            query[key] = value;
        });
        const data = schema.parse(query);
        return { success: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn('Query validation failed', { errors: error.issues });
            return {
                success: false,
                response: NextResponse.json(
                    {
                        success: false,
                        error: 'Query validation failed',
                        details: error.issues,
                    },
                    { status: 400 }
                ),
            };
        }
        throw error;
    }
}

/**
 * Create validation middleware
 */
export function withValidation<TBody = unknown, TQuery = unknown>(
    bodySchema?: z.ZodSchema<TBody>,
    querySchema?: z.ZodSchema<TQuery>
) {
    return function wrapHandler(
        handler: (
            request: NextRequest,
            body: TBody | undefined,
            query: TQuery | undefined,
            ...args: any[]
        ) => Promise<NextResponse>
    ) {
        return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
            // Validate body if schema provided
            let body: TBody | undefined = undefined;
            if (bodySchema) {
                const bodyResult = await validateBody(request, bodySchema);
                if (!bodyResult.success) {
                    return bodyResult.response;
                }
                body = bodyResult.data;
            }

            // Validate query if schema provided
            let query: TQuery | undefined = undefined;
            if (querySchema) {
                const queryResult = validateQuery(request, querySchema);
                if (!queryResult.success) {
                    return queryResult.response;
                }
                query = queryResult.data;
            }

            return handler(request, body, query, ...args);
        };
    };
}
