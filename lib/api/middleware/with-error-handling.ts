/**
 * API Middleware - Error Handling
 * 
 * Purpose: Centralized error handling for API routes
 * 
 * @deprecated Use lib/errors/handler.ts instead
 * This file is kept for backward compatibility
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/errors/handler';
import {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
} from '@/lib/errors/types';

export type APIHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

// Re-export error classes for backward compatibility
export { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError };

/**
 * Middleware to handle errors consistently
 * 
 * @deprecated Use withErrorHandler from lib/errors/handler.ts
 */
export function withErrorHandling(handler: APIHandler) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

/**
 * Middleware to add CORS headers
 */
export function withCORS(handler: APIHandler, options?: {
  origin?: string;
  methods?: string[];
}) {
  return async (request: NextRequest, context?: any) => {
    const response = await handler(request, context);

    // Add CORS headers
    response.headers.set(
      'Access-Control-Allow-Origin',
      options?.origin || '*'
    );
    response.headers.set(
      'Access-Control-Allow-Methods',
      options?.methods?.join(', ') || 'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    return response;
  };
}

/**
 * Middleware to add rate limiting headers
 */
export function withRateLimitHeaders(
  handler: APIHandler,
  limit: number,
  remaining: number
) {
  return async (request: NextRequest, context?: any) => {
    const response = await handler(request, context);

    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', (Date.now() + 60000).toString());

    return response;
  };
}
