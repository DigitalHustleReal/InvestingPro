/**
 * Dark Theme CMS - Enhanced WordPress-Style with Premium UI
 */

"use client";

import React, { useState, useMemo } from 'react';
import { 
    FileText, Plus, Search, Edit, Trash2, Eye, User, TrendingUp, Sparkles, 
    Download, Check, Minus, Send, Archive, X, Calendar, BarChart3, 
    Search as SearchIcon, Star, Zap, Flame
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    ChevronUp, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight 
} from 'lucide-react';
import { exportToCSV, articleCSVColumns } from '@/lib/utils/csv-export';
import { AdminPageHeader, StatCard, ContentSection, StatusBadge, ActionButton } from '@/components/admin/AdminUIKit';
import { ADMIN_THEME } from '@/lib/admin/theme';
import SmartImage from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

interface Article {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'review' | 'published' | 'archived';
    excerpt?: string;
    author_name?: string;
    created_at?: string;
    updated_at?: string;
    published_at?: string;
    published_date?: string;
    views?: number;
    category?: string;
    featured_image?: string;
    quality_score?: number;
    seo_score?: number;
    editorial_notes?: any;
    primary_keyword?: string;
    secondary_keywords?: string[];
    search_intent?: 'informational' | 'commercial' | 'transactional';
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    verified_by_expert?: boolean;
    ai_generated?: boolean;
    tags?: string[];
    read_time?: number;
}

interface DarkCMSProps {
    articles: Article[] | null | undefined;
    isLoading?: boolean;
    onNewArticle?: () => void;
    onGenerate?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPublish?: (id: string) => void;
    onBulkPublish?: (ids: string[]) => Promise<void>;
    onBulkArchive?: (ids: string[]) => Promise<void>;
    onBulkDelete?: (ids: string[]) => Promise<void>;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    filterStatus?: string;
    onFilterChange?: (status: string) => void;
}

export default function DarkThemeCMS({
    articles,
    isLoading = false,
    onNewArticle,
    onGenerate,
    onEdit,
    onDelete,
    onPublish,
    onBulkPublish,
    onBulkArchive,
    onBulkDelete,
    searchTerm = '',
    onSearchChange,
    filterStatus = 'all',
    onFilterChange,
}: DarkCMSProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkLoading, setBulkLoading] = useState<string | null>(null);

    const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({
        field: 'created_at',
        direction: 'desc'
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 20
    });

    const articlesArray = useMemo(() => Array.isArray(articles) ? articles : [], [articles]);
    
    const filteredArticles = useMemo(() => articlesArray.filter(article => {
        if (filterStatus !== 'all' && article.status !== filterStatus) return false;
        if (searchTerm && article.title && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    }), [articlesArray, filterStatus, searchTerm]);

    const sortedArticles = useMemo(() => {
        const sorted = [...filteredArticles];
        const { field, direction } = sortConfig;
        
        sorted.sort((a: any, b: any) => {
            let valA = a[field];
            let valB = b[field];

            // Handle numeric values
            if (typeof valA === 'number' && typeof valB === 'number') {
                return direction === 'asc' ? valA - valB : valB - valA;
            }

            // Handle dates
            if (field.includes('date') || field.includes('_at')) {
                const dateA = new Date(valA || 0).getTime();
                const dateB = new Date(valB || 0).getTime();
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Handle strings
            const strA = String(valA || '').toLowerCase();
            const strB = String(valB || '').toLowerCase();
            if (strA < strB) return direction === 'asc' ? -1 : 1;
            if (strA > strB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredArticles, sortConfig]);

    const totalPages = pagination.pageSize === Infinity 
        ? 1 
        : Math.ceil(sortedArticles.length / pagination.pageSize);

    const paginatedArticles = useMemo(() => {
        if (pagination.pageSize === Infinity) return sortedArticles;
        const start = (pagination.currentPage - 1) * pagination.pageSize;
        return sortedArticles.slice(start, start + pagination.pageSize);
    }, [sortedArticles, pagination]);

    const handleSort = (field: string) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const statusCounts = useMemo(() => ({
        all: articlesArray.length,
        published: articlesArray.filter(a => a.status === 'published').length,
        draft: articlesArray.filter(a => a.status === 'draft').length,
        review: articlesArray.filter(a => a.status === 'review').length,
        archived: articlesArray.filter(a => a.status === 'archived').length,
    }), [articlesArray]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => setSelectedIds(filteredArticles.map(a => a.id));
    const deselectAll = () => setSelectedIds([]);
    
    const isAllSelected = filteredArticles.length > 0 && selectedIds.length === filteredArticles.length;
    const isPartialSelected = selectedIds.length > 0 && selectedIds.length < filteredArticles.length;

    const handleBulkAction = async (action: 'publish' | 'archive' | 'delete' | 'export') => {
        if (selectedIds.length === 0) return;
        
        if (action === 'export') {
            const selectedArticles = articlesArray.filter(a => selectedIds.includes(a.id));
            exportToCSV(selectedArticles, 'articles_export', articleCSVColumns as any);
            toast.success(`Exported ${selectedIds.length} articles`);
            return;
        }

        const confirmMessages = {
            publish: `Publish ${selectedIds.length} articles?`,
            archive: `Archive ${selectedIds.length} articles?`,
            delete: `Delete ${selectedIds.length} articles? This cannot be undone.`,
        };

        if (!confirm(confirmMessages[action])) return;

        setBulkLoading(action);
        try {
            if (action === 'publish' && onBulkPublish) await onBulkPublish(selectedIds);
            if (action === 'archive' && onBulkArchive) await onBulkArchive(selectedIds);
            if (action === 'delete' && onBulkDelete) await onBulkDelete(selectedIds);
            
            toast.success(`Successfully ${action}ed ${selectedIds.length} articles`);
            deselectAll();
        } catch (error: any) {
            toast.error(`Failed: ${error.message}`);
        } finally {
            setBulkLoading(null);
        }
    };

    const getStatusType = (status: string): 'neutral' | 'completed' | 'processing' | 'warning' | 'error' => {
        switch (status) {
            case 'published': return 'completed';
            case 'draft': return 'neutral';
            case 'review': return 'warning';
            case 'archived': return 'neutral';
            default: return 'neutral';
        }
    };

    // Helper to get score color
    const getScoreColor = (score: number | undefined): string => {
        if (!score) return 'text-wt-text-muted/70 dark:text-wt-text-muted/70';
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    // Helper to get score background color
    const getScoreBgColor = (score: number | undefined): string => {
        if (!score) return 'bg-slate-500';
        if (score >= 80) return 'bg-green-400';
        if (score >= 60) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    // Helper to check if article has research
    const hasResearch = (article: Article): boolean => {
        return !!(article.editorial_notes || article.primary_keyword || (article.secondary_keywords && article.secondary_keywords.length > 0));
    };

    // Helper to check if article is trending (based on views growth or recent views)
    const isTrending = (article: Article): boolean => {
        // Consider trending if views > 100 and published recently (within 30 days)
        if (!article.views || article.views < 50) return false;
        if (!article.published_at && !article.published_date) return false;
        const publishedDate = new Date(article.published_at || article.published_date || '');
        const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSincePublished <= 30 && article.views >= 50;
    };

    const resolveFeaturedImage = (img: string | null | undefined, category?: string) => {
        if (!img) {
            // Category-based defaults
            if (category?.toLowerCase().includes('credit-card')) return '/images/defaults/credit-card-default.svg';
            if (category?.toLowerCase().includes('loan')) return 'https://images.unsplash.com/photo-1579621970795-87f9ac756a70?w=100&h=100&fit=crop&auto=format&q=80';
            return null;
        }

        if (img.startsWith('http') || img.startsWith('/')) return img;

        // Try mapping known missing local images to Unsplash equivalents to avoid Console 404s
        const stockMap: Record<string, string> = {
            'fixed_deposits.jpg': 'https://images.unsplash.com/photo-1534951009808-df43b54b4ea9?w=100&h=100&fit=crop&auto=format&q=80',
            'insurance.jpg': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=100&h=100&fit=crop&auto=format&q=80',
            'credit_cards.jpg': '/images/defaults/credit-card-default.svg',
            'saving_schemes.jpg': 'https://images.unsplash.com/photo-1579621970795-87f9ac756a70?w=100&h=100&fit=crop&auto=format&q=80'
        };

        if (stockMap[img]) return stockMap[img];

        // Default to stock directory if it's just a filename
        return `/images/stock/${img}`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <AdminPageHeader
                title="Articles"
                subtitle="Manage your content library"
                icon={FileText}
                iconColor="teal"
                actions={
                    <div className="flex gap-3">
                        {onGenerate && (
                            <ActionButton onClick={onGenerate} variant="primary" icon={Sparkles}>
                                Generate with AI
                            </ActionButton>
                        )}
                        <ActionButton onClick={onNewArticle} icon={Plus}>
                            New Article
                        </ActionButton>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="Total" value={statusCounts.all} icon={FileText} color="teal" />
                <StatCard label="Published" value={statusCounts.published} icon={TrendingUp} color="teal" changeType="positive" />
                <StatCard label="Draft" value={statusCounts.draft} icon={FileText} color="blue" />
                <StatCard label="Review" value={statusCounts.review} icon={Eye} color="amber" />
                <StatCard label="Archived" value={statusCounts.archived} icon={Archive} color="rose" />
            </div>

            {/* Metrics Summary */}
            {articlesArray.length > 0 && (
                <ContentSection>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricSummaryCard 
                            label="Avg Quality" 
                            value={(() => {
                                const scores = articlesArray.map(a => a.quality_score).filter((s): s is number => s !== undefined && s !== null);
                                return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length).toString() : '—';
                            })()}
                            icon={Star}
                            color="amber" 
                        />
                        <MetricSummaryCard 
                            label="Avg SEO" 
                            value={(() => {
                                const scores = articlesArray.map(a => a.seo_score).filter((s): s is number => s !== undefined && s !== null);
                                return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length).toString() : '—';
                            })()}
                            icon={SearchIcon}
                            color="blue" 
                        />
                        <MetricSummaryCard 
                            label="With Research" 
                            value={articlesArray.filter(hasResearch).length.toString()}
                            icon={BarChart3}
                            color="green" 
                        />
                        <MetricSummaryCard 
                            label="Trending" 
                            value={articlesArray.filter(isTrending).length.toString()}
                            icon={Flame}
                            color="rose" 
                        />
                    </div>
                </ContentSection>
            )}

            {/* Filters */}
            <ContentSection>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wt-text-muted/70 dark:text-wt-text-muted/70" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-wt-card dark:bg-wt-card border border-wt-border dark:border-wt-border rounded-lg text-wt-text dark:text-wt-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-wt-gold/50 focus:border-wt-gold"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {(['all', 'published', 'draft', 'review', 'archived'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => onFilterChange?.(status)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-300 border uppercase tracking-widest flex items-center gap-2 ${
                                    filterStatus === status
                                        ? 'bg-wt-gold text-wt-navy-900 border-wt-gold shadow-[0_4px_16px_rgba(212,175,55,0.4)] scale-105 z-10'
                                        : 'bg-wt-surface-dark/80 text-wt-text-muted border-wt-border hover:text-wt-text hover:border-wt-gold/50 shadow-sm'
                                }`}
                            >
                                {status}
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-normal transition-colors",
                                    filterStatus === status ? "bg-wt-navy-900/10 text-wt-navy-900" : "bg-wt-surface-hover text-wt-text-muted"
                                )}>
                                    {statusCounts[status]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </ContentSection>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-wt-gold/30 border-t-primary-500 rounded-full animate-spin" />
                </div>
            ) : filteredArticles.length === 0 ? (
                <ContentSection>
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-xl bg-wt-surface-hover bg-wt-surface/50 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-wt-text-muted/70 dark:text-wt-text-muted/70" />
                        </div>
                        <h3 className="text-lg font-semibold text-wt-text dark:text-wt-text mb-2">No articles found</h3>
                        <p className="text-wt-text-muted dark:text-wt-text-muted mb-6">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first article'}
                        </p>
                        <ActionButton onClick={onNewArticle} icon={Plus}>Create Article</ActionButton>
                    </div>
                </ContentSection>
            ) : (
                <ContentSection>
                    <div className="overflow-x-auto -mx-6">
                        <table className="w-full min-w-[1400px]">
                            <thead>
                                <tr className="border-b border-wt-border dark:border-wt-border bg-wt-surface/30">
                                    <th className="px-6 py-4 w-12 text-center">
                                        <div 
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all mx-auto ${
                                                isAllSelected ? 'bg-primary-500 border-wt-gold' : 
                                                isPartialSelected ? 'bg-primary-500/50 border-wt-gold' : 
                                                'border-wt-border/70 dark:border-wt-border/70 hover:border-wt-gold'
                                            }`}
                                            onClick={isAllSelected || isPartialSelected ? deselectAll : selectAll}
                                        >
                                            {isAllSelected && <Check className="w-3 h-3 text-wt-text dark:text-wt-text" />}
                                            {isPartialSelected && <Minus className="w-3 h-3 text-wt-text dark:text-wt-text" />}
                                        </div>
                                    </th>
                                    <SortableHeader 
                                        label="Title" 
                                        field="title" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                    />
                                    <SortableHeader 
                                        label="Author" 
                                        field="author_name" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                        className="hidden md:table-cell"
                                    />
                                    <SortableHeader 
                                        label="Category" 
                                        field="category" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                        className="hidden lg:table-cell"
                                    />
                                    <SortableHeader 
                                        label="Status" 
                                        field="status" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                    />
                                    <SortableHeader 
                                        label="Views" 
                                        field="views" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                        align="center"
                                        icon={Eye}
                                    />
                                    <SortableHeader 
                                        label="Quality" 
                                        field="quality_score" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                        align="center"
                                        icon={Star}
                                    />
                                    <SortableHeader 
                                        label="SEO" 
                                        field="seo_score" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                        align="center"
                                        icon={SearchIcon}
                                    />
                                    <th className="px-4 py-4 text-center text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <BarChart3 className="w-3 h-3" />
                                            Research
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-center text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Flame className="w-3 h-3" />
                                            Trending
                                        </div>
                                    </th>
                                    <SortableHeader 
                                        label="Published" 
                                        field="published_at" 
                                        sortConfig={sortConfig} 
                                        onSort={handleSort} 
                                        align="right"
                                    />
                                    <th className="px-4 py-4 text-right text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedArticles.map((article) => {
                                    const isSelected = selectedIds.includes(article.id);
                                    return (
                                        <tr 
                                        key={article.id} 
                                        className="border-b border-wt-border/40 group hover:bg-wt-surface-hover/50 transition-all duration-300"
                                    >
                                            <td className="px-6 py-4">
                                                <div 
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all mx-auto ${
                                                        isSelected ? 'bg-primary-500 border-wt-gold' : 'border-wt-border/70 dark:border-wt-border/70 group-hover:border-wt-gold'
                                                    }`}
                                                    onClick={() => toggleSelection(article.id)}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 text-wt-text dark:text-wt-text" />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-1 ring-white/10 shrink-0 bg-wt-surface/50">
                                                        <SmartImage 
                                                            src={article.featured_image} 
                                                            category={article.category} 
                                                            alt={article.title}
                                                            className="w-full h-full" 
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-wt-text dark:text-wt-text hover:text-wt-gold transition-colors block truncate max-w-[300px]">
                                                            {article.title || 'Untitled'}
                                                        </Link>
                                                        {article.excerpt && (
                                                            <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-0.5 truncate max-w-[300px] hidden sm:block">{article.excerpt}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-wt-text dark:text-wt-text text-xs font-medium">
                                                        {(article.author_name || 'A')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-wt-text/80 dark:text-wt-text/80">{article.author_name || 'Admin'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden lg:table-cell">
                                                {article.category && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-wt-surface-hover text-wt-text-muted dark:text-wt-text-muted border border-wt-border dark:border-wt-border">
                                                        {article.category.replace(/-/g, ' ')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={getStatusType(article.status)}>
                                                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                                </StatusBadge>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className="text-sm font-medium text-wt-text/80 dark:text-wt-text/80">
                                                        {article.views?.toLocaleString() || '0'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {article.quality_score !== undefined && article.quality_score !== null ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-semibold ${getScoreColor(article.quality_score)}`}>
                                                            {Math.round(article.quality_score)}
                                                        </span>
                                                        <div className="w-12 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                                            <div 
                                                                className={`h-full ${getScoreColor(article.quality_score).replace('text-', 'bg-')}`}
                                                                style={{ width: `${Math.min(100, article.quality_score)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {article.seo_score !== undefined && article.seo_score !== null ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-sm font-semibold ${getScoreColor(article.seo_score)}`}>
                                                            {Math.round(article.seo_score)}
                                                        </span>
                                                        <div className="w-12 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                                            <div 
                                                                className={`h-full ${getScoreBgColor(article.seo_score)}`}
                                                                style={{ width: `${Math.min(100, article.seo_score)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {hasResearch(article) ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                            <BarChart3 className="w-4 h-4 text-green-400" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {isTrending(article) ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                            <Flame className="w-4 h-4 text-orange-400" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                 <div className="flex flex-col items-end whitespace-nowrap">
                                                     <div className="flex items-center gap-1 text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                                         <Calendar className="w-3 h-3" />
                                                         {new Date(article.published_at || article.published_date || article.created_at || '').toLocaleDateString()}
                                                     </div>
                                                 </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all duration-300">
                                                    {article.status === 'draft' && onPublish && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); onPublish(article.id); }} 
                                                            className="p-2 bg-wt-gold/5 border border-wt-gold/10 hover:bg-wt-gold/20 rounded-lg text-wt-gold transition-all hover:scale-110 active:scale-95 hover:border-wt-gold/30 hover:shadow-lg" 
                                                            title="Publish"
                                                        >
                                                            <Send className="w-4.5 h-4.5" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onEdit?.(article.id); }} 
                                                        className="p-2 bg-wt-surface-hover/30 border border-wt-border hover:bg-wt-surface-hover rounded-lg text-wt-text-muted hover:text-wt-text transition-all hover:scale-110 active:scale-95 hover:border-wt-gold/30 hover:shadow-lg" 
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4.5 h-4.5" />
                                                    </button>
                                                    <Link href={`/article/${article.slug}${article.status !== 'published' ? '?preview=true' : ''}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                        <button className="p-2 bg-wt-surface-hover/30 border border-wt-border hover:bg-wt-surface-hover rounded-lg text-wt-text-muted hover:text-wt-text transition-all hover:scale-110 active:scale-95 hover:border-wt-gold/30 hover:shadow-lg" title="View">
                                                            <Eye className="w-4.5 h-4.5" />
                                                        </button>
                                                    </Link>
                                                    {onDelete && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); if (confirm('Delete this article?')) onDelete(article.id); }} 
                                                            className="p-2 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95 hover:border-red-500/30 hover:shadow-lg" 
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4.5 h-4.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <PaginationFooter
                        currentPage={pagination.currentPage}
                        pageSize={pagination.pageSize}
                        totalItems={sortedArticles.length}
                        totalPages={totalPages}
                        onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                        onPageSizeChange={(size) => setPagination({ currentPage: 1, pageSize: size })}
                    />
                </ContentSection>
            )}

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="flex items-center gap-4 px-6 py-4 bg-surface-darker dark:bg-surface-darker/95 backdrop-blur-xl rounded-xl shadow-2xl border border-wt-border dark:border-wt-border">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center">
                                    <Check className="w-4 h-4 text-wt-gold" />
                                </div>
                                <span className="text-sm font-medium text-wt-text dark:text-wt-text">{selectedIds.length} selected</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleBulkAction('publish')} 
                                    disabled={!!bulkLoading} 
                                    className="px-4 py-2 bg-wt-gold text-wt-navy-900 hover:bg-[#FFD700] rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" /> Publish
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('archive')} 
                                    disabled={!!bulkLoading} 
                                    className="px-4 py-2 bg-wt-surface-dark border border-wt-border hover:bg-wt-surface-hover text-wt-text rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-50"
                                >
                                    <Archive className="w-4 h-4" /> Archive
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('export')} 
                                    className="px-4 py-2 bg-wt-surface-dark border border-wt-border hover:bg-wt-surface-hover text-wt-text rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm"
                                >
                                    <Download className="w-4 h-4" /> Export
                                </button>
                                <button 
                                    onClick={() => handleBulkAction('delete')} 
                                    disabled={!!bulkLoading} 
                                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                            <button onClick={deselectAll} className="p-2 hover:bg-wt-surface-hover rounded-lg text-wt-text-muted dark:text-wt-text-muted hover:text-wt-text dark:text-wt-text transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Helper component for sortable table headers
 */
interface SortableHeaderProps {
    label: string;
    field: string;
    sortConfig: { field: string; direction: 'asc' | 'desc' };
    onSort: (field: string) => void;
    align?: 'left' | 'center' | 'right';
    className?: string;
    icon?: React.ElementType;
}

function SortableHeader({ label, field, sortConfig, onSort, align = 'left', className = '', icon: Icon }: SortableHeaderProps) {
    const isActive = sortConfig.field === field;
    const isAsc = isActive && sortConfig.direction === 'asc';

    return (
        <th 
            className={`px-4 py-4 text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider cursor-pointer hover:text-wt-text transition-colors ${className}`}
            onClick={() => onSort(field)}
        >
            <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {Icon && <Icon className="w-3 h-3" />}
                {label}
                <div className="flex flex-col -gap-1 ml-1 opacity-50">
                    <ChevronUp className={`w-2.5 h-2.5 ${isActive && isAsc ? 'text-wt-gold opacity-100' : ''}`} />
                    <ChevronDown className={`w-2.5 h-2.5 ${isActive && !isAsc ? 'text-wt-gold opacity-100' : ''}`} />
                </div>
            </div>
        </th>
    );
}

/**
 * Metric Summary Card for dashboard-style stats
 */
function MetricSummaryCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
    const colorMap: Record<string, string> = {
        teal: 'text-teal-400 bg-teal-400/10',
        blue: 'text-blue-400 bg-blue-400/10',
        amber: 'text-amber-400 bg-amber-400/10',
        green: 'text-green-400 bg-green-400/10',
        rose: 'text-rose-400 bg-rose-400/10',
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-wt-surface/50 border border-wt-border/50">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.teal}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 font-medium">{label}</p>
                <p className="text-lg font-bold text-wt-text dark:text-wt-text">{value}</p>
            </div>
        </div>
    );
}

/**
 * Pagination footer component
 */
interface PaginationFooterProps {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

function PaginationFooter({ 
    currentPage, 
    pageSize, 
    totalItems, 
    totalPages, 
    onPageChange, 
    onPageSizeChange 
}: PaginationFooterProps) {
    const pageSizes = [20, 50, 100, Infinity];

    return (
        <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-wt-border/50 bg-wt-surface/90 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-4 text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70">
                <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select 
                        value={pageSize === Infinity ? 'all' : pageSize}
                        onChange={(e) => onPageSizeChange(e.target.value === 'all' ? Infinity : Number(e.target.value))}
                        className="bg-wt-surface-hover border border-wt-border rounded-lg px-2 py-1 text-wt-text focus:outline-none focus:ring-1 focus:ring-wt-gold transition-all cursor-pointer"
                    >
                        {pageSizes.map(size => (
                            <option key={size} value={size === Infinity ? 'all' : size}>
                                {size === Infinity ? 'All' : size}
                            </option>
                        ))}
                    </select>
                </div>
                <span>
                    Showing <span className="text-wt-text font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * (pageSize === Infinity ? totalItems : pageSize) + 1}</span> to <span className="text-wt-text font-medium">{Math.min(currentPage * (pageSize === Infinity ? totalItems : pageSize), totalItems)}</span> of <span className="text-wt-text font-medium">{totalItems}</span> items
                </span>
            </div>

            <div className="flex items-center gap-1 group/nav">
                <button 
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-lg bg-wt-surface-dark border border-wt-border hover:bg-wt-surface-hover hover:border-wt-gold/50 text-wt-text-muted hover:text-wt-text disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title="First Page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-lg bg-wt-surface-dark border border-wt-border hover:bg-wt-surface-hover hover:border-wt-gold/50 text-wt-text-muted hover:text-wt-text disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title="Previous Page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1 px-4 py-2 rounded-lg bg-wt-surface-dark/50 border border-wt-border/50">
                    <span className="text-xs font-bold text-wt-text-muted uppercase tracking-widest mr-1">Page</span>
                    <span className="text-sm font-black text-wt-gold">
                        {currentPage}
                    </span>
                    <span className="text-xs font-bold text-wt-text-muted/50 mx-1">/</span>
                    <span className="text-sm font-bold text-wt-text-muted">
                        {totalPages || 1}
                    </span>
                </div>

                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2.5 rounded-lg bg-wt-surface-dark border border-wt-border hover:bg-wt-surface-hover hover:border-wt-gold/50 text-wt-text-muted hover:text-wt-text disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title="Next Page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="p-2.5 rounded-lg bg-wt-surface-dark border border-wt-border hover:bg-wt-surface-hover hover:border-wt-gold/50 text-wt-text-muted hover:text-wt-text disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title="Last Page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
