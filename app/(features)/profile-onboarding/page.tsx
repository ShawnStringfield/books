'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatedProgress } from '@/app/(features)/profile-onboarding/components/AnimatedProgress';
import { ProgressSteps } from '@/app/(features)/profile-onboarding/components/steps/ProgressSteps';
import { WelcomeStep } from '@/app/(features)/profile-onboarding/components/steps/WelcomeStep';
import { GenresStep } from '@/app/(features)/profile-onboarding/components/steps/GenresStep';
import { GoalsStep } from '@/app/(features)/profile-onboarding/components/steps/GoalsStep';
import { ScheduleStep } from '@/app/(features)/profile-onboarding/components/steps/ScheduleStep';
import { CompleteStep } from '@/app/(features)/profile-onboarding/components/steps/CompleteStep';
import { containerVariants } from '@/app/(features)/profile-onboarding/components/_animations';
import {
  useOnboardingStore,
  getOnboardingData,
} from '@/app/(features)/profile-onboarding/hooks/useOnboardingStore';
import { useOnboardingMutation } from '@/app/(features)/profile-onboarding/hooks/useOnboardingMutation';
import { STEPS } from '@/app/(features)/profile-onboarding/constants';
import { StepId } from './types/onboarding';

const ProfileOnboarding = () => {
  const { toast } = useToast();
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

  const isFirstStep = currentStep === STEPS[0];
  const isLastStep = currentStep === STEPS[STEPS.length - 1];

  const validateStep = (step: StepId): boolean => {
    switch (step) {
      case 'genres':
        return selectedGenres.length > 0;
      case 'goals':
        return bookGoals.monthlyTarget > 0;
      case 'schedule':
        return (
          readingSchedule.preferences.length > 0 &&
          readingSchedule.preferences.every(
            (pref) => pref.daysOfWeek.length > 0
          )
        );
      default:
        return true;
    }
  };

  const handleStepChange = (targetStep: StepId) => {
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
  };

  const handleNextStep = () => {
    const nextStepIndex = STEPS.indexOf(currentStep) + 1;
    if (nextStepIndex < STEPS.length) {
      handleStepChange(STEPS[nextStepIndex] as StepId);
    }
  };

  const handlePreviousStep = () => {
    const prevStepIndex = STEPS.indexOf(currentStep) - 1;
    if (prevStepIndex >= 0) {
      handleStepChange(STEPS[prevStepIndex] as StepId);
    }
  };

  const handleComplete = async () => {
    const hasNotificationPreferences = readingSchedule.preferences.some(
      (pref) => pref.notifications
    );

    if (hasNotificationPreferences) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem(
            'readingSchedule',
            JSON.stringify(readingSchedule)
          );
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'genres':
        return (
          <GenresStep
            selectedGenres={selectedGenres}
            onGenreSelect={(genre) => {
              const newGenres = selectedGenres.includes(genre)
                ? selectedGenres.filter((g) => g !== genre)
                : [...selectedGenres, genre];
              updateGenres(newGenres);
            }}
          />
        );
      case 'goals':
        return <GoalsStep goals={bookGoals} onGoalsUpdate={updateGoals} />;
      case 'schedule':
        return (
          <ScheduleStep
            schedule={readingSchedule}
            onScheduleUpdate={updateSchedule}
          />
        );
      case 'complete':
        return <CompleteStep onDashboardClick={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 space-y-2">
          <AnimatedProgress value={progress} />
          <ProgressSteps
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepChange}
          />
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {renderStepContent()}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={handlePreviousStep}
                    disabled={isFirstStep}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  {!isLastStep && (
                    <Button
                      onClick={handleNextStep}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOnboarding;
