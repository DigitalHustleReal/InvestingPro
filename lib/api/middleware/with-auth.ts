/**
 * API Middleware - Authentication
 * 
 * Purpose: Reusable authentication middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type AuthenticatedHandler = (
  request: NextRequest,
  context: { user: any; params?: any }
) => Promise<NextResponse>;

/**
 * Middleware to require authentication
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context?: { params?: any }) => {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Pass user to handler
      return handler(request, { user, params: context?.params });
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware to require admin role
 */
export function withAdmin(handler: AuthenticatedHandler) {
  return withAuth(async (request, context) => {
    const { user } = context;

    // Check if user has admin role
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    return handler(request, context);
  });
}

/**
 * Optional authentication - adds user if available but doesn't require it
 */
export function withOptionalAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context?: { params?: any }) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      return handler(request, { user: user || null, params: context?.params });
    } catch (error) {
      // Continue without user
      return handler(request, { user: null, params: context?.params });
    }
  };
}
