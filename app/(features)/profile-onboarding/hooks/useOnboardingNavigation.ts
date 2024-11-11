import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export type StepValidationRules<TStep extends string, TState> = Partial<Record<TStep, (state: TState) => boolean>>;

interface OnboardingNavigationConfig<TStep extends string, TState> {
  steps: TStep[];
  validationRules?: StepValidationRules<TStep, TState>;
  onStepChange?: (step: TStep) => void;
  getCurrentState: () => TState;
}

export function useOnboardingNavigation<TStep extends string, TState extends { currentStep: TStep }>({ steps, validationRules = {}, onStepChange, getCurrentState }: OnboardingNavigationConfig<TStep, TState>) {
  const { toast } = useToast();
  const currentStep = getCurrentState().currentStep;

  const validateStep = useCallback(
    (step: TStep): boolean => {
      const validator = validationRules[step];
      if (!validator) return true;

      const state = getCurrentState();
      return validator(state);
    },
    [validationRules, getCurrentState]
  );

  const handleStepChange = useCallback(
    (targetStep: TStep) => {
      const currentIndex = steps.indexOf(currentStep);
      const targetIndex = steps.indexOf(targetStep);

      // Don't allow skipping steps
      if (targetIndex > currentIndex + 1) {
        return;
      }

      // Validate current step when moving forward
      if (targetIndex > currentIndex && !validateStep(currentStep)) {
        toast({
          title: 'Please complete this step',
          description: 'Fill in all required information before proceeding.',
          variant: 'destructive',
        });
        return;
      }

      onStepChange?.(targetStep);
    },
    [currentStep, steps, validateStep, toast, onStepChange]
  );

  const handleNextStep = useCallback(() => {
    const nextStepIndex = steps.indexOf(currentStep) + 1;
    if (nextStepIndex < steps.length) {
      handleStepChange(steps[nextStepIndex]);
    }
  }, [currentStep, steps, handleStepChange]);

  const handlePreviousStep = useCallback(() => {
    const prevStepIndex = steps.indexOf(currentStep) - 1;
    if (prevStepIndex >= 0) {
      handleStepChange(steps[prevStepIndex]);
    }
  }, [currentStep, steps, handleStepChange]);

  return {
    currentStep,
    handleStepChange,
    handleNextStep,
    handlePreviousStep,
    isFirstStep: currentStep === steps[0],
    isLastStep: currentStep === steps[steps.length - 1],
  };
}
