/**
 * Zod Validation Middleware
 * 
 * Enhanced validation middleware that integrates with error handling
 * Provides type-safe request/response validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { ValidationError } from '@/lib/errors/types';
import { handleError } from '@/lib/errors/handler';
import { logger } from '@/lib/logger';

export interface ValidationOptions {
    /**
     * Whether to log validation errors
     */
    logErrors?: boolean;
    
    /**
     * Custom error message prefix
     */
    errorPrefix?: string;
    
    /**
     * Whether to include full error details in response
     */
    includeDetails?: boolean;
}

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>,
    options: ValidationOptions = {}
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
    try {
        let body: unknown;
        
        // Handle empty body
        const contentType = request.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            try {
                body = await request.json();
            } catch (error) {
                // Body might be empty or invalid JSON
                body = {};
            }
        } else {
            body = {};
        }
        
        const data = schema.parse(body);
        return { success: true, data };
    } catch (error) {
        if (error instanceof ZodError) {
            if (options.logErrors !== false) {
                logger.warn('Request body validation failed', {
                    errors: error.errors,
                    path: request.nextUrl.pathname,
                });
            }
            
            const errorMessage = options.errorPrefix 
                ? `${options.errorPrefix}: ${formatZodError(error)}`
                : formatZodError(error);
            
            const validationError = new ValidationError(errorMessage, {
                errors: options.includeDetails ? error.errors : undefined,
                fieldCount: error.errors.length,
            });
            
            return {
                success: false,
                response: handleError(validationError, request),
            };
        }
        throw error;
    }
}

/**
 * Validate request query parameters with Zod schema
 */
export function validateQuery<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>,
    options: ValidationOptions = {}
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
        if (error instanceof ZodError) {
            if (options.logErrors !== false) {
                logger.warn('Query parameter validation failed', {
                    errors: error.errors,
                    path: request.nextUrl.pathname,
                });
            }
            
            const errorMessage = options.errorPrefix 
                ? `${options.errorPrefix}: ${formatZodError(error)}`
                : formatZodError(error);
            
            const validationError = new ValidationError(errorMessage, {
                errors: options.includeDetails ? error.errors : undefined,
                fieldCount: error.errors.length,
            });
            
            return {
                success: false,
                response: handleError(validationError, request),
            };
        }
        throw error;
    }
}

/**
 * Validate request params (route parameters)
 */
export function validateParams<T>(
    params: Record<string, string | string[] | undefined>,
    schema: z.ZodSchema<T>,
    options: ValidationOptions = {}
): { success: true; data: T } | { success: false; error: ValidationError } {
    try {
        // Convert params to plain object
        const paramsObj: Record<string, string> = {};
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                paramsObj[key] = Array.isArray(value) ? value[0] : value;
            }
        }
        
        const data = schema.parse(paramsObj);
        return { success: true, data };
    } catch (error) {
        if (error instanceof ZodError) {
            if (options.logErrors !== false) {
                logger.warn('Route parameter validation failed', {
                    errors: error.errors,
                });
            }
            
            const errorMessage = options.errorPrefix 
                ? `${options.errorPrefix}: ${formatZodError(error)}`
                : formatZodError(error);
            
            const validationError = new ValidationError(errorMessage, {
                errors: options.includeDetails ? error.errors : undefined,
                fieldCount: error.errors.length,
            });
            
            return { success: false, error: validationError };
        }
        throw error;
    }
}

/**
 * Format Zod error into readable message
 */
function formatZodError(error: ZodError): string {
    const messages = error.errors.map(err => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
    });
    
    return messages.join('; ');
}

/**
 * Create validation middleware wrapper
 * Integrates with error handling system
 */
export function withZodValidation<TBody = unknown, TQuery = unknown, TParams = unknown>(options?: {
    body?: z.ZodSchema<TBody>;
    query?: z.ZodSchema<TQuery>;
    params?: z.ZodSchema<TParams>;
    validationOptions?: ValidationOptions;
}) {
    return function wrapHandler(
        handler: (
            request: NextRequest,
            context: {
                body?: TBody;
                query?: TQuery;
                params?: TParams;
            },
            ...args: any[]
        ) => Promise<NextResponse>
    ) {
        return async (
            request: NextRequest,
            routeParams?: Record<string, string | string[] | undefined>,
            ...args: any[]
        ): Promise<NextResponse> => {
            const validationOpts = options?.validationOptions || {};
            
            // Validate body
            let body: TBody | undefined = undefined;
            if (options?.body) {
                const bodyResult = await validateBody(request, options.body, validationOpts);
                if (!bodyResult.success) {
                    return bodyResult.response;
                }
                body = bodyResult.data;
            }
            
            // Validate query
            let query: TQuery | undefined = undefined;
            if (options?.query) {
                const queryResult = validateQuery(request, options.query, validationOpts);
                if (!queryResult.success) {
                    return queryResult.response;
                }
                query = queryResult.data;
            }
            
            // Validate params
            let params: TParams | undefined = undefined;
            if (options?.params && routeParams) {
                const paramsResult = validateParams(routeParams, options.params, validationOpts);
                if (!paramsResult.success) {
                    return handleError(paramsResult.error, request);
                }
                params = paramsResult.data;
            }
            
            return handler(request, { body, query, params }, ...args);
        };
    };
}

/**
 * Helper to extract and validate JSON body
 */
export async function getValidatedBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): Promise<T> {
    const result = await validateBody(request, schema);
    if (!result.success) {
        throw result.response; // This will be caught by error handler
    }
    return result.data;
}

/**
 * Helper to extract and validate query parameters
 */
export function getValidatedQuery<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): T {
    const result = validateQuery(request, schema);
    if (!result.success) {
        throw result.response; // This will be caught by error handler
    }
    return result.data;
}

/**
 * Helper to extract and validate route parameters
 */
export function getValidatedParams<T>(
    params: Record<string, string | string[] | undefined>,
    schema: z.ZodSchema<T>
): T {
    const result = validateParams(params, schema);
    if (!result.success) {
        throw result.error; // This will be caught by error handler
    }
    return result.data;
}
