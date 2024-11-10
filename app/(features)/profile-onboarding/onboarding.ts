export interface OnboardingData {
  selectedGenres: string[];
  selectedGoal: string | null;
  selectedTimes: string[];
  completedSteps: string[];
  isOnboardingComplete: boolean;
}

export type StepValidationResult = {
  isValid: boolean;
  errorTitle?: string;
  errorMessage: string;
};

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
