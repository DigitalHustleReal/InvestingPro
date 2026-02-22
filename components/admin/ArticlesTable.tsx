"use client";

import React, { useState, useMemo } from 'react';
import { 
    Search, 
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2, 
    Globe, 
    FileText, 
    Archive, 
    CheckCircle, 
    ShieldCheck, 
    User, 
    Clock,
    Flame,
    RefreshCw,
    Download,
    Plus,
    Filter,
    Check,
    Minus,
    Send,
    X,
    Sparkles,
    TrendingUp,
    Star,
    Calendar,
    SlidersHorizontal,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { exportToCSV, articleCSVColumns } from '@/lib/utils/csv-export';
import { AdminPageHeader, StatCard, ActionButton } from '@/components/admin/AdminUIKit';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';

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
    verified_by_expert?: boolean;
    ai_generated?: boolean;
    tags?: string[];
    read_time?: number;
    deleted_at?: string;
    last_refreshed_at?: string;
}

// TTL CONFIGURATION (Days) matching staleness-detector.ts
const CATEGORY_TTLS: Record<string, number> = {
    'mutual-funds': 30,
    'credit-cards': 60,
    'loans': 90,
    'stocks': 7,
    'investing-basics': 180,
    'banking': 120,
    'default': 90
};

interface ArticlesTableProps {
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
    onRestore?: (id: string) => void;
    onBulkRestore?: (ids: string[]) => Promise<void>;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    filterStatus?: string;
    onFilterChange?: (status: string) => void;
}

export default function ArticlesTable({
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
    onRestore,
    onBulkRestore,
    searchTerm = '',
    onSearchChange,
    filterStatus = 'all',
    onFilterChange,
}: ArticlesTableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkLoading, setBulkLoading] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Article>>({});
    const [saveLoading, setSaveLoading] = useState(false);

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
        // Filter by Trash (soft-deleted) or Normal
        if (filterStatus === 'trash') {
            if (!(article as any).deleted_at) return false;
        } else if (filterStatus === 'stale') {
            if ((article as any).deleted_at) return false;
            // Calculate staleness
            const lastUpdated = new Date(article.updated_at || article.created_at || 0);
            const now = new Date();
            const ageDays = Math.ceil(Math.abs(now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
            const ttlDays = CATEGORY_TTLS[article.category || 'default'] || CATEGORY_TTLS['default'];
            if (ageDays <= ttlDays) return false;
        } else {
            if ((article as any).deleted_at) return false;
            // Filter by status if not 'all'
            if (filterStatus !== 'all' && article.status !== filterStatus) return false;
        }
        
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
    }, [articlesArray, filterStatus, searchTerm, sortConfig]);

    const totalPages = pagination.pageSize === Infinity 
        ? 1 
        : Math.ceil(filteredArticles.length / pagination.pageSize);

    const paginatedArticles = useMemo(() => {
        if (pagination.pageSize === Infinity) return filteredArticles;
        const start = (pagination.currentPage - 1) * pagination.pageSize;
        return filteredArticles.slice(start, start + pagination.pageSize);
    }, [filteredArticles, pagination]);

    const handleSort = (field: string) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const statusCounts = useMemo(() => {
        const counts = {
            all: 0,
            published: 0,
            draft: 0,
            review: 0,
            archived: 0,
            trash: 0,
            stale: 0
        };

        articlesArray.forEach(a => {
            if (a.deleted_at) {
                counts.trash++;
            } else {
                counts.all++;
                if (a.status in counts) {
                    counts[a.status as keyof typeof counts]++;
                }
                
                // Check staleness for count
                const lastUpdated = new Date(a.updated_at || a.created_at || 0);
                const ageDays = Math.ceil(Math.abs(Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
                const ttlDays = CATEGORY_TTLS[a.category || 'default'] || CATEGORY_TTLS['default'];
                if (ageDays > ttlDays) {
                    counts.stale++;
                }
            }
        });

        return counts;
    }, [articlesArray]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => setSelectedIds(filteredArticles.map(a => a.id));
    const deselectAll = () => setSelectedIds([]);
    
    const isAllSelected = filteredArticles.length > 0 && selectedIds.length === filteredArticles.length;
    const isPartialSelected = selectedIds.length > 0 && selectedIds.length < filteredArticles.length;

    const handleQuickEdit = (article: Article) => {
        setEditingId(article.id);
        setEditForm({ ...article });
    };

    const handleQuickCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleQuickSave = async () => {
        if (!editForm.title?.trim()) {
            toast.error("Title is required");
            return;
        }

        try {
            setSaveLoading(true);
            
            // Call API route instead of direct service (to avoid server-only import)
            const response = await fetch(`/api/admin/articles/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metadata: {
                        title: editForm.title,
                        slug: editForm.slug,
                        status: editForm.status,
                        category: editForm.category,
                        primary_keyword: editForm.primary_keyword
                    }
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update article");
            }
            
            toast.success("Article updated successfully");
            setEditingId(null);
            setEditForm({});
            
            // Reload to reflect changes
            if (window) window.location.reload(); 
        } catch (error: any) {
            console.error("Error saving article:", error);
            toast.error(error.message || "Failed to save article");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleBulkAction = async (action: 'publish' | 'archive' | 'delete' | 'restore' | 'export') => {
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
            restore: `Restore ${selectedIds.length} articles?`,
        };

        if (!confirm(confirmMessages[action])) return;

        setBulkLoading(action);
        try {
            if (action === 'publish' && onBulkPublish) await onBulkPublish(selectedIds);
            if (action === 'archive' && onBulkArchive) await onBulkArchive(selectedIds);
            if (action === 'delete' && onBulkDelete) await onBulkDelete(selectedIds);
            if (action === 'restore' && onBulkRestore) await onBulkRestore(selectedIds);
            
            toast.success(`Successfully ${action}ed ${selectedIds.length} articles`);
            deselectAll();
        } catch (error: any) {
            toast.error(`Failed: ${error.message}`);
        } finally {
            setBulkLoading(null);
        }
    };

    // Helper to check if article is trending
    const isTrending = (article: Article): boolean => {
        if (!article.views || article.views < 50) return false;
        if (!article.published_at && !article.published_date) return false;
        const publishedDate = new Date(article.published_at || article.published_date || '');
        const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSincePublished <= 30 && article.views >= 50;
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

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-stretch md:self-auto overflow-x-auto no-scrollbar">
                    {(['all', 'published', 'draft', 'review', 'archived', 'trash', 'stale'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => onFilterChange?.(status)}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap",
                                filterStatus === status
                                    ? status === 'stale' 
                                        ? "bg-rose-500 text-white shadow-sm"
                                        : "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            {status}
                            <span className={cn(
                                "ml-2 opacity-50 text-[10px]",
                                status === 'stale' && filterStatus !== 'stale' && statusCounts.stale > 0 && "text-rose-500 opacity-100 font-black"
                            )}>
                                {statusCounts[status]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No articles found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters to find what you are looking for.'
                                : 'Get started by creating your first article.'}
                        </p>
                        {searchTerm || filterStatus !== 'all' ? (
                            <Button onClick={() => { onSearchChange?.(''); onFilterChange?.('all'); }} variant="outline">
                                Clear Filters
                            </Button>
                        ) : (
                            <ActionButton onClick={onNewArticle} icon={Plus}>Create Article</ActionButton>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3 w-12 text-center">
                                        <div 
                                            className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors mx-auto",
                                                isAllSelected ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-sky-500"
                                            )}
                                            onClick={isAllSelected || isPartialSelected ? deselectAll : selectAll}
                                        >
                                            {isAllSelected && <Check className="w-3 h-3" />}
                                            {isPartialSelected && <Minus className="w-3 h-3" />}
                                        </div>
                                    </th>
                                    <SortableHeader label="Title" field="title" sortConfig={sortConfig} onSort={handleSort} />
                                    <SortableHeader label="Status" field="status" sortConfig={sortConfig} onSort={handleSort} className="hidden sm:table-cell" />
                                    <SortableHeader label="Author" field="author_name" sortConfig={sortConfig} onSort={handleSort} className="hidden lg:table-cell" />
                                    <SortableHeader label="Category" field="category" sortConfig={sortConfig} onSort={handleSort} className="hidden md:table-cell" />
                                    <SortableHeader label="Keyword" field="primary_keyword" sortConfig={sortConfig} onSort={handleSort} className="hidden xl:table-cell" />
                                    <SortableHeader label="SEO" field="seo_score" sortConfig={sortConfig} onSort={handleSort} align="right" />
                                    <SortableHeader label="Score" field="quality_score" sortConfig={sortConfig} onSort={handleSort} align="right" />
                                    <SortableHeader label="Views" field="views" sortConfig={sortConfig} onSort={handleSort} align="right" className="hidden sm:table-cell" />
                                    <SortableHeader label="Updated" field="updated_at" sortConfig={sortConfig} onSort={handleSort} align="right" className="hidden xl:table-cell" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {paginatedArticles.map((article) => {
                                    const isSelected = selectedIds.includes(article.id);
                                    const isEditing = editingId === article.id;

                                    if (isEditing) {
                                        return (
                                            <tr key={article.id} className="bg-sky-50/50 dark:bg-sky-900/10 border-2 border-sky-500/50">
                                                <td colSpan={10} className="p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase text-slate-500">Title</label>
                                                            <input 
                                                                type="text"
                                                                value={editForm.title || ''}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                                                                placeholder="Article Title"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase text-slate-500">Slug</label>
                                                            <input 
                                                                type="text"
                                                                value={editForm.slug || ''}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                                                                placeholder="article-slug"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase text-slate-500">Status</label>
                                                            <select 
                                                                value={editForm.status || 'draft'}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                                                            >
                                                                <option value="draft">Draft</option>
                                                                <option value="review">Review</option>
                                                                <option value="published">Published</option>
                                                                <option value="archived">Archived</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase text-slate-500">Category</label>
                                                            <select 
                                                                value={editForm.category || ''}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                                                            >
                                                                <option value="">Select Category</option>
                                                                {Object.keys(CATEGORY_TTLS).filter(k => k !== 'default').map(cat => (
                                                                    <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold uppercase text-slate-500">Primary Keyword</label>
                                                            <input 
                                                                type="text"
                                                                value={editForm.primary_keyword || ''}
                                                                onChange={(e) => setEditForm(prev => ({ ...prev, primary_keyword: e.target.value }))}
                                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                                                                placeholder="Target Keyword"
                                                            />
                                                        </div>
                                                        <div className="flex items-end gap-2">
                                                            <Button 
                                                                size="sm" 
                                                                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold"
                                                                onClick={handleQuickSave}
                                                                disabled={saveLoading}
                                                            >
                                                                {saveLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : 'Update Article'}
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="px-4 text-slate-500"
                                                                onClick={handleQuickCancel}
                                                                disabled={saveLoading}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr 
                                            key={article.id} 
                                            className={cn(
                                                "group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                                isSelected && "bg-sky-100 dark:bg-sky-900/30"
                                            )}
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <div 
                                                    className={cn(
                                                        "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors mx-auto",
                                                        isSelected ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300 dark:border-slate-600 group-hover:border-sky-400"
                                                    )}
                                                    onClick={() => toggleSelection(article.id)}
                                                >
                                                    {isSelected && <Check className="w-3 h-3" />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link 
                                                    href={`/admin/articles/${article.id}/edit`} 
                                                    className={cn(
                                                        "font-semibold transition-colors block mb-0.5",
                                                        isSelected 
                                                            ? "text-sky-900 dark:text-sky-100" 
                                                            : "text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400"
                                                    )}
                                                >
                                                    {article.title || 'Untitled'}
                                                </Link>
                                                
                                                {/* WP-Style Row Actions */}
                                                <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold">
                                                    {filterStatus === 'trash' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => onRestore?.(article.id)}
                                                                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                                            >
                                                                Restore
                                                            </button>
                                                            <span className="text-slate-300 dark:text-slate-700">|</span>
                                                            <button 
                                                                onClick={() => { if(confirm('Permanently delete?')) onDelete?.(article.id) }}
                                                                className="text-rose-600 hover:text-rose-700"
                                                            >
                                                                Delete Permanently
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={() => onEdit?.(article.id)}
                                                                className="text-sky-600 hover:text-sky-700 dark:text-sky-400"
                                                            >
                                                                Edit
                                                            </button>
                                                            <span className="text-slate-300 dark:text-slate-700">|</span>
                                                            <button 
                                                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                                onClick={() => handleQuickEdit(article)}
                                                            >
                                                                Quick Edit
                                                            </button>
                                                            <span className="text-slate-300 dark:text-slate-700">|</span>
                                                            <Link 
                                                                href={`/article/${article.slug}`} 
                                                                target="_blank"
                                                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                            >
                                                                View
                                                            </Link>
                                                            {onDelete && (
                                                                <>
                                                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                                                    <button 
                                                                        onClick={() => { if(confirm('Move to Trash?')) onDelete(article.id) }}
                                                                        className="text-rose-600 hover:text-rose-700"
                                                                    >
                                                                        Trash
                                                                    </button>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 mt-1">
                                                    {isTrending(article) && (
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                                            isSelected 
                                                                ? "bg-rose-500 text-white" 
                                                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                                        )}>
                                                            <Flame className="w-3 h-3" /> Trending
                                                        </span>
                                                    )}
                                                    {(() => {
                                                        const lastUpdated = new Date(article.updated_at || article.created_at || 0);
                                                        const ageDays = Math.ceil(Math.abs(Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
                                                        const ttlDays = CATEGORY_TTLS[article.category || 'default'] || CATEGORY_TTLS['default'];
                                                        if (ageDays > ttlDays) {
                                                            return (
                                                                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800" title={`Stale: ${ageDays} days old (Limit: ${ttlDays})`}>
                                                                    <Clock className="w-3 h-3" /> Stale
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <Badge variant="outline" className={cn(
                                                    "capitalize",
                                                    article.status === 'published' && "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
                                                    article.status === 'draft' && "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
                                                    article.status === 'review' && "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                                                    article.status === 'archived' && "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                                                )}>
                                                    {article.status}
                                                </Badge>
                                            </td>
                                            <td className={cn(
                                                "px-4 py-3 transition-colors hidden lg:table-cell",
                                                isSelected 
                                                    ? "text-sky-900 dark:text-sky-50 font-semibold" 
                                                    : "text-slate-700 dark:text-slate-200"
                                            )}>
                                                {article.author_name || 'Admin'}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                {article.category ? (
                                                    <span className={cn(
                                                        "inline-block px-2 py-0.5 rounded text-xs border transition-colors",
                                                        isSelected 
                                                            ? "bg-sky-200/50 dark:bg-sky-500/30 text-sky-900 dark:text-white border-sky-300 dark:border-sky-400" 
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                                    )}>
                                                        {article.category.replace(/-/g, ' ')}
                                                    </span>
                                                ) : <span className="text-slate-400 font-mono">-</span>}
                                            </td>
                                            <td className="px-4 py-3 hidden xl:table-cell">
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px] block">
                                                    {article.primary_keyword || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        (article.seo_score || 0) >= 80 ? "text-emerald-500" :
                                                        (article.seo_score || 0) >= 50 ? "text-amber-500" : "text-rose-500"
                                                    )}>
                                                        {article.seo_score || '-'}
                                                    </span>
                                                    {(article.seo_score || 0) > 0 && (
                                                        <div className="w-8 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                            <div 
                                                                className={cn(
                                                                    "h-full",
                                                                    (article.seo_score || 0) >= 80 ? "bg-emerald-500" :
                                                                    (article.seo_score || 0) >= 50 ? "bg-amber-500" : "bg-rose-500"
                                                                )}
                                                                style={{ width: `${article.seo_score}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        (article.quality_score || 0) >= 80 ? "text-emerald-500" :
                                                        (article.quality_score || 0) >= 50 ? "text-amber-500" : "text-rose-500"
                                                    )}>
                                                        {article.quality_score || '-'}
                                                    </span>
                                                    {(article.quality_score || 0) > 0 && (
                                                        <div className="w-8 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                            <div 
                                                                className={cn(
                                                                    "h-full",
                                                                    (article.quality_score || 0) >= 80 ? "bg-emerald-500" :
                                                                    (article.quality_score || 0) >= 50 ? "bg-amber-500" : "bg-rose-500"
                                                                )}
                                                                style={{ width: `${article.quality_score}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={cn(
                                                "px-4 py-3 text-right font-mono text-xs transition-colors hidden sm:table-cell",
                                                isSelected ? "text-sky-900 dark:text-sky-50 font-bold" : "text-slate-700 dark:text-slate-200"
                                            )}>
                                                {article.views?.toLocaleString() || 0}
                                            </td>
                                            <td className={cn(
                                                "px-4 py-3 text-right text-xs transition-colors hidden xl:table-cell",
                                                isSelected ? "text-sky-900 dark:text-sky-200 font-medium" : "text-slate-500 dark:text-slate-400"
                                            )}>
                                                {new Date(article.updated_at || article.created_at || '').toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Page {pagination.currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                                disabled={pagination.currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(totalPages, prev.currentPage + 1) }))}
                                disabled={pagination.currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
                    >
                        <div className="flex items-center gap-3 p-2 px-4 bg-slate-900 dark:bg-slate-800 rounded-full shadow-2xl border-2 border-sky-500/50 text-white ring-4 ring-black/5">
                            <span className="text-sm font-bold whitespace-nowrap px-2">
                                {selectedIds.length} Article{selectedIds.length !== 1 ? 's' : ''} Selected
                            </span>
                            
                            <div className="h-8 w-px bg-slate-700 mx-1" />
                            
                            <div className="flex items-center gap-1">
                                {filterStatus === 'trash' ? (
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-9 px-4 font-bold"
                                        onClick={() => handleBulkAction('restore')}
                                    >
                                        <Send className="w-4 h-4 mr-2 rotate-180" />
                                        Restore
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 h-9 px-4 font-bold"
                                            onClick={() => handleBulkAction('publish')}
                                        >
                                            Publish
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-slate-300 hover:text-white hover:bg-slate-700 h-9 px-4 font-bold"
                                            onClick={() => handleBulkAction('archive')}
                                        >
                                            Archive
                                        </Button>
                                    </>
                                )}
                                
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-9 px-4 font-bold"
                                    onClick={() => handleBulkAction('delete')}
                                >
                                    {filterStatus === 'trash' ? 'Delete Forever' : 'Trash'}
                                </Button>
                                
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-slate-400 hover:text-white hover:bg-slate-700 h-9 w-9 p-0 rounded-full ml-2"
                                    onClick={deselectAll}
                                    title="Deselect All"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SortableHeader({ label, field, sortConfig, onSort, align = 'left', className }: { label: string, field: string, sortConfig: any, onSort: any, align?: 'left' | 'right', className?: string }) {
    const isActive = sortConfig.field === field;
    
    return (
        <th 
            className={cn(
                "px-4 py-3 cursor-pointer select-none group transition-colors",
                isActive ? "bg-slate-100/50 dark:bg-slate-800/30" : "hover:bg-slate-100/30 dark:hover:bg-slate-800/20",
                align === 'right' ? "text-right" : "text-left",
                className
            )}
            onClick={() => onSort(field)}
        >
            <div className={cn("flex items-center gap-1", align === 'right' ? "justify-end" : "justify-start")}>
                <span className={cn(
                    "text-xs font-black uppercase tracking-widest transition-colors",
                    isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                )}>
                    {label}
                </span>
                <div className="flex flex-col">
                    <ChevronUp className={cn(
                        "w-2.5 h-2.5 -mb-1 transition-colors",
                        isActive && sortConfig.direction === 'asc' ? "text-sky-600 dark:text-sky-400" : "text-slate-300 dark:text-slate-700"
                    )} />
                    <ChevronDown className={cn(
                        "w-2.5 h-2.5 transition-colors",
                        isActive && sortConfig.direction === 'desc' ? "text-sky-600 dark:text-sky-400" : "text-slate-300 dark:text-slate-700"
                    )} />
                </div>
            </div>
        </th>
    );
}
