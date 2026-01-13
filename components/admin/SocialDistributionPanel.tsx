"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Twitter, Linkedin, Instagram, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
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
        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/5 px-6 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Social Distribution Assets
                </CardTitle>
                {hasPosts && posts?.generated_at && (
                    <Badge className="bg-slate-800 text-slate-400 text-[10px] font-mono">
                        Generated: {new Date(posts.generated_at).toLocaleDateString()}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {!hasPosts ? (
                    <div className="text-center py-8">
                        <p className="text-slate-500 text-sm mb-4">No social posts generated yet.</p>
                        {onRegenerate && (
                            <Button 
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                                className="bg-pink-600 hover:bg-pink-700 text-white"
                            >
                                {isRegenerating ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" />
                                )}
                                Generate Social Posts
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Twitter Thread */}
                        {posts?.twitter && posts.twitter.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Twitter className="w-4 h-4 text-secondary-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Twitter Thread ({posts.twitter.length} tweets)
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-slate-400 hover:text-white h-8"
                                        onClick={() => copyToClipboard(posts.twitter!.join('\n\n---\n\n'), 'twitter-all')}
                                    >
                                        {copiedId === 'twitter-all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {posts.twitter.map((tweet, idx) => (
                                        <div 
                                            key={idx}
                                            className="p-4 bg-black/30 rounded-xl border border-white/5 group relative"
                                        >
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <Badge className="bg-secondary-500/20 text-secondary-400 text-[10px]">{idx + 1}/{posts.twitter!.length}</Badge>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                                    onClick={() => copyToClipboard(tweet, `tweet-${idx}`)}
                                                >
                                                    {copiedId === `tweet-${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </Button>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed pr-12">{tweet}</p>
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
                                        <Linkedin className="w-4 h-4 text-secondary-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            LinkedIn Post
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-slate-400 hover:text-white h-8"
                                        onClick={() => copyToClipboard(posts.linkedin!, 'linkedin')}
                                    >
                                        {copiedId === 'linkedin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{posts.linkedin}</p>
                                </div>
                            </div>
                        )}

                        {/* Instagram Caption */}
                        {posts?.instagram && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-pink-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Instagram Caption
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-slate-400 hover:text-white h-8"
                                        onClick={() => copyToClipboard(posts.instagram!, 'instagram')}
                                    >
                                        {copiedId === 'instagram' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{posts.instagram}</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {onRegenerate && (
                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-slate-400 hover:text-white"
                                    onClick={handleRegenerate}
                                    disabled={isRegenerating}
                                >
                                    {isRegenerating ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                    )}
                                    Regenerate Posts
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
