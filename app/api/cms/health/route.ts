import { NextResponse } from 'next/server';
import { HealthMonitorAgent } from '@/lib/agents/health-monitor-agent';
import { logger } from '@/lib/logger';

const healthMonitor = new HealthMonitorAgent();

/**
 * System Health Check API
 */
export async function GET() {
    try {
        const health = await healthMonitor.getSystemHealth();
        
        const statusCode = health.overall === 'healthy' ? 200 :
                          health.overall === 'degraded' ? 200 : 503;
        
        return NextResponse.json({
            success: true,
            health,
            timestamp: new Date().toISOString()
        }, { status: statusCode });
    } catch (error: any) {
        logger.error('Health check failed', error);
        return NextResponse.json({
            success: false,
            health: {
                overall: 'unhealthy',
                error: error.message
            },
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
}
