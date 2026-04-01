"use client";

import React, { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    Search,
    Edit3,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Target,
    FileText,
    Filter,
    Loader2,
    TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleSEO {
    id: string;
    title: string;
    slug: string;
    status: string;
    category?: string;
    seo_title?: string;
    seo_description?: string;
    // New fields from migration (may not exist yet on all rows)
    target_keyword?: string;
    keyword_priority?: 'p0' | 'p1' | 'p2' | null;
    views?: number;
}

type EditFields = {
    seo_title: string;
    seo_description: string;
    target_keyword: string;
    keyword_priority: '' | 'p0' | 'p1' | 'p2';
};

type PriorityFilter = 'all' | 'p0' | 'p1' | 'p2' | 'missing';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    p0: { label: 'P0', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
    p1: { label: 'P1', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    p2: { label: 'P2', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' },
};

function SEOCompleteness({ article }: { article: ArticleSEO }) {
    const fields = [
        { label: 'SEO title', ok: !!article.seo_title },
        { label: 'Meta description', ok: !!article.seo_description },
        { label: 'Target keyword', ok: !!article.target_keyword },
        { label: 'Priority', ok: !!article.keyword_priority },
    ];
    const done = fields.filter(f => f.ok).length;
    return (
        <div className="flex items-center gap-1">
            {fields.map(f => (
                <div
                    key={f.label}
                    title={f.label + (f.ok ? ' ✓' : ' — missing')}
                    className={cn('w-2 h-2 rounded-full', f.ok ? 'bg-primary-400' : 'bg-slate-200')}
                />
            ))}
            <span className="text-[10px] text-slate-400 ml-1">{done}/4</span>
        </div>
    );
}

// ─── Inline Edit Row ──────────────────────────────────────────────────────────

function ArticleSEORow({
    article,
    editing,
    editValues,
    onEdit,
    onSave,
    onCancel,
    onChange,
    saving,
}: {
    article: ArticleSEO;
    editing: boolean;
    editValues: EditFields;
    onEdit: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    onChange: (field: keyof EditFields, val: string) => void;
    saving: boolean;
}) {
    const priority = article.keyword_priority;
    const pConfig = priority ? PRIORITY_CONFIG[priority] : null;

    return (
        <tr className={cn(
            'border-b border-slate-100 dark:border-slate-800 transition-colors',
            editing ? 'bg-primary-50/40 dark:bg-primary-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
        )}>
            {/* Article Title + Status */}
            <td className="py-3 px-4 min-w-[220px] max-w-[280px]">
                <div className="flex flex-col gap-1">
                    <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-semibold text-sm text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 leading-tight"
                    >
                        {article.title}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[9px] py-0 h-4 capitalize">{article.status}</Badge>
                        {article.category && (
                            <span className="text-[10px] text-slate-400">{article.category}</span>
                        )}
                        <SEOCompleteness article={article} />
                    </div>
                </div>
            </td>

            {/* SEO Title */}
            <td className="py-3 px-4 min-w-[200px]">
                {editing ? (
                    <Input
                        value={editValues.seo_title}
                        onChange={e => onChange('seo_title', e.target.value)}
                        className="h-8 text-xs"
                        placeholder="SEO title (50–60 chars)"
                        maxLength={70}
                    />
                ) : (
                    <div>
                        {article.seo_title ? (
                            <span className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{article.seo_title}</span>
                        ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-600 italic">Not set</span>
                        )}
                        {article.seo_title && (
                            <div className={cn('text-[10px] mt-0.5', article.seo_title.length > 60 ? 'text-red-500' : 'text-slate-400')}>
                                {article.seo_title.length} chars
                            </div>
                        )}
                    </div>
                )}
            </td>

            {/* Meta Description */}
            <td className="py-3 px-4 min-w-[220px] hidden lg:table-cell">
                {editing ? (
                    <Input
                        value={editValues.seo_description}
                        onChange={e => onChange('seo_description', e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Meta description (140–160 chars)"
                        maxLength={180}
                    />
                ) : (
                    <div>
                        {article.seo_description ? (
                            <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{article.seo_description}</span>
                        ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-600 italic">Not set</span>
                        )}
                        {article.seo_description && (
                            <div className={cn('text-[10px] mt-0.5', article.seo_description.length > 160 ? 'text-red-500' : 'text-slate-400')}>
                                {article.seo_description.length} chars
                            </div>
                        )}
                    </div>
                )}
            </td>

            {/* Target Keyword */}
            <td className="py-3 px-4 min-w-[140px] hidden md:table-cell">
                {editing ? (
                    <Input
                        value={editValues.target_keyword}
                        onChange={e => onChange('target_keyword', e.target.value)}
                        className="h-8 text-xs"
                        placeholder="e.g. best credit cards India"
                    />
                ) : (
                    <span className={cn('text-xs', article.target_keyword ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600 italic')}>
                        {article.target_keyword || 'Not set'}
                    </span>
                )}
            </td>

            {/* Keyword Priority */}
            <td className="py-3 px-4 hidden sm:table-cell">
                {editing ? (
                    <select
                        value={editValues.keyword_priority}
                        onChange={e => onChange('keyword_priority', e.target.value)}
                        className="h-8 text-xs border border-slate-200 dark:border-slate-700 rounded-md px-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    >
                        <option value="">— None —</option>
                        <option value="p0">P0 (Critical)</option>
                        <option value="p1">P1 (Important)</option>
                        <option value="p2">P2 (Long-tail)</option>
                    </select>
                ) : (
                    pConfig ? (
                        <Badge className={cn('text-[10px] border font-bold', pConfig.bg, pConfig.color)}>
                            {pConfig.label}
                        </Badge>
                    ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                    )
                )}
            </td>

            {/* Views */}
            <td className="py-3 px-4 hidden xl:table-cell text-right">
                <span className="text-xs font-mono text-slate-500">{(article.views || 0).toLocaleString()}</span>
            </td>

            {/* Actions */}
            <td className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                    {editing ? (
                        <>
                            <Button size="sm" onClick={onSave} disabled={saving} className="h-7 px-3 text-xs bg-primary-600 hover:bg-primary-700 text-white">
                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1" />Save</>}
                            </Button>
                            <Button size="sm" variant="outline" onClick={onCancel} className="h-7 px-2 text-xs">
                                <X className="w-3 h-3" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="outline" onClick={onEdit} className="h-7 px-3 text-xs">
                                <Edit3 className="w-3 h-3 mr-1" />Edit SEO
                            </Button>
                            <Link href={`/${article.slug}`} target="_blank">
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs" title="View on site">
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SEOEditorPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editState, setEditState] = useState<Record<string, EditFields>>({});
    const [savingId, setSavingId] = useState<string | null>(null);

    const { data: articles = [], isLoading } = useQuery<ArticleSEO[]>({
        queryKey: ['articles', 'admin'],
        queryFn: () => api.entities.Article.list(undefined, 500, true),
        staleTime: 30_000,
    });

    // Derived stats
    const missingCount = articles.filter(a => !a.seo_title || !a.seo_description || !a.target_keyword).length;
    const p0Count = articles.filter(a => a.keyword_priority === 'p0').length;

    // Filter
    const filtered = articles.filter(a => {
        const matchSearch = !search ||
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            (a.target_keyword || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.seo_title || '').toLowerCase().includes(search.toLowerCase());

        const matchPriority =
            priorityFilter === 'all' ? true :
            priorityFilter === 'missing' ? (!a.seo_title || !a.seo_description || !a.target_keyword) :
            a.keyword_priority === priorityFilter;

        return matchSearch && matchPriority;
    });

    const handleEdit = (article: ArticleSEO) => {
        setEditingId(article.id);
        setEditState(prev => ({
            ...prev,
            [article.id]: {
                seo_title: article.seo_title || '',
                seo_description: article.seo_description || '',
                target_keyword: article.target_keyword || '',
                keyword_priority: article.keyword_priority || '',
            },
        }));
    };

    const handleChange = (id: string, field: keyof EditFields, val: string) => {
        setEditState(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: val },
        }));
    };

    const handleSave = useCallback(async (article: ArticleSEO) => {
        const vals = editState[article.id];
        setSavingId(article.id);
        try {
            await api.entities.Article.update(article.id, {
                seo_title: vals.seo_title || null,
                seo_description: vals.seo_description || null,
                target_keyword: vals.target_keyword || null,
                keyword_priority: vals.keyword_priority || null,
            } as any);
            await queryClient.refetchQueries({ queryKey: ['articles', 'admin'] });
            setEditingId(null);
            toast.success('SEO fields saved');
        } catch (err: any) {
            toast.error('Save failed: ' + err.message);
        } finally {
            setSavingId(null);
        }
    }, [editState, queryClient]);

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 max-w-[1800px] mx-auto w-full">
                {/* Header */}
                <div className="mb-8 border-b border-border/50 pb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-primary-500" />
                                </div>
                                SEO Inline Editor
                            </h1>
                            <p className="text-muted-foreground text-sm mt-2 ml-13">
                                Edit SEO title, meta description, target keyword, and priority for every article — without opening the full editor.
                            </p>
                        </div>
                        <Link href="/admin/articles/new">
                            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-8">
                                + New Article
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Articles', value: articles.length, icon: FileText, color: 'text-slate-600' },
                        { label: 'Missing SEO Fields', value: missingCount, icon: AlertCircle, color: missingCount > 0 ? 'text-red-500' : 'text-primary-500' },
                        { label: 'P0 Pages', value: p0Count, icon: TrendingUp, color: 'text-red-600' },
                        { label: 'Filtered', value: filtered.length, icon: Filter, color: 'text-slate-500' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3">
                            <Icon className={cn('w-5 h-5 flex-shrink-0', color)} />
                            <div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{value}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by title, keyword..."
                            className="pl-9 h-9 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {(['all', 'p0', 'p1', 'p2', 'missing'] as PriorityFilter[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setPriorityFilter(f)}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                                    priorityFilter === f
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                                )}
                            >
                                {f === 'all' ? 'All' : f === 'missing' ? '⚠ Missing' : f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority legend */}
                <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Priority:</span>
                    <span className="text-red-600 font-bold">P0</span> = 100K+ searches/mo — build now
                    <span className="text-amber-600 font-bold">P1</span> = 10K–100K/mo — build soon
                    <span className="text-slate-500 font-bold">P2</span> = long-tail
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Article</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">SEO Title</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Meta Description</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Target Keyword</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Priority</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Views</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading articles...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                                        No articles match your filter.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(article => (
                                    <ArticleSEORow
                                        key={article.id}
                                        article={article}
                                        editing={editingId === article.id}
                                        editValues={editState[article.id] ?? {
                                            seo_title: article.seo_title || '',
                                            seo_description: article.seo_description || '',
                                            target_keyword: article.target_keyword || '',
                                            keyword_priority: article.keyword_priority || '',
                                        }}
                                        onEdit={() => handleEdit(article)}
                                        onSave={() => handleSave(article)}
                                        onCancel={() => setEditingId(null)}
                                        onChange={(field, val) => handleChange(article.id, field, val)}
                                        saving={savingId === article.id}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    Showing {filtered.length} of {articles.length} articles.
                    New fields (target_keyword, keyword_priority) require the{' '}
                    <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">20260324_article_seo_fields</code> migration to be applied in Supabase.
                </p>
            </div>
        </AdminLayout>
    );
}
