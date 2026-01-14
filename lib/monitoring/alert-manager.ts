/**
 * Alert Manager
 * Manages alerts for performance issues, errors, and system health
 */

import { logger } from '@/lib/logger';
import { performanceBudgetMonitor } from '@/lib/performance/performance-budgets';
import { cacheMonitor } from '@/lib/cache/cache-monitor';

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  acknowledged?: boolean;
}

export interface AlertRule {
  name: string;
  condition: () => Promise<boolean> | boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  cooldown?: number; // milliseconds
}

class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private lastTriggered: Map<string, number> = new Map();
  private rules: AlertRule[] = [];

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Setup default alert rules
   */
  private setupDefaultRules(): void {
    // Performance budget violations
    this.addRule({
      name: 'performance_budget_violation',
      condition: () => {
        const check = performanceBudgetMonitor.checkBudgets();
        return !check.passed && check.violations.length > 0;
      },
      severity: 'high',
      message: 'Performance budget violations detected',
      cooldown: 5 * 60 * 1000, // 5 minutes
    });

    // Low cache hit rate
    this.addRule({
      name: 'low_cache_hit_rate',
      condition: () => {
        const hitRate = cacheMonitor.getOverallHitRate();
        return hitRate < 50 && hitRate > 0; // Only alert if cache is being used
      },
      severity: 'medium',
      message: 'Cache hit rate is below 50%',
      cooldown: 10 * 60 * 1000, // 10 minutes
    });
  }

  /**
   * Add an alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  /**
   * Check all alert rules
   */
  async checkAlerts(): Promise<Alert[]> {
    const newAlerts: Alert[] = [];

    for (const rule of this.rules) {
      // Check cooldown
      const lastTriggered = this.lastTriggered.get(rule.name) || 0;
      const now = Date.now();
      if (rule.cooldown && (now - lastTriggered) < rule.cooldown) {
        continue;
      }

      // Check condition
      try {
        const triggered = await rule.condition();
        if (triggered) {
          const alert: Alert = {
            id: `${rule.name}-${now}`,
            type: rule.severity === 'critical' ? 'error' : 'warning',
            severity: rule.severity,
            message: rule.message,
            timestamp: new Date(),
            acknowledged: false,
          };

          this.alerts.set(alert.id, alert);
          this.lastTriggered.set(rule.name, now);
          newAlerts.push(alert);

          // Log alert
          logger.warn('Alert triggered', {
            rule: rule.name,
            severity: rule.severity,
            message: rule.message,
          });
        }
      } catch (error) {
        logger.error('Error checking alert rule', error instanceof Error ? error : new Error(String(error)), {
          rule: rule.name,
        });
      }
    }

    return newAlerts;
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.acknowledged);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: Alert['severity']): Alert[] {
    return this.getActiveAlerts().filter(alert => alert.severity === severity);
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Clear old alerts (older than 24 hours)
   */
  clearOldAlerts(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [id, alert] of this.alerts.entries()) {
      if (alert.timestamp.getTime() < oneDayAgo) {
        this.alerts.delete(id);
      }
    }
  }
}

// Export singleton instance
export const alertManager = new AlertManager();
