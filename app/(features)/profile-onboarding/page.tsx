'use client';

import { WelcomeStep } from '@profile-onboarding/components/steps/WelcomeStep';
import { GenresStep } from '@profile-onboarding/components/steps/GenresStep';
import { GoalsStep } from '@profile-onboarding/components/steps/GoalsStep';
import { ScheduleStep } from '@profile-onboarding/components/steps/ScheduleStep';
import { CompleteStep } from '@profile-onboarding/components/steps/CompleteStep';
import { useOnboardingStore, getOnboardingData } from '@profile-onboarding/hooks/useOnboardingStore';
import { useOnboardingMutation } from '@profile-onboarding/hooks/useOnboardingMutation';
import { STEPS } from '@profile-onboarding/constants';
import { OnboardingState, StepId } from '@profile-onboarding/types/onboarding';
import { useProgressNavigation, StepValidationRules } from '@components/progress/useProgressNavigation';
import { ProgressWizard } from '@/app/components/progress/ProgressWizard';
import { memo, useCallback, useMemo } from 'react';

// Add this interface
interface GenresStepProps {
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
}

interface GoalsStepProps {
  goals: {
    monthlyTarget: number;
    yearlyTarget: number;
  };
  onGoalsUpdate: (goals: { monthlyTarget: number; yearlyTarget: number }) => void;
}

interface ScheduleStepProps {
  schedule: {
    preferences: Array<{
      daysOfWeek: string[];
      notifications: boolean;
      timeOfDay: string;
    }>;
  };
  onScheduleUpdate: (schedule: {
    preferences: Array<{
      daysOfWeek: string[];
      notifications: boolean;
      timeOfDay: string;
    }>;
  }) => void;
}

// Memoize individual step components
const MemoizedGenresStep = memo(({ selectedGenres, onGenreSelect }: GenresStepProps) => (
  <GenresStep selectedGenres={selectedGenres} onGenreSelect={onGenreSelect} />
));
MemoizedGenresStep.displayName = 'MemoizedGenresStep';

const MemoizedGoalsStep = memo(({ goals, onGoalsUpdate }: GoalsStepProps) => <GoalsStep goals={goals} onGoalsUpdate={onGoalsUpdate} />);
MemoizedGoalsStep.displayName = 'MemoizedGoalsStep';

const MemoizedScheduleStep = memo(({ schedule, onScheduleUpdate }: ScheduleStepProps) => (
  <ScheduleStep schedule={schedule} onScheduleUpdate={onScheduleUpdate} />
));
MemoizedScheduleStep.displayName = 'MemoizedScheduleStep';

// Define selectors outside component to maintain reference stability
const selectCurrentStep = (state: OnboardingState) => state.currentStep;
const selectProgress = (state: OnboardingState) => state.progress;
const selectSelectedGenres = (state: OnboardingState) => state.selectedGenres;
const selectBookGoals = (state: OnboardingState) => state.bookGoals;
const selectReadingSchedule = (state: OnboardingState) => state.readingSchedule;
const selectCompletedSteps = (state: OnboardingState) => state.completedSteps;
const selectUpdateGenres = (state: OnboardingState) => state.updateGenres;
const selectUpdateGoals = (state: OnboardingState) => state.updateGoals;
const selectUpdateSchedule = (state: OnboardingState) => state.updateSchedule;
const selectSetCurrentStep = (state: OnboardingState) => state.setCurrentStep;
const selectUpdateProgress = (state: OnboardingState) => state.updateProgress;
const selectCompleteOnboarding = (state: OnboardingState) => state.completeOnboarding;

const ProfileOnboarding = () => {
  // Use stable selector references
  const currentStep = useOnboardingStore(selectCurrentStep);
  const progress = useOnboardingStore(selectProgress);
  const selectedGenres = useOnboardingStore(selectSelectedGenres);
  const bookGoals = useOnboardingStore(selectBookGoals);
  const readingSchedule = useOnboardingStore(selectReadingSchedule);
  const completedSteps = useOnboardingStore(selectCompletedSteps);
  const updateGenres = useOnboardingStore(selectUpdateGenres);
  const updateGoals = useOnboardingStore(selectUpdateGoals);
  const updateSchedule = useOnboardingStore(selectUpdateSchedule);
  const setCurrentStep = useOnboardingStore(selectSetCurrentStep);
  const updateProgress = useOnboardingStore(selectUpdateProgress);
  const completeOnboarding = useOnboardingStore(selectCompleteOnboarding);

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

  // Memoize handlers
  const handleGenreSelect = useCallback(
    (genre: string) => {
      const newGenres = selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre];
      updateGenres(newGenres);
    },
    [selectedGenres, updateGenres]
  );

  const handleComplete = useCallback(async () => {
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
  }, [readingSchedule, completeOnboarding, saveOnboarding]);

  const STEP_COMPONENTS = useMemo(
    () => ({
      welcome: () => <WelcomeStep />,
      genres: () => <MemoizedGenresStep selectedGenres={selectedGenres} onGenreSelect={handleGenreSelect} />,
      goals: () => <MemoizedGoalsStep goals={bookGoals} onGoalsUpdate={updateGoals} />,
      schedule: () => <MemoizedScheduleStep schedule={readingSchedule} onScheduleUpdate={updateSchedule} />,
      complete: () => <CompleteStep onDashboardClick={handleComplete} />,
    }),
    [selectedGenres, handleGenreSelect, bookGoals, updateGoals, readingSchedule, updateSchedule, handleComplete]
  );

  // Memoize step content rendering
  const stepContent = useMemo(() => {
    const StepComponent = STEP_COMPONENTS[currentStep as keyof typeof STEP_COMPONENTS];
    return StepComponent ? <StepComponent /> : null;
  }, [currentStep, STEP_COMPONENTS]);

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
      {stepContent}
    </ProgressWizard>
  );
};

export default memo(ProfileOnboarding);
