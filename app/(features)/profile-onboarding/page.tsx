'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useOnboardingStore } from '@/app/(features)/profile-onboarding/hooks/useOnboardingStore';
import { useStepperNavigator } from '@/app/(features)/profile-onboarding/hooks/useStepNavigator';
import { useToast } from '@/hooks/use-toast';
import { validateStep, getValidationMessage } from './validation';

const ProfileOnboarding = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, updateData } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState('welcome');
  const [progress, setProgress] = useState(0);

  const steps = ['welcome', 'genres', 'goals', 'schedule', 'complete'];

  useEffect(() => {
    if (data.isOnboardingComplete) {
      router.push('/dashboard');
    }
  }, [data.isOnboardingComplete, router]);

  const updateProgress = (step: string) => {
    const currentIndex = steps.indexOf(step);
    setProgress((currentIndex / (steps.length - 1)) * 100);
  };

  const { handleStepClick, handleNext } = useStepperNavigator(
    {
      currentStep,
      steps,
      data,
    },
    {
      setCurrentStep,
      updateProgress,
      updateData,
      toast,
    },
    (step) => validateStep(step, data),
    getValidationMessage
  );

  const isStepClickable = (step: string): boolean => {
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);

    // Can always go backwards
    if (stepIndex < currentIndex) return true;

    // Can't skip steps
    if (stepIndex > currentIndex + 1) return false;

    // If moving forward one step, check if current step is valid
    if (stepIndex === currentIndex + 1) {
      return validateStep(currentStep, data);
    }

    // Current step is always clickable
    return stepIndex === currentIndex;
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      setCurrentStep(previousStep);
      updateProgress(previousStep);
    }
  };

  const handleComplete = async () => {
    try {
      updateData({ isOnboardingComplete: true });
      toast({
        title: 'Profile Complete!',
        description: 'Welcome to BookBuddy. Redirecting to your dashboard...',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete profile setup. Please try again.',
        variant: 'destructive',
      });
      console.error('Profile completion error:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'genres':
        return (
          <GenresStep
            selectedGenres={data.selectedGenres}
            onGenreSelect={(genre) =>
              updateData({
                selectedGenres: data.selectedGenres.includes(genre) ? data.selectedGenres.filter((g) => g !== genre) : [...data.selectedGenres, genre],
              })
            }
          />
        );
      case 'goals':
        return <GoalsStep selectedGoal={data.selectedGoal} onGoalSelect={(goalId) => updateData({ selectedGoal: goalId })} />;
      case 'schedule':
        return (
          <ScheduleStep
            selectedTimes={data.selectedTimes}
            onTimeSelect={(timeId) =>
              updateData({
                selectedTimes: data.selectedTimes.includes(timeId) ? data.selectedTimes.filter((t) => t !== timeId) : [...data.selectedTimes, timeId],
              })
            }
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
          <ProgressSteps steps={steps} currentStep={currentStep} completedSteps={data.completedSteps} onStepClick={handleStepClick} isStepClickable={isStepClickable} />
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                {renderStepContent()}
                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={handleBack} disabled={currentStep === 'welcome'} className="flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  {currentStep !== 'complete' && (
                    <Button onClick={handleNext} className="flex items-center">
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
