'use client';

import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';

export default function DashboardPage() {
  useOnboardingCheck();

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
