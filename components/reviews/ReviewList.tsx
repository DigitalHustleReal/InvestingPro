'use client';

import { useEffect, useState } from 'react';
import { getProductReviews, Review as ReviewData } from '@/lib/content/review-data';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  productSlug: string;
  refreshTrigger: number; // Increment to reload list
}

export default function ReviewList({ productSlug, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        // Use mock data for now
        const data = getProductReviews(productSlug);
        setReviews(data);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [productSlug, refreshTrigger]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-600">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
