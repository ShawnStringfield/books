'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../profile-onboarding/hooks/useOnboardingStore';

export default function Dashboard() {
  const router = useRouter();
  const { data } = useOnboardingStore();

  useEffect(() => {
    if (!data.isOnboardingComplete) {
      console.log('pushing to onboarding because onboarding is not complete');
      // router.push('/onboarding');
    }
  }, [data.isOnboardingComplete, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      {/* Add dashboard content here */}
    </div>
  );
}
