"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Calendar, Clock, FileText, Plus, Filter, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Content Calendar Page
 * 
 * Functionality:
 * - Content scheduler
 * - Automation trigger surface
 * - Planning + execution bridge
 * - Drag/drop scheduling (future enhancement)
 * - Status visibility
 * - Regeneration scheduling
 * - Pipeline triggers
 * - Review deadlines
 */
export default function ContentCalendarPage() {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

    // Fetch articles for calendar
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['calendar-articles'],
        queryFn: () => api.entities.Article.list('-created_date', 1000),
        initialData: []
    });

    // Filter articles by status for calendar display
    const scheduledArticles = articles.filter((a: any) => 
        a.published_date && a.status === 'published'
    );
    const draftArticles = articles.filter((a: any) => a.status === 'draft');
    const reviewArticles = articles.filter((a: any) => 
        a.submission_status === 'pending' || a.status === 'draft'
    );

    // Get articles for selected date
    const getArticlesForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return articles.filter((a: any) => {
            if (a.published_date) {
                const publishedDate = new Date(a.published_date).toISOString().split('T')[0];
                return publishedDate === dateStr;
            }
            return false;
        });
    };

    // Get current month dates
    const getMonthDates = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates: Date[] = [];
        
        // Add dates from previous month to fill week
        const startDay = firstDay.getDay();
        for (let i = startDay - 1; i >= 0; i--) {
            dates.push(new Date(year, month, -i));
        }
        
        // Add current month dates
        for (let i = 1; i <= lastDay.getDate(); i++) {
            dates.push(new Date(year, month, i));
        }
        
        // Add dates from next month to fill week
        const remaining = 42 - dates.length; // 6 weeks * 7 days
        for (let i = 1; i <= remaining; i++) {
            dates.push(new Date(year, month + 1, i));
        }
        
        return dates;
    };

    const monthDates = getMonthDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            published: 'bg-green-100 text-green-700',
            draft: 'bg-slate-100 text-slate-700',
            pending: 'bg-amber-100 text-amber-700',
        };
        return variants[status] || 'bg-slate-100 text-slate-700';
    };

    const [planningTopic, setPlanningTopic] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);

    const handleAutoPlan = async () => {
        if (!planningTopic) return;
        setIsPlanning(true);
        try {
            const res = await fetch('/api/admin/plan-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: planningTopic })
            });
            if (!res.ok) throw new Error('Failed to plan');
            
            toast.success('Strategist has populated the calendar!');
            queryClient.invalidateQueries({ queryKey: ['calendar-articles'] });
            setPlanningTopic('');
        } catch (error) {
            toast.error('Failed to auto-plan content');
        } finally {
            setIsPlanning(false);
        }
    };

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-teal-600" />
                                Content Calendar
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Schedule content, track deadlines, and manage automation triggers
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                                {/* Auto-Plan Input */}
                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <input 
                                        type="text" 
                                        placeholder="Topic (e.g. Mutual Funds)"
                                        className="bg-transparent border-none text-sm px-2 focus:ring-0 w-48"
                                        value={planningTopic}
                                        onChange={(e) => setPlanningTopic(e.target.value)}
                                    />
                                    <Button 
                                        size="sm" 
                                        onClick={handleAutoPlan}
                                        disabled={isPlanning || !planningTopic}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {isPlanning ? (
                                            <Clock className="w-3 h-3 animate-spin mr-1" />
                                        ) : (
                                            <Sparkles className="w-3 h-3 mr-1" />
                                        )}
                                        {isPlanning ? 'Planning...' : 'Auto-Plan'}
                                    </Button>
                                </div>

                                <Button
                                    variant={viewMode === 'month' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('month')}
                                >
                                    Month
                                </Button>
                                <Button
                                    variant={viewMode === 'week' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('week')}
                                >
                                    Week
                                </Button>
                                <Button
                                    variant={viewMode === 'day' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('day')}
                                >
                                    Day
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setMonth(newDate.getMonth() - 1);
                                    setSelectedDate(newDate);
                                }}
                            >
                                ← Previous
                            </Button>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newDate = new Date(selectedDate);
                                    newDate.setMonth(newDate.getMonth() + 1);
                                    setSelectedDate(newDate);
                                }}
                            >
                                Next →
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDate(new Date())}
                            >
                                Today
                            </Button>
                        </div>
                        <Button className="bg-teal-600 hover:bg-teal-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Schedule Content
                        </Button>
                    </div>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Scheduled</p>
                                        <p className="text-2xl font-bold text-slate-900">{scheduledArticles.length}</p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Drafts</p>
                                        <p className="text-2xl font-bold text-slate-900">{draftArticles.length}</p>
                                    </div>
                                    <FileText className="w-8 h-8 text-slate-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Pending Review</p>
                                        <p className="text-2xl font-bold text-slate-900">{reviewArticles.length}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-amber-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600">Total Articles</p>
                                        <p className="text-2xl font-bold text-slate-900">{articles.length}</p>
                                    </div>
                                    <FileText className="w-8 h-8 text-teal-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Calendar Grid */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Calendar View</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {viewMode === 'month' && (
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Day headers */}
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="p-2 text-center text-sm font-semibold text-slate-700">
                                            {day}
                                        </div>
                                    ))}
                                    
                                    {/* Calendar dates */}
                                    {monthDates.map((date, idx) => {
                                        const dateArticles = getArticlesForDate(date);
                                        const isToday = date.toDateString() === today.toDateString();
                                        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                                        
                                        return (
                                            <div
                                                key={idx}
                                                className={`min-h-[100px] p-2 border border-slate-200 rounded-lg ${
                                                    isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                                                } ${isToday ? 'ring-2 ring-teal-500' : ''}`}
                                            >
                                                <div className={`text-sm font-medium mb-1 ${
                                                    isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                                                } ${isToday ? 'text-teal-600' : ''}`}>
                                                    {date.getDate()}
                                                </div>
                                                <div className="space-y-1">
                                                    {dateArticles.slice(0, 3).map((article: any) => (
                                                        <div
                                                            key={article.id}
                                                            className="text-xs p-1 bg-teal-50 text-teal-700 rounded truncate cursor-pointer hover:bg-teal-100"
                                                            title={article.title}
                                                        >
                                                            {article.title}
                                                        </div>
                                                    ))}
                                                    {dateArticles.length > 3 && (
                                                        <div className="text-xs text-slate-500">
                                                            +{dateArticles.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            
                            {viewMode === 'week' && (
                                <div className="text-center py-12 text-slate-500">
                                    Week view coming soon. Use month view for now.
                                </div>
                            )}
                            
                            {viewMode === 'day' && (
                                <div className="space-y-4">
                                    <div className="text-lg font-semibold text-slate-900 mb-4">
                                        {selectedDate.toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                    {getArticlesForDate(selectedDate).map((article: any) => (
                                        <Card key={article.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-slate-900 mb-1">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mb-2">
                                                            {article.excerpt}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={getStatusBadge(article.status)}>
                                                                {article.status}
                                                            </Badge>
                                                            {article.published_date && (
                                                                <span className="text-xs text-slate-500">
                                                                    {new Date(article.published_date).toLocaleTimeString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {getArticlesForDate(selectedDate).length === 0 && (
                                        <div className="text-center py-12 text-slate-500">
                                            No content scheduled for this date
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

