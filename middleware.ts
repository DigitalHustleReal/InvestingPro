
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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

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

    // Role check for /admin routes
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      console.warn(`[MIDDLEWARE] Non-admin access attempt: ${user.email} on ${request.nextUrl.pathname}`);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Record Metrics (Non-blocking / Fire-and-forget)
  // We Wrap in try-catch to ensure middleware never fails due to metrics
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
      // Ignore metrics errors in production to prevent blocking requests
      // console.error('Metrics recording failed', e);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
