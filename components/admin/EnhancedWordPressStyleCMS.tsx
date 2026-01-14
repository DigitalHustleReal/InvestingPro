/**
 * Enhanced WordPress-Style CMS with Bulk Operations
 */

"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, Plus, Search, Edit, Trash2, Eye, User, TrendingUp, Sparkles, 
    Download, Check, Minus, Send, Archive, X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { exportToCSV, articleCSVColumns } from '@/lib/utils/csv-export';

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

interface EnhancedCMSProps {
    articles: Article[] | null | undefined;
    isLoading?: boolean;
    onNewArticle?: () => void;
    onGenerate?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
    onPublish?: (id: string) => void;
    onBulkPublish?: (ids: string[]) => Promise<void>;
    onBulkArchive?: (ids: string[]) => Promise<void>;
    onBulkDelete?: (ids: string[]) => Promise<void>;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    filterStatus?: string;
    onFilterChange?: (status: string) => void;
}

export default function EnhancedWordPressStyleCMS({
    articles,
    isLoading = false,
    onNewArticle,
    onGenerate,
    onEdit,
    onDelete,
    onView,
    onPublish,
    onBulkPublish,
    onBulkArchive,
    onBulkDelete,
    searchTerm = '',
    onSearchChange,
    filterStatus = 'all',
    onFilterChange,
}: EnhancedCMSProps) {
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

    // Selection handlers
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => setSelectedIds(filteredArticles.map(a => a.id));
    const deselectAll = () => setSelectedIds([]);
    
    const isAllSelected = filteredArticles.length > 0 && selectedIds.length === filteredArticles.length;
    const isPartialSelected = selectedIds.length > 0 && selectedIds.length < filteredArticles.length;

    // Bulk action handlers
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-success-100 text-success-800 border-success-200';
            case 'draft': return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'review': return 'bg-accent-100 text-accent-800 border-accent-200';
            case 'archived': return 'bg-slate-100 text-slate-800 border-slate-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Articles</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your content library</p>
                </div>
                <div className="flex gap-3">
                    {onGenerate && (
                        <Button onClick={onGenerate} className="bg-secondary-600 hover:bg-secondary-700 text-white">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate with AI
                        </Button>
                    )}
                    <Button onClick={onNewArticle} className="bg-primary-600 hover:bg-primary-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Article
                    </Button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {[
                    { label: 'Total', count: statusCounts.all, icon: FileText, color: 'text-slate-400' },
                    { label: 'Published', count: statusCounts.published, icon: TrendingUp, color: 'text-success-400' },
                    { label: 'Draft', count: statusCounts.draft, icon: FileText, color: 'text-slate-400' },
                    { label: 'Review', count: statusCounts.review, icon: Eye, color: 'text-accent-400' },
                    { label: 'Archived', count: statusCounts.archived, icon: FileText, color: 'text-slate-400' },
                ].map(stat => (
                    <Card key={stat.label} className="border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm text-slate-500">{stat.label}</p>
                                    <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.count}</p>
                                </div>
                                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex-1 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'published', 'draft', 'review', 'archived'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => onFilterChange?.(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterStatus === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Table with Selection */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : filteredArticles.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="p-6 text-center">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                        <p className="text-slate-500 mb-4">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first article'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-12">
                                        <div 
                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                isAllSelected ? 'bg-primary-600 border-primary-600' : 
                                                isPartialSelected ? 'bg-primary-600/50 border-primary-600' : 
                                                'border-slate-300 hover:border-primary-500'
                                            }`}
                                            onClick={isAllSelected || isPartialSelected ? deselectAll : selectAll}
                                        >
                                            {isAllSelected && <Check className="w-3 h-3 text-white" />}
                                            {isPartialSelected && <Minus className="w-3 h-3 text-white" />}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Author</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredArticles.map((article) => {
                                    const isSelected = selectedIds.includes(article.id);
                                    return (
                                        <tr 
                                            key={article.id} 
                                            className={`transition-colors ${isSelected ? 'bg-primary-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <td className="px-4 py-3">
                                                <div 
                                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                        isSelected ? 'bg-primary-600 border-primary-600' : 'border-slate-300 hover:border-primary-500'
                                                    }`}
                                                    onClick={() => toggleSelection(article.id)}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {article.featured_image ? (
                                                        <img src={article.featured_image} alt="" className="w-10 h-10 rounded object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-slate-900 hover:text-primary-600">
                                                            {article.title || 'Untitled'}
                                                        </Link>
                                                        {article.excerpt && (
                                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1 hidden sm:block">{article.excerpt}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-700">{article.author_name || 'Admin'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                {article.category && (
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                        {article.category.replace(/-/g, ' ')}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge className={getStatusColor(article.status)}>
                                                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {article.status === 'draft' && onPublish && (
                                                        <Button size="sm" variant="ghost" onClick={() => onPublish(article.id)} className="text-success-600 hover:text-success-700">
                                                            Publish
                                                        </Button>
                                                    )}
                                                    <Link href={`/admin/articles/${article.id}/edit`}>
                                                        <Button size="sm" variant="ghost" className="text-slate-600">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/articles/${article.slug}${article.status !== 'published' ? '?preview=true' : ''}`} target="_blank">
                                                        <Button size="sm" variant="ghost" className="text-slate-600">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    {onDelete && (
                                                        <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete?')) onDelete(article.id); }} className="text-danger-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
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
                        <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700">
                            <span className="text-sm font-medium">{selectedIds.length} selected</span>
                            <div className="w-px h-6 bg-slate-700" />
                            <Button size="sm" onClick={() => handleBulkAction('publish')} disabled={!!bulkLoading} className="bg-success-600 hover:bg-success-700 text-white">
                                {bulkLoading === 'publish' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                                Publish
                            </Button>
                            <Button size="sm" onClick={() => handleBulkAction('archive')} disabled={!!bulkLoading} className="bg-slate-600 hover:bg-slate-500 text-white">
                                {bulkLoading === 'archive' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Archive className="w-4 h-4 mr-1" />}
                                Archive
                            </Button>
                            <Button size="sm" onClick={() => handleBulkAction('export')} className="bg-secondary-600 hover:bg-secondary-700 text-white">
                                <Download className="w-4 h-4 mr-1" />
                                Export
                            </Button>
                            <Button size="sm" onClick={() => handleBulkAction('delete')} disabled={!!bulkLoading} className="bg-danger-600 hover:bg-danger-700 text-white">
                                {bulkLoading === 'delete' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                                Delete
                            </Button>
                            <button onClick={deselectAll} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
