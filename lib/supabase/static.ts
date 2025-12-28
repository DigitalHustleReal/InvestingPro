/**
 * Static Supabase Client
 * 
 * For use in static generation (generateStaticParams, etc.)
 * Does not use cookies, suitable for server-side static rendering
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

