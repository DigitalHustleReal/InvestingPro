/**
 * OAuth Callback Handler
 * 
 * Handles redirect from OAuth providers (Google, etc.)
 * Creates user profile if needed and redirects to destination
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth error
  if (error) {
    console.error('[AUTH CALLBACK] OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('[AUTH CALLBACK] Code exchange error:', exchangeError);
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (session?.user) {
      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, role')
        .eq('id', session.user.id)
        .single();

      // Create profile if it doesn't exist
      if (profileError?.code === 'PGRST116' || !profile) {
        const newProfile = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
          role: 'user', // Default role - admin must be set manually
          created_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(newProfile);

        if (insertError) {
          console.error('[AUTH CALLBACK] Profile creation error:', insertError);
        }
      }

      // Check if admin access is required
      if (redirect.startsWith('/admin')) {
        const { data: adminProfile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (adminProfile?.role !== 'admin') {
          return NextResponse.redirect(
            `${origin}/admin/login?error=${encodeURIComponent('Access denied. Admin role required.')}`
          );
        }
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/admin/login`);
}
