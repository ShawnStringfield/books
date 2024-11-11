import { create } from 'zustand';
import { STEPS } from '@/lib/onboarding/constants';
import type { OnboardingState, StepId, OnboardingData } from '@/app/(features)/profile-onboarding/types/onboarding';

interface OnboardingStore extends OnboardingState {
  setCurrentStep: (step: StepId) => void;
  updateProgress: (step: StepId) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

const INITIAL_STATE: OnboardingState = {
  currentStep: STEPS[0],
  progress: 0,
  selectedGenres: [],
  selectedGoal: null,
  selectedTimes: [],
  completedSteps: [STEPS[0]],
  isLoading: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...INITIAL_STATE,

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  updateProgress: (step) => {
    const currentIndex = STEPS.indexOf(step);
    const progress = (currentIndex / (STEPS.length - 1)) * 100;
    set({ progress });
  },

  updateData: (newData) => {
    set((state) => {
      const currentStep = state.currentStep;
      const updatedSteps = state.completedSteps.includes(currentStep) ? state.completedSteps : [...state.completedSteps, currentStep];

      return {
        ...state,
        ...newData,
        completedSteps: updatedSteps,
      };
    });
  },

  resetOnboarding: () => {
    set(INITIAL_STATE);
  },
}));
