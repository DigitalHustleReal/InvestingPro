'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import RatingStars from './RatingStars';
import { formatDistanceToNow } from 'date-fns';
import { User, CheckCircle2 } from 'lucide-react';

interface Review {
  id: string;
  user: { email: string } | null;
  rating: number;
  title: string | null;
  content: string | null;
  created_at: string;
  is_verified_purchase: boolean;
  category?: string;
  pros?: string[];
  cons?: string[];
}

interface ReviewListProps {
  productSlug: string;
  refreshTrigger: number; // Increment to reload list
}

export default function ReviewList({ productSlug, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const data = await api.entities.reviews.list(productSlug);
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
        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                 <User size={16} />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.user?.email?.split('@')[0] || 'Anonymous'}
                    </span>
                    {review.is_verified_purchase && (
                        <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Verified
                        </span>
                    )}
                    {review.category && (
                       <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full font-medium">
                         {review.category}
                       </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </span>
               </div>
            </div>
            <RatingStars rating={review.rating} size={14} />
          </div>
          
          {review.title && (
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {review.title}
            </h4>
          )}
          
          {review.content && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
              {review.content}
            </p>
          )}

          {/* Pros & Cons */}
          {(review.pros?.length || 0) > 0 && (
             <div className="mt-2 flex flex-wrap gap-2">
               {review.pros!.slice(0,3).map(p => (
                 <span key={p} className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">
                   + {p}
                 </span>
               ))}
               {(review.cons?.length || 0) > 0 && review.cons!.slice(0,2).map(c => (
                 <span key={c} className="text-xs text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-md border border-red-100 dark:border-red-800">
                   - {c}
                 </span>
               ))}
             </div>
          )}
        </div>
      ))}
    </div>
  );
}
