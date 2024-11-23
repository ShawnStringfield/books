'use client';

import { WelcomeStep } from '@profile-onboarding/components/steps/WelcomeStep';
import { GenresStep } from '@profile-onboarding/components/steps/GenresStep';
import { GoalsStep } from '@profile-onboarding/components/steps/GoalsStep';
import { ScheduleStep } from '@profile-onboarding/components/steps/ScheduleStep';
import { CompleteStep } from '@profile-onboarding/components/steps/CompleteStep';
import { useOnboardingStore, getOnboardingData } from '@profile-onboarding/hooks/useOnboardingStore';
import { useOnboardingMutation } from '@profile-onboarding/hooks/useOnboardingMutation';
import { STEPS } from '@profile-onboarding/constants';
import { StepId } from '@profile-onboarding/types/onboarding';
import { useProgressNavigation, StepValidationRules } from '@components/progress/useProgressNavigation';
import { ProgressWizard } from '@/app/components/progress/ProgressWizard';

const ProfileOnboarding = () => {
  const {
    currentStep,
    progress,
    selectedGenres,
    bookGoals,
    readingSchedule,
    completedSteps,
    updateGenres,
    updateGoals,
    updateSchedule,
    setCurrentStep,
    updateProgress,
    completeOnboarding,
  } = useOnboardingStore();

  const saveOnboarding = useOnboardingMutation();

  // Add validation rules
  const validationRules: StepValidationRules<StepId, ReturnType<typeof useOnboardingStore.getState>> = {
    genres: (state) => state.selectedGenres.length > 0,
    goals: (state) => state.bookGoals.monthlyTarget > 0,
    schedule: (state) =>
      state.readingSchedule.preferences.length > 0 && state.readingSchedule.preferences.every((pref) => pref.daysOfWeek.length > 0),
  };

  // Use the navigation hook
  const { handleStepChange, handleNextStep, handlePreviousStep, isFirstStep, isLastStep } = useProgressNavigation({
    steps: STEPS,
    validationRules,
    onStepChange: (step) => {
      setCurrentStep(step);
      updateProgress(step);
    },
    getCurrentState: useOnboardingStore.getState,
  });

  const handleComplete = async () => {
    const hasNotificationPreferences = readingSchedule.preferences.some((pref) => pref.notifications);

    if (hasNotificationPreferences) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem('readingSchedule', JSON.stringify(readingSchedule));
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    }

    completeOnboarding();
    const onboardingData = getOnboardingData(useOnboardingStore.getState());
    console.log('Submitting onboarding data:', onboardingData);
    saveOnboarding.mutate(onboardingData);
  };

  const STEP_COMPONENTS: Record<StepId, () => JSX.Element> = {
    welcome: () => <WelcomeStep />,
    genres: () => (
      <GenresStep
        selectedGenres={selectedGenres}
        onGenreSelect={(genre) => {
          const newGenres = selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre];
          updateGenres(newGenres);
        }}
      />
    ),
    goals: () => <GoalsStep goals={bookGoals} onGoalsUpdate={updateGoals} />,
    schedule: () => <ScheduleStep schedule={readingSchedule} onScheduleUpdate={updateSchedule} />,
    complete: () => <CompleteStep onDashboardClick={handleComplete} />,
  };

  console.log('rerender');

  const renderStepContent = () => {
    const StepComponent = STEP_COMPONENTS[currentStep];
    return StepComponent ? <StepComponent /> : null;
  };

  return (
    <ProgressWizard
      progress={progress}
      steps={STEPS as StepId[]}
      currentStep={currentStep}
      completedSteps={completedSteps}
      onStepChange={handleStepChange}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      onPreviousStep={handlePreviousStep}
      onNextStep={handleNextStep}
    >
      {renderStepContent()}
    </ProgressWizard>
  );
};

export default ProfileOnboarding;
