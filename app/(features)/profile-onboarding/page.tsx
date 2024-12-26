"use client";

import { useEffect } from "react";
import { WelcomeStep } from "@profile-onboarding/components/steps/WelcomeStep";
import { GenresStep } from "@profile-onboarding/components/steps/GenresStep";
import { GoalsStep } from "@profile-onboarding/components/steps/GoalsStep";
import { ScheduleStep } from "@profile-onboarding/components/steps/ScheduleStep";
import { CompleteStep } from "@profile-onboarding/components/steps/CompleteStep";
import {
  useOnboardingUI,
  useOnboardingActions,
} from "@profile-onboarding/hooks/useOnboardingStore";
import { useOnboardingData } from "@profile-onboarding/hooks/useOnboardingData";
import { STEPS } from "@profile-onboarding/constants";
import {
  StepId,
  OnboardingData,
  ReadingPreference,
} from "@profile-onboarding/types/onboarding";
import {
  useProgressNavigation,
  StepValidationRules,
} from "@/app/components/progress/useProgressNavigation";
import { ProgressWizard } from "@/app/components/progress/ProgressWizard";
import { memo, useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSettingsStore } from "@/app/(features)/dashboard/settings/hooks/useSettingsStore";

interface OnboardingState {
  currentStep: StepId;
  formData: OnboardingData;
}

const DEFAULT_FORM_DATA: OnboardingData = {
  selectedGenres: [],
  bookGoals: { monthlyTarget: 2, yearlyTarget: 24 },
  readingSchedule: { preferences: [] },
  isOnboardingComplete: false,
};

const ProfileOnboarding = () => {
  // UI State from store
  const { currentStep, progress, completedSteps } = useOnboardingUI();
  const { handleStepChange } = useOnboardingActions();

  // Local form state
  const [formData, setFormData] = useState<OnboardingData>(DEFAULT_FORM_DATA);

  // Server mutation
  const { saveData, isSaving, existingData, isLoadingData } =
    useOnboardingData();

  const updateReadingGoals = useSettingsStore(
    (state) => state.updateReadingGoals
  );

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  // Validation rules
  const validationRules = useMemo<StepValidationRules<StepId, OnboardingState>>(
    () => ({
      genres: (state) => state.formData.selectedGenres.length > 0,
      goals: (state) => state.formData.bookGoals.monthlyTarget > 0,
      schedule: (state) =>
        state.formData.readingSchedule.preferences.length > 0 &&
        state.formData.readingSchedule.preferences.every(
          (pref: ReadingPreference) => pref.daysOfWeek.length > 0
        ),
    }),
    []
  );

  // Get current state for validation
  const getCurrentState = useCallback(
    () => ({
      currentStep,
      formData,
    }),
    [currentStep, formData]
  );

  // Navigation handlers
  const handleProgressStepChange = useCallback(
    (step: StepId) => {
      if (step !== currentStep) {
        handleStepChange(step);
      }
    },
    [currentStep, handleStepChange]
  );

  const { handleNextStep, handlePreviousStep, isFirstStep, isLastStep } =
    useProgressNavigation({
      steps: STEPS,
      validationRules,
      onStepChange: handleProgressStepChange,
      getCurrentState,
    });

  // Form update handlers
  const handleGenreSelect = useCallback((genre: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter((g) => g !== genre)
        : [...prev.selectedGenres, genre],
    }));
  }, []);

  const handleGoalsUpdate = useCallback(
    (goals: OnboardingData["bookGoals"]) => {
      setFormData((prev) => ({ ...prev, bookGoals: goals }));
    },
    []
  );

  const handleScheduleUpdate = useCallback(
    (schedule: OnboardingData["readingSchedule"]) => {
      setFormData((prev) => ({ ...prev, readingSchedule: schedule }));
    },
    []
  );

  const handleComplete = useCallback(async () => {
    const hasNotificationPreferences =
      formData.readingSchedule.preferences.some(
        (pref: ReadingPreference) => pref.notifications
      );

    if (hasNotificationPreferences) {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }

    // Update settings store with reading goals
    updateReadingGoals(formData.bookGoals);

    // Save to backend
    saveData({ ...formData, isOnboardingComplete: true });
  }, [formData, saveData, updateReadingGoals]);

  // Step Components
  const STEP_COMPONENTS = useMemo(
    () => ({
      welcome: () => <WelcomeStep />,
      genres: () => (
        <GenresStep
          selectedGenres={formData.selectedGenres}
          onGenreSelect={handleGenreSelect}
        />
      ),
      goals: () => (
        <GoalsStep
          goals={formData.bookGoals}
          onGoalsUpdate={handleGoalsUpdate}
        />
      ),
      schedule: () => (
        <ScheduleStep
          schedule={formData.readingSchedule}
          onScheduleUpdate={handleScheduleUpdate}
        />
      ),
      complete: () => <CompleteStep onDashboardClick={handleComplete} />,
    }),
    [
      formData.selectedGenres,
      formData.bookGoals,
      formData.readingSchedule,
      handleGenreSelect,
      handleGoalsUpdate,
      handleScheduleUpdate,
      handleComplete,
    ]
  );

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProgressWizard
      progress={progress}
      steps={STEPS}
      currentStep={currentStep}
      completedSteps={completedSteps}
      onStepChange={handleProgressStepChange}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      onPreviousStep={handlePreviousStep}
      onNextStep={handleNextStep}
      isLoading={isSaving}
    >
      {STEP_COMPONENTS[currentStep as keyof typeof STEP_COMPONENTS]?.()}
    </ProgressWizard>
  );
};

export default memo(ProfileOnboarding);
