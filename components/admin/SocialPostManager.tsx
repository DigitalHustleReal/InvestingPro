"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Twitter,
    Linkedin,
    Facebook,
    Share2,
    Copy,
    Loader2,
    RefreshCw,
    Save
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SocialPostManagerProps {
    articleId: string;
}

interface SocialPost {
    id: string;
    platform: 'twitter' | 'linkedin' | 'facebook';
    content: string;
    status: 'draft' | 'scheduled' | 'posted';
}

export function SocialPostManager({ articleId }: SocialPostManagerProps) {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (articleId) fetchPosts();
    }, [articleId]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Fetch existing posts (mocked logic as we don't have direct supabase client here)
            // In real app use supabase client or API endpoint
            // For now assume empty to trigger generator button show
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const generatePosts = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/social/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleId })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            setPosts(json.posts);
            toast.success('Social posts generated!');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Social Distribution
                </h3>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={generatePosts}
                    disabled={generating || !articleId}
                    className="h-8 border-wt-border hover:bg-gray-100 text-gray-700 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    {generating ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                    ) : (
                        <Share2 className="w-3 h-3 mr-2" />
                    )}
                    Generate Posts
                </Button>
            </div>

            {!articleId && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed rounded-lg bg-wt-surface-hover dark:bg-surface-darker">
                    Save article first
                </div>
            )}

            {articleId && posts.length === 0 && !generating && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed rounded-lg bg-wt-surface-hover dark:bg-surface-darker">
                    <p>No social posts yet.</p>
                    <Button variant="link" onClick={generatePosts} className="mt-2 text-wt-gold hover:text-wt-gold-hover">
                        Generate with AI
                    </Button>
                </div>
            )}

            <div className="space-y-4">
                {posts.map((post) => (
                    <div 
                        key={post.id} 
                        className="border rounded-lg p-4 space-y-3 bg-white dark:bg-surface-dark hover:border-secondary-200 transition-colors group relative"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {post.platform === 'twitter' && <Twitter className="w-4 h-4 text-secondary-500" />}
                                {post.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-secondary-700" />}
                                {post.platform === 'facebook' && <Facebook className="w-4 h-4 text-secondary-600" />}
                                <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">{post.platform}</span>
                            </div>
                            <Badge variant="outline" className="text-xs uppercase scale-90 text-gray-700 dark:text-gray-300">
                                {post.status}
                            </Badge>
                        </div>

                        <Textarea
                            defaultValue={post.content}
                            className="text-sm min-h-[100px] border border-wt-border bg-white dark:bg-surface-darker focus:bg-white resize-none text-gray-900 dark:text-white"
                        />
                        
                        <div className="flex justify-end gap-2 pt-2 border-t border-wt-border opacity-50 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                onClick={() => copyToClipboard(post.content)}
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-secondary-600 hover:text-secondary-700"
                            >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
