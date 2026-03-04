"use client";

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from "@/lib/supabase/client";
import { apiClient as api } from "@/lib/api-client";
import { OnboardingData } from "@/components/profile/ProfileOnboarding";

export function useProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const checkOnboarding = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isProjectOnboarded = localStorage.getItem('investingpro_onboarded') === 'true';
    setOnboarded(isProjectOnboarded);
    
    // Auto-open onboarding for new users after a small delay
    if (!isProjectOnboarded && !onboardingOpen) {
      const timer = setTimeout(() => {
        setOnboardingOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onboardingOpen]);

  useEffect(() => {
    const supabase = createClient();
    
    // Initial fetch
    api.auth.me().then(u => {
      setUser(u);
      setLoading(false);
      
      // If user is logged in, sync onboarding status from their profile
      if (u?.profile_data?.onboarded) {
        setOnboarded(true);
        localStorage.setItem('investingpro_onboarded', 'true');
        localStorage.setItem('investingpro_onboarding', JSON.stringify(u.profile_data));
      } else {
        checkOnboarding();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const u = await api.auth.me();
        setUser(u);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkOnboarding]);

  const saveOnboardingData = async (data: OnboardingData) => {
    setOnboarded(true);
    localStorage.setItem('investingpro_onboarded', 'true');
    localStorage.setItem('investingpro_onboarding', JSON.stringify(data));

    if (user) {
      try {
        await api.auth.updateMe({
          profile_data: {
            ...data,
            onboarded: true,
            updated_at: new Date().toISOString()
          }
        });
      } catch (err) {
        logger.error("Failed to sync profile data to Supabase", err);
      }
    }
  };

  return {
    user,
    loading,
    onboarded,
    onboardingOpen,
    setOnboardingOpen,
    saveOnboardingData
  };
}
