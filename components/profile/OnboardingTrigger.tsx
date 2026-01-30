"use client";

import React from 'react';
import { useProfile } from '@/lib/hooks/useProfile';
import ProfileOnboarding from '@/components/profile/ProfileOnboarding';

export default function OnboardingTrigger() {
  const { 
    onboardingOpen, 
    setOnboardingOpen, 
    saveOnboardingData 
  } = useProfile();

  return (
    <ProfileOnboarding 
      open={onboardingOpen} 
      onOpenChange={setOnboardingOpen}
      onComplete={saveOnboardingData}
    />
  );
}
