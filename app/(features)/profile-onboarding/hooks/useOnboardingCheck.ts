'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingState {
  isComplete: boolean;
  steps?: string[];
  lastCompletedStep?: string;
  // Add other relevant fields
}

export function useOnboardingCheck() {
  const router = useRouter();

  useEffect(() => {
    const onboardingState = (() => {
      try {
        const stored = localStorage.getItem('user-onboarding-state');
        return stored ? (JSON.parse(stored) as OnboardingState) : null;
      } catch (error) {
        console.error('Error parsing onboarding state:', error);
        return null;
      }
    })();

    if (!onboardingState) {
      router.push('/profile-onboarding');
    }
  }, [router]);

  return null; // You could return the onboarding state if needed
}
