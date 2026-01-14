/**
 * WordPress-Style Pages UI Component
 * 
 * Provides a polished, professional Pages management experience matching WordPress
 */

"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, 
    Plus, 
    Search, 
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    TrendingUp,
    Home,
    File
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Page {
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
    featured_image?: string;
    content_type?: 'pillar' | 'category-page' | 'article' | 'page';
    parent_id?: string;
    template?: string;
}

interface WordPressStylePagesProps {
    pages: Page[] | null | undefined;
    isLoading?: boolean;
    onNewPage?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onView?: (id: string) => void;
    onPublish?: (id: string) => void;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    filterStatus?: string;
    onFilterChange?: (status: string) => void;
}

export default function WordPressStylePages({
    pages,
    isLoading = false,
    onNewPage,
    onEdit,
    onDelete,
    onView,
    onPublish,
    searchTerm = '',
    onSearchChange,
    filterStatus = 'all',
    onFilterChange,
}: WordPressStylePagesProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-success-100 text-success-800 border-success-200';
            case 'draft':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'review':
                return 'bg-accent-100 text-accent-800 border-accent-200';
            case 'archived':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getStatusLabel = (status: string) => {
        return (status ?? 'draft').charAt(0).toUpperCase() + (status ?? 'draft').slice(1);
    };

    const getPageTypeIcon = (contentType?: string) => {
        switch (contentType) {
            case 'pillar':
                return <Home className="w-4 h-4 text-secondary-500" />;
            case 'category-page':
                return <File className="w-4 h-4 text-secondary-500" />;
            default:
                return <FileText className="w-4 h-4 text-slate-400" />;
        }
    };

    // Ensure pages is always an array
    const pagesArray = Array.isArray(pages) ? pages : [];
    
    const filteredPages = pagesArray.filter(page => {
        if (filterStatus !== 'all' && page.status !== filterStatus) {
            return false;
        }
        if (searchTerm && page.title && !page.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    });

    // Ensure pages is always an array for counts
    const pagesArrayForCounts = Array.isArray(pages) ? pages : [];
    
    const statusCounts = {
        all: pagesArrayForCounts.length,
        published: pagesArrayForCounts.filter(p => p.status === 'published').length,
        draft: pagesArrayForCounts.filter(p => p.status === 'draft').length,
        review: pagesArrayForCounts.filter(p => p.status === 'review').length,
        archived: pagesArrayForCounts.filter(p => p.status === 'archived').length,
    };

    return (
        <div className="space-y-6">
            {/* Header Bar - WordPress Style */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Pages</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage your site pages
                    </p>
                </div>
                <Button
                    onClick={onNewPage}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Page
                </Button>
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
                                <p className="text-xl md:text-2xl font-bold text-success-600">{statusCounts.published}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-success-400 flex-shrink-0 ml-2" />
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
                                <p className="text-xl md:text-2xl font-bold text-accent-600">{statusCounts.review}</p>
                            </div>
                            <Eye className="w-6 h-6 md:w-8 md:h-8 text-accent-400 flex-shrink-0 ml-2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 md:p-6 md:p-8">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-slate-500 truncate">Archived</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-600">{statusCounts.archived}</p>
                            </div>
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-slate-400 flex-shrink-0 ml-2" />
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
                            placeholder="Search pages..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'published', 'draft', 'review', 'archived'].map((status) => (
                        <button
                            key={status}
                            onClick={() => onFilterChange?.(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterStatus === status
                                    ? 'bg-primary-600 text-white'
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

            {/* Pages List - WordPress Table Style */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : filteredPages.length === 0 ? (
                <Card className="border-slate-200">
                    <CardContent className="p-6 md:p-8 text-center">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No pages found</h3>
                        <p className="text-slate-500 mb-4">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first page'}
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <Button onClick={onNewPage} className="bg-primary-600 hover:bg-primary-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Page
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
                                        Type
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                                        Date
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredPages.map((page) => (
                                    <tr
                                        key={page.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                {page.featured_image ? (
                                                    <img
                                                        src={page.featured_image}
                                                        alt={page.title}
                                                        className="w-10 h-10 md:w-12 md:h-12 rounded object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                        {getPageTypeIcon(page.content_type)}
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/admin/pillar-pages/${page.id}/edit`}
                                                        className="text-sm font-medium text-slate-900 hover:text-primary-600 block truncate"
                                                    >
                                                        {page.title || 'Untitled'}
                                                    </Link>
                                                    {page.excerpt && (
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 hidden sm:block">
                                                            {page.excerpt}
                                                        </p>
                                                    )}
                                                    {/* Mobile: Show author and type */}
                                                    <div className="sm:hidden mt-1 flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-slate-500">
                                                            {page.author_name || 'Admin'}
                                                        </span>
                                                        {page.content_type && (
                                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                                                                {page.content_type}
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
                                                    {page.author_name || 'Admin'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            {page.content_type && (
                                                <div className="flex items-center gap-2">
                                                    {getPageTypeIcon(page.content_type)}
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                        {page.content_type.replace(/-/g, ' ')}
                                                    </Badge>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <Badge className={getStatusColor(page.status)}>
                                                {getStatusLabel(page.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className="text-sm text-slate-500">
                                                {page.updated_at && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span className="hidden xl:inline">
                                                            {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
                                                        </span>
                                                        <span className="xl:hidden">
                                                            {new Date(page.updated_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1 md:gap-2">
                                                {page.status === 'draft' && onPublish && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onPublish(page.id)}
                                                        className="text-success-600 hover:text-success-700 hover:bg-success-50 text-xs md:text-sm"
                                                    >
                                                        <span className="hidden md:inline">Publish</span>
                                                        <span className="md:hidden">Pub</span>
                                                    </Button>
                                                )}
                                                <Link href={`/admin/pillar-pages/${page.id}/edit`}>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-slate-600 hover:text-slate-900"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/${page.slug}${page.status !== 'published' ? '?preview=true' : ''}`} target="_blank">
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
                                                            if (confirm(`Are you sure you want to delete "${page.title}"? This action cannot be undone.`)) {
                                                                onDelete(page.id);
                                                            }
                                                        }}
                                                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
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

