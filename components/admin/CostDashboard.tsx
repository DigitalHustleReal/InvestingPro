'use client';

/**
 * Cost Dashboard Component
 * 
 * Displays comprehensive cost analytics and budget management
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Pause,
    Play,
    RefreshCw,
    BarChart3,
    PieChart,
} from 'lucide-react';
import { format } from 'date-fns';

interface CostDashboardData {
    dailyBudget: {
        budget_date: string;
        max_cost_usd: number;
        cost_spent_usd: number;
        max_tokens: number;
        tokens_used: number;
        max_images: number;
        images_used: number;
        is_paused: boolean;
    } | null;
    monthlyBudget: {
        budget_month: string;
        max_cost_usd: number;
        cost_spent_usd: number;
        is_paused: boolean;
    } | null;
    providerBreakdown: Array<{
        provider: string;
        total_cost: number;
        total_tokens: number;
        total_images: number;
        operation_count: number;
        avg_cost_per_operation: number;
    }>;
    operationBreakdown: Array<{
        operation_type: string;
        total_cost: number;
        operation_count: number;
        avg_cost_per_operation: number;
    }>;
    projection: {
        current_month_cost: number;
        days_elapsed: number;
        days_in_month: number;
        projected_monthly_cost: number;
        budget_limit: number;
        budget_remaining: number;
        projected_over_budget: boolean;
    } | null;
    recentAlerts: Array<any>;
    dailyTrend: Array<{
        generation_date: string;
        total_cost: number;
    }>;
}

export default function CostDashboard() {
    const [data, setData] = useState<CostDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCostData();
    }, []);

    const loadCostData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/v1/admin/cost-dashboard');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to load cost data');
            }

            setData(result.data);
        } catch (err) {
            logger.error('Failed to load cost dashboard', err as Error);
            setError(err instanceof Error ? err.message : 'Failed to load cost data');
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (spent: number, limit: number): number => {
        if (limit === 0) return 0;
        return Math.min(100, (spent / limit) * 100);
    };

    const getStatusColor = (percent: number): string => {
        if (percent >= 100) return 'bg-red-500';
        if (percent >= 80) return 'bg-orange-500';
        if (percent >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner text="Loading cost dashboard..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
                <Button onClick={loadCostData} className="mt-2" variant="outline" size="sm">
                    Retry
                </Button>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p>No cost data available</p>
            </div>
        );
    }

    const dailyPercent = data.dailyBudget
        ? calculatePercentage(data.dailyBudget.cost_spent_usd, data.dailyBudget.max_cost_usd)
        : 0;
    
    const monthlyPercent = data.monthlyBudget
        ? calculatePercentage(data.monthlyBudget.cost_spent_usd, data.monthlyBudget.max_cost_usd)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Cost Dashboard</h2>
                <Button onClick={loadCostData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Budget */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Daily Budget</span>
                            {data.dailyBudget?.is_paused ? (
                                <Badge variant="destructive">Paused</Badge>
                            ) : (
                                <Badge variant="outline">Active</Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.dailyBudget ? (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-600">Cost</span>
                                            <span className="text-sm font-semibold">
                                                ${data.dailyBudget.cost_spent_usd.toFixed(2)} / ${data.dailyBudget.max_cost_usd.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getStatusColor(dailyPercent)}`}
                                                style={{ width: `${Math.min(100, dailyPercent)}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {dailyPercent.toFixed(1)}% used
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-slate-600">Tokens</div>
                                            <div className="font-semibold">
                                                {data.dailyBudget.tokens_used.toLocaleString()} / {data.dailyBudget.max_tokens.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-slate-600">Images</div>
                                            <div className="font-semibold">
                                                {data.dailyBudget.images_used} / {data.dailyBudget.max_images}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-500">No daily budget data</p>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Budget */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Monthly Budget</span>
                            {data.monthlyBudget?.is_paused ? (
                                <Badge variant="destructive">Paused</Badge>
                            ) : (
                                <Badge variant="outline">Active</Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.monthlyBudget ? (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-slate-600">Cost</span>
                                            <span className="text-sm font-semibold">
                                                ${data.monthlyBudget.cost_spent_usd.toFixed(2)} / ${data.monthlyBudget.max_cost_usd.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getStatusColor(monthlyPercent)}`}
                                                style={{ width: `${Math.min(100, monthlyPercent)}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {monthlyPercent.toFixed(1)}% used
                                        </div>
                                    </div>

                                    {data.projection && (
                                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">Projected Monthly Cost</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-semibold">
                                                    ${data.projection.projected_monthly_cost.toFixed(2)}
                                                </span>
                                                {data.projection.projected_over_budget ? (
                                                    <Badge variant="destructive" className="text-xs">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Over Budget
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Within Budget
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Based on {data.projection.days_elapsed} of {data.projection.days_in_month} days
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-500">No monthly budget data</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Cost Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Provider Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Cost by Provider
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.providerBreakdown.length > 0 ? (
                            <div className="space-y-3">
                                {data.providerBreakdown.map((provider) => (
                                    <div key={provider.provider} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-semibold">{provider.provider}</div>
                                            <div className="text-sm text-slate-600">
                                                {provider.operation_count} operations
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">${provider.total_cost.toFixed(2)}</div>
                                            <div className="text-xs text-slate-500">
                                                {provider.total_tokens.toLocaleString()} tokens
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No provider data available</p>
                        )}
                    </CardContent>
                </Card>

                {/* Operation Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Cost by Operation Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.operationBreakdown.length > 0 ? (
                            <div className="space-y-3">
                                {data.operationBreakdown.map((op) => (
                                    <div key={op.operation_type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="font-semibold capitalize">{op.operation_type.replace('_', ' ')}</div>
                                            <div className="text-sm text-slate-600">
                                                {op.operation_count} operations
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">${op.total_cost.toFixed(2)}</div>
                                            <div className="text-xs text-slate-500">
                                                Avg: ${op.avg_cost_per_operation.toFixed(4)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No operation data available</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Alerts */}
            {data.recentAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Cost Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {data.recentAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {alert.budget_type === 'daily' ? 'Daily' : 'Monthly'} Budget - {alert.threshold_percent}%
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            ${alert.cost_spent.toFixed(2)} / ${alert.budget_limit.toFixed(2)} ({alert.cost_percent.toFixed(1)}%)
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {format(new Date(alert.sent_at), 'MMM d, HH:mm')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
