import { STEPS } from '@profile-onboarding/constants';

export type StepId = (typeof STEPS)[number];

export interface ReadingPreference {
  daysOfWeek: string[];
  timeOfDay: string;
  notifications: boolean;
}

export interface BookGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

export interface ReadingSchedule {
  preferences: ReadingPreference[];
}

export interface OnboardingData {
  selectedGenres: string[];
  bookGoals: BookGoals;
  readingSchedule: ReadingSchedule;
  isOnboardingComplete: boolean;
}

// Base state interface without methods
export interface OnboardingStateData {
  currentStep: StepId;
  progress: number;
  completedSteps: StepId[];
  isLoading: boolean;
  error: Error | null;
}

// Actions interface
export interface OnboardingActions {
  setCurrentStep: (step: StepId) => void;
  updateProgress: (step: StepId) => void;
  markStepCompleted: (step: StepId) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  resetState: () => void;
}

// Combined interface for the store
export interface OnboardingState extends OnboardingStateData, OnboardingActions {}
