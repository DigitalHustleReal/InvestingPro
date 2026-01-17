/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Provides functions to check user roles and permissions
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export type Permission = 
    | 'articles.create'
    | 'articles.edit'
    | 'articles.publish'
    | 'articles.delete'
    | 'articles.view'
    | 'own.articles.delete'
    | 'categories.manage'
    | 'categories.view'
    | 'users.manage'
    | 'settings.manage'
    | 'ai.generate'
    | 'scrapers.manage';

export interface UserRoleInfo {
    role: UserRole;
    permissions: Record<Permission, boolean>;
}

/**
 * Get user role from database
 */
export async function getUserRole(userId: string): Promise<UserRole> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('get_user_role', {
            p_user_id: userId
        });

        if (error) {
            logger.error('Failed to get user role', error as Error, { userId });
            return 'viewer'; // Default to viewer on error
        }

        return (data as UserRole) || 'viewer';
    } catch (error) {
        logger.error('Error getting user role', error as Error, { userId });
        return 'viewer';
    }
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(
    userId: string,
    permission: Permission
): Promise<boolean> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('user_has_permission', {
            p_user_id: userId,
            p_permission: permission
        });

        if (error) {
            logger.error('Failed to check user permission', error as Error, { userId, permission });
            return false; // Default to false on error
        }

        return Boolean(data);
    } catch (error) {
        logger.error('Error checking user permission', error as Error, { userId, permission });
        return false;
    }
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('is_admin', {
            p_user_id: userId
        });

        if (error) {
            logger.error('Failed to check if user is admin', error as Error, { userId });
            return false;
        }

        return Boolean(data);
    } catch (error) {
        logger.error('Error checking if user is admin', error as Error, { userId });
        return false;
    }
}

/**
 * Check if user is editor or admin
 */
export async function isEditorOrAdmin(userId: string): Promise<boolean> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('is_editor_or_admin', {
            p_user_id: userId
        });

        if (error) {
            logger.error('Failed to check if user is editor or admin', error as Error, { userId });
            return false;
        }

        return Boolean(data);
    } catch (error) {
        logger.error('Error checking if user is editor or admin', error as Error, { userId });
        return false;
    }
}

/**
 * Get full role info with permissions
 */
export async function getUserRoleInfo(userId: string): Promise<UserRoleInfo | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase
            .from('user_roles')
            .select('role, permissions')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return {
                role: 'viewer',
                permissions: getDefaultPermissions('viewer')
            };
        }

        const role = data.role as UserRole;
        const explicitPermissions = (data.permissions as Record<string, boolean>) || {};

        // Merge default permissions with explicit permissions
        const defaultPermissions = getDefaultPermissions(role);
        const permissions: Record<Permission, boolean> = {
            ...defaultPermissions,
            ...explicitPermissions
        } as Record<Permission, boolean>;

        return {
            role,
            permissions
        };
    } catch (error) {
        logger.error('Error getting user role info', error as Error, { userId });
        return null;
    }
}

/**
 * Get default permissions for a role
 */
function getDefaultPermissions(role: UserRole): Record<Permission, boolean> {
    const defaults: Record<UserRole, Record<Permission, boolean>> = {
        admin: {
            'articles.create': true,
            'articles.edit': true,
            'articles.publish': true,
            'articles.delete': true,
            'articles.view': true,
            'own.articles.delete': true,
            'categories.manage': true,
            'categories.view': true,
            'users.manage': true,
            'settings.manage': true,
            'ai.generate': true,
            'scrapers.manage': true,
        },
        editor: {
            'articles.create': true,
            'articles.edit': true,
            'articles.publish': true,
            'articles.delete': false,
            'articles.view': true,
            'own.articles.delete': true,
            'categories.manage': true,
            'categories.view': true,
            'users.manage': false,
            'settings.manage': false,
            'ai.generate': true,
            'scrapers.manage': false,
        },
        author: {
            'articles.create': true,
            'articles.edit': true,
            'articles.publish': false,
            'articles.delete': false,
            'articles.view': true,
            'own.articles.delete': true,
            'categories.manage': false,
            'categories.view': true,
            'users.manage': false,
            'settings.manage': false,
            'ai.generate': false,
            'scrapers.manage': false,
        },
        viewer: {
            'articles.create': false,
            'articles.edit': false,
            'articles.publish': false,
            'articles.delete': false,
            'articles.view': true,
            'own.articles.delete': false,
            'categories.manage': false,
            'categories.view': true,
            'users.manage': false,
            'settings.manage': false,
            'ai.generate': false,
            'scrapers.manage': false,
        },
    };

    return defaults[role] || defaults.viewer;
}
