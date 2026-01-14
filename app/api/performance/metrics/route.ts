/**
 * Performance Metrics API
 * GET /api/performance/metrics
 */

import { NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/performance/performance-monitor';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/performance/metrics', {
  rateLimitType: 'authenticated',
  trackMetrics: false, // Don't track metrics for metrics endpoint
})(
  async () => {
    const summary = performanceMonitor.getSummary();
    
    return NextResponse.json({
      success: true,
      metrics: summary,
      timestamp: new Date().toISOString(),
    });
  }
);
