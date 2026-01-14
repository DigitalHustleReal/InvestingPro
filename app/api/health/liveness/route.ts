/**
 * Liveness Probe
 * GET /api/health/liveness
 * 
 * Kubernetes-style liveness probe
 * Returns 200 if service is alive
 */

import { NextResponse } from 'next/server';

export const GET = async () => {
  return NextResponse.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
};
