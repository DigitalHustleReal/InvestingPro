/**
 * OAuth & Magic Link Callback Handler
 * 
 * Handles redirects from:
 * - OAuth providers (Google, etc.) — uses `code` param
 * - Magic links (email OTP) — uses `token_hash` + `type` params
 * 
 * Uses `source` param to know which login page originated the request:
 * - source=admin → errors go to /admin/login, only admins allowed
 * - source=platform → errors go to /login, users go to /dashboard
 */

import { createServerClient } from '@supabase/ssr';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // Auth params
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // Routing params
  const source = searchParams.get('source') || 'admin';
  const redirect = searchParams.get('redirect') 
    || searchParams.get('next') 
    || searchParams.get('redirect_to') 
    || '/';

  const errorLoginPage = source === 'platform' ? '/login' : '/admin/login';

  logger.info('[AUTH CALLBACK] Received:', { 
    hasCode: !!code, hasTokenHash: !!token_hash, type, 
    source, redirect, error: error || 'none' 
  });

  // Handle auth errors
  if (error) {
    logger.error('[AUTH CALLBACK] Auth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}${errorLoginPage}?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // ===== Cookie-forwarding Supabase client =====
  // We collect cookies set by exchangeCodeForSession / verifyOtp
  // and forward them on the final redirect response.
  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options: any }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Store for forwarding on the redirect response
            pendingCookies.push({ name, value, options });
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // Swallow — will be forwarded on the redirect response
            }
          });
        },
      },
    }
  );

  let session = null;

  // PATH 1: OAuth Code Exchange
  if (code) {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      logger.error('[AUTH CALLBACK] Code exchange error:', exchangeError);
      return NextResponse.redirect(
        `${origin}${errorLoginPage}?error=${encodeURIComponent(exchangeError.message)}`
      );
    }
    session = data.session;
  }
  
  // PATH 2: Magic Link Token Hash
  if (!session && token_hash && type) {
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    if (verifyError) {
      logger.error('[AUTH CALLBACK] Magic link verification error:', verifyError);
      return NextResponse.redirect(
        `${origin}${errorLoginPage}?error=${encodeURIComponent(verifyError.message)}`
      );
    }
    session = data.session;
  }

  // PATH 3: Check existing session
  if (!session) {
    const { data: { session: existingSession } } = await supabase.auth.getSession();
    session = existingSession;
  }

  // Process authenticated session
  if (session?.user) {
    // Ensure user_profiles entry exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, role, email')
      .eq('id', session.user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.from('user_profiles').insert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
        role: 'user',
        created_at: new Date().toISOString(),
      });
    }

    // Check role in both tables
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const userRole = roleData?.role || profile?.role || 'user';
    const isSystemAdmin = userRole === 'admin';

    // ===== STRICT LOGIN SEPARATION =====
    let finalRedirect = redirect;

    if (source === 'admin') {
      // Admin login: only admins allowed
      if (!isSystemAdmin) {
        logger.warn(`[AUTH CALLBACK] Non-admin (${session.user.email}) tried admin login`);
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/admin/login?error=${encodeURIComponent('Access denied. Admin privileges required.')}`
        );
      }
      // Admin ALWAYS goes to admin dashboard
      finalRedirect = '/admin';
    } else {
      // Platform login
      if (isSystemAdmin) {
        finalRedirect = '/admin';
      } else {
        if (finalRedirect.startsWith('/admin')) {
          finalRedirect = '/dashboard';
        }
        if (finalRedirect === '/') {
          finalRedirect = '/dashboard';
        }
      }
    }

    logger.info(`[AUTH CALLBACK] ✅ ${session.user.email} (${userRole}) → ${finalRedirect}`);
    
    // Build redirect response WITH session cookies
    const response = NextResponse.redirect(`${origin}${finalRedirect}`);
    
    // Forward all Supabase session cookies onto the redirect response
    for (const cookie of pendingCookies) {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }
    
    return response;
  }

  // No session — send back to the login page they came from
  logger.warn('[AUTH CALLBACK] No session established');
  return NextResponse.redirect(
    `${origin}${errorLoginPage}?error=${encodeURIComponent('Login failed. Please try again.')}`
  );
}
