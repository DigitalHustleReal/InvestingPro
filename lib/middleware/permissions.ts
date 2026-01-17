/**
 * Permission Middleware
 * 
 * Middleware to check user roles and permissions before API operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin, isEditorOrAdmin, userHasPermission, getUserRole, type Permission } from '@/lib/auth/roles';
import { logger } from '@/lib/logger';

export interface PermissionCheckOptions {
    requireRole?: 'admin' | 'editor' | 'author' | 'viewer';
    requirePermission?: Permission;
    requireEditorOrAdmin?: boolean;
    allowOwnResource?: boolean; // For operations on own resources
}

/**
 * Permission middleware factory
 * Returns a middleware function that checks permissions before executing handler
 */
export function withPermissions(
    handler: (request: NextRequest, context: any, userId: string) => Promise<Response>,
    options: PermissionCheckOptions = {}
) {
    return async (request: NextRequest, context: any): Promise<Response> => {
        try {
            const supabase = await createClient();
            
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: 'UNAUTHORIZED',
                            message: 'Authentication required',
                        },
                    },
                    { status: 401 }
                );
            }

            const userId = user.id;

            // Check role requirement
            if (options.requireRole) {
                const userRole = await getUserRole(userId);
                const roleHierarchy: Record<string, number> = {
                    'admin': 4,
                    'editor': 3,
                    'author': 2,
                    'viewer': 1,
                };

                const requiredLevel = roleHierarchy[options.requireRole] || 0;
                const userLevel = roleHierarchy[userRole] || 0;

                if (userLevel < requiredLevel) {
                    logger.warn('Permission denied: insufficient role', {
                        userId,
                        userRole,
                        requiredRole: options.requireRole,
                    });

                    return NextResponse.json(
                        {
                            success: false,
                            error: {
                                code: 'FORBIDDEN',
                                message: `Required role: ${options.requireRole}`,
                            },
                        },
                        { status: 403 }
                    );
                }
            }

            // Check editor or admin requirement
            if (options.requireEditorOrAdmin) {
                const hasAccess = await isEditorOrAdmin(userId);
                if (!hasAccess) {
                    logger.warn('Permission denied: not editor or admin', { userId });
                    return NextResponse.json(
                        {
                            success: false,
                            error: {
                                code: 'FORBIDDEN',
                                message: 'Editor or admin access required',
                            },
                        },
                        { status: 403 }
                    );
                }
            }

            // Check specific permission
            if (options.requirePermission) {
                const hasPermission = await userHasPermission(userId, options.requirePermission);
                if (!hasPermission) {
                    logger.warn('Permission denied: missing permission', {
                        userId,
                        permission: options.requirePermission,
                    });

                    return NextResponse.json(
                        {
                            success: false,
                            error: {
                                code: 'FORBIDDEN',
                                message: `Required permission: ${options.requirePermission}`,
                            },
                        },
                        { status: 403 }
                    );
                }
            }

            // If allowOwnResource, check if user owns the resource (requires context to extract resource ID)
            // This is handled at the handler level

            // All checks passed, execute handler
            return await handler(request, context, userId);
        } catch (error) {
            logger.error('Permission check error', error as Error);
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: 'Permission check failed',
                    },
                },
                { status: 500 }
            );
        }
    };
}

/**
 * Check if user owns a resource (e.g., article author_id === user_id)
 */
export async function checkResourceOwnership(
    resourceUserId: string | null,
    currentUserId: string
): Promise<boolean> {
    if (!resourceUserId) return false;
    return resourceUserId === currentUserId;
}

/**
 * Helper to create admin-only middleware
 */
export function requireAdmin(
    handler: (request: NextRequest, context: any, userId: string) => Promise<Response>
) {
    return withPermissions(handler, { requireRole: 'admin' });
}

/**
 * Helper to create editor-or-admin middleware
 */
export function requireEditorOrAdmin(
    handler: (request: NextRequest, context: any, userId: string) => Promise<Response>
) {
    return withPermissions(handler, { requireEditorOrAdmin: true });
}
