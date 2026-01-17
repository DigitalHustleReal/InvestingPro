"use client";

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { 
    Calendar, 
    Clock, 
    FileText, 
    Plus, 
    Sparkles, 
    CheckCircle2, 
    XCircle,
    Circle,
    PlayCircle,
    Edit,
    Trash2,
    Search,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export default function ContentCalendarPage() {
    const queryClient = useQueryClient();
    const [planningTopic, setPlanningTopic] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
    const [bulkActionMenuOpen, setBulkActionMenuOpen] = useState(false);

    // Fetch articles for calendar
    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['calendar-articles'],
        queryFn: () => api.entities.Article.list('-created_date', 1000),
        initialData: []
    });

    // Calculate stats
    const stats = useMemo(() => {
        const scheduled = articles.filter((a: any) => a.published_date && new Date(a.published_date) > new Date()).length;
        const done = articles.filter((a: any) => a.status === 'published').length;
        const inProgress = articles.filter((a: any) => a.status === 'draft').length;
        const planned = articles.filter((a: any) => !a.published_date || a.status === 'pending').length;

        return { scheduled, done, inProgress, planned, total: articles.length };
    }, [articles]);

    // Filter and sort articles
    const filteredArticles = useMemo(() => {
        let filtered = articles.filter((a: any) => {
            const matchesSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 a.category?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (filterStatus === 'all') return matchesSearch;
            
            if (filterStatus === 'done') return matchesSearch && a.status === 'published';
            if (filterStatus === 'in-progress') return matchesSearch && a.status === 'draft';
            if (filterStatus === 'planned') return matchesSearch && (!a.published_date || a.status === 'pending');
            
            return matchesSearch;
        });

        // Sort by date (scheduled date or created date)
        filtered.sort((a: any, b: any) => {
            const dateA = new Date(a.published_date || a.created_at);
            const dateB = new Date(b.published_date || b.created_at);
            return dateB.getTime() - dateA.getTime();
        });

        return filtered;
    }, [articles, filterStatus, searchTerm]);

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
            toast.success('Content planned successfully!');
            queryClient.invalidateQueries({ queryKey: ['calendar-articles'] });
            setPlanningTopic('');
        } catch (error) {
            toast.error('Failed to auto-plan content');
        } finally {
            setIsPlanning(false);
        }
    };

    const getStatusInfo = (article: any) => {
        const isPast = article.published_date && new Date(article.published_date) < new Date();
        
        if (article.status === 'published' && isPast) {
            return {
                label: 'Done',
                icon: CheckCircle2,
                color: 'bg-success-500/10 text-success-400 border-success-500/30'
            };
        }
        
        if (article.status === 'published' && !isPast) {
            return {
                label: 'Scheduled',
                icon: Clock,
                color: 'bg-primary-500/10 text-primary-400 border-primary-500/30'
            };
        }
        
        if (article.status === 'draft') {
            return {
                label: 'In Progress',
                icon: PlayCircle,
                color: 'bg-accent-500/10 text-accent-400 border-accent-500/30'
            };
        }
        
        return {
            label: 'Planned',
            icon: Circle,
            color: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
        };
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
                            <FileText className="w-8 h-8 text-primary-500" />
                            Content Planning
                        </h1>
                        <p className="text-sm text-slate-400 font-medium tracking-wide">
                            Track your editorial calendar with date-based planning
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

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    {[
                        { label: 'Total', val: stats.total, color: 'bg-primary-500', icon: FileText },
                        { label: 'Done', val: stats.done, color: 'bg-success-500', icon: CheckCircle2 },
                        { label: 'In Progress', val: stats.inProgress, color: 'bg-accent-500', icon: PlayCircle },
                        { label: 'Planned', val: stats.planned, color: 'bg-slate-500', icon: Circle },
                        { label: 'Scheduled', val: stats.scheduled, color: 'bg-primary-500', icon: Clock },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/[0.03] border-white/5 hover:border-primary-500/30 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-white">{stat.val}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters & Search */}
                <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by title or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/5 border-white/10 text-white h-11"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm h-11 min-w-[180px]"
                            >
                                <option value="all" className="bg-slate-900">All Status</option>
                                <option value="done" className="bg-slate-900">Done</option>
                                <option value="in-progress" className="bg-slate-900">In Progress</option>
                                <option value="planned" className="bg-slate-900">Planned</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Planning Table */}
                <Card className="flex-1 bg-white/[0.02] border-white/5 flex flex-col overflow-hidden">
                    <CardHeader className="border-b border-white/5 px-6 py-4">
                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Production Schedule ({filteredArticles.length} items)</span>
                            <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Content
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    
                    {/* Bulk Actions Toolbar */}
                    {selectedArticles.length > 0 && (
                        <div className="px-6 py-4 bg-primary-500/10 border-b border-primary-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-primary-400">
                                    {selectedArticles.length} selected
                                </span>
                                <div className="h-4 w-px bg-white/20"></div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-success-500/50 text-success-400 hover:bg-success-500/20">
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Publish
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-slate-500/50 text-slate-400 hover:bg-slate-500/20">
                                        <Circle className="w-4 h-4 mr-1" />
                                        Archive
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-danger-500/50 text-danger-400 hover:bg-danger-500/20">
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setSelectedArticles([])}
                                className="text-slate-400 hover:text-white"
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        </div>
                    )}
                    
                    <div className="flex-1 overflow-auto">
                        {isLoading ? (
                            <div className="p-20 text-center text-slate-400">Loading content...</div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="p-20 text-center">
                                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No content matches your filters</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                                    <tr className="border-b border-white/5">
                                        <th className="p-4 w-12">
                                            <input 
                                                type="checkbox"
                                                checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedArticles(filteredArticles.map((a: any) => a.id));
                                                    } else {
                                                        setSelectedArticles([]);
                                                    }
                                                }}
                                                className="w-4 h-4 rounded bg-white/5 border-white/20 text-primary-500 focus:ring-primary-500"
                                            />
                                        </th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Planned Date</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Author</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredArticles.map((article: any) => {
                                        const statusInfo = getStatusInfo(article);
                                        const StatusIcon = statusInfo.icon;
                                        const plannedDate = article.published_date || article.created_at;

                                        return (
                                            <tr key={article.id} className="hover:bg-white/[0.02] group transition-colors">
                                                <td className="p-4">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedArticles.includes(article.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedArticles([...selectedArticles, article.id]);
                                                            } else {
                                                                setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                                                            }
                                                        }}
                                                        className="w-4 h-4 rounded bg-white/5 border-white/20 text-primary-500 focus:ring-primary-500"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-500" />
                                                        <span className="font-mono text-sm text-slate-300">
                                                            {new Date(plannedDate).toLocaleDateString('en-IN', { 
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-300 group-hover:text-white max-w-md">
                                                        {article.title}
                                                    </div>
                                                    {article.slug && (
                                                        <div className="text-xs text-slate-600 truncate max-w-md mt-1">
                                                            /{article.slug}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className="text-xs capitalize border-slate-600 text-slate-300">
                                                        {article.category || 'General'}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        <Badge className={`${statusInfo.color} border flex items-center gap-1.5`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {article.author_name || 'Admin'}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-danger-500/10 hover:text-danger-400">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
