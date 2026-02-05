'use client';

/**
 * Audit Log Viewer Component
 * 
 * Displays audit log entries with filtering and search
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Clock,
    User,
    FileText,
    AlertCircle,
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface AuditLogEntry {
    id: string;
    entity_type: string;
    entity_id?: string;
    action: string;
    action_details?: string;
    user_id?: string;
    user_email?: string;
    user_name?: string;
    changes?: any;
    old_values?: any;
    new_values?: any;
    ip_address?: string;
    user_agent?: string;
    request_path?: string;
    request_method?: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    tags?: string[];
    created_at: string;
}

interface AuditLogResponse {
    entries: AuditLogEntry[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        has_more: boolean;
    };
}

interface AuditLogViewerProps {
    initialFilters?: {
        entity_type?: string;
        entity_id?: string;
        user_id?: string;
        action?: string;
        severity?: string;
    };
}

export default function AuditLogViewer({ initialFilters }: AuditLogViewerProps) {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        limit: 50,
        offset: 0,
        has_more: false,
    });

    // Filters
    const [filters, setFilters] = useState({
        entity_type: initialFilters?.entity_type || '',
        entity_id: initialFilters?.entity_id || '',
        user_id: initialFilters?.user_id || '',
        action: initialFilters?.action || '',
        severity: initialFilters?.severity || '',
        search: '',
    });

    useEffect(() => {
        loadAuditLogs();
    }, [filters.entity_type, filters.entity_id, filters.user_id, filters.action, filters.severity, pagination.offset]);

    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters.entity_type) params.set('entity_type', filters.entity_type);
            if (filters.entity_id) params.set('entity_id', filters.entity_id);
            if (filters.user_id) params.set('user_id', filters.user_id);
            if (filters.action) params.set('action', filters.action);
            if (filters.severity) params.set('severity', filters.severity);
            params.set('limit', pagination.limit.toString());
            params.set('offset', pagination.offset.toString());

            const response = await fetch(`/api/v1/admin/audit-log?${params.toString()}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to load audit logs');
            }

            const data = result.data as AuditLogResponse;
            setLogs(data.entries);
            setPagination(data.pagination);
        } catch (err) {
            logger.error('Failed to load audit logs', err as Error);
            setError(err instanceof Error ? err.message : 'Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-danger-100 text-danger-800';
            case 'error':
                return 'bg-accent-100 text-accent-800';
            case 'warning':
                return 'bg-warning-100 text-warning-800';
            default:
                return 'bg-secondary-100 text-secondary-800';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create':
                return 'bg-wt-green-subtle text-wt-green';
            case 'update':
                return 'bg-secondary-100 text-secondary-800';
            case 'delete':
                return 'bg-danger-100 text-danger-800';
            default:
                return 'bg-wt-card text-slate-800';
        }
    };

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner text="Loading audit logs..." />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <Label>Entity Type</Label>
                            <Select
                                value={filters.entity_type}
                                onValueChange={(value: string) => handleFilterChange('entity_type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All types</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="workflow">Workflow</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="product">Product</SelectItem>
                                    <SelectItem value="category">Category</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Action</Label>
                            <Select
                                value={filters.action}
                                onValueChange={(value: string) => handleFilterChange('action', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All actions</SelectItem>
                                    <SelectItem value="create">Create</SelectItem>
                                    <SelectItem value="update">Update</SelectItem>
                                    <SelectItem value="delete">Delete</SelectItem>
                                    <SelectItem value="publish">Publish</SelectItem>
                                    <SelectItem value="unpublish">Unpublish</SelectItem>
                                    <SelectItem value="approve">Approve</SelectItem>
                                    <SelectItem value="reject">Reject</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Severity</Label>
                            <Select
                                value={filters.severity}
                                onValueChange={(value: string) => handleFilterChange('severity', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All severities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All severities</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Entity ID</Label>
                            <Input
                                placeholder="Filter by entity ID"
                                value={filters.entity_id}
                                onChange={(e) => handleFilterChange('entity_id', e.target.value)}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                onClick={loadAuditLogs}
                                variant="outline"
                                className="w-full"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                    <p className="text-danger-800">{error}</p>
                    <Button
                        onClick={loadAuditLogs}
                        className="mt-2"
                        variant="outline"
                        size="sm"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Audit Log Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Audit Log</span>
                        <span className="text-sm font-normal text-wt-text-muted/70 dark:text-wt-text-muted/70">
                            {pagination.total} total entries
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-wt-text-muted/70 dark:text-wt-text-muted/70">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No audit log entries found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Entity</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>IP</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-wt-text-muted dark:text-wt-text-muted" />
                                                        <div>
                                                            <div className="text-sm">
                                                                {formatDistanceToNow(new Date(entry.created_at), {
                                                                    addSuffix: true,
                                                                })}
                                                            </div>
                                                            <div className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                                                {format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-wt-text-muted dark:text-wt-text-muted" />
                                                        <div>
                                                            <div className="text-sm font-medium">
                                                                {entry.user_name || entry.user_email || 'Unknown'}
                                                            </div>
                                                            {entry.user_email && entry.user_name && (
                                                                <div className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                                                    {entry.user_email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <Badge variant="outline">{entry.entity_type}</Badge>
                                                        {entry.entity_id && (
                                                            <div className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1">
                                                                {entry.entity_id.substring(0, 8)}...
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getActionColor(entry.action)}>
                                                        {entry.action}
                                                    </Badge>
                                                    {entry.request_method && (
                                                        <div className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1">
                                                            {entry.request_method}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    <div className="text-sm">
                                                        {entry.action_details || 'No details'}
                                                    </div>
                                                    {entry.request_path && (
                                                        <div className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1 truncate">
                                                            {entry.request_path}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getSeverityColor(entry.severity)}>
                                                        {entry.severity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                                    {entry.ip_address || 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination.total > pagination.limit && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                        Showing {pagination.offset + 1} to{' '}
                                        {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
                                        {pagination.total} entries
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() =>
                                                setPagination((prev) => ({
                                                    ...prev,
                                                    offset: Math.max(0, prev.offset - prev.limit),
                                                }))
                                            }
                                            disabled={pagination.offset === 0}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setPagination((prev) => ({
                                                    ...prev,
                                                    offset: prev.offset + prev.limit,
                                                }))
                                            }
                                            disabled={!pagination.has_more}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
