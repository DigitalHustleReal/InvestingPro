"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { apiClient as api } from '@/lib/api-client';
import { useQuery } from "@tanstack/react-query";
import { logger } from "@/lib/logger";
import {
    User as UserIcon,
    FileText,
    Star,
    TrendingUp,
    Settings,
    Eye,
    MousePointerClick,
    DollarSign,
    Trophy,
    Award,
    ChevronRight,
    TrendingDown,
    Activity,
    Zap,
    ShieldCheck,
    Globe
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import BadgeDisplay from "@/components/gamification/BadgeDisplay";
import PointsWidget from "@/components/gamification/PointsWidget";
import SEOHead from "@/components/common/SEOHead";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Only run on client side to avoid hydration issues
        if (typeof window !== 'undefined') {
            loadUser();
        }
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await api.auth.me();
            if (!currentUser) {
                // Use router instead of window.location to avoid hydration issues
                router.push('/');
                return;
            }
            setUser(currentUser);
        } catch (error) {
            // Silently handle auth errors - allow page to render gracefully
            // User will see appropriate UI based on null user state
            logger.error('Failed to load user in profile page', error as Error);
        } finally {
            setIsLoaded(true);
        }
    };

    const { data: userArticles = [] } = useQuery({
        queryKey: ['user-articles', user?.email],
        queryFn: () => api.entities.Article.filter({
            author_email: user?.email,
            is_user_submission: true
        }),
        enabled: !!user?.email
    });

    const { data: userReviews = [] } = useQuery({
        queryKey: ['user-reviews', user?.email],
        queryFn: () => api.entities.reviews.filter({
            user_id: user?.id
        }),
        enabled: !!user?.id
    });

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <LoadingSpinner text="Benchmarking Profile Authority..." />
            </div>
        );
    }

    const publishedArticles = userArticles.filter((a: any) => a.status === 'published');
    const totalViews = userArticles.reduce((sum: number, a: any) => sum + (a.views || 0), 0);
    const approvedReviews = userReviews.filter((r: any) => r.status === 'approved');
    const totalHelpful = userReviews.reduce((sum: number, r: any) => sum + (r.helpful_count || 0), 0);

    const stats = [
        { label: 'Verified submissions', value: publishedArticles.length, icon: FileText, color: 'text-primary-500', bg: 'bg-primary-50' },
        { label: 'Knowledge Reach', value: totalViews.toLocaleString(), icon: Eye, color: 'text-secondary-500', bg: 'bg-primary-50' },
        { label: 'Conflict Reviews', value: approvedReviews.length, icon: Star, color: 'text-accent-500', bg: 'bg-accent-50' },
        { label: 'Community Trust', value: totalHelpful, icon: Activity, color: 'text-primary-500', bg: 'bg-primary-50' },
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400',
            approved: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400',
            rejected: 'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400',
            'revision-requested': 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400',
            published: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
        };
        return styles[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
            <SEOHead
                title={`${user?.full_name} | InvestingPro Authority Profile`}
                description={`Contributor profile of ${user?.full_name} on InvestingPro India. View published analysis, reviews, and market insights.`}
            />

            {/* Authority Hero Section */}
            <div className="bg-slate-900 border-b border-white/5 pt-28 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[140px] -translate-y-1/2" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end gap-10">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[3rem] bg-slate-800 border-8 border-slate-900 shadow-2xl overflow-hidden relative z-10">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-success-400 to-primary-500 flex items-center justify-center">
                                        <UserIcon className="w-20 h-20 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-primary-400 p-3 rounded-2xl shadow-xl z-20 border border-white/10 group-hover:rotate-12 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl font-bold text-white tracking-tight">{user.full_name}</h1>
                                        <Badge className="bg-primary-500 text-slate-900 font-semibold rounded-lg uppercase tracking-st text-[9px] px-2.5">Verified Contributor</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 font-bold mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5" />
                                            <span className="text-sm">Mumbai, India</span>
                                        </div>
                                        <span className="text-slate-700">â€¢</span>
                                        <div className="flex items-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5 text-accent-500" />
                                            <span className="text-sm">{user.points} XP Portfolio</span>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => setShowEditDialog(true)} variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 font-semibold h-12 px-8 uppercase tracking-widest text-">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Edit Credentials
                                </Button>
                            </div>

                            <div className="max-w-3xl">
                                <p className="text-lg text-slate-300 font-medium leading-relaxed italic opacity-80 backdrop-blur-sm bg-black/10 p-4 rounded-2xl border border-white/5">
                                    "{user.bio || 'Market enthusiast and verified InvestingPro contributor analyzing trends in the Indian financial landscape.'}"
                                </p>

                                {user.expertise?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {user.expertise.map((exp: string, idx: number) => (
                                            <Badge key={idx} className="bg-white/5 text-slate-300 border-white/10 rounded-xl px-4 py-1.5 font-semibold uppercase text-[9px] tracking-st">
                                                {exp}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="space-y-8">
                    {/* Gamification Hub */}
                    <div className="grid lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <PointsWidget points={user?.points || 0} level={user?.level || 'Beginner'} />
                        </div>
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl bg-white dark:bg-slate-900 p-8 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 dark:from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-st mb-6 relative z-10">Achievements</h4>
                            <div className="relative z-10">
                                <BadgeDisplay badges={user.badges} showTooltip={true} />
                                {(!user.badges || user.badges.length === 0) && (
                                    <p className="text-xs font-bold text-slate-400 italic">No badges unlocked yet. Start submitting analysis!</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Performance Matrix */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="rounded-[2.5rem] border-0 shadow-xl bg-white dark:bg-slate-900 p-8 group hover:-translate-y-1 transition-all">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-white/5 ${stat.color} flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-st mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Content Hub Tabs */}
                    <Tabs defaultValue="articles" className="space-y-8">
                        <TabsList className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 flex h-auto max-w-fit mx-auto sm:mx-0">
                            <TabsTrigger value="articles" className="rounded-3xl px-8 py-4 font-semibold uppercase tracking-widest text- data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-primary-600 data-[state=active]:text-white transition-all text-slate-500 dark:text-slate-400">
                                Analysis Hub <span className="ml-2 text-slate-400 dark:text-slate-300">{userArticles.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="rounded-3xl px-8 py-4 font-semibold uppercase tracking-widest text- data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-primary-600 data-[state=active]:text-white transition-all text-slate-500 dark:text-slate-400">
                                Community Reviews <span className="ml-2 text-slate-400 dark:text-slate-300">{userReviews.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Articles Matrix */}
                        <TabsContent value="articles" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {userArticles.length === 0 ? (
                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-white dark:bg-slate-900 p-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 dark:border-slate-700">
                                        <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Authority Pending</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">You haven't published any analysis articles yet. Share your market wisdom with the community.</p>
                                    <Button className="rounded-2xl bg-primary-600 hover:bg-secondary-600 dark:bg-primary-500 dark:hover:bg-secondary-500 text-white font-bold h-14 px-8 shadow-xl transition-all">Submit Your First Article</Button>
                                </Card>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {userArticles.map((article: any) => (
                                        <Card key={article.id} className="rounded-[3rem] border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-2xl transition-all">
                                            <div className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <Badge className={`${getStatusBadge(article.submission_status || article.status)} border-0 rounded-xl px-4 py-1.5 font-bold uppercase tracking-widest text-[9px]`}>
                                                        {article.submission_status || article.status}
                                                    </Badge>
                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-st">{new Date(article.created_at || article.created_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{article.title}</h4>
                                                <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{article.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-slate-100 dark:border-slate-800 font-bold text-[9px] uppercase dark:text-slate-300">{article.category || 'General'}</Badge>
                                                    </div>
                                                </div>
                                                {article.rejection_reason && (
                                                    <div className="mt-6 p-4 bg-danger-50 dark:bg-danger-900/20 rounded-2xl border border-danger-100 dark:border-danger-900/50 flex gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-danger-500 text-white flex items-center justify-center shrink-0 text-[10px] font-bold pt-0.5">!</div>
                                                        <p className="text-xs font-bold text-danger-700 dark:text-danger-400 leading-relaxed italic">
                                                            {article.rejection_reason}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Reviews Matrix */}
                        <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <Card className="rounded-[3rem] border-0 shadow-2xl bg-white dark:bg-slate-900 p-6 md:p-8">
                                {userReviews.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Star className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
                                        <p className="text-slate-400 font-semibold uppercase tracking-widest text-">Conflict evidence not found</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {userReviews.map((review: any) => (
                                            <div key={review.id} className="p-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`w-3.5 h-3.5 ${star <= review.rating
                                                                                ? 'text-accent-400 fill-accent-400'
                                                                                : 'text-slate-200 dark:text-slate-700'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-slate-300">â€¢</span>
                                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-st">
                                                                {new Date(review.created_at || review.created_date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {review.title && (
                                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{review.title}</h4>
                                                        )}
                                                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{review.review_text}</p>
                                                    </div>
                                                    <Badge className={`${getStatusBadge(review.status)} border-0 rounded-xl px-4 py-1.5 font-bold uppercase tracking-widest text-[9px]`}>
                                                        {review.status}
                                                    </Badge>
                                                </div>
                                                {review.status === 'approved' && review.helpful_count > 0 && (
                                                    <div className="flex items-center gap-2 mt-4 text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-st">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        {review.helpful_count} Verified Trust Ratings
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <EditProfileDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                user={user}
                onUpdate={loadUser}
            />
        </div>
    );
}
