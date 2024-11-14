import { z } from 'zod';
import { STEPS } from '@/app/(features)/profile-onboarding/constants';

export type StepId = (typeof STEPS)[number];

export const userPreferencesSchema = z.object({
  selectedGenres: z.array(z.string()),
  bookGoals: z.object({
    monthlyTarget: z.number().min(1),
    yearlyTarget: z.number().min(1),
  }),
  readingSchedule: z.object({
    preferences: z.array(
      z.object({
        daysOfWeek: z.array(z.string()),
        timeOfDay: z.string(),
        notifications: z.boolean(),
      })
    ),
  }),
  isOnboardingComplete: z.boolean(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export interface OnboardingState {
  currentStep: StepId;
  progress: number;
  formData: UserPreferences;
  completedSteps: StepId[];
  isLoading: boolean;
  error: Error | null;
}

export interface OnboardingResponse {
  success: boolean;
  data?: UserPreferences;
  error?: string;
}

export type StepperState = {
  currentStep: string;
  steps: string[];
  data: { completedSteps: string[] };
};
export type StepValidationRules<TStep extends string, TState> = Partial<Record<TStep, (state: TState) => boolean>>;

export interface OnboardingNavigationConfig<TStep extends string, TState> {
  steps: TStep[];
  validationRules?: StepValidationRules<TStep, TState>;
  onStepChange?: (step: TStep) => void;
  getCurrentState: () => TState;
}

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
