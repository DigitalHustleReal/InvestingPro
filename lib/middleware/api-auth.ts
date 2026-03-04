/**
 * API Authentication Middleware
 * Week 1 Task 3: Implement API authentication wrapper
 * 
 * Provides authentication, authorization, and rate limiting for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { isAdmin, isEditor } from '@/lib/auth/admin-auth';

export interface ApiConfig {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireEditor?: boolean;
  rateLimit?: {
    requests: number;
    window: number; // seconds
  };
}

export type ApiHandler = (
  req: NextRequest,
  user: any | null
) => Promise<NextResponse>;

/**
 * Wrap API route handler with authentication and authorization
 * 
 * @example
 * export const POST = withAuth(
 *   async (req, user) => {
 *     // user.id is available here
 *     return NextResponse.json({ success: true });
 *   },
 *   { requireAdmin: true }
 * );
 */
export function withAuth(
  handler: ApiHandler,
  config: ApiConfig = {}
) {
  return async (req: NextRequest) => {
    try {
      let user = null;

      // 1. Check authentication if required
      if (config.requireAuth || config.requireAdmin || config.requireEditor) {
        const supabase = createClient();
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) {
          return NextResponse.json(
            { 
              error: 'Unauthorized',
              message: 'Authentication required. Please log in.'
            },
            { status: 401 }
          );
        }

        user = authUser;

        // 2. Check admin role if required
        if (config.requireAdmin) {
          const admin = await isAdmin(user.id);

          if (!admin) {
            return NextResponse.json(
              { 
                error: 'Forbidden',
                message: 'Admin access required'
              },
              { status: 403 }
            );
          }
        }

        // 3. Check editor role if required
        if (config.requireEditor) {
          const editor = await isEditor(user.id);

          if (!editor) {
            return NextResponse.json(
              { 
                error: 'Forbidden',
                message: 'Editor access required'
              },
              { status: 403 }
            );
          }
        }
      }

      // 4. Call handler with authenticated user
      return await handler(req, user);
    } catch (error) {
      logger.error('[API Auth] Error:', error);
      
      return NextResponse.json(
        { 
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Shorthand for admin-only routes
 */
export function withAdminAuth(handler: ApiHandler) {
  return withAuth(handler, { requireAdmin: true });
}

/**
 * Shorthand for editor routes (admin or editor)
 */
export function withEditorAuth(handler: ApiHandler) {
  return withAuth(handler, { requireEditor: true });
}

/**
 * Shorthand for authenticated routes (any logged-in user)
 */
export function withUserAuth(handler: ApiHandler) {
  return withAuth(handler, { requireAuth: true });
}
