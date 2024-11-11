import { useCallback } from 'react';
import { STEPS } from '@/lib/onboarding/constants';
import { useOnboardingStore } from '../hooks/useOnboardingStore';
import { useToast } from '@/hooks/use-toast';
import type { StepId } from '../types/onboarding';

export const useOnboardingNavigation = () => {
  const { currentStep, setCurrentStep, updateProgress, updateData } = useOnboardingStore();
  const { toast } = useToast();

  const validateStep = useCallback((step: StepId): boolean => {
    const state = useOnboardingStore.getState();
    switch (step) {
      case 'genres':
        return state.selectedGenres.length > 0;
      case 'goals':
        return !!state.selectedGoal;
      case 'schedule':
        return state.selectedTimes.length > 0;
      default:
        return true;
    }
  }, []);

  const handleStepChange = useCallback(
    (targetStep: StepId) => {
      const currentIndex = STEPS.indexOf(currentStep);
      const targetIndex = STEPS.indexOf(targetStep);

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

      setCurrentStep(targetStep);
      updateProgress(targetStep);
      updateData({});
    },
    [currentStep, setCurrentStep, updateProgress, updateData, toast, validateStep]
  );

  return {
    currentStep,
    handleStepChange,
    isFirstStep: currentStep === STEPS[0],
    isLastStep: currentStep === STEPS[STEPS.length - 1],
    nextStep: () => {
      const nextStepIndex = STEPS.indexOf(currentStep) + 1;
      if (nextStepIndex < STEPS.length) {
        handleStepChange(STEPS[nextStepIndex] as StepId);
      }
    },
    previousStep: () => {
      const prevStepIndex = STEPS.indexOf(currentStep) - 1;
      if (prevStepIndex >= 0) {
        handleStepChange(STEPS[prevStepIndex] as StepId);
      }
    },
  };
};
