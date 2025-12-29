import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin Articles API Route
 * 
 * Fetches all articles using service_role (bypasses RLS)
 * This is secure because:
 * 1. Service role key is server-side only (never exposed to browser)
 * 2. Route requires authentication (basic check)
 * 3. RLS policies remain unchanged (service_role bypasses them)
 */
export async function GET() {
    try {
        // Basic authentication check - ensure user is logged in
        // In development, we allow access even without auth for easier debugging
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        // Only enforce auth in production
        if (!isDevelopment && (authError || !user)) {
            console.warn('Admin articles API: Unauthorized access attempt');
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Please log in to access admin articles' },
                { status: 401 }
            );
        }
        
        // Log auth status for debugging
        if (isDevelopment) {
            console.log('Admin articles API: Auth check', { 
                hasUser: !!user, 
                authError: authError?.message,
                mode: 'development (auth check relaxed)'
            });
        }

        // Use admin client (service_role) to fetch all articles, bypassing RLS
        let adminSupabase;
        try {
            adminSupabase = createAdminClient();
        } catch (clientError: any) {
            console.error('Failed to create admin client:', clientError.message);
            return NextResponse.json(
                { 
                    error: 'Configuration error', 
                    message: clientError.message,
                    hint: 'Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local'
                },
                { status: 500 }
            );
        }

        // Fetch all articles, ordered by updated_at DESC (fallback to created_at)
        const { data, error } = await adminSupabase
            .from('articles')
            .select('*')
            .order('updated_at', { ascending: false, nullsLast: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Admin articles API query error:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return NextResponse.json(
                { 
                    error: 'Failed to fetch articles', 
                    message: error.message,
                    code: error.code
                },
                { status: 500 }
            );
        }

        console.log(`Admin articles API: Successfully fetched ${data?.length || 0} articles`);
        return NextResponse.json({ articles: data || [] });
    } catch (error: any) {
        console.error('Admin articles API exception:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json(
            { 
                error: 'Internal server error', 
                message: error.message 
            },
            { status: 500 }
        );
    }
}

