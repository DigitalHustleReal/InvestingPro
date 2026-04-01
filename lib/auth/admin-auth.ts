/**
 * Admin Authentication Module
 * Week 1 Task 2: Implement proper admin authentication
 * 
 * This replaces the TODO in lib/auth/admin-auth.ts
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { cache } from 'react';

/**
 * Check if a user has admin role
 * Uses React cache to prevent duplicate database queries
 */
export const isAdmin = cache(async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.error('[Admin Auth] Error checking admin status:', error);
      return false;
    }

    return data?.role === 'admin';
  } catch (error) {
    logger.error('[Admin Auth] Unexpected error:', error);
    return false;
  }
});

/**
 * Check if a user has editor role (can create/edit content)
 */
export const isEditor = cache(async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) return false;

    return data?.role === 'admin' || data?.role === 'editor';
  } catch (error) {
    return false;
  }
});

/**
 * Require admin authentication
 * Throws error if user is not authenticated or not an admin
 * Use in server components and API routes
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized: Not logged in');
  }

  const admin = await isAdmin(user.id);
  
  if (!admin) {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}

/**
 * Require editor authentication (admin or editor role)
 * Use for content management features
 */
export async function requireEditor() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized: Not logged in');
  }

  const editor = await isEditor(user.id);
  
  if (!editor) {
    throw new Error('Forbidden: Editor access required');
  }

  return user;
}

/**
 * Get current user with role information
 * Returns null if not authenticated
 */
export async function getCurrentUserWithRole() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    return {
      ...user,
      role: roleData?.role || 'viewer',
    };
  } catch (error) {
    return null;
  }
}
