/**
 * Readiness Probe
 * GET /api/health/readiness
 * 
 * Kubernetes-style readiness probe
 * Returns 200 if service is ready to accept traffic
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const GET = async () => {
  try {
    // Check critical dependencies
    const supabase = await createClient();
    const { error } = await supabase.from('articles').select('id').limit(1);
    
    if (error) {
      return NextResponse.json(
        { status: 'not_ready', error: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'not_ready',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
};
