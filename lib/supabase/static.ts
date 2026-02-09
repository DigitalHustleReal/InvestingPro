/**
 * Static Supabase Client
 * 
 * For use in static generation (generateStaticParams, etc.)
 * Does not use cookies, suitable for server-side static rendering
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('[CRITICAL] Missing Supabase environment variables:', {
            url: !!supabaseUrl,
            key: !!supabaseAnonKey
        });
        throw new Error('Missing required Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
    }

    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
