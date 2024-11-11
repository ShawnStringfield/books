// hooks/useOnboardingCheck.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from './useOnboardingStore';

export const useOnboardingCheck = () => {
  const router = useRouter();
  const { isOnboardingComplete = false } = useOnboardingStore();

  useEffect(() => {
    // If onboarding is not complete, redirect to onboarding
    if (!isOnboardingComplete) {
      router.push('/profile-onboarding');
    }
  }, [isOnboardingComplete, router]);

  return { isOnboardingComplete };
};
