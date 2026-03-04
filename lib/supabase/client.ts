import { createBrowserClient as supabaseCreateBrowserClient } from '@supabase/ssr'
import { logger } from '@/lib/logger';

// Singleton instance for the browser
let browserClient: any = null;

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Return existing browser client if it's already initialized and we are in the browser
    if (typeof window !== 'undefined') {
        if (browserClient) return browserClient;
    }

    // If environment variables are missing, return a mock client that handles errors gracefully
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined') {
        if (typeof window !== 'undefined') {
            logger.warn('Supabase credentials missing. Using mock client.');
        }

        // Return a mock client that won't crash but will return empty results
        const mockError = { message: 'Supabase not configured', code: 'MOCK_CLIENT' };
        const mockResponse = { data: [], error: mockError, count: 0 };
        const mockClient = {
            from: () => ({
                select: () => ({ 
                    ...mockResponse,
                    order: function() { return this; },
                    limit: function() { return this; },
                    eq: function() { return this; },
                    gte: function() { return this; },
                    lte: function() { return this; },
                    lt: function() { return this; },
                    count: 0
                }),
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
                updateUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
                getSession: async () => ({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
            },
            storage: {
                from: () => ({
                    upload: async () => ({ data: null, error: { message: 'Supabase Storage not configured' } }),
                    list: async () => ({ data: [], error: { message: 'Supabase Storage not configured' } }),
                    remove: async () => ({ data: null, error: { message: 'Supabase Storage not configured' } }),
                    getPublicUrl: () => ({ publicUrl: '' })
                })
            },
            rpc: async () => ({ data: null, error: { message: 'Supabase RPC not configured' } })
        } as any;

        if (typeof window !== 'undefined') browserClient = mockClient;
        return mockClient;
    }

    // Create a new client
    const client = supabaseCreateBrowserClient(supabaseUrl, supabaseAnonKey);
    
    // Cache the client if we are in the browser
    if (typeof window !== 'undefined') {
        browserClient = client;
    }
    
    return client;
}

// Alias for compatibility with common patterns
export const createBrowserClient = createClient;
