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

// Base state interface without methods
export interface OnboardingStateData {
  currentStep: StepId;
  progress: number;
  selectedGenres: string[];
  bookGoals: BookGoals;
  readingSchedule: ReadingSchedule;
  completedSteps: StepId[];
  isOnboardingComplete: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Actions interface
export interface OnboardingActions {
  updateGenres: (genres: string[]) => void;
  updateGoals: (goals: BookGoals) => void;
  updateSchedule: (schedule: ReadingSchedule) => void;
  setCurrentStep: (step: StepId) => void;
  updateProgress: (step: StepId) => void;
  completeOnboarding: () => void;
}

// Combined interface for the store
export interface OnboardingState extends OnboardingStateData, OnboardingActions {}
