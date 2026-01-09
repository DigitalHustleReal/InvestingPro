"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle2,
    XCircle,
    Eye,
    AlertCircle,
    User,
    Calendar,
    FileText,
    Twitter
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialRepurposeView from './SocialRepurposeView';

interface Article {
    id: string;
    title: string;
    author_name: string;
    author_email: string;
    created_date?: string;
    created_at?: string;
    read_time: number;
    category: string;
    language: string;
    tags?: string[];
    excerpt: string;
    content: string;
}

export default function ArticleModeration({ article }: { article: Article }) {
    const [showPreview, setShowPreview] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showRevisionDialog, setShowRevisionDialog] = useState(false);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [feedback, setFeedback] = useState('');

    const queryClient = useQueryClient();

    const approveMutation = useMutation({
        mutationFn: (id: string) => api.entities.Article.update(id, {
            submission_status: 'approved',
            status: 'published',
            published_date: new Date().toISOString()
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['pending-articles'] });
            toast.success('Article approved and published successfully!');
        }
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => api.entities.Article.update(id, {
            submission_status: 'rejected',
            rejection_reason: reason,
            status: 'archived'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['pending-articles'] });
            setShowRejectDialog(false);
            setFeedback('');
            toast.success('Article rejected.');
        }
    });

    const revisionMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => api.entities.Article.update(id, {
            submission_status: 'revision-requested',
            rejection_reason: reason
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['pending-articles'] });
            setShowRevisionDialog(false);
            setFeedback('');
            toast.success('Revision requested from author.');
        }
    });

    const handleApprove = () => {
        setShowApproveDialog(true);
    };

    const handleReject = () => {
        if (!feedback.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        rejectMutation.mutate({ id: article.id, reason: feedback });
    };

    const handleRevision = () => {
        if (!feedback.trim()) {
            toast.error('Please provide revision feedback');
            return;
        }
        revisionMutation.mutate({ id: article.id, reason: feedback });
    };

    const displayDate = article.created_date || article.created_at || new Date().toISOString();

    return (
        <>
            <Card className="bg-amber-50/50 border-amber-200">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Article Info */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{article.title}</h3>

                            <div className="flex flex-wrap gap-4 mb-3 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-slate-400" />
                                    {article.author_name}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(displayDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    {article.read_time} min read
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge className="bg-slate-700 text-white border-0">
                                    {article.category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                                <Badge variant="outline" className="bg-white">
                                    {article.language?.toUpperCase()}
                                </Badge>
                                {article.tags?.map((tag, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs bg-white">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <p className="text-slate-600 mb-4 line-clamp-2">{article.excerpt}</p>

                            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                                <span>Author email: {article.author_email}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 lg:w-64">
                            <Button
                                onClick={() => {
                                    setShowPreview(true);
                                }}
                                variant="outline"
                                className="w-full bg-white"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Article
                            </Button>

                            <Button
                                onClick={handleApprove}
                                disabled={approveMutation.isPending}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve & Publish
                            </Button>

                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => setShowRevisionDialog(true)}
                                    variant="outline"
                                    className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50 bg-white"
                                >
                                    <AlertCircle className="w-4 h-4 mr-1 sm:mr-2" />
                                    Review
                                </Button>

                                <Button
                                    onClick={() => setShowRejectDialog(true)}
                                    variant="outline"
                                    className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-white"
                                >
                                    <XCircle className="w-4 h-4 mr-1 sm:mr-2" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{article.title}</DialogTitle>
                        <DialogDescription>
                            By {article.author_name} • {article.read_time} min read
                        </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="content" className="mt-4 flex-1 flex flex-col overflow-hidden">
                        <TabsList className="grid w-64 grid-cols-2 bg-slate-100 p-1 rounded-xl mb-4">
                            <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-white">
                                <FileText className="w-4 h-4 mr-2" />
                                Content
                            </TabsTrigger>
                            <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-white">
                                <Twitter className="w-4 h-4 mr-2" />
                                Socials
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="prose prose-slate max-w-none dark:prose-invert overflow-y-auto flex-1 pr-2">
                            {article.content ? (
                                <ReactMarkdown>{article.content}</ReactMarkdown>
                            ) : (
                                <p className="text-slate-500 italic">No content available</p>
                            )}
                        </TabsContent>

                        <TabsContent value="social" className="overflow-y-auto flex-1">
                            <SocialRepurposeView articleId={article.id} />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Article</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejection. This will be sent to the author.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Rejection Reason</Label>
                            <Textarea
                                placeholder="e.g., Content does not meet quality standards, contains factual errors, or is off-topic..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={rejectMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Reject Article
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revision Dialog */}
            <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Revision</DialogTitle>
                        <DialogDescription>
                            Provide specific feedback for improvements. The author will receive this message.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Revision Feedback</Label>
                            <Textarea
                                placeholder="e.g., Please add more recent statistics, expand the section on tax benefits, and fix formatting issues..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRevisionDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRevision}
                            disabled={revisionMutation.isPending}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            Request Revision
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Approve Confirmation Dialog */}
            <ConfirmDialog
                open={showApproveDialog}
                onOpenChange={setShowApproveDialog}
                onConfirm={() => approveMutation.mutate(article.id)}
                title="Approve and Publish Article"
                description="Are you sure you want to approve and publish this article? It will be visible to all users."
                confirmText="Approve & Publish"
                cancelText="Cancel"
            />
        </>
    );
}
