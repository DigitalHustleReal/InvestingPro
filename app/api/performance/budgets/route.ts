/**
 * Performance Budgets API
 * GET /api/performance/budgets
 * 
 * Returns performance budget compliance status
 */

import { NextResponse } from 'next/server';
import { performanceBudgetMonitor, PERFORMANCE_BUDGETS } from '@/lib/performance/performance-budgets';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/performance/budgets', {
  rateLimitType: 'authenticated',
  trackMetrics: false,
})(
  async () => {
    try {
      const budgetCheck = performanceBudgetMonitor.checkBudgets();
      const violations = performanceBudgetMonitor.getViolations();

      return NextResponse.json({
        success: true,
        budgets: PERFORMANCE_BUDGETS,
        compliance: {
          passed: budgetCheck.passed,
          violations: budgetCheck.violations,
          violationCounts: violations,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }
);
