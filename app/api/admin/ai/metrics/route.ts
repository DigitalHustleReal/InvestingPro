/**
 * AI Provider Metrics API
 * Returns performance metrics for all AI providers
 */

import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const providers = aiService.getProviderMetrics();
        const summary = aiService.getMetricsSummary();
        
        return NextResponse.json({
            providers,
            summary,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching AI metrics:', error);
        return NextResponse.json(
            { 
                providers: {},
                summary: {
                    totalCalls: 0,
                    overallSuccessRate: 100,
                    avgLatencyMs: 0,
                    healthyProviders: 0,
                    degradedProviders: [],
                },
                error: 'Failed to fetch metrics' 
            },
            { status: 200 } // Return 200 with empty data to not break dashboard
        );
    }
}
