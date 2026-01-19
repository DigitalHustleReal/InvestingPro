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
            color: 'bg-slate-500/10 text-muted-foreground dark:text-muted-foreground border-slate-500/30'
        };
    };

    return (
        <AdminLayout>
            <div className="h-full flex flex-col px-10 py-8">
                {/* Breadcrumb */}
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border/50 dark:border-border/50 pb-8 mt-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground dark:text-foreground tracking-tight mb-2 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary-500" />
                            Content Planning
                        </h1>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground font-medium tracking-wide">
                            Track your editorial calendar with date-based planning
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-border dark:border-border">
                            <input 
                                type="text" 
                                placeholder="Topic (e.g. Budget 2026)"
                                className="bg-transparent border-none text-sm px-3 text-foreground dark:text-foreground focus:ring-0 w-48 placeholder:text-muted-foreground/70 dark:text-muted-foreground/70"
                                value={planningTopic}
                                onChange={(e) => setPlanningTopic(e.target.value)}
                            />
                            <Button 
                                size="sm" 
                                onClick={handleAutoPlan}
                                disabled={isPlanning || !planningTopic}
                                className="bg-secondary-600 hover:bg-secondary-700 text-foreground dark:text-foreground rounded-lg"
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
                        <Card key={i} className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-foreground dark:text-foreground" />
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-foreground dark:text-foreground">{stat.val}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters & Search */}
                <Card className="bg-white/5 border-border dark:border-border rounded-2xl mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                                <Input
                                    placeholder="Search by title or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/5 border-border dark:border-border text-foreground dark:text-foreground h-11"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 bg-white/5 border border-border dark:border-border rounded-xl text-foreground dark:text-foreground text-sm h-11 min-w-[180px]"
                            >
                                <option value="all" className="bg-surface-darker dark:bg-surface-darker">All Status</option>
                                <option value="done" className="bg-surface-darker dark:bg-surface-darker">Done</option>
                                <option value="in-progress" className="bg-surface-darker dark:bg-surface-darker">In Progress</option>
                                <option value="planned" className="bg-surface-darker dark:bg-surface-darker">Planned</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Planning Table */}
                <Card className="flex-1 bg-card/50 dark:bg-card/50 border-border/50 dark:border-border/50 flex flex-col overflow-hidden">
                    <CardHeader className="border-b border-border/50 dark:border-border/50 px-6 py-4">
                        <CardTitle className="text-sm font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-widest flex items-center justify-between">
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
                                    <Button size="sm" variant="outline" className="border-slate-500/50 text-muted-foreground dark:text-muted-foreground hover:bg-slate-500/20">
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
                                className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground"
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        </div>
                    )}
                    
                    <div className="flex-1 overflow-auto">
                        {isLoading ? (
                            <div className="p-20 text-center text-muted-foreground dark:text-muted-foreground">Loading content...</div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="p-20 text-center">
                                <FileText className="w-12 h-12 text-muted-foreground/50 dark:text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-muted-foreground dark:text-muted-foreground">No content matches your filters</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-card/50 dark:bg-card/50 sticky top-0 z-10 backdrop-blur-md">
                                    <tr className="border-b border-border/50 dark:border-border/50">
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
                                                className="w-4 h-4 rounded bg-white/5 border-border/80 dark:border-border/80 text-primary-500 focus:ring-primary-500"
                                            />
                                        </th>
                                        <th className="p-4 text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Planned Date</th>
                                        <th className="p-4 text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Title</th>
                                        <th className="p-4 text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Category</th>
                                        <th className="p-4 text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase text-center">Status</th>
                                        <th className="p-4 text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Author</th>
                                        <th className="p-4 text-xs font-bold text-muted-foreground/70 dark:text-muted-foreground/70 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredArticles.map((article: any) => {
                                        const statusInfo = getStatusInfo(article);
                                        const StatusIcon = statusInfo.icon;
                                        const plannedDate = article.published_date || article.created_at;

                                        return (
                                            <tr key={article.id} className="hover:bg-card/50 dark:bg-card/50 group transition-colors">
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
                                                        className="w-4 h-4 rounded bg-white/5 border-border/80 dark:border-border/80 text-primary-500 focus:ring-primary-500"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />
                                                        <span className="font-mono text-sm text-foreground/80 dark:text-foreground/80">
                                                            {new Date(plannedDate).toLocaleDateString('en-IN', { 
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-foreground/80 dark:text-foreground/80 group-hover:text-foreground dark:text-foreground max-w-md">
                                                        {article.title}
                                                    </div>
                                                    {article.slug && (
                                                        <div className="text-xs text-muted-foreground/50 dark:text-muted-foreground/50 truncate max-w-md mt-1">
                                                            /{article.slug}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className="text-xs capitalize border-border/70 dark:border-border/70 text-foreground/80 dark:text-foreground/80">
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
                                                <td className="p-4 text-sm text-muted-foreground dark:text-muted-foreground">
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
