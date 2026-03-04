/**
 * Admin API Guard
 * Reusable helper for API routes under /api/admin/*
 * Verifies the caller is both authenticated AND has admin role.
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function requireAdminApi() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase,
      error: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      ),
    };
  }

  // Check admin role in user_roles table (primary) then user_profiles (fallback)
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  let isAdmin = roleData?.role === 'admin';

  if (!isAdmin) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    isAdmin = profile?.role === 'admin';
  }

  if (!isAdmin) {
    logger.warn(`Non-admin API access attempt by ${user.email}`);
    return {
      user: null,
      supabase,
      error: NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      ),
    };
  }

  return { user, supabase, error: null };
}
