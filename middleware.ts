import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { setRequestContext, clearRequestContext } from '@/lib/middleware/request-context';
import { nanoid } from 'nanoid';

// =============================================================================
// TENANT DETECTION HELPERS
// =============================================================================

interface TenantIdentification {
    identifier: string | null;
    source: 'header' | 'subdomain' | 'domain' | 'default';
}

/**
 * Extract tenant identifier from request
 * Priority: Header > Subdomain > Custom Domain > Default
 */
function extractTenantIdentifier(request: NextRequest): TenantIdentification {
    const url = request.nextUrl;
    const hostname = url.hostname;

    // 1. Check for explicit tenant header (useful for API calls)
    const tenantHeader = request.headers.get('x-tenant-id') 
        || request.headers.get('x-tenant-slug');
    
    if (tenantHeader) {
        return { identifier: tenantHeader, source: 'header' };
    }

    // 2. Check for subdomain (e.g., acme.investingpro.in)
    const baseDomains = [
        'investingpro.in',
        'investingpro.com',
        'localhost',
        '127.0.0.1',
    ];

    // Handle localhost with port
    const hostnameWithoutPort = hostname.split(':')[0];

    for (const baseDomain of baseDomains) {
        if (hostnameWithoutPort.endsWith(baseDomain) && hostnameWithoutPort !== baseDomain) {
            // Extract subdomain
            const subdomain = hostnameWithoutPort.replace(`.${baseDomain}`, '').split('.')[0];
            
            // Skip common subdomains that aren't tenants
            const reservedSubdomains = ['www', 'api', 'admin', 'app', 'staging', 'dev', 'test'];
            if (!reservedSubdomains.includes(subdomain)) {
                return { identifier: subdomain, source: 'subdomain' };
            }
        }
    }

    // 3. Check if it's a custom domain (not our base domains)
    const isBaseDomain = baseDomains.some(d => 
        hostnameWithoutPort === d || hostnameWithoutPort.endsWith(`.${d}`)
    );
    
    if (!isBaseDomain) {
        return { identifier: hostnameWithoutPort, source: 'domain' };
    }

    // 4. Default to main tenant
    return { identifier: 'main', source: 'default' };
}

// =============================================================================
// MAIN MIDDLEWARE
// =============================================================================

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

    // =============================================================================
    // TENANT DETECTION (Optional - doesn't block requests)
    // =============================================================================
    
    try {
        const { identifier, source } = extractTenantIdentifier(request);
        
        if (identifier) {
            // Add tenant info to response headers for downstream use
            response.headers.set('x-tenant-slug', identifier);
            response.headers.set('x-tenant-source', source);
            
            // Log tenant detection (only in development for debugging)
            if (process.env.NODE_ENV === 'development') {
                console.log(`🏢 Tenant: ${identifier} (via ${source})`);
            }
        }
    } catch (error) {
        // Tenant detection is optional - don't fail the request
        console.warn('Tenant detection error:', error);
    }

    // Protect admin routes (UI and API)
    const isAdminUI = request.nextUrl.pathname.startsWith('/admin');
    const isAdminAPI = request.nextUrl.pathname.startsWith('/api/admin');

    if (isAdminUI || isAdminAPI) {
        // DEVELOPMENT MODE: Bypass all authentication checks
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Development mode: Bypassing admin authentication');
            return response;
        }

        // PRODUCTION MODE: Enforce authentication
        // Allow login page without auth (only for UI)
        if (isAdminUI && request.nextUrl.pathname === '/admin/login') {
            return response;
        }

        // Check if Supabase environment variables are properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            // Production: Redirect to login with error
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            url.searchParams.set('error', 'supabase_not_configured');
            return NextResponse.redirect(url);
        }

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
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle() // Use maybeSingle() to handle missing profiles gracefully

        // Production: Check admin role
        if (!profile || profile?.role !== 'admin') {
            // Redirect to home if user doesn't have admin role
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
