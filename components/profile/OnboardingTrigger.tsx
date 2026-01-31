"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/lib/hooks/useProfile';
import ProfileOnboarding from '@/components/profile/ProfileOnboarding';

export default function OnboardingTrigger() {
  const pathname = usePathname();
  const { 
    onboardingOpen, 
    setOnboardingOpen, 
    saveOnboardingData 
  } = useProfile();

  const isAdmin = pathname?.startsWith('/admin') ?? false;

  // Never show the 3-step persona/onboarding in admin — admin is for platform management only
  useEffect(() => {
    if (isAdmin) setOnboardingOpen(false);
  }, [isAdmin, setOnboardingOpen]);

  if (isAdmin) return null;

  return (
    <ProfileOnboarding 
      open={onboardingOpen} 
      onOpenChange={setOnboardingOpen}
      onComplete={saveOnboardingData}
    />
  );
}
