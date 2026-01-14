/**
 * Performance Budgets
 * 
 * Defines performance budgets and thresholds for monitoring
 */

export interface PerformanceBudget {
    name: string;
    threshold: number;
    unit: 'bytes' | 'ms' | 'score';
    severity: 'error' | 'warning';
}

export const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
    // Bundle Size Budgets
    {
        name: 'Initial JavaScript Bundle',
        threshold: 200 * 1024, // 200KB
        unit: 'bytes',
        severity: 'error',
    },
    {
        name: 'Total JavaScript Bundle',
        threshold: 500 * 1024, // 500KB
        unit: 'bytes',
        severity: 'error',
    },
    {
        name: 'Initial CSS Bundle',
        threshold: 50 * 1024, // 50KB
        unit: 'bytes',
        severity: 'warning',
    },
    
    // Performance Metrics
    {
        name: 'First Contentful Paint (FCP)',
        threshold: 1500, // 1.5s
        unit: 'ms',
        severity: 'error',
    },
    {
        name: 'Largest Contentful Paint (LCP)',
        threshold: 2500, // 2.5s
        unit: 'ms',
        severity: 'error',
    },
    {
        name: 'Time to Interactive (TTI)',
        threshold: 3000, // 3s
        unit: 'ms',
        severity: 'error',
    },
    {
        name: 'Total Blocking Time (TBT)',
        threshold: 300, // 300ms
        unit: 'ms',
        severity: 'warning',
    },
    {
        name: 'Cumulative Layout Shift (CLS)',
        threshold: 0.1, // 0.1
        unit: 'score',
        severity: 'error',
    },
    
    // Lighthouse Scores
    {
        name: 'Performance Score',
        threshold: 90, // 90/100
        unit: 'score',
        severity: 'error',
    },
    {
        name: 'Accessibility Score',
        threshold: 95, // 95/100
        unit: 'score',
        severity: 'error',
    },
    {
        name: 'Best Practices Score',
        threshold: 90, // 90/100
        unit: 'score',
        severity: 'warning',
    },
    {
        name: 'SEO Score',
        threshold: 90, // 90/100
        unit: 'score',
        severity: 'error',
    },
];

/**
 * Check if a metric violates budget
 */
export function checkBudget(
    name: string,
    value: number,
    budgets: PerformanceBudget[] = PERFORMANCE_BUDGETS
): { passed: boolean; budget?: PerformanceBudget } {
    const budget = budgets.find(b => b.name === name);
    if (!budget) {
        return { passed: true };
    }

    const passed = value <= budget.threshold;
    return { passed, budget };
}

/**
 * Format budget violation message
 */
export function formatBudgetViolation(budget: PerformanceBudget, actual: number): string {
    const unit = budget.unit === 'bytes' 
        ? formatBytes(actual)
        : budget.unit === 'ms'
        ? `${actual.toFixed(0)}ms`
        : actual.toFixed(2);

    const threshold = budget.unit === 'bytes'
        ? formatBytes(budget.threshold)
        : budget.unit === 'ms'
        ? `${budget.threshold}ms`
        : budget.threshold.toFixed(2);

    return `${budget.name}: ${unit} exceeds budget of ${threshold} (${budget.severity})`;
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get all budget violations
 */
export function getBudgetViolations(
    metrics: Record<string, number>,
    budgets: PerformanceBudget[] = PERFORMANCE_BUDGETS
): Array<{ budget: PerformanceBudget; actual: number; message: string }> {
    const violations: Array<{ budget: PerformanceBudget; actual: number; message: string }> = [];

    for (const [name, value] of Object.entries(metrics)) {
        const result = checkBudget(name, value, budgets);
        if (!result.passed && result.budget) {
            violations.push({
                budget: result.budget,
                actual: value,
                message: formatBudgetViolation(result.budget, value),
            });
        }
    }

    return violations;
}
