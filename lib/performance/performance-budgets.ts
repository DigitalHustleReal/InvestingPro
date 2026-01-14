/**
 * Performance Budgets
 * Defines performance targets and monitors compliance
 */

import { performanceMonitor } from './performance-monitor';
import { logger } from '@/lib/logger';

export interface PerformanceBudget {
  name: string;
  metric: string;
  target: {
    p50?: number; // milliseconds
    p95?: number; // milliseconds
    p99?: number; // milliseconds
  };
  alertThreshold?: {
    p95?: number;
    p99?: number;
  };
}

// Performance budgets for different operations
export const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  // API Performance
  {
    name: 'API Request',
    metric: 'api.request',
    target: {
      p50: 100,
      p95: 500,
      p99: 1000,
    },
    alertThreshold: {
      p95: 1000,
      p99: 2000,
    },
  },
  // Database Queries
  {
    name: 'Database Query',
    metric: 'db.query',
    target: {
      p50: 50,
      p95: 200,
      p99: 500,
    },
    alertThreshold: {
      p95: 500,
      p99: 1000,
    },
  },
  // Article Operations
  {
    name: 'Article Fetch',
    metric: 'article.fetch',
    target: {
      p50: 100,
      p95: 300,
      p99: 600,
    },
  },
  // Search Operations
  {
    name: 'Search Query',
    metric: 'search.query',
    target: {
      p50: 150,
      p95: 500,
      p99: 1000,
    },
  },
  // Product Operations
  {
    name: 'Product Fetch',
    metric: 'product.fetch',
    target: {
      p50: 100,
      p95: 400,
      p99: 800,
    },
  },
];

class PerformanceBudgetMonitor {
  private violations: Map<string, number> = new Map();

  /**
   * Check if metrics meet performance budgets
   */
  checkBudgets(): {
    passed: boolean;
    violations: Array<{
      budget: string;
      metric: string;
      actual: Record<string, number>;
      target: Record<string, number>;
    }>;
  } {
    const violations: Array<{
      budget: string;
      metric: string;
      actual: Record<string, number>;
      target: Record<string, number>;
    }> = [];

    for (const budget of PERFORMANCE_BUDGETS) {
      const stats = performanceMonitor.getStats(budget.metric);
      if (!stats) continue;

      const actual: Record<string, number> = {};
      const target: Record<string, number> = {};

      // Check p95
      if (budget.target.p95 && stats.p95 > budget.target.p95) {
        actual.p95 = stats.p95;
        target.p95 = budget.target.p95;
        violations.push({
          budget: budget.name,
          metric: budget.metric,
          actual,
          target,
        });
        this.recordViolation(budget.name);
      }

      // Check p99
      if (budget.target.p99 && stats.p99 > budget.target.p99) {
        actual.p99 = stats.p99;
        target.p99 = budget.target.p99;
        violations.push({
          budget: budget.name,
          metric: budget.metric,
          actual,
          target,
        });
        this.recordViolation(budget.name);
      }
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  /**
   * Record a budget violation
   */
  private recordViolation(budgetName: string): void {
    const count = this.violations.get(budgetName) || 0;
    this.violations.set(budgetName, count + 1);

    // Log violation
    logger.warn('Performance budget violated', {
      budget: budgetName,
      violationCount: count + 1,
    });
  }

  /**
   * Get violation statistics
   */
  getViolations(): Record<string, number> {
    return Object.fromEntries(this.violations);
  }

  /**
   * Reset violation counts
   */
  resetViolations(): void {
    this.violations.clear();
  }
}

// Export singleton instance
export const performanceBudgetMonitor = new PerformanceBudgetMonitor();
