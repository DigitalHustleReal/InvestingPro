"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface DataSource {
    id: string;
    name: string;
    url: string;
    is_verified?: boolean;
}

interface DataPoint {
    id: string;
    field_name: string;
    field_value: any;
    source_id?: string;
    source_url?: string;
    fetched_at: string;
    update_frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand';
    is_verified?: boolean;
    data_sources?: DataSource;
}

interface DataProvenanceProps {
    dataPoints: DataPoint[];
    lastUpdated?: string;
    className?: string;
}

/**
 * DataProvenance Component
 * 
 * Displays data provenance information for a product.
 * Every numeric value must have source_url, fetched_at, and update_frequency.
 * This is MANDATORY for YMYL (Your Money Your Life) compliance.
 */
export default function DataProvenance({
    dataPoints,
    lastUpdated,
    className = '',
}: DataProvenanceProps) {
    if (!dataPoints || dataPoints.length === 0) {
        return null;
    }

    // Group data points by source
    const groupedBySource = dataPoints.reduce((acc, point) => {
        const sourceId = point.source_id || 'unknown';
        if (!acc[sourceId]) {
            acc[sourceId] = {
                source: point.data_sources,
                points: [],
            };
        }
        acc[sourceId].points.push(point);
        return acc;
    }, {} as Record<string, { source?: DataSource; points: DataPoint[] }>);

    // Get update frequency badge color
    const getFrequencyColor = (frequency: string) => {
        switch (frequency) {
            case 'daily':
                return 'bg-primary-100 text-primary-700';
            case 'weekly':
                return 'bg-primary-100 text-primary-700';
            case 'monthly':
                return 'bg-accent-100 text-accent-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Format update frequency text
    const formatFrequency = (frequency: string) => {
        switch (frequency) {
            case 'daily':
                return 'Updated daily';
            case 'weekly':
                return 'Updated weekly';
            case 'monthly':
                return 'Updated monthly';
            case 'on_demand':
                return 'Updated on demand';
            default:
                return frequency;
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    Data Sources & Provenance
                </CardTitle>
                {lastUpdated && (
                    <p className="text-sm text-gray-600 mt-2">
                        Last updated: {new Date(lastUpdated).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Object.entries(groupedBySource).map(([sourceId, group]) => (
                        <div key={sourceId} className="border border-gray-200 rounded-lg p-6 md:p-8">
                            {/* Source Header */}
                            {group.source && (
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900">
                                                {group.source.name}
                                            </h4>
                                            {group.source.is_verified && (
                                                <Badge className="bg-primary-100 text-primary-700 text-xs">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        {group.source.url && (
                                            <a
                                                href={group.source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                                            >
                                                View source
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Data Points */}
                            <div className="space-y-2">
                                {group.points.map((point) => {
                                    const fieldName = point.field_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    const hasSource = point.source_url || point.data_sources?.url;

                                    return (
                                        <div
                                            key={point.id}
                                            className="flex items-start justify-between p-2 bg-gray-50 rounded"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {fieldName}
                                                </div>
                                                <div className="text-xs text-gray-600 mt-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>
                                                            Fetched: {new Date(point.fetched_at).toLocaleDateString('en-IN')}
                                                        </span>
                                                    </div>
                                                    {hasSource && (
                                                        <a
                                                            href={point.source_url || point.data_sources?.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                                                        >
                                                            View source
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge className={getFrequencyColor(point.update_frequency)}>
                                                    <RefreshCw className="w-3 h-3 mr-1" />
                                                    {formatFrequency(point.update_frequency)}
                                                </Badge>
                                                {point.is_verified && (
                                                    <Badge className="bg-primary-100 text-primary-700 text-xs">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compliance Note */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">
                            <strong>Data Integrity:</strong> All data points are sourced from verified sources with
                            timestamps and update frequencies. This information is for educational purposes only.
                            Users should verify current information directly with the provider.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

