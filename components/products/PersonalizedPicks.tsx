"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/lib/hooks/useProfile';
import { getPersonalizedRecommendations, RecommendationResult } from '@/lib/utils/recommendation-engine';
import { apiClient as api } from '@/lib/api-client';
import { Sparkles, ArrowRight, Star, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function PersonalizedPicks() {
  const { user, loading: profileLoading } = useProfile();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndRank() {
      if (!user?.profile_data) {
        setLoading(false);
        return;
      }

      try {
        // Fetch products (currently credit cards)
        const products = await api.entities.CreditCard.list();
        
        // Pass products through engine
        const ranked = getPersonalizedRecommendations(user.profile_data, products as any, 3);
        setRecommendations(ranked);
      } catch (err) {
        console.error("Failed to generate recommendations", err);
      } finally {
        setLoading(false);
      }
    }

    if (!profileLoading) {
      fetchAndRank();
    }
  }, [user, profileLoading]);

  if (loading || profileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Should not happen with mock data, but safe fallback
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recommendations.map((rec, idx) => (
        <Card 
          key={rec.product.id} 
          className={cn(
            "relative group overflow-hidden border-2 transition-all hover:shadow-2xl hover:shadow-primary-500/10",
            idx === 0 ? "border-primary-600 bg-primary-50/30 dark:bg-primary-900/10" : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
          )}
        >
          {idx === 0 && (
            <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1 z-10 shadow-lg">
              <Sparkles size={10} /> BEST MATCH
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="relative w-full h-32 mb-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden p-4 flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition-transform duration-500">
                {rec.product.image_url ? (
                  <Image 
                    src={rec.product.image_url} 
                    alt={rec.product.name} 
                    fill 
                    className="object-contain p-2"
                  />
                ) : (
                  <Sparkles className="w-12 h-12 text-gray-200" />
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 truncate">
                  {rec.product.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {rec.product.provider_name}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {rec.matchReasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-success-600 dark:text-success-400">
                    <ShieldCheck size={12} />
                    {reason}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-200">{rec.product.rating?.overall || 4.5}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium">Expert Score</p>
                </div>
                <Link href={`/${rec.product.category.replace('_', '-')}s/${rec.product.slug}`}>
                  <Button size="sm" className="bg-gray-900 dark:bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg h-9 px-4">
                    View <ArrowRight size={14} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
