/**
 * SERVER-ONLY: This module uses next/headers which is server-only
 * Do not import in client components
 */
// import 'server-only';
import { createServerClient as supabaseCreateServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
// import { cookies } from 'next/headers'

/**
 * Mock client for when Supabase is not configured or during specific build phases
 */
function mockClient() {
    return {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            eq: function() { return this; },
            ilike: function() { return this; },
            order: function() { return this; },
            limit: function() { return this; },
            single: function() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); }
        }),
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            updateUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } })
        }
    } as any;
}

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Use a try-catch for cookies() to handle build-time vs runtime
    // In Next.js 15, cookies() is async and throws if called outside of request context
    let cookieStore;
    try {
        // Dynamic import to avoid crash in CLI/Non-Next environments
        const { cookies } = await import('next/headers');
        cookieStore = await cookies();
    } catch (error) {
        // Outside of request context (e.g., build time static generation or CLI script)
        // Return a standard client that doesn't use cookies
        if (!supabaseUrl || !supabaseAnonKey) {
            return mockClient();
        }
        // In build time, we want to return a client that doesn't crash but also doesn't try to use cookies
        // Use mockClient() if we're strictly checking for build environment, or create a basic client
        // For static generation involving data fetching, use basic client.
        return createSupabaseClient(supabaseUrl, supabaseAnonKey);
    }
    
    // Safety check for cookieStore - if it's undefined (shouldn't happen due to try/catch but for type safety)
    if (!cookieStore) {
        return createSupabaseClient(supabaseUrl!, supabaseAnonKey!);
    }

    // If environment variables are missing, return a mock client
    if (!supabaseUrl || !supabaseAnonKey) {
        return mockClient();
    }

    return supabaseCreateServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `remove` method was called from a Server Component.
                    }
                },
            },
        }
    )
}

// Alias for compatibility with common patterns
export const createServerClient = createClient;
