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
    articleCategory: string;
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
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: AlertTriangle 
    },
    prepare: { 
        label: 'Prepare', 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock 
    },
    upcoming: { 
        label: 'Upcoming', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Calendar 
    },
    future: { 
        label: 'Future', 
        color: 'bg-slate-100 text-slate-700 border-slate-200',
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
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-100 rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    if (variant === 'compact') {
        return (
            <Card className="border-slate-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        Content Calendar
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Current Theme */}
                    <div className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Current Focus</p>
                        <p className="font-bold text-slate-900">{data.currentTheme.theme}</p>
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

    // Full variant
    return (
        <div className="space-y-6">
            {/* Header with Theme */}
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge className="bg-white/20 text-white border-white/30 mb-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                Event-Aware CMS
                            </Badge>
                            <h2 className="text-2xl font-bold mb-2">{data.currentTheme.theme}</h2>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {data.currentTheme.suggestedFocus.map((focus, i) => (
                                    <Badge key={i} variant="outline" className="border-white/30 text-white/80">
                                        {focus.replace(/-/g, ' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-sm">Upcoming Events</p>
                            <p className="text-3xl font-bold">{data.upcomingEvents.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Critical Deadlines */}
            {data.criticalDeadlines.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" />
                            Critical: Publish Now ({data.criticalDeadlines.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            {data.criticalDeadlines.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="p-4 bg-white rounded-xl border border-red-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge className={urgencyConfig[item.urgency].color}>
                                            {urgencyConfig[item.urgency].label}
                                        </Badge>
                                        <span className="text-xs text-red-600 font-medium">
                                            {item.daysUntilEvent}d to event
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">{item.suggestedTitle}</h4>
                                    <p className="text-sm text-slate-500 mb-3">{item.event.name}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs">
                                            {item.articleCategory.replace(/-/g, ' ')}
                                        </Badge>
                                        <Link href={`/admin/articles/new?title=${encodeURIComponent(item.suggestedTitle)}&category=${item.articleCategory}`}>
                                            <Button size="sm" className="h-7 bg-red-600 hover:bg-red-700">
                                                <FileText className="w-3 h-3 mr-1" />
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-500" />
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
                                        ? "bg-primary-50 border-primary-200" 
                                        : "bg-slate-50 border-slate-200"
                                )}
                            >
                                <p className="text-xs font-semibold text-slate-500">{day.dayName}</p>
                                <p className="text-lg font-bold text-slate-900">{day.suggestionsCount}</p>
                                <p className="text-[10px] text-slate-400">articles</p>
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
                >
                    All Categories
                </Button>
                {['credit-cards', 'loans', 'mutual-funds', 'taxes', 'insurance', 'investing'].map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat.replace(/-/g, ' ')}
                    </Button>
                ))}
            </div>

            {/* All Suggestions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-500" />
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
                                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        categoryColors[item.event.category] || 'bg-slate-500'
                                    )}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className={cn("text-[10px]", config.color)}>
                                                {config.label}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px]">
                                                {item.searchIntent}
                                            </Badge>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 truncate">{item.suggestedTitle}</h4>
                                        <p className="text-xs text-slate-500">
                                            {item.event.name} • {item.daysUntilEvent}d until event
                                        </p>
                                    </div>
                                    <Link href={`/admin/articles/new?title=${encodeURIComponent(item.suggestedTitle)}&category=${item.articleCategory}`}>
                                        <Button size="sm" variant="outline">
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Upcoming Events (60 days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.upcomingEvents.slice(0, 8).map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 border-l-4 border-primary-500 bg-slate-50 rounded-r-lg">
                                <div className="text-center min-w-[60px]">
                                    <p className="text-lg font-bold text-slate-900">
                                        {new Date(event.date).getDate()}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900">{event.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px]">{event.category}</Badge>
                                        <Badge className={cn(
                                            "text-[10px]",
                                            event.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                            event.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-700'
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
