/**
 * Cost Alerts Service
 * 
 * Handles cost alert notifications and daily reports
 */

import { alertManager } from '@/lib/alerts/alert-manager';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface CostAlert {
    alert_type: string;
    budget_type: 'daily' | 'monthly';
    threshold_percent: number;
    budget_limit: number;
    cost_spent: number;
    cost_percent: number;
    sent_at: string;
}

/**
 * Send cost alert notification
 */
export async function sendCostAlert(alert: CostAlert): Promise<void> {
    try {
        const message = formatCostAlertMessage(alert);
        
        // Trigger alert through alert manager
        await alertManager.triggerAlert({
            id: `cost-${alert.budget_type}-${alert.threshold_percent}`,
            name: `Cost Alert: ${alert.budget_type} ${alert.threshold_percent}%`,
            description: message,
            severity: alert.threshold_percent >= 100 ? 'critical' : 'warning',
            enabled: true,
            condition: { type: 'budget', threshold: alert.threshold_percent, windowMinutes: 60 },
            notificationChannels: [],
        });
        
        logger.info('Cost alert sent', {
            alert_type: alert.alert_type,
            budget_type: alert.budget_type,
            threshold: alert.threshold_percent,
        });
    } catch (error) {
        logger.error('Failed to send cost alert', error as Error, { alert });
    }
}

/**
 * Format cost alert message
 */
function formatCostAlertMessage(alert: CostAlert): string {
    const budgetType = alert.budget_type === 'daily' ? 'Daily' : 'Monthly';
    const threshold = alert.threshold_percent;
    
    if (threshold >= 100) {
        return `🚨 ${budgetType} budget exceeded! Spent $${alert.cost_spent.toFixed(2)} of $${alert.budget_limit.toFixed(2)} (${alert.cost_percent.toFixed(1)}%). Generation has been auto-paused.`;
    } else if (threshold >= 80) {
        return `⚠️ ${budgetType} budget at ${threshold}%! Spent $${alert.cost_spent.toFixed(2)} of $${alert.budget_limit.toFixed(2)} (${alert.cost_percent.toFixed(1)}%).`;
    } else {
        return `📊 ${budgetType} budget at ${threshold}%: $${alert.cost_spent.toFixed(2)} of $${alert.budget_limit.toFixed(2)} (${alert.cost_percent.toFixed(1)}%).`;
    }
}

/**
 * Generate and send daily cost report
 */
export async function generateDailyCostReport(): Promise<void> {
    try {
        const supabase = await createClient();
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's budget status
        const { data: dailyBudget } = await supabase
            .from('daily_budgets')
            .select('*')
            .eq('budget_date', today)
            .single();
        
        // Get monthly budget status
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        
        const { data: monthlyBudget } = await supabase
            .from('monthly_budgets')
            .select('*')
            .eq('budget_month', monthStartStr)
            .single();
        
        // Get cost breakdown by provider
        const { data: providerBreakdown } = await supabase.rpc('get_cost_breakdown_by_provider', {
            p_start_date: today,
            p_end_date: today,
        });
        
        // Get projected monthly cost
        const { data: projection } = await supabase.rpc('get_projected_monthly_cost');
        
        // Format report
        const report = formatDailyReport({
            dailyBudget: dailyBudget || null,
            monthlyBudget: monthlyBudget || null,
            providerBreakdown: providerBreakdown || [],
            projection: projection?.[0] || null,
        });
        
        // Send report via alert manager
        await alertManager.triggerAlert({
            id: 'daily-cost-report',
            name: 'Daily Cost Report',
            description: report,
            severity: 'info',
            enabled: true,
            condition: { type: 'budget', threshold: 0, windowMinutes: 1440 },
            notificationChannels: [],
        });
        
        logger.info('Daily cost report generated and sent', { date: today });
    } catch (error) {
        logger.error('Failed to generate daily cost report', error as Error);
    }
}

/**
 * Format daily cost report
 */
function formatDailyReport(data: {
    dailyBudget: any;
    monthlyBudget: any;
    providerBreakdown: any[];
    projection: any;
}): string {
    const { dailyBudget, monthlyBudget, providerBreakdown, projection } = data;
    
    let report = '📊 Daily Cost Report\n\n';
    
    // Daily Budget
    if (dailyBudget) {
        const dailyPercent = dailyBudget.max_cost_usd > 0
            ? (dailyBudget.cost_spent_usd / dailyBudget.max_cost_usd) * 100
            : 0;
        
        report += `**Daily Budget:**\n`;
        report += `- Spent: $${dailyBudget.cost_spent_usd.toFixed(2)} / $${dailyBudget.max_cost_usd.toFixed(2)} (${dailyPercent.toFixed(1)}%)\n`;
        report += `- Tokens: ${dailyBudget.tokens_used.toLocaleString()} / ${dailyBudget.max_tokens.toLocaleString()}\n`;
        report += `- Images: ${dailyBudget.images_used} / ${dailyBudget.max_images}\n`;
        report += `- Status: ${dailyBudget.is_paused ? '⏸️ Paused' : '✅ Active'}\n\n`;
    }
    
    // Monthly Budget
    if (monthlyBudget) {
        const monthlyPercent = monthlyBudget.max_cost_usd > 0
            ? (monthlyBudget.cost_spent_usd / monthlyBudget.max_cost_usd) * 100
            : 0;
        
        report += `**Monthly Budget:**\n`;
        report += `- Spent: $${monthlyBudget.cost_spent_usd.toFixed(2)} / $${monthlyBudget.max_cost_usd.toFixed(2)} (${monthlyPercent.toFixed(1)}%)\n`;
        report += `- Status: ${monthlyBudget.is_paused ? '⏸️ Paused' : '✅ Active'}\n\n`;
    }
    
    // Provider Breakdown
    if (providerBreakdown.length > 0) {
        report += `**Cost by Provider:**\n`;
        providerBreakdown.forEach(provider => {
            report += `- ${provider.provider}: $${provider.total_cost.toFixed(2)} (${provider.total_tokens.toLocaleString()} tokens)\n`;
        });
        report += '\n';
    }
    
    // Projection
    if (projection) {
        report += `**Monthly Projection:**\n`;
        report += `- Current: $${projection.current_month_cost.toFixed(2)}\n`;
        report += `- Projected: $${projection.projected_monthly_cost.toFixed(2)}\n`;
        report += `- Budget: $${projection.budget_limit.toFixed(2)}\n`;
        if (projection.projected_over_budget) {
            report += `- ⚠️ Projected to exceed budget by $${(projection.projected_monthly_cost - projection.budget_limit).toFixed(2)}\n`;
        } else {
            report += `- ✅ Projected to stay within budget\n`;
        }
    }
    
    return report;
}

/**
 * Check and process cost alerts
 */
export async function checkCostAlerts(): Promise<number> {
    try {
        const supabase = await createClient();
        
        // Trigger alert checks (this will create alerts in database)
        const { data, error } = await supabase.rpc('check_and_trigger_cost_alerts');
        
        if (error) {
            logger.error('Failed to check cost alerts', error as Error);
            return 0;
        }
        
        const alertsTriggered = data?.[0]?.alerts_triggered || 0;
        const autoPaused = data?.[0]?.auto_paused || false;
        
        if (alertsTriggered > 0) {
            // Get recent alerts and send notifications
            const { data: recentAlerts } = await supabase
                .from('cost_alerts')
                .select('*')
                .order('sent_at', { ascending: false })
                .limit(alertsTriggered);
            
            if (recentAlerts) {
                for (const alert of recentAlerts) {
                    await sendCostAlert(alert as CostAlert);
                }
            }
        }
        
        if (autoPaused) {
            logger.warn('Budget auto-paused due to 100% threshold', {
                alerts_triggered: alertsTriggered,
            });
        }
        
        return alertsTriggered;
    } catch (error) {
        logger.error('Error checking cost alerts', error as Error);
        return 0;
    }
}
