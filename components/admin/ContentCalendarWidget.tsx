"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    Calendar, 
    AlertTriangle, 
    Clock, 
    TrendingUp, 
    Sparkles,
    ChevronRight,
    FileText,
    Target,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ADMIN_THEME } from '@/lib/admin/theme';

interface ContentSuggestion {
    event: {
        id: string;
        name: string;
        category: string;
        contentPriority: string;
    };
    suggestedTitle: string;
    urgency: 'publish_now' | 'prepare' | 'upcoming' | 'future';
    daysUntilEvent: number;
    daysUntilPublishDeadline: number;
    articleCategories: string[];
    searchIntent: string;
}

interface ContentCalendarData {
    currentTheme: {
        theme: string;
        suggestedFocus: string[];
    };
    criticalDeadlines: ContentSuggestion[];
    suggestions: ContentSuggestion[];
    upcomingEvents: {
        id: string;
        name: string;
        date: string;
        category: string;
        priority: string;
    }[];
    weeklyPlan: {
        date: string;
        dayName: string;
        suggestionsCount: number;
        suggestions: ContentSuggestion[];
    }[];
}

const urgencyConfig = {
    publish_now: { 
        label: 'Publish Now', 
        color: 'bg-wt-danger-subtle text-wt-danger border-wt-danger/30',
        icon: AlertTriangle 
    },
    prepare: { 
        label: 'Prepare', 
        color: 'bg-wt-orange-subtle text-wt-orange border-wt-orange/30',
        icon: Clock 
    },
    upcoming: { 
        label: 'Upcoming', 
        color: 'bg-wt-gold-subtle text-wt-gold border-wt-gold/30',
        icon: Calendar 
    },
    future: { 
        label: 'Future', 
        color: 'bg-wt-surface text-wt-text-muted border-wt-border',
        icon: Target 
    },
};

const categoryColors: Record<string, string> = {
    tax: 'bg-purple-500',
    festival: 'bg-orange-500',
    market: 'bg-green-500',
    banking: 'bg-blue-500',
    insurance: 'bg-teal-500',
    investment: 'bg-indigo-500',
    regulatory: 'bg-red-500',
};

export default function ContentCalendarWidget({ 
    variant = 'full' 
}: { 
    variant?: 'compact' | 'full' 
}) {
    const [data, setData] = useState<ContentCalendarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = selectedCategory 
                    ? `/api/cms/content-suggestions?category=${selectedCategory}`
                    : '/api/cms/content-suggestions';
                const response = await fetch(url);
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch content suggestions', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedCategory]);

    if (loading) {
        return (
            <Card className="animate-pulse border-wt-border bg-wt-surface">
                <CardHeader>
                    <div className="h-6 bg-wt-border rounded w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-wt-border/50 rounded-xl" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    if (variant === 'compact') {
        return (
            <Card className="border-wt-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-wt-gold" />
                        Content Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Current Theme */}
                    <div className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                        <p className="text-xs text-wt-text-muted mb-1">Current Focus</p>
                        <p className="font-bold text-wt-text">{data.currentTheme.theme}</p>
                    </div>

                    {/* Critical Deadlines */}
                    {data.criticalDeadlines.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Critical ({data.criticalDeadlines.length})
                            </p>
                            {data.criticalDeadlines.slice(0, 2).map((item, i) => (
                                <div key={i} className="p-2 bg-red-50 rounded border border-red-100 text-sm">
                                    <p className="font-medium text-red-900 line-clamp-1">{item.suggestedTitle}</p>
                                    <p className="text-xs text-red-600">{item.event.name}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <Link href="/admin/content-calendar">
                        <Button variant="outline" size="sm" className="w-full">
                            View Full Calendar
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    // Full variant – theme-aware (admin-pro)
    return (
        <div className="space-y-6">
            {/* Header with Theme */}
            <Card className="border-wt-border bg-wt-surface overflow-hidden">
                <CardContent className="p-6 bg-gradient-to-br from-wt-surface to-wt-surface-hover border-b border-wt-border">
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge className="bg-wt-gold-subtle text-wt-gold border-wt-gold/30 mb-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                Event-Aware CMS
                            </Badge>
                            <h2 className="text-2xl font-bold text-wt-text mb-2">{data.currentTheme.theme}</h2>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {data.currentTheme.suggestedFocus.map((focus, i) => (
                                    <Badge key={i} variant="outline" className="border-wt-border text-wt-text-muted">
                                        {focus.replace(/-/g, ' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-wt-text-muted text-sm">Upcoming Events</p>
                            <p className="text-3xl font-bold text-wt-text tabular-nums">{data.upcomingEvents.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Critical Deadlines */}
            {data.criticalDeadlines.length > 0 && (
                <Card className="border-wt-danger/30 bg-wt-danger-subtle">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-wt-danger">
                            <AlertTriangle className="w-5 h-5" />
                            Critical: Publish Now ({data.criticalDeadlines.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.criticalDeadlines.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="p-4 bg-wt-bg rounded-xl border border-wt-border hover:border-wt-danger/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge className={urgencyConfig[item.urgency].color}>
                                            {urgencyConfig[item.urgency].label}
                                        </Badge>
                                        <span className="text-xs text-wt-danger font-medium tabular-nums">
                                            {item.daysUntilEvent}d to event
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-wt-text mb-1">{item.suggestedTitle}</h4>
                                    <p className="text-sm text-wt-text-muted mb-3">{item.event.name}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {item.articleCategories.map((cat, idx) => (
                                                <Badge key={idx} variant="outline" className="text-[10px] py-0 h-5 border-wt-border text-wt-text-muted">
                                                    {cat.replace(/-/g, ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Link href={`/admin/articles/new?title=${encodeURIComponent(item.suggestedTitle)}&category=${item.articleCategories[0]}`}>
                                            <Button 
                                                size="sm" 
                                                className="h-8 px-3 shadow-sm hover:shadow-md transition-all"
                                                style={{ 
                                                    backgroundColor: ADMIN_THEME.colors.status.error.bg || '#DC2626',
                                                    color: '#FFFFFF'
                                                }}
                                            >
                                                <Zap className="w-3 h-3 mr-1" />
                                                Create
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Plan */}
            <Card className="border-wt-border bg-wt-surface">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-wt-text">
                        <Calendar className="w-5 h-5 text-wt-gold" />
                        This Week's Content Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                        {data.weeklyPlan.map((day, i) => (
                            <div 
                                key={i}
                                className={cn(
                                    "p-3 rounded-xl text-center border",
                                    day.suggestionsCount > 0 
                                        ? "bg-wt-gold-subtle border-wt-gold/30" 
                                        : "bg-wt-surface border-wt-border"
                                )}
                            >
                                <p className="text-xs font-semibold text-wt-text-muted">{day.dayName}</p>
                                <p className="text-lg font-bold text-wt-text tabular-nums">{day.suggestionsCount}</p>
                                <p className="text-[10px] text-wt-text-dim">articles</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? 'bg-wt-gold hover:bg-wt-gold-hover text-white border-0' : 'border-wt-border text-wt-text-muted hover:bg-wt-surface hover:text-wt-text'}
                >
                    All Categories
                </Button>
                {['credit-cards', 'loans', 'mutual-funds', 'taxes', 'insurance', 'investing'].map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? 'bg-wt-gold hover:bg-wt-gold-hover text-white border-0' : 'border-wt-border text-wt-text-muted hover:bg-wt-surface hover:text-wt-text'}
                    >
                        {cat.replace(/-/g, ' ')}
                    </Button>
                ))}
            </div>

            {/* All Suggestions */}
            <Card className="border-wt-border bg-wt-surface">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-wt-text">
                        <Sparkles className="w-5 h-5 text-wt-gold" />
                        Content Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.suggestions.slice(0, 10).map((item, i) => {
                            const config = urgencyConfig[item.urgency];
                            const Icon = config.icon;
                            
                            return (
                                <div 
                                    key={i}
                                    className="flex items-center gap-4 p-4 bg-wt-bg rounded-xl border border-wt-border hover:border-wt-border-light transition-colors"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        categoryColors[item.event.category] || 'bg-wt-border'
                                    )}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className={cn("text-[10px]", config.color)}>
                                                {config.label}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] border-wt-border text-wt-text-muted">
                                                {item.searchIntent}
                                            </Badge>
                                            {item.articleCategories.map((cat, idx) => (
                                                <Badge key={idx} variant="outline" className="text-[10px] border-wt-border text-wt-text-dim">
                                                    {cat.replace(/-/g, ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                        <h4 className="font-semibold text-wt-text truncate">{item.suggestedTitle}</h4>
                                        <p className="text-xs text-wt-text-muted">
                                            {item.event.name} • {item.daysUntilEvent}d until event
                                        </p>
                                    </div>
                                    <Link href={`/admin/articles/new?title=${encodeURIComponent(item.suggestedTitle)}&category=${item.articleCategories[0]}`}>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="border-wt-border text-wt-text hover:bg-wt-surface-hover shadow-sm"
                                        >
                                            <Zap className="w-3 h-3 mr-1" />
                                            Create
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Events Timeline */}
            <Card className="border-wt-border bg-wt-surface">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-wt-text">
                        <TrendingUp className="w-5 h-5 text-wt-gold" />
                        Upcoming Events (60 days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.upcomingEvents.slice(0, 8).map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-r-xl border border-wt-border border-l-4 border-l-wt-gold bg-wt-bg">
                                <div className="text-center min-w-[60px]">
                                    <p className="text-lg font-bold text-wt-text tabular-nums">
                                        {new Date(event.date).getDate()}
                                    </p>
                                    <p className="text-xs text-wt-text-muted">
                                        {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-wt-text">{event.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] border-wt-border text-wt-text-muted">{event.category}</Badge>
                                        <Badge className={cn(
                                            "text-[10px]",
                                            event.priority === 'critical' ? 'bg-wt-danger-subtle text-wt-danger' :
                                            event.priority === 'high' ? 'bg-wt-orange-subtle text-wt-orange' :
                                            'bg-wt-surface text-wt-text-muted border-wt-border'
                                        )}>
                                            {event.priority}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
