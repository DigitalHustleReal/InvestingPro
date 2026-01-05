/**
 * WordPress-Style CMS UI Component
 * 
 * Provides a polished, professional CMS experience matching WordPress
 */

"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    Sparkles
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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'draft':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'archived':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
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
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Articles</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage your content library
                    </p>
                </div>
                <div className="flex gap-3">
                    {onGenerate && (
                        <Button
                            onClick={onGenerate}
                            className="bg-secondary-600 hover:bg-secondary-700 text-white"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate with AI
                        </Button>
                    )}
                    <Button
                        onClick={onNewArticle}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Article
                    </Button>
                </div>
            </div>

            {/* Stats Bar - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-500 truncate">Total</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900">{statusCounts.all}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-slate-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-500 truncate">Published</p>
                                <p className="text-xl md:text-2xl font-bold text-green-600">{statusCounts.published}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-500 truncate">Draft</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-600">{statusCounts.draft}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-slate-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-500 truncate">Review</p>
                                <p className="text-xl md:text-2xl font-bold text-yellow-600">{statusCounts.review}</p>
                            </div>
                            <Eye className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-500 truncate">Archived</p>
                                <p className="text-xl md:text-2xl font-bold text-gray-600">{statusCounts.archived}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search - WordPress Style */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-6 md:p-8 rounded-lg border border-slate-200">
                <div className="flex-1 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    {['all', 'published', 'draft', 'review', 'archived'].map((status) => (
                        <button
                            key={status}
                            onClick={() => onFilterChange?.(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterStatus === status
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {(status ?? 'All').charAt(0).toUpperCase() + (status ?? 'All').slice(1)}
                            {statusCounts[status as keyof typeof statusCounts] > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            ) : filteredArticles.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 text-center">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                        <p className="text-slate-500 mb-4">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first article'}
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <Button onClick={onNewArticle} className="bg-teal-600 hover:bg-teal-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Article
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                                        Author
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                        Categories
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                                        Quality
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredArticles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className="hover:bg-slate-50 transition-colors"
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
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                        className="text-sm font-medium text-slate-900 hover:text-teal-600 block truncate"
                                                    >
                                                        {article.title || 'Untitled'}
                                                    </Link>
                                                    {article.excerpt && (
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 hidden sm:block">
                                                            {article.excerpt}
                                                        </p>
                                                    )}
                                                    {/* Mobile: Show author and category */}
                                                    <div className="sm:hidden mt-1 flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-slate-500">
                                                            {article.author_name || 'Admin'}
                                                        </span>
                                                        {article.category && (
                                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                                                                {article.category.replace(/-/g, ' ')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-700">
                                                    {article.author_name || 'Admin'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            {article.category && (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                    {article.category.replace(/-/g, ' ')}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <Badge className={getStatusColor(article.status)}>
                                                {getStatusLabel(article.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className="flex items-center gap-2">
                                                {article.quality_score !== undefined ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            article.quality_score >= 80 ? 'bg-green-500' : 
                                                            article.quality_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`} />
                                                        <span className="text-sm font-medium text-slate-900">
                                                            {article.quality_score}
                                                            <span className="text-[10px] text-slate-400 ml-0.5">/100</span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Not Audited</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1 md:gap-2">
                                                {article.status === 'draft' && onPublish && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onPublish(article.id)}
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs md:text-sm"
                                                    >
                                                        <span className="hidden md:inline">Publish</span>
                                                        <span className="md:hidden">Pub</span>
                                                    </Button>
                                                )}
                                                <Link href={`/admin/articles/${article.id}/edit`}>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-slate-600 hover:text-slate-900"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/articles/${article.slug}${article.status !== 'published' ? '?preview=true' : ''}`} target="_blank">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-slate-600 hover:text-slate-900"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                {onDelete && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
                                                                onDelete(article.id);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
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

