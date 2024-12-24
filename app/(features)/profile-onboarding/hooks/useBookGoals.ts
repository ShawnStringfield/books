import { useOnboardingData } from './useOnboardingData';

export function useBookGoals() {
  const { existingData } = useOnboardingData();

  return {
    monthlyTarget: existingData?.bookGoals?.monthlyTarget ?? 2,
    yearlyTarget: existingData?.bookGoals?.yearlyTarget ?? 24,
  };
}
