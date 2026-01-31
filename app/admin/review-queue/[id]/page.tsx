"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ReviewInterface from '@/components/admin/ReviewInterface';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewArticlePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const supabase = createClient();

    // Fetch Article Data
    const { data: article, isLoading } = useQuery({
        queryKey: ['review-article', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('articles')
                .select(`
                    *,
                    author:authors!author_id(name, avatar_url),
                    category_data:categories!category_id(name, slug)
                `)
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        },
    });

    // Fetch Pipeline Run Data (if enabled in updated schema)
    const { data: pipelineData } = useQuery({
        queryKey: ['pipeline-run', article?.pipeline_run_id],
        enabled: !!article?.pipeline_run_id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('pipeline_runs')
                .select('result, params, created_at')
                .eq('id', article.pipeline_run_id)
                .single();
                
            if (error) return null;
            return data;
        }
    });

    const handleAction = async (action: 'approve' | 'reject', notes?: string) => {
        try {
            // 1. Log the Review
            // (Assuming article_reviews table exists, or we log to a new Audit Log)
            // For now, simpler update:
            
            const updates: any = {
                status: action === 'approve' ? 'published' : 'draft',
                fact_check_status: action === 'approve' ? 'verified' : 'correction_needed',
                reviewed_at: new Date().toISOString(),
                // author_id would be current user (reviewer) but we are client side here
                // reviewed_by: (await supabase.auth.getUser()).data.user?.id 
            };
            
            if (action === 'approve') {
                updates.published_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('articles')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            toast.success(action === 'approve' ? 'Article Published! 🚀' : 'Sent back for changes.');
            router.push('/admin/review-queue');

        } catch (err: any) {
            console.error(err);
            toast.error('Failed to update article: ' + err.message);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
            </AdminLayout>
        );
    }

    if (!article) {
        return (
            <AdminLayout>
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
                    <button onClick={() => router.back()} className="text-primary-500 hover:underline mt-4">
                        Go Back
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col p-6">
                <ReviewInterface 
                    article={article} 
                    sourceData={pipelineData?.result || { note: "No connected pipeline data found." }}
                    onAction={handleAction}
                />
            </div>
        </AdminLayout>
    );
}
