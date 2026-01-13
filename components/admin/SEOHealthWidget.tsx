"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    FileText, 
    Link2, 
    Image, 
    Heading,
    Type,
    Search,
    Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOCheck {
    score: number;
    status: 'good' | 'warning' | 'error';
    message: string;
}

interface SEOScore {
    overall: number;
    breakdown: {
        title: SEOCheck;
        meta: SEOCheck;
        headings: SEOCheck;
        content: SEOCheck;
        images: SEOCheck;
        links: SEOCheck;
    };
    issues: { type: string; category: string; message: string; fix?: string }[];
    recommendations: string[];
}

interface SEOHealthWidgetProps {
    seoData: SEOScore | null;
    isLoading?: boolean;
}

export default function SEOHealthWidget({ seoData, isLoading }: SEOHealthWidgetProps) {
    if (isLoading) {
        return (
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl">
                <CardContent className="p-6">
                    <div className="h-40 flex items-center justify-center">
                        <div className="animate-pulse text-slate-500">Analyzing SEO...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!seoData) {
        return (
            <Card className="bg-white/[0.03] border-white/5 rounded-2xl">
                <CardContent className="p-6">
                    <div className="h-40 flex items-center justify-center text-slate-500">
                        No SEO data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    const scoreColor = seoData.overall >= 80 ? 'text-primary-400' : 
                       seoData.overall >= 50 ? 'text-accent-400' : 'text-rose-400';
    
    const scoreBg = seoData.overall >= 80 ? 'bg-primary-500' : 
                    seoData.overall >= 50 ? 'bg-accent-500' : 'bg-rose-500';

    const checks = [
        { key: 'title', label: 'Title', icon: Type, data: seoData.breakdown.title },
        { key: 'meta', label: 'Meta Description', icon: Search, data: seoData.breakdown.meta },
        { key: 'headings', label: 'Headings', icon: Heading, data: seoData.breakdown.headings },
        { key: 'content', label: 'Content', icon: FileText, data: seoData.breakdown.content },
        { key: 'images', label: 'Images', icon: Image, data: seoData.breakdown.images },
        { key: 'links', label: 'Links', icon: Link2, data: seoData.breakdown.links },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good': return <CheckCircle2 className="w-4 h-4 text-primary-400" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-accent-400" />;
            case 'error': return <XCircle className="w-4 h-4 text-rose-400" />;
            default: return null;
        }
    };

    return (
        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/5 px-6 py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                    <Search className="w-4 h-4 text-primary-400" />
                    SEO Health Score
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <svg className="w-24 h-24 -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-white/5"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * seoData.overall / 100)}
                                className={scoreBg}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={cn("text-2xl font-extrabold", scoreColor)}>
                                {seoData.overall}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className={cn("text-lg font-bold", scoreColor)}>
                            {seoData.overall >= 80 ? 'Excellent' : 
                             seoData.overall >= 50 ? 'Needs Work' : 'Poor'}
                        </div>
                        <div className="text-sm text-slate-500">
                            {seoData.issues.length} issues • {seoData.recommendations.length} suggestions
                        </div>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                    {checks.map(check => (
                        <div key={check.key} className="flex items-center gap-3 text-sm">
                            <check.icon className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-400 flex-1">{check.label}</span>
                            <div className="w-24">
                                <Progress 
                                    value={check.data.score} 
                                    className="h-1.5 bg-white/5"
                                />
                            </div>
                            {getStatusIcon(check.data.status)}
                        </div>
                    ))}
                </div>

                {/* Issues */}
                {seoData.issues.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                            Issues
                        </div>
                        {seoData.issues.slice(0, 3).map((issue, idx) => (
                            <div 
                                key={idx}
                                className={cn(
                                    "flex items-start gap-2 text-xs p-3 rounded-lg",
                                    issue.type === 'error' ? 'bg-rose-500/10 text-rose-400' :
                                    issue.type === 'warning' ? 'bg-accent-500/10 text-accent-400' :
                                    'bg-white/5 text-slate-400'
                                )}
                            >
                                {issue.type === 'error' ? <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> :
                                 issue.type === 'warning' ? <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" /> :
                                 <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                                <span>{issue.message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recommendations */}
                {seoData.recommendations.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-3 h-3" />
                            Recommendations
                        </div>
                        {seoData.recommendations.slice(0, 3).map((rec, idx) => (
                            <div 
                                key={idx}
                                className="text-xs text-slate-400 p-3 bg-primary-500/5 rounded-lg border border-primary-500/10"
                            >
                                {rec}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
