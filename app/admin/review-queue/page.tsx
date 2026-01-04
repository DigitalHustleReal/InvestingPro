"use client";

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { 
    CheckCircle2, 
    XCircle, 
    Eye, 
    MessageSquare, 
    Clock, 
    FileText,
    AlertCircle,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

// Simple supabase client for this page
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default function ReviewQueuePage() {
    const [selectedArticle, setSelectedArticle] = useState<any>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

    // Fetch articles in review
    const { data: reviews = [], refetch, isLoading } = useQuery({
        queryKey: ['review-queue'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('id, title, excerpt, category, author_id, updated_at, status')
                .eq('status', 'review')
                .order('updated_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        }
    });

    const handleReviewAction = async () => {
        if (!selectedArticle) return;
        setIsSubmitting(true);

        try {
            // 1. Log the review
            const { error: reviewError } = await supabase
                .from('article_reviews')
                .insert({
                    article_id: selectedArticle.id,
                    status: actionType === 'approve' ? 'approved' : 'changes_requested',
                    notes: reviewNotes,
                    // reviewer_id: user.id (Requires auth context, skipping for simplicity)
                });

            if (reviewError) throw reviewError;

            // 2. Update article status
            const newStatus = actionType === 'approve' ? 'published' : 'draft';
            const { error: updateError } = await supabase
                .from('articles')
                .update({ 
                    status: newStatus,
                    published_at: actionType === 'approve' ? new Date().toISOString() : null
                })
                .eq('id', selectedArticle.id);

            if (updateError) throw updateError;

            toast.success(actionType === 'approve' ? 'Article approved & published!' : 'Changes requested. Sent back to draft.');
            setDialogOpen(false);
            setReviewNotes('');
            refetch();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openReviewDialog = (article: any, type: 'approve' | 'reject') => {
        setSelectedArticle(article);
        setActionType(type);
        setDialogOpen(true);
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                            Editorial Review Queue
                        </h1>
                        <p className="text-slate-500">Approve or request changes for pending articles.</p>
                    </div>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm">
                        {reviews.length} Pending
                    </Badge>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading queue...</div>
                ) : reviews.length === 0 ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center flex flex-col items-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-slate-700">All Caught Up!</h3>
                        <p className="text-slate-500">No articles pending review.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((article: any) => (
                            <div key={article.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-6 group">
                                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 hidden md:block">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-xs font-normal">
                                            {article.category}
                                        </Badge>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(article.updated_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                        {article.excerpt || 'No excerpt provided...'}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs">Author ID: {article.author_id?.slice(0, 6) || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <Link href={`/admin/articles/new?id=${article.id}`} target="_blank">
                                        <Button variant="outline" size="sm" className="w-full justify-start">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Review
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        className="w-full justify-start bg-green-600 hover:bg-green-700"
                                        onClick={() => openReviewDialog(article, 'approve')}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        className="w-full justify-start"
                                        onClick={() => openReviewDialog(article, 'reject')}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Request Changes
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Review Action Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {actionType === 'approve' ? 'Approve Article' : 'Request Changes'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {actionType === 'approve' ? (
                                <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3 text-green-800 text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Ready to publish?</p>
                                        <p>This will change status to 'Published' and make it live immediately.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3 text-amber-800 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Requesting Changes</p>
                                        <p>This will send the article back to 'Draft' status for the author to revise.</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Editorial Notes {actionType === 'reject' && <span className="text-red-500">*</span>}
                                </label>
                                <Textarea 
                                    placeholder={actionType === 'approve' ? "Optional: Good job on..." : "Required: Please fix..."}
                                    value={reviewNotes}
                                    onChange={e => setReviewNotes(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleReviewAction}
                                disabled={isSubmitting || (actionType === 'reject' && !reviewNotes.trim())}
                                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                            >
                                {isSubmitting ? 'Processing...' : (actionType === 'approve' ? 'Confirm Approval' : 'Send Request')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
