/**
 * Health Check API
 * GET /api/health
 * 
 * Comprehensive health check endpoint for uptime monitoring
 * Production Safety: Enables monitoring of all critical services
 * 
 * Returns detailed health status for:
 * - Database
 * - Cache (Redis)
 * - AI Providers
 * - Workflows
 * - Metrics
 * - Circuit Breakers
 */

import { NextResponse } from 'next/server';
import { healthChecker } from '@/lib/health/health-checker';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
    const startTime = Date.now();
    
    const health = await healthChecker.getSystemHealth();
    
    // Map status to HTTP status code
    const statusCode = health.status === 'healthy' 
        ? 200 
        : health.status === 'degraded' 
        ? 200 // Still return 200 for degraded, but include status
        : 503;
    
    const totalLatency = Date.now() - startTime;
    
    return NextResponse.json(
        { 
            ...health, 
            total_latency_ms: totalLatency,
            check_duration_ms: totalLatency,
        },
        { 
            status: statusCode,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Health-Status': health.status,
            }
        }
    );
};
