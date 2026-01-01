import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Protect admin routes - only enforce auth in production with full Supabase config
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check environment - skip auth in development/local environments
        const isProduction = process.env.NODE_ENV === 'production';
        
        // Check if Supabase environment variables are properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const hasSupabaseConfig = supabaseUrl && supabaseAnonKey && 
                                  supabaseUrl.trim() !== '' && 
                                  supabaseAnonKey.trim() !== '';

        // Skip authentication enforcement if:
        // 1. Not in production (development/local), OR
        // 2. Supabase is not configured
        // This allows direct access to /admin in development without requiring auth setup
        if (!isProduction || !hasSupabaseConfig) {
            // Allow access without authentication - client-side can handle auth checks if needed
            // This enables local development without requiring Supabase configuration
            return response;
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
            // PRODUCTION ONLY: Redirect to admin login if not authenticated
            // This redirect only happens in production with full auth setup
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

