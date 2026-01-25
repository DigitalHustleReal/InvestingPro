"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
    AlertTriangle, 
    AlertCircle,
    Info,
    Shield,
    Bug,
    Link2,
    FileWarning,
    Scale,
    Brain,
    Repeat,
    Hash,
    XCircle
} from 'lucide-react';

type AnomalyType =
    | 'content_length'
    | 'topic_deviation'
    | 'quality_spike'
    | 'suspicious_links'
    | 'sensitive_content'
    | 'data_inconsistency'
    | 'structural_issue'
    | 'compliance_risk'
    | 'ai_hallucination'
    | 'plagiarism_risk'
    | 'spam_patterns'
    | 'unusual_keywords';

type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

interface Anomaly {
    type: AnomalyType;
    severity: AnomalySeverity;
    message: string;
    requiresReview: boolean;
}

interface AnomalyBadgeProps {
    type: AnomalyType;
    severity: AnomalySeverity;
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    showLabel?: boolean;
    className?: string;
}

// Icon mapping for anomaly types
const ANOMALY_ICONS: Record<AnomalyType, React.ComponentType<{ className?: string }>> = {
    content_length: FileWarning,
    topic_deviation: AlertCircle,
    quality_spike: AlertTriangle,
    suspicious_links: Link2,
    sensitive_content: Shield,
    data_inconsistency: Bug,
    structural_issue: FileWarning,
    compliance_risk: Scale,
    ai_hallucination: Brain,
    plagiarism_risk: Repeat,
    spam_patterns: Hash,
    unusual_keywords: AlertTriangle,
};

// Labels for anomaly types
const ANOMALY_LABELS: Record<AnomalyType, string> = {
    content_length: 'Length',
    topic_deviation: 'Topic',
    quality_spike: 'Quality',
    suspicious_links: 'Links',
    sensitive_content: 'Sensitive',
    data_inconsistency: 'Data',
    structural_issue: 'Structure',
    compliance_risk: 'Compliance',
    ai_hallucination: 'AI Issue',
    plagiarism_risk: 'Plagiarism',
    spam_patterns: 'Spam',
    unusual_keywords: 'Keywords',
};

// Severity colors
const SEVERITY_COLORS: Record<AnomalySeverity, string> = {
    low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    medium: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
};

/**
 * Single anomaly badge
 */
export function AnomalyBadge({
    type,
    severity,
    message,
    size = 'md',
    showIcon = true,
    showLabel = true,
    className = '',
}: AnomalyBadgeProps) {
    const Icon = ANOMALY_ICONS[type] || AlertTriangle;
    const label = ANOMALY_LABELS[type] || type;
    const color = SEVERITY_COLORS[severity];

    const sizeConfig = {
        sm: { icon: 'w-3 h-3', text: 'text-[10px]', padding: 'px-1.5 py-0.5' },
        md: { icon: 'w-3.5 h-3.5', text: 'text-xs', padding: 'px-2 py-0.5' },
        lg: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2.5 py-1' },
    };

    const config = sizeConfig[size];

    return (
        <Badge 
            className={`${color} ${config.padding} ${config.text} inline-flex items-center gap-1 ${className}`}
            title={message}
        >
            {showIcon && <Icon className={config.icon} />}
            {showLabel && <span>{label}</span>}
        </Badge>
    );
}

/**
 * Multiple anomaly badges in a row
 */
export function AnomalyBadgeGroup({
    anomalies,
    maxDisplay = 3,
    size = 'md',
    className = '',
}: {
    anomalies: Anomaly[];
    maxDisplay?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    if (!anomalies || anomalies.length === 0) {
        return null;
    }

    // Sort by severity (critical first)
    const sorted = [...anomalies].sort((a, b) => {
        const order: Record<AnomalySeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.severity] - order[b.severity];
    });

    const displayed = sorted.slice(0, maxDisplay);
    const remaining = sorted.length - maxDisplay;

    return (
        <div className={`flex flex-wrap items-center gap-1 ${className}`}>
            {displayed.map((anomaly, i) => (
                <AnomalyBadge
                    key={`${anomaly.type}-${i}`}
                    type={anomaly.type}
                    severity={anomaly.severity}
                    message={anomaly.message}
                    size={size}
                />
            ))}
            {remaining > 0 && (
                <Badge 
                    variant="outline" 
                    className="text-muted-foreground"
                    title={sorted.slice(maxDisplay).map(a => ANOMALY_LABELS[a.type]).join(', ')}
                >
                    +{remaining}
                </Badge>
            )}
        </div>
    );
}

/**
 * Anomaly summary indicator
 */
export function AnomalySummary({
    count,
    criticalCount = 0,
    highCount = 0,
    overallRisk,
    size = 'md',
    className = '',
}: {
    count: number;
    criticalCount?: number;
    highCount?: number;
    overallRisk: AnomalySeverity;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    if (count === 0) {
        return (
            <div className={`flex items-center gap-1 text-success-400 ${className}`}>
                <Shield className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
                <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>No issues</span>
            </div>
        );
    }

    const color = SEVERITY_COLORS[overallRisk];
    const sizeConfig = {
        sm: { icon: 'w-3 h-3', text: 'text-xs' },
        md: { icon: 'w-4 h-4', text: 'text-sm' },
        lg: { icon: 'w-5 h-5', text: 'text-base' },
    };
    const config = sizeConfig[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Badge className={`${color} flex items-center gap-1`}>
                <AlertTriangle className={config.icon} />
                <span className={config.text}>{count} issue{count !== 1 ? 's' : ''}</span>
            </Badge>
            {criticalCount > 0 && (
                <Badge className={SEVERITY_COLORS.critical}>
                    {criticalCount} critical
                </Badge>
            )}
            {highCount > 0 && criticalCount === 0 && (
                <Badge className={SEVERITY_COLORS.high}>
                    {highCount} high
                </Badge>
            )}
        </div>
    );
}

/**
 * Risk level indicator
 */
export function RiskIndicator({
    level,
    size = 'md',
    className = '',
}: {
    level: AnomalySeverity;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    const color = SEVERITY_COLORS[level];
    const labels: Record<AnomalySeverity, string> = {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        critical: 'Critical Risk',
    };

    const icons: Record<AnomalySeverity, React.ComponentType<{ className?: string }>> = {
        low: Info,
        medium: AlertTriangle,
        high: AlertCircle,
        critical: XCircle,
    };

    const Icon = icons[level];
    const sizeConfig = {
        sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-2 py-0.5' },
        md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2.5 py-1' },
        lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' },
    };
    const config = sizeConfig[size];

    return (
        <Badge className={`${color} ${config.padding} inline-flex items-center gap-1.5 ${className}`}>
            <Icon className={config.icon} />
            <span className={config.text}>{labels[level]}</span>
        </Badge>
    );
}

export default AnomalyBadge;
