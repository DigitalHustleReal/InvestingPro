"use client";

import React from 'react';
import { Star, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Review } from '@/lib/content/review-data';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onHelpful, onNotHelpful }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
            {review.userName.charAt(0)}
          </div>
          
          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">{review.userName}</p>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-600">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-4 h-4",
                star <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
              )}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
        {review.title}
      </h4>

      {/* Content */}
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {review.content}
      </p>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          {review.pros && review.pros.length > 0 && (
            <div>
              <p className="text-xs font-bold text-success-700 dark:text-success-400 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                PROS
              </p>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-success-600 dark:text-success-400 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.cons && review.cons.length > 0 && (
            <div>
              <p className="text-xs font-bold text-danger-700 dark:text-danger-400 mb-2 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                CONS
              </p>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-danger-600 dark:text-danger-400 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Helpful Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-600">Was this helpful?</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onHelpful?.(review.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-success-500 hover:bg-success-50 dark:hover:bg-success-950/30 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{review.helpful}</span>
          </button>
          <button
            onClick={() => onNotHelpful?.(review.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/30 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{review.notHelpful}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
