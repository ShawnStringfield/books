import { create } from 'zustand';
import { STEPS } from '@profile-onboarding/constants';
import type { BookGoals, OnboardingStateData, ReadingSchedule, StepId } from '@profile-onboarding/types/onboarding';

// Store interface extends the state and adds methods
interface OnboardingStore extends OnboardingStateData {
  setCurrentStep: (step: StepId) => void;
  updateProgress: (step: StepId) => void;
  updateGenres: (genres: string[]) => void;
  updateGoals: (goals: BookGoals) => void;
  updateSchedule: (schedule: ReadingSchedule) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const INITIAL_STATE: OnboardingStateData = {
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
    set((state: OnboardingStateData) => ({
      ...state,
      selectedGenres: genres,
      completedSteps: updateCompletedSteps(state, 'genres'),
    }));
  },

  updateGoals: (goals: BookGoals) => {
    set((state: OnboardingStateData) => ({
      ...state,
      bookGoals: goals,
      completedSteps: updateCompletedSteps(state, 'goals'),
    }));
  },

  updateSchedule: (schedule: ReadingSchedule) => {
    set((state: OnboardingStateData) => ({
      ...state,
      readingSchedule: schedule,
      completedSteps: updateCompletedSteps(state, 'schedule'),
    }));
  },

  completeOnboarding: () => {
    set((state: OnboardingStateData) => ({
      ...state,
      isOnboardingComplete: true,
      completedSteps: [...state.completedSteps, 'complete'],
    }));
  },

  resetOnboarding: () => set(INITIAL_STATE),
}));

// Helper function to update completed steps
function updateCompletedSteps(state: OnboardingStateData, currentStep: StepId): StepId[] {
  if (state.completedSteps.includes(currentStep)) {
    return state.completedSteps;
  }
  return [...state.completedSteps, currentStep];
}

// Helper to get onboarding data for API
export function getOnboardingData(state: OnboardingStateData) {
  return {
    selectedGenres: state.selectedGenres,
    bookGoals: state.bookGoals,
    readingSchedule: state.readingSchedule,
    isOnboardingComplete: state.isOnboardingComplete,
  };
}

// Add selector hooks for specific state slices
export const useOnboardingStep = () => useOnboardingStore((state) => state.currentStep);
export const useOnboardingProgress = () => useOnboardingStore((state) => state.progress);
export const useSelectedGenres = () => useOnboardingStore((state) => state.selectedGenres);
export const useBookGoals = () => useOnboardingStore((state) => state.bookGoals);
export const useReadingSchedule = () => useOnboardingStore((state) => state.readingSchedule);
export const useOnboardingStatus = () =>
  useOnboardingStore((state) => ({
    isComplete: state.isOnboardingComplete,
    isLoading: state.isLoading,
    error: state.error,
  }));

// Add actions selector
export const useOnboardingActions = () =>
  useOnboardingStore((state) => ({
    setCurrentStep: state.setCurrentStep,
    updateProgress: state.updateProgress,
    updateGenres: state.updateGenres,
    updateGoals: state.updateGoals,
    updateSchedule: state.updateSchedule,
    completeOnboarding: state.completeOnboarding,
    resetOnboarding: state.resetOnboarding,
  }));

// Add this selector
export const useOnboardingCompletedSteps = () => {
  return useOnboardingStore((state) => state.completedSteps);
};

// Add new selector for just the genre update function
const selectGenreUpdater = (state: OnboardingStore) => ({
  updateGenres: state.updateGenres,
  selectedGenres: state.selectedGenres,
});

// Export a custom hook for genre management
export const useGenreManager = () => useOnboardingStore(selectGenreUpdater);
