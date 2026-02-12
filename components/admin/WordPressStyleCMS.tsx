/**
 * WordPress-Style CMS UI Component
 * 
 * Provides a polished, professional CMS experience matching WordPress
 */

"use client";

import React from 'react';
import { ActionButton, StatusBadge } from './AdminUIKit';
import { ADMIN_THEME } from '@/lib/admin/theme';
import { 
    FileText, 
    Plus, 
    Search, 
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    Clock,
    TrendingUp,
    Sparkles,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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
    read_time?: number;
    category?: string;
    featured_image?: string;
    quality_score?: number;
    seo_score?: number;
}

interface WordPressStyleCMSProps {
    articles: Article[] | null | undefined;
    isLoading?: boolean;
    onNewArticle?: () => void;
    onGenerate?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
    onPublish?: (id: string) => void;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    filterStatus?: string;
    onFilterChange?: (status: string) => void;
}

export default function WordPressStyleCMS({
    articles,
    isLoading = false,
    onNewArticle,
    onGenerate,
    onEdit,
    onDelete,
    onView,
    onPublish,
    searchTerm = '',
    onSearchChange,
    filterStatus = 'all',
    onFilterChange,
}: WordPressStyleCMSProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-wt-green-subtle text-wt-green border-wt-border-light';
            case 'draft':
                return 'bg-wt-card text-wt-text border-wt-border';
            case 'review':
                return 'bg-accent-100 text-accent-800 border-accent-200';
            case 'archived':
                return 'bg-wt-card text-wt-text border-wt-border';
            default:
                return 'bg-wt-card text-wt-text border-wt-border';
        }
    };

    const getStatusLabel = (status: string) => {
        return (status ?? 'draft').charAt(0).toUpperCase() + (status ?? 'draft').slice(1);
    };

    // Ensure articles is always an array
    const articlesArray = Array.isArray(articles) ? articles : [];
    
    const filteredArticles = articlesArray.filter(article => {
        if (filterStatus !== 'all' && article.status !== filterStatus) {
            return false;
        }
        if (searchTerm && article.title && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    });

    // Ensure articles is always an array for counts
    const articlesArrayForCounts = Array.isArray(articles) ? articles : [];
    
    const statusCounts = {
        all: articlesArrayForCounts.length,
        published: articlesArrayForCounts.filter(a => a.status === 'published').length,
        draft: articlesArrayForCounts.filter(a => a.status === 'draft').length,
        review: articlesArrayForCounts.filter(a => a.status === 'review').length,
        archived: articlesArrayForCounts.filter(a => a.status === 'archived').length,
    };

    return (
        <div className="space-y-6">
            {/* Header Bar - WordPress Style */}
            <div className="flex items-center justify-between border-b border-wt-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-wt-navy-900 tracking-tight">Content Library</h1>
                    <p className="text-sm font-medium text-wt-navy-500 mt-1">
                        Curate and manage your financial insights
                    </p>
                </div>
                <div className="flex gap-3">
                    {onGenerate && (
                        <ActionButton
                            onClick={onGenerate}
                            variant="secondary"
                            icon={Sparkles}
                        >
                            Generate with AI
                        </ActionButton>
                    )}
                    <ActionButton
                        onClick={onNewArticle}
                        variant="primary"
                        icon={Plus}
                    >
                        New Article
                    </ActionButton>
                </div>
            </div>

            {/* Stats Bar - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70 truncate">Total</p>
                                <p className="text-xl md:text-2xl font-bold text-wt-text">{statusCounts.all}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-wt-text-muted dark:text-wt-text-muted flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70 truncate">Published</p>
                                <p className="text-xl md:text-2xl font-bold text-wt-green">{statusCounts.published}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-wt-green flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70 truncate">Draft</p>
                                <p className="text-xl md:text-2xl font-bold text-wt-text-muted/50 dark:text-wt-text-muted/50">{statusCounts.draft}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-wt-text-muted dark:text-wt-text-muted flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70 truncate">Review</p>
                                <p className="text-xl md:text-2xl font-bold text-wt-gold">{statusCounts.review}</p>
                            </div>
                            <Eye className="w-6 h-6 md:w-8 md:h-8 text-accent-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70 truncate">Archived</p>
                                <p className="text-xl md:text-2xl font-bold text-wt-text-muted/50 dark:text-wt-text-muted/50">{statusCounts.archived}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-wt-text-muted dark:text-wt-text-muted flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search - WordPress Style */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-wt-bg-hover/30 p-6 md:p-8 rounded-xl border border-wt-border-subtle">
                <div className="flex-1 w-full sm:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wt-navy-400 group-focus-within:text-wt-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-wt-border-subtle rounded-lg focus:ring-4 focus:ring-wt-gold/10 focus:border-wt-gold transition-all"
                        />
                    </div>
                </div>
                <div className="flex gap-2 p-1 bg-wt-bg-hover rounded-xl border border-wt-border-subtle">
                    {['all', 'published', 'draft', 'review', 'archived'].map((status) => (
                        <button
                            key={status}
                            onClick={() => onFilterChange?.(status)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                filterStatus === status
                                    ? 'bg-wt-navy-900 text-white shadow-md'
                                    : 'text-wt-navy-500 hover:text-wt-navy-900 hover:bg-white/50'
                            }`}
                        >
                            {status === 'all' ? 'All Content' : status}
                            {statusCounts[status as keyof typeof statusCounts] > 0 && (
                                <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${
                                    filterStatus === status ? 'bg-white/20 text-white' : 'bg-wt-bg-hover text-wt-navy-400'
                                }`}>
                                    {statusCounts[status as keyof typeof statusCounts]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles List - WordPress Table Style */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wt-gold"></div>
                </div>
            ) : filteredArticles.length === 0 ? (
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 text-center">
                        <FileText className="w-12 h-12 text-wt-text-muted dark:text-wt-text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-wt-text mb-2">No articles found</h3>
                        <p className="text-wt-text-muted/70 dark:text-wt-text-muted/70 mb-4">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first article'}
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <Button onClick={onNewArticle} className="bg-wt-gold hover:bg-wt-gold-hover">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Article
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-white rounded-lg border border-wt-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-wt-surface-hover border-b border-wt-border">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider hidden sm:table-cell">
                                        Author
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider hidden md:table-cell">
                                        Categories
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider hidden lg:table-cell">
                                        Quality
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-wt-border">
                                {filteredArticles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className="hover:bg-wt-surface-hover transition-colors"
                                    >
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                {article.featured_image ? (
                                                    <img
                                                        src={article.featured_image}
                                                        alt={article.title}
                                                        className="w-10 h-10 md:w-12 md:h-12 rounded object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-wt-card flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-wt-text-muted dark:text-wt-text-muted" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="text-sm font-medium text-wt-text hover:text-wt-gold block truncate"
                                                    >
                                                        {article.title || 'Untitled'}
                                                    </Link>
                                                    {article.excerpt && (
                                                        <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1 line-clamp-1 hidden sm:block">
                                                            {article.excerpt}
                                                        </p>
                                                    )}
                                                    {/* Mobile: Show author and category */}
                                                    <div className="sm:hidden mt-1 flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                                            {article.author_name || 'Admin'}
                                                        </span>
                                                        {article.category && (
                                                            <Badge variant="secondary" className="bg-wt-card text-wt-text text-xs">
                                                                {article.category.replace(/-/g, ' ')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-wt-text-muted dark:text-wt-text-muted" />
                                                <span className="text-sm text-wt-text">
                                                    {article.author_name || 'Admin'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            {article.category && (
                                                <Badge variant="secondary" className="bg-wt-card text-wt-text">
                                                    {article.category.replace(/-/g, ' ')}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <StatusBadge 
                                                status={article.status === 'published' ? 'completed' : article.status === 'review' ? 'processing' : 'neutral'} 
                                                label={getStatusLabel(article.status)} 
                                            />
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className="flex items-center gap-2">
                                                {article.quality_score !== undefined ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            article.quality_score >= 80 ? 'bg-wt-green' : 
                                                            article.quality_score >= 50 ? 'bg-accent-500' : 'bg-wt-danger'
                                                        }`} />
                                                        <span className="text-sm font-medium text-wt-text">
                                                            {article.quality_score}
                                                            <span className="text-[10px] text-wt-text-muted dark:text-wt-text-muted ml-0.5">/100</span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-wt-text-muted dark:text-wt-text-muted italic">Not Audited</span>
                                                )}
                                            </div>
                                        </td>
                                         <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1 md:gap-2">
                                                {article.status === 'draft' && onPublish && (
                                                    <ActionButton
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => onPublish(article.id)}
                                                        className="h-8 px-3 text-[10px]"
                                                    >
                                                        Publish
                                                    </ActionButton>
                                                )}
                                                <ActionButton
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onEdit?.(article.id)}
                                                    icon={Edit}
                                                    className="h-8 w-8 p-0"
                                                />
                                                <ActionButton
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => window.open(`/articles/${article.slug}${article.status !== 'published' ? '?preview=true' : ''}`, '_blank')}
                                                    icon={Eye}
                                                    className="h-8 w-8 p-0"
                                                />
                                                {onDelete && (
                                                    <ActionButton
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
                                                                onDelete(article.id);
                                                            }
                                                        }}
                                                        icon={Trash2}
                                                        className="h-8 w-8 p-0 text-wt-danger hover:bg-wt-danger/5"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

