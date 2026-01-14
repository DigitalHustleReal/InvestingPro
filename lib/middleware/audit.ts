/**
 * Audit Middleware
 * 
 * Middleware to automatically log admin actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent, extractIPAddress, extractUserAgent } from '@/lib/audit/audit-logger';
import { createClient } from '@/lib/supabase/server';

export interface AuditContext {
    entity_type?: string;
    entity_id?: string;
    action?: string;
    action_details?: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    tags?: string[];
}

/**
 * Middleware to audit admin actions
 */
export function withAudit(
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
    auditConfig?: AuditContext
) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Only audit authenticated admin actions
        if (user) {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const isAdmin = profile?.role === 'admin';

            // Log admin actions
            if (isAdmin && auditConfig) {
                // Extract entity info from URL if not provided
                const url = new URL(request.url);
                const pathParts = url.pathname.split('/').filter(Boolean);
                
                // Try to extract entity_id from URL (e.g., /api/articles/{id}/...)
                let entityId = auditConfig.entity_id;
                if (!entityId && pathParts.length >= 3) {
                    // Check if there's an ID-like segment
                    const possibleId = pathParts[pathParts.length - 1];
                    if (possibleId && possibleId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                        entityId = possibleId;
                    }
                }

                // Determine action from HTTP method if not provided
                let action = auditConfig.action;
                if (!action) {
                    switch (request.method) {
                        case 'POST':
                            action = 'create';
                            break;
                        case 'PUT':
                        case 'PATCH':
                            action = 'update';
                            break;
                        case 'DELETE':
                            action = 'delete';
                            break;
                        default:
                            action = 'view';
                    }
                }

                // Log audit event (async, don't wait)
                logAuditEvent({
                    entity_type: auditConfig.entity_type || 'unknown',
                    entity_id: entityId,
                    action,
                    action_details: auditConfig.action_details,
                    user_id: user.id,
                    ip_address: extractIPAddress(request),
                    user_agent: extractUserAgent(request),
                    request_path: url.pathname,
                    request_method: request.method,
                    severity: auditConfig.severity || 'info',
                    tags: auditConfig.tags || ['admin'],
                }).catch((error) => {
                    // Log error but don't fail the request
                    console.error('Failed to log audit event', error);
                });
            }
        }

        // Execute the handler
        return handler(request, context);
    };
}

/**
 * Helper to create audit context from route
 */
export function createAuditContext(
    entityType: string,
    options?: {
        action?: string;
        actionDetails?: string;
        severity?: 'info' | 'warning' | 'error' | 'critical';
        tags?: string[];
    }
): AuditContext {
    return {
        entity_type: entityType,
        action: options?.action,
        action_details: options?.actionDetails,
        severity: options?.severity,
        tags: options?.tags,
    };
}
