import { useMemo } from 'react';
import type { StepperState, StepperCallbacks } from '../onboarding';

const validateStepTransition = (targetStep: string, state: StepperState, validateStep: (step: string) => boolean, getValidationMessage: (step: string) => string) => {
  const { currentStep, steps } = state;
  const targetIndex = steps.indexOf(targetStep);
  const currentIndex = steps.indexOf(currentStep);

  if (targetIndex > currentIndex) {
    if (!validateStep(currentStep)) {
      return {
        isValid: false,
        errorTitle: 'Incomplete Step',
        errorMessage: getValidationMessage(currentStep),
      };
    }

    if (targetIndex > currentIndex + 1) {
      return {
        isValid: false,
        errorTitle: 'Cannot Skip Steps',
        errorMessage: 'Please complete the steps in order',
      };
    }
  }

  return { isValid: true, errorMessage: '' };
};

const handleStepTransition = (targetStep: string, state: StepperState, callbacks: StepperCallbacks) => {
  const { currentStep, steps, data } = state;
  const { setCurrentStep, updateProgress, updateData } = callbacks;
  const targetIndex = steps.indexOf(targetStep);
  const currentIndex = steps.indexOf(currentStep);

  setCurrentStep(targetStep);
  updateProgress(targetStep);

  if (targetIndex > currentIndex && !data.completedSteps.includes(currentStep)) {
    updateData({
      completedSteps: [...data.completedSteps, currentStep],
    });
  }
};

export const useStepperNavigator = (state: StepperState, callbacks: StepperCallbacks, validateStep: (step: string) => boolean, getValidationMessage: (step: string) => string) => {
  return useMemo(
    () => ({
      handleStepClick: (step: string) => {
        const validationResult = validateStepTransition(step, state, validateStep, getValidationMessage);

        if (!validationResult.isValid) {
          callbacks.toast({
            title: validationResult.errorTitle || 'Error',
            description: validationResult.errorMessage,
            variant: 'destructive',
          });
          return;
        }

        handleStepTransition(step, state, callbacks);
      },

      handleNext: () => {
        const { currentStep, steps } = state;
        const currentIndex = steps.indexOf(currentStep);

        if (currentIndex >= steps.length - 1) return;

        const nextStep = steps[currentIndex + 1];
        const validationResult = validateStepTransition(nextStep, state, validateStep, getValidationMessage);

        if (!validationResult.isValid) {
          callbacks.toast({
            title: validationResult.errorTitle || 'Error',
            description: validationResult.errorMessage,
            variant: 'destructive',
          });
          return;
        }

        handleStepTransition(nextStep, state, callbacks);
      },
    }),
    [state, callbacks, validateStep, getValidationMessage]
  );
};
