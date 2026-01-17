/**
 * SERVER-ONLY: This module uses next/headers which is server-only
 * Do not import in client components
 */
import 'server-only';

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If environment variables are missing, return a mock client that handles errors gracefully
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client that won't crash but will return empty results
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

    return createServerClient(
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
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `remove` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
