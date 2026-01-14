/**
 * Detailed Health Check API
 * GET /api/health/detailed
 * 
 * Checks service dependencies (database, external services)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const GET = async () => {
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};
  const startTime = Date.now();

  // Check database connection
  try {
    const dbStart = Date.now();
    const supabase = await createClient();
    const { error } = await supabase.from('articles').select('id').limit(1);
    const dbLatency = Date.now() - dbStart;
    
    checks.database = {
      status: error ? 'degraded' : 'healthy',
      latency: dbLatency,
      ...(error ? { error: error.message } : {}),
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Check cache (if configured)
  try {
    const cacheStart = Date.now();
    const { cacheService } = await import('@/lib/cache');
    const stats = await cacheService.getStats();
    const cacheLatency = Date.now() - cacheStart;
    
    checks.cache = {
      status: stats.enabled ? 'healthy' : 'not_configured',
      latency: cacheLatency,
    };
  } catch (error) {
    checks.cache = {
      status: 'not_configured',
    };
  }

  const overallStatus = Object.values(checks).every(
    check => check.status === 'healthy' || check.status === 'not_configured'
  ) ? 'healthy' : 'degraded';

  const totalLatency = Date.now() - startTime;

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    latency_ms: totalLatency,
  });
};
