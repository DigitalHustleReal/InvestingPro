"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    HelpCircle,
    TrendingUp,
    Shield
} from 'lucide-react';

interface ConfidenceIndicatorProps {
    score: number; // 0-100
    confidence: number; // 0-1
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    showConfidence?: boolean;
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
}

/**
 * Visual confidence score indicator
 * Shows score, confidence level, and status at a glance
 */
export function ConfidenceIndicator({
    score,
    confidence,
    size = 'md',
    showLabel = true,
    showConfidence = true,
    variant = 'default',
    className = '',
}: ConfidenceIndicatorProps) {
    // Determine status based on score
    const getStatus = () => {
        if (score >= 85) return { label: 'High', color: 'success', icon: CheckCircle2 };
        if (score >= 70) return { label: 'Medium', color: 'warning', icon: AlertTriangle };
        if (score >= 50) return { label: 'Low', color: 'orange', icon: HelpCircle };
        return { label: 'Very Low', color: 'danger', icon: XCircle };
    };

    const status = getStatus();
    const Icon = status.icon;

    // Size configurations
    const sizeConfig = {
        sm: { container: 'gap-1', icon: 'w-3 h-3', text: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
        md: { container: 'gap-2', icon: 'w-4 h-4', text: 'text-sm', badge: 'text-xs px-2 py-0.5' },
        lg: { container: 'gap-3', icon: 'w-5 h-5', text: 'text-base', badge: 'text-sm px-2.5 py-1' },
    };

    const config = sizeConfig[size];

    // Color configurations
    const colorConfig: Record<string, string> = {
        success: 'text-success-400 bg-success-500/20 border-success-500/30',
        warning: 'text-warning-400 bg-warning-500/20 border-warning-500/30',
        orange: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
        danger: 'text-danger-400 bg-danger-500/20 border-danger-500/30',
    };

    if (variant === 'compact') {
        return (
            <div className={`inline-flex items-center ${config.container} ${className}`}>
                <Icon className={`${config.icon} ${colorConfig[status.color].split(' ')[0]}`} />
                <span className={`font-bold ${config.text} ${colorConfig[status.color].split(' ')[0]}`}>
                    {score}
                </span>
            </div>
        );
    }

    if (variant === 'detailed') {
        return (
            <div className={`p-3 rounded-lg border ${colorConfig[status.color]} ${className}`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Icon className={config.icon} />
                        <span className={`font-semibold ${config.text}`}>
                            {status.label} Confidence
                        </span>
                    </div>
                    <Badge variant="outline" className={config.badge}>
                        {score}/100
                    </Badge>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-2">
                    <div 
                        className={`h-full transition-all duration-500 ${
                            status.color === 'success' ? 'bg-success-500' :
                            status.color === 'warning' ? 'bg-warning-500' :
                            status.color === 'orange' ? 'bg-orange-500' :
                            'bg-danger-500'
                        }`}
                        style={{ width: `${score}%` }}
                    />
                </div>

                {showConfidence && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>Confidence: {Math.round(confidence * 100)}%</span>
                    </div>
                )}
            </div>
        );
    }

    // Default variant
    return (
        <div className={`inline-flex items-center ${config.container} ${className}`}>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${colorConfig[status.color]}`}>
                <Icon className={config.icon} />
                <span className={`font-bold ${config.text}`}>{score}</span>
                {showLabel && (
                    <span className={`${config.text} opacity-80`}>/ 100</span>
                )}
            </div>
            
            {showConfidence && (
                <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className={config.icon} />
                    <span className={config.text}>{Math.round(confidence * 100)}%</span>
                </div>
            )}
        </div>
    );
}

/**
 * Simple score badge for tables
 */
export function ScoreBadge({ score, className = '' }: { score: number; className?: string }) {
    const getColor = () => {
        if (score >= 85) return 'bg-success-500/20 text-success-400 border-success-500/30';
        if (score >= 70) return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
        if (score >= 50) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
    };

    return (
        <Badge className={`${getColor()} ${className}`}>
            {score}
        </Badge>
    );
}

/**
 * Auto-publish eligibility indicator
 */
export function AutoPublishIndicator({ 
    canAutoPublish, 
    reason,
    size = 'md' 
}: { 
    canAutoPublish: boolean; 
    reason?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeConfig = {
        sm: { icon: 'w-3 h-3', text: 'text-xs' },
        md: { icon: 'w-4 h-4', text: 'text-sm' },
        lg: { icon: 'w-5 h-5', text: 'text-base' },
    };

    const config = sizeConfig[size];

    if (canAutoPublish) {
        return (
            <div className="flex items-center gap-2 text-success-400">
                <CheckCircle2 className={config.icon} />
                <span className={config.text}>Auto-publish eligible</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-warning-400" title={reason}>
            <AlertTriangle className={config.icon} />
            <span className={`${config.text} truncate max-w-[200px]`}>
                {reason || 'Review required'}
            </span>
        </div>
    );
}

export default ConfidenceIndicator;
