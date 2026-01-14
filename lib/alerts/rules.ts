/**
 * Alert Rules Configuration
 * Defines all alert conditions and thresholds
 */

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertRule {
    id: string;
    name: string;
    description: string;
    severity: AlertSeverity;
    enabled: boolean;
    condition: AlertCondition;
    notificationChannels: NotificationChannel[];
    cooldownMinutes?: number; // Prevent alert spam
    lastTriggered?: Date;
}

export interface AlertCondition {
    type: 'error_rate' | 'latency' | 'workflow_stuck' | 'budget' | 'ai_failure_rate' | 'custom';
    threshold: number;
    windowMinutes: number;
    metric?: string; // For custom conditions
    query?: string; // Axiom query for custom conditions
}

export interface NotificationChannel {
    type: 'email' | 'slack' | 'webhook' | 'axiom';
    config: {
        email?: string;
        slackWebhook?: string;
        webhookUrl?: string;
        axiomMonitorId?: string;
    };
}

/**
 * Default Alert Rules
 * These are the critical alerts from Phase 2 requirements
 */
export const DEFAULT_ALERT_RULES: AlertRule[] = [
    {
        id: 'error-rate-high',
        name: 'High Error Rate',
        description: 'Error rate exceeds 5% in 5-minute window',
        severity: 'critical',
        enabled: true,
        condition: {
            type: 'error_rate',
            threshold: 5, // 5%
            windowMinutes: 5,
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 15, // Don't spam - wait 15 min between alerts
    },
    {
        id: 'api-latency-high',
        name: 'High API Latency',
        description: 'API latency (p95) exceeds 2 seconds',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'latency',
            threshold: 2000, // 2 seconds in ms
            windowMinutes: 5,
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 30,
    },
    {
        id: 'workflow-stuck',
        name: 'Workflow Stuck',
        description: 'Workflow running for more than 1 hour',
        severity: 'critical',
        enabled: true,
        condition: {
            type: 'workflow_stuck',
            threshold: 60, // 60 minutes
            windowMinutes: 5,
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'slack', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 60, // 1 hour cooldown for stuck workflows
    },
    {
        id: 'budget-exceeded',
        name: 'Budget Threshold',
        description: 'Budget usage exceeds 80%',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'budget',
            threshold: 80, // 80%
            windowMinutes: 60, // Check hourly
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 1440, // 24 hours - daily budget alerts
    },
    {
        id: 'cost-daily-50',
        name: 'Daily Budget 50%',
        description: 'Daily budget usage reaches 50%',
        severity: 'info',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 50,
            windowMinutes: 5,
            metric: 'daily_budget_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 60, // 1 hour cooldown
    },
    {
        id: 'cost-daily-80',
        name: 'Daily Budget 80%',
        description: 'Daily budget usage reaches 80%',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 80,
            windowMinutes: 5,
            metric: 'daily_budget_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 120, // 2 hour cooldown
    },
    {
        id: 'cost-daily-100',
        name: 'Daily Budget 100%',
        description: 'Daily budget exceeded - auto-paused',
        severity: 'critical',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 100,
            windowMinutes: 5,
            metric: 'daily_budget_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'slack', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 240, // 4 hour cooldown
    },
    {
        id: 'cost-monthly-50',
        name: 'Monthly Budget 50%',
        description: 'Monthly budget usage reaches 50%',
        severity: 'info',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 50,
            windowMinutes: 60,
            metric: 'monthly_budget_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 1440, // 24 hour cooldown
    },
    {
        id: 'cost-monthly-80',
        name: 'Monthly Budget 80%',
        description: 'Monthly budget usage reaches 80%',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 80,
            windowMinutes: 60,
            metric: 'monthly_budget_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 1440, // 24 hour cooldown
    },
    {
        id: 'cost-monthly-100',
        name: 'Monthly Budget 100%',
        description: 'Monthly budget exceeded - auto-paused',
        severity: 'critical',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 100,
            windowMinutes: 60,
            metric: 'monthly_budget_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'slack', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 1440, // 24 hour cooldown
    },
    {
        id: 'ai-provider-failure',
        name: 'AI Provider Failure Rate',
        description: 'AI provider failure rate exceeds 20%',
        severity: 'critical',
        enabled: true,
        condition: {
            type: 'ai_failure_rate',
            threshold: 20, // 20%
            windowMinutes: 5,
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'slack', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 15,
    },
    {
        id: 'slow-query',
        name: 'Slow Query Detected',
        description: 'Query execution time exceeds 5 seconds',
        severity: 'critical',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 5000, // 5 seconds
            windowMinutes: 5,
            metric: 'query_execution_time_ms',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 15,
    },
    {
        id: 'connection-pool-high',
        name: 'High Connection Pool Usage',
        description: 'Database connection pool usage exceeds 80%',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 80, // 80%
            windowMinutes: 5,
            metric: 'connection_pool_usage_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 30,
    },
    {
        id: 'table-size-growth',
        name: 'Rapid Table Size Growth',
        description: 'Table size growth exceeds 10% per week',
        severity: 'warning',
        enabled: true,
        condition: {
            type: 'custom',
            threshold: 10, // 10%
            windowMinutes: 10080, // 7 days
            metric: 'table_size_growth_percent',
        },
        notificationChannels: [
            { type: 'email', config: {} },
            { type: 'axiom', config: {} },
        ],
        cooldownMinutes: 1440, // 24 hours
    },
];

/**
 * Get alert rule by ID
 */
export function getAlertRule(id: string): AlertRule | undefined {
    return DEFAULT_ALERT_RULES.find(rule => rule.id === id);
}

/**
 * Get all enabled alert rules
 */
export function getEnabledAlertRules(): AlertRule[] {
    return DEFAULT_ALERT_RULES.filter(rule => rule.enabled);
}

/**
 * Get alert rules by severity
 */
export function getAlertRulesBySeverity(severity: AlertSeverity): AlertRule[] {
    return DEFAULT_ALERT_RULES.filter(rule => rule.severity === severity && rule.enabled);
}
