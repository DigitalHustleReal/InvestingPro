import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase Client with Service Role
 * 
 * WARNING: This client bypasses RLS and should ONLY be used:
 * - In server-side code (API routes, Server Components)
 * - For admin operations
 * - NEVER expose service_role key to the browser
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }

    if (!supabaseServiceRoleKey) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Admin operations will fail.');
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Add it to .env.local');
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

