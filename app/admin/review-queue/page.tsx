"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ArticleModeration from '@/components/admin/ArticleModeration';
import { CheckCircle2 } from 'lucide-react';

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
                // AI-generated articles pending review
                if (article.ai_generated && article.submission_status === 'pending') {
                    return true;
                }
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
            <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-10 sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Review Queue</h1>
                            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                {pendingArticles.length} publication{pendingArticles.length !== 1 ? 's' : ''} awaiting authority check
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
                                Content Factory Status: Active
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 p-8">
                    <div className="max-w-5xl mx-auto">
                        {pendingArticles.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Queue is Clear</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                                    All AI-generated content has been processed. The factory is ready for the next trend.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {pendingArticles.map((article: any) => (
                                    <div key={article.id} className="transition-transform duration-300 hover:scale-[1.01]">
                                        <ArticleModeration article={article} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}




