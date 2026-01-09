
"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Calendar, Clock, FileText, Plus, Filter, Sparkles, LayoutList, Table as TableIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export default function ContentCalendarPage() {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [planningTopic, setPlanningTopic] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);

    // Fetch articles for calendar
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['calendar-articles'],
        queryFn: () => api.entities.Article.list('-created_date', 1000),
        initialData: []
    });

    // Filter articles
    const scheduledArticles = articles.filter((a: any) => a.published_date && a.status === 'published');
    const draftArticles = articles.filter((a: any) => a.status === 'draft');
    const reviewArticles = articles.filter((a: any) => a.submission_status === 'pending' || a.status === 'draft');

    // Get current month dates (Helper)
    const getMonthDates = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates: Date[] = [];
        const startDay = firstDay.getDay();
        
        // Prev month
        for (let i = startDay - 1; i >= 0; i--) dates.push(new Date(year, month, -i));
        // Current month
        for (let i = 1; i <= lastDay.getDate(); i++) dates.push(new Date(year, month, i));
        // Next month
        const remaining = 42 - dates.length; 
        for (let i = 1; i <= remaining; i++) dates.push(new Date(year, month + 1, i));
        
        return dates;
    };

    const monthDates = getMonthDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getArticlesForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return articles.filter((a: any) => {
            if (a.published_date) return new Date(a.published_date).toISOString().split('T')[0] === dateStr;
            return false;
        });
    };

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
             <div className="h-full flex flex-col px-10 py-8">
                {/* Breadcrumb */}
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8 mt-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-teal-500" />
                            Content Strategy
                        </h1>
                        <p className="text-sm text-slate-400 font-medium tracking-wide">
                            Orchestrate your editorial timeline with precision.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                            <input 
                                type="text" 
                                placeholder="Topic (e.g. Budget 2026)"
                                className="bg-transparent border-none text-sm px-3 text-white focus:ring-0 w-48 placeholder:text-slate-500"
                                value={planningTopic}
                                onChange={(e) => setPlanningTopic(e.target.value)}
                            />
                            <Button 
                                size="sm" 
                                onClick={handleAutoPlan}
                                disabled={isPlanning || !planningTopic}
                                className="bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg"
                            >
                                {isPlanning ? <Clock className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                Auto-Plan
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="calendar" className="w-full flex-1 flex flex-col">
                    <TabsList className="bg-white/5 border border-white/5 w-fit mb-6">
                        <TabsTrigger value="calendar" className="data-[state=active]:bg-teal-600"><Calendar className="w-4 h-4 mr-2"/> Calendar View</TabsTrigger>
                        <TabsTrigger value="sheet" className="data-[state=active]:bg-teal-600"><TableIcon className="w-4 h-4 mr-2"/> Planning Sheet</TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar" className="flex-1 overflow-hidden flex flex-col">
                         {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                             {[
                                { label: 'Scheduled', val: scheduledArticles.length, icon: Calendar, color: 'text-primary-400' },
                                { label: 'Drafts', val: draftArticles.length, icon: FileText, color: 'text-slate-400' },
                                { label: 'Pending Review', val: reviewArticles.length, icon: Clock, color: 'text-amber-400' },
                                { label: 'Total Assets', val: articles.length, icon: LayoutList, color: 'text-primary-400' },
                             ].map((stat, i) => (
                                <Card key={i} className="bg-white/[0.03] border-white/5">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <p className="text-2xl font-extrabold text-white">{stat.val}</p>
                                        </div>
                                        <stat.icon className={`w-8 h-8 opacity-20 ${stat.color}`} />
                                    </CardContent>
                                </Card>
                             ))}
                        </div>

                        {/* Calendar Grid */}
                        <Card className="flex-1 bg-white/[0.02] border-white/5 overflow-hidden flex flex-col">
                             <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => {
                                    const d = new Date(selectedDate); d.setMonth(d.getMonth()-1); setSelectedDate(d);
                                }}>← Prev</Button>
                                <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => {
                                    const d = new Date(selectedDate); d.setMonth(d.getMonth()+1); setSelectedDate(d);
                                }}>Next →</Button>
                             </div>
                             
                             <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-7 gap-2 h-full min-h-[500px]">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-xs font-bold text-slate-600 uppercase py-2">{day}</div>
                                    ))}
                                    {monthDates.map((date, idx) => {
                                        const dateArticles = getArticlesForDate(date);
                                        const isCurrent = date.getMonth() === selectedDate.getMonth();
                                        const isToday = date.toDateString() === today.toDateString();
                                        
                                        return (
                                            <div key={idx} className={`rounded-xl border p-2 flex flex-col gap-1 transition-all ${
                                                isCurrent ? 'bg-white/[0.03] border-white/5' : 'bg-transparent border-transparent opacity-30'
                                            } ${isToday ? 'ring-1 ring-teal-500 bg-teal-500/10' : ''}`}>
                                                <div className={`text-xs font-bold mb-1 ${isToday ? 'text-teal-400' : 'text-slate-500'}`}>{date.getDate()}</div>
                                                {dateArticles.slice(0, 3).map((a: any) => (
                                                    <div key={a.id} className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-1 rounded truncate border border-white/5 hover:bg-white/20 cursor-pointer">
                                                        {a.title}
                                                    </div>
                                                ))}
                                                {dateArticles.length > 3 && <div className="text-[10px] text-slate-600">+{dateArticles.length - 3} more</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                             </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sheet" className="flex-1 overflow-hidden">
                        <Card className="h-full bg-white/[0.02] border-white/5 flex flex-col">
                            <CardHeader className="border-b border-white/5 px-6 py-4">
                                <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Production Queue</CardTitle>
                            </CardHeader>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Author</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {articles.map((article: any) => (
                                            <tr key={article.id} className="hover:bg-white/[0.02] group transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-300 group-hover:text-white">{article.title}</div>
                                                    <div className="text-xs text-slate-600">{article.slug}</div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={
                                                        article.status === 'published' ? 'bg-primary-500/10 text-primary-400' :
                                                        article.status === 'draft' ? 'bg-slate-500/10 text-slate-400' :
                                                        'bg-amber-500/10 text-amber-400'
                                                    }>
                                                        {article.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">{article.author_name || 'Admin'}</td>
                                                <td className="p-4 text-sm text-slate-400 capitalize">{article.category}</td>
                                                <td className="p-4 text-sm text-family-mono text-slate-500">
                                                    {new Date(article.published_date || article.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
             </div>
        </AdminLayout>
    );
}
