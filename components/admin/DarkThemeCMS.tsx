/**
 * Dark Theme CMS - Enhanced WordPress-Style with Premium UI
 */

"use client";

import React, { useState, useMemo } from 'react';
import { 
    FileText, Plus, Search, Edit, Trash2, Eye, User, TrendingUp, Sparkles, 
    Download, Check, Minus, Send, Archive, X, Calendar
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
    views?: number;
    category?: string;
    featured_image?: string;
    quality_score?: number;
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
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'published', 'draft', 'review', 'archived'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => onFilterChange?.(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    filterStatus === status
                                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
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
                    <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
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
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 w-12">
                                        <div 
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                isAllSelected ? 'bg-teal-500 border-teal-500' : 
                                                isPartialSelected ? 'bg-teal-500/50 border-teal-500' : 
                                                'border-slate-600 hover:border-teal-500'
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
                                    <th className="px-4 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredArticles.map((article) => {
                                    const isSelected = selectedIds.includes(article.id);
                                    return (
                                        <tr 
                                            key={article.id} 
                                            className={`group transition-colors ${isSelected ? 'bg-teal-500/10' : 'hover:bg-white/5'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div 
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                        isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-600 group-hover:border-teal-500'
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
                                                        <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-white hover:text-teal-400 transition-colors block truncate max-w-[300px]">
                                                            {article.title || 'Untitled'}
                                                        </Link>
                                                        {article.excerpt && (
                                                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[300px] hidden sm:block">{article.excerpt}</p>
                                                        )}
                                                        {article.published_at && (
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(article.published_at).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-medium">
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
                                                        <button onClick={() => { if (confirm('Delete this article?')) onDelete(article.id); }} className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-colors" title="Delete">
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
                                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-teal-400" />
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
                                <button onClick={() => handleBulkAction('delete')} disabled={!!bulkLoading} className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
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
