'use client';

import React, { useState } from 'react';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import {
    Mail,
    Send,
    Eye,
    Save,
    Plus,
    Trash2,
    GripVertical,
    Calendar,
    Users,
    TrendingUp,
    IndianRupee,
    Shield,
    Bell,
    BookOpen,
    Zap,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock,
    AlertCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type SectionType =
    | 'market_moves'
    | 'best_offers'
    | 'quick_win'
    | 'scam_alert'
    | 'deep_dive'
    | 'rate_watch';

interface NewsletterSection {
    id: string;
    type: SectionType;
    title: string;
    content: string;
    enabled: boolean;
}

const SECTION_META: Record<
    SectionType,
    { label: string; icon: React.ElementType; placeholder: string; color: string }
> = {
    market_moves: {
        label: 'Market Moves',
        icon: TrendingUp,
        placeholder: 'What happened this week in Indian markets? RBI decisions, SEBI rules, macro moves...',
        color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    best_offers: {
        label: 'Best Offers This Week',
        icon: IndianRupee,
        placeholder: 'Top credit card bonuses, FD rate hikes, limited-time loan offers...',
        color: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    quick_win: {
        label: 'Quick Win',
        icon: Zap,
        placeholder: 'One action readers can take this week to earn more, pay less, or build wealth faster...',
        color: 'bg-green-50 border-green-200 text-green-700',
    },
    scam_alert: {
        label: 'Scam Alert',
        icon: Shield,
        placeholder: 'Latest fraud tactics targeting Indian investors — with how to protect yourself...',
        color: 'bg-red-50 border-red-200 text-red-700',
    },
    deep_dive: {
        label: 'Deep Dive',
        icon: BookOpen,
        placeholder: 'One product/concept explained clearly this week...',
        color: 'bg-purple-50 border-purple-200 text-purple-700',
    },
    rate_watch: {
        label: 'Rate Watch',
        icon: Bell,
        placeholder: 'FD, home loan, and credit card rate changes from top banks this week...',
        color: 'bg-slate-50 border-slate-200 text-slate-700',
    },
};

const DEFAULT_SECTIONS: NewsletterSection[] = [
    { id: '1', type: 'market_moves', title: 'Market Moves', content: '', enabled: true },
    { id: '2', type: 'best_offers', title: 'Best Offers This Week', content: '', enabled: true },
    { id: '3', type: 'quick_win', title: 'One Quick Win', content: '', enabled: true },
    { id: '4', type: 'scam_alert', title: 'Scam Alert', content: '', enabled: true },
    { id: '5', type: 'deep_dive', title: 'Deep Dive', content: '', enabled: true },
    { id: '6', type: 'rate_watch', title: 'Rate Watch', content: '', enabled: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

function SectionEditor({
    section,
    onChange,
    onToggle,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}: {
    section: NewsletterSection;
    onChange: (s: NewsletterSection) => void;
    onToggle: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    const meta = SECTION_META[section.type];
    const Icon = meta.icon;
    const wordCount = section.content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div
            className={`rounded-xl border transition-opacity ${
                section.enabled ? 'opacity-100' : 'opacity-50'
            } bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 cursor-grab" />
                <div className={`p-1.5 rounded-lg border text-xs font-medium ${meta.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <input
                    type="text"
                    value={section.title}
                    onChange={e => onChange({ ...section, title: e.target.value })}
                    className="flex-1 font-semibold text-sm text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none focus:outline-none"
                />
                <div className="flex items-center gap-1 ml-auto">
                    <button
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onMoveDown}
                        disabled={isLast}
                        className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onToggle}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                            section.enabled
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                    >
                        {section.enabled ? 'Included' : 'Excluded'}
                    </button>
                </div>
            </div>

            {/* Body */}
            {section.enabled && (
                <div className="p-4">
                    <textarea
                        value={section.content}
                        onChange={e => onChange({ ...section, content: e.target.value })}
                        placeholder={meta.placeholder}
                        rows={4}
                        className="w-full text-sm text-slate-900 dark:text-slate-100 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                    />
                    <div className="mt-1.5 text-xs text-slate-400 text-right">
                        {wordCount} words
                        {wordCount < 30 && wordCount > 0 && (
                            <span className="ml-2 text-amber-500">— too short</span>
                        )}
                        {wordCount > 200 && (
                            <span className="ml-2 text-amber-500">— keep under 200 words</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Preview modal ─────────────────────────────────────────────────────────────

function NewsletterPreview({
    subject,
    previewText,
    sections,
    onClose,
}: {
    subject: string;
    previewText: string;
    sections: NewsletterSection[];
    onClose: () => void;
}) {
    const enabled = sections.filter(s => s.enabled && s.content.trim());
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Email client bar */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-t-2xl px-5 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 text-center text-xs font-mono text-slate-500 truncate">
                        {subject || '(No subject)'}
                    </div>
                </div>

                {/* Email body */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-3">
                            <Mail className="h-3 w-3" />
                            InvestingPro Weekly
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {subject || 'Your weekly finance brief'}
                        </h1>
                        {previewText && (
                            <p className="text-sm text-slate-500 mt-1">{previewText}</p>
                        )}
                    </div>

                    {enabled.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-8">
                            No sections with content yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {enabled.map(s => {
                                const Icon = SECTION_META[s.type].icon;
                                return (
                                    <div key={s.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
                                            <span className="font-semibold text-xs text-green-700 dark:text-green-400 uppercase tracking-wide">
                                                {s.title}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {s.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-xs text-slate-400">
                            InvestingPro.in · Unsubscribe · Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function NewsletterBuilderPage() {
    const [subject, setSubject] = useState('');
    const [previewText, setPreviewText] = useState('');
    const [sections, setSections] = useState<NewsletterSection[]>(DEFAULT_SECTIONS);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('09:00');
    const [showPreview, setShowPreview] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const enabledCount = sections.filter(s => s.enabled && s.content.trim()).length;
    const wordTotal = sections
        .filter(s => s.enabled)
        .reduce((acc, s) => acc + s.content.trim().split(/\s+/).filter(Boolean).length, 0);

    const handleSectionChange = (updated: NewsletterSection) => {
        setSections(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    };

    const handleToggle = (id: string) => {
        setSections(prev => prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    };

    const handleMoveUp = (idx: number) => {
        if (idx === 0) return;
        setSections(prev => {
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
    };

    const handleMoveDown = (idx: number) => {
        setSections(prev => {
            if (idx >= prev.length - 1) return prev;
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });
    };

    const handleSaveDraft = async () => {
        setSaveStatus('saving');
        // TODO: POST to /api/newsletter/drafts
        await new Promise(r => setTimeout(r, 800));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
    };

    const handleSendTest = async () => {
        setSendStatus('sending');
        // TODO: POST to /api/newsletter/send-test
        await new Promise(r => setTimeout(r, 1200));
        setSendStatus('sent');
        setTimeout(() => setSendStatus('idle'), 4000);
    };

    const isReadyToSend =
        subject.trim() &&
        enabledCount >= 2 &&
        wordTotal >= 50;

    return (
        <>
            {showPreview && (
                <NewsletterPreview
                    subject={subject}
                    previewText={previewText}
                    sections={sections}
                    onClose={() => setShowPreview(false)}
                />
            )}

            <AdminPageContainer>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
                            <Mail className="h-6 w-6 text-green-700 dark:text-green-400" />
                            Newsletter Builder
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Compose and schedule the weekly InvestingPro Weekly email
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
                        >
                            {saveStatus === 'saved' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save Draft'}
                        </button>
                    </div>
                </div>

                {/* Validation banner */}
                {!isReadyToSend && (
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-300">
                            <strong>Not ready to send.</strong> Requirements:{' '}
                            {!subject.trim() && 'Add a subject line. '}
                            {enabledCount < 2 && 'Enable at least 2 sections with content. '}
                            {wordTotal < 50 && 'Add more content (50+ words total).'}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: composer */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Subject + preview text */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                                    Subject Line *
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="e.g. This week: RBI cuts rates + 5 cards worth getting"
                                    maxLength={100}
                                    className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-slate-400 transition"
                                />
                                <div className="mt-1 text-xs text-slate-400 text-right">
                                    {subject.length}/100
                                    {subject.length > 60 && (
                                        <span className="ml-2 text-amber-500">— may be clipped in Gmail</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                                    Preview Text
                                    <span className="ml-1 text-slate-400 font-normal normal-case">(shown below subject in inbox)</span>
                                </label>
                                <input
                                    type="text"
                                    value={previewText}
                                    onChange={e => setPreviewText(e.target.value)}
                                    placeholder="e.g. Plus: best ELSS funds for last-minute 80C filing"
                                    maxLength={130}
                                    className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-slate-400 transition"
                                />
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="space-y-3">
                            {sections.map((section, idx) => (
                                <SectionEditor
                                    key={section.id}
                                    section={section}
                                    onChange={handleSectionChange}
                                    onToggle={() => handleToggle(section.id)}
                                    onMoveUp={() => handleMoveUp(idx)}
                                    onMoveDown={() => handleMoveDown(idx)}
                                    isFirst={idx === 0}
                                    isLast={idx === sections.length - 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: sidebar */}
                    <div className="space-y-5">
                        {/* Stats */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4">
                                Issue Stats
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Sections included', value: `${enabledCount}/6` },
                                    { label: 'Total word count', value: wordTotal.toString() },
                                    {
                                        label: 'Est. read time',
                                        value: `${Math.max(1, Math.round(wordTotal / 200))} min`,
                                    },
                                ].map(stat => (
                                    <div key={stat.label} className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">{stat.label}</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subscriber stats */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-700 dark:text-green-400" />
                                Subscriber List
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Active subscribers</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">12,341</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Avg open rate</span>
                                    <span className="font-semibold text-green-700 dark:text-green-400">47.2%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Avg click rate</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">18.4%</span>
                                </div>
                            </div>
                        </div>

                        {/* Send test */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-3">
                                Test Send
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                Send a preview to yourself before scheduling.
                            </p>
                            <button
                                onClick={handleSendTest}
                                disabled={sendStatus === 'sending' || !subject.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                {sendStatus === 'sent' ? (
                                    <><CheckCircle2 className="h-4 w-4 text-green-600" />Test sent!</>
                                ) : sendStatus === 'sending' ? (
                                    <><Clock className="h-4 w-4 animate-spin" />Sending…</>
                                ) : (
                                    <><Send className="h-4 w-4" />Send Test Email</>
                                )}
                            </button>
                        </div>

                        {/* Schedule */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-700 dark:text-green-400" />
                                Schedule Send
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={e => setScheduleDate(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                                        Time (IST)
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={e => setScheduleTime(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    />
                                </div>
                                <button
                                    disabled={!isReadyToSend || !scheduleDate}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-green-700 hover:bg-green-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:dark:bg-slate-800 text-white rounded-lg transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                    Schedule Issue
                                </button>
                                {isReadyToSend && scheduleDate && (
                                    <p className="text-xs text-green-700 dark:text-green-400 text-center">
                                        Will send to 12,341 subscribers on {scheduleDate} at {scheduleTime} IST
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminPageContainer>
        </>
    );
}
