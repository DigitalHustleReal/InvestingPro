/**
 * Audit Logger Service
 * 
 * Centralized service for logging audit events
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export interface AuditEvent {
    entity_type: string;
    entity_id?: string;
    action: string;
    action_details?: string;
    user_id?: string;
    changes?: any;
    old_values?: any;
    new_values?: any;
    ip_address?: string;
    user_agent?: string;
    request_path?: string;
    request_method?: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    tags?: string[];
}

/**
 * Log an audit event
 */
export async function logAuditEvent(event: AuditEvent): Promise<string | null> {
    try {
        const supabase = await createClient();
        
        const { data, error } = await supabase.rpc('log_audit_event', {
            p_entity_type: event.entity_type,
            p_entity_id: event.entity_id || null,
            p_action: event.action,
            p_action_details: event.action_details || null,
            p_user_id: event.user_id || null,
            p_changes: event.changes ? JSON.stringify(event.changes) : null,
            p_old_values: event.old_values ? JSON.stringify(event.old_values) : null,
            p_new_values: event.new_values ? JSON.stringify(event.new_values) : null,
            p_ip_address: event.ip_address || null,
            p_user_agent: event.user_agent || null,
            p_request_path: event.request_path || null,
            p_request_method: event.request_method || null,
            p_severity: event.severity || 'info',
            p_tags: event.tags || null,
        });

        if (error) {
            logger.error('Failed to log audit event', error as Error, { event });
            return null;
        }

        return data as string;
    } catch (error) {
        logger.error('Error logging audit event', error as Error, { event });
        return null;
    }
}

/**
 * Log article action
 */
export async function logArticleAction(
    action: string,
    articleId: string,
    details?: {
        action_details?: string;
        old_values?: any;
        new_values?: any;
        changes?: any;
        severity?: 'info' | 'warning' | 'error' | 'critical';
    },
    context?: {
        ip_address?: string;
        user_agent?: string;
        request_path?: string;
        request_method?: string;
    }
): Promise<string | null> {
    return logAuditEvent({
        entity_type: 'article',
        entity_id: articleId,
        action,
        ...details,
        ...context,
        tags: ['article', 'content', ...(details?.severity === 'critical' ? ['critical'] : [])],
    });
}

/**
 * Log workflow action
 */
export async function logWorkflowAction(
    action: string,
    workflowId: string,
    details?: {
        action_details?: string;
        changes?: any;
        severity?: 'info' | 'warning' | 'error' | 'critical';
    },
    context?: {
        ip_address?: string;
        user_agent?: string;
        request_path?: string;
        request_method?: string;
    }
): Promise<string | null> {
    return logAuditEvent({
        entity_type: 'workflow',
        entity_id: workflowId,
        action,
        ...details,
        ...context,
        tags: ['workflow', 'automation'],
    });
}

/**
 * Log user action
 */
export async function logUserAction(
    action: string,
    userId: string,
    details?: {
        action_details?: string;
        changes?: any;
        severity?: 'info' | 'warning' | 'error' | 'critical';
    },
    context?: {
        ip_address?: string;
        user_agent?: string;
        request_path?: string;
        request_method?: string;
    }
): Promise<string | null> {
    return logAuditEvent({
        entity_type: 'user',
        entity_id: userId,
        action,
        ...details,
        ...context,
        tags: ['user', 'admin'],
    });
}

/**
 * Log system action (no specific entity)
 */
export async function logSystemAction(
    action: string,
    details?: {
        action_details?: string;
        changes?: any;
        severity?: 'info' | 'warning' | 'error' | 'critical';
    },
    context?: {
        ip_address?: string;
        user_agent?: string;
        request_path?: string;
        request_method?: string;
    }
): Promise<string | null> {
    return logAuditEvent({
        entity_type: 'system',
        action,
        ...details,
        ...context,
        tags: ['system', 'admin'],
    });
}

/**
 * Extract IP address from request
 */
export function extractIPAddress(request: Request): string | undefined {
    // Check various headers for IP address
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }
    
    return undefined;
}

/**
 * Extract user agent from request
 */
export function extractUserAgent(request: Request): string | undefined {
    return request.headers.get('user-agent') || undefined;
}
