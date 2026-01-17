'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import RatingStars from './RatingStars';

interface ReviewFormProps {
  productSlug: string;
  productType: string;
  userId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productSlug, productType, userId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.reviews.create({
        product_slug: productSlug,
        product_type: productType,
        rating,
        title,
        content,
        user_id: userId
      });
      
      // Reset form
      setRating(0);
      setTitle('');
      setContent('');
      onSuccess();
    } catch (err: any) {
      console.error('Submit review error:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Write a Review</h3>
      
      {error && (
        <div className="p-3 text-sm text-danger-500 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Rating
        </label>
        <RatingStars 
          rating={rating} 
          size={24} 
          interactive={true} 
          onRate={setRating} 
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review Details
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          placeholder="What did you like or dislike?"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
