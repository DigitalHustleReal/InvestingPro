/**
 * Build-Safe Supabase Admin Client
 * 
 * This module provides a Supabase client with service role key that is
 * LAZILY INITIALIZED to avoid build-time errors when environment variables
 * are not yet available.
 * 
 * Usage:
 *   import { getSupabaseAdmin } from '@/lib/supabase/admin';
 *   const supabase = getSupabaseAdmin();
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdmin: SupabaseClient | null = null;

/**
 * Get the Supabase admin client (lazy-initialized)
 * Throws if environment variables are not configured
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (supabaseAdmin) {
        return supabaseAdmin;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'Supabase environment variables not configured. ' +
            'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
        );
    }

    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    return supabaseAdmin;
}

/**
 * Check if Supabase admin client can be initialized
 * Returns false during build time when env vars are not available
 */
export function isSupabaseConfigured(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}
