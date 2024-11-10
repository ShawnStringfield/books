import { useState, useEffect } from 'react';
import { OnboardingData } from '../onboarding';

const STORAGE_KEY = 'bookbuddy_onboarding';

export const useOnboardingStore = () => {
  const [data, setData] = useState<OnboardingData>({
    selectedGenres: [],
    selectedGoal: null,
    selectedTimes: [],
    completedSteps: ['welcome'],
    isOnboardingComplete: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { data, updateData };
};
