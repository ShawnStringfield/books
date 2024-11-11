'use client';

import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { useOnboardingNavigation } from '@/app/(features)/profile-onboarding/hooks/useOnboardingNavigation';
import { STEPS } from '@/lib/onboarding/constants';

const ProfileOnboarding = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStep, handleNextStep, handlePreviousStep, isFirstStep, isLastStep, handleStepChange } = useOnboardingNavigation();
  const { selectedGenres, bookGoals, readingSchedule, completedSteps, progress, updateData } = useOnboardingStore();

  const handleComplete = async () => {
    try {
      const finalData = {
        genres: selectedGenres,
        bookGoals,
        readingSchedule,
      };
      console.log('finalData', finalData);

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

      // Update the completion status
      updateData({
        isOnboardingComplete: true,
      });

      toast({
        title: 'Profile Complete!',
        description: 'Welcome to BookBuddy. Redirecting to your dashboard...',
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete profile setup. Please try again.',
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
            selectedGenres={selectedGenres}
            onGenreSelect={(genre) =>
              updateData({
                selectedGenres: selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre],
              })
            }
          />
        );
      case 'goals':
        return <GoalsStep />;
      case 'schedule':
        return <ScheduleStep />;
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
          <ProgressSteps steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepChange} />
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                {renderStepContent()}
                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={handlePreviousStep} disabled={isFirstStep} className="flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  {!isLastStep && (
                    <Button onClick={handleNextStep} className="flex items-center">
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
