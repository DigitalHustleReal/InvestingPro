/**
 * External Logging Service Integration
 * Supports Axiom, Better Stack, and other logging services
 * 
 * This module handles forwarding logs to external services
 * while maintaining fail-safe behavior (never breaks the app)
 */

import { logger as baseLogger } from '../logger';

export type LoggingService = 'axiom' | 'better-stack' | 'datadog' | 'custom';

export interface LogEntry {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: string;
    correlationId?: string;
    requestId?: string;
    userId?: string;
    service?: string;
    environment?: string;
    context?: Record<string, any>;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
    metrics?: {
        duration?: number;
        memory?: number;
        cpu?: number;
    };
}

export interface ExternalLoggerConfig {
    service: LoggingService;
    enabled: boolean;
    apiKey?: string;
    dataset?: string; // For Axiom
    source?: string; // For Better Stack
    endpoint?: string; // Custom endpoint
    batchSize?: number; // Batch logs before sending
    flushInterval?: number; // Flush interval in ms
}

class ExternalLogger {
    private config: ExternalLoggerConfig;
    private logBuffer: LogEntry[] = [];
    private flushTimer: NodeJS.Timeout | null = null;
    private isFlushing = false;

    constructor(config: ExternalLoggerConfig) {
        this.config = {
            batchSize: 10,
            flushInterval: 5000, // 5 seconds
            ...config,
        };

        // Start periodic flush
        if (this.config.enabled) {
            this.startFlushTimer();
        }
    }

    /**
     * Log an entry (adds to buffer, flushes when batch size reached)
     */
    async log(entry: LogEntry): Promise<void> {
        if (!this.config.enabled) {
            return;
        }

        // Add to buffer
        this.logBuffer.push(entry);

        // Flush if buffer is full
        if (this.logBuffer.length >= (this.config.batchSize || 10)) {
            await this.flush();
        }
    }

    /**
     * Flush all buffered logs
     */
    async flush(): Promise<void> {
        if (this.isFlushing || this.logBuffer.length === 0) {
            return;
        }

        this.isFlushing = true;
        const logsToSend = [...this.logBuffer];
        this.logBuffer = [];

        try {
            await this.sendLogs(logsToSend);
        } catch (error) {
            // Fail silently - don't break the app
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.error('Failed to send logs to external service:', error);
            }
            // Re-add logs to buffer for retry (limit buffer size)
            if (this.logBuffer.length < 100) {
                this.logBuffer.unshift(...logsToSend);
            }
        } finally {
            this.isFlushing = false;
        }
    }

    /**
     * Send logs to external service
     */
    private async sendLogs(logs: LogEntry[]): Promise<void> {
        switch (this.config.service) {
            case 'axiom':
                await this.sendToAxiom(logs);
                break;
            case 'better-stack':
                await this.sendToBetterStack(logs);
                break;
            case 'datadog':
                await this.sendToDatadog(logs);
                break;
            case 'custom':
                await this.sendToCustom(logs);
                break;
            default:
                throw new Error(`Unsupported logging service: ${this.config.service}`);
        }
    }

    /**
     * Send logs to Axiom
     * API: https://axiom.co/docs/rest-api/ingest
     */
    private async sendToAxiom(logs: LogEntry[]): Promise<void> {
        if (!this.config.apiKey || !this.config.dataset) {
            throw new Error('Axiom requires apiKey and dataset');
        }

        const response = await fetch(`https://api.axiom.co/v1/datasets/${this.config.dataset}/ingest`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logs),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Axiom API error: ${response.status} ${errorText}`);
        }
    }

    /**
     * Send logs to Better Stack (Logtail)
     * API: https://betterstack.com/docs/logs/api/ingest-logs
     */
    private async sendToBetterStack(logs: LogEntry[]): Promise<void> {
        if (!this.config.apiKey || !this.config.source) {
            throw new Error('Better Stack requires apiKey and source');
        }

        const response = await fetch(`https://in.logtail.com/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logs.map(log => ({
                ...log,
                dt: log.timestamp, // Better Stack uses 'dt' for timestamp
            }))),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Better Stack API error: ${response.status} ${errorText}`);
        }
    }

    /**
     * Send logs to Datadog
     * API: https://docs.datadoghq.com/api/latest/logs/
     */
    private async sendToDatadog(logs: LogEntry[]): Promise<void> {
        if (!this.config.apiKey) {
            throw new Error('Datadog requires apiKey');
        }

        const response = await fetch(`https://http-intake.logs.datadoghq.com/v1/input/${this.config.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logs),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Datadog API error: ${response.status} ${errorText}`);
        }
    }

    /**
     * Send logs to custom endpoint
     */
    private async sendToCustom(logs: LogEntry[]): Promise<void> {
        if (!this.config.endpoint) {
            throw new Error('Custom endpoint requires endpoint URL');
        }

        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
            },
            body: JSON.stringify(logs),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Custom endpoint error: ${response.status} ${errorText}`);
        }
    }

    /**
     * Start periodic flush timer
     */
    private startFlushTimer(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        this.flushTimer = setInterval(() => {
            this.flush().catch(() => {
                // Fail silently
            });
        }, this.config.flushInterval);
    }

    /**
     * Stop flush timer and flush remaining logs
     */
    async shutdown(): Promise<void> {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        await this.flush();
    }
}

// Singleton instance
let externalLoggerInstance: ExternalLogger | null = null;

/**
 * Initialize external logger
 */
export function initializeExternalLogger(config: ExternalLoggerConfig): ExternalLogger {
    if (externalLoggerInstance) {
        // Reinitialize if config changed
        externalLoggerInstance.shutdown();
    }

    externalLoggerInstance = new ExternalLogger(config);
    return externalLoggerInstance;
}

/**
 * Get external logger instance
 */
export function getExternalLogger(): ExternalLogger | null {
    return externalLoggerInstance;
}

/**
 * Log an entry to external service
 */
export async function logToExternal(entry: LogEntry): Promise<void> {
    const logger = getExternalLogger();
    if (logger) {
        await logger.log(entry);
    }
}

/**
 * Flush all pending logs
 */
export async function flushLogs(): Promise<void> {
    const logger = getExternalLogger();
    if (logger) {
        await logger.flush();
    }
}

/**
 * Shutdown external logger (flush and cleanup)
 */
export async function shutdownExternalLogger(): Promise<void> {
    const logger = getExternalLogger();
    if (logger) {
        await logger.shutdown();
    }
}
