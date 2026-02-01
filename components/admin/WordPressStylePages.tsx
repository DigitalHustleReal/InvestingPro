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

    const getPageTypeIcon = (contentType?: string) => {
        switch (contentType) {
            case 'pillar':
                return <Home className="w-4 h-4 text-secondary-500" />;
            case 'category-page':
                return <File className="w-4 h-4 text-secondary-500" />;
            default:
                return <FileText className="w-4 h-4 text-wt-text-muted dark:text-wt-text-muted" />;
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
            <div className="flex items-center justify-between border-b border-wt-border pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-wt-text">Pages</h1>
                    <p className="text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1">
                        Manage your site pages
                    </p>
                </div>
                <Button
                    onClick={onNewPage}
                    className="bg-wt-gold hover:bg-wt-gold-hover text-wt-text dark:text-wt-text"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Page
                </Button>
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
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-6 md:p-8 rounded-lg border border-wt-border">
                <div className="flex-1 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wt-text-muted dark:text-wt-text-muted" />
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-wt-border rounded-lg focus:ring-2 focus:ring-wt-gold focus:border-wt-gold"
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
                                    ? 'bg-wt-gold text-wt-text dark:text-wt-text'
                                    : 'bg-wt-card text-wt-text hover:bg-slate-200'
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wt-gold"></div>
                </div>
            ) : filteredPages.length === 0 ? (
                <Card className="border-wt-border">
                    <CardContent className="p-6 md:p-8 text-center">
                        <FileText className="w-12 h-12 text-wt-text-muted dark:text-wt-text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-wt-text mb-2">No pages found</h3>
                        <p className="text-wt-text-muted/70 dark:text-wt-text-muted/70 mb-4">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first page'}
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <Button onClick={onNewPage} className="bg-wt-gold hover:bg-wt-gold-hover">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Page
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
                                        Type
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider hidden lg:table-cell">
                                        Date
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-wt-border">
                                {filteredPages.map((page) => (
                                    <tr
                                        key={page.id}
                                        className="hover:bg-wt-surface-hover transition-colors"
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
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-wt-card flex items-center justify-center flex-shrink-0">
                                                        {getPageTypeIcon(page.content_type)}
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/admin/pillar-pages/${page.id}/edit`}
                                                        className="text-sm font-medium text-wt-text hover:text-wt-gold block truncate"
                                                    >
                                                        {page.title || 'Untitled'}
                                                    </Link>
                                                    {page.excerpt && (
                                                        <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-1 line-clamp-1 hidden sm:block">
                                                            {page.excerpt}
                                                        </p>
                                                    )}
                                                    {/* Mobile: Show author and type */}
                                                    <div className="sm:hidden mt-1 flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                                            {page.author_name || 'Admin'}
                                                        </span>
                                                        {page.content_type && (
                                                            <Badge variant="secondary" className="bg-wt-card text-wt-text text-xs">
                                                                {page.content_type}
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
                                                    {page.author_name || 'Admin'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            {page.content_type && (
                                                <div className="flex items-center gap-2">
                                                    {getPageTypeIcon(page.content_type)}
                                                    <Badge variant="secondary" className="bg-wt-card text-wt-text">
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
                                            <div className="text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70">
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
                                                        className="text-wt-green hover:text-wt-green hover:bg-wt-green-subtle text-xs md:text-sm"
                                                    >
                                                        <span className="hidden md:inline">Publish</span>
                                                        <span className="md:hidden">Pub</span>
                                                    </Button>
                                                )}
                                                <Link href={`/admin/pillar-pages/${page.id}/edit`}>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-wt-text-muted/50 dark:text-wt-text-muted/50 hover:text-wt-text"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/${page.slug}${page.status !== 'published' ? '?preview=true' : ''}`} target="_blank">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-wt-text-muted/50 dark:text-wt-text-muted/50 hover:text-wt-text"
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

