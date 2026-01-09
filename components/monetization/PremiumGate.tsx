'use client';

/**
 * Premium Gate Component
 * 
 * Purpose: Gate premium features behind subscription
 * Shows upgrade prompt for free users
 * Allows access for Pro subscribers
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Lock, Crown, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  requiredPlan?: 'pro' | 'pro_annual';
  fallback?: React.ReactNode;
}

interface UserSubscription {
  plan: 'free' | 'pro' | 'pro_annual';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: string;
}

const PREMIUM_FEATURES = {
  'advanced-calculators': {
    title: 'Advanced Calculators',
    description: 'Access advanced financial calculators with detailed projections',
    icon: '🧮',
  },
  'portfolio-tracker': {
    title: 'Portfolio Tracker',
    description: 'Track your investments across all platforms in one place',
    icon: '📊',
  },
  'personalized-recommendations': {
    title: 'Personalized Recommendations',
    description: 'Get AI-powered product recommendations based on your profile',
    icon: '🎯',
  },
  'ad-free': {
    title: 'Ad-Free Experience',
    description: 'Enjoy a clean, distraction-free reading experience',
    icon: '✨',
  },
  'priority-support': {
    title: 'Priority Support',
    description: 'Get faster responses from our support team',
    icon: '💬',
  },
  'export-data': {
    title: 'Export Data',
    description: 'Export your calculations and analysis to PDF/Excel',
    icon: '📁',
  },
};

export function PremiumGate({
  children,
  feature,
  description,
  requiredPlan = 'pro',
  fallback,
}: PremiumGateProps) {
  // Fetch user subscription status
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const res = await fetch('/api/user/subscription');
      if (!res.ok) return { plan: 'free', status: 'active' };
      return res.json() as Promise<UserSubscription>;
    },
  });

  const isPremium = subscription?.plan !== 'free' && subscription?.status === 'active';
  const featureInfo = PREMIUM_FEATURES[feature as keyof typeof PREMIUM_FEATURES];

  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse bg-slate-800/50 rounded-xl p-8">
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
    );
  }

  // User has access
  if (isPremium) {
    return <>{children}</>;
  }

  // Show upgrade prompt
  return (
    <div className="relative">
      {/* Blurred preview of content */}
      {fallback ? (
        fallback
      ) : (
        <div className="blur-sm opacity-50 pointer-events-none select-none">
          {children}
        </div>
      )}

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            {featureInfo?.title || 'Premium Feature'}
          </h3>
          
          <p className="text-slate-300 mb-6">
            {description || featureInfo?.description || 'Upgrade to Pro to unlock this feature'}
          </p>

          <div className="space-y-3 mb-6">
            <ProBenefit>All premium calculators</ProBenefit>
            <ProBenefit>Portfolio tracking</ProBenefit>
            <ProBenefit>Personalized recommendations</ProBenefit>
            <ProBenefit>Ad-free experience</ProBenefit>
            <ProBenefit>Priority email support</ProBenefit>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8"
            >
              <Link href="/pricing">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="ghost" className="text-slate-400">
              Learn More
            </Button>
          </div>

          <p className="text-slate-500 text-sm mt-4">
            Starting at ₹199/month • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

function ProBenefit({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/**
 * Inline premium badge for small UI elements
 */
export function PremiumBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses} bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full font-medium border border-amber-500/30`}>
      <Crown className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      PRO
    </span>
  );
}

/**
 * Lock icon overlay for locked features
 */
export function PremiumLock({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-slate-950/80 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Lock className="w-8 h-8 text-amber-500" />
        <span className="text-sm text-slate-400">Pro Feature</span>
      </div>
    </div>
  );
}

/**
 * Hook to check premium status
 */
export function usePremiumStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const res = await fetch('/api/user/subscription');
      if (!res.ok) return { plan: 'free', status: 'active' };
      return res.json() as Promise<UserSubscription>;
    },
  });

  return {
    isPremium: data?.plan !== 'free' && data?.status === 'active',
    plan: data?.plan || 'free',
    isLoading,
  };
}

export default PremiumGate;
