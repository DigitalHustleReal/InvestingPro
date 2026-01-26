import { createClient as supabaseCreateClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Service Client
 * 
 * Bypasses RLS. Use ONLY in server-side workers and cron jobs.
 * DO NOT use in client-side code or regular API routes unless strictly necessary.
 */

// Singleton instance to prevent multiple client creations
let _serviceClient: SupabaseClient | null = null;

export function createServiceClient(): SupabaseClient {
    // Return cached instance if available
    if (_serviceClient) {
        return _serviceClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase service role configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }

    _serviceClient = supabaseCreateClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
            flowType: 'implicit',
            // Custom storage that does nothing (prevents any storage access)
            storage: {
                getItem: () => null,
                setItem: () => {},
                removeItem: () => {}
            }
        },
        db: {
            schema: 'public'
        }
    });

    return _serviceClient;
}

// Alias for compatibility with internal tools/generators
export const createClient = createServiceClient;
