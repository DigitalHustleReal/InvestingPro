/**
 * Readiness Probe
 * GET /api/health/readiness
 * 
 * Kubernetes-style readiness probe
 * Returns 200 if service is ready to accept traffic
 * 
 * Checks critical dependencies:
 * - Database connectivity
 * - AI providers availability
 * 
 * Use this for load balancer health checks.
 */

import { NextResponse } from 'next/server';
import { healthChecker } from '@/lib/health/health-checker';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
  const readiness = await healthChecker.checkReadiness();
  
  if (!readiness.ready) {
    return NextResponse.json(
      {
        status: 'not_ready',
        reason: readiness.reason,
        timestamp: new Date().toISOString(),
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }

  return NextResponse.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
