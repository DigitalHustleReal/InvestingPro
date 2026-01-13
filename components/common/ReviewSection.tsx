"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Star, ThumbsUp, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Review {
    id: string;
    product_id: string;
    user_name: string;
    rating: number;
    title?: string;
    review_text: string;
    pros?: string[];
    cons?: string[];
    status: string;
    verified_purchase?: boolean;
    created_at: string;
    created_date?: string; // mapping for compatibility
    helpful_count?: number;
}

export default function ReviewSection({ productId }: { productId: string }) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewData, setReviewData] = useState({
        title: '',
        review_text: '',
        pros: '',
        cons: ''
    });

    const queryClient = useQueryClient();

    const { data: reviews = [], isLoading } = useQuery<Review[]>({
        queryKey: ['reviews', productId],
        queryFn: () => api.entities.Review.filter({
            product_id: productId,
            status: 'approved'
        }),
        initialData: []
    });

    const submitReviewMutation = useMutation({
        mutationFn: (reviewPayload: any) => api.entities.Review.create(reviewPayload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
            setShowReviewForm(false);
            setRating(0);
            setReviewData({ title: '', review_text: '', pros: '', cons: '' });
            alert('Review submitted successfully! It will appear after approval.');
        }
    });

    const handleSubmitReview = async () => {
        if (rating === 0 || !reviewData.review_text) {
            alert('Please provide a rating and review text');
            return;
        }

        const user = await api.auth.me().catch(() => null);

        submitReviewMutation.mutate({
            product_id: productId,
            user_name: user?.full_name || 'Anonymous',
            rating: rating,
            title: reviewData.title,
            review_text: reviewData.review_text,
            pros: reviewData.pros ? reviewData.pros.split(',').map(p => p.trim()) : [],
            cons: reviewData.cons ? reviewData.cons.split(',').map(c => c.trim()) : [],
            status: 'pending'
        });
    };

    // Calculate rating distribution
    const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: reviews.filter(rev => rev.rating === r).length
    }));

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-slate-900 mb-2">{avgRating}</div>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= Math.round(Number(avgRating))
                                            ? 'text-accent-400 fill-accent-400'
                                            : 'text-slate-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-500">{reviews.length} reviews</p>
                        </div>

                        <div className="space-y-2">
                            {ratingCounts.map(({ rating: r, count }) => (
                                <div key={r} className="flex items-center gap-3">
                                    <span className="text-sm font-medium w-8">{r} ★</span>
                                    <Progress
                                        value={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-slate-500 w-8">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="w-full mt-6"
                        variant="outline"
                    >
                        Write a Review
                    </Button>
                </CardContent>
            </Card>

            {/* Review Form */}
            {showReviewForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Write Your Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Your Rating *</Label>
                            <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-8 h-8 cursor-pointer transition-colors ${star <= (hoverRating || rating)
                                            ? 'text-accent-400 fill-accent-400'
                                            : 'text-slate-300'
                                            }`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Review Title</Label>
                            <Input
                                placeholder="Summarize your experience"
                                value={reviewData.title}
                                onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Your Review *</Label>
                            <Textarea
                                placeholder="Share your experience with this product..."
                                value={reviewData.review_text}
                                onChange={(e) => setReviewData({ ...reviewData, review_text: e.target.value })}
                                rows={6}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Pros (comma separated)</Label>
                                <Input
                                    placeholder="Low fees, Good service"
                                    value={reviewData.pros}
                                    onChange={(e) => setReviewData({ ...reviewData, pros: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cons (comma separated)</Label>
                                <Input
                                    placeholder="Slow support, Limited options"
                                    value={reviewData.cons}
                                    onChange={(e) => setReviewData({ ...reviewData, cons: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleSubmitReview} disabled={submitReviewMutation.isPending}>
                                Submit Review
                            </Button>
                            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">{review.user_name}</span>
                                        {review.verified_purchase && (
                                            <Badge className="bg-primary-100 text-primary-700">
                                                <Check className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating
                                                    ? 'text-accent-400 fill-accent-400'
                                                    : 'text-slate-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-sm text-slate-500">
                                    {new Date(review.created_at || review.created_date || "").toLocaleDateString()}
                                </span>
                            </div>

                            {review.title && (
                                <h4 className="font-semibold text-slate-900 mb-2">{review.title}</h4>
                            )}

                            <p className="text-slate-600 mb-4">{review.review_text}</p>

                            {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    {review.pros && review.pros.length > 0 && (
                                        <div>
                                            <p className="font-medium text-primary-600 mb-2 flex items-center gap-1">
                                                <Check className="w-4 h-4" /> Pros
                                            </p>
                                            <ul className="space-y-1 text-sm">
                                                {review.pros.map((pro, idx) => (
                                                    <li key={idx} className="text-slate-600">• {pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {review.cons && review.cons.length > 0 && (
                                        <div>
                                            <p className="font-medium text-danger-600 mb-2 flex items-center gap-1">
                                                <X className="w-4 h-4" /> Cons
                                            </p>
                                            <ul className="space-y-1 text-sm">
                                                {review.cons.map((con, idx) => (
                                                    <li key={idx} className="text-slate-600">• {con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button variant="ghost" size="sm" className="text-slate-500">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Helpful ({review.helpful_count || 0})
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
