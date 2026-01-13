import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Protect admin routes (UI and API)
    const isAdminUI = request.nextUrl.pathname.startsWith('/admin');
    const isAdminAPI = request.nextUrl.pathname.startsWith('/api/admin');

    if (isAdminUI || isAdminAPI) {
        // Allow login page without auth (only for UI)
        if (isAdminUI && request.nextUrl.pathname === '/admin/login') {
            return response;
        }

        // Check if Supabase environment variables are properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const hasSupabaseConfig = supabaseUrl && supabaseAnonKey && 
                                  supabaseUrl.trim() !== '' && 
                                  supabaseAnonKey.trim() !== '';

        // SECURE DEV BYPASS: Only allow bypass with explicit secret key
        // Set ADMIN_BYPASS_KEY in .env.local for local development ONLY
        // NEVER set this in production
        const bypassKey = process.env.ADMIN_BYPASS_KEY;
        const requestBypassKey = request.headers.get('x-admin-bypass') || 
                                 request.cookies.get('admin_bypass')?.value;
        
        if (bypassKey && requestBypassKey === bypassKey) {
            // Explicit bypass for local development with secret key
            console.warn('[MIDDLEWARE] Admin bypass active - NEVER use in production');
            return response;
        }

        // If Supabase not configured and no bypass key, show helpful error
        if (!hasSupabaseConfig) {
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
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
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

