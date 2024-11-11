'use client';

import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

const Dashboard = () => {
  const { isOnboardingComplete } = useOnboardingCheck();

  // Show loading state while checking onboarding status
  if (!isOnboardingComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Your dashboard content
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
