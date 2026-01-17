'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import RatingStars from './RatingStars';
import { createClient } from '@/lib/supabase/client';
import { MessageSquarePlus } from 'lucide-react';

interface ProductReviewsProps {
  productSlug: string;
  productType: string;
}

export default function ProductReviews({ productSlug, productType }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [userId, setUserId] = useState<string | null>(null);

  // Check auth status
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  // Fetch stats initially and on refresh
  useEffect(() => {
    apiClient.reviews.getStats(productSlug).then(setStats);
  }, [productSlug, refreshKey]);

  const handleReviewSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1); // Trigger list refresh
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            User Reviews
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.average || '0.0'}
            </span>
            <div>
               <RatingStars rating={stats.average} size={18} />
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                 Based on {stats.count} reviews
               </p>
            </div>
          </div>
        </div>

        {userId ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            <MessageSquarePlus size={18} />
            {showForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        ) : (
          <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg">
            Log in to write a review
          </div>
        )}
      </div>

      {showForm && (
        <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-200">
           <ReviewForm 
             productSlug={productSlug} 
             productType={productType}
             userId={userId!}
             onSuccess={handleReviewSuccess}
           />
        </div>
      )}

      <ReviewList productSlug={productSlug} refreshTrigger={refreshKey} />
    </div>
  );
}
