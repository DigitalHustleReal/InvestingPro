/**
 * Admin Authentication Helper
 * 
 * Provides utilities for checking admin access in API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Check if the current user is authenticated and has admin role
 * Uses service role to check user_roles table
 * @param request NextRequest object
 * @returns { user: User | null, isAdmin: boolean, error: string | null }
 */
export async function checkAdminAuth(request: NextRequest) {
    try {
        // Get auth token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            // Try to get from cookies (for browser requests)
            const cookieHeader = request.headers.get('cookie');
            // Extract access token from cookies if available
            // Note: In production, you'd parse cookies properly
            return {
                user: null,
                isAdmin: false,
                error: 'No authentication token provided'
            };
        }

        // Create Supabase client with anon key to verify user
        const supabase = createClient(
            env.NEXT_PUBLIC_SUPABASE_URL,
            env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        // Get user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return {
                user: null,
                isAdmin: false,
                error: 'Invalid or expired authentication token'
            };
        }

        // Check admin role using service role client
        const serviceSupabase = createClient(
            env.NEXT_PUBLIC_SUPABASE_URL,
            env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Try RPC function first
        const { data: roleData } = await serviceSupabase
            .rpc('get_user_role', { user_id: user.id })
            .single()
            .catch(() => ({ data: null }));

        if (roleData) {
            const isAdmin = roleData === 'admin' || roleData === 'editor';
            return {
                user,
                isAdmin,
                error: isAdmin ? null : 'User does not have admin access'
            };
        }

        // Fallback: Check user_roles table directly
        const { data: userRole } = await serviceSupabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        const isAdmin = userRole?.role === 'admin' || userRole?.role === 'editor';
        
        return {
            user,
            isAdmin,
            error: isAdmin ? null : 'User does not have admin access'
        };

    } catch (error: any) {
        return {
            user: null,
            isAdmin: false,
            error: error.message || 'Authentication check failed'
        };
    }
}

/**
 * Middleware wrapper for admin-only endpoints
 * Returns 401 if not authenticated, 403 if not admin
 * 
 * Note: For now, we'll allow service role access (for internal use)
 * In production, you should enforce proper user authentication
 */
export async function requireAdmin(request: NextRequest) {
    // For now, allow service role access (used by internal systems)
    // TODO: Implement proper user authentication check
    // This is a temporary solution - in production, you should check actual user auth
    
    // Check if request has service role key (internal use)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.includes(env.SUPABASE_SERVICE_ROLE_KEY)) {
        return {
            error: false,
            user: null // Service role doesn't have a user
        };
    }

    // Try to check user authentication
    const auth = await checkAdminAuth(request);

    if (!auth.user) {
        return {
            error: true,
            response: NextResponse.json(
                {
                    error: 'Unauthorized',
                    code: 'UNAUTHORIZED',
                    message: auth.error || 'Authentication required'
                },
                { status: 401 }
            )
        };
    }

    if (!auth.isAdmin) {
        return {
            error: true,
            response: NextResponse.json(
                {
                    error: 'Forbidden',
                    code: 'FORBIDDEN',
                    message: 'Admin access required'
                },
                { status: 403 }
            )
        };
    }

    return {
        error: false,
        user: auth.user
    };
}
