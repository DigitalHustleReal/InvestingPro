/**
 * API Middleware - Error Handling
 * 
 * Purpose: Centralized error handling for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export type APIHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Middleware to handle errors consistently
 */
export function withErrorHandling(handler: APIHandler) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      // Log error
      logger.error('API Error', error as Error);

      // Handle specific error types
      if (error instanceof ValidationError) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      if (error instanceof UnauthorizedError) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }

      if (error instanceof ForbiddenError) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }

      if (error instanceof NotFoundError) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      // Generic error
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined
        },
        { status: 500 }
      );
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
