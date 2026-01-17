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
import { exportToCSV, articleCSVColumns } from '@/lib/utils/csv-export';
import { AdminPageHeader, StatCard, ContentSection, StatusBadge, ActionButton } from '@/components/admin/AdminUIKit';

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

    const articlesArray = useMemo(() => Array.isArray(articles) ? articles : [], [articles]);
    
    const filteredArticles = useMemo(() => articlesArray.filter(article => {
        if (filterStatus !== 'all' && article.status !== filterStatus) return false;
        if (searchTerm && article.title && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    }), [articlesArray, filterStatus, searchTerm]);

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

    const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
        switch (status) {
            case 'published': return 'success';
            case 'draft': return 'default';
            case 'review': return 'warning';
            case 'archived': return 'info';
            default: return 'default';
        }
    };

    // Helper to get score color
    const getScoreColor = (score: number | undefined): string => {
        if (!score) return 'text-slate-500';
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
                            <ActionButton onClick={onGenerate} variant="secondary" icon={Sparkles}>
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
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Avg Quality</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {(() => {
                                    const scores = articlesArray.map(a => a.quality_score).filter((s): s is number => s !== undefined && s !== null);
                                    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '—';
                                })()}
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <SearchIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Avg SEO</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {(() => {
                                    const scores = articlesArray.map(a => a.seo_score).filter((s): s is number => s !== undefined && s !== null);
                                    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '—';
                                })()}
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-green-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wider">With Research</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {articlesArray.filter(hasResearch).length}
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Trending</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {articlesArray.filter(isTrending).length}
                            </div>
                        </div>
                    </div>
                </ContentSection>
            )}

            {/* Filters */}
            <ContentSection>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'published', 'draft', 'review', 'archived'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => onFilterChange?.(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    filterStatus === status
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                <span className="ml-2 text-xs opacity-75">({statusCounts[status]})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </ContentSection>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                </div>
            ) : filteredArticles.length === 0 ? (
                <ContentSection>
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No articles found</h3>
                        <p className="text-slate-400 mb-6">
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
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 w-12">
                                        <div 
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                isAllSelected ? 'bg-primary-500 border-primary-500' : 
                                                isPartialSelected ? 'bg-primary-500/50 border-primary-500' : 
                                                'border-slate-600 hover:border-primary-500'
                                            }`}
                                            onClick={isAllSelected || isPartialSelected ? deselectAll : selectAll}
                                        >
                                            {isAllSelected && <Check className="w-3 h-3 text-white" />}
                                            {isPartialSelected && <Minus className="w-3 h-3 text-white" />}
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            Views
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-3 h-3" />
                                            Quality
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <SearchIcon className="w-3 h-3" />
                                            SEO
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <BarChart3 className="w-3 h-3" />
                                            Research
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Flame className="w-3 h-3" />
                                            Trending
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredArticles.map((article) => {
                                    const isSelected = selectedIds.includes(article.id);
                                    return (
                                        <tr 
                                            key={article.id} 
                                            className={`group transition-colors ${isSelected ? 'bg-primary-500/10' : 'hover:bg-white/5'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div 
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                        isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-600 group-hover:border-primary-500'
                                                    }`}
                                                    onClick={() => toggleSelection(article.id)}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    {article.featured_image ? (
                                                        <img src={article.featured_image} alt="" className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/10" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-1 ring-white/10">
                                                            <FileText className="w-5 h-5 text-slate-500" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-white hover:text-primary-400 transition-colors block truncate max-w-[300px]">
                                                            {article.title || 'Untitled'}
                                                        </Link>
                                                        {article.excerpt && (
                                                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[300px] hidden sm:block">{article.excerpt}</p>
                                                        )}
                                                        {(article.published_at || article.published_date) && (
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(article.published_at || article.published_date || '').toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-medium">
                                                        {(article.author_name || 'A')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-slate-300">{article.author_name || 'Admin'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden lg:table-cell">
                                                {article.category && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
                                                        {article.category.replace(/-/g, ' ')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge variant={getStatusVariant(article.status)}>
                                                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                                </StatusBadge>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className="text-sm font-medium text-slate-300">
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
                                                    <span className="text-xs text-slate-600">—</span>
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
                                                    <span className="text-xs text-slate-600">—</span>
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
                                                    <span className="text-xs text-slate-600">—</span>
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
                                                    <span className="text-xs text-slate-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {article.status === 'draft' && onPublish && (
                                                        <button onClick={() => onPublish(article.id)} className="p-2 hover:bg-primary-500/20 rounded-lg text-primary-400 transition-colors" title="Publish">
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <Link href={`/admin/articles/${article.id}/edit`}>
                                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    <Link href={`/articles/${article.slug}${article.status !== 'published' ? '?preview=true' : ''}`} target="_blank">
                                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="View">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    {onDelete && (
                                                        <button onClick={() => { if (confirm('Delete this article?')) onDelete(article.id); }} className="p-2 hover:bg-danger-500/20 rounded-lg text-slate-400 hover:text-danger-400 transition-colors" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
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
                        <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-primary-400" />
                                </div>
                                <span className="text-sm font-medium text-white">{selectedIds.length} selected</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleBulkAction('publish')} disabled={!!bulkLoading} className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                                    <Send className="w-4 h-4" /> Publish
                                </button>
                                <button onClick={() => handleBulkAction('archive')} disabled={!!bulkLoading} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                                    <Archive className="w-4 h-4" /> Archive
                                </button>
                                <button onClick={() => handleBulkAction('export')} className="px-4 py-2 bg-secondary-500/20 hover:bg-secondary-500/30 text-secondary-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                    <Download className="w-4 h-4" /> Export
                                </button>
                                <button onClick={() => handleBulkAction('delete')} disabled={!!bulkLoading} className="px-4 py-2 bg-danger-500/20 hover:bg-danger-500/30 text-danger-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                            <button onClick={deselectAll} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
