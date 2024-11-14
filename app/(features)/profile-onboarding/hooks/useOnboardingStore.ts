import { create } from 'zustand';
import { STEPS } from '@/app/(features)/profile-onboarding/constants';
import type { StepId } from '@/app/(features)/profile-onboarding/types/onboarding';

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

export interface OnboardingState {
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

export interface OnboardingStore extends OnboardingState {
  setCurrentStep: (step: StepId) => void;
  updateProgress: (step: StepId) => void;
  updateGenres: (genres: string[]) => void;
  updateGoals: (goals: BookGoals) => void;
  updateSchedule: (schedule: ReadingSchedule) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const INITIAL_STATE: OnboardingState = {
  currentStep: STEPS[0],
  progress: 0,
  selectedGenres: [],
  bookGoals: {
    monthlyTarget: 2,
    yearlyTarget: 24,
  },
  readingSchedule: {
    preferences: [],
  },
  completedSteps: [STEPS[0]],
  isOnboardingComplete: false,
  isLoading: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...INITIAL_STATE,

  setCurrentStep: (step: StepId) => {
    set({ currentStep: step });
  },

  updateProgress: (step: StepId) => {
    const currentIndex = STEPS.indexOf(step);
    const progress = (currentIndex / (STEPS.length - 1)) * 100;
    set({ progress });
  },

  updateGenres: (genres: string[]) => {
    set((state: OnboardingState) => ({
      ...state,
      selectedGenres: genres,
      completedSteps: updateCompletedSteps(state, 'genres'),
    }));
  },

  updateGoals: (goals: BookGoals) => {
    set((state: OnboardingState) => ({
      ...state,
      bookGoals: goals,
      completedSteps: updateCompletedSteps(state, 'goals'),
    }));
  },

  updateSchedule: (schedule: ReadingSchedule) => {
    set((state: OnboardingState) => ({
      ...state,
      readingSchedule: schedule,
      completedSteps: updateCompletedSteps(state, 'schedule'),
    }));
  },

  completeOnboarding: () => {
    set((state: OnboardingState) => ({
      ...state,
      isOnboardingComplete: true,
      completedSteps: [...state.completedSteps, 'complete'],
    }));
  },

  resetOnboarding: () => set(INITIAL_STATE),
}));

// Helper function to update completed steps
function updateCompletedSteps(state: OnboardingState, currentStep: StepId): StepId[] {
  if (state.completedSteps.includes(currentStep)) {
    return state.completedSteps;
  }
  return [...state.completedSteps, currentStep];
}

// Helper to get onboarding data for API
export function getOnboardingData(state: OnboardingState) {
  return {
    selectedGenres: state.selectedGenres,
    bookGoals: state.bookGoals,
    readingSchedule: state.readingSchedule,
    isOnboardingComplete: state.isOnboardingComplete,
  };
}
