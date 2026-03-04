
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rateLimit } from '@/lib/middleware/rate-limit';
import '@/lib/env-validator'; // Runtime validation of critical variables
import { metricsStore } from '@/lib/metrics/store';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Apply Rate Limiting
  const path = request.nextUrl.pathname;
  if (path.startsWith('/api') || path.startsWith('/admin')) {
    const type = path.startsWith('/admin') ? 'admin' : (path.startsWith('/api/ai') ? 'ai' : 'public');
    const rl = await rateLimit(request, type);

    if (rl && !rl.success) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rl.reset },
        { status: 429, headers: { 'Retry-After': Math.ceil((rl.reset - Date.now()) / 1000).toString() } }
      );
    }
  }

  // ===== Supabase client with PROPER cookie forwarding =====
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session / exchange OAuth code if present
  const { data: { user } } = await supabase.auth.getUser();

  // ===== Shared role lookup — single DB query, cached for this request =====
  // Queries user_roles first (primary), falls back to user_profiles if needed
  let cachedRole: string | null = null;
  async function getUserRole(): Promise<string> {
    if (cachedRole !== null) return cachedRole;
    if (!user) { cachedRole = 'user'; return cachedRole; }

    // Single query to user_roles (primary source of truth)
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role) {
      cachedRole = roleData.role;
      return cachedRole;
    }

    // Fallback: check user_profiles only if user_roles returned nothing
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    cachedRole = profile?.role || 'user';
    return cachedRole;
  }

  // ===== Handle OAuth code exchange landing on homepage =====
  const hasCode = request.nextUrl.searchParams.has('code');
  if (hasCode && user && request.nextUrl.pathname === '/') {
    const userRole = await getUserRole();
    
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete('code');
    
    if (userRole === 'admin') {
      redirectUrl.pathname = '/admin';
    } else {
      redirectUrl.pathname = '/dashboard';
    }
    
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Protected Routes Logic
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin');
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login') || request.nextUrl.pathname.startsWith('/admin/signup');

  if (isAdminRoute && !isAuthPage) {
    if (!user) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Role check — reuses cached result if OAuth path already fetched it
    const role = await getUserRole();

    if (role !== 'admin') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Record Metrics (Non-blocking / Fire-and-forget)
  try {
      const duration = Date.now() - startTime;
      metricsStore.recordRequest({
          method: request.method,
          path: request.nextUrl.pathname,
          statusCode: response.status,
          duration: duration,
          timestamp: new Date().toISOString(),
          ip: request.ip || 'unknown'
      });
  } catch (e) {
      // Ignore metrics errors in production
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
