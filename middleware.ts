import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { setRequestContext, clearRequestContext } from '@/lib/middleware/request-context';
import { nanoid } from 'nanoid';

export async function middleware(request: NextRequest) {
    // Generate correlation ID for request tracking
    const correlationId = nanoid();
    const requestId = request.headers.get('x-request-id') || nanoid();
    
    // Set request context for logging
    setRequestContext(correlationId, requestId);

    // Add correlation ID to response headers
    const response = NextResponse.next();
    response.headers.set('x-correlation-id', correlationId);
    response.headers.set('x-request-id', requestId);

    // Protect admin routes (UI and API)
    const isAdminUI = request.nextUrl.pathname.startsWith('/admin');
    const isAdminAPI = request.nextUrl.pathname.startsWith('/api/admin');

    if (isAdminUI || isAdminAPI) {
        // Allow login page without auth (only for UI)
        if (isAdminUI && request.nextUrl.pathname === '/admin/login') {
            return response;
        }

        // Check if Supabase environment variables are properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            // Development/Staging: Allow access with warning
            if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview') {
                console.warn('⚠️ Supabase not configured - allowing access in development/preview');
                return response;
            }

            // Production: Redirect to login with error
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            url.searchParams.set('error', 'supabase_not_configured');
            return NextResponse.redirect(url);
        }

        // PRODUCTION ONLY: Enforce authentication when Supabase is fully configured
        // All auth logic below only runs in production with valid Supabase config

        // Create Supabase client for middleware authentication
        const supabase = createServerClient(
            supabaseUrl!,
            supabaseAnonKey!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: any) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        )

        // Check if user is authenticated
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            // PRODUCTION ONLY: Return 401 for API, Redirect for UI
            if (isAdminAPI) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            url.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(url)
        }

        // Check if user has admin role
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            // PRODUCTION ONLY: Redirect to home if user doesn't have admin role
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Cleanup: Clear request context after response (in background)
    // Note: This runs after response is sent, so it's fire-and-forget
    setTimeout(() => {
        clearRequestContext();
    }, 0);

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
