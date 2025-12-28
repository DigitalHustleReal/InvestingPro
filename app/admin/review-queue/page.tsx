"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ArticleModeration from '@/components/admin/ArticleModeration';

export default function ReviewQueuePage() {
    const { data: pendingArticles = [] } = useQuery({
        queryKey: ['pending-articles'],
        queryFn: async () => {
            // Get all articles and filter for pending ones
            // Include both user submissions and AI-generated articles that need review
            const allArticles = await api.entities.Article.list('-created_date', 100);
            
            // Filter for pending articles:
            // 1. User submissions with pending status
            // 2. AI-generated articles with pending status (if you want to review AI content)
            const pending = allArticles.filter((article: any) => {
                // User submissions pending review
                if (article.is_user_submission && article.submission_status === 'pending') {
                    return true;
                }
                // AI-generated articles pending review (optional - uncomment if you want to review AI content)
                // if (article.ai_generated && article.submission_status === 'pending') {
                //     return true;
                // }
                return false;
            });
            
            return pending.sort((a: any, b: any) => {
                const dateA = new Date(a.created_date || a.created_at || 0).getTime();
                const dateB = new Date(b.created_date || b.created_at || 0).getTime();
                return dateB - dateA;
            });
        },
        initialData: [],
        refetchInterval: 10000 // Refetch every 10 seconds
    });

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <h1 className="text-2xl font-bold text-slate-900">Review Queue</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        {pendingArticles.length} article{pendingArticles.length !== 1 ? 's' : ''} pending review
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    {pendingArticles.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">No articles pending review</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl">
                            {pendingArticles.map((article: any) => (
                                <ArticleModeration key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}




