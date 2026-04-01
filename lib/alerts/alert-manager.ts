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
        try {
            const { getAxiomClient } = await import('./axiom-client');
            const axiomClient = getAxiomClient();
            const { rate } = await axiomClient.getErrorRate(windowMinutes);
            return rate >= thresholdPercent;
        } catch (error) {
            logger.error('Failed to check error rate', error as Error);
            return false;
        }
    }

    /**
     * Check API latency (p95)
     */
    private async checkLatency(thresholdMs: number, windowMinutes: number): Promise<boolean> {
        try {
            const { getAxiomClient } = await import('./axiom-client');
            const axiomClient = getAxiomClient();
            const p95Latency = await axiomClient.getP95Latency(windowMinutes);
            return p95Latency >= thresholdMs;
        } catch (error) {
            logger.error('Failed to check latency', error as Error);
            return false;
        }
    }

    /**
     * Check for stuck workflows
     */
    private async checkWorkflowStuck(thresholdMinutes: number): Promise<boolean> {
        // Check workflow_instances table for workflows running > thresholdMinutes
        try {
            const { createClient } = await import('../supabase/server');
            const supabase = await createClient();
            
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
            const supabase = await createClient();
            
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
        try {
            const { getAxiomClient } = await import('./axiom-client');
            const axiomClient = getAxiomClient();
            const { rate } = await axiomClient.getAIFailureRate(windowMinutes);
            return rate >= thresholdPercent;
        } catch (error) {
            logger.error('Failed to check AI failure rate', error as Error);
            return false;
        }
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

        // Try to send email via Resend if configured
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            try {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: process.env.ALERT_EMAIL_FROM || 'alerts@investingpro.in',
                        to: email,
                        subject: `[${alert.severity.toUpperCase()}] ${rule.name}`,
                        html: this.formatEmailAlert(alert, rule),
                    }),
                });
                logger.info('Email alert sent', { to: email, alertId: alert.id });
            } catch (error) {
                logger.error('Failed to send email alert', error as Error, {
                    to: email,
                    alertId: alert.id,
                });
            }
        } else {
            // Fallback: log if no email service configured
            logger.warn('Email alert would be sent (no email service configured)', {
                to: email,
                subject: `[${alert.severity.toUpperCase()}] ${rule.name}`,
                alertId: alert.id,
            });
        }
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

    /**
     * Format email alert HTML
     */
    private formatEmailAlert(alert: Alert, rule: AlertRule): string {
        const severityColor = alert.severity === 'critical' ? '#FF0000' : 
                             alert.severity === 'warning' ? '#FFA500' : '#36A64F';
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: ${severityColor}; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .detail { margin: 10px 0; }
                    .label { font-weight: bold; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🚨 ${rule.name}</h2>
                    </div>
                    <div class="content">
                        <div class="detail">
                            <span class="label">Severity:</span> ${alert.severity.toUpperCase()}
                        </div>
                        <div class="detail">
                            <span class="label">Message:</span> ${alert.message}
                        </div>
                        <div class="detail">
                            <span class="label">Time:</span> ${alert.timestamp.toISOString()}
                        </div>
                        <div class="detail">
                            <span class="label">Rule:</span> ${rule.description}
                        </div>
                        ${Object.keys(alert.details).length > 0 ? `
                            <div class="detail">
                                <span class="label">Details:</span>
                                <pre>${JSON.stringify(alert.details, null, 2)}</pre>
                            </div>
                        ` : ''}
                    </div>
                    <div class="footer">
                        <p>This is an automated alert from InvestingPro monitoring system.</p>
                        <p>Alert ID: ${alert.id}</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

// Singleton instance
export const alertManager = new AlertManager();
