import { STEPS } from '@/lib/onboarding/constants';

export type StepId = (typeof STEPS)[number];

export interface OnboardingData {
  selectedGenres: string[];
  bookGoals: BookGoals;
  readingSchedule: ReadingSchedule;
  completedSteps: StepId[];
  isOnboardingComplete: boolean;
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

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ReadingTimePreference {
  time: string; // 24-hour format HH:mm
  daysOfWeek: DayOfWeek[];
  duration: number; // in minutes
  notifications: boolean;
}

export interface ReadingSchedule {
  preferences: ReadingTimePreference[];
}

export interface BookGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

export interface ReadingGoals {
  books: {
    monthlyTarget: number;
    yearlyTarget: number;
  };
  readingTime: {
    weeklyTarget: number; // in minutes
    dailyTarget: number; // in minutes
    preferences: ReadingTimePreference[];
  };
}
