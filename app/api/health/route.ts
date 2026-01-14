/**
 * Health Check API
 * GET /api/health
 * 
 * Basic health check endpoint for uptime monitoring
 */

import { NextResponse } from 'next/server';

export const GET = async () => {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'investingpro-api',
  });
};
