"use client";

import React, { useState } from 'react';
import { ActionButton, StatusBadge } from './AdminUIKit';
import { 
    Copy, 
    Check, 
    Twitter, 
    Linkedin, 
    Instagram, 
    Sparkles, 
    RefreshCw, 
    Loader2,
    Share2,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SocialDistributionPanelProps {
    articleId: string;
    articleTitle: string;
    articleContent: string;
    existingPosts?: {
        twitter?: string[];
        linkedin?: string;
        instagram?: string;
        generated_at?: string;
    };
    onRegenerate?: () => Promise<void>;
}

export default function SocialDistributionPanel({
    articleId,
    articleTitle,
    articleContent,
    existingPosts,
    onRegenerate
}: SocialDistributionPanelProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [posts, setPosts] = useState(existingPosts);

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const handleRegenerate = async () => {
        if (!onRegenerate) return;
        setIsRegenerating(true);
        try {
            await onRegenerate();
            toast.success('Social posts regenerated!');
        } catch (err) {
            toast.error('Failed to regenerate');
        } finally {
            setIsRegenerating(false);
        }
    };

    const hasPosts = posts && (posts.twitter?.length || posts.linkedin || posts.instagram);

    return (
        <div className="bg-white border border-wt-border-subtle rounded-2xl overflow-hidden shadow-card">
            <div className="px-8 py-6 border-b border-wt-border-subtle flex items-center justify-between bg-wt-bg-hover/10">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-wt-gold/10 rounded-xl">
                        <Share2 className="w-5 h-5 text-wt-gold" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-wt-navy-900">
                            Social Distribution Assets
                        </h3>
                        <p className="text-[10px] font-bold text-wt-navy-400 uppercase tracking-tighter mt-0.5">
                            Cross-platform engagement kit
                        </p>
                    </div>
                </div>
                {hasPosts && posts?.generated_at && (
                    <StatusBadge 
                        status="completed" 
                        label={`Generated: ${new Date(posts.generated_at).toLocaleDateString()}`}
                        size="sm"
                    />
                )}
            </div>
            <div className="p-8 space-y-8">
                {!hasPosts ? (
                    <div className="text-center py-12 bg-wt-bg-hover/20 rounded-2xl border border-dashed border-wt-border-subtle">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Sparkles className="w-8 h-8 text-wt-gold/30" />
                        </div>
                        <h4 className="text-lg font-bold text-wt-navy-900 mb-2">No campaign assets yet</h4>
                        <p className="text-wt-navy-500 text-sm mb-8 max-w-xs mx-auto">Generate platform-optimized social snippets for this article.</p>
                        {onRegenerate && (
                            <ActionButton 
                                onClick={handleRegenerate}
                                isLoading={isRegenerating}
                                variant="primary"
                                icon={Sparkles}
                            >
                                Generate Engagement Kit
                            </ActionButton>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Twitter Thread */}
                        {posts?.twitter && posts.twitter.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                            <Twitter className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-wt-navy-900 block">
                                                Twitter Thread
                                            </span>
                                            <span className="text-[9px] font-bold text-wt-navy-400 uppercase">{posts.twitter.length} Sequence items</span>
                                        </div>
                                    </div>
                                    <ActionButton
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(posts.twitter!.join('\n\n---\n\n'), 'twitter-all')}
                                        icon={copiedId === 'twitter-all' ? Check : Copy}
                                        className="h-8 px-3 text-[10px]"
                                    >
                                        Copy Thread
                                    </ActionButton>
                                </div>
                                <div className="space-y-2">
                                    {posts.twitter.map((tweet, idx) => (
                                        <div 
                                            key={idx}
                                            className="p-4 bg-black/30 rounded-xl border border-wt-border/50 dark:border-wt-border/50 group relative"
                                        >
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <StatusBadge status="completed" label={`${idx + 1}/${posts.twitter!.length}`} size="sm" />
                                                <ActionButton
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => copyToClipboard(tweet, `tweet-${idx}`)}
                                                    icon={copiedId === `tweet-${idx}` ? Check : Copy}
                                                />
                                            </div>
                                            <p className="text-wt-navy-900/80 text-sm leading-relaxed pr-12">{tweet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* LinkedIn Post */}
                        {posts?.linkedin && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Linkedin className="w-4 h-4 text-wt-gold" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-wt-navy-900">
                                            LinkedIn Post
                                        </span>
                                    </div>
                                    <ActionButton
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-3 text-[10px]"
                                        onClick={() => copyToClipboard(posts.linkedin!, 'linkedin')}
                                        icon={copiedId === 'linkedin' ? Check : Copy}
                                    >
                                        Copy Post
                                    </ActionButton>
                                </div>
                                <div className="p-4 bg-wt-bg-hover/20 rounded-xl border border-wt-border-subtle">
                                    <p className="text-wt-navy-900/80 text-sm leading-relaxed whitespace-pre-wrap">{posts.linkedin}</p>
                                </div>
                            </div>
                        )}

                        {/* Instagram Caption */}
                        {posts?.instagram && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-wt-danger" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-wt-navy-900">
                                            Instagram Caption
                                        </span>
                                    </div>
                                    <ActionButton
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-3 text-[10px]"
                                        onClick={() => copyToClipboard(posts.instagram!, 'instagram')}
                                        icon={copiedId === 'instagram' ? Check : Copy}
                                    >
                                        Copy Caption
                                    </ActionButton>
                                </div>
                                <div className="p-4 bg-wt-bg-hover/20 rounded-xl border border-wt-border-subtle">
                                    <p className="text-wt-navy-900/80 text-sm leading-relaxed whitespace-pre-wrap">{posts.instagram}</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {onRegenerate && (
                            <div className="pt-8 border-t border-wt-border-subtle flex justify-end">
                                <ActionButton
                                    variant="secondary"
                                    onClick={handleRegenerate}
                                    isLoading={isRegenerating}
                                    icon={RefreshCw}
                                >
                                    Regenerate All Assets
                                </ActionButton>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
