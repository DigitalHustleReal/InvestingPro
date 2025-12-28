/**
 * Centralized Logging Utility
 * Replaces console.log/error with structured logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
    error?: Error;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isProduction = process.env.NODE_ENV === 'production';

    private formatMessage(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
            } as any : undefined,
        };
    }

    private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
        const entry = this.formatMessage(level, message, context, error);

        // In production, only log errors and warnings
        if (this.isProduction && level === 'debug') {
            return;
        }

        // Use console methods for now (can be replaced with external service)
        switch (level) {
            case 'error':
                console.error(`[${level.toUpperCase()}]`, entry);
                // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
                break;
            case 'warn':
                console.warn(`[${level.toUpperCase()}]`, entry);
                break;
            case 'info':
                if (this.isDevelopment) {
                    console.log(`[${level.toUpperCase()}]`, entry);
                }
                break;
            case 'debug':
                if (this.isDevelopment) {
                    console.debug(`[${level.toUpperCase()}]`, entry);
                }
                break;
        }
    }

    info(message: string, context?: Record<string, any>) {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, any>) {
        this.log('warn', message, context);
    }

    error(message: string, error?: Error, context?: Record<string, any>) {
        this.log('error', message, context, error);
    }

    debug(message: string, context?: Record<string, any>) {
        this.log('debug', message, context);
    }
}

export const logger = new Logger();
