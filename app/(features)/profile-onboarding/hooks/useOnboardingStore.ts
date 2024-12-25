import { create } from "zustand";
import { STEPS } from "@profile-onboarding/constants";
import type { StepId } from "@profile-onboarding/types/onboarding";

interface OnboardingUIState {
  currentStep: StepId;
  progress: number;
  completedSteps: StepId[];
  isLoading: boolean;
  error: Error | null;
  selectedGenres: string[];
}

interface OnboardingStore extends OnboardingUIState {
  setCurrentStep: (step: StepId) => void;
  updateProgress: (step: StepId) => void;
  markStepCompleted: (step: StepId) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  resetState: () => void;
  handleStepChange: (step: StepId) => void;
  setSelectedGenres: (genres: string[]) => void;
}

const INITIAL_STATE: OnboardingUIState = {
  currentStep: STEPS[0],
  progress: 0,
  completedSteps: [STEPS[0]],
  isLoading: false,
  error: null,
  selectedGenres: [],
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

  markStepCompleted: (step: StepId) => {
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
    }));
  },

  handleStepChange: (step: StepId) => {
    set((state) => {
      const currentIndex = STEPS.indexOf(step);
      const progress = (currentIndex / (STEPS.length - 1)) * 100;
      const completedSteps = state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step];

      return {
        currentStep: step,
        progress,
        completedSteps,
      };
    });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: Error | null) => {
    set({ error });
  },

  resetState: () => {
    set(INITIAL_STATE);
  },

  setSelectedGenres: (genres: string[]) => {
    set({ selectedGenres: genres });
  },
}));

// Individual selectors for UI state
export const useOnboardingStep = () =>
  useOnboardingStore((state) => state.currentStep);
export const useOnboardingProgress = () =>
  useOnboardingStore((state) => state.progress);
export const useCompletedSteps = () =>
  useOnboardingStore((state) => state.completedSteps);
export const useSelectedGenres = () =>
  useOnboardingStore((state) => state.selectedGenres);

// Combined selector with memoized object
export const useOnboardingUI = () => {
  const currentStep = useOnboardingStep();
  const progress = useOnboardingProgress();
  const completedSteps = useCompletedSteps();

  return { currentStep, progress, completedSteps };
};

// Individual status selectors
export const useOnboardingLoading = () =>
  useOnboardingStore((state) => state.isLoading);
export const useOnboardingError = () =>
  useOnboardingStore((state) => state.error);

// Combined status selector
export const useOnboardingStatus = () => {
  const isLoading = useOnboardingLoading();
  const error = useOnboardingError();
  return { isLoading, error };
};

// Individual action selectors
export const useStepChangeAction = () =>
  useOnboardingStore((state) => state.handleStepChange);
export const useResetStateAction = () =>
  useOnboardingStore((state) => state.resetState);

// Combined actions selector
export const useOnboardingActions = () => {
  const handleStepChange = useStepChangeAction();
  const resetState = useResetStateAction();
  return { handleStepChange, resetState };
};
