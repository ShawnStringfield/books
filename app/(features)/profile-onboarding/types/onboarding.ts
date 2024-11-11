import { STEPS } from '@/lib/onboarding/constants';

export type StepId = (typeof STEPS)[number];

export interface OnboardingData {
  selectedGenres: string[];
  selectedGoal: string | null;
  selectedTimes: string[];
  completedSteps: StepId[];
}

export interface OnboardingState extends OnboardingData {
  currentStep: StepId;
  progress: number;
  isLoading: boolean;
  error: Error | null;
}

export type StepperState = {
  currentStep: string;
  steps: string[];
  data: { completedSteps: string[] };
};

export type ToastProps = {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
};

export type StepperCallbacks = {
  setCurrentStep: (step: string) => void;
  updateProgress: (step: string) => void;
  updateData: (data: { completedSteps: string[] }) => void;
  toast: (props: ToastProps) => void;
};
