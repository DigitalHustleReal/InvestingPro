'use client';

import { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import RatingStars from './RatingStars';
import RatingBreakdown from './RatingBreakdown';
import { createClient } from '@/lib/supabase/client';
import { MessageSquarePlus } from 'lucide-react';
import { getReviewStats, generateReviewSchema } from '@/lib/content/review-data';

interface ProductReviewsProps {
  productSlug: string;
  productType: string;
}

export default function ProductReviews({ productSlug, productType }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Get review stats from mock data
  const stats = getReviewStats(productSlug);

  // Check auth status
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const handleReviewSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1); // Trigger list refresh
  };

  return (
    <>
      {/* Review Schema for SEO */}
      {stats.count > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateReviewSchema(productSlug, productType))
          }}
        />
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left: Average Rating */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              User Reviews
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">
                  {stats.average.toFixed(1)}
                </span>
                <RatingStars rating={stats.average} size={20} className="mt-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {stats.count > 0 ? `Based on ${stats.count} reviews` : 'Be the first to review'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Rating Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Rating Distribution</h3>
            <RatingBreakdown 
              distribution={stats.distribution}
              totalReviews={stats.count}
            />
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mb-8">
          {userId ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              <MessageSquarePlus size={18} />
              {showForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          ) : (
            <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg inline-block">
              Log in to write a review
            </div>
          )}
        </div>

        {/* Review Form */}
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

        {/* Review List */}
        <ReviewList productSlug={productSlug} refreshTrigger={refreshKey} />
      </div>
    </>
  );
}
