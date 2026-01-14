/**
 * Alert Manager
 * Handles alert evaluation, triggering, and notification delivery
 * 
 * Integrates with:
 * - Axiom monitors (native alerting)
 * - Email notifications
 * - Slack webhooks
 * - Custom webhooks
 */

import { AlertRule, AlertSeverity, NotificationChannel } from './rules';
import { logger } from '../logger';

export interface Alert {
    id: string;
    ruleId: string;
    severity: AlertSeverity;
    message: string;
    details: Record<string, any>;
    timestamp: Date;
    resolved?: boolean;
    resolvedAt?: Date;
}

class AlertManager {
    private alerts: Map<string, Alert> = new Map();
    private notificationHistory: Map<string, Date> = new Map(); // Track last notification time

    /**
     * Evaluate alert rule and trigger if condition is met
     */
    async evaluateRule(rule: AlertRule): Promise<boolean> {
        // Check cooldown
        if (this.isInCooldown(rule)) {
            return false;
        }

        // Evaluate condition
        const conditionMet = await this.evaluateCondition(rule.condition);
        
        if (conditionMet) {
            await this.triggerAlert(rule);
            return true;
        }

        return false;
    }

    /**
     * Evaluate alert condition
     */
    private async evaluateCondition(condition: AlertRule['condition']): Promise<boolean> {
        switch (condition.type) {
            case 'error_rate':
                return await this.checkErrorRate(condition.threshold, condition.windowMinutes);
            
            case 'latency':
                return await this.checkLatency(condition.threshold, condition.windowMinutes);
            
            case 'workflow_stuck':
                return await this.checkWorkflowStuck(condition.threshold);
            
            case 'budget':
                return await this.checkBudget(condition.threshold);
            
            case 'ai_failure_rate':
                return await this.checkAIFailureRate(condition.threshold, condition.windowMinutes);
            
            case 'custom':
                return await this.checkCustomCondition(condition.query || '', condition.threshold);
            
            default:
                logger.warn('Unknown alert condition type', { type: condition.type });
                return false;
        }
    }

    /**
     * Check error rate from Axiom logs
     */
    private async checkErrorRate(thresholdPercent: number, windowMinutes: number): Promise<boolean> {
        // Query Axiom for error rate in last windowMinutes
        // This would query: error logs / total logs in time window
        // For now, return false (will be implemented with Axiom API)
        // TODO: Implement Axiom query
        return false;
    }

    /**
     * Check API latency (p95)
     */
    private async checkLatency(thresholdMs: number, windowMinutes: number): Promise<boolean> {
        // Query Axiom for p95 latency in last windowMinutes
        // TODO: Implement Axiom query
        return false;
    }

    /**
     * Check for stuck workflows
     */
    private async checkWorkflowStuck(thresholdMinutes: number): Promise<boolean> {
        // Check workflow_instances table for workflows running > thresholdMinutes
        try {
            const { createClient } = await import('../supabase/server');
            const supabase = createClient();
            
            const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000);
            
            const { data, error } = await supabase
                .from('workflow_instances')
                .select('id, state, started_at')
                .eq('state', 'running')
                .lt('started_at', thresholdTime.toISOString());
            
            if (error) {
                logger.error('Failed to check stuck workflows', error as Error);
                return false;
            }
            
            return (data?.length || 0) > 0;
        } catch (error) {
            logger.error('Error checking stuck workflows', error as Error);
            return false;
        }
    }

    /**
     * Check budget usage
     */
    private async checkBudget(thresholdPercent: number): Promise<boolean> {
        // Check system_settings for budget usage
        try {
            const { createClient } = await import('../supabase/server');
            const supabase = createClient();
            
            const { data, error } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'budget_usage_percent')
                .single();
            
            if (error || !data) {
                return false;
            }
            
            const usage = parseFloat(data.value);
            return usage >= thresholdPercent;
        } catch (error) {
            logger.error('Error checking budget', error as Error);
            return false;
        }
    }

    /**
     * Check AI provider failure rate
     */
    private async checkAIFailureRate(thresholdPercent: number, windowMinutes: number): Promise<boolean> {
        // Query Axiom for AI provider failures
        // TODO: Implement Axiom query
        return false;
    }

    /**
     * Check custom condition using Axiom query
     */
    private async checkCustomCondition(query: string, threshold: number): Promise<boolean> {
        // Execute Axiom query and check result
        // TODO: Implement Axiom API query
        return false;
    }

    /**
     * Trigger alert and send notifications
     */
    private async triggerAlert(rule: AlertRule): Promise<void> {
        const alert: Alert = {
            id: `${rule.id}-${Date.now()}`,
            ruleId: rule.id,
            severity: rule.severity,
            message: `${rule.name}: ${rule.description}`,
            details: {
                rule: rule.name,
                condition: rule.condition,
            },
            timestamp: new Date(),
        };

        // Store alert
        this.alerts.set(alert.id, alert);
        rule.lastTriggered = new Date();

        // Send notifications
        await this.sendNotifications(rule, alert);

        logger.warn('Alert triggered', {
            alertId: alert.id,
            ruleId: rule.id,
            severity: rule.severity,
            message: alert.message,
        });
    }

    /**
     * Send notifications via configured channels
     */
    private async sendNotifications(rule: AlertRule, alert: Alert): Promise<void> {
        for (const channel of rule.notificationChannels) {
            try {
                await this.sendNotification(channel, alert, rule);
            } catch (error) {
                logger.error('Failed to send notification', error as Error, {
                    channel: channel.type,
                    alertId: alert.id,
                });
            }
        }
    }

    /**
     * Send notification via specific channel
     */
    private async sendNotification(
        channel: NotificationChannel,
        alert: Alert,
        rule: AlertRule
    ): Promise<void> {
        switch (channel.type) {
            case 'email':
                await this.sendEmail(channel, alert, rule);
                break;
            
            case 'slack':
                await this.sendSlack(channel, alert, rule);
                break;
            
            case 'webhook':
                await this.sendWebhook(channel, alert, rule);
                break;
            
            case 'axiom':
                // Axiom monitors are configured in Axiom dashboard
                // This is just for logging
                logger.info('Alert would trigger Axiom monitor', {
                    alertId: alert.id,
                    ruleId: rule.id,
                });
                break;
        }
    }

    /**
     * Send email notification
     */
    private async sendEmail(
        channel: NotificationChannel,
        alert: Alert,
        rule: AlertRule
    ): Promise<void> {
        const email = channel.config.email || process.env.ALERT_EMAIL || process.env.ADMIN_EMAIL;
        if (!email) {
            logger.warn('No email configured for alerts');
            return;
        }

        // Use your email service (Resend, SendGrid, etc.)
        // For now, log it (implement with your email service)
        logger.info('Email alert would be sent', {
            to: email,
            subject: `[${alert.severity.toUpperCase()}] ${rule.name}`,
            alertId: alert.id,
        });

        // TODO: Integrate with email service
        // Example with Resend:
        // await fetch('https://api.resend.com/emails', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         from: 'alerts@investingpro.in',
        //         to: email,
        //         subject: `[${alert.severity.toUpperCase()}] ${rule.name}`,
        //         html: this.formatEmailAlert(alert, rule),
        //     }),
        // });
    }

    /**
     * Send Slack notification
     */
    private async sendSlack(
        channel: NotificationChannel,
        alert: Alert,
        rule: AlertRule
    ): Promise<void> {
        const webhookUrl = channel.config.slackWebhook || process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) {
            logger.warn('No Slack webhook configured');
            return;
        }

        const color = alert.severity === 'critical' ? '#FF0000' : 
                     alert.severity === 'warning' ? '#FFA500' : '#36A64F';

        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `🚨 Alert: ${rule.name}`,
                attachments: [{
                    color,
                    fields: [
                        { title: 'Severity', value: alert.severity, short: true },
                        { title: 'Rule', value: rule.name, short: true },
                        { title: 'Message', value: alert.message, short: false },
                        { title: 'Time', value: alert.timestamp.toISOString(), short: true },
                    ],
                }],
            }),
        });
    }

    /**
     * Send webhook notification
     */
    private async sendWebhook(
        channel: NotificationChannel,
        alert: Alert,
        rule: AlertRule
    ): Promise<void> {
        const webhookUrl = channel.config.webhookUrl;
        if (!webhookUrl) {
            logger.warn('No webhook URL configured');
            return;
        }

        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                alert,
                rule: {
                    id: rule.id,
                    name: rule.name,
                    description: rule.description,
                },
            }),
        });
    }

    /**
     * Check if rule is in cooldown period
     */
    private isInCooldown(rule: AlertRule): boolean {
        if (!rule.lastTriggered || !rule.cooldownMinutes) {
            return false;
        }

        const cooldownMs = rule.cooldownMinutes * 60 * 1000;
        const timeSinceLastTrigger = Date.now() - rule.lastTriggered.getTime();
        
        return timeSinceLastTrigger < cooldownMs;
    }

    /**
     * Get active alerts
     */
    getActiveAlerts(): Alert[] {
        return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
    }

    /**
     * Resolve alert
     */
    resolveAlert(alertId: string): void {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.resolved = true;
            alert.resolvedAt = new Date();
            logger.info('Alert resolved', { alertId });
        }
    }
}

// Singleton instance
export const alertManager = new AlertManager();
