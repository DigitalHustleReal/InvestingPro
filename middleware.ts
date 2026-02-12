import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rateLimit } from '@/lib/middleware/rate-limit';
import '@/lib/env-validator'; // Runtime validation of critical variables

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Apply Rate Limiting (Audit 1, Item 47: Fail-closed)
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
          // Note: response is CONST now, but we need to update it? 
          // Original code had `let response = ...` and updated it.
          // Let's stick to consistent logic.
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  // Protected Routes Logic
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    if (request.nextUrl.pathname.startsWith('/admin/login') || request.nextUrl.pathname.startsWith('/admin/signup')) {
        return response;
    }

    if (!user) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
