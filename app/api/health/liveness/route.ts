/**
 * Liveness Probe
 * GET /api/health/liveness
 * 
 * Kubernetes-style liveness probe
 * Returns 200 if service is alive (process is running)
 * 
 * This is a lightweight check that only verifies the process is running.
 * Use /api/health/readiness for dependency checks.
 */

import { NextResponse } from 'next/server';
import { healthChecker } from '@/lib/health/health-checker';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
  const isAlive = await healthChecker.checkLiveness();
  
  if (!isAlive) {
    return NextResponse.json(
      {
        status: 'dead',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
  
  return NextResponse.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
