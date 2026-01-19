"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Twitter, 
    Linkedin as LinkedIn, 
    Facebook, 
    Instagram, 
    Send, 
    Copy, 
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { toast } from 'sonner';

interface SocialRepurposeViewProps {
    articleId: string;
}

export default function SocialRepurposeView({ articleId }: SocialRepurposeViewProps) {
    const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'facebook' | 'instagram'>('linkedin');
    const [generating, setGenerating] = useState(false);
    const [postContent, setPostContent] = useState<any>(null);

    const handleRepurpose = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/api/content/repurpose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ article_id: articleId, platform })
            });
            const data = await response.json();
            if (data.success) {
                setPostContent(data.content);
                toast.success(`Content repurposed for ${platform}!`);
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to repurpose content');
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!postContent) return;
        navigator.clipboard.writeText(postContent.content_text);
        toast.success('Copied to clipboard');
    };

    return (
        <Card className="border-indigo-100 bg-white shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-6 md:p-8 text-primary-900">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                            Omnichannel Repurposing
                        </CardTitle>
                        <CardDescription>
                            Convert this article into high-engagement social media posts.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="linkedin" onValueChange={(v) => setPlatform(v as any)}>
                    <TabsList className="grid grid-cols-4 mb-6 bg-slate-100 p-1 rounded-xl">
                        <TabsTrigger value="twitter" className="rounded-lg data-[state=active]:bg-white">
                            <Twitter className="w-4 h-4 mr-2 text-secondary-500" />
                            X
                        </TabsTrigger>
                        <TabsTrigger value="linkedin" className="rounded-lg data-[state=active]:bg-white">
                            <LinkedIn className="w-4 h-4 mr-2 text-secondary-700" />
                            LinkedIn
                        </TabsTrigger>
                        <TabsTrigger value="facebook" className="rounded-lg data-[state=active]:bg-white">
                            <Facebook className="w-4 h-4 mr-2 text-primary-600" />
                            Facebook
                        </TabsTrigger>
                        <TabsTrigger value="instagram" className="rounded-lg data-[state=active]:bg-white">
                            <Instagram className="w-4 h-4 mr-2 text-danger-600" />
                            Instagram
                        </TabsTrigger>
                    </TabsList>

                    <div className="space-y-4">
                        {!postContent ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                <p className="text-muted-foreground/70 dark:text-muted-foreground/70 text-sm mb-4">No content generated for {platform} yet.</p>
                                <Button 
                                    onClick={handleRepurpose}
                                    disabled={generating}
                                    className="bg-primary-600 hover:bg-primary-700 text-foreground dark:text-foreground rounded-xl px-6"
                                >
                                    {generating ? 'Processing with AI...' : `Generate ${platform} Post`}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline" className="bg-white text-primary-600 border-indigo-100">
                                            {platform.toUpperCase()} DRAFT
                                        </Badge>
                                        <span className="text-xs text-muted-foreground dark:text-muted-foreground">Word count: {postContent.content_text.length} chars</span>
                                    </div>
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {postContent.content_text}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {postContent.hashtags?.map((tag: string, idx: number) => (
                                            <span key={idx} className="text-xs font-bold text-primary-600">#{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        onClick={handleRepurpose} 
                                        variant="outline"
                                        disabled={generating}
                                        className="flex-1 rounded-xl"
                                    >
                                        Regenerate
                                    </Button>
                                    <Button 
                                        onClick={handleCopy} 
                                        variant="outline"
                                        className="flex-1 rounded-xl"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button 
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-foreground dark:text-foreground rounded-xl"
                                        onClick={() => toast.success('Sent to Social Scheduler!')}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Push Live
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
