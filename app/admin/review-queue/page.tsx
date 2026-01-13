"use client";

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { 
    CheckCircle2, 
    XCircle, 
    Eye, 
    Clock, 
    FileText,
    AlertCircle,
    User,
    Inbox
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { AdminPageHeader, ContentSection, StatCard, StatusBadge, ActionButton } from '@/components/admin/AdminUIKit';

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
            const { error: reviewError } = await supabase
                .from('article_reviews')
                .insert({
                    article_id: selectedArticle.id,
                    status: actionType === 'approve' ? 'approved' : 'changes_requested',
                    notes: reviewNotes,
                });

            if (reviewError) throw reviewError;

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
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Review Queue"
                    subtitle="Approve or request changes for pending articles"
                    icon={Inbox}
                    iconColor="purple"
                    actions={
                        <div className="px-4 py-2 bg-secondary-500/20 rounded-xl border border-secondary-500/30">
                            <span className="text-secondary-400 text-sm font-medium">{reviews.length} Pending</span>
                        </div>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Pending" value={reviews.length} icon={Clock} color="amber" />
                    <StatCard label="Approved Today" value="--" icon={CheckCircle2} color="teal" />
                    <StatCard label="Rejected Today" value="--" icon={XCircle} color="rose" />
                    <StatCard label="Avg Review Time" value="--" icon={Clock} color="blue" />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-secondary-500/30 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                ) : reviews.length === 0 ? (
                    <ContentSection>
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                            <p className="text-slate-400">No articles pending review.</p>
                        </div>
                    </ContentSection>
                ) : (
                    <div className="grid gap-4">
                        {reviews.map((article: any) => (
                            <ContentSection key={article.id}>
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-500/20 to-pink-500/20 border border-secondary-500/30 flex items-center justify-center shrink-0">
                                        <FileText className="w-7 h-7 text-secondary-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            {article.category && (
                                                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
                                                    {article.category.replace(/-/g, ' ')}
                                                </span>
                                            )}
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(article.updated_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 hover:text-secondary-400 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                            {article.excerpt || 'No excerpt provided...'}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                                                <User className="w-3 h-3 text-slate-300" />
                                            </div>
                                            <span className="text-xs">Author: {article.author_id?.slice(0, 8) || 'Unknown'}...</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                        <Link href={`/admin/articles/${article.id}/edit`} className="flex-1 md:flex-none">
                                            <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                                <Eye className="w-4 h-4" /> Review
                                            </button>
                                        </Link>
                                        <button 
                                            className="flex-1 md:flex-none px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            onClick={() => openReviewDialog(article, 'approve')}
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                        </button>
                                        <button 
                                            className="flex-1 md:flex-none px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            onClick={() => openReviewDialog(article, 'reject')}
                                        >
                                            <XCircle className="w-4 h-4" /> Changes
                                        </button>
                                    </div>
                                </div>
                            </ContentSection>
                        ))}
                    </div>
                )}

                {/* Review Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                {actionType === 'approve' ? 'Approve Article' : 'Request Changes'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {actionType === 'approve' ? (
                                <div className="bg-primary-500/10 border border-primary-500/30 p-4 rounded-lg flex items-start gap-3 text-primary-400 text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Ready to publish?</p>
                                        <p className="text-primary-400/80">This will change status to 'Published' and make it live immediately.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-accent-500/10 border border-accent-500/30 p-4 rounded-lg flex items-start gap-3 text-accent-400 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Requesting Changes</p>
                                        <p className="text-accent-400/80">This will send the article back to 'Draft' status for revision.</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">
                                    Editorial Notes {actionType === 'reject' && <span className="text-rose-400">*</span>}
                                </label>
                                <Textarea 
                                    placeholder={actionType === 'approve' ? "Optional: Great work on..." : "Required: Please fix..."}
                                    value={reviewNotes}
                                    onChange={e => setReviewNotes(e.target.value)}
                                    className="min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-500"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <button 
                                onClick={() => setDialogOpen(false)} 
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleReviewAction}
                                disabled={isSubmitting || (actionType === 'reject' && !reviewNotes.trim())}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                    actionType === 'approve' 
                                        ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                                }`}
                            >
                                {isSubmitting ? 'Processing...' : (actionType === 'approve' ? 'Confirm Approval' : 'Send Request')}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
