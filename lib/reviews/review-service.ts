/**
 * Review Service
 * Manages product reviews and ratings
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface Review {
    id: string;
    productId: string;
    productType: 'credit_card' | 'mutual_fund' | 'loan' | 'insurance';
    userId?: string;
    userName: string;
    rating: number; // 1-5
    title?: string;
    reviewText: string;
    pros?: string[];
    cons?: string[];
    verifiedPurchase: boolean;
    helpfulCount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    verifiedReviews: number;
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(
    productId: string,
    limit: number = 10,
    offset: number = 0
): Promise<Review[]> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .eq('status', 'approved')
            .order('helpful_count', { ascending: false })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            throw error;
        }

        return (data || []).map(review => ({
            id: review.id,
            productId: review.product_id,
            productType: review.product_type as Review['productType'],
            userId: review.user_id,
            userName: review.user_name,
            rating: Number(review.rating),
            title: review.title,
            reviewText: review.review_text,
            pros: review.pros || [],
            cons: review.cons || [],
            verifiedPurchase: review.verified_purchase || false,
            helpfulCount: review.helpful_count || 0,
            status: review.status as Review['status'],
            createdAt: review.created_at
        }));

    } catch (error) {
        logger.error('Error getting product reviews', error, { productId });
        throw error;
    }
}

/**
 * Get review statistics for a product
 */
export async function getReviewStats(productId: string): Promise<ReviewStats> {
    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('rating, verified_purchase')
            .eq('product_id', productId)
            .eq('status', 'approved');

        if (error) {
            throw error;
        }

        const totalReviews = reviews?.length || 0;
        const averageRating = totalReviews > 0
            ? reviews!.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews
            : 0;

        const ratingDistribution = {
            5: reviews?.filter(r => Number(r.rating) === 5).length || 0,
            4: reviews?.filter(r => Number(r.rating) === 4).length || 0,
            3: reviews?.filter(r => Number(r.rating) === 3).length || 0,
            2: reviews?.filter(r => Number(r.rating) === 2).length || 0,
            1: reviews?.filter(r => Number(r.rating) === 1).length || 0
        };

        const verifiedReviews = reviews?.filter(r => r.verified_purchase).length || 0;

        return {
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews,
            ratingDistribution,
            verifiedReviews
        };

    } catch (error) {
        logger.error('Error getting review stats', error, { productId });
        throw error;
    }
}

/**
 * Submit a review
 */
export async function submitReview(review: Omit<Review, 'id' | 'createdAt' | 'status' | 'helpfulCount'>): Promise<Review> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert({
                product_id: review.productId,
                product_type: review.productType,
                user_id: review.userId,
                user_name: review.userName,
                rating: review.rating,
                title: review.title,
                review_text: review.reviewText,
                pros: review.pros || [],
                cons: review.cons || [],
                verified_purchase: review.verifiedPurchase,
                status: 'pending' // Requires moderation
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        logger.info('Review submitted', { productId: review.productId, reviewId: data.id });

        return {
            id: data.id,
            productId: data.product_id,
            productType: data.product_type as Review['productType'],
            userId: data.user_id,
            userName: data.user_name,
            rating: Number(data.rating),
            title: data.title,
            reviewText: data.review_text,
            pros: data.pros || [],
            cons: data.cons || [],
            verifiedPurchase: data.verified_purchase || false,
            helpfulCount: 0,
            status: data.status as Review['status'],
            createdAt: data.created_at
        };

    } catch (error) {
        logger.error('Error submitting review', error);
        throw error;
    }
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<void> {
    try {
        const { error } = await supabase.rpc('increment_helpful_count', {
            review_id: reviewId
        });

        if (error) {
            // Fallback: update directly
            const { data: review } = await supabase
                .from('reviews')
                .select('helpful_count')
                .eq('id', reviewId)
                .single();

            if (review) {
                await supabase
                    .from('reviews')
                    .update({ helpful_count: (review.helpful_count || 0) + 1 })
                    .eq('id', reviewId);
            }
        }

        logger.info('Review marked as helpful', { reviewId });

    } catch (error) {
        logger.error('Error marking review as helpful', error);
        throw error;
    }
}

/**
 * Get overall platform review stats
 */
export async function getPlatformReviewStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    totalUsers: number;
    verifiedProducts: number;
}> {
    try {
        // Get total reviews
        const { count: totalReviews } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved');

        // Get average rating
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('status', 'approved');

        const averageRating = reviews && reviews.length > 0
            ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
            : 0;

        // Get unique users (placeholder - would need user tracking)
        const totalUsers = 125000; // Placeholder

        // Get verified products count
        const { count: verifiedProducts } = await supabase
            .from('reviews')
            .select('product_id', { count: 'exact', head: true })
            .eq('status', 'approved')
            .eq('verified_purchase', true);

        return {
            totalReviews: totalReviews || 0,
            averageRating: Number(averageRating.toFixed(1)),
            totalUsers,
            verifiedProducts: verifiedProducts || 0
        };

    } catch (error) {
        logger.error('Error getting platform review stats', error);
        throw error;
    }
}
