import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If environment variables are missing, return a mock client that handles errors gracefully
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client that won't crash but will return empty results
        return {
            from: () => ({
                select: () => ({ data: [], error: null }),
                insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                eq: function() { return this; },
                ilike: function() { return this; },
                order: function() { return this; },
                limit: function() { return this; },
                single: function() { return { data: null, error: { message: 'Supabase not configured' } }; }
            }),
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                updateUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } })
            },
            storage: {
                from: () => ({
                    upload: async () => ({ data: null, error: { message: 'Supabase Storage not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local' } }),
                    list: async () => ({ data: [], error: { message: 'Supabase Storage not configured' } }),
                    remove: async () => ({ data: null, error: { message: 'Supabase Storage not configured' } }),
                    getPublicUrl: () => ({ publicUrl: '' })
                })
            }
        } as any;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
