/**
 * API Middleware - Validation
 * 
 * Purpose: Reusable request validation middleware using Zod
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export type ValidatedHandler<T> = (
  request: NextRequest,
  context: { validated: T; params?: any }
) => Promise<NextResponse>;

/**
 * Middleware to validate request body with Zod schema
 */
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return (handler: ValidatedHandler<T>) => {
    return async (request: NextRequest, context?: { params?: any }) => {
      try {
        const body = await request.json();
        const validated = schema.parse(body);

        return handler(request, { validated, params: context?.params });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }
    };
  };
}

/**
 * Middleware to validate query parameters
 */
export function withQueryValidation<T>(schema: z.ZodSchema<T>) {
  return (handler: ValidatedHandler<T>) => {
    return async (request: NextRequest, context?: { params?: any }) => {
      try {
        const { searchParams } = new URL(request.url);
        const queryObject = Object.fromEntries(searchParams.entries());
        const validated = schema.parse(queryObject);

        return handler(request, { validated, params: context?.params });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: 'Invalid query parameters',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: 'Invalid query parameters' },
          { status: 400 }
        );
      }
    };
  };
}
